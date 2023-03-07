// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryAdTable from '../../../Components/HistoryAdTable/HistoryAdTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryAds } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyAdState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from '../../../Api/utils'

const AdminHistoryAd = () => {
    const [currentAds, setcurrentAds] = useRecoilState(historyAdState)
    const [searchAds, setsearchAds] = useState(currentAds)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryAds()
                if (disposed) return
                if (!response.has_errors) {
                    setcurrentAds(response.payload)
                    setsearchAds(response.payload)
                } else {
                    console.error(response.err_msg)
                    setCurrentErrorState((prev) => ({
                        ...prev,
                        open: true,
                        message: response.err_msg,
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
        if (newSearchValue === '') setsearchAds(currentAds)
        if (newSearchValue !== '') { setsearchAds(currentAds.filter((ad) => ad.clientUsername.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setsearchAds(currentAds)
        } else {
            setsearchAds(currentAds.filter((ad) => isLaterDate(ad.timestamp, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setsearchAds(currentAds)
        } else {
            setsearchAds(currentAds.filter((ad) => isEarlierDate(ad.timestamp, newDate)))
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
                <HistoryAdTable
                    setCurrentAds={setsearchAds}
                    currentAds={searchAds} />
            </TableContainer>
        </Container>
    )
}

export default AdminHistoryAd
