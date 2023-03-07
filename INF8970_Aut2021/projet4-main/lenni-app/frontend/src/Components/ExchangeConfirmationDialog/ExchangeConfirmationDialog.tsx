// eslint-disable-next-line no-use-before-define
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IExchangeAd } from '../../Api/Core/Interfaces'

export interface ExchangeConfirmationDialogProps {
  open: boolean
  ad: IExchangeAd
  onClose: (isActionConfirmed: boolean) => void
  isBuyAd: boolean
}

export default function ExchangeConfirmationDialog(props: ExchangeConfirmationDialogProps) {
  const { onClose, ad, open, isBuyAd } = props

  const handleClose = (event: any, isActionConfirmed: boolean) => {
    onClose(isActionConfirmed)
  }

  return (
    <Dialog onClose={ (e) => { handleClose(e, false) }} open={open}>
        <DialogTitle>
          { isBuyAd ? 'Confirm exchange' : 'The following ad will be deleted' }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            { isBuyAd ? ('Seller: ' + ad.sellerUsername) : ('Creation Date: ' + ad.timestamp) }
          </DialogContentText>
          <DialogContentText id='alert-dialog-description'>
            Points (from): {ad.pointsFrom}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description' gutterBottom>
            Supplier (from): {ad.supplierFromName}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description'>
            Points (to): {ad.pointsTo}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description' gutterBottom>
            Supplier (to): {ad.supplierToName}
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
