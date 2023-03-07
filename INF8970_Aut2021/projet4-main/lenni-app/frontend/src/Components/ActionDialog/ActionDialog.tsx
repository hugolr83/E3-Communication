// eslint-disable-next-line no-use-before-define
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IExchangeAd } from '../../Api/Core/Interfaces'

export interface ActionDialogProps {
  open: boolean
  ad: IExchangeAd
  onAction: (isActionConfirmed: boolean) => void
  isActionAd: boolean
  titleDialog: string
}

export default function ActionDialog(props: ActionDialogProps) {
  const { onAction, ad, open, isActionAd } = props

  const handleAction = (event: any, isActionConfirmed: boolean) => {
    onAction(isActionConfirmed)
  }

  return (
    <Dialog onClose={ (e) => { handleAction(e, false) }} open={open}>
        <DialogTitle>
          { isActionAd ? props.titleDialog : 'This Pending ad will be deleted' }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            { isActionAd ? ('Seller: ' + ad.sellerUsername) : ('Creation Date: ' + ad.timestamp) }
          </DialogContentText>
          <DialogContentText id='alert-dialog-description' gutterBottom>
            SupplierFrom: {ad.supplierFromName}
          </DialogContentText>
          <DialogContentText id='alert-dialog-description' gutterBottom>
            SupplierTo: {ad.supplierToName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { handleAction(e, false) }}>Cancel</Button>
          <Button onClick={ (e) => { handleAction(e, true) }} autoFocus>
          { isActionAd ? 'Confirm' : 'Delete' }
          </Button>
        </DialogActions>
    </Dialog>
  )
}
