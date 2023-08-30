import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

/*
* this card displays the Sign-In alert when a user is not signed in
*/

interface Props {
  onSignIn: () => void,
  onModalClose: () => void,
  showModal: boolean,
}

export default function SignIn(props: Props) {
  return (
    <Dialog
    open={props.showModal}
    onClose={props.onModalClose}
  >
    <DialogContent>
      <DialogContentText>
          You need to sign in first.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onSignIn}>Sign In</Button>
      <Button onClick={props.onModalClose}>Close</Button>
    </DialogActions>
  </Dialog>
  )
}