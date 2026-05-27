import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  pictureURL: string;
  onClickBuy: () => void;
  disabled?: boolean;
}



const ProductCard = ({ name, description, price, pictureURL, onClickBuy, disabled }: ProductCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentRow}>
        <div className={styles.imageWrapper}>
          <img className={styles.image} src={pictureURL} alt={name} />
        </div>

        <div className={styles.info}>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className={styles.priceSection}>
        <strong className={styles.price}>{price} Test-π</strong>
        <button className={styles.buyButton} onClick={onClickBuy} disabled={disabled}>
          Order
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
