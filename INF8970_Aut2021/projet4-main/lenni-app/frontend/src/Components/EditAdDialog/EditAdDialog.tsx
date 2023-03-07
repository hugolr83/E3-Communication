// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IAd, IPoints, Severity } from '../../Api/Core/Interfaces'
import { getClientPoints } from '../../Api/Core/users'
import { errorState } from '../../Recoil/GlobalState'
import { TextFieldStyled, InputLabelStyled } from './Styled'

export interface EditAdDialogProps {
  open: boolean
  ad: IAd
  onClose: (isEditing: boolean, points: number, price: number) => void
}

export default function EditAdDialog(props: EditAdDialogProps) {
  const { onClose, ad, open } = props
  const [maxPoints, setMaxPoints] = useState(0)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [values, setValues] = useState({
    points: 0,
    price: 0

})

useEffect(() => {
  let disposed = false;
  (async () => {
    try {
      setValues({ points: ad.points, price: ad.price })
      const response = await getClientPoints()
      if (disposed) return
      if (!response.hasErrors) {
        const res: IPoints[] = response.payload
        const supplierPoint = res.find((point) => point.supplierID === ad.supplierID)
        setMaxPoints(supplierPoint ? supplierPoint.quantity : 0)
      } else {
        console.error('🚀 ~ EditAdDialog ~ getClientPoints')
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
    onClose(isEditing, values.points, values.price)
  }

  const handleQuantityChange = () => (event: any) => {
      let quantity: number = Math.round(event.target.value)
      if (quantity < 0) {
          quantity = 0
      }

      if (quantity > maxPoints) {
          quantity = maxPoints
      }
      setValues({ ...values, points: quantity })
  }

  const handlePriceChange = () => (event: any) => {
      let price: number = event.target.value
      if (price < 0) {
          price = 0
      }
      setValues({ ...values, price: price })
  }

  return (
    <Dialog onClose={ (e) => { handleClose(e, false) }} open={open}>
        <DialogTitle>
          Update your ad
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" gutterBottom>
            Supplier: {ad.supplierName}
          </DialogContentText>
          <InputLabelStyled id="points-label" >Points</InputLabelStyled>
          <TextFieldStyled
            id="points"
            placeholder="Points To Sell"
            variant="filled"
            InputProps={{ style: { color: '#888' } }}
            value={values.points}
            onChange={handleQuantityChange()}
            type='number'
            inputProps={{
              max: maxPoints,
              min: 0
            }}
          />

          <InputLabelStyled id="price-label" >Price</InputLabelStyled>
          <TextFieldStyled
            id="price"
            placeholder="Price"
            variant="filled"
            InputProps={{ style: { color: '#888' } }}
            value={values.price}
            onChange={handlePriceChange()}
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
