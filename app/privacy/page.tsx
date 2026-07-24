"use client"

import { useState } from "react"
import Link from "next/link"

// Privacy Policy page for App Pionieri
export default function PrivacyPolicy() {
  const [lang, setLang] = useState<"it" | "en">("it")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Link href="/auth/login" className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
          Indietro
        </Link>
        <h1 className="text-lg font-bold text-foreground">Privacy Policy</h1>
        <button
          onClick={() => setLang(lang === "it" ? "en" : "it")}
          className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground"
        >
          {lang === "it" ? "EN" : "IT"}
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {lang === "it" ? (
          <div className="space-y-6 text-sm leading-relaxed text-foreground">
            <p className="text-xs text-muted-foreground">Ultimo aggiornamento: 27 Febbraio 2026</p>

            <section>
              <h2 className="mb-2 text-base font-bold">1. Sviluppatore</h2>
              <p>Questa app e sviluppata da <strong>Diego Generali</strong>.</p>
              <p>Per supporto o domande: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">2. Dati Raccolti</h2>
              <p>Raccogliamo esclusivamente i seguenti dati tramite Pi Network:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Username Pi Network</li>
                <li>UID Pi Network (identificatore univoco)</li>
                <li>Messaggi di testo inviati nella chat</li>
                <li>Immagini inviate nella chat</li>
                <li>Data e ora dei messaggi</li>
                <li>Informazioni sulle transazioni Pi</li>
              </ul>
              <p className="mt-2">Non raccogliamo dati personali aggiuntivi come email, numero di telefono o posizione geografica.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">3. Utilizzo dei Dati</h2>
              <p>I dati raccolti sono utilizzati esclusivamente per:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>{"Autenticazione e accesso all'app"}</li>
                <li>Visualizzazione dei messaggi nella chat pubblica</li>
                <li>Gestione delle donazioni Pi volontarie</li>
                <li>Moderazione della community (solo amministratore)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">4. Condivisione dei Dati</h2>
              <p>{"Non vendiamo, scambiamo o cediamo i tuoi dati a terze parti. I dati possono essere condivisi solo con Pi Network per l'autenticazione e l'elaborazione dei pagamenti."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">5. Conservazione dei Dati</h2>
              <p>{"I messaggi e le immagini vengono conservati nel database dell'app. L'amministratore puo eliminare messaggi per motivi di moderazione."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">6. Sicurezza</h2>
              <p>Adottiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati, inclusa la crittografia dei dati in transito tramite HTTPS.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">{"7. Diritti dell'Utente"}</h2>
              <p>{"Hai il diritto di richiedere l'accesso, la modifica o la cancellazione dei tuoi dati in qualsiasi momento contattando lo sviluppatore."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">8. Pagamenti</h2>
              <p>Le donazioni sono completamente volontarie e vengono elaborate tramite Pi Network SDK. Non memorizziamo dati di pagamento sensibili.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">9. Contatti</h2>
              <p>Per qualsiasi domanda sulla privacy, contatta:</p>
              <p><strong>Diego Generali</strong></p>
              <p>Email: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-sm leading-relaxed text-foreground">
            <p className="text-xs text-muted-foreground">Last updated: February 27, 2026</p>

            <section>
              <h2 className="mb-2 text-base font-bold">1. Developer</h2>
              <p>This app is developed by <strong>Diego Generali</strong>.</p>
              <p>For support or questions: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">2. Data Collected</h2>
              <p>We only collect the following data through Pi Network:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Pi Network username</li>
                <li>Pi Network UID (unique identifier)</li>
                <li>Text messages sent in the chat</li>
                <li>Images sent in the chat</li>
                <li>Date and time of messages</li>
                <li>Information about Pi transactions</li>
              </ul>
              <p className="mt-2">We do not collect additional personal data such as email, phone number, or geographic location.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">3. Use of Data</h2>
              <p>Collected data is used exclusively for:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Authentication and app access</li>
                <li>Displaying messages in the public chat</li>
                <li>Managing voluntary Pi donations</li>
                <li>Community moderation (admin only)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">4. Data Sharing</h2>
              <p>We do not sell, trade, or transfer your data to third parties. Data may only be shared with Pi Network for authentication and payment processing.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">5. Data Retention</h2>
              <p>Messages and images are stored in the app database. The administrator can delete messages for moderation purposes.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">6. Security</h2>
              <p>We implement appropriate security measures to protect your data, including encrypted communications via HTTPS.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">7. User Rights</h2>
              <p>You have the right to request access, modification, or deletion of your data at any time by contacting the developer.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">8. Payments</h2>
              <p>Donations are completely voluntary and are processed through Pi Network SDK. We do not store sensitive payment data.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">9. Contact</h2>
              <p>For any privacy questions, contact:</p>
              <p><strong>Diego Generali</strong></p>
              <p>Email: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
