// eslint-disable-next-line no-use-before-define
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export interface AddFundsDialogProps {
  open: boolean
  funds: number
  onClose: (isActionConfirmed: boolean) => void
}

export default function AddFundsDialog(props: AddFundsDialogProps) {
  const { onClose, funds, open } = props

  const handleClose = (event: any, isActionConfirmed: boolean) => {
    onClose(isActionConfirmed)
  }

  return (
    <Dialog onClose={ (e) => { handleClose(e, false) }} open={open}>
        <DialogTitle>
          You don't have enough funds. Do you wish to transfer the missing funds to your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { "Missing Funds: " + funds + " $" }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { handleClose(e, false) }}>Cancel</Button>
          <Button onClick={ (e) => { handleClose(e, true) }} autoFocus>
          Transfer Funds
          </Button>
        </DialogActions>
    </Dialog>
  )
}
