import { DetailRows } from "./club.styles";

export type InfoRow = [label: string, value: string, small?: string];

// label / value rows in a bordered box: the success screen's summary and the club page's billing and wallets
const InfoRows = ({ rows }: { rows: InfoRow[] }) => (
  <DetailRows>
    {rows.map(([label, value, small]) => (
      <div key={label}>
        <span>{label}</span>
        <b>
          {value}
          {small && <small>{small}</small>}
        </b>
      </div>
    ))}
  </DetailRows>
);

export default InfoRows;
