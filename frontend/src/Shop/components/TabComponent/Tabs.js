import React from "react";
import FirstTab from "../AllTabs/FirstTab";
import SecondTab from "../AllTabs/SecondTab";
import Shop from "../..";
import SignIn from "../SignIn"
import Header from "../Header"
import HashModal from "../HashModal"

const Tabs = (props) => {

    //  Functions to handle Tab Switching
  const handleTab1 = () => {
    // update the state to tab1
    props.setActiveTabProp("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    props.updateCertificates();
    props.setActiveTabProp("tab2");
  };

  return (
    <div className="Tabs">
      {/* Tab nav */}
      {Header}
      
      <div style={{flexdirection : "row"}}>
        <ul className="nav">
          <li className={props.activeTab === "tab1" ? "active" : ""}  onClick={handleTab1}>Issuer Portal</li>
          <li className={props.activeTab === "tab2" ? "active" : ""}  onClick={handleTab2}>Received Certificates</li>
        </ul>
        {/* <div> */}
        {/* {props.user === null ? (
          <button onClick={props.onSignIn}>Sign in</button>
        ) : (
          <div>
            @{props.user.username} <button type="button" onClick={props.onSignOut}>Sign out</button>
          </div>
        )} */}
      {/* </div> */}
      </div>

      <div className="outlet">
        {/* content will be shown here */}
        {props.activeTab === "tab1" ? 
            <FirstTab 
                myUserId= {props.myUserId} 
                orderProduct={props.orderProduct}
            /> : 
            <SecondTab 
                certificateList= {props.certificateList}
            />}
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button className="button1" onClick={props.getMyUserId}>Get my User Id</button>
        <text >{props.myUserId}</text>
      </div>
      {/* <div style={{ textAlign: "center", marginBottom: 8 }}>
        <text>{test}</text>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={A2UPayment}>A2U Payment</button>
        <text>{myUserId}</texbt>
      </div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <button onClick={test1}>Test1</button>
        <text>{myUserId}</text>
      </div> */}
      {props.showModal && <SignIn onSignIn={props.signIn} onModalClose={props.onModalClose} />}
    </div>
  );
};
export default Tabs;