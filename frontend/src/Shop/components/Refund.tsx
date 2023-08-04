import React, { CSSProperties } from 'react';

interface Props {
  refundedTransactionMessage: string,
  onRefundClose: () => void,
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
  justifyContent: 'center'
}

export default function Refund(props: Props) {
  return (
    <div style={modalStyle}>
      <p style={{ fontWeight: 'bold' }}>Refunded Payment</p>
      <div>
        <p>{props.refundedTransactionMessage}</p>
        <button onClick={props.onRefundClose}>Close</button>
      </div>
    </div>
  )
}