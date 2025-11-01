// --- ProductCard.tsx ---

import React from "react";
import "./ProductCard.css";

interface Props {
  name: string;
  description: string;
  pictureURL: string;
  onClickBuy: () => void;
  productType: string;
  rating: number;
  price: number;
  originalPrice?: number;
  alertText?: string;
  buttonText?: string;

  // --- TAMBAHKAN PROPS INI ---
  style?: React.CSSProperties;
}

// ... (Fungsi renderRating Anda tetap sama) ...
const renderRating = (rating: number) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} style={{ color: "var(--accent-yellow)" }}>
          ★
        </span>
      );
    } else {
      stars.push(
        <span key={i} style={{ color: "var(--text-light)" }}>
          ★
        </span>
      );
    }
  }
  return (
    <>
      {stars}
      <span className="rating-value">({rating.toFixed(1)})</span>
    </>
  );
};

export default function ProductCard(props: Props) {
  const {
    name,
    pictureURL,
    onClickBuy,
    productType,
    rating,
    price,
    originalPrice,
    alertText,
    buttonText,
    // --- AMBIL PROPS STYLE ---
    style,
  } = props;

  const displayPrice = price;
  const displayOriginalPrice = originalPrice !== undefined ? originalPrice : undefined;

  return (
    // --- TERAPKAN STYLE DI SINI ---
    <div className="product-card" style={style}>
      <div className="product-image-container">
        {/* ... (sisa kode Anda tetap sama) ... */}
        {alertText && <div className="product-alert">{alertText}</div>}
        <img src={pictureURL} alt={name} className="product-image" />
      </div>

      <div className="product-info">
        {/* ... (sisa kode Anda tetap sama) ... */}
        <div className="product-type">{productType}</div>

        <h3>{name}</h3>

        <div className="product-rating">{renderRating(rating)}</div>

        <div className="product-price">
          {displayOriginalPrice !== undefined && <span className="product-price-original">{displayOriginalPrice} Test Coin</span>}
          <span className="product-price-discount">{displayPrice} Test Coin</span>
        </div>

        <button onClick={onClickBuy} className="product-action-button">
          {buttonText || "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
