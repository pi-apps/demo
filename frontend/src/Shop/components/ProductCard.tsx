import React, { useEffect, useState } from "react";
import {
  isPropertySignature,
  isWhiteSpaceLike,
  setConstantValue,
} from "typescript";
import HashModal from "./HashModal";

interface Props {
  name: string;
  description: string;
  price: number;
  pictureCaption: string;
  pictureURL: string;
  onClickBuy: () => void;
  onHashUrlChange: (arg: string) => void;
  onEmailChange: (arg: string) => void;
  onIdChange: (arg: string) => void;
  hashUrl: string;
  email: string;
  id: string;
}

export default function ProductCard(props: Props) {
  const [hashUrl, setHashUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [showModal, setShowModal] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text:string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard("https://hash.online-convert.com/md5-generator")
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function showHashModal() {
    setShowModal("true");
  }

  function onCopy() {
    handleCopyClick();
  }

  function hideHashModal() {

    setShowModal("false");
  }

  function onUrlChange(_event: any) {
    // onHashUrlChange();
    console.log("colled onUrlChange in sub " + _event.target.value);
    setHashUrl(_event.target.value);
    props.onHashUrlChange(_event.target.value);
  }
  function onEmailChange(_event: any) {
    // onHashUrlChange();
    console.log("colled emailChange in sub " + _event.target.value);
    setEmail(_event.target.value);
    props.onEmailChange(_event.target.value);
  }
  function onIdChange(_event: any) {
    // onHashUrlChange();
    console.log("colled id in sub " + _event.target.value);
    setId(_event.target.value);
    props.onIdChange(_event.target.value);
  }
  return (
    <div
      style={{ margin: 16, paddingBottom: 16,paddingTop:16, borderBottom: "1px solid gray",borderTop: "1px solid gray" }}
    >
      <div style={{ display: "flex", flexDirection: "row" , alignItems:"center"}}>
        <div style={{ width: "33%", marginRight: 8 }}>
          <img
            style={{ width: "100%" }}
            src={props.pictureURL}
            alt={props.name}
          />
        </div>

        <div style={{ width: "66%" ,color : "#FFFFFF", marginLeft:10 }}>
          <h3>{props.name}</h3>
          <p>{props.description}</p>
          <div style={{padding:10, marginLeft:5}}>
          <p style={{ paddingRight:5}}>
            <label>Enter HashURL:</label>&nbsp;&nbsp;
            <input type="text" value={hashUrl} onChange={onUrlChange} style={{ paddingLeft:5}}/>
            <button style={{paddingLeft:5, paddingRight:5, borderRadius:"2rem"}} onClick={showHashModal}>i</button>
          </p>
          
          { (showModal=="true") && <HashModal onCopy={onCopy} onModalClose={hideHashModal} isCopied={isCopied} />}
          <p> 
            <label>Enter Email:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" value={email} onChange={onEmailChange} />
          </p>
          <p>
          <label>Enter UserId:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" value={id} onChange={onIdChange} />
          </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <strong>{props.price} Test-π</strong> <br />
        <button className="button" onClick={props.onClickBuy}>Order</button>
      </div>

      <span style={{ fontSize: "0.6em" }}>{props.pictureCaption}</span>
    </div>
  );
}
