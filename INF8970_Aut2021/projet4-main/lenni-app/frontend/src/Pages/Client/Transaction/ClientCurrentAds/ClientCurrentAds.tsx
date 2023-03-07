import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import { clientAdsState, errorState } from '../../../../Recoil/GlobalState'
import { useSetRecoilState, useRecoilState } from 'recoil'

import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import { Severity } from '../../../../Api/Core/Interfaces'
import { getClientAds } from '../../../../Api/Core/clientAds'
import { isLaterDate, isEarlierDate } from './../../../../Api/utils'
import DatePicker from '../../../../Components/DatePicker/DatePicker'
import ClientAdTable from '../../../../Components/ClientAdTable/ClientAdTable'
import SearchInput from '../../../../Components/SearchInput/SearchInput'

const ClientCurrentAds = () => {
    const setCurrentErrorState = useSetRecoilState(errorState)

    const [currentClientAds, setCurrentClientAds] = useRecoilState(clientAdsState)
    const [searchClientAds, setSearchClientAds] = useState(currentClientAds)

    useEffect(() => {
    let disposed = false;
    (async () => {
        try {
        const response = await getClientAds()
        if (disposed) return
        if (!response.hasErrors) {
            setCurrentClientAds(response.payload)
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

    const changeCurrentClientAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientAds(currentClientAds)
    if (newSearchValue !== '') { setSearchClientAds(currentClientAds.filter((ad) => ad.supplierName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
        setSearchClientAds(currentClientAds)
    } else {
        setSearchClientAds(currentClientAds.filter((ad) => isLaterDate(ad.timestamp, newDate)))
    }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
        setSearchClientAds(currentClientAds)
    } else {
        setSearchClientAds(currentClientAds.filter((ad) => isEarlierDate(ad.timestamp, newDate)))
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
              <ClientAdTable
                setCurrentClientAds={setSearchClientAds}
                currentClientAds={searchClientAds} />
            </TableContainer>
        </Container>
      )
}
export default ClientCurrentAds
