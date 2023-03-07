import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryExchangeAdTable from '../../../../Components/ClientHistoryExchangeAdTable/ClientHistoryExchangeAdTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getClientBoughtExchangeAds } from '../../../../Api/Core/clientExchangeAds'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from '../../../../Api/utils'
import { clientExchangeBoughtAdsState, errorState } from '../../../../Recoil/GlobalState'

const ClientHistoryAds = () => {
  const [currentClientBoughtExchangeAds, setCurrentClientBoughtExchangeAds] = useRecoilState(clientExchangeBoughtAdsState)
  const [searchClientExchangeAds, setSearchClientExchangeAds] = useState(currentClientBoughtExchangeAds)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getClientBoughtExchangeAds()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientBoughtExchangeAds(response.payload)
          setSearchClientExchangeAds(response.payload)
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
  }, [])

  const changecurrentClientBoughtExchangeAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientExchangeAds(currentClientBoughtExchangeAds)
    if (newSearchValue !== '') { setSearchClientExchangeAds(currentClientBoughtExchangeAds.filter((exchange) => exchange.supplierFromName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientExchangeAds(currentClientBoughtExchangeAds)
    } else {
      setSearchClientExchangeAds(currentClientBoughtExchangeAds.filter((exchange) => isLaterDate(exchange.exchangeDate, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientExchangeAds(currentClientBoughtExchangeAds)
    } else {
      setSearchClientExchangeAds(currentClientBoughtExchangeAds.filter((exchange) => isEarlierDate(exchange.exchangeDate, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changecurrentClientBoughtExchangeAds}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ClientHistoryExchangeAdTable
          setCurrentClientBoughtExchangeAds={setSearchClientExchangeAds}
          currentClientBoughtExchangeAds={searchClientExchangeAds} />
      </TableContainer>
    </Container>
  )
}

export default ClientHistoryAds
