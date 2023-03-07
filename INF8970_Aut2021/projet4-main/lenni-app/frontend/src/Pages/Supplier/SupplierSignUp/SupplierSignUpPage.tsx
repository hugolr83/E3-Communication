import { useEffect, useState } from 'react'
import { RegisterButton, PaperStyled, Container, Form, SelectColor, Separator, BusinessContainer, AddressContainer, ExchangeRateContainer, newStyle } from './Styled'
import { NavLink, useHistory } from 'react-router-dom'
import { useAuth } from '../../../Api/Auth/use-auth'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../../Recoil/GlobalState'
import { SupplierData, Severity } from '../../../Api/Core/Interfaces'
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
  } from '@material-ui/core'

const SupplierSignUpPage = () => {
  const classes = newStyle()
  const setCurrentErrorState = useSetRecoilState(errorState)
  const history = useHistory()
  const auth = useAuth()
  // const location = useLocation<stateType>()
  const [values, setValues] = useState({
    businessName: '',
    businessNumber: '',
    pointsToLennis: '',
    dollarsToPoints: '',
    pointsToDollars: '',
    street: '',
    city: '',
    province: 'QC',
    postalCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    showPassword: false,
    hasErrors: false
  })

  const [errorMsgs, setErrors] = useState({
    businessName: '',
    businessNumber: '',
    pointsToLennis: '',
    dollarsToPoints: '',
    pointsToDollars: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  })

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        handleSignup()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [values])

  const redirect = () => {
    history.push('/signin')
  }

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleSignup = async () => {
    if (values.password !== values.confirmPassword) {
      setErrors({ ...errorMsgs, confirmPassword: 'password doesn\'t match' })
      return
    }

    const supplierData: SupplierData = {
      businessName: values.businessName,
      businessNumber: values.businessNumber,
      username: values.username,
      password: values.password,
      email: values.email,
      pointsToLennis: values.pointsToLennis,
      dollarsToPoints: values.dollarsToPoints,
      pointsToDollars: values.pointsToDollars,
      street: values.street,
      city: values.city,
      province: values.province,
      postalCode: values.postalCode
    }

    const { errors, hasErrors } = await auth.signUpSupplier(supplierData)

    if (!hasErrors) {
      redirect()
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Congratulation, you\'re now registered',
        severity: Severity.Success
      }))
      setValues({
        businessName: '',
        businessNumber: '',
        pointsToLennis: '',
        dollarsToPoints: '',
        pointsToDollars: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        showPassword: false,
        hasErrors: false
      })
    } else if (errors) {
      let tempError = {
        businessName: '',
        businessNumber: '',
        pointsToLennis: '',
        dollarsToPoints: '',
        pointsToDollars: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
      }
      for (const err of errors) {
        if (err.param) {
          tempError = { ...tempError, [err.param]: err.msg }
        }
      }
      setErrors(tempError)

      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Something went wrong',
        severity: Severity.Error
      }))
    }
  }
  return (
        <Container>
            <PaperStyled>
            <Box
                sx={{
                  width: 500,
                  maxWidth: '100%'
                }}
              >
                  <Form>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                      <h3>
                        Register your business account today
                      </h3>
                    </div>
                          <BusinessContainer>
                            <TextField
                                id="businessName"
                                label="Business Name"
                                error={!!errorMsgs.businessName}
                                helperText={errorMsgs.businessName ? errorMsgs.businessName : ''}
                                className={classes.textField}
                                variant="outlined"
                                value={values.businessName}
                                onChange={handleChange('businessName')}
                                fullWidth
                            />
                          <Separator></Separator>
                            <TextField
                                id="businessNumber"
                                label="Business Number"
                                error={!!errorMsgs.businessNumber}
                                helperText={errorMsgs.businessNumber ? errorMsgs.businessNumber : ''}
                                className={classes.textField}
                                variant="outlined"
                                value={values.businessNumber}
                                onChange={handleChange('businessNumber')}
                                fullWidth
                            />
                          </BusinessContainer>
                          <TextField
                              id="username"
                              label="Username"
                              error={!!errorMsgs.username}
                              helperText={errorMsgs.username ? errorMsgs.username : ''}
                              className={classes.textField}
                              variant="outlined"
                              value={values.username}
                              onChange={handleChange('username')}

                          />
                          <TextField
                              id="password"
                              label="Password"
                              type={values.showPassword ? 'text' : 'password'}
                              value={values.password}
                              error={!!errorMsgs.password}
                              className={classes.textField}
                              variant="outlined"
                              onChange={handleChange('password')}
                          />
                          <TextField
                              id="confirmPassword"
                              label="Confirm Password"
                              type={values.showPassword ? 'text' : 'password'}
                              value={values.confirmPassword}
                              error={!!errorMsgs.confirmPassword}
                              className={classes.textField}
                              variant="outlined"
                              onChange={handleChange('confirmPassword')}
                          />
                          <div className="form-group text-left">
                              <div className="checkbox checkbox-fill d-inline">
                                  <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleClickShowPassword}/>
                                      <label htmlFor="checkbox-fill-a1" className="cr"> Show Passwords </label>
                              </div>
                          </div>
                          <ExchangeRateContainer>
                          <TextField
                              id="pointsToLennis"
                              label="Points in Lennis"
                              error={!!errorMsgs.pointsToLennis}
                              helperText={errorMsgs.pointsToLennis ? errorMsgs.pointsToLennis : ''}
                              className={classes.textField}
                              variant="outlined"
                              value={values.pointsToLennis}
                              onChange={handleChange('pointsToLennis')}
                          />
                          <Separator></Separator>
                          <TextField
                              id="pointsToDollars"
                              label="Points to CAD"
                              error={!!errorMsgs.pointsToDollars}
                              helperText={errorMsgs.pointsToDollars ? errorMsgs.pointsToDollars : ''}
                              className={classes.textField}
                              variant="outlined"
                              value={values.pointsToDollars}
                              onChange={handleChange('pointsToDollars')}
                          />
                          <Separator></Separator>
                          <TextField
                              id="dollarsToPoints"
                              label="CAD to Points"
                              error={!!errorMsgs.dollarsToPoints}
                              helperText={errorMsgs.dollarsToPoints ? errorMsgs.dollarsToPoints : ''}
                              className={classes.textField}
                              variant="outlined"
                              value={values.dollarsToPoints}
                              onChange={handleChange('dollarsToPoints')}
                          />
                          </ExchangeRateContainer>
                          <TextField
                              id="email"
                              label="Email Address"
                              error={!!errorMsgs.email}
                              helperText={errorMsgs.email ? errorMsgs.email : ''}
                              className={classes.textField}
                              variant="outlined"
                              value={values.email}
                              onChange={handleChange('email')}
                          />
                          <AddressContainer>
                            <TextField
                                id="street"
                                label="Street"
                                error={!!errorMsgs.street}
                                helperText={errorMsgs.username ? errorMsgs.street : ''}
                                className={classes.textField}
                                variant="outlined"
                                value={values.street}
                                onChange={handleChange('street')}
                                fullWidth
                            />
                          <Separator></Separator>
                              <TextField
                                id="city"
                                label="City"
                                error={!!errorMsgs.city}
                                helperText={errorMsgs.username ? errorMsgs.city : ''}
                                className={classes.textField}
                                variant="outlined"
                                value={values.city}
                                onChange={handleChange('city')}
                                fullWidth
                            />
                          </AddressContainer>
                          <AddressContainer>
                              <FormControl fullWidth>
                                <InputLabel id="province" className={classes.label}>Province</InputLabel>
                                <Select
                                    className={classes.select2}
                                    inputProps={{
                                      classes: {
                                          icon: classes.icon
                                      }
                                    }}
                                    variant="outlined"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={values.province}
                                    onChange={handleChange('province')}
                                    style={SelectColor}
                                  >
                                    <MenuItem value={'AB'}>AB</MenuItem>
                                    <MenuItem value={'BC'}>BC</MenuItem>
                                    <MenuItem value={'MB'}>MB</MenuItem>
                                    <MenuItem value={'NB'}>NB</MenuItem>
                                    <MenuItem value={'NL'}>NL</MenuItem>
                                    <MenuItem value={'NT'}>NT</MenuItem>
                                    <MenuItem value={'NS'}>NS</MenuItem>
                                    <MenuItem value={'NU'}>NU</MenuItem>
                                    <MenuItem value={'ON'}>ON</MenuItem>
                                    <MenuItem value={'PE'}>PE</MenuItem>
                                    <MenuItem value={'QC'}>QC</MenuItem>
                                    <MenuItem value={'SK'}>SK</MenuItem>
                                    <MenuItem value={'YT'}>YT</MenuItem>
                                  </Select>
                              </FormControl>
                            <Separator></Separator>
                              <TextField
                                id="postalCode"
                                label="Postal Code"
                                error={!!errorMsgs.postalCode}
                                helperText={errorMsgs.username ? errorMsgs.postalCode : ''}
                                className={classes.textField}
                                variant="outlined"
                                value={values.postalCode}
                                onChange={handleChange('postalCode')}
                                fullWidth
                            />
                              </AddressContainer>
                          <RegisterButton
                              onClick={handleSignup}
                              variant="contained"
                              color="primary"
                          >
                              SIGNUP
                          </RegisterButton>
                          <p className="mb-0 text-muted">Already have an account? <NavLink to="/signin">Signin</NavLink></p>
                      </Form>
                    </Box>
            </PaperStyled>
        </Container>
  )
}

export default SupplierSignUpPage
