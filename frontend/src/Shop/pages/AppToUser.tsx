import RefundCard from "../components/RefundCard";
import Footer from "../components/Footer";
import SignIn from "../components/SignIn";
import Header from "../components/Header";
import { RefundType, UserContextType, WindowWithEnv } from "../components/Types";
import { Typography } from "@mui/material";
import { UserContext } from "../components/Auth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Refund from "../components/Refund";

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;
const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});

/*
* this page retrieves and displays all the eligible refunds a user has. 
* it will execute the refund when signaled by the user and return an alert when done.
*/

export default function AppToUserPayments() {
  const { user, saveUser, saveShowModal, showModal, refunds, saveRefunds, onModalClose } = React.useContext(UserContext) as UserContextType;
  const [showRefundAlert, setShowRefundAlert] = useState(false);
  const [refundInfoState, setRefundInformation] = useState<{message: string, block_explorer_link: string}>({message: "", block_explorer_link: ""});

  const orderRefund = async (memo: string, originalPayment: RefundType) => {
    if(user === null) {
      return saveShowModal(true);
    }

    const refundPaymentID = originalPayment.pi_payment_id;
    const refundPaymentAmount = originalPayment.amount;
    const paymentData = { memo, refundPaymentID, refundPaymentAmount};
    const refundInformation: typeof refundInfoState  = await axiosClient.post('/payments/refundable_payment/refund_payment', paymentData);

    setRefundInformation(refundInformation);
    setShowRefundAlert(true);
    saveRefunds();
  }

  useEffect(() => {
    saveRefunds();
  }, []);

return (    
        <>
            <Header/>
            <Typography variant="h4" margin={3}>
              App to User Payments
            </Typography>
            {
            refunds[0] === undefined || refunds[0]._id === '' ? 
            <RefundCard 
            name= 'none'
            description= "Did the delivery person eat your pie and now you need a refund?"
            pictureCaption="Picture by David McLeish - https://www.flickr.com/photos/shishberg/2310078068/, CC BY-SA 2.0"
            pictureURL="https://live.staticflickr.com/2143/2310078068_627e69cea2_k.jpg"
            amount={1}
            onClickRefund={()=> saveRefunds()}
            />
            :
            refunds.map((order: RefundType) =>{
                return <RefundCard
                  key={order.product_id}
                  name={order.product_id}
                  description= "Did the delivery person eat your pie and now you need a refund?"
                  pictureCaption="Picture by David McLeish - https://www.flickr.com/photos/shishberg/2310078068/, CC BY-SA 2.0"
                  pictureURL="https://live.staticflickr.com/2143/2310078068_627e69cea2_k.jpg"
                  amount={order.amount}
                  onClickRefund={()=> orderRefund("User Requested Refund", order)}
                />
              })
            }

            { showModal && <SignIn onSignIn={saveUser} onModalClose={onModalClose} /> }
            { showRefundAlert && <Refund refundedTransactionMessage={refundInfoState.message} onRefundClose={() => setShowRefundAlert(false)} /> }
            <Footer/>
        </>
    )
}