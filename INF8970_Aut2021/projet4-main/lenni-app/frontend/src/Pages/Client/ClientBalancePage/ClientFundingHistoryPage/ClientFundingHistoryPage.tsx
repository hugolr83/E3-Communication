import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from '../Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryFundingTable from '../../../../Components/ClientHistoryFundingTable/ClientHistoryFundingTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getFundingHistory } from '../../../../Api/Core/clientOperations'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { clientFundingsState, errorState } from '../../../../Recoil/GlobalState'

const FundingHistoryPage = () => {
  const [currentClientFundings, setCurrentClientFundings] = useRecoilState(clientFundingsState)
  const [searchClientFundings, setSearchClientFundings] = useState(currentClientFundings)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getFundingHistory()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientFundings(response.payload)
          setSearchClientFundings(response.payload)
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

  const changeCurrentClientFundings = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientFundings(currentClientFundings)
    if (newSearchValue !== '') { setSearchClientFundings(currentClientFundings.filter((funding) => funding.amount.toString().includes(newSearchValue))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientFundings(currentClientFundings)
    } else {
      setSearchClientFundings(currentClientFundings.filter((funding) => isLaterDate(funding.timestamp, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientFundings(currentClientFundings)
    } else {
      setSearchClientFundings(currentClientFundings.filter((funding) => isEarlierDate(funding.timestamp, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentClientFundings}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ClientHistoryFundingTable
          setCurrentClientFundings={setSearchClientFundings}
          currentClientFundings={searchClientFundings} />
      </TableContainer>
    </Container>
  )
}

export default FundingHistoryPage
