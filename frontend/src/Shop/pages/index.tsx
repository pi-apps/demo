import { WindowWithEnv, User, AuthResult } from "../components/Types2";
import axios from "axios";
import { useState } from "react";
import { onIncompletePaymentFound } from "../components/Payments";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageNavigation from "../components/PageNav";


const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const signIn = async () => {
        const scopes = ['username', 'payments'];
        const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        await signInUser(authResult);
        setUser(authResult.user);
    }
  
  const signOut = () => {
    setUser(null);
    signOutUser();
  }
  
  const signInUser = async (authResult: AuthResult) => {
    await axiosClient.post('/user/signin', {authResult});
    return setShowModal(false);
  }
  
  const signOutUser = () => {
    return axiosClient.get('/user/signout');
  }

  
return(
    <>
    <Header user={user} onSignIn={signIn} onSignOut={signOut}/>
    <PageNavigation />
    <p>
        THIS IS A NEW DEMO HOME PAGE 
        ADD MORE TEXT HERE!
    </p>
    <Footer/>
    </>
);

};