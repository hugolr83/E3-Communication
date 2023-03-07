import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from '../Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryTransferTable from '../../../../Components/ClientHistoryTransferTable/ClientHistoryTransferTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getTransferHistory } from '../../../../Api/Core/clientOperations'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { clientTransfersState, errorState } from '../../../../Recoil/GlobalState'

const TransferHistoryPage = () => {
  const [currentClientTransfers, setCurrentClientTransfers] = useRecoilState(clientTransfersState)
  const [searchClientTransfers, setSearchClientTransfers] = useState(currentClientTransfers)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getTransferHistory()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientTransfers(response.payload)
          setSearchClientTransfers(response.payload)
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

  const changeCurrentClientTransfers = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientTransfers(currentClientTransfers)
    if (newSearchValue !== '') { setSearchClientTransfers(currentClientTransfers.filter((transaction) => transaction.supplierIDA.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientTransfers(currentClientTransfers)
    } else {
      setSearchClientTransfers(currentClientTransfers.filter((transaction) => isLaterDate(transaction.timestamp, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientTransfers(currentClientTransfers)
    } else {
      setSearchClientTransfers(currentClientTransfers.filter((transaction) => isEarlierDate(transaction.timestamp, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentClientTransfers}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ClientHistoryTransferTable
          setCurrentClientTransfers={setSearchClientTransfers}
          currentClientTransfers={searchClientTransfers} />
      </TableContainer>
    </Container>
  )
}

export default TransferHistoryPage
