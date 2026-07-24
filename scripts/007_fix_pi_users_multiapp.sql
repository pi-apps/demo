-- =============================================================
-- SCRIPT 007 — Fix pi_users UNIQUE constraint per multi-app
-- =============================================================
-- Problema: pi_users ha UNIQUE(pi_uid) — se lo stesso utente Pi
-- accede a piu' app (app_pionieri, chat_pionieri, marketplace,
-- chat_bot_develop), l'upsert sovrascrive il record unico
-- aggiornando anche app_source con l'ultima app usata.
--
-- Fix: cambiare il constraint in UNIQUE(pi_uid, app_source)
-- cosi' ogni utente ha un record separato per ogni app.
--
-- IMPORTANTE: eseguire DOPO lo script 005 (banned_users) che
-- ha gia' applicato lo stesso pattern.
-- =============================================================

-- 1. Aggiunge colonna app_source a pi_users se non esiste ancora
ALTER TABLE public.pi_users
  ADD COLUMN IF NOT EXISTS app_source TEXT NOT NULL DEFAULT 'app_pionieri';

-- 2. Rimuove il vecchio constraint UNIQUE su pi_uid (solo se esiste)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pi_users_pi_uid_key'
      AND conrelid = 'public.pi_users'::regclass
  ) THEN
    ALTER TABLE public.pi_users DROP CONSTRAINT pi_users_pi_uid_key;
  END IF;
END $$;

-- 3. Rimuove eventuali altri constraint unique su pi_uid con nome diverso
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.pi_users'::regclass
      AND contype = 'u'
      AND conname NOT LIKE '%pi_uid_app_source%'
      AND pg_get_constraintdef(oid) LIKE '%pi_uid%'
      AND pg_get_constraintdef(oid) NOT LIKE '%app_source%'
  LOOP
    EXECUTE 'ALTER TABLE public.pi_users DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- 4. Aggiunge il nuovo constraint UNIQUE(pi_uid, app_source)
ALTER TABLE public.pi_users
  ADD CONSTRAINT pi_users_pi_uid_app_source_key
  UNIQUE (pi_uid, app_source);

-- 5. Aggiorna i record esistenti che hanno app_source vuoto o DEFAULT sbagliato
UPDATE public.pi_users
  SET app_source = 'app_pionieri'
  WHERE app_source IS NULL OR app_source = '';

-- 6. Indici per performance
CREATE INDEX IF NOT EXISTS idx_pi_users_pi_uid_app
  ON public.pi_users(pi_uid, app_source);

CREATE INDEX IF NOT EXISTS idx_pi_users_app_source
  ON public.pi_users(app_source);

-- 7. Verifica finale — mostra la struttura aggiornata
-- (commentata per sicurezza, decommentare se si vuole vedere il risultato)
-- SELECT conname, pg_get_constraintdef(oid) as definition
-- FROM pg_constraint
-- WHERE conrelid = 'public.pi_users'::regclass
-- ORDER BY contype;
