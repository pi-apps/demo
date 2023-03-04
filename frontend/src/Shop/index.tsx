import React, { useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import PiNetwork from "pi-backend";
import { useEffect } from "react";
import { FilePicker } from "./components/components/file-picker";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// DO NOT expose these values to public
const apiKey =
  "ghvwuiiylnxnnmbgn8kxt1oi2di6ti0zcwvynozazoujgjymbzakdd1gjv4ib3ql";
const walletPrivateSeed =
  "SBCY5AVC3RVQKBKTMSUYGAPGIPF763JTGE6Z4RO6XEO7FJNAKRHMCI4L"; // starts with S
const pi = new PiNetwork(apiKey, walletPrivateSeed);

type MyPaymentMetadata = {};

var txnIds: any[] = ["asdfakljdfklajskldfjdslk"];
var initialCertificateList : any[] = [];

type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

type certi = {
  imageUrl: "";
  name: "";
};

var initialCertis = [
  {
    imageUrl:
      "https://library.kissclipart.com/20180924/qsw/kissclipart-certificate-of-graduation-cartoon-clipart-diploma-9c6e4be89452125f.png",
    name: "BTech Degree from \nABC Institute of Technology",
  },
];

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

// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string; // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false"; // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  };
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({
  baseURL: `${backendURL}`,
  timeout: 20000,
  withCredentials: true,
  headers: {'Access-Control-Allow-Origin':"*"}
});
const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  credentials: "include",
};

