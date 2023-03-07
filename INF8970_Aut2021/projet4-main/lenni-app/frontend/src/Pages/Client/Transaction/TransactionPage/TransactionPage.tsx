import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { BoxMetric, BoxValue, Container, TransferFundsButton, SalesBox, TopBox, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import AdTable from '../../../../Components/AdTable/AdTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getAllClientAds } from '../../../../Api/Core/clientAds'
import { getClientFunds } from '../../../../Api/Core/users'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { addFundsValue, adsState, errorState } from '../../../../Recoil/GlobalState'

const TransactionPage = () => {
  const [currentAds, setCurrentAds] = useRecoilState(adsState)
  const [searchAds, setSearchAds] = useState(currentAds)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const setAddFunds = useSetRecoilState(addFundsValue)
  const history = useHistory()
  const [funds, setFunds] = useState()

  const redirect = () => {
    setAddFunds((prev) => ({ ...prev, history: '/client/transaction/buyPoints' }))
    history.push('/client/balance/addFunds')
  }

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getAllClientAds()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentAds(response.payload)
          setSearchAds(response.payload)
        } else {
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Error while fetching ads',
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
    return () => {
      disposed = true
    }
  }, [currentAds])

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getClientFunds()
        if (disposed) return
        if (!response.hasErrors) {
          setFunds(response.payload)
        } else {
          console.error('🚀 ~ clientDashboard ~ getClientPoints')
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
    return () => {
      disposed = true
    }
  }, [])

  const changeCurrentAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchAds(currentAds)
    if (newSearchValue !== '') { setSearchAds(currentAds.filter((ad) => ad.supplierName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchAds(currentAds)
    } else {
      setSearchAds(currentAds.filter((ad) => isLaterDate(ad.timestamp, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchAds(currentAds)
    } else {
      setSearchAds(currentAds.filter((ad) => isEarlierDate(ad.timestamp, newDate)))
    }
  }

  return (
    <Container>
      <TopBox>
        <SalesBox elevation={1}>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" >
                Funds
              </Typography>
            </BoxMetric>
            <BoxValue>
              <Typography variant="h4" color="textSecondary" style={{ fontWeight: 'bold' }}>
              {funds} $
              </Typography>
            </BoxValue>
        </SalesBox>
        <SalesBox elevation={1}>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" >
                Transfer money to your account
              </Typography>
            </BoxMetric>
            <BoxValue>
              <TransferFundsButton
                onClick={redirect}
                variant="contained"
                color="primary">
                  Transfer funds
              </TransferFundsButton>
            </BoxValue>
        </SalesBox>
      </TopBox>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentAds}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <AdTable
          setCurrentAds={setSearchAds}
          currentAds={searchAds} />
      </TableContainer>
    </Container>
  )
}

export default TransactionPage
