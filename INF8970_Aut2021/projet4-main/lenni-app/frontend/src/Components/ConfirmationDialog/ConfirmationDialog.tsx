// eslint-disable-next-line no-use-before-define
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IAd } from '../../Api/Core/Interfaces'

export interface ConfirmationDialogProps {
  open: boolean
  ad: IAd
  onClose: (isActionConfirmed: boolean) => void
  isBuyAd: boolean
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { onClose, ad, open, isBuyAd } = props

  const handleClose = (event: any, isActionConfirmed: boolean) => {
    onClose(isActionConfirmed)
  }

  return (
    <Dialog onClose={ (e) => { handleClose(e, false) }} open={open}>
        <DialogTitle>
          { isBuyAd ? 'Confirm transaction' : 'The following ad will be deleted' }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            { isBuyAd ? ('Seller: ' + ad.clientUsername) : ('Creation Date: ' + ad.timestamp) }
          </DialogContentText>
          <DialogContentText id='alert-dialog-description'>
            Points: {ad.points}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description' gutterBottom>
            Supplier: {ad.supplierName}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description'>
            Price: {ad.price}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { handleClose(e, false) }}>Cancel</Button>
          <Button onClick={ (e) => { handleClose(e, true) }} autoFocus>
          { isBuyAd ? 'Confirm' : 'Delete' }
          </Button>
        </DialogActions>
    </Dialog>
  )
}
