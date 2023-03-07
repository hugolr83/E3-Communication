import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientHistoryAdTable from '../../../../Components/ClientHistoryAdTable/ClientHistoryAdTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getClientBoughtAds } from '../../../../Api/Core/clientAds'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from '../../../../Api/utils'
import { clientBoughtAdsState, errorState } from '../../../../Recoil/GlobalState'

const ClientHistoryAds = () => {
  const [currentClientBoughtAds, setCurrentClientBoughtAds] = useRecoilState(clientBoughtAdsState)
  const [searchClientAds, setSearchClientAds] = useState(currentClientBoughtAds)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getClientBoughtAds()
        if (disposed) return
        if (!response.hasErrors) {
          setCurrentClientBoughtAds(response.payload)
          setSearchClientAds(response.payload)
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

  const changecurrentClientBoughtAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientAds(currentClientBoughtAds)
    if (newSearchValue !== '') { setSearchClientAds(currentClientBoughtAds.filter((transaction) => transaction.supplierName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientAds(currentClientBoughtAds)
    } else {
      setSearchClientAds(currentClientBoughtAds.filter((transaction) => isLaterDate(transaction.timestamp, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchClientAds(currentClientBoughtAds)
    } else {
      setSearchClientAds(currentClientBoughtAds.filter((transaction) => isEarlierDate(transaction.timestamp, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changecurrentClientBoughtAds}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ClientHistoryAdTable
          setCurrentClientBoughtAds={setSearchClientAds}
          currentClientBoughtAds={searchClientAds} />
      </TableContainer>
    </Container>
  )
}

export default ClientHistoryAds
