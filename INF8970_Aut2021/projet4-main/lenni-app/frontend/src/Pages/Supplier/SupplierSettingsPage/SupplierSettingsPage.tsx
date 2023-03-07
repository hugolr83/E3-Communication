// eslint-disable-next-line no-use-before-define
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../../Recoil/GlobalState'
import { SupplierData, Severity } from '../../../Api/Core/Interfaces'
import { Box, Button, FormControl, IconButton, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { getSupplier, updateSupplier } from '../../../Api/Supplier/supplier'
import { CenteringDiv, Container, InputLabelColor, InputLabelStyled, PaperStyled, RowContainer, Separator } from './Styled'
import EditSharpIcon from '@material-ui/icons/EditSharp'
import { useAuth } from '../../../Api/Auth/use-auth'

const newStyle = makeStyles((theme: Theme) => ({
  label: {
      background: 'white',
      color: 'black',
      marginLeft: theme.spacing(2),
      marginTop: 0
  },
  select: {
      color: '#888',
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black'
      }
  },
  textField: {
      flexDirection: 'column',
      wordWrap: 'break-word',
      backgroundColor: '#fff',
      backgroundClip: 'border-box',
      color: '#888',
      TextStyle: { color: '#888' },
      width: '100%',
      '& .MuiInputBase-root': {
          color: '#888'
      },
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#888'
      }
  },
  icon: {
      fill: '#b8b8b8'
  },
  root: {
      color: '#b8b8b8',
      marginTop: theme.spacing(2)
  },
  section: {
      margin: theme.spacing(1),
      border: '1px solid #3f4d67',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1)
  },
  saveButton: {
      marginTop: theme.spacing(2),
      flex: 1
  },
  cancelButton: {
      marginTop: theme.spacing(2),
      flex: 1
  }
}))

