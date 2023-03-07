// eslint-disable-next-line no-use-before-define
import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IUser } from '../../Api/Core/Interfaces'
import Loader from 'react-loader-spinner'
import { CustomInput } from '../../Pages/Admin/AdminUserInformations/Styled'

export interface TotpInputDialogProps {
  open: boolean
  onSubmit: (code: number, user: IUser) => void
  seed: string
  user: IUser
  isOnError: boolean
}

export default function TotpInputDialog(props: TotpInputDialogProps) {
  const [code, setCode] = React.useState<number>()

  const onCodeChange = (event: any) => {
    setCode(event.target.value)
  }

  const handleSend = (event: any) => {
    props.onSubmit(code as number, props.user)
  }

  return (
    <Dialog open={props.open}>
        {props.seed === undefined
            ? <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
          : <>
        <DialogTitle>
          { 'TOTP Initialization' }
        </DialogTitle>
        <DialogContent>
        <DialogContentText id='alert-dialog-description'>
            { 'Enter this seed into TOTP device and confirm with a code generated:' }
          </DialogContentText>
          <DialogContentText id='alert-dialog-description'>
            { 'Seed: ' + props.seed }
          </DialogContentText>
          <CustomInput
            id="codeTOTP"
            label="Code TOTP"
            variant="outlined"
            InputProps={{ style: { color: '#888' } }}
            value={code}
            error={props.isOnError}
            onChange={onCodeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { handleSend(e) }}>Send</Button>
        </DialogActions> </>
        }
    </Dialog>
  )
}
