import AspectRatio from '@mui/joy/AspectRatio';
import { Button, Grid } from '@mui/material';

/*
* the RefundCard is used to create the standard output of pies
* on the App to User refunds page of the app.
*/

interface Props {
  name: string,
  description: string,
  pictureCaption: string,
  pictureURL: string,
  amount: number,
  onClickRefund: () => void,
}

export default function RefundCard(props: Props) {
  return (
    <Grid>
    { (props.name === 'none')? 
        <Grid container style={{ margin: 16, borderBottom: '1px solid gray' }}>
            <Grid container style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item style={{ width: "33%", marginRight: 8 }}> 
                </Grid>

                <Grid container style={{ width: "66%" }}>
                <strong>App to Pioneer Payment Demonstration</strong> 
                <ol>
                    <li>Sign in above</li>
                    <li>Purchase a pie using test-Pi</li>
                    <li>A refund feature will become available</li>
                </ol>
                </Grid>
            </Grid>
        </Grid>   
        :
        <Grid container style={{ margin: 16, paddingBottom: 16, borderBottom: '1px solid gray' }}>
            <Grid container style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item style={{ width: "33%", marginRight: 8 }}>
                    <AspectRatio sx={{ width: 300 }}>
                        <img style={{ width: "100%" }} src={props.pictureURL} alt={props.name} />
                    </AspectRatio>
                </Grid>
                
                <Grid item style={{ width: "66%" }}>
                    {props.name ==="lemon_pie_1" ? <h3>Refund Order: Lemon Meringue Pie</h3> : <h3>Refund Order: Apple Pie</h3> }
                    <p>{props.description}</p> 
                </Grid>
            </Grid>

         
            <Grid container>
            <Grid item style={{textAlign: 'center', margin: 8}}>
                <strong>Eligible Refund: {props.amount} Test-π</strong> <br />
                <Button variant='contained' color='secondary' onClick={() => {props.onClickRefund()}}>Refund</Button>
            </Grid>
            <Grid item>
                <span style={{fontSize: '0.6em'}}>{props.pictureCaption}</span>
            </Grid>
            </Grid>
        </Grid>
    }    
    </Grid>
  )
}