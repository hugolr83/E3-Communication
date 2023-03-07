// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IExchangeAd, IPoints, Severity } from '../../Api/Core/Interfaces'
import { getClientPoints } from '../../Api/Core/users'
import { errorState } from '../../Recoil/GlobalState'
import { TextFieldStyled, InputLabelStyled } from './Styled'

export interface EditExchangeAdDialogProps {
  open: boolean
  ad: IExchangeAd
  onClose: (isEditing: boolean, pointsFrom: number, pointsTo: number) => void
}

export default function EditExchangeAdDialog(props: EditExchangeAdDialogProps) {
  const { onClose, ad, open } = props
  const [maxPoints, setMaxPoints] = useState(0)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [values, setValues] = useState({
    pointsFrom: 0,
    pointsTo: 0

})

useEffect(() => {
  let disposed = false;
  (async () => {
    try {
      setValues({ pointsFrom: ad.pointsFrom, pointsTo: ad.pointsTo })
      const response = await getClientPoints()
      if (disposed) return
      if (!response.hasErrors) {
        const res: IPoints[] = response.payload
        const supplierFromPoint = res.find((point) => point.supplierID === ad.supplierFromID)
        setMaxPoints(supplierFromPoint ? supplierFromPoint.quantity : 0)
      } else {
        console.error('🚀 ~ EditExchangeAdDialog ~ getClientPoints')
        setCurrentErrorState((prev) => ({
          ...prev,
          open: true,
          message: 'something went wrong',
          severity: Severity.Error
        }))
      }
    } catch (err: any) {
      console.error(err.msg)
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: err.msg,
        severity: Severity.Error
      }))
    }
  })()
  return () => {
    disposed = true
  }
}, [ad])

  const handleClose = (event: any, isEditing: boolean) => {
    onClose(isEditing, values.pointsFrom, values.pointsTo)
  }

  const handleQuantityFromChange = () => (event: any) => {
      let quantity: number = Math.round(event.target.value)
      if (quantity < 0) {
          quantity = 0
      }

      if (quantity > maxPoints) {
          quantity = maxPoints
      }
      setValues({ ...values, pointsFrom: quantity })
  }

  const handleQuantityToChange = () => (event: any) => {
    let quantity: number = Math.round(event.target.value)
    if (quantity < 0) {
        quantity = 0
    }
    setValues({ ...values, pointsTo: quantity })
}

  return (
    <Dialog onClose={ (e) => { handleClose(e, false) }} open={open}>
        <DialogTitle>
          Update your ad
        </DialogTitle>
        <DialogContent>
          <InputLabelStyled id="price-label" >FROM</InputLabelStyled>
          <DialogContentText id="alert-dialog-description" gutterBottom>
            Supplier: {ad.supplierFromName}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" gutterBottom>
            Points:
          </DialogContentText>
          <TextFieldStyled
            id="pointsFrom"
            placeholder="PointsFrom"
            variant="filled"
            InputProps={{ style: { color: '#888' } }}
            value={values.pointsFrom}
            onChange={handleQuantityFromChange()}
            type='number'
            inputProps={{
              max: maxPoints,
              min: 0
            }}
          />

          <InputLabelStyled id="price-label" >TO</InputLabelStyled>
          <DialogContentText id="alert-dialog-description" gutterBottom>
            Supplier: {ad.supplierToName}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" gutterBottom>
            Points:
          </DialogContentText>
          <TextFieldStyled
            id="pointsTo"
            placeholder="PointsTo"
            variant="filled"
            InputProps={{ style: { color: '#888' } }}
            value={values.pointsTo}
            onChange={handleQuantityToChange()}
            type='number'
            inputProps={{
              min: 0
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { handleClose(e, false) }}>Cancel</Button>
          <Button onClick={ (e) => { handleClose(e, true) }} autoFocus>
          Update
          </Button>
        </DialogActions>
    </Dialog>
  )
}
