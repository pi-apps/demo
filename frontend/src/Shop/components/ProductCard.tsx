import React from 'react';

interface Props {
  name: string,
  description: string,
  price: number,
  pictureCaption: string,
  pictureURL: string,
  onClickBuy: () => void,
}

export default function ProductCard(props: Props) {
  return (
    <div style={{ margin: 16, paddingBottom: 16, borderBottom: '1px solid gray' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: "33%", marginRight: 8 }}>
          <img style={{ width: "100%" }} src={props.pictureURL} alt={props.name} />
        </div>

        <div style={{ width: "66%" }}>
          <h3>{props.name}كاتب المنشور:</h3>
          <p>{props.description}محتوى المنشور:</p>          
        </div>
      </div>

      <div style={{textAlign: 'center', marginBottom: 8}}>
        <strong>{props.price}pi-π</strong> <br />
        <button onClick={props.onClickBuy}>إرسالpi</button>
      </div>

      <span style={{fontSize: '0.6em'}}>{props.pictureCaption}</span>
    </div>
  )
}
