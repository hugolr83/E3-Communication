// eslint-disable-next-line no-use-before-define
import React, { Fragment } from 'react'
import FaceIcon from '@material-ui/icons/Face'
import { Date, ButtonsContainer, Container, NameInfo, ButtonStyled } from './Styled'
import { IUser, Severity } from '../../Api/Core/Interfaces'
import { Typography } from '@material-ui/core'
import { updatePendingUser, deleteUser, addPointsToClient } from '../../Api/Core/users'
import { fetchInitTotp, sendTotpVerify } from '../../Api/Auth/totp'
import TotpInputDialog from '../TotpInputDialog/TotpInputDialog'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../Recoil/GlobalState'

interface PendingUserListProps {
  setCurrentUsers: React.Dispatch<React.SetStateAction<IUser[]>>
  currentUsers: IUser[]
}

const PendingUserList = ({ currentUsers, setCurrentUsers }: PendingUserListProps) => {
  const [totpDisplay, setTotpDisplay] = React.useState(false)
  const [totpSeed, setTotpSeed] = React.useState('')
  const [isOnError, setIsOnError] = React.useState(false)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const handleTotpInput = (code: number, user: IUser) => {
    (async() => {
    const { payload } = await sendTotpVerify(user, code)
    console.log(payload[0].msg)
    if (payload[0].msg === "unverified") {
      setIsOnError(true)
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Unable to validate code',
        severity: Severity.Error
      }))
    } else if (payload[0].msg === "verified") {
      setIsOnError(false)
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'TOTP Verified',
        severity: Severity.Success
      }))
      setTotpDisplay(false)
      const { errors, hasErrors } = await addPointsToClient(user)
      if (hasErrors) {
        console.log(errors)
      }
    }
    })()
  }

  const handleUpdatePending = (user: IUser) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCurrentUsers(currentUsers.filter((s) => s.firstname !== user.firstname))
    const { errors, hasErrors } = await updatePendingUser(user)

    if (hasErrors) {
      // User cannot be approved directly because he needs an TOTP Initialization
      if (errors && errors[0].msg === 'Cannot update client using TOTP') {
        setTotpDisplay(true)
        const { hasErrors, payload } = await fetchInitTotp(user)
        console.log(payload)
        if (!hasErrors) {
          setTotpSeed(payload.secret)
        }
      }
      console.log(errors)
    } else {
      const { errors, hasErrors } = await addPointsToClient(user)
      if (hasErrors) {
        console.log(errors)
      }
    }
  }

  const handleDeleteButton = (user: IUser) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCurrentUsers(currentUsers.filter((s) => s.firstname !== user.firstname))
    const { errors, hasErrors } = await deleteUser(user)
    if (hasErrors) {
      console.log(errors)
    }
  }

  return (
    <Fragment>
      {currentUsers
        .map((user, index) => {
          return (
            user.pending &&
            <Container>
              <FaceIcon color="secondary" fontSize="large" />
              <NameInfo>
                <Typography color="textSecondary">
                  {user.firstname + ' ' + user.lastname}
                </Typography>

                <Typography color="secondary">
                  {user.userInfo.email}
                </Typography>
              </NameInfo>

              <Date>
                <Typography color="secondary">
                  {user.userInfo.registrationDate}
                </Typography>
              </Date>
              <ButtonsContainer>
                <ButtonStyled size="medium" variant="contained" onClick={handleUpdatePending(user)}>
                  <Typography color="textSecondary">
                    accept
                  </Typography>
                </ButtonStyled>
                <ButtonStyled size="medium" variant="contained" color="secondary" onClick={handleDeleteButton(user)}>
                  <Typography color="textSecondary">
                    reject
                  </Typography>
                </ButtonStyled>
              </ButtonsContainer>
              <TotpInputDialog
                open={totpDisplay}
                onSubmit={handleTotpInput}
                seed={totpSeed}
                user={user}
                isOnError={isOnError}
              />
            </Container>
          )
        })}
    </Fragment>
  )
}

export default PendingUserList
