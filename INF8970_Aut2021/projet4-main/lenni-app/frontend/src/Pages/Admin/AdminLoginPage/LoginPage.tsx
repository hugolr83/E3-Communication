// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { ConnectButton, Container, Form, PaperStyled, TextFieldStyled } from './Styled'
import { Typography } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../../../Api/Auth/use-auth'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../../Recoil/GlobalState'
import { Severity, stateType } from '../../../Api/Core/Interfaces'
import user from '../../../assets/images/user/user.svg'

const AdminLoginPage = () => {
  const setCurrentErrorState = useSetRecoilState(errorState)
  const history = useHistory()
  const auth = useAuth()
  const location = useLocation<stateType>()
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
    hasErrors: false
  })

  const [errorMsgs, setErrors] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        console.log('Enter key was pressed. Run your function.')
        event.preventDefault()
        handleConnect()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [values])

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const redirect = () => {
    const { from } = location.state || { from: { pathname: '/' } }

    if (from.pathname === '/login') {
      history.push('/')
    } else {
      history.replace('/')
    }
  }

  const handleConnect = async () => {
    console.log('🚀 ~ setCurrentErrorState ~ severity')
    const { errors, hasErrors } = await auth.signIn(
      values.username,
      values.password,
      true
    )

    if (!hasErrors) {
      redirect()
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'welcome, you\'re now connected',
        severity: Severity.Success
      }))
      setValues({
        username: '',
        password: '',
        showPassword: false,
        hasErrors: false
      })
    } else if (errors) {
      let tempError = {
        username: '',
        password: ''
      }
      for (const err of errors) {
        if (err.param) {
          tempError = { ...tempError, [err.param]: err.msg }
        }
      }
      setErrors(tempError)
      setValues(prev => ({
        ...prev,
        hasErrors: true
      }))

      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'something went wrong',
        severity: Severity.Error
      }))
    } else {
      setValues(prev => ({
        ...prev,
        hasErrors: true
      }))
    }
  }

  return (
        <Container>
            <PaperStyled>
                <Form>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={user}/>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                    <h3>
                      Login
                    </h3>
                  </div>
                        <TextFieldStyled
                            id="username"
                            placeholder="username"
                            error={!!errorMsgs.username}
                            helperText={errorMsgs.username ? 'Must be between 3 and 10 characters long' : ''}
                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            value={values.username}
                            onChange={handleChange('username')}
                        />
                        <TextFieldStyled
                            id="password"
                            placeholder="password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            error={!!errorMsgs.password}
                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            onChange={handleChange('password')}
                        />
                        <div className="form-group text-left">
                            <div className="checkbox checkbox-fill d-inline">
                                <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleClickShowPassword}/>
                                    <label htmlFor="checkbox-fill-a1" className="cr"> Show Password </label>
                            </div>
                        </div>
                        {values.hasErrors && (
                            <Typography color="error">Incorrect username and/or password</Typography>
                        )}
                        <ConnectButton
                            onClick={handleConnect}
                            variant="contained"
                            color="primary"
                        >
                            Connect
                        </ConnectButton>
                    </Form>
            </PaperStyled>
        </Container>
  )
}

export default AdminLoginPage
