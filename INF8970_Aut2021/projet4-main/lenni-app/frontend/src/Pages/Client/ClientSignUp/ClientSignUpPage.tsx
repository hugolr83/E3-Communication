import { useEffect, useState } from 'react'
import { ConnectButton, Container, Form, NameContainer, PaperStyled, Separator, CrediCardInfoContainer, PaymentInfoForm, newStyle } from './Styled'
import {
  Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
  } from '@material-ui/core'
import { NavLink, useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { ClientData, Severity } from '../../../Api/Core/Interfaces'
import { errorState } from '../../../Recoil/GlobalState'
import { useAuth } from '../../../Api/Auth/use-auth'

const ClientSignUpPage = () => {
  const classes = newStyle()
  const [values, setValues] = useState({
      lastname: '',
      username: '',
      firstname: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '+1',
      secondAuthChoice: 0,
      question: 0,
      answer: '',
      funds: 0,
      role: 'USER',
      paymentMode: 0,
      cardHolderFirstname: '',
      cardHolderLastname: '',
      cardNumber: '',
      expirationDate: '',
      CVV: '',
      bankInstitution: '',
      branchNumber: '',
      accountNumber: '',
      city: '',
      street: '',
      postalCode: '',
      province: 'QC',
      showPassword: false,
      hasErrors: false
  })
  const [errorMsgs, setErrors] = useState({
      lastname: '',
      username: '',
      firstname: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      secondAuthChoice: '',
      question: '',
      answer: '',
      funds: '',
      role: '',
      paymentMode: '',
      cardHolderFirstname: '',
      cardHolderLastname: '',
      cardNumber: '',
      expirationDate: '',
      CVV: '',
      bankInstitution: '',
      branchNumber: '',
      city: '',
      street: '',
      postalCode: '',
      province: '',
      accountNumber: ''
  })

  const setCurrentErrorState = useSetRecoilState(errorState)
  const history = useHistory()
  const auth = useAuth()
  const handleChange = (prop: any) => (event: any) => {
      setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

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
  const handleSignup = async () => {
    if (values.password !== values.confirmPassword) {
      setErrors({ ...errorMsgs, confirmPassword: 'password doesn\'t match' })

      return
    }
    const clientData: ClientData = {
      lastname: values.lastname,
      firstname: values.firstname,
      username: values.username,
      password: values.password,
      email: values.email,
      phone: values.phone,
      secondAuthChoice: values.secondAuthChoice,
      question: values.question,
      answer: values.answer,
      funds: values.funds,
      role: values.role,
      paymentMode: values.paymentMode,
      cardHolderFirstname: values.cardHolderFirstname,
      cardHolderLastname: values.cardHolderLastname,
      cardNumber: values.cardNumber,
      expirationDate: values.expirationDate + '-01',
      CVV: values.CVV,
      bankInstitution: values.bankInstitution,
      branchNumber: values.branchNumber,
      accountNumber: values.accountNumber,
      city: values.city,
      street: values.street,
      postalCode: values.postalCode,
      province: values.province,
      pending: true,
      registrationDate: new Date(),
      lastConnection: new Date()
    }
    const { errors, hasErrors } = await auth.addClient(
      clientData
    )

    if (!hasErrors) {
      redirect()
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'You\'re now registred',
        severity: Severity.Success
      }))
      setValues({
        lastname: '',
        username: '',
        firstname: '',
        password: '',
        confirmPassword: '',
        secondAuthChoice: 0,
        email: '',
        phone: '+1',
        question: 0,
        answer: '',
        funds: 0,
        role: 'USER',
        paymentMode: 0,
        cardHolderFirstname: '',
        cardHolderLastname: '',
        cardNumber: '',
        expirationDate: '',
        CVV: '',
        bankInstitution: '',
        branchNumber: '',
        accountNumber: '',
        city: '',
        street: '',
        postalCode: '',
        province: '',
        showPassword: false,
        hasErrors: false
      })
    } else if (errors) {
      let tempError = {
        lastname: '',
        username: '',
        firstname: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        secondAuthChoice: '',
        question: '',
        answer: '',
        funds: '',
        role: '',
        paymentMode: '',
        cardHolderFirstname: '',
        cardHolderLastname: '',
        cardNumber: '',
        expirationDate: '',
        CVV: '',
        bankInstitution: '',
        branchNumber: '',
        accountNumber: '',
        city: '',
        street: '',
        postalCode: '',
        province: ''
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
        message: 'something when wrong',
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
                <Form >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                        <h3>
                            Register your personal account today
                        </h3>
                    </div>
                    <NameContainer>
                    <TextField
                        id="lastname"
                        label="Lastname"
                        error={!!errorMsgs.lastname}
                        helperText={errorMsgs.lastname ? errorMsgs.lastname : ''}
                        className={classes.textField}
                        variant="outlined"
                        value={values.lastname}
                        onChange={handleChange('lastname')}
                    />
                   <Separator></Separator>
                    <TextField
                        id="firstname"
                        label="Firstname"
                        error={!!errorMsgs.firstname}
                        helperText={errorMsgs.firstname ? errorMsgs.firstname : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.firstname}
                        onChange={handleChange('firstname')}
                    />
                    </NameContainer>
                    <TextField
                        id="username"
                        label="Username"
                        error={!!errorMsgs.username}
                        helperText={errorMsgs.username ? errorMsgs.username : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.username}
                        onChange={handleChange('username')}
                    />

                    <TextField
                      className={classes.textField}
                        variant="outlined"
                            id="password"
                            label="Password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            error={!!errorMsgs.password}
                            inputProps={{ style: { color: '#888' } }}
                            onChange={handleChange('password')}
                            helperText={errorMsgs.password ? errorMsgs.password : ''}
                        />

                        <TextField
                        className={classes.textField}
                        variant="outlined"
                            id="confirmPassword"
                            label="Confirm Password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.confirmPassword}
                            error={!!errorMsgs.confirmPassword}
                            inputProps={{ style: { color: '#888' } }}
                            onChange={handleChange('confirmPassword')}
                            helperText={errorMsgs.confirmPassword ? errorMsgs.confirmPassword : ''}
                        />
                    <div className="form-group text-left">
                            <div className="checkbox checkbox-fill d-inline">
                                <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleClickShowPassword}/>
                                    <label htmlFor="checkbox-fill-a1" className="cr"> Show Passwords </label>
                            </div>
                        </div>

                    <TextField
                        id="email"
                        label="Email Address"
                        error={!!errorMsgs.email}
                        helperText={errorMsgs.email ? errorMsgs.email : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.email}
                        onChange={handleChange('email')}
                        type="email"
                    />
                    <TextField
                        id="phone"
                        label="Phone Number"
                        error={!!errorMsgs.phone}
                        helperText={errorMsgs.phone ? errorMsgs.phone : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.phone}
                        onChange={handleChange('phone')}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" className={classes.label}>Second Authentication Method</InputLabel>
                      <Select
                          variant="outlined"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values.secondAuthChoice}
                          onChange={handleChange('secondAuthChoice')}
                          className={classes.select2}
                          inputProps={{
                            classes: {
                                icon: classes.icon
                            }
                          }}
                        >
                          <MenuItem value={0}>Security question</MenuItem>
                          <MenuItem value={1}>TOTP</MenuItem>
                          <MenuItem value={2}>OTP</MenuItem>
                          <MenuItem value={3}>In store ID check</MenuItem>
                        </Select>
                    </FormControl>
                    {values.secondAuthChoice === 0
                      ? <FormControl fullWidth>
                      <Select
                          variant="outlined"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values.question}
                          onChange={handleChange('question')}
                          className={classes.select2}
                          inputProps={{
                            classes: {
                                icon: classes.icon
                            }
                          }}
                        >
                          <MenuItem value={0}>None</MenuItem>
                          <MenuItem value={1}>What is your favorite movie ?</MenuItem>
                          <MenuItem value={2}>What city were you born ?</MenuItem>
                          <MenuItem value={3}>What high school did you attend ?</MenuItem>
                          <MenuItem value={4}>What is your mother's maiden name ?</MenuItem>
                        </Select>
                        <TextField
                        id="answer"
                        label="Security Answer"
                        error={!!errorMsgs.answer}
                        helperText={errorMsgs.answer ? errorMsgs.answer : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.answer}
                        onChange={handleChange('answer')}
                        type="answer"
                    />
                    </FormControl>
                    : ''}

                    {values.secondAuthChoice === 1
                      ? <div>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                        You will receive by mail a TOTP based device</p>
                  </div>
                       : ''}

                    {values.secondAuthChoice === 2
                      ? <div>
                      <p onChange={handleChange('otp')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                          We will send you a list of One-Timed Password by email</p>
                    </div>
                       : ''}

                    {values.secondAuthChoice === 3
                      ? <div onChange={handleChange('store')}><p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                          If you select this option, please visit a store to verify your identity in person</p>
                  </div>
                       : ''}

                    <NameContainer>
                    <TextField
                        id="street"
                        label="Street"
                        error={!!errorMsgs.street}
                        helperText={errorMsgs.street ? errorMsgs.street : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.street}
                        onChange={handleChange('street')}
                    />
                   <Separator></Separator>
                    <TextField
                        id="city"
                        label="City"
                        error={!!errorMsgs.city}
                        helperText={errorMsgs.city ? errorMsgs.city : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.city}
                        onChange={handleChange('city')}
                    />
                    </NameContainer>

                    <NameContainer>
                    <FormControl fullWidth>
                              <InputLabel id="province" className={classes.label}>Province</InputLabel>
                              <Select
                                  variant="outlined"
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={values.province}
                                  onChange={handleChange('province')}
                                  className={classes.select2}
                                  inputProps={{
                                    classes: {
                                        icon: classes.icon
                                    }
                                  }}
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
                        helperText={errorMsgs.postalCode ? errorMsgs.postalCode : ''}
                        className={classes.textField}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={values.postalCode}
                        onChange={handleChange('postalCode')}
                    />
                    </NameContainer>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" className={classes.label}>Payment mode</InputLabel>
                      <Select
                          variant="outlined"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values.paymentMode}
                          onChange={handleChange('paymentMode')}
                          className={classes.select2}
                          inputProps={{
                            classes: {
                                icon: classes.icon
                            }
                          }}
                        >
                          <MenuItem value={0}>None</MenuItem>
                          <MenuItem value={1}>Credit card</MenuItem>
                          <MenuItem value={2}>Bank account</MenuItem>
                        </Select>
                    </FormControl>

                    {values.paymentMode === 1
                      ? <PaymentInfoForm id="creditCardForm" >
                    <NameContainer>
                      <TextField
                          id="cardHolderLastname"
                          label="Card holder lastname"
                          error={!!errorMsgs.cardHolderLastname}
                          helperText={errorMsgs.cardHolderLastname ? errorMsgs.cardHolderLastname : ''}
                          className={classes.textField}
                        variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={values.cardHolderLastname}
                          onChange={handleChange('cardHolderLastname')}
                      />
                      <Separator></Separator>
                      <TextField
                          id="cardHolderFirstname"
                          label="Card holder firstname"
                          error={!!errorMsgs.cardHolderFirstname}
                          helperText={errorMsgs.cardHolderFirstname ? errorMsgs.cardHolderFirstname : ''}
                          className={classes.textField}
                        variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={values.cardHolderFirstname}
                          onChange={handleChange('cardHolderFirstname')}
                      />
                  </NameContainer>
                  <TextField
                      id="cardNumber"
                      label="Card number"
                      error={!!errorMsgs.cardNumber}
                      helperText={errorMsgs.cardNumber ? errorMsgs.cardNumber : ''}
                      className={classes.textField}
                        variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={values.cardNumber}
                      onChange={handleChange('cardNumber')}
                      type='number'
                  />
                  <CrediCardInfoContainer>
                  <TextField
                      id="CVV"
                      label="CVV"
                      error={!!errorMsgs.CVV}
                      helperText={errorMsgs.CVV ? errorMsgs.CVV : ''}
                      className={classes.textField}
                        variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={values.CVV}
                      onChange={handleChange('CVV')}
                      type="number"
                  />
                  <Separator></Separator>

                  <TextField
                      id="expirationDate"
                      label="Expiration date"
                      error={!!errorMsgs.expirationDate}
                      helperText={errorMsgs.expirationDate ? errorMsgs.expirationDate : ''}
                      className={classes.textField}
                        variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={values.expirationDate}
                      onChange={handleChange('expirationDate')}
                      type="month"
                  />
                  </CrediCardInfoContainer>
                    </PaymentInfoForm>
                    : ''}
                    {values.paymentMode === 2
                      ? <PaymentInfoForm id="bankAccountForm" >
                        <TextField
                          id="bankInstitution"
                          label="Bank institution number"
                          error={!!errorMsgs.bankInstitution}
                          helperText={errorMsgs.bankInstitution ? errorMsgs.bankInstitution : ''}
                          className={classes.textField}
                        variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={values.bankInstitution}
                          onChange={handleChange('bankInstitution')}
                          type='number'
                        />
                        <TextField
                          id="branchNumber"
                          label="Branch number"
                          error={!!errorMsgs.branchNumber}
                          helperText={errorMsgs.branchNumber ? errorMsgs.branchNumber : ''}
                          className={classes.textField}
                        variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={values.branchNumber}
                          onChange={handleChange('branchNumber')}
                          type='number'
                        />
                        <TextField
                          id="accountNumber"
                          label="Account number"
                          error={!!errorMsgs.accountNumber}
                          helperText={errorMsgs.accountNumber ? errorMsgs.accountNumber : ''}
                          className={classes.textField}
                        variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={values.accountNumber}
                          onChange={handleChange('accountNumber')}
                          type='number'
                        />

                      </PaymentInfoForm>
                    : ''}
                    <ConnectButton
                        onClick={handleSignup}
                        variant="contained"
                        color="primary"
                    >
                        SIGNUP
                    </ConnectButton>
                    <p className="mb-0 text-muted">Already have an account? <NavLink to="/signin">Signin</NavLink></p>
                </Form>
              </Box>
            </PaperStyled>
        </Container>
    )
}

export default ClientSignUpPage
