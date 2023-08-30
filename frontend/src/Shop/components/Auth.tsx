import React from "react";
import { User, AuthResult, UserContextType, WindowWithEnv, RefundType } from "./Types";
import axios from "axios";
import { onIncompletePaymentFound } from "./Payments";

/* 
  The useContext Hook is iniated here to pass the user information
  between the various pages of the app. It is important to use the
  react-dom links in your app so there is no re-render which causes 
  loss of the context. 

  To read more on react context see, https://react.dev/reference/react/useContext
*/

export const UserContext = React.createContext<UserContextType | null >(null);

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});

const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [user, setUser] = React.useState<User>( { uid: '', username: '' } )
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [refunds, setRefunds] = React.useState<RefundType[]>(
      [{
        _id: '',
        pi_payment_id: '',
        product_id: '',
        user: '',
        amount: 0,
        txid: '',
        paid: false,
        cancelled: false,
        completed: false,
        created_at: '',
        is_refund: false,
        refunded_at: ''
      }]);

    const signIn = async () => {
      const scopes = ['username', 'payments', 'wallet_address'];
      const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      await signInUser(authResult);
      setUser(authResult.user);
      setShowModal(false);
      saveRefunds();
    }

    const signInUser = async (authResult: AuthResult) => {
        await axiosClient.post('/user/signin', {authResult});
        return setShowModal(false);
    }
    
    const signOutUser = async() =>{
      const nullUser = { uid: '', username: '' };
      setUser(nullUser);
    }

      const saveUser = () =>{
        user.uid === '' ? signIn() : signOutUser();
      }

      const saveShowModal = (value: boolean) => {
        setShowModal(value);
      }

      const saveRefunds = async() =>{
        const refundableOrders = await axiosClient.post('/payments/refundable_payment');
        const refundable: RefundType[] = refundableOrders.data.refundableOrders;
        setRefunds(refundable)
      }

      const onModalClose = () => {
        saveShowModal(false);
      }

      const userContext: UserContextType = {
        user, 
        saveUser, 
        showModal, 
        saveShowModal,
        refunds,
        saveRefunds,
        onModalClose,
      }

    return (
        <UserContext.Provider value={ userContext }>
            {children}
        </UserContext.Provider>
    )

}

export default AuthProvider;