export default function Shop() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hashUrl, setHashUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [viewType, setViewType] = useState<string>("issuer");
  const [txn, setTxn] = useState(["0"]);
  const [certificates, setCertificates] = useState([...initialCertis]);
  const [certificateList, setCertificateList] = useState([...initialCertificateList]);
  const [myUserId, setMyUserId] = useState("");
  const [test,setTest] = useState("");


  const signIn = async () => {
    const scopes = ["username", "payments"];
    const authResult: AuthResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );
    setTest(authResult?.user.uid)
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

  const orderProduct = async (
    memo: string,
    amount: number,
    paymentMetadata: MyPaymentMetadata
  ) => {
    if (user === null) {
      return setShowModal(true);
    }
    const paymentData = {
      amount,
      memo,
      metadata: paymentMetadata,
      uid: "66527e06-4d7e-43a2-80af-4927a1675387",
    };
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    };
    // const a = await window.Pi.authenticate();
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    // const resp = await window.Pi.getPayment("PZtlB3l9VeIe2qp4iCwYtwedgaAi");
    // console.log("here is the reposen for txn id "+ resp.data.metadata.productId);

    //     // const userUid = "hchouhan54"
    //     // const paymentData = {
    //     //   amount: 0.25,
    //     //   memo: "Refund for apple pie", // this is just an example
    //     //   metadata: {productId: "apple-pie-1"},
    //     //   uid: userUid
    //     // }
    // // It is critical that you store paymentId in your database
    // // so that you don't double-pay the same user, by keeping track of the payment.
    //     const paymentId = await window.Pi.createPayment(paymentData);
    //     const txid = await window.Pi.submitPayment(paymentId);
    //     // const payment2 = await window.Pi.createPayment(paymentData, callbacks);
    //     const completedPayment = await window.Pi.completePayment(paymentId, txid);
    //     console.log(completedPayment);
  };

  const getTxnIds = () => {
    console.log("Getting txn ids");
    const resp = axiosClient.post("/payments/getTxnIds");
    console.log("response is tx ids " + resp);
    resp.then((a) => {
      a.data?.message.forEach((a: any) => {
        console.log("adding " + a);
        setTxn((txn) => [...txn, a]);
        console.log(txn[1]);
      });
      console.log("here" + a.data?.message[0]);
    });

    return resp;
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
      // handle the error accordingly
    }
  };

  function validate(transactionId: string): void {
    console.log("validate", transactionId);
    const resp = axiosClient.post("/payments/validate", { transactionId });
  }

  const updateCertificates=()=> {
    const resp = axiosClient.get("/payments/getCertificates");
    var certis: any[] = [];
    
    resp.then((b) => {
      console.log(b);
      b.data?.forEach((a: any) => {
        console.log("adding " + a);
        console.log("adding " + a.product_id);

        certis.push(a);
      });
      console.log("here" + certis[0]);
      setCertificateList((certificateList) => [ ...certis]);
      console.log(certificateList[0])
    });
    return resp;
  }

  const getMyUserId=()=> {
    const resp = axiosClient.get("/payments/getUserId");
    resp.then((b) => {
        setMyUserId(b.data.UserId)
    })
  }

  const A2UPayment = async () => {
    console.log("test2");
    const userUid = "66527e06-4d7e-43a2-80af-4927a1675387";
    const resp = axiosClient.get("/user/test2");
  };
  const test1 = async () => {
    console.log("test");
    const userUid = "66527e06-4d7e-43a2-80af-4927a1675387";
    const resp = axiosClient.get("/user/test");
  };

  const onHashUrlChange = (url: string) => {
    console.log("inparent comp");
    setHashUrl(url);
  };
  const onEmailChange = (email: string) => {
    console.log("inparent comp");
    setEmail(email);
  };
  const onIdChange = (email: string) => {
    console.log("inparent comp");
    setId(email);
  };
  const SwtichView = () => {
    console.log("in Switch View");
    updateCertificates();
    if (viewType == "issuer") setViewType("receiver");
    else setViewType("issuer");
  };

  const issuerView = (
    <>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1>Issuer Portal</h1>
      </div>
      <ProductCard
        name="Diploma Certificate"
        description="To create degree certificate for student"
        price={0.25}
        hashUrl=""
        onHashUrlChange={onHashUrlChange}
        email=""
        onEmailChange={onEmailChange}
        id=""
        onIdChange={onIdChange}
        pictureURL="https://library.kissclipart.com/20180924/qsw/kissclipart-certificate-of-graduation-cartoon-clipart-diploma-9c6e4be89452125f.png"
        pictureCaption="Degree"
        onClickBuy={() =>
          orderProduct("create certificate", 0.25, {
            productId: "degree_certificate_1",
            imageHashUrl: hashUrl,
            email: email,
            id: id,
          })
        }
      />
      <ProductCard
        name="IOS certification"
        description="To provide ISO certification"
        price={0.5}
        hashUrl=""
        onHashUrlChange={onHashUrlChange}
        email=""
        onEmailChange={onEmailChange}
        id=""
        onIdChange={onIdChange}
        pictureURL="https://thumbs.dreamstime.com/z/iso-certified-quality-standard-seal-golden-71863423.jpg"
        pictureCaption="Picture by Sistak - https://www.flickr.com/photos/94801434@N00/5134246283, CC BY-SA 2.0"
        onClickBuy={() =>
          orderProduct("create certificate", 0.5, {
            productId: "degree_certificate_2",
            imageHashUrl: hashUrl,
            email: email,
            id: id,
          })
        }
      />
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={getMyUserId}>Get my User Id</button> 
         <text>{myUserId}</text>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
         <text>{test}</text>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={A2UPayment}>A2U Payment</button> 
         <text>{myUserId}</text>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={test1}>Test1</button> 
         <text>{myUserId}</text>
      </div>
      {showModal && <SignIn onSignIn={signIn} onModalClose={onModalClose} />}
    </>
  );

  const receiverView = (
    <>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1> Certificates received </h1>
      </div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><h3>Created at</h3></TableCell>
            <TableCell align="right"><h3>Certificate Id</h3></TableCell>
            <TableCell align="right"><h3>Email</h3></TableCell>
            <TableCell align="right"><h3>Awarded to</h3></TableCell>
            <TableCell align="right"><h3>Payment Id</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {certificateList.map((certi) => (
            <TableRow
              key={certi.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {certi.created_at}
              </TableCell>
              <TableCell align="right">{certi.product_id}</TableCell>
              <TableCell align="right">{certi.email}</TableCell>
              <TableCell align="right">{certi.user}</TableCell>
              <TableCell align="right">{certi.paymentId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );

  return (
    <>
      <Header
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        switchView={SwtichView}
      />
      {/* <FilePicker uploadURL = {"https://dlptest.com/https-post/"} accept = {"*"}></FilePicker> */}
      {viewType == "issuer" ? issuerView : receiverView}
    </>
  );
}
