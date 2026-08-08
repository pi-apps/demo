"use client"

import { useState } from "react"
import Link from "next/link"

export default function TermsOfService() {
  const [lang, setLang] = useState<"it" | "en">("it")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Link href="/auth/login" className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
          Indietro
        </Link>
        <h1 className="text-lg font-bold text-foreground">
          {lang === "it" ? "Termini di Servizio" : "Terms of Service"}
        </h1>
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
              <p>Per supporto: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">2. Accettazione dei Termini</h2>
              <p>{"Utilizzando App Pionieri (\"l'App\"), accetti di essere vincolato da questi Termini di Servizio. Se non accetti questi termini, ti preghiamo di non utilizzare l'app."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">3. Descrizione del Servizio</h2>
              <p>App Pionieri offre una piattaforma di messaggistica per i Pionieri di Pi Network con KYC approvato e migrazione al Mainnet completata. Il servizio include chat in tempo reale, invio di immagini e la possibilita di effettuare donazioni tramite Pi.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">4. Requisiti di Accesso</h2>
              <ul className="ml-4 list-disc space-y-1">
                <li>Account Pi Network attivo e verificato</li>
                <li>KYC approvato su Pi Network</li>
                <li>Prima migrazione al Mainnet completata</li>
                <li>Accesso tramite Pi Browser</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">5. Regole di Condotta</h2>
              <p>Gli utenti si impegnano a:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Non inviare messaggi offensivi, volgari o discriminatori</li>
                <li>Non fare spam o inviare contenuti pubblicitari non autorizzati</li>
                <li>Non inviare immagini inappropriate o offensive</li>
                <li>Non tentare di compromettere la sicurezza dell'app</li>
                <li>Rispettare gli altri utenti della community</li>
                <li>Non condividere informazioni personali di altri utenti</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">6. Moderazione</h2>
              <p>{"L'amministratore si riserva il diritto di eliminare messaggi e bannare utenti che violano le regole di condotta. Le decisioni di moderazione sono insindacabili."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">7. Donazioni</h2>
              <p>Le donazioni in Pi sono volontarie e non obbligatorie. Una volta effettuata, la donazione non e rimborsabile. Le donazioni vengono utilizzate per il supporto e l'aggiornamento dell'app.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">8. Limitazione di Responsabilita</h2>
              <p>{"L'app viene fornita \"cosi com'e\", senza garanzie di alcun tipo. Lo sviluppatore non e responsabile per eventuali danni derivanti dall'uso dell'app."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">9. Contatti</h2>
              <p>Per qualsiasi domanda sui termini di servizio, contatta:</p>
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
              <p>For support: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">2. Acceptance of Terms</h2>
              <p>{"By using App Pionieri (\"the App\"), you agree to be bound by these Terms of Service. If you do not accept these terms, please do not use the app."}</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">3. Service Description</h2>
              <p>App Pionieri provides a messaging platform for Pi Network Pioneers with approved KYC and completed Mainnet migration. The service includes real-time chat, image sharing, and the ability to make donations via Pi.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">4. Access Requirements</h2>
              <ul className="ml-4 list-disc space-y-1">
                <li>Active and verified Pi Network account</li>
                <li>Approved KYC on Pi Network</li>
                <li>First Mainnet migration completed</li>
                <li>Access via Pi Browser</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">5. Code of Conduct</h2>
              <p>Users agree to:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Not send offensive, vulgar, or discriminatory messages</li>
                <li>Not spam or send unauthorized advertising content</li>
                <li>Not send inappropriate or offensive images</li>
                <li>Not attempt to compromise the app security</li>
                <li>Respect other community members</li>
                <li>Not share other users personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">6. Moderation</h2>
              <p>The administrator reserves the right to delete messages and ban users who violate the code of conduct. Moderation decisions are final.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">7. Donations</h2>
              <p>Pi donations are voluntary and not mandatory. Once made, donations are non-refundable. Donations are used for app support and updates.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">8. Limitation of Liability</h2>
              <p>The app is provided "as is", without warranties of any kind. The developer is not responsible for any damages arising from the use of the app.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold">9. Contact</h2>
              <p>For any questions about the terms of service, contact:</p>
              <p><strong>Diego Generali</strong></p>
              <p>Email: <a href="mailto:diegogenerali2@gmail.com" className="text-primary underline">diegogenerali2@gmail.com</a></p>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
