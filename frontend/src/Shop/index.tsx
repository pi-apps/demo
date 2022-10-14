import React, {useState} from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import SignIn from './components/SignIn';
import Header from './components/Header';

type MyPaymentMetadata = {};

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

export type User = AuthResult['user'];

interface PaymentDTO {
  amount: number,
  user_uid: string,
  created_at: string,
  identifier: string,
  metadata: Object,
  memo: string,
  status: {
    developer_approved: boolean,
    transaction_verified: boolean,
    developer_completed: boolean,
    cancelled: boolean,
    user_cancelled: boolean,
  },
  to_address: string,
  transaction: null | {
    txid: string,
    verified: boolean,
    _link: string,
  },
};

// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string, // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false", // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  }
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});
const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};


export default function Shop() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const signIn = async () => {
    const scopes = ['username', 'payments'];
    const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    signInUser(authResult);
    setUser(authResult.user);
  }

  const signOut = () => {
    setUser(null);
    signOutUser();
  }

  const signInUser = (authResult: AuthResult) => {
    axiosClient.post('/user/signin', {authResult});
    return setShowModal(false);
  }

  const signOutUser = () => {
    return axiosClient.get('/user/signout');
  }

  const onModalClose = () => {
    setShowModal(false);
  }

  const orderProduct = async (memo: string, amount: number, paymentMetadata: MyPaymentMetadata) => {
    if(user === null) {
      return setShowModal(true);
    }
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError
    };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  }

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post('/payments/incomplete', {payment});
  }

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post('/payments/approve', {paymentId}, config);
  }

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post('/payments/complete', {paymentId, txid}, config);
  }

  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    return axiosClient.post('/payments/cancelled_payment', {paymentId});
  }

  const onError = (error: Error, payment?: PaymentDTO) => {
    console.log("onError", error);
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  }

  return (
    <>
      <Header user={user} onSignIn={signIn} onSignOut={signOut}/>

      <ProductCard
        name="Apple Pie"
        description="You know what this is. Pie. Apples. Apple pie."
        price={3}
        pictureURL="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Apple_pie.jpg/1280px-Apple_pie.jpg"
        pictureCaption="Picture by Dan Parsons - https://www.flickr.com/photos/dan90266/42759561/, CC BY-SA 2.0, https://commons.wikimedia.org/w/index.php?curid=323125"
        onClickBuy={() => orderProduct("Order Apple Pie", 3, { productId: 'apple_pie_1' })}
      />
      <ProductCard
        name="Lemon Meringue Pie"
        description="Non-contractual picture. We might have used oranges because we had no lemons. Order at your own risk."
        price={5}
        pictureURL="https://live.staticflickr.com/1156/5134246283_f2686ff8a8_b.jpg"
        pictureCaption="Picture by Sistak - https://www.flickr.com/photos/94801434@N00/5134246283, CC BY-SA 2.0"
        onClickBuy={() => orderProduct("Order Lemon Meringue Pie", 5, { productId: 'lemon_pie_1' })}
      />

      { showModal && <SignIn onSignIn={signIn} onModalClose={onModalClose} /> }
    </>
  );
}
