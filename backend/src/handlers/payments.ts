import axios from "axios";
import { Router } from "express";
import platformAPIClient from "../services/platformAPIClient";
import "../types/session";
import * as StellarSdk from "stellar-sdk";
import { NetworkPassphrase } from "pi-backend/dist/types";
import PiNetwork from "../pi-back/PiNetwork";


var currentUser: { uid: any; };
export function setCurrentUser(user:any) {
  currentUser = user;
}

var txnId: any;
const txnIds = ["0","1", "2","HwzWquhP4G6sLAhQBHNyMn6h6CHG"];



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

  //add this transaction id into the list

  //Validate payment
  router.post('/validate', async (req,res) => {
    const txnId = req.body.transactionId;
    console.log("In backedn with validate txn id  "+ txnId)
    const response = await platformAPIClient.get(`/v2/payments/${txnId}`);
    console.log("respones me "+ response);

    const resp = await platformAPIClient.get(`/v2/me`);
    // console.log("respones me "+ resp);
    if(response){
      console.log("response is "+ response.data.metadata.productId);
      console.log("response is "+ response.data.metadata.imageHashUrl);
      console.log("response is "+ response.data.metadata.email);
      return res.status(200).json({productId :response.data.metadata.productId, imageHashUrl: response.data.metadata.imageHashUrl, email : response.data.metadata.email });
    }else {
      return res.status(200).json({error : "Error occurred in blockchain api call"});
    }
  })
  
  router.post('/getTxnIds', async (req, res) => {
    return res.status(200).json({ message: txnIds });
  })

  // approve the current payment
  router.post('/approve', async (req, res) => {
     if (//!req.session.currentUser && 
      currentUser == undefined) {
      return res.status(401).json({ error: 'unauthorized', message: "User needs to sign in first" });
    }

    const app = req.app;

    const paymentId = req.body.paymentId;
    txnIds.push(paymentId);
    const currentPayment = await platformAPIClient.get(`/v2/payments/${paymentId}`);
    const orderCollection = app.locals.orderCollection;

    /* 
      implement your logic here 
      e.g. creating an order record, reserve an item if the quantity is limited, etc...
    */
    
    await orderCollection.insertOne({
      identifier : currentPayment.data.identifier,
      issuerAddress: currentUser.uid || "xyz",
      imageHashUrl: currentPayment.data.metadata.imageHashUrl || "abc",
      paymentId:paymentId || "testPaymentId",
      transactionId: "testTransactionId",
      product_id: currentPayment.data.metadata.productId,
      email: currentPayment.data.metadata.email || "xyz",
      user: currentPayment.data.metadata.id,
      txid: null,
      paid: false,
      cancelled: false,
      created_at: new Date()
    });

    // // let Pi Servers know that you're ready
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);
    // return res.status(200).json({ message: `Approved the payment ${paymentId}` , });
    return res.status(200).json(currentPayment.data);

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

  router.get('/getCertificates', async (req, res) => {
    const app = req.app;
    const orderCollection = app.locals.orderCollection;
    const order = await orderCollection.find({ user: { $in: [ currentUser?.uid || "66527e06-4d7e-43a2-80af-4927a1675387"] } }).toArray();
    return res.status(200).json(order);
  })

  router.get('/getUserId', async (req, res) => {
    return res.status(200).json({UserId : currentUser.uid });
  })
  
  router.post('/A2UTransaction', async (req, res) => {
    console.log("1");
    const userUid = "66527e06-4d7e-43a2-80af-4927a1675387"
    const paymentData = {
      "amount": 1,
      "memo": "Refund for apple pie", // this is just an example
      "metadata":{},// {productId: "apple-pie-1"},
      "uid": userUid
    }
    const app = req.app;

    const orderCollection = app.locals.orderCollection;

    console.log("here");
    const order = await orderCollection.find({ user: { $in: [ "66527e06-4d7e-43a2-80af-4927a1675387"] } }).toArray();
    console.log(await order[0]);
    // console.log(await order.size())
    return res.status(200).json(order);
  })






}
