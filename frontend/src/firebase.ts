import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5OVC-EAYpziBl3lqwBOL5iARUPdkw41U",
  authDomain: "ghn-pi.firebaseapp.com",
  projectId: "ghn-pi",
  storageBucket: "ghn-pi.firebasestorage.app",
  messagingSenderId: "282414858814",
  appId: "1:282414858814:web:d0f56ea2a67d1d7e0a476f"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore với kiểu dữ liệu Firestore để TypeScript nhận diện được
export const db: Firestore = getFirestore(app);