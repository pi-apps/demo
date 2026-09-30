import { useState, type CSSProperties } from "react";

interface SubscriptionCardProps {
  onClickSubscribe: (serviceId: string, periods: string) => void;
  onClickProcess: (serviceId: string, offset: number, limit: number) => void;
  disabled?: boolean;
}

const containerStyle: CSSProperties = {
  margin: 16,
  paddingBottom: 16,
  borderBottom: "1px solid gray",
};

const sectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "66%",
};

const SubscriptionCard = ({ onClickSubscribe, onClickProcess, disabled }: SubscriptionCardProps) => {
  const [serviceId, setServiceId] = useState("");
  const [periods, setPeriods] = useState("1");

  const [processServiceId, setProcessServiceId] = useState("");
  const [offset, setOffset] = useState("0");
  const [limit, setLimit] = useState("10");

  return (
    <div style={containerStyle}>
      <h3>Subscription</h3>
      <p>Pay for your subscription with Pi!</p>

      <div style={sectionStyle}>
        <label style={fieldStyle}>
          Service ID
          <input value={serviceId} onChange={e => setServiceId(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Number of pre-approved subscription cycles
          <input value={periods} onChange={e => setPeriods(e.target.value)} />
        </label>
        <button onClick={() => onClickSubscribe(serviceId, periods)} disabled={disabled}>
          Subscribe
        </button>
      </div>

      <div style={sectionStyle}>
        <label style={fieldStyle}>
          Service ID
          <input value={processServiceId} onChange={e => setProcessServiceId(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Offset
          <input value={offset} onChange={e => setOffset(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Limit
          <input value={limit} onChange={e => setLimit(e.target.value)} />
        </label>
        <button onClick={() => onClickProcess(processServiceId, Number(offset), Number(limit))} disabled={disabled}>
          Process
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
