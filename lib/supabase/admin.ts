import { createClient } from "@supabase/supabase-js"

// Identificatore univoco per questa app - usato per separare i dati nel database
// Le 4 app nel database sono: app_pionieri, chat_pionieri, marketplace, chat_bot_develop
export const APP_SOURCE = "app_pionieri"

// Admin username per questa app
export const ADMIN_USERNAME = "cipollas"

export function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
