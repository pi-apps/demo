import React, { CSSProperties } from 'react';

interface Props {
  onCopy: () => void,
  onModalClose: () => void,
  isCopied:boolean
}

const modalStyle: CSSProperties = {
  background: 'white', 
  position: 'absolute', 
  left: '15vw', 
  top: '40%', 
  width: '70vw', 
  height: '25vh', 
  border: '1px solid black', 
  textAlign: 'center', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center',
  alignSelf:'center'
}

export default function HashModal(props: Props) {
  
  return (
    <div style={modalStyle}>
      <p style={{ fontWeight: 'bold', color:"black" , paddingBottom:20}}>Create a hash from https://hash.online-convert.com/md5-generator</p>
      
      
      <div style={{padding:10}}>
        <button onClick={props.onCopy} style={{ marginRight: '1em' }} >
          {props.isCopied ? 'Copied!' : 'Copy link'}
        </button>
        <button onClick={props.onModalClose}>Close</button>
      </div>
    </div>
  )
}