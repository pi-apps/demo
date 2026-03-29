import type { CSSProperties } from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  pictureURL: string;
  onClickBuy: () => void;
  disabled?: boolean;
}

const containerStyle: CSSProperties = {
  margin: 16,
  paddingBottom: 16,
  borderBottom: "1px solid gray",
};

const contentRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  marginBottom: 8,
};

const imageWrapperStyle: CSSProperties = {
  width: "33%",
  marginRight: 8,
};

const imageStyle: CSSProperties = {
  width: "100%",
  objectFit: "cover",
};

const infoStyle: CSSProperties = {
  width: "66%",
};

const priceSectionStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: 8,
};

const ProductCard = ({ name, description, price, pictureURL, onClickBuy, disabled }: ProductCardProps) => {
  return (
    <div style={containerStyle}>
      <div style={contentRowStyle}>
        <div style={imageWrapperStyle}>
          <img style={imageStyle} src={pictureURL} alt={name} />
        </div>

        <div style={infoStyle}>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div style={priceSectionStyle}>
        <strong>{price} Test-π</strong> <br />
        <button onClick={onClickBuy} disabled={disabled}>
          Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
