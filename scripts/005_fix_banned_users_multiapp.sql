-- Fix: banned_users UNIQUE constraint per supporto multi-app
-- Problema: il UNIQUE su pi_uid impedisce di bannare lo stesso utente su app diverse
-- Fix: sostituire UNIQUE(pi_uid) con UNIQUE(pi_uid, app_source)
-- 
-- Questo permette che lo stesso pi_uid sia bannato in app_pionieri MA non in chat_pionieri
-- (ogni app gestisce i propri ban in modo completamente indipendente)

-- Step 1: Aggiungere la colonna app_source se non esiste ancora (nel caso in cui lo script 004 non sia stato eseguito)
ALTER TABLE public.banned_users
  ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'app_pionieri';

-- Step 2: Rimuovere il vecchio UNIQUE constraint su pi_uid
-- Il nome del constraint può variare, gestiamo entrambe le possibilita'
DO $$
BEGIN
  -- Rimuovi constraint named "banned_users_pi_uid_key" (nome auto-generato da PostgreSQL)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'banned_users_pi_uid_key'
      AND conrelid = 'public.banned_users'::regclass
  ) THEN
    ALTER TABLE public.banned_users DROP CONSTRAINT banned_users_pi_uid_key;
  END IF;

  -- Rimuovi eventuali altri constraint UNIQUE su solo pi_uid
  DECLARE
    v_constraint_name text;
  BEGIN
    FOR v_constraint_name IN
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'public.banned_users'::regclass
        AND contype = 'u'
        AND array_length(conkey, 1) = 1
        AND conkey[1] = (
          SELECT attnum FROM pg_attribute
          WHERE attrelid = 'public.banned_users'::regclass
            AND attname = 'pi_uid'
        )
    LOOP
      EXECUTE 'ALTER TABLE public.banned_users DROP CONSTRAINT ' || quote_ident(v_constraint_name);
    END LOOP;
  END;
END $$;

-- Step 3: Creare il nuovo UNIQUE composito su (pi_uid, app_source)
-- Questo e' il comportamento corretto: un utente puo' essere bannato separatamente per ogni app
CREATE UNIQUE INDEX IF NOT EXISTS banned_users_uid_app_unique
  ON public.banned_users(pi_uid, app_source);

-- Step 4: Aggiungere anche index singolo su app_source per le query di filtraggio
CREATE INDEX IF NOT EXISTS idx_banned_users_app_source
  ON public.banned_users(app_source);

-- Step 5: Assicurarsi che i record esistenti abbiano app_source valorizzato
UPDATE public.banned_users
  SET app_source = 'app_pionieri'
  WHERE app_source IS NULL OR app_source = '';

-- Verifica finale
DO $$
DECLARE
  v_index_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'banned_users'
      AND indexname = 'banned_users_uid_app_unique'
  ) INTO v_index_exists;

  IF v_index_exists THEN
    RAISE NOTICE 'OK: Indice composito banned_users_uid_app_unique creato correttamente.';
  ELSE
    RAISE WARNING 'ATTENZIONE: Indice composito non trovato. Verificare manualmente.';
  END IF;
END $$;
