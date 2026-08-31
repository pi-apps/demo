import { useState, type CSSProperties, type ReactNode } from "react";

const DEFAULT_MERCHANT = "GCYIUNNZTIXTLYDV3K6DCVOOJYKFOSAEQLGH3BD7D6EQ2RCUPAARYVO2";
const DEFAULT_CUSTOMER = "GAGOPQNJJEITO7FQC7VXICCJDLSJ5BDMABS4PPZ6JG2MJS6PQSIWIT6G";

type RunState = {
  action: string;
  status: "loading" | "ok" | "error";
  data?: unknown;
  error?: string;
};

const containerStyle: CSSProperties = {
  margin: 16,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const sharedBoxStyle: CSSProperties = {
  border: "1px solid #999",
  borderRadius: 8,
  padding: 16,
  background: "#f7f7f7",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  marginBottom: 2,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 13,
  fontFamily: "monospace",
};

const buttonStyle: CSSProperties = {
  alignSelf: "flex-start",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  background: "#6b3fa0",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const descStyle: CSSProperties = {
  fontSize: 13,
  color: "#555",
  margin: 0,
};

const outputStyle: CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: 16,
  background: "#1e1e1e",
  color: "#e0e0e0",
  fontFamily: "monospace",
  fontSize: 12,
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  maxHeight: 320,
  overflow: "auto",
};

const fieldsRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  width = 160,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
}) => (
  <label style={{ display: "flex", flexDirection: "column", flex: `1 1 ${typeof width === "number" ? `${width}px` : width}`, minWidth: 120 }}>
    <span style={labelStyle}>{label}</span>
    <input style={inputStyle} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  </label>
);

const ActionCard = ({
  title,
  signature,
  description,
  children,
  onRun,
  disabled,
}: {
  title: string;
  signature: string;
  description: string;
  children?: ReactNode;
  onRun: () => void;
  disabled?: boolean;
}) => (
  <div style={cardStyle}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <code style={{ fontSize: 12, color: "#6b3fa0", wordBreak: "break-all" }}>{signature}</code>
    <p style={descStyle}>{description}</p>
    {children && <div style={fieldsRowStyle}>{children}</div>}
    <button style={{ ...buttonStyle, opacity: disabled ? 0.6 : 1 }} onClick={onRun} disabled={disabled}>
      Run
    </button>
  </div>
);

