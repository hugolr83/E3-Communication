import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryExchangeTable from '../../../../Components/ClientHistoryExchangeTable/ClientHistoryExchangeTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getExchangeHistory } from '../../../../Api/Core/clientOperations'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { clientExchangesState, errorState } from '../../../../Recoil/GlobalState'

const ClientHistoryPage = () => {
  const [currentClientExchanges, setCurrentClientExchanges] = useRecoilState(clientExchangesState)
  const [searchClientExchanges, setSearchClientExchanges] = useState(currentClientExchanges)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getExchangeHistory()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientExchanges(response.payload)
          setSearchClientExchanges(response.payload)
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

  const changeCurrentClientTransactions = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientExchanges(currentClientExchanges)
    if (newSearchValue !== '') { setSearchClientExchanges(currentClientExchanges.filter((exchange) => exchange.supplierFromName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientExchanges(currentClientExchanges)
    } else {
      setSearchClientExchanges(currentClientExchanges.filter((exchange) => isLaterDate(exchange.exchangeDate, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientExchanges(currentClientExchanges)
    } else {
      setSearchClientExchanges(currentClientExchanges.filter((exchange) => isEarlierDate(exchange.exchangeDate, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentClientTransactions}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ClientHistoryExchangeTable
          setCurrentClientExchanges={setSearchClientExchanges}
          currentClientExchanges={searchClientExchanges} />
      </TableContainer>
    </Container>
  )
}

export default ClientHistoryPage
