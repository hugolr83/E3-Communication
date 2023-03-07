// eslint-disable-next-line no-use-before-define
import React, { Fragment } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

import { useRecoilState } from 'recoil'
import { errorState } from '../../Recoil/GlobalState'

function Alert (props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function CustomSnackbar () {
  const [currentErrorState, setCurrentErrorState] = useRecoilState(errorState)
  const HideDuration = 3000
  const vertical = 'bottom'
  const horizontal = 'left'
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setCurrentErrorState((prev) => ({ ...prev, open: false }))
  }

  return (
        <Fragment>
            <Snackbar
                open={currentErrorState.open}
                autoHideDuration={HideDuration}
                onClose={handleClose}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleClose}
                    severity={currentErrorState.severity}
                >
                    {currentErrorState.message}
                </Alert>
            </Snackbar>
        </Fragment>
  )
}
