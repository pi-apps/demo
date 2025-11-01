// --- Header.tsx ---

import React from "react";
import { User } from "../";

interface Props {
  onSignIn: () => void;
  onSignOut: () => void;
  user: User | null;
  // Props baru untuk search
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Header(props: Props) {
  return (
    <header className="tekindomall-header">
      {/* Container untuk logo */}
      <div className="logo-container">
        <img src="/tekindomall-logo.png" alt="Tekindo Mall Logo" className="logo" />
      </div>

      {/* --- SEARCH BAR BARU --- */}
      <div className="search-container">
        <input type="text" placeholder="Cari produk di Tekindomall..." className="search-input" value={props.searchQuery} onChange={props.onSearchChange} />
      </div>

      {/* Tombol Sign in/out */}
      <div className="user-actions">
        {props.user === null ? (
          <button onClick={props.onSignIn}>Sign in</button>
        ) : (
          <div>
            @{props.user.username}{" "}
            <button type="button" onClick={props.onSignOut}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
