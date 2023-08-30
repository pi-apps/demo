import axios from "axios";
import { Router } from "express";
import platformAPIClient from "../services/platformAPIClient";
import "../types/session";
import PiNetwork from 'pi-backend';
import env from "../environments";

/*
* payment implementations are explained in our SDKs linked below, for more information
* User to App Payments - https://github.com/pi-apps/pi-platform-docs/blob/master/README.md
* App to User Payments - https://github.com/pi-apps/pi-platform-docs/blob/master/payments_advanced.md
*/


// DO NOT expose these values to public
const pi = new PiNetwork(env.pi_api_key, env.wallet_secret_seed);

export default function mountPaymentsEndpoints(router: Router) {
  
    // handle the incomplete payment
    router.post('/incomplete', async (req, res) => {
      const payment = req.body.payment;
      const paymentId = payment.identifier;
      const txid = payment.transaction && payment.transaction.txid;
      const txURL = payment.transaction && payment.transaction._link;
  
      /* 
        implement your logic here
        e.g. verifying the payment, delivering the item to the user, etc...
  
        below is a naive example
      */
  
      // find the incomplete order
      const app = req.app;
      const orderCollection = app.locals.orderCollection;
      const order = await orderCollection.findOne({ pi_payment_id: paymentId });
  
      // order doesn't exist 
      if (!order) {
        return res.status(400).json({ message: "Order not found" });
      }
  
      // check the transaction on the Pi blockchain
      const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
      const paymentIdOnBlock = horizonResponse.data.memo;
  
      // and check other data as well e.g. amount
      if (paymentIdOnBlock !== order.pi_payment_id) {
        return res.status(400).json({ message: "Payment id doesn't match." });
      }
  
      // mark the order as paid
      await orderCollection.updateOne({ pi_payment_id: paymentId }, { $set: { txid, paid: true } });
  
      // let Pi Servers know that the payment is completed
      await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
      return res.status(200).json({ message: `Handled the incomplete payment ${paymentId}` });
    });

  /* 
  * 
  * USER TO APP PAYMENT
  * 
  */ 

  // approve the current payment
  router.post('/approve', async (req, res) => {
    if (!req.session.currentUser) {
      return res.status(401).json({ error: 'unauthorized', message: "User needs to sign in first" });
    }

    const app = req.app;

    const paymentId = req.body.paymentId;
    const currentPayment = await platformAPIClient.get(`/v2/payments/${paymentId}`);
    console.log(currentPayment);
    const orderCollection = app.locals.orderCollection;

    /* 
      implement your logic here 
      e.g. creating an order record, reserve an item if the quantity is limited, etc...
    */

    await orderCollection.insertOne({
      pi_payment_id: paymentId,
      product_id: currentPayment.data.metadata.productId,
      user: req.session.currentUser.uid,
      amount: currentPayment.data.amount,
      txid: null,
      paid: false,
      cancelled: false,
      completed: false,
      created_at: new Date(),
      is_refund: false,
      refunded_at: null
    });

    // let Pi Servers know that you're ready
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);
    return res.status(200).json({ message: `Approved the payment ${paymentId}` });
  });

  // complete the current payment
  router.post('/complete', async (req, res) => {
    const app = req.app;

    const paymentId = req.body.paymentId;
    const txid = req.body.txid;
    const orderCollection = app.locals.orderCollection;

    /* 
      implement your logic here
      e.g. verify the transaction, deliver the item to the user, etc...
    */

    await orderCollection.updateOne({ pi_payment_id: paymentId }, { $set: { txid: txid, paid: true } });

    // let Pi server know that the payment is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
    return res.status(200).json({ message: `Completed the payment ${paymentId}` });
  });

  // handle the cancelled payment
  router.post('/cancelled_payment', async (req, res) => {
    const app = req.app;

    const paymentId = req.body.paymentId;
    const orderCollection = app.locals.orderCollection;

    /*
      implement your logic here
      e.g. mark the order record to cancelled, etc...
    */

    await orderCollection.updateOne({ pi_payment_id: paymentId }, { $set: { cancelled: true } });
    return res.status(200).json({ message: `Cancelled the payment ${paymentId}` });
  })

  
  /* 
  * 
  * APP TO USER PAYMENT
  * 
  */ 
  
  // method that searches the database and returns any eligible refunds for the user
  router.post('/refundable_payment', async (req, res) => {
    if (!req.session.currentUser) {
      
      return res.status(401).json({ error: 'unauthorized', message: "User needs to sign in first" });
    }
  
    /*
      implement your logic here
      e.g. mark the order record to cancelled, etc...
    */

    const app = req.app;
    const user = req.session.currentUser.uid;
    
    const orderCollection = app.locals.orderCollection;

    const refundableOrders = await orderCollection.find({ user: user, paid: true, is_refund: false, refunded_at: null }).toArray();
    console.log(refundableOrders);
    
    return res.status(200).json({message: `Orders Eligible for Refund`, refundableOrders: refundableOrders });

  });

  // method that processes the refund
  router.post('/refundable_payment/refund_payment', async (req, res) => {
    if (!req.session.currentUser) { 
      return res.status(401).json({ error: 'unauthorized', message: "User needs to sign in first" });
    }

    /*
      implement your logic here
      e.g. mark the order record to cancelled, etc...
    */

    // set the variables from the request to process the refund
    const app = req.app;
    const userUid = req.session.currentUser.uid;

    const refundedMemo = req.body.memo;
    const refundedPaymentID = req.body.refundPaymentID;

    const orderCollection = app.locals.orderCollection;

    // find the order to refund
    const order= await orderCollection.findOne({ pi_payment_id: refundedPaymentID });

    // order doesn't exist 
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    // create the url with the TxID to query the blockchain for the transaction information
    const horizonURL = `https://api.testnet.minepi.com/transactions/${order.txid}/operations`

    // check the transaction on the Pi testnet blockchain
    const horizonResponse = await axios.get(horizonURL);
    const paymentIdOnBlock = horizonResponse.data.memo;

    const horizonAmount = horizonResponse.data._embedded.records[0].amount;
    const horizonTXID = horizonResponse.data._embedded.records[0].transaction_hash;

    // build Refund Transaction
    const paymentData = {
      amount: horizonAmount, // use the amount from the blockchain since this is the amount that was transacted
      memo: refundedMemo, // this is just an example
      metadata: {refunded_txid: horizonTXID},
      uid: userUid
    }

    try {
    // mark payment as refunded prior to refund to prevent double entry
    await orderCollection.updateOne({ pi_payment_id: refundedPaymentID }, { $set: { refunded_at: new Date() } });
  
    //Send Refund Transaction
    const paymentId = await pi.createPayment(paymentData);


    // save the payment information in the DB
    await orderCollection.insertOne({
      pi_payment_id: paymentId,
      product_id: `Refunded Payment ${horizonTXID}`,
      user: req.session.currentUser.uid,
      amount: horizonAmount,
      txid: null,
      paid: false,
      cancelled: false,
      created_at: new Date(),
      is_refund: true,
      refunded_at: null
    });

    // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
    const refundTxId = await pi.submitPayment(paymentId);

    // update the Refund PaymentID with the txid
    await orderCollection.updateOne({ pi_payment_id: paymentId }, { $set: { txid: refundTxId, paid: true } });

    // complete the payment
    await pi.completePayment(paymentId, refundTxId); 

    // return success to the front end
    return res.status(200).json({message: `Payment: ${refundedPaymentID} was refunded with transaction ${refundTxId}`, block_explorer_link: `https://blockexplorer.minepi.com/tx/${refundTxId}`});
    } catch (error) {
      console.log(error)
    }
  });
}