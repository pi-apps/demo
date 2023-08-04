import RefundCard from "../components/RefundCard";
import axios from "axios";
import { useState } from "react";
import { onIncompletePaymentFound } from "../components/Payments";
import Footer from "../components/Footer";
import SignIn from "../components/SignIn";
import Header from "../components/Header";
import { WindowWithEnv, AuthResult, User } from "../components/Types2";
import PageNavigation from "../components/PageNav";

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});


export default function AppToUserPayments() {
    const [refunds, setRefunds] = useState<[{}]>();
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);


  const signIn = async () => {
      const scopes = ['username', 'payments'];
      const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      await signInUser(authResult);
      setUser(authResult.user);
      fetchRefundableOrders();
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

const onModalClose = () => {
  setShowModal(false);
}  

const fetchRefundableOrders = async() => {
    const refundableOrders = await axiosClient.post('/payments/refundable_payment');
    const refundable = refundableOrders.data.refundableOrders
    setRefunds(refundable);
    }

return (    
        <>
            <Header user={user} onSignIn={signIn} onSignOut={signOut}/>
            <PageNavigation />
            
            {
            refunds ?
            refunds.map((order: any) =>{
            console.log(order);
                return <RefundCard
                key={order.product_id}
                name={order.product_id}
                description= "Did the delivery person eat your pie and now you need a refund?"
                pictureCaption="Picture by David McLeish - https://www.flickr.com/photos/shishberg/2310078068/, CC BY-SA 2.0"
                pictureURL="https://live.staticflickr.com/2143/2310078068_627e69cea2_k.jpg"
                amount={order.amount}
                onClickRefund={()=> fetchRefundableOrders()}
                checkRefundablePayments={() => console.log("Refund Clicked")}
                />
                }):
                <RefundCard 
                name= 'none'
                description= "Did the delivery person eat your pie and now you need a refund?"
                pictureCaption="Picture by David McLeish - https://www.flickr.com/photos/shishberg/2310078068/, CC BY-SA 2.0"
                pictureURL="https://live.staticflickr.com/2143/2310078068_627e69cea2_k.jpg"
                amount={1}
                onClickRefund={()=> fetchRefundableOrders()}
                checkRefundablePayments={() => console.log("Refund Clicked")}
                />
            }

            { showModal && <SignIn onSignIn={signIn} onModalClose={onModalClose} /> }
            <Footer/>
        </>
    )
}