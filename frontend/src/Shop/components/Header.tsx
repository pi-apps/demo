import React, { CSSProperties } from "react";
import { User } from "../";

interface Props {
  onSignIn: () => void;
  onSignOut: () => void;
  user: User | null,
  switchView: () => void,
}

const headerStyle: CSSProperties = {
  padding: 8,
  backgroundColor: "#15202B",
  color: "white",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default function Header(props: Props) {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: "bold" , fontFamily:"fantasy", font:"papyrus", fontSize:20}}>DCert</div>

      <div>
        {props.user === null ? (
          <button className="button1"  onClick={props.onSignIn}>Sign in</button>
        ) : (
          <div>
            @{props.user.username} <button type="button" onClick={props.onSignOut}>Sign out</button>
          </div>
        )}
      </div>
      {/* <div>
          <button onClick={props.switchView}>Switch View</button>
      </div> */}
    </header>
  );
}
