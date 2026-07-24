-- Fix colonne messages: allineare nomi DB con il codice TypeScript
-- Problema 1: script 003 ha aggiunto media_url + media_type
--             ma il codice usa image_url + audio_url
-- Problema 2: access_logs usa created_at nel DB (script 002)
--             ma script 004 e alcuni riferimenti usano logged_at
--
-- NOTA: Non eliminiamo le colonne vecchie per non perdere dati esistenti.
--       Aggiungiamo le colonne corrette e migriam i dati.

-- ============================================================
-- PARTE 1: Tabella messages — colonne media corrette
-- ============================================================

-- Aggiunge image_url (usata dal codice per immagini)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Aggiunge audio_url (usata dal codice per audio/vocali)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Migra dati da media_url a image_url (se media_type = 'image')
UPDATE public.messages
  SET image_url = media_url
  WHERE media_url IS NOT NULL
    AND media_type = 'image'
    AND image_url IS NULL;

-- Migra dati da media_url a audio_url (se media_type = 'audio')
UPDATE public.messages
  SET audio_url = media_url
  WHERE media_url IS NOT NULL
    AND media_type = 'audio'
    AND audio_url IS NULL;

-- Aggiunge indice per ricerche sui messaggi con media
CREATE INDEX IF NOT EXISTS idx_messages_image_url ON public.messages(image_url)
  WHERE image_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_messages_audio_url ON public.messages(audio_url)
  WHERE audio_url IS NOT NULL;

-- ============================================================
-- PARTE 2: Tabella access_logs — aggiungere logged_at come alias
-- ============================================================

-- La colonna created_at esiste gia' (script 002).
-- Aggiungiamo logged_at come colonna generata per compatibilita' con
-- eventuali query future o strumenti admin che usano logged_at.
-- Il codice TypeScript e' gia' stato aggiornato per usare created_at.

-- Aggiunge logged_at come colonna generata (alias di created_at)
-- NOTA: PostgreSQL non supporta colonne generate da altre colonne non immutable,
--       quindi aggiungiamo logged_at come colonna normale e la sincronizziamo.
ALTER TABLE public.access_logs
  ADD COLUMN IF NOT EXISTS logged_at TIMESTAMPTZ;

-- Popola logged_at con il valore di created_at per i record esistenti
UPDATE public.access_logs
  SET logged_at = created_at
  WHERE logged_at IS NULL;

-- Crea un trigger per mantenere logged_at sincronizzato con created_at in insert futuri
CREATE OR REPLACE FUNCTION public.sync_access_logs_logged_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.logged_at := NEW.created_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_access_logs_logged_at ON public.access_logs;

CREATE TRIGGER trg_sync_access_logs_logged_at
  BEFORE INSERT ON public.access_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_access_logs_logged_at();

-- Aggiorna l'indice su access_logs per includere logged_at
CREATE INDEX IF NOT EXISTS idx_access_logs_logged_at ON public.access_logs(logged_at DESC);

-- ============================================================
-- PARTE 3: Aggiornare indice composito in script 004
-- (logged_at ora esiste, l'indice idx_access_logs_app_logged puo' essere creato)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_access_logs_app_logged
  ON public.access_logs(app_source, logged_at DESC);

-- Verifica finale
DO $$
BEGIN
  RAISE NOTICE 'Script 006 completato:';
  RAISE NOTICE '  - messages.image_url: aggiunta colonna';
  RAISE NOTICE '  - messages.audio_url: aggiunta colonna';
  RAISE NOTICE '  - messages: migrazione dati da media_url a image_url/audio_url';
  RAISE NOTICE '  - access_logs.logged_at: aggiunta colonna + trigger di sincronizzazione';
END $$;
