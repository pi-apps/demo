import React from 'react';

interface Props {
  name: string,
  description: string,
  pictureCaption: string,
  pictureURL: string,
  amount: number,
  onClickRefund: () => void,
  checkRefundablePayments: ()=> void
}

export default function RefundCard(props: Props) {
  return (
    <div>
    { (props.name === 'none')? 
        <div style={{ margin: 16, borderBottom: '1px solid gray' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: "33%", marginRight: 8 }}> 
                </div>

                <div style={{ width: "66%" }}>
                <strong>App to Pioneer Payment Demonstration</strong> 
                <ol>
                    <li>Sign in above</li>
                    <li>Purchase a pie using test-Pi</li>
                    <li>A refund feature will become available</li>
                </ol>
                </div>
            </div>
        </div>   
        :
        <div style={{ margin: 16, paddingBottom: 16, borderBottom: '1px solid gray' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: "33%", marginRight: 8 }}>
                    <img style={{ width: "100%" }} src={props.pictureURL} alt={props.name} />
                </div>
                
                <div style={{ width: "66%" }}>
                    {props.name ==="lemon_pie_1" ? <h3>Refund Order: Lemon Meringue Pie</h3> : <h3>Refund Order: Apple Pie</h3> }
                    <p>{props.description}</p> 
                </div>
            </div>

         
            <div style={{textAlign: 'center', marginBottom: 8}}>
                <strong>Eligible Refund: {props.amount} Test-π</strong> <br />
                <button onClick={props.onClickRefund}>Refund Previous</button>
            </div>
            <span style={{fontSize: '0.6em'}}>{props.pictureCaption}</span>
        </div>
    }    
    </div>
  )
}