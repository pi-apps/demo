export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Informativa sulla Privacy / Privacy Policy
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ultimo aggiornamento / Last updated: 21/02/2026
        </p>

        {/* ITALIANO */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-red-600">Italiano</h2>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">1. Introduzione</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Chat Pionieri (\"l'App\") rispetta la tua privacy. Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali quando utilizzi la nostra applicazione."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">2. Dati raccolti</h3>
          <p className="mb-2 text-sm leading-relaxed text-foreground">
            {"Raccogliamo esclusivamente i seguenti dati:"}
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-sm text-foreground">
            <li>Username Pi Network (fornito tramite Pi SDK durante il login)</li>
            <li>UID Pi Network (identificatore univoco del tuo account Pi)</li>
            <li>Messaggi inviati nella chat (testo, data e ora)</li>
            <li>Informazioni sulle transazioni Pi effettuate tramite l'app</li>
          </ul>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Non raccogliamo dati personali aggiuntivi come email, numero di telefono o posizione geografica."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">3. Utilizzo dei dati</h3>
          <p className="mb-2 text-sm leading-relaxed text-foreground">
            {"I dati raccolti sono utilizzati esclusivamente per:"}
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-sm text-foreground">
            <li>{"Autenticazione e accesso all'app"}</li>
            <li>Visualizzazione dei messaggi nella chat</li>
            <li>Gestione delle donazioni Pi volontarie</li>
            <li>Moderazione della community (solo admin)</li>
          </ul>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">4. Condivisione dei dati</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Non vendiamo, scambiamo o cediamo i tuoi dati a terze parti. I dati possono essere condivisi solo con Pi Network per l'autenticazione e l'elaborazione dei pagamenti."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">5. Sicurezza</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Adottiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati da accessi non autorizzati, alterazione o distruzione, inclusa la crittografia dei dati in transito."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">{"6. Diritti dell'utente"}</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Hai il diritto di richiedere l'accesso, la modifica o la cancellazione dei tuoi dati in qualsiasi momento contattando l'amministratore dell'app tramite la chat o su Pi Network."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">7. Pagamenti</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Le donazioni sono completamente volontarie e vengono elaborate tramite Pi Network SDK. Non memorizziamo dati di pagamento sensibili."}
          </p>
        </section>

        {/* ENGLISH */}
        <section className="mb-10 border-t border-border pt-8">
          <h2 className="mb-4 text-lg font-bold text-red-600">English</h2>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">1. Introduction</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Chat Pionieri (\"the App\") respects your privacy. This policy describes how we collect, use, and protect your personal information when you use our application."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">2. Data Collection</h3>
          <p className="mb-2 text-sm leading-relaxed text-foreground">
            {"We only collect the following data:"}
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-sm text-foreground">
            <li>Pi Network username (provided via Pi SDK during login)</li>
            <li>Pi Network UID (unique identifier for your Pi account)</li>
            <li>Messages sent in the chat (text, date, and time)</li>
            <li>Information about Pi transactions made through the app</li>
          </ul>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"We do not collect additional personal data such as email, phone number, or geographic location."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">3. Use of Data</h3>
          <p className="mb-2 text-sm leading-relaxed text-foreground">
            {"Collected data is used exclusively for:"}
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-sm text-foreground">
            <li>Authentication and app access</li>
            <li>Displaying chat messages</li>
            <li>Managing voluntary Pi donations</li>
            <li>Community moderation (admin only)</li>
          </ul>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">4. Data Sharing</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"We do not sell, trade, or transfer your data to third parties. Data may only be shared with Pi Network for authentication and payment processing."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">5. Security</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"We implement appropriate technical and organizational security measures to protect your data from unauthorized access, alteration, or destruction, including data encryption in transit."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">6. User Rights</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"You have the right to request access, modification, or deletion of your data at any time by contacting the app administrator via chat or on Pi Network."}
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">7. Payments</h3>
          <p className="mb-3 text-sm leading-relaxed text-foreground">
            {"Donations are completely voluntary and are processed through Pi Network SDK. We do not store sensitive payment data."}
          </p>
        </section>

        <a href="/" className="text-sm text-primary underline">
          {"Torna all'app / Back to app"}
        </a>
      </div>
    </main>
  )
}
