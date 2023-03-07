import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import { clientExchangeAdsState, errorState } from '../../../../Recoil/GlobalState'
import { useSetRecoilState, useRecoilState } from 'recoil'

import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import { Severity } from '../../../../Api/Core/Interfaces'
import { getClientExchangeAds } from '../../../../Api/Core/clientExchangeAds'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientExchangeAdTable from '../../../../Components/ClientExchangeAdTable/ClientExchangeAdTable'
import SearchInput from '../../../../Components/SearchInput/SearchInput'

const ClientCurrentAds = () => {
    const setCurrentErrorState = useSetRecoilState(errorState)

    const [currentClientExchangeAds, setCurrentClientExchangeAds] = useRecoilState(clientExchangeAdsState)
    const [searchClientExchangeAds, setSearchClientExchangeAds] = useState(currentClientExchangeAds)

    useEffect(() => {
    let disposed = false;
    (async () => {
        try {
        const response = await getClientExchangeAds()
        if (disposed) return
        if (!response.hasErrors) {
            setCurrentClientExchangeAds(response.payload)
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

    const changeCurrentClientAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientExchangeAds(currentClientExchangeAds)
    if (newSearchValue !== '') { setSearchClientExchangeAds(currentClientExchangeAds.filter((ad) => ad.supplierFromName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
        setSearchClientExchangeAds(currentClientExchangeAds)
    } else {
        setSearchClientExchangeAds(currentClientExchangeAds.filter((ad) => isLaterDate(ad.timestamp, newDate)))
    }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
        setSearchClientExchangeAds(currentClientExchangeAds)
    } else {
        setSearchClientExchangeAds(currentClientExchangeAds.filter((ad) => isEarlierDate(ad.timestamp, newDate)))
    }
    }

    return (
        <Container>
            <TableContainer>
              <TableActions>
                <SearchInput
                  changeCurrentData={changeCurrentClientAds}
                />
                <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
              </TableActions>
              <ClientExchangeAdTable
                setCurrentClientExchangeAds={setSearchClientExchangeAds}
                currentClientExchangeAds={searchClientExchangeAds} />
            </TableContainer>
        </Container>
      )
}
export default ClientCurrentAds
