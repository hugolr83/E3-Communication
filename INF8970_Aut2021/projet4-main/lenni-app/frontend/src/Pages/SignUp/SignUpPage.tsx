/* eslint-disable no-use-before-define */
import React from 'react'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Container, ToggleButtonStyled, Separator } from './Styled'
import ClientSignUpPage from '../Client/ClientSignUp/ClientSignUpPage'
import SupplierSignUpPage from '../Supplier/SupplierSignUp/SupplierSignUpPage'

export default function SignUp() {
  const [userInfo, setUserInfo] = React.useState('client')

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newUserInfo: string
  ) => {
    if (newUserInfo !== null) {
      setUserInfo(newUserInfo)
    }
  }

  return (
    <Container>
    <div style={{
      display: 'inline',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      marginTop: '50px',
      marginBottom: '10px'
    }}
    >
    <ToggleButtonGroup
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      color="primary"
      value={userInfo}
      exclusive
      onChange={handleChange}
    >
      <ToggleButtonStyled style={{ backgroundColor: '#ffffff', border: 1 }} value='client'>Client</ToggleButtonStyled>
      <Separator></Separator>
      <ToggleButtonStyled style={{ backgroundColor: '#ffffff', border: 1 }} value='supplier'>Supplier</ToggleButtonStyled>
    </ToggleButtonGroup>
    {userInfo === 'client'
      ? <ClientSignUpPage/>
      : <SupplierSignUpPage/>
    }
    </div>
    </Container>
  )
}
