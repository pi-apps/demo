// --- index.tsx ---

import React, { useState } from "react";
import axios from "axios";
// Hapus impor motion jika masih ada

import ProductCard from "./components/ProductCard";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import "./App.css"; // Pastikan App.css diimpor

// --- TIPE DATA LENGKAP ---
type MyPaymentMetadata = {};
type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};
export type User = AuthResult["user"];
interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: Object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string;
    sandbox: "true" | "false";
  };
}

// --- KONFIGURASI LENGKAP ---
const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true });
const config = { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } };

// --- DATA PRODUK LENGKAP ---
const allProducts = [
  {
    id: "camera_001",
    name: "Camera DSLR Pro",
    description: "Kamera DSLR profesional untuk hasil foto yang menakjubkan.",
    pictureURL: "https://images.pexels.com/photos/1010492/pexels-photo-1010492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    productType: "Elektronik",
    rating: 4.9,
    price: 1000,
    originalPrice: 1500,
    alertText: "Sale!",
    buttonText: "Add to Cart",
  },
  {
    id: "pc_gaming_001",
    name: "Gaming PC Ultimate",
    description: "Komputer gaming berperforma tinggi dengan GPU terbaru.",
    pictureURL: "https://images.pexels.com/photos/4096956/pexels-photo-4096956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    productType: "Komputer",
    rating: 4.8,
    price: 4000,
    originalPrice: 5000,
    alertText: "Diskon 20%",
    buttonText: "Add to Cart",
  },
  {
    id: "earphone_001",
    name: "Wireless Earphone",
    description: "Earphone nirkabel dengan kualitas suara premium dan noise cancellation.",
    pictureURL: "https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    productType: "Aksesoris",
    rating: 4.5,
    price: 1500,
    originalPrice: 2000,
    alertText: "Sale!",
    buttonText: "Add to Cart",
  },
  {
    id: "laptop_001",
    name: "Ultrabook Laptop",
    description: "Laptop tipis dan ringan, cocok untuk produktivitas sehari-hari.",
    pictureURL: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    productType: "Komputer",
    rating: 4.6,
    price: 2000,
    originalPrice: 2500,
    alertText: "Hemat!",
    buttonText: "Add to Cart",
  },
];

export default function Shop() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- SEMUA FUNGSI (LENGKAP) ---
  const signIn = async () => {
    const scopes = ["username", "payments"];
    const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    signInUser(authResult);
    setUser(authResult.user);
  };
  const signOut = () => {
    setUser(null);
    signOutUser();
  };
  const signInUser = (authResult: AuthResult) => {
    axiosClient.post("/user/signin", { authResult });
    return setShowModal(false);
  };
  const signOutUser = () => {
    return axiosClient.get("/user/signout");
  };
  const onModalClose = () => {
    setShowModal(false);
  };
  const orderProduct = async (memo: string, amount: number, paymentMetadata: MyPaymentMetadata) => {
    if (user === null) {
      return setShowModal(true);
    }
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = { onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  };
  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post("/payments/incomplete", { payment });
  };
  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post("/payments/approve", { paymentId }, config);
  };
  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post("/payments/complete", { paymentId, txid }, config);
  };
  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    return axiosClient.post("/payments/cancelled_payment", { paymentId });
  };
  const onError = (error: Error, payment?: PaymentDTO) => {
    console.log("onError", error);
    if (payment) {
      console.log(payment);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const filteredProducts = allProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.productType.toLowerCase().includes(searchQuery.toLowerCase()));
  // --- AKHIR DARI FUNGSI ---

  return (
    <>
      <Header user={user} onSignIn={signIn} onSignOut={signOut} searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <div className="product-grid-container">
        {filteredProducts.map((product, index) => (
          /* --- INI PERUBAHANNYA --- */
          /* Kita tambahkan wrapper div untuk menangani layout dan animasi load */
          <div key={product.id} className="product-card-wrapper" style={{ animationDelay: `${index * 0.05}s` }}>
            <ProductCard
              /* Hapus style prop dari sini */
              name={product.name}
              description={product.description}
              pictureURL={product.pictureURL}
              onClickBuy={() => orderProduct(`Order ${product.name}`, product.price, { productId: product.id })}
              productType={product.productType}
              rating={product.rating}
              price={product.price}
              originalPrice={product.originalPrice}
              alertText={product.alertText}
              buttonText={product.buttonText}
            />
          </div>
          /* --- AKHIR PERUBAHAN --- */
        ))}

        {filteredProducts.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
            <h3>Produk tidak ditemukan</h3>
            <p>Coba kata kunci lain untuk "{searchQuery}"</p>
          </div>
        )}
      </div>

      {showModal && <SignIn onSignIn={signIn} onModalClose={onModalClose} />}
    </>
  );
}
