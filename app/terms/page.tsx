"use client"

import { useState } from "react"

export default function TermsOfService() {
  const [lang, setLang] = useState<"it" | "en">("it")

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {lang === "it" ? "Termini di Servizio" : "Terms of Service"}
          </h1>
          <button
            onClick={() => setLang(lang === "it" ? "en" : "it")}
            className="rounded-lg border border-border px-3 py-1 text-sm font-medium text-foreground"
          >
            {lang === "it" ? "English" : "Italiano"}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "it" ? "Ultimo aggiornamento: 20 Febbraio 2026" : "Last updated: February 20, 2026"}
        </p>

        {lang === "it" ? (
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-lg font-semibold">1. Accettazione dei Termini</h2>
              <p className="mt-2">{"Utilizzando Chat Pionieri (\"l'App\"), accetti di essere vincolato da questi Termini di Servizio. Se non accetti questi termini, ti preghiamo di non utilizzare l'app."}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">2. Descrizione del Servizio</h2>
              <p className="mt-2">Chat Pionieri offre una piattaforma di messaggistica per i Pionieri di Pi Network con KYC approvato e migrazione al Mainnet completata. Il servizio include chat in tempo reale e la possibilita' di effettuare donazioni tramite Pi.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">3. Requisiti di accesso</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Account Pi Network attivo e verificato</li>
                <li>KYC approvato su Pi Network</li>
                <li>Prima migrazione al Mainnet completata</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">4. Regole di condotta</h2>
              <p className="mt-2">Gli utenti si impegnano a:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Non inviare messaggi offensivi, volgari o discriminatori</li>
                <li>Non fare spam o inviare contenuti pubblicitari non autorizzati</li>
                <li>Non tentare di compromettere la sicurezza dell'app</li>
                <li>Rispettare gli altri utenti della community</li>
                <li>Non condividere informazioni personali di altri utenti</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">5. Moderazione</h2>
              <p className="mt-2">L'amministratore si riserva il diritto di eliminare messaggi e bannare utenti che violano le regole di condotta. Le decisioni di moderazione sono insindacabili.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">6. Donazioni</h2>
              <p className="mt-2">Le donazioni in Pi sono volontarie e non obbligatorie. Una volta effettuata, la donazione non e' rimborsabile. Le donazioni vengono utilizzate per il supporto e l'aggiornamento dell'app.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">7. Limitazione di responsabilita'</h2>
              <p className="mt-2">L'app viene fornita "cosi' com'e'", senza garanzie di alcun tipo. L'amministratore non e' responsabile per eventuali danni derivanti dall'uso dell'app, inclusa la perdita di dati o interruzioni del servizio.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">8. Modifiche ai Termini</h2>
              <p className="mt-2">Ci riserviamo il diritto di modificare questi Termini di Servizio in qualsiasi momento. Le modifiche saranno effettive immediatamente dopo la pubblicazione sulla piattaforma.</p>
            </section>
          </div>
        ) : (
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
              <p className="mt-2">{"By using Chat Pionieri (\"the App\"), you agree to be bound by these Terms of Service. If you do not accept these terms, please do not use the app."}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">2. Service Description</h2>
              <p className="mt-2">Chat Pionieri provides a messaging platform for Pi Network Pioneers with approved KYC and completed Mainnet migration. The service includes real-time chat and the ability to make donations via Pi.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">3. Access Requirements</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Active and verified Pi Network account</li>
                <li>Approved KYC on Pi Network</li>
                <li>First Mainnet migration completed</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">4. Code of Conduct</h2>
              <p className="mt-2">Users agree to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Not send offensive, vulgar, or discriminatory messages</li>
                <li>Not spam or send unauthorized advertising content</li>
                <li>Not attempt to compromise the app's security</li>
                <li>Respect other community members</li>
                <li>Not share other users' personal information</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">5. Moderation</h2>
              <p className="mt-2">The administrator reserves the right to delete messages and ban users who violate the code of conduct. Moderation decisions are final.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">6. Donations</h2>
              <p className="mt-2">Pi donations are voluntary and not mandatory. Once made, donations are non-refundable. Donations are used for app support and updates.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
              <p className="mt-2">The app is provided "as is", without warranties of any kind. The administrator is not responsible for any damages arising from the use of the app, including data loss or service interruptions.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">8. Changes to Terms</h2>
              <p className="mt-2">We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon publication on the platform.</p>
            </section>
          </div>
        )}

        <a href="/" className="mt-8 inline-block text-sm text-[#F7A800] underline">
          {lang === "it" ? "Torna alla Home" : "Back to Home"}
        </a>
      </div>
    </div>
  )
}
