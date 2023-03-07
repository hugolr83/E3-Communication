import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryTransactionTable from '../../../../Components/ClientHistoryTransactionTable/ClientHistoryTransactionTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getTransactionHistory } from '../../../../Api/Core/clientOperations'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { clientTransactionsState, errorState } from '../../../../Recoil/GlobalState'

const ClientHistoryPage = () => {
  const [currentClientTransactions, setCurrentClientTransactions] = useRecoilState(clientTransactionsState)
  const [searchClientTransactions, setSearchClientTransactions] = useState(currentClientTransactions)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getTransactionHistory()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientTransactions(response.payload)
          setSearchClientTransactions(response.payload)
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
    if (newSearchValue === '') setSearchClientTransactions(currentClientTransactions)
    if (newSearchValue !== '') { setSearchClientTransactions(currentClientTransactions.filter((transaction) => transaction.supplierName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientTransactions(currentClientTransactions)
    } else {
      setSearchClientTransactions(currentClientTransactions.filter((transaction) => isLaterDate(transaction.timestamp, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientTransactions(currentClientTransactions)
    } else {
      setSearchClientTransactions(currentClientTransactions.filter((transaction) => isEarlierDate(transaction.timestamp, newDate)))
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
        <ClientHistoryTransactionTable
          setCurrentClientTransactions={setSearchClientTransactions}
          currentClientTransactions={searchClientTransactions} />
      </TableContainer>
    </Container>
  )
}

export default ClientHistoryPage