const SubscriptionPanel = () => {
  // Shared, reused across methods
  const [merchant, setMerchant] = useState(DEFAULT_MERCHANT);
  const [customer, setCustomer] = useState(DEFAULT_CUSTOMER);
  const [sharedId, setSharedId] = useState("79");

  // registerService params
  const [serviceName, setServiceName] = useState("new-test");
  const [serviceDescription, setServiceDescription] = useState("200000000");
  const [servicePrice, setServicePrice] = useState("120");
  const [serviceDuration, setServiceDuration] = useState("0");
  const [serviceInterval, setServiceInterval] = useState("12");

  // process params
  const [offset, setOffset] = useState("0");
  const [limit, setLimit] = useState("1");

  // subscribe params
  const [isAutoRenew, setIsAutoRenew] = useState(true);
  const [subscribeParam, setSubscribeParam] = useState("10");

  const [result, setResult] = useState<RunState | null>(null);

  const run = async (action: string, fn: () => Promise<unknown>) => {
    const sub = window.Pi?.SmartContract?.Subscription;
    if (!sub) {
      setResult({ action, status: "error", error: "window.Pi.SmartContract.Subscription is not available. Open this app inside the Pi Browser." });
      return;
    }
    setResult({ action, status: "loading" });
    try {
      const data = await fn();
      console.log(`[${action}] result:`, data);
      setResult({ action, status: "ok", data });
    } catch (err) {
      console.error(`[${action}] error:`, err);
      setResult({ action, status: "error", error: err instanceof Error ? err.message : String(err) });
    }
  };

  const sub = () => window.Pi.SmartContract.Subscription;

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: 0 }}>Subscription Smart Contract Playground</h2>

      <div style={sharedBoxStyle}>
        <h3 style={{ margin: 0 }}>Shared fields (reused across methods)</h3>
        <div style={fieldsRowStyle}>
          <Field label="Merchant address" value={merchant} onChange={setMerchant} width="100%" />
          <Field label="Customer address" value={customer} onChange={setCustomer} width="100%" />
          <Field
            label="Reusable ID (service / subscription id)"
            value={sharedId}
            onChange={setSharedId}
            placeholder="e.g. 79"
            width={200}
          />
        </div>
      </div>

      <ActionCard
        title="Register Service"
        signature="registerService(merchant, name, description, price, duration, interval)"
        description="Merchant registers a new subscription service. Uses the shared Merchant address."
        onRun={() =>
          run("registerService", () =>
            sub().registerService(merchant, serviceName, serviceDescription, servicePrice, serviceDuration, serviceInterval)
          )
        }
      >
        <Field label="Service name" value={serviceName} onChange={setServiceName} />
        <Field label="Description" value={serviceDescription} onChange={setServiceDescription} />
        <Field label="Price" value={servicePrice} onChange={setServicePrice} />
        <Field label="Duration" value={serviceDuration} onChange={setServiceDuration} />
        <Field label="Interval" value={serviceInterval} onChange={setServiceInterval} />
      </ActionCard>

      <ActionCard
        title="Get Merchant Services"
        signature="getMerchantServices(merchant)"
        description="Lists all services registered by the shared Merchant address."
        onRun={() => run("getMerchantServices", () => sub().getMerchantServices(merchant))}
      />

      <ActionCard
        title="Get Service"
        signature="getService(merchant, serviceId)"
        description="Fetches a single service by ID. Uses shared Merchant address and the shared reusable ID."
        onRun={() => run("getService", () => sub().getService(merchant, sharedId))}
      />

      <ActionCard
        title="Process"
        signature="process(merchant, serviceId, offset, limit)"
        description="Processes due charges for a service. Uses shared Merchant address and the shared reusable ID as the service id."
        onRun={() => run("process", () => sub().process(merchant, sharedId, Number(offset), Number(limit)))}
      >
        <Field label="Offset" value={offset} onChange={setOffset} width={100} />
        <Field label="Limit" value={limit} onChange={setLimit} width={100} />
      </ActionCard>

      <ActionCard
        title="Subscribe"
        signature="subscribe(customer, serviceId, isAutoRenew, param)"
        description="Customer subscribes to a service. Uses shared Customer address and the shared reusable ID as the service/product id."
        onRun={() => run("subscribe", () => sub().subscribe(customer, sharedId, isAutoRenew, subscribeParam))}
      >
        <label style={{ display: "flex", flexDirection: "column", flex: "1 1 140px", minWidth: 120 }}>
          <span style={labelStyle}>Auto renew</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0" }}>
            <input type="checkbox" checked={isAutoRenew} onChange={(e) => setIsAutoRenew(e.target.checked)} />
            <span style={{ fontSize: 13 }}>{isAutoRenew ? "true" : "false"}</span>
          </span>
        </label>
        <Field label="Param" value={subscribeParam} onChange={setSubscribeParam} width={120} />
      </ActionCard>

      <ActionCard
        title="Get Subscription"
        signature="getSubscription(customer, subscriptionId)"
        description="Fetches a subscription by ID. Uses shared Customer address and the shared reusable ID as the subscription id."
        onRun={() => run("getSubscription", () => sub().getSubscription(customer, sharedId))}
      />

      <ActionCard
        title="Get Subscription Reservation"
        signature="getSubscriptionReservation(customer, subscriptionId)"
        description="Fetches the reservation for a subscription. Uses shared Customer address and the shared reusable ID."
        onRun={() => run("getSubscriptionReservation", () => sub().getSubscriptionReservation(customer, sharedId))}
      />

      <ActionCard
        title="Get Subscriber Subscriptions"
        signature="getSubscriberSubscriptions(customer)"
        description="Lists all subscriptions belonging to the shared Customer address."
        onRun={() => run("getSubscriberSubscriptions", () => sub().getSubscriberSubscriptions(customer))}
      />

      {result && (
        <div>
          <h3 style={{ marginBottom: 8 }}>
            Output — <code>{result.action}</code>{" "}
            <span
              style={{
                fontSize: 12,
                color: result.status === "error" ? "#c0392b" : result.status === "ok" ? "#27ae60" : "#888",
              }}
            >
              ({result.status})
            </span>
          </h3>
          <div style={outputStyle}>
            {result.status === "loading" && "Running..."}
            {result.status === "error" && result.error}
            {result.status === "ok" && JSON.stringify(result.data, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPanel;
