import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

/*
* this card displays the alert message that a refund has been processed
*/

interface Props {
  refundedTransaction: {
    message: string,
    block_explorer_link: string
  },
  showRefundAlert: boolean,
  onRefundClose: () => void,
}

export default function Refund(props: Props) {
  return (
    <Dialog
    open={props.showRefundAlert}
    onClose={props.onRefundClose}
  >
    <DialogContent>
      <DialogContentText marginTop={1}>
        {props.refundedTransaction.message}
        </DialogContentText>
        <DialogContentText marginTop={2}>
        <a href={props.refundedTransaction.block_explorer_link}>View on the Pi Block Explorer</a>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onRefundClose}>Close</Button>
    </DialogActions>
  </Dialog>
  )
}