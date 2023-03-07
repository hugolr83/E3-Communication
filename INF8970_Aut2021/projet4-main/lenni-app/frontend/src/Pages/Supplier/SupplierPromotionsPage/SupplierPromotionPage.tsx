// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { Severity } from '../../../Api/Core/Interfaces'
import { addPromotion, getPromotion, deletePromotion } from '../../../Api/Supplier/supplier'
import { errorState } from '../../../Recoil/GlobalState'
import { Container, ConnectButton, Form, TextFieldStyled, MiddleBox, TableContainer, MyTable, MyTableCellHead, MyTableCellBody, TopBox, PromotionsBox, TitleBox, Title } from './Styled'
import { TableHead, TableRow, TableBody } from '@material-ui/core'
import { convertDate } from '../../../Api/utils'

const SupplierPromotionsPage = () => {
  const setCurrentErrorState = useSetRecoilState(errorState)
  const history = useHistory()
  const [loaded, setLoaded] = useState(false)

  const [values, setValues] = useState({
    pointsToLennis: '',
    dollarsToPoints: '',
    pointsToDollars: '',
    expirationDate: new Date()
  })

  const [oldValues, setOldValues] = useState({
    pointsToLenni: '',
    pointsToDollars: '',
    dollarsToPoints: '',
    promotionPtsToLenni: '',
    promotionPtsToDollars: '',
    promotionDollarToPts: '',
    promotionExpiryDate: new Date(),
    active: false
  })

  useEffect(() => {
    if (!loaded) {
      (async () => {
        try {
          const response = await getPromotion()
          const data = response.payload
          if (!response.hasErrors) {
            setLoaded(true)
            console.log(data.expirationDate)
            setOldValues({
              pointsToLenni: data.oldPointsToLennis,
              dollarsToPoints: data.oldDollarsToPoints,
              pointsToDollars: data.oldPointsToDollars,
              promotionPtsToLenni: data.newPointsToLennis,
              promotionDollarToPts: data.newDollarsToPoints,
              promotionPtsToDollars: data.newPointsToDollars,
              // eslint-disable-next-line no-useless-escape
              promotionExpiryDate: new Date(data.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')),
              active: data.active
            })
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

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        handlePromotion()
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

  const redirect = () => {
    history.push('/suppliers')
  }

  const handlePromotion = async () => {
    if (values.dollarsToPoints !== '' && values.pointsToDollars !== '' && values.pointsToLennis !== '' && values.expirationDate !== undefined) {
      const { errors, hasErrors, payload } = await addPromotion(values.pointsToLennis, values.dollarsToPoints, values.pointsToDollars, values.expirationDate)
      if (!hasErrors) {
        redirect()
        setCurrentErrorState((prev) => ({
          ...prev,
          open: true,
          // message: 'Promotion succesfully added',
          message: payload,
          severity: Severity.Success
        }))
      } else if (errors) {
        setCurrentErrorState((prev) => ({
          ...prev,
          open: true,
          message: 'Something went wrong',
          severity: Severity.Error
        }))
      }
    }
  }

  const handleDelete = async () => {
    const { errors, hasErrors } = await deletePromotion()
    if (!hasErrors) {
      redirect()
      setCurrentErrorState((prev) => ({
        ...prev,
        open: true,
        message: 'Promotion succesfully deleted',
        severity: Severity.Success
      }))
    } else if (errors) {
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
      <TitleBox>
          <h3><b>PROMOTIONS</b></h3>
      </TitleBox>
      <TopBox>
        <PromotionsBox>
          <TableContainer>
            <MyTable>
              <TableHead>
                <TableRow>
                  <MyTableCellHead>Actual point value</MyTableCellHead>
                  <MyTableCellHead></MyTableCellHead>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <MyTableCellBody component="th" scope="row">Points to Lenni</MyTableCellBody>
                  <MyTableCellBody component="th" scope="row" align="right">{oldValues.pointsToLenni}</MyTableCellBody>
                </TableRow>
                <TableRow>
                  <MyTableCellBody component="th" scope="row">Points to Dollars</MyTableCellBody>
                  <MyTableCellBody component="th" scope="row" align="right">{oldValues.pointsToDollars}</MyTableCellBody>
                </TableRow>
                <TableRow>
                  <MyTableCellBody component="th" scope="row">Dollars to Points</MyTableCellBody>
                  <MyTableCellBody component="th" scope="row" align="right">{oldValues.dollarsToPoints}</MyTableCellBody>
                </TableRow>
              </TableBody>
            </MyTable>
          </TableContainer>
        </PromotionsBox>
      </TopBox>
        <MiddleBox>
            {oldValues.active
            ? <PromotionsBox>
              <TableContainer>
                <MyTable>
                  <TableHead>
                    <TableRow>
                      <MyTableCellHead>Active Promotion</MyTableCellHead>
                      <MyTableCellHead></MyTableCellHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <MyTableCellBody component="th" scope="row">Points to Lenni</MyTableCellBody>
                      <MyTableCellBody component="th" scope="row" align="right">{oldValues.promotionPtsToLenni}</MyTableCellBody>
                    </TableRow>
                    <TableRow>
                      <MyTableCellBody component="th" scope="row">Points to Dollars</MyTableCellBody>
                      <MyTableCellBody component="th" scope="row" align="right">{oldValues.promotionPtsToDollars}</MyTableCellBody>
                    </TableRow>
                    <TableRow>
                      <MyTableCellBody component="th" scope="row">Dollars to Points</MyTableCellBody>
                      <MyTableCellBody component="th" scope="row" align="right">{oldValues.promotionDollarToPts}</MyTableCellBody>
                    </TableRow>
                    <TableRow>
                      <MyTableCellBody component="th" scope="row">Expiration Date</MyTableCellBody>
                      <MyTableCellBody component="th" scope="row" align="right" width="max-content">{convertDate(oldValues.promotionExpiryDate)}</MyTableCellBody>
                    </TableRow>
                  </TableBody>
                </MyTable>
              </TableContainer>
            </PromotionsBox>
            : <h4>No Active Promotions</h4>
            }
        </MiddleBox>
        <MiddleBox>
        {oldValues.active
            ? <ConnectButton
                onClick={handleDelete}
                variant="contained"
                color="primary">
                DELETE PROMOTION
              </ConnectButton>
              : <div></div> }
        </MiddleBox>
        <MiddleBox>
          <PromotionsBox>
            <Form>
              <Title>Create a Promotion</Title>
              <TextFieldStyled
                  id="pointsToLennis"
                  placeholder="New Points To Lennis"
                  value={values.pointsToLennis}
                  variant="filled"
                  InputProps={{ style: { color: '#888' } }}
                  onChange={handleChange('pointsToLennis')}
              />
              <TextFieldStyled
                  id="pointsToDollars"
                  placeholder="New Points To Dollars"
                  value={values.pointsToDollars}
                  variant="filled"
                  InputProps={{ style: { color: '#888' } }}
                  onChange={handleChange('pointsToDollars')}
              />
              <TextFieldStyled
                  id="dollarsToPoints"
                  placeholder="New Dollars To Points"
                  value={values.dollarsToPoints}
                  variant="filled"
                  InputProps={{ style: { color: '#888' } }}
                  onChange={handleChange('dollarsToPoints')}
              />
              <TextFieldStyled
                  id="expiryDate"
                  placeholder="Expiry Date"
                  type="date"
                  value={values.expirationDate}
                  variant="filled"
                  InputProps={{ style: { color: '#888' } }}
                  onChange={handleChange('expirationDate')}
              />
              <ConnectButton
                  onClick={handlePromotion}
                  variant="contained"
                  color="primary"
              >CREATE PROMOTION</ConnectButton>
          </Form>
        </PromotionsBox>
      </MiddleBox>
    </Container>
  )
}

export default SupplierPromotionsPage
