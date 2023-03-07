import { Box, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilState } from 'recoil'
import { addFunds } from '../../../../Api/Core/clientOperations'
import { IAddress, IClient, ICreditCard, IPaymentInfo } from '../../../../Api/Core/Interfaces'
import { fetchCurrentClient, updateCurrentClient, validateAddressInfo, validatePaymentInfo } from '../../../../Api/Core/users'
import { addFundsValue, userState } from '../../../../Recoil/GlobalState'

import { CenteringDiv, Container, InputLabelColor, InputLabelStyled, PaperStyled, PaymentInfoForm, RowContainer, selectStyle, Separator, StyledButton, TextFieldStyled } from '../Styled'

const ClientAddFundsPage = () => {
  const history = useHistory()
  const [client, setClient] = useRecoilState(userState)
  const [addFundsInfo, setAddFundsInfo] = useRecoilState(addFundsValue)
  const [state, setState] = useState({ step: 0, opacity: [1, 0.5, 0.5] })
  const [showPMForm, setShowPMForm] = useState(false)
  const [paymentMode, setPaymentMode] = useState(0)
  const [validatedPM, setValidatedPaymentMode] = useState(true)
  const [validatedAddress, setValidatedAddress] = useState(true)
  const [savePaymentMode, setSavePaymentMode] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)
  const [billingAddress, setAddress] = useState({
    city: '',
    street: '',
    postalCode: '',
    province: 'QC'
  })

  const [creditCard, setCreditCard] = useState({
    cardHolderFirstname: '',
    cardHolderLastname: '',
    cardNumber: '',
    expirationDate: '',
    CVV: ''
  })
  const [bankAccount, setBankAccount] = useState({

    bankInstitution: '',
    branchNumber: '',
    accountNumber: ''
  })
  const [paymentInfo, setpaymentInfo] = useState({
    paymentMode: 0,
    creditCard: {
      cardHolderFirstname: '',
      cardHolderLastname: '',
      cardNumber: '',
      expirationDate: '',
      CVV: ''
    },
    bankAccount: {
      bankInstitution: '',
      branchNumber: '',
      accountNumber: ''
    }
    })
  const [errorMsgs, setErrors] = useState({
    paymentMode: '',
    cardHolderFirstname: '',
    cardHolderLastname: '',
    cardNumber: '',
    expirationDate: ''as String,
    CVV: '',
    bankInstitution: '',
    branchNumber: '',
    accountNumber: '',
    city: '',
    street: '',
    postalCode: '',
    province: '',
    amount: ''

  })
  const classes = selectStyle()
  const returnYearMonth = (dateObject:Date):string => {
    let month:string = dateObject.getMonth().toString()
    const year = dateObject.getFullYear()
    if (Number(month) < 10) {
      month = '0' + month.toString()
    }
    const date = year + '-' + month
    return date
  }
  useEffect(() => {
    (async () => {
    try {
        const responseUser = await fetchCurrentClient()
        if (!responseUser.has_errors) {
          setClient(responseUser.payload as IClient)
          setpaymentInfo(responseUser.payload.paymentInfo as IPaymentInfo)
          setAddress(responseUser.payload.address as IAddress)
          if (responseUser.payload.paymentInfo.paymentMode === 0) {
            setPaymentMode(1)
          } else if (responseUser.payload.paymentInfo.paymentMode === 1) {
            setPaymentMode(responseUser.payload.paymentInfo.paymentMode)
            const currentCreditCard = responseUser.payload.paymentInfo.creditCard as ICreditCard
            const dateObject:Date = new Date(currentCreditCard.expirationDate)
            const expirationdate = returnYearMonth(dateObject)
            const creditCardInfo = {
              cardHolderFirstname: currentCreditCard.cardHolderFirstname,
              cardHolderLastname: currentCreditCard.cardHolderLastname,
              cardNumber: currentCreditCard.cardNumber,
              expirationDate: expirationdate,
              CVV: currentCreditCard.CVV
            }
            setCreditCard(creditCardInfo)
          } else if (responseUser.payload.paymentInfo.paymentMode === 2) {
            setPaymentMode(responseUser.payload.paymentInfo.paymentMode)
            setBankAccount(responseUser.payload.paymentInfo.bankAccount)
          }
      }
    } catch (err: any) {
        console.error('get current user', err.msg)
    }
    })()
  }, [])
  const nextStep = () => (event: any) => {
    const valid = addFundsInfo.amount.toString().match('^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9]{1,2})?$')

    if (addFundsInfo.amount <= 0) {
      setErrors({ ...errorMsgs, amount: 'Can\'t add 0 $' })
      return
    }
    if (!valid) {
      setErrors({ ...errorMsgs, amount: 'Please include a valid amount' })
      return
    }
    setErrors({ ...errorMsgs, amount: '' })
    const opacity = [0.5, 0.5, 0.5]

    const nextSate = {
      step: state.step + 1, opacity: opacity
    }
    if (nextSate.step === 1) {
      if (paymentInfo.paymentMode === 0) {
        setValidatedPaymentMode(false)
      }
    }
    nextSate.opacity[nextSate.step] = 1
    setState(nextSate)
  }
  const backStep = () => (event: any) => {
    const opacity = [0.5, 0.5, 0.5]

    const nextSate = {
      step: state.step - 1, opacity: opacity
    }
    nextSate.opacity[nextSate.step] = 1
    setState(nextSate)
  }
  const showPaymentModeForm = () => (event: any) => {
    setShowPMForm(true)
    setValidatedPaymentMode(false)
  }
  const changeAddresse = () => {
    setValidatedAddress(false)
  }
  const handlePaymentModeChange = () => (event: any) => {
    setPaymentMode(event.target.value)
  }
  const handleCreditChange = (prop: any) => (event: any) => {
    setCreditCard({ ...creditCard, [prop]: event.target.value })
  }
  const handleBankAccountChange = (prop: any) => (event: any) => {
    setBankAccount({ ...bankAccount, [prop]: event.target.value })
  }
  const handleAddressChange = (prop: any) => (event: any) => {
    setAddress({ ...billingAddress, [prop]: event.target.value })
  }
  const showErrorMsgs = (errors:any) => {
    let tempError = {
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
      province: '',
      amount: ''
    }
    for (const err of errors) {
      if (err.param) {
        tempError = { ...tempError, [err.param]: err.msg }
      }
    }
    setErrors(tempError)
  }
  const resetErrorMsgs = () => {
    setErrors({
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
      province: '',
      amount: ''
    })
  }
  const validatePayment = async() => {
      const { errors, hasErrors } = await validatePaymentInfo({
        paymentMode: paymentMode,
        cardHolderFirstname: creditCard.cardHolderFirstname,
        cardHolderLastname: creditCard.cardHolderLastname,
        cardNumber: creditCard.cardNumber,
        expirationDate: creditCard.expirationDate + '-01',
        CVV: creditCard.CVV,
        bankInstitution: bankAccount.bankInstitution,
        branchNumber: bankAccount.branchNumber,
        accountNumber: bankAccount.accountNumber
      })
      if (!hasErrors) {
        let newPaymentInfo = client.paymentInfo
        if (paymentMode === 1) {
          const newCreditCard = {
            cardHolderFirstname: creditCard.cardHolderFirstname,
            cardHolderLastname: creditCard.cardHolderLastname,
            cardNumber: creditCard.cardNumber,
            expirationDate: creditCard.expirationDate + '-01',
            CVV: creditCard.CVV
          }
          newPaymentInfo = { paymentMode: paymentMode, creditCard: newCreditCard, bankAccount: { bankInstitution: '', branchNumber: '', accountNumber: '' } }
        } else if (paymentMode === 2) {
          newPaymentInfo = { paymentMode: paymentMode, creditCard: { cardHolderFirstname: '', cardHolderLastname: '', cardNumber: '', expirationDate: '', CVV: '' }, bankAccount: bankAccount }
        }

        if (savePaymentMode) {
          const newClient:IClient = {
            firstname: client.firstname,
            lastname: client.lastname,
            clientId: client.clientId,
            funds: client.funds,
            userInfo: client.userInfo,
            address: client.address,
            pending: client.pending,
            points: client.points,
            paymentInfo: newPaymentInfo
          }
          const response = await updateCurrentClient(newClient)
          if (!response.hasErrors) {
            setSavePaymentMode(false)
          } else {
            if (response.errors) {
              showErrorMsgs(response.errors)
            }
            return
          }
        }
        setValidatedPaymentMode(true)
        setShowPMForm(false)
        setpaymentInfo(newPaymentInfo)
        resetErrorMsgs()
        } else if (errors) {
          setValidatedPaymentMode(false)
          showErrorMsgs(errors)
        }
  }

  const validateAddress = async() => {
    const { errors, hasErrors } = await validateAddressInfo(billingAddress)
    if (!hasErrors) {
      if (saveAddress) {
        const newClient:IClient = {
          firstname: client.firstname,
          lastname: client.lastname,
          clientId: client.clientId,
          funds: client.funds,
          userInfo: client.userInfo,
          address: billingAddress,
          pending: client.pending,
          points: client.points,
          paymentInfo: client.paymentInfo
        }
        const response = await updateCurrentClient(newClient)
        if (!response.hasErrors) {
          setSaveAddress(false)
        } else {
          if (response.errors) {
            showErrorMsgs(response.errors)
          }
          return
        }
      }
      setValidatedAddress(true)
      setShowPMForm(false)
      resetErrorMsgs()
    } else if (errors) {
      setValidatedAddress(false)
      showErrorMsgs(errors)
    }
  }
  const cancelPaymentChange = () => {
    setValidatedPaymentMode(true)
    setShowPMForm(false)
    setPaymentMode(paymentInfo.paymentMode)
    setCreditCard(paymentInfo.creditCard)
    setBankAccount(paymentInfo.bankAccount)
    resetErrorMsgs()
    setSavePaymentMode(false)
    if (paymentInfo.paymentMode === 0) {
      setValidatedPaymentMode(false)
      setPaymentMode(paymentMode)
    }
  }
  const handleClickSavePaymentMode = () => {
    setSavePaymentMode(!savePaymentMode)
  }
  const handleClickSaveAddress = () => {
    setSaveAddress(!saveAddress)
  }
  const changeAmount = () => (event: any) => {
    let newAmount = event.target.value
    if (newAmount < 0) {
      newAmount *= -1
    }

    setAddFundsInfo({ ...addFundsInfo, amount: newAmount })
  }
  const fund = async() => {
    const { errors, hasErrors } = await addFunds({ _id: '', client: '', amount: addFundsInfo.amount, paymentInfo: paymentInfo, billingAddress: billingAddress, timestamp: new Date() })
    if (!hasErrors) {
      resetErrorMsgs()

      history.push(addFundsInfo.history)
      setAddFundsInfo({ amount: 0, history: '/client/balance/viewFunds' })
    } else if (errors) {
      showErrorMsgs(errors)
    }
  }
    return (
        <Container>
        <Box
                sx={{
                  width: '100%'
                }}
              >
            <RowContainer>

                <PaperStyled style={{ opacity: state.opacity[0] }} >
                  <InputLabelStyled id="amount" >Amount to be added</InputLabelStyled>
                  <TextFieldStyled disabled={state.step !== 0}
                    className={classes.textField}
                    id="pointsA"
                    label="amount"
                    error={!!errorMsgs.amount}
                    helperText={errorMsgs.amount ? errorMsgs.amount : ''}
                    variant="outlined"
                    InputProps={{ style: { color: '#888' } }}
                    value={addFundsInfo.amount}
                    onChange={changeAmount()}
                    type='number'
                    inputProps={{
                          min: 0
                    }}
                  />
                </PaperStyled>
                <PaperStyled style={{ opacity: state.opacity[1] }}>
                <InputLabelStyled id="paymentMode" >Payment Mode</InputLabelStyled>
                {paymentInfo.paymentMode === 0
                  ? <div>{!showPMForm && state.step === 1 ? <p onClick={showPaymentModeForm()} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>Add payment mode</p> : ''}</div>
                : ''}
                {paymentInfo.paymentMode === 1
                  ? <div> <PaperStyled>Card ****{paymentInfo.creditCard.cardNumber.toString().slice(paymentInfo.creditCard.cardNumber.toString().length - 4)} </PaperStyled>
                    {!showPMForm && state.step === 1 ? <p onClick={showPaymentModeForm()}style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>change payment mode</p> : ''}</div>
                : ''}
                {paymentInfo.paymentMode === 2
                  ? <div> <PaperStyled>Checking ****{bankAccount.accountNumber.toString().slice(bankAccount.accountNumber.toString().length - 4)} </PaperStyled>
                    {!showPMForm && state.step === 1 ? <p onClick={showPaymentModeForm()}style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>change payment mode</p> : ''}</div>
                : ''}
                {showPMForm
? <div>           <RowContainer>
                  <FormControl fullWidth >
                      <InputLabel htmlFor="select-payment-mode" id="payment-mode" className={classes.label}>Payment mode</InputLabel>
                      <Select disabled={state.step !== 1}

                          variant="outlined"
                          id="select-payment-mode"
                          value={paymentMode}
                          onChange={handlePaymentModeChange()}
                          className={classes.select1}
                          inputProps={{
                            classes: {
                                icon: classes.icon
                            }
                          }}
                        >
                          <MenuItem value={1}>Credit card</MenuItem>
                          <MenuItem value={2}>Bank account</MenuItem>
                        </Select>
                    </FormControl>
                    </RowContainer>
                    {paymentMode === 1
                      ? <PaymentInfoForm id="creditCardForm" >
                    <RowContainer>
                      <TextFieldStyled
                      className={classes.textField}
                          disabled={state.step !== 1}
                          id="cardHolderLastname"
                          label="Card holder lastname"
                          error={!!errorMsgs.cardHolderLastname}
                          helperText={errorMsgs.cardHolderLastname ? errorMsgs.cardHolderLastname : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={creditCard.cardHolderLastname}
                          onChange={handleCreditChange('cardHolderLastname')}
                      />
                      <Separator></Separator>
                      <TextFieldStyled
                      className={classes.textField}
                          disabled={state.step !== 1}
                          id="cardHolderFirstname"
                          label="Card holder firstname"
                          error={!!errorMsgs.cardHolderFirstname}
                          helperText={errorMsgs.cardHolderFirstname ? errorMsgs.cardHolderFirstname : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={creditCard.cardHolderFirstname}
                          onChange={handleCreditChange('cardHolderFirstname')}
                      />
                  </RowContainer>
                  <TextFieldStyled
                  className={classes.textField}
                      disabled={state.step !== 1}
                      id="cardNumber"
                      label="Card number"
                      error={!!errorMsgs.cardNumber}
                      helperText={errorMsgs.cardNumber ? errorMsgs.cardNumber : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.cardNumber}
                      onChange={handleCreditChange('cardNumber')}
                      type='number'
                  />
                  <RowContainer>
                  <TextFieldStyled
                  className={classes.textField}
                      disabled={state.step !== 1}
                      id="CVV"
                      label="CVV"
                      error={!!errorMsgs.CVV}
                      helperText={errorMsgs.CVV ? errorMsgs.CVV : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.CVV}
                      onChange={handleCreditChange('CVV')}
                      type="number"
                  />
                  <Separator></Separator>

                  <TextFieldStyled
                  className={classes.textField}
                      disabled={state.step !== 1}
                      id="expirationDate"
                      label="Expiration date"
                      error={!!errorMsgs.expirationDate}
                      helperText={errorMsgs.expirationDate ? errorMsgs.expirationDate : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.expirationDate}
                      onChange={handleCreditChange('expirationDate')}
                      type="month"
                  />
                  </RowContainer>
                  <RowContainer>
                  <input type="checkbox" name="checkbox-fill-0" id="checkbox-fill-a0" onClick={handleClickSavePaymentMode}/>
                                    <label htmlFor="checkbox-fill-a0" className="cr"> Save as new payment mode</label>
                  </RowContainer>
                  <RowContainer>
                  <StyledButton
                  disabled={state.step !== 1}
                  variant="outlined"
                  color="inherit"
                  onClick={cancelPaymentChange}>Cancel</StyledButton>
                  <Separator></Separator>
                  <StyledButton
                  disabled={state.step !== 1}
                  variant="contained"
                  color="secondary"
                  onClick={validatePayment}>Validate</StyledButton>
                  </RowContainer>
                    </PaymentInfoForm>

                    : ''}

                 {paymentMode === 2
                      ? <PaymentInfoForm id="bankAccountForm" >
                        <TextFieldStyled
                        className={classes.textField}
                          disabled={state.step !== 1}
                          id="bankInstitution"
                          label="Bank institution number"
                          error={!!errorMsgs.bankInstitution}
                          helperText={errorMsgs.bankInstitution ? errorMsgs.bankInstitution : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.bankInstitution}
                          onChange={handleBankAccountChange('bankInstitution')}
                          type='number'
                        />
                        <TextFieldStyled
                        className={classes.textField}
                          disabled={state.step !== 1}
                          id="branchNumber"
                          label="Branch number"
                          error={!!errorMsgs.branchNumber}
                          helperText={errorMsgs.branchNumber ? errorMsgs.branchNumber : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.branchNumber}
                          onChange={handleBankAccountChange('branchNumber')}
                          type='number'
                        />
                        <TextFieldStyled
                        className={classes.textField}
                          disabled={state.step !== 1}
                          id="accountNumber"
                          label="Account number"
                          error={!!errorMsgs.accountNumber}
                          helperText={errorMsgs.accountNumber ? errorMsgs.accountNumber : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.accountNumber}
                          onChange={handleBankAccountChange('accountNumber')}
                          type='number'
                        />
                        <RowContainer>
                        <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleClickSavePaymentMode}/>
                        <label htmlFor="checkbox-fill-a1" className="cr"> Save as new payment mode</label>
                        </RowContainer>
                        <RowContainer>
                          <StyledButton
                          disabled={state.step !== 1}
                          variant="outlined"
                          color="inherit"
                          onClick={cancelPaymentChange}>Cancel</StyledButton>
                          <Separator></Separator>
                          <StyledButton
                          disabled={state.step !== 1}
                          variant="contained"
                          color="secondary"
                          onClick={validatePayment}>Validate</StyledButton>
                        </RowContainer>
                      </PaymentInfoForm>
                    : ''}
                    </div>
                : ''}
                </PaperStyled>
                <PaperStyled style={{ opacity: state.opacity[2] }}>
                <InputLabelStyled id="billingAddress" >Billing Address</InputLabelStyled>
                <PaymentInfoForm>
                <RowContainer>
                <TextFieldStyled
                className={classes.textField}
                        disabled={validatedAddress}
                        id="street"
                        label="Street"
                        error={!!errorMsgs.street}
                        helperText={errorMsgs.street ? errorMsgs.street : ''}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={billingAddress.street}
                        onChange={handleAddressChange('street')}
                    />
                   <Separator></Separator>
                    <TextFieldStyled
                    className={classes.textField}
                        disabled={validatedAddress}
                        id="city"
                        label="City"
                        error={!!errorMsgs.city}
                        helperText={errorMsgs.city ? errorMsgs.city : ''}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={billingAddress.city}
                        onChange={handleAddressChange('city')}
                    />
                </RowContainer>
                <RowContainer>
                <FormControl fullWidth>
                              <InputLabel id="province" style={InputLabelColor}>Province</InputLabel>
                              <Select
                                  disabled={validatedAddress}
                                  variant="outlined"
                                  labelId="province"
                                  id="select-province"
                                  value={billingAddress.province}
                                  onChange={handleAddressChange('province')}
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
                    <TextFieldStyled
                    className={classes.textField}
                        disabled={validatedAddress}
                        id="postalCode"
                        label="Postal Code"
                        error={!!errorMsgs.postalCode}
                        helperText={errorMsgs.postalCode ? errorMsgs.postalCode : ''}
                        variant="outlined"
                        InputProps={{ style: { color: '#888' } }}
                        value={billingAddress.postalCode}
                        onChange={handleAddressChange('postalCode')}
                    />
                </RowContainer>
                </PaymentInfoForm>
                {validatedAddress && state.step === 2 ? <p onClick={changeAddresse}style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>Change billing address</p> : ''}
                {state.step === 2 && !validatedAddress
                ? <div>
                  <RowContainer>
                <input type="checkbox" name="checkbox-fill-2" id="checkbox-fill-a2" onClick={handleClickSaveAddress}/>
                <label htmlFor="checkbox-fill-a2" className="cr"> Save as new address</label>
                </RowContainer>
                <RowContainer>
                <StyledButton
                  variant="contained"
                  color="secondary"
                  onClick={validateAddress}>Validate</StyledButton>
                  </RowContainer>
                </div>
                : ''}
                </PaperStyled>
            </RowContainer>

            <RowContainer >

              <CenteringDiv></CenteringDiv>
              {state.step !== 0
              ? <StyledButton
              disabled={!validatedPM || !validatedAddress}
              variant="contained"
              color="default"
              style={{ flex: 1 / 4 }}
              onClick={backStep()}>Back</StyledButton>
              : ''
              }
              <Separator></Separator>
              {state.step !== 2
              ? <StyledButton disabled={!validatedPM || !validatedAddress}
              variant="contained"
              color="secondary"
              style={{ flex: 1 / 4 }}
              onClick={nextStep()}>Next</StyledButton>
              : <StyledButton
              disabled={!validatedPM || !validatedAddress}
              variant="contained"
              color="primary"
              style={{ flex: 1 / 4 }}
              onClick={fund}>Fund</StyledButton>
              }

              <CenteringDiv></CenteringDiv>
            </RowContainer>

        </Box>
        </Container>
    )
}
export default ClientAddFundsPage
