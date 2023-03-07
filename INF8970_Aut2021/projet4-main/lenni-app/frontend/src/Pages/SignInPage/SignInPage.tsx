// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { ConnectButton, Container, Form, PaperStyled, TextFieldStyled } from './Styled'
import { Typography } from '@material-ui/core'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../../Api/Auth/use-auth'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { errorState, userState } from '../../Recoil/GlobalState'
import { IClient, Severity, stateType } from '../../Api/Core/Interfaces'
import { fetchCurrentClient } from '../../Api/Core/users'
import user from '../../assets/images/lenni-logo-icon.png'

const SignInPage = () => {
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [, setUser] = useRecoilState(userState)
  const history = useHistory()
  const auth = useAuth()
  const location = useLocation<stateType>()
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
    hasErrors: false,
    pending: false
  })

  const [errorMsgs, setErrors] = useState({
    username: '',
    password: '',
    pending: ''
  })

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        // callMyFunction();
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

    if (from.pathname === '/signin') {
      history.push('/')
    } else {
      history.replace('/')
    }
  }

  const handleConnect = async () => {
    const { errors, hasErrors } = await auth.signIn(
      values.username,
      values.password,
      false // not an admin
    )

    if (!hasErrors) {
        try {
          const responseUser = await fetchCurrentClient()
          if (!responseUser.has_errors) {
            setUser(responseUser.payload as IClient)
          }
        } catch (err: any) {
          console.error('updating current user', err.msg)
        }

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
        hasErrors: false,
        pending: false
      })
    } else if (errors) {
      let tempError = {
        username: '',
        password: '',
        pending: ''
      }
      for (const err of errors) {
        if (err.param) {
          tempError = { ...tempError, [err.param]: err.msg }
        }
      }
      setErrors(tempError)
      setValues(prev => ({
        ...prev,
        hasErrors: true,
        pending: tempError.pending !== ''
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
                      Sign in
                    </h3>
                  </div>
                        <TextFieldStyled
                            id="username"
                            placeholder="Username"
                            error={!!errorMsgs.username}
                            helperText={errorMsgs.username ? 'Must be between 3 and 10 characters long' : ''}
                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            value={values.username}
                            onChange={handleChange('username')}
                        />
                        <TextFieldStyled
                            id="password"
                            placeholder="Password"
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

                        {values.hasErrors && !values.pending && (
                            <Typography color="error">Incorrect username and/or password</Typography>
                        )}

                        {values.hasErrors && values.pending && (
                            <Typography color="error">{errorMsgs.pending}</Typography>
                        )}

                        <ConnectButton
                            onClick={handleConnect}
                            variant="contained"
                            color="primary"
                        >
                            Connect
                        </ConnectButton>
                        <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/signup">Signup</NavLink></p>
                    </Form>
            </PaperStyled>
        </Container>
  )
}

export default SignInPage
