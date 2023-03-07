import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ExchangeAdTable from '../../../../Components/ExchangeAdTable/ExchangeAdTable'
import { Severity } from '../../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getAllClientExchangeAds } from '../../../../Api/Core/clientExchangeAds'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import { exchangeAdsState, errorState } from '../../../../Recoil/GlobalState'

const ExchangePage = () => {
  const [currentAds, setCurrentAds] = useRecoilState(exchangeAdsState)
  const [searchAds, setSearchAds] = useState(currentAds)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getAllClientExchangeAds()
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

  const changeCurrentAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchAds(currentAds)
    if (newSearchValue !== '') { setSearchAds(currentAds.filter((ad) => ad.supplierFromName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
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
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentAds}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <ExchangeAdTable
          setCurrentAds={setSearchAds}
          currentAds={searchAds} />
      </TableContainer>
    </Container>
  )
}

export default ExchangePage
