import { useState, type CSSProperties } from "react";
import type { SubscriptionResult } from "../hooks/useSubscriptions";

interface SubscriptionCardProps {
  onClickSubscribe: (userWalletAddress: string, serviceId: string, periods: string) => void;
  onClickProcess: (serviceId: string, offset: number, limit: number) => void;
  result: SubscriptionResult | null;
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

const resultStyle: CSSProperties = {
  padding: 8,
  background: "#f4f4f4",
  border: "1px solid gray",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  fontSize: 12,
};

// contract values can be BigInt, which JSON.stringify can't handle on its own
const toJSON = (value: unknown) => JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v), 2);

const SubscriptionCard = ({ onClickSubscribe, onClickProcess, result, disabled }: SubscriptionCardProps) => {
  const [userWalletAddress, setUserWalletAddress] = useState("");
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
          User wallet address
          <input value={userWalletAddress} onChange={e => setUserWalletAddress(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Service ID
          <input value={serviceId} onChange={e => setServiceId(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Number of pre-approved subscription cycles
          <input value={periods} onChange={e => setPeriods(e.target.value)} />
        </label>
        <button onClick={() => onClickSubscribe(userWalletAddress, serviceId, periods)} disabled={disabled}>
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

      {result && (
        <div>
          <strong>{result.message}</strong>
          {result.error && <pre style={resultStyle}>{result.error}</pre>}
          {result.transaction !== undefined && (
            <>
              <p>Transaction:</p>
              <pre style={resultStyle}>{toJSON(result.transaction)}</pre>
            </>
          )}
          {result.updatedData !== undefined && (
            <>
              <p>Updated data:</p>
              <pre style={resultStyle}>{toJSON(result.updatedData)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
