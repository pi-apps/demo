# Subscription processing (scheduled job)

Subscriptions run on Pi's on-chain Subscription contract, and renewals don't happen on their own. The
merchant (the wallet that owns the subscription service) has to call the contract's `process` to collect
every payment that is due, at least once per billing period.

The backend has a job for this: [`backend/src/jobs/processSubscriptions.ts`](../backend/src/jobs/processSubscriptions.ts).
It uses `SmartContract.Subscription.process` from the [`pi-backend`](https://github.com/pi-apps/pi-nodejs)
SDK (1.x) to sign each call with the merchant's secret seed on the server, and pages through the
service's subscriptions one batch per transaction. Nothing goes through the Pi Browser, so it can run
unattended.

> Subscriptions are available on Pi Testnet only for now. The job needs Node.js 20 or later.

## Configuration

The job reads its settings from environment variables. Nothing is hard-coded: set them to your own
service and wallet.

| Variable | Required | Description |
| --- | --- | --- |
| `PI_MERCHANT_SECRET` | yes | Secret seed (starts with `S`) of the wallet that owns the service. |
| `PI_SUBSCRIPTION_SERVICE_ID` | yes | Your service's id on the Subscription contract. |
| `SUBSCRIPTION_PROCESS_BATCH_SIZE` | no | Subscriptions per transaction. Default `20`. |
| `SUBSCRIPTION_PROCESS_MODE` | no | `submit` (default) sends transactions. `simulate` only previews each batch and spends nothing. |
| `SUBSCRIPTION_PROCESS_CRON` | no | Docker deployment only: when to run, in cron syntax. Default `0 */12 * * *` (every 12 hours). |

**Keep `PI_MERCHANT_SECRET` secret.** Anyone who has it controls the merchant wallet. Keep it in an
environment variable or your `.env` file on the server, never in the code, a commit or the frontend.

The merchant wallet pays the transaction fees (about 0.01–0.02 Pi per batch on Pi Testnet), so keep it funded.

## Run it once

Try it in `simulate` mode first. It shows what each batch would do without sending anything:

```shell
cd backend
yarn install && yarn build
PI_MERCHANT_SECRET=S... PI_SUBSCRIPTION_SERVICE_ID=<your service id> SUBSCRIPTION_PROCESS_MODE=simulate \
  yarn process-subscriptions
```

The variables can also go in `backend/.env` (see `backend/.env.example`). Drop
`SUBSCRIPTION_PROCESS_MODE=simulate` to collect the renewals for real.

The output has one line per batch, then a summary:

```text
[...] [process-subscriptions] Processing service <id> (mode submit, batch size 20)
[...] [process-subscriptions] [0, 20) charged 3, failed 0, skipped 17 (txid ..., ledger ...)
[...] [process-subscriptions] Done in 9.4s: charged 3, failed 0, skipped 17 of 20 subscription(s); 0 batch(es) failed.
```

- **charged**: renewals collected.
- **failed**: charges the contract couldn't make (low balance, used-up allowance, or more than one period
  late). The contract turns auto-renew off for those subscriptions.
- **skipped**: not due yet, or not auto-renewing.

The job exits with status `0` when every batch ran and `1` otherwise.

If a batch fails before it is sent, the job logs it and moves on to the next batch. If the error has a
`txid`, the transaction may already have landed, so the job stops there: look the txid up before running
the job again. Running the job again is otherwise safe, because the contract only charges subscriptions
that are due.

## Schedule it

### Docker deployment (built in)

With the [Docker deployment](./deployment.md), the backend container schedules the job itself (with PM2,
see [`backend/docker/processes.config.js`](../backend/docker/processes.config.js)). Set the variables in
the `.env` file at the root of the repository:

```shell
PI_MERCHANT_SECRET=S...
PI_SUBSCRIPTION_SERVICE_ID=<your service id>
# optional:
SUBSCRIPTION_PROCESS_CRON=0 */12 * * *
```

Then rebuild and restart the backend: `docker-compose up -d --build backend`. The job runs once when the
container starts, then on the schedule. It isn't scheduled at all while `PI_SUBSCRIPTION_SERVICE_ID` is
empty. Read its output with `docker-compose logs backend`.

Pick a schedule that runs at least once per billing period of your service. If a run is still going when
the next one is due, PM2 stops it and starts a new one. That's safe (the next run charges whatever is
still due), but keep the interval longer than a run takes.

### Your own server (crontab)

Without Docker, add the job to your server's crontab (`crontab -e`). This line runs it every 12 hours, at
midnight and noon, and appends the output to a log file:

```crontab
0 */12 * * * cd /path/to/demo/backend && /usr/bin/env yarn process-subscriptions >> /var/log/process-subscriptions.log 2>&1
```

The job reads `backend/.env`, so the variables can live there. Build the backend (`yarn build`) after each
update so the job runs the current code.

## Don't run it at the same time as A2U payments from the same wallet

Every transaction uses the sending account's next sequence number. If `PI_MERCHANT_SECRET` is also the
wallet you use for App-to-User payments, a `process` call and a payment built at the same moment can get
the same sequence number, and only one of them lands. Schedule the job when your server isn't sending
payouts, or use a separate wallet. See the
[`pi-backend` README](https://github.com/pi-apps/pi-nodejs#subscription-processing-server-side) for details.