const SupplierSettingsPage = () => {
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [loaded, setLoaded] = useState(false)
  const classes = newStyle()
  const [editAccountInfo, setEditAccountInfo] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const auth = useAuth()

  const [supplierData, setSupplierData] = useState<SupplierData>({
    businessName: '',
    businessNumber: '',
    username: '',
    password: '',
    newPassword: '',
    email: '',
    pointsToLennis: '',
    dollarsToPoints: '',
    pointsToDollars: '',
    street: '',
    city: '',
    province: '',
    postalCode: ''
  })

  const [values, setValues] = useState({
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
    newPassword: '',
    confirmNewPassword: '',
    email: '',
    showPassword: false,
    hasErrors: false
  })

  const [accountErrors, setAccountErrors] = useState({
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
    email: ''
  })

  const [pswdErrors, setPswdErrors] = useState({
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  useEffect(() => {
    if (!loaded) {
      (async () => {
        try {
          const response = await getSupplier()
          const data = response.payload[0]
          if (!response.hasErrors) {
            setLoaded(true)
            setValues({
              businessName: data.businessName,
              businessNumber: data.businessNumber,
              username: data.username,
              password: '',
              newPassword: '',
              confirmNewPassword: '',
              email: data.email,
              pointsToLennis: data.pointsToLennis,
              dollarsToPoints: data.dollarsToPoints,
              pointsToDollars: data.pointsToDollars,
              street: data.street,
              city: data.city,
              province: data.province,
              postalCode: data.postalCode,
              showPassword: false,
              hasErrors: false
            })
            setSupplierData({
              businessName: data.businessName,
              businessNumber: data.businessNumber,
              username: data.username,
              password: '',
              newPassword: '',
              email: data.email,
              pointsToLennis: data.pointsToLennis,
              dollarsToPoints: data.dollarsToPoints,
              pointsToDollars: data.pointsToDollars,
              street: data.street,
              city: data.city,
              province: data.province,
              postalCode: data.postalCode
            })
            resetErrors(2)
          } else {
            console.error('SupplierSettings ~ getSupplier')
            setCurrentErrorState((prev) => ({
              ...prev,
              open: true,
              message: 'something went wrong',
              severity: Severity.Error
            }))
          }
        } catch (err: any) {
          console.error(err.msg)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: err.msg,
            severity: Severity.Error
          }))
        }
      })()
    }
  })

  const handleEditAccountInfo = () => {
    setEditAccountInfo(true)
  }
  const handleEditChangePassword = () => {
    setChangePassword(true)
  }

  const showErrorMsg = (errors: any, section: number) => {
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
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      email: ''
    }
    for (const err of errors) {
      if (err.param) {
      tempError = { ...tempError, [err.param]: err.msg }
      }
    }
    if (section === 1) {
      setAccountErrors({
        businessName: tempError.businessName,
        businessNumber: tempError.businessNumber,
        pointsToLennis: tempError.pointsToLennis,
        dollarsToPoints: tempError.dollarsToPoints,
        pointsToDollars: tempError.pointsToDollars,
        street: tempError.street,
        city: tempError.city,
        province: tempError.province,
        postalCode: tempError.postalCode,
        username: tempError.username,
        email: tempError.email
      })
    } else if (section === 2) {
      setPswdErrors({
        password: tempError.oldPassword,
        newPassword: tempError.newPassword,
        confirmNewPassword: tempError.confirmNewPassword
      })
    }
  }

  const resetErrors = (section: number) => {
    if (section === 0 || section === 1) {
      setAccountErrors({
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
        email: ''
      })
    }
    if (section === 0 || section === 2) {
      setPswdErrors({
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      })
    }
  }

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleAccountUpdate = async () => {
    const newSupplierData: SupplierData = {
      businessName: values.businessName,
      businessNumber: values.businessNumber,
      username: values.username,
      password: '',
      newPassword: '',
      email: values.email,
      pointsToLennis: values.pointsToLennis,
      dollarsToPoints: values.dollarsToPoints,
      pointsToDollars: values.pointsToDollars,
      street: values.street,
      city: values.city,
      province: values.province,
      postalCode: values.postalCode
    }
    const { errors, hasErrors } = await updateSupplier(newSupplierData.businessName,
      newSupplierData.businessNumber,
      newSupplierData.username,
      newSupplierData.email,
      newSupplierData.pointsToLennis,
      newSupplierData.dollarsToPoints,
      newSupplierData.pointsToDollars,
      newSupplierData.street,
      newSupplierData.city,
      newSupplierData.province,
      newSupplierData.postalCode)
    if (!hasErrors) {
      setSupplierData(newSupplierData)
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Your account parameters have been succesfully updated',
        severity: Severity.Success
      }))
      setValues({
        businessName: newSupplierData.businessName,
        businessNumber: newSupplierData.businessNumber,
        username: newSupplierData.username,
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        email: newSupplierData.email,
        pointsToLennis: newSupplierData.pointsToLennis,
        dollarsToPoints: newSupplierData.dollarsToPoints,
        pointsToDollars: newSupplierData.pointsToDollars,
        street: newSupplierData.street,
        city: newSupplierData.city,
        province: newSupplierData.province,
        postalCode: newSupplierData.postalCode,
        showPassword: false,
        hasErrors: false
      })
      resetErrors(1)
      setEditAccountInfo(false)
    } else if (errors) {
      showErrorMsg(errors, 1)
    }
  }

  const handlePasswordUpdate = async () => {
    if (values.newPassword !== values.confirmNewPassword) {
      showErrorMsg([{ param: 'confirmNewPassword', msg: 'passwords don\'t match' }], 2)
      return
    }
    const { errors, hasErrors } = await auth.changePassword(
      values.password,
      values.newPassword)
    if (!hasErrors) {
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Your account password has been succesfully updated',
        severity: Severity.Success
      }))
      cancelPasswordChange()
    } else if (errors) {
      showErrorMsg(errors, 2)
      }
  }

  const cancelAccountInfoChange = () => {
    setValues({
      businessName: supplierData.businessName,
      businessNumber: supplierData.businessNumber,
      username: supplierData.username,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      email: supplierData.email,
      pointsToLennis: supplierData.pointsToLennis,
      dollarsToPoints: supplierData.dollarsToPoints,
      pointsToDollars: supplierData.pointsToDollars,
      street: supplierData.street,
      city: supplierData.city,
      province: supplierData.province,
      postalCode: supplierData.postalCode,
      showPassword: false,
      hasErrors: false
    })
    resetErrors(1)
    setEditAccountInfo(false)
  }

  const cancelPasswordChange = () => {
    setValues({
      businessName: supplierData.businessName,
      businessNumber: supplierData.businessNumber,
      username: supplierData.username,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      email: supplierData.email,
      pointsToLennis: supplierData.pointsToLennis,
      dollarsToPoints: supplierData.dollarsToPoints,
      pointsToDollars: supplierData.pointsToDollars,
      street: supplierData.street,
      city: supplierData.city,
      province: supplierData.province,
      postalCode: supplierData.postalCode,
      showPassword: false,
      hasErrors: false
    })
    resetErrors(2)
    setChangePassword(false)
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
                  id="businessName"
                  label="Business Name"
                  error={!!accountErrors.businessName}
                  helperText={accountErrors.businessName ? accountErrors.businessName : ''}
                  variant="outlined"
                  className={classes.textField}
                  value={values.businessName}
                  onChange={handleChange('businessName')}
                />
                <Separator></Separator>
                <TextField
                  disabled={!editAccountInfo}
                  id="businessNumber"
                  label="Business Number"
                  error={!!accountErrors.businessNumber}
                  helperText={accountErrors.businessNumber ? accountErrors.businessNumber : ''}
                  variant="outlined"
                  className={classes.textField}
                  type="number"
                  value={values.businessNumber}
                  onChange={handleChange('businessNumber')}
                />
              </RowContainer>
              <TextField
                  disabled={!editAccountInfo}
                  id="username"
                  label="username"
                  error={!!accountErrors.username}
                  helperText={accountErrors.username ? accountErrors.username : ''}
                  variant="outlined"
                  className={classes.textField}
                  value={values.username}
                  onChange={handleChange('username')}
              />
              <TextField
                  disabled={!editAccountInfo}
                  id="email"
                  label="email"
                  error={!!accountErrors.email}
                  helperText={accountErrors.email ? accountErrors.email : ''}
                  variant="outlined"
                  className={classes.textField}
                  value={values.email}
                  onChange={handleChange('email')}
              />
              <RowContainer>
                <TextField
                  disabled={!editAccountInfo}
                  id="pointsToLennis"
                  label="Points to Lennis ratio"
                  error={!!accountErrors.pointsToLennis}
                  helperText={accountErrors.pointsToLennis ? accountErrors.pointsToLennis : ''}
                  variant="outlined"
                  className={classes.textField}
                  type="number"
                  value={values.pointsToLennis}
                  onChange={handleChange('pointsToLennis')}
                />
                <Separator></Separator>
                <TextField
                  disabled={!editAccountInfo}
                  id="pointsToDollars"
                  label="Points to CAD ratio"
                  error={!!accountErrors.pointsToDollars}
                  helperText={accountErrors.pointsToDollars ? accountErrors.pointsToDollars : ''}
                  variant="outlined"
                  className={classes.textField}
                  type="number"
                  value={values.pointsToDollars}
                  onChange={handleChange('pointsToDollars')}
                />
                <TextField
                  disabled={!editAccountInfo}
                  id="dollarsToPoints"
                  label="CAD to Points ratio"
                  error={!!accountErrors.dollarsToPoints}
                  helperText={accountErrors.dollarsToPoints ? accountErrors.dollarsToPoints : ''}
                  variant="outlined"
                  className={classes.textField}
                  type="number"
                  value={values.dollarsToPoints}
                  onChange={handleChange('dollarsToPoints')}
                />
              </RowContainer>
              <RowContainer>
                <TextField
                    className={classes.textField}
                    disabled={!editAccountInfo}
                    id="street"
                    label="Street"
                    error={!!accountErrors.street}
                    helperText={accountErrors.street ? accountErrors.street : ''}
                    variant="outlined"
                    value={values.street}
                    onChange={handleChange('street')}
                />
                <Separator></Separator>
                <TextField
                    className={classes.textField}
                    disabled={!editAccountInfo}
                    id="city"
                    label="City"
                    error={!!accountErrors.city}
                    helperText={accountErrors.city ? accountErrors.city : ''}
                    variant="outlined"
                    value={values.city}
                    onChange={handleChange('city')}
                />
              </RowContainer>
              <RowContainer>
                <FormControl fullWidth>
                  <InputLabel id="province" style={InputLabelColor}>Province</InputLabel>
                  <Select
                    disabled={!editAccountInfo}
                    variant="outlined"
                    labelId="province"
                    // label="Province"
                    id="select-province"
                    value={values.province}
                    onChange={handleChange('province')}
                    className={classes.select}
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
                      error={!!accountErrors.postalCode}
                      helperText={accountErrors.postalCode ? accountErrors.postalCode : ''}
                      variant="outlined"
                      value={values.postalCode}
                      onChange={handleChange('postalCode')}
                  />
                </RowContainer>
                <RowContainer>
                  <Button disabled={!editAccountInfo} className={classes.cancelButton} variant='outlined' color='primary' onClick={cancelAccountInfoChange}>Cancel</Button>
                  <Separator></Separator>
                  <Button disabled={!editAccountInfo} className={classes.saveButton} variant='contained' color='secondary' onClick={handleAccountUpdate }>Save</Button>
                </RowContainer>
              </div>
              <div className={classes.section}>
                <RowContainer>
                  <InputLabelStyled id="changePassword" >Change Password</InputLabelStyled>
                  <IconButton disabled={changePassword} aria-label="edit" onClick={handleEditChangePassword} color="secondary">
                    <EditSharpIcon />
                  </IconButton>
                </RowContainer>
              <TextField
                disabled={!changePassword}
                id="oldPassword"
                label="Old password"
                error={!!pswdErrors.password}
                helperText={pswdErrors.password ? pswdErrors.password : ''}
                type={values.showPassword ? 'text' : 'password'}
                variant="outlined"
                className={classes.textField}
                value={values.password}
                onChange={handleChange('password')}
              />
              <TextField
                disabled={!changePassword}
                id="newPassword"
                label="New password"
                error={!!pswdErrors.newPassword}
                helperText={pswdErrors.newPassword ? pswdErrors.newPassword : ''}
                type={values.showPassword ? 'text' : 'password'}
                variant="outlined"
                className={classes.textField}
                value={values.newPassword}
                onChange={handleChange('newPassword')}
              />
              <TextField
                disabled={!changePassword}
                id="confirmPassword"
                label="Confirm password"
                error={!!pswdErrors.confirmNewPassword}
                helperText={pswdErrors.confirmNewPassword ? pswdErrors.confirmNewPassword : ''}
                type={values.showPassword ? 'text' : 'password'}
                variant="outlined"
                className={classes.textField}
                value={values.confirmNewPassword}
                onChange={handleChange('confirmNewPassword')}
              />
              <RowContainer>
                <input disabled={!changePassword} type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" onClick={handleClickShowPassword}/>
                <label htmlFor="checkbox-fill-a1" className="cr"> Show password</label>
              </RowContainer>
              <RowContainer>
                <Button disabled={!changePassword} className={classes.cancelButton} variant='outlined' color='primary' onClick={cancelPasswordChange}>Cancel</Button>
                <Separator></Separator>
                <Button disabled={!changePassword} className={classes.saveButton} variant='contained' color='secondary' onClick={handlePasswordUpdate }>Save</Button>
              </RowContainer>
            </div>
          </PaperStyled>
        <CenteringDiv></CenteringDiv>
        </RowContainer>
      </Box>
    </Container>
  )
}

export default SupplierSettingsPage
