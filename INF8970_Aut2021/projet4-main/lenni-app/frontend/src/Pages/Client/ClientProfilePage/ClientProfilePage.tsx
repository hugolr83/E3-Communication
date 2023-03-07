import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import EditSharpIcon from '@material-ui/icons/EditSharp'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../Api/Auth/use-auth'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { IAddress, IClient, ICreditCard, IPaymentInfo, Severity } from '../../../Api/Core/Interfaces'
import { fetchCurrentClient, updateCurrentClient, validateAddressInfo, validatePaymentInfo, generateNewOtp } from '../../../Api/Core/users'
import { userState, errorState } from '../../../Recoil/GlobalState'
import { CenteringDiv, Container, InputLabelColor, InputLabelStyled, newStyle, OtpRenewButton, PaperStyled, PaymentInfoForm, RowContainer, Separator } from './Styled'

const ClientProfilePage = () => {
    const classes = newStyle()
    const [client, setClient] = useRecoilState(userState)
    const [paymentMode, setPaymentMode] = useState(0)
    const [editAccountInfo, setEditAccountInfo] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [editPaymentMode, setEditPaymentMode] = useState(false)
    const [stateButton, setStateButton] = useState(false)
    const setCurrentErrorState = useSetRecoilState(errorState)
    const auth = useAuth()
    const [accountErrorMsgs, setAccountErrors] = useState({
        lastname: '',
        firstname: '',
        username: '',
        email: '',
        city: '',
        street: '',
        postalCode: '',
        province: ''
        })
    const [passwordErrorMsgs, setPasswordErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [paymentModeErrorMsgs, setpaymentModeErrors] = useState({
        paymentMode: '',
        cardHolderFirstname: '',
        cardHolderLastname: '',
        cardNumber: '',
        expirationDate: '',
        CVV: '',
        bankInstitution: '',
        branchNumber: '',
        accountNumber: ''
    })
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPassword: false
    })
    const [billingAddress, setAddress] = useState({
        city: '',
        street: '',
        postalCode: '',
        province: 'QC'
    })
      const [clientInfo, setClientInfo] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        secondAuthentification: -1
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
          const currentClient = responseUser.payload as IClient
          setClient(currentClient)
          setAddress(currentClient.address as IAddress)
          setClientInfo({ firstname: currentClient.firstname, lastname: currentClient.lastname, username: currentClient.userInfo.username, email: currentClient.userInfo.email, secondAuthentification: currentClient.userInfo.secondAuthChoice })
          setPaymentMode(currentClient.paymentInfo.paymentMode)
          if (currentClient.paymentInfo.paymentMode === 1) {
            let currentCreditCard = currentClient.paymentInfo.creditCard as ICreditCard
            const dateObject:Date = new Date(currentCreditCard.expirationDate)
            const expirationdate = returnYearMonth(dateObject)
            currentCreditCard = { ...currentCreditCard, expirationDate: expirationdate }
            setCreditCard(currentCreditCard)
          } else if (currentClient.paymentInfo.paymentMode === 2) {
            setBankAccount(currentClient.paymentInfo.bankAccount)
          }
            }
        } catch (err: any) {
            console.error('get current user', err.msg)
        }
        })()
      }, [])
    const showErrorMsgs = (errors:any, section:Number) => {
        let tempError = {
            lastname: '',
            firstname: '',
            username: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            email: '',
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
        if (section === 1 || section === 0) {
            const accountErrors = {
                lastname: tempError.lastname,
                firstname: tempError.firstname,
                username: tempError.username,
                email: tempError.email,
                city: tempError.city,
                street: tempError.street,
                postalCode: tempError.postalCode,
                province: tempError.province
            }
            setAccountErrors(accountErrors)
        }
        if (section === 2 || section === 0) {
            const passwordErrors = {
                oldPassword: tempError.oldPassword,
                newPassword: tempError.newPassword,
                confirmPassword: tempError.confirmPassword
            }
            setPasswordErrors(passwordErrors)
        }
        if (section === 3 || section === 0) {
            const paymentModeErrors = {
                paymentMode: tempError.paymentMode,
                cardHolderFirstname: tempError.cardHolderFirstname,
                cardHolderLastname: tempError.cardHolderLastname,
                cardNumber: tempError.cardNumber,
                expirationDate: tempError.expirationDate,
                CVV: tempError.CVV,
                bankInstitution: tempError.bankInstitution,
                branchNumber: tempError.branchNumber,
                accountNumber: tempError.accountNumber
            }
            setpaymentModeErrors(paymentModeErrors)
        }
    }
    const resetErrorMsgs = (section:Number) => {
        if (section === 1 || section === 0) {
            const accountErrors = {
                lastname: '',
                firstname: '',
                username: '',
                email: '',
                city: '',
                street: '',
                postalCode: '',
                province: ''
            }
            setAccountErrors(accountErrors)
        }
        if (section === 2 || section === 0) {
            const passwordErrors = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
            setPasswordErrors(passwordErrors)
        }
        if (section === 3 || section === 0) {
            const paymentModeErrors = {
                paymentMode: '',
                cardHolderFirstname: '',
                cardHolderLastname: '',
                cardNumber: '',
                expirationDate: '',
                CVV: '',
                bankInstitution: '',
                branchNumber: '',
                accountNumber: ''
            }
            setpaymentModeErrors(paymentModeErrors)
        }
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
      const handlePasswordChange = (prop: any) => (event: any) => {
        setPassword({ ...password, [prop]: event.target.value })
      }
      const handleShowPassword = () => {
        setPassword({ ...password, showPassword: !password.showPassword })
      }
      const handleNameChange = (prop: any) => (event: any) => {
        setClientInfo({ ...clientInfo, [prop]: event.target.value })
      }
      const handleEditAccountInfo = () => {
        setEditAccountInfo(true)
      }
      const handleChangePassword = () => {
        setChangePassword(true)
      }
      const handleEditPaymentMode = () => {
        setEditPaymentMode(true)
      }
      const savePasswordChange = async() => {
        resetErrorMsgs(2)
        if (password.newPassword !== password.confirmPassword) {
            showErrorMsgs([{ param: 'confirmPassword', msg: 'passwords don\'t match' }], 2)
            return
        }
        const response = await auth.changePassword(password.oldPassword, password.newPassword)
        if (!response.hasErrors) {
            try {
                const responseUser = await fetchCurrentClient()
                if (!responseUser.has_errors) {
                    const currentClient = responseUser.payload as IClient
                    setChangePassword(false)
                    setClient(currentClient)
                    setPassword({ oldPassword: '', newPassword: '', confirmPassword: '', showPassword: password.showPassword })
                }
            } catch (err: any) {
                console.error('get current user', err.msg)
            }
        } else {
            if (response.errors) {
            showErrorMsgs(response.errors, 2)
            }
        }
      }
    const cancelPasswordChange = () => {
        resetErrorMsgs(2)
        setPassword({ oldPassword: '', newPassword: '', confirmPassword: '', showPassword: password.showPassword })
        setChangePassword(false)
    }
    const saveAccountInfoChange = async() => {
        const validateResponse = await validateAddressInfo(billingAddress)
        if (validateResponse.hasErrors) {
            if (validateResponse.errors) {
                showErrorMsgs(validateResponse.errors, 1)
            }
            return
        }
        const newClient = {
            firstname: clientInfo.firstname,
            lastname: clientInfo.lastname,
            clientId: client.clientId,
            funds: client.funds,
            userInfo: client.userInfo,
            address: billingAddress,
            pending: client.pending,
            points: client.points,
            paymentInfo: client.paymentInfo

        } as IClient
        const response = await updateCurrentClient(newClient)
        if (response.hasErrors) {
            if (response.errors) {
                showErrorMsgs(response.errors, 1)
            }
            return
        }
        try {
        const responseUser = await fetchCurrentClient()
        if (responseUser.hasErrors) {
            if (responseUser.errors) {
                showErrorMsgs(responseUser.errors, 1)
            }
            return
        }
        setClient(responseUser.payload)
        setEditAccountInfo(false)
        resetErrorMsgs(1)
        } catch (err: any) {
            console.error('get current user', err.msg)
        }
    }
    const cancelAccountInfoChange = () => {
        resetErrorMsgs(1)
        setClientInfo({ firstname: client.firstname, lastname: client.lastname, username: client.userInfo.username, email: client.userInfo.email, secondAuthentification: client.userInfo.secondAuthChoice })
        setAddress(client.address as IAddress)
        setEditAccountInfo(false)
    }
    const savePaymentModeChange = async() => {
        const validateResponse = await validatePaymentInfo({
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
        if (validateResponse.hasErrors) {
            if (validateResponse.errors) {
                showErrorMsgs(validateResponse.errors, 3)
            }
            return
        }
        let newCreditCard = creditCard
        newCreditCard = { ...newCreditCard, expirationDate: creditCard.expirationDate + '-01' }
        const newPaymentInfo = {
            paymentMode: paymentMode,
            bankAccount: bankAccount,
            creditCard: newCreditCard
        } as IPaymentInfo
        let newClient = client
        newClient = { ...newClient, firstname: clientInfo.firstname }
        newClient = { ...newClient, lastname: clientInfo.lastname }
        newClient = { ...newClient, paymentInfo: newPaymentInfo }
        const response = await updateCurrentClient(newClient)
        if (response.hasErrors) {
            if (response.errors) {
                showErrorMsgs(response.errors, 1)
            }
            return
        }
        try {
        const responseUser = await fetchCurrentClient()
        if (responseUser.hasErrors) {
            if (responseUser.errors) {
                showErrorMsgs(responseUser.errors, 1)
            }
            return
        }
        setEditPaymentMode(false)
        setClient(responseUser.payload)

        if (newPaymentInfo.paymentMode === 1) {
            let currentCreditCard = newPaymentInfo.creditCard as ICreditCard
            const dateObject:Date = new Date(currentCreditCard.expirationDate)
            const expirationdate = returnYearMonth(dateObject)
            currentCreditCard = { ...currentCreditCard, expirationDate: expirationdate }
            setCreditCard(currentCreditCard)
        }
        if (newPaymentInfo.paymentMode !== 1) {
            const creditCardInfo = {
                cardHolderFirstname: '',
                cardHolderLastname: '',
                cardNumber: '',
                expirationDate: '',
                CVV: ''
              }
              setCreditCard(creditCardInfo)
        }
        if (newPaymentInfo.paymentMode !== 2) {
            const bankAccountInfo = {
                bankInstitution: '',
                branchNumber: '',
                accountNumber: ''
              }
              setBankAccount(bankAccountInfo)
        }
        resetErrorMsgs(3)
        } catch (err: any) {
            console.error('get current user', err.msg)
        }
    }
    const cancelPaymentModeChange = () => {
        resetErrorMsgs(3)
        setPaymentMode(client.paymentInfo.paymentMode)
        setBankAccount(client.paymentInfo.bankAccount)
        setCreditCard(client.paymentInfo.creditCard)
        if (client.paymentInfo.paymentMode === 1) {
            let currentCreditCard = client.paymentInfo.creditCard as ICreditCard
            const dateObject:Date = new Date(currentCreditCard.expirationDate)
            const expirationdate = returnYearMonth(dateObject)
            currentCreditCard = { ...currentCreditCard, expirationDate: expirationdate }
            setCreditCard(currentCreditCard)
        }
        setEditPaymentMode(false)
    }
    const [errorMsgs, setErrors] = useState({
        transferMessage: ''
    })
    const renewOtpList = async() => {
        const response = await generateNewOtp()
        if (response.hasErrors) {
            if (response.errors) {
                setCurrentErrorState((prev) => ({
                    ...prev,
                    open: true,
                    message: 'Unable de generate new codes',
                    severity: Severity.Error
                  }))
            }
        } else {
            setStateButton(true)
            const printResponse = {
                transferMessage: 'We will send you a new list of One-Timed Password by email'
            }
            setErrors(printResponse)
            setCurrentErrorState((prev) => ({
                ...prev,
                open: true,
                message: 'Codes generated',
                severity: Severity.Success
              }))
        }
    }
    return (
        <Container>
            <Box sx={{ width: '100%' }}>

            <RowContainer>
            <CenteringDiv></CenteringDiv>
            <PaperStyled>
                <div className={classes.section}>
            <RowContainer>
            <InputLabelStyled id="accountInformation" >Account Information</InputLabelStyled>
            <IconButton disabled={editAccountInfo} aria-label="edit" onClick={handleEditAccountInfo} color="secondary">
                <EditSharpIcon />
            </IconButton>
            </RowContainer>
                <RowContainer>

                    <TextField
                        disabled={!editAccountInfo}
                        id="lastname"
                        label="lastname"
                        error={!!accountErrorMsgs.lastname}
                        helperText={accountErrorMsgs.lastname ? accountErrorMsgs.lastname : ''}
                        variant="outlined"
                        className={classes.textField}
                        value={clientInfo.lastname}
                        onChange={handleNameChange('lastname')}
                    />
                    <Separator></Separator>
                    <TextField
                    disabled={!editAccountInfo}
                        id="firstname"
                        label="firstname"
                        error={!!accountErrorMsgs.firstname}
                        helperText={accountErrorMsgs.firstname ? accountErrorMsgs.firstname : ''}
                        variant="outlined"
                        className={classes.textField}
                        value={clientInfo.firstname}
                        onChange={handleNameChange('firstname')}
                    />
                    </RowContainer>
                    <TextField
                        disabled
                        id="username"
                        label="username"
                        error={!!accountErrorMsgs.username}
                        helperText={accountErrorMsgs.username ? accountErrorMsgs.username : ''}
                        variant="outlined"
                        className={classes.textField}
                        value={clientInfo.username}
                        onChange={handleNameChange('username')}
                    />
                    <TextField
                        disabled
                        id="email"
                        label="email"
                        error={!!accountErrorMsgs.email}
                        helperText={accountErrorMsgs.email ? accountErrorMsgs.email : ''}
                        variant="outlined"
                        className={classes.textField}
                        value={clientInfo.email}
                        onChange={handleNameChange('email')}
                    />

                <RowContainer>
                <TextField
                className={classes.textField}
                disabled={!editAccountInfo}
                        id="street"
                        label="Street"
                        error={!!accountErrorMsgs.street}
                        helperText={accountErrorMsgs.street ? accountErrorMsgs.street : ''}
                        variant="outlined"
                        value={billingAddress.street}
                        onChange={handleAddressChange('street')}
                    />
                   <Separator></Separator>
                    <TextField
                    className={classes.textField}
                    disabled={!editAccountInfo}
                        id="city"
                        label="City"
                        error={!!accountErrorMsgs.city}
                        helperText={accountErrorMsgs.city ? accountErrorMsgs.city : ''}
                        variant="outlined"
                        value={billingAddress.city}
                        onChange={handleAddressChange('city')}
                    />
                </RowContainer>
                <RowContainer>
                <FormControl fullWidth>
                              <InputLabel id="province" style={InputLabelColor}>Province</InputLabel>
                              <Select
                                disabled={!editAccountInfo}
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
                    <TextField
                    className={classes.textField}
                    disabled={!editAccountInfo}
                        id="postalCode"
                        label="Postal Code"
                        error={!!accountErrorMsgs.postalCode}
                        helperText={accountErrorMsgs.postalCode ? accountErrorMsgs.postalCode : ''}
                        variant="outlined"
                        value={billingAddress.postalCode}
                        onChange={handleAddressChange('postalCode')}
                    />
                </RowContainer>
                <RowContainer>
                <Button disabled={!editAccountInfo} className={classes.cancelButton} variant='outlined' color='primary' onClick={cancelAccountInfoChange}>Cancel</Button>
                <Separator></Separator>
                <Button disabled={!editAccountInfo} className={classes.saveButton} variant='contained' color='secondary' onClick={saveAccountInfoChange }>Save</Button>
                </RowContainer>
                </div>
                <div className={classes.section}>
                <RowContainer>
                <InputLabelStyled id="changePassword" >Change Password</InputLabelStyled>
                <IconButton disabled={changePassword} aria-label="edit" onClick={handleChangePassword} color="secondary">
                <EditSharpIcon />
                </IconButton>
                </RowContainer>
                <TextField
                disabled={!changePassword}
                    id="oldPassword"
                    label="Old password"
                    error={!!passwordErrorMsgs.oldPassword}
                    helperText={passwordErrorMsgs.oldPassword ? passwordErrorMsgs.oldPassword : ''}
                    type={password.showPassword ? 'text' : 'password'}
                    variant="outlined"
                    className={classes.textField}
                    value={password.oldPassword}
                    onChange={handlePasswordChange('oldPassword')}
                />
                <TextField
                disabled={!changePassword}
                    id="newPassword"
                    label="New password"
                    error={!!passwordErrorMsgs.newPassword}
                    helperText={passwordErrorMsgs.newPassword ? passwordErrorMsgs.newPassword : ''}
                    type={password.showPassword ? 'text' : 'password'}
                    variant="outlined"
                    className={classes.textField}
                    value={password.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                />
                <TextField
                disabled={!changePassword}
                    id="confirmPassword"
                    label="Confirm password"
                    error={!!passwordErrorMsgs.confirmPassword}
                    helperText={passwordErrorMsgs.confirmPassword ? passwordErrorMsgs.confirmPassword : ''}
                    type={password.showPassword ? 'text' : 'password'}
                    variant="outlined"
                    className={classes.textField}
                    value={password.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                />
                <RowContainer>
                        <input disabled={!changePassword} type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleShowPassword}/>
                        <label htmlFor="checkbox-fill-a1" className="cr"> Show password</label>
                </RowContainer>
                <RowContainer>
                <Button disabled={!changePassword} className={classes.cancelButton} variant='outlined' color='primary' onClick={cancelPasswordChange}>Cancel</Button>
                <Separator></Separator>
                <Button disabled={!changePassword} className={classes.saveButton} variant='contained' color='secondary' onClick={savePasswordChange }>Save</Button>
                </RowContainer>
                </div>
                <div className={classes.section}>
                    <RowContainer>
                <InputLabelStyled id="paymentMode" >Payment Mode</InputLabelStyled>
                <IconButton disabled={editPaymentMode} aria-label="edit" onClick={handleEditPaymentMode} color="secondary">
                <EditSharpIcon />
                </IconButton>
                </RowContainer>
                <RowContainer>
                  <FormControl fullWidth >
                      <InputLabel htmlFor="select-payment-mode" id="payment-mode" className={classes.label}>Payment mode</InputLabel>
                      <Select
                        disabled={!editPaymentMode}
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
                          <MenuItem value={0}>None</MenuItem>
                          <MenuItem value={1}>Credit card</MenuItem>
                          <MenuItem value={2}>Bank account</MenuItem>
                        </Select>
                    </FormControl>
                    </RowContainer>
                    {paymentMode === 1
                      ? <PaymentInfoForm id="creditCardForm" >
                    <RowContainer>
                      <TextField
                      className={classes.textField}
                      disabled={!editPaymentMode}
                          id="cardHolderLastname"
                          label="Card holder lastname"
                          error={!!paymentModeErrorMsgs.cardHolderLastname}
                          helperText={paymentModeErrorMsgs.cardHolderLastname ? paymentModeErrorMsgs.cardHolderLastname : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={creditCard.cardHolderLastname}
                          onChange={handleCreditChange('cardHolderLastname')}
                      />
                      <Separator></Separator>
                      <TextField
                      className={classes.textField}
                      disabled={!editPaymentMode}
                          id="cardHolderFirstname"
                          label="Card holder firstname"
                          error={!!paymentModeErrorMsgs.cardHolderFirstname}
                          helperText={paymentModeErrorMsgs.cardHolderFirstname ? paymentModeErrorMsgs.cardHolderFirstname : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={creditCard.cardHolderFirstname}
                          onChange={handleCreditChange('cardHolderFirstname')}
                      />
                  </RowContainer>
                  <TextField
                  className={classes.textField}
                  disabled={!editPaymentMode}
                      id="cardNumber"
                      label="Card number"
                      error={!!paymentModeErrorMsgs.cardNumber}
                      helperText={paymentModeErrorMsgs.cardNumber ? paymentModeErrorMsgs.cardNumber : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.cardNumber}
                      onChange={handleCreditChange('cardNumber')}
                      type='number'
                  />
                  <RowContainer>
                  <TextField
                  className={classes.textField}
                  disabled={!editPaymentMode}
                      id="CVV"
                      label="CVV"
                      error={!!paymentModeErrorMsgs.CVV}
                      helperText={paymentModeErrorMsgs.CVV ? paymentModeErrorMsgs.CVV : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.CVV}
                      onChange={handleCreditChange('CVV')}
                      type="number"
                  />
                  <Separator></Separator>

                  <TextField
                  className={classes.textField}
                  disabled={!editPaymentMode}
                      id="expirationDate"
                      label="Expiration date"
                      error={!!paymentModeErrorMsgs.expirationDate}
                      helperText={paymentModeErrorMsgs.expirationDate ? paymentModeErrorMsgs.expirationDate : ''}
                      variant="outlined"
                      InputProps={{ style: { color: '#888' } }}
                      value={creditCard.expirationDate}
                      onChange={handleCreditChange('expirationDate')}
                      type="month"
                  />
                  </RowContainer>

                    </PaymentInfoForm>

                    : ''}

                 {paymentMode === 2
                      ? <PaymentInfoForm id="bankAccountForm" >
                        <TextField
                        className={classes.textField}
                        disabled={!editPaymentMode}
                          id="bankInstitution"
                          label="Bank institution number"
                          error={!!paymentModeErrorMsgs.bankInstitution}
                          helperText={paymentModeErrorMsgs.bankInstitution ? paymentModeErrorMsgs.bankInstitution : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.bankInstitution}
                          onChange={handleBankAccountChange('bankInstitution')}
                          type='number'
                        />
                        <TextField
                        className={classes.textField}
                        disabled={!editPaymentMode}
                          id="branchNumber"
                          label="Branch number"
                          error={!!paymentModeErrorMsgs.branchNumber}
                          helperText={paymentModeErrorMsgs.branchNumber ? paymentModeErrorMsgs.branchNumber : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.branchNumber}
                          onChange={handleBankAccountChange('branchNumber')}
                          type='number'
                        />
                        <TextField
                        className={classes.textField}
                        disabled={!editPaymentMode}
                          id="accountNumber"
                          label="Account number"
                          error={!!paymentModeErrorMsgs.accountNumber}
                          helperText={paymentModeErrorMsgs.accountNumber ? paymentModeErrorMsgs.accountNumber : ''}
                          variant="outlined"
                          InputProps={{ style: { color: '#888' } }}
                          value={bankAccount.accountNumber}
                          onChange={handleBankAccountChange('accountNumber')}
                          type='number'
                        />

                      </PaymentInfoForm>
                    : ''}
                <RowContainer>
                <Button disabled={!editPaymentMode} className={classes.cancelButton} variant='outlined' color='primary' onClick={cancelPaymentModeChange}>Cancel</Button>
                <Separator></Separator>
                <Button disabled={!editPaymentMode} className={classes.saveButton} variant='contained' color='secondary' onClick={savePaymentModeChange }>Save</Button>
                </RowContainer>
                </div>
                {(() => {
                    if (clientInfo.secondAuthentification === 2) {
                    return (
                    <div className={classes.section}>
                        <RowContainer>
                        <InputLabelStyled id="newOTP" >Renew your One Time-Password list</InputLabelStyled>
                        </RowContainer>
                        <RowContainer>
                        <OtpRenewButton
                        disabled={stateButton}
                        variant="contained"
                        onClick={renewOtpList}
                        color="primary">Generate new list</OtpRenewButton>
                        </RowContainer>
                        <RowContainer>
                        {errorMsgs.transferMessage && (
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }} className="message">
                                {errorMsgs.transferMessage} </p>
                        )}
                        </RowContainer>
                    </div>

                    )
                }
                })()}
            </PaperStyled>
            <CenteringDiv></CenteringDiv>
            </RowContainer>
            </Box>
        </Container>
    )
  }

  export default ClientProfilePage
