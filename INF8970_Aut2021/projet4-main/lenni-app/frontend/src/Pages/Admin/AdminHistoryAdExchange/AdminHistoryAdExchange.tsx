// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryAdExchangeTable from '../../../Components/HistoryAdExchangeTable/HistoryAdExchangeTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryAdExchanges } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyExchangeAdState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from '../../../Api/utils'

const AdminHistoryAdExchange = () => {
    const [currentExchangeAds, setcurrentExchangeAds] = useRecoilState(historyExchangeAdState)
    const [searchExchangeAds, setsearchExchangeAds] = useState(currentExchangeAds)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryAdExchanges(false)
                if (disposed) return
                if (!response.has_errors) {
                    setcurrentExchangeAds(response.payload)
                    setsearchExchangeAds(response.payload)
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
        if (newSearchValue === '') setsearchExchangeAds(currentExchangeAds)
        if (newSearchValue !== '') { setsearchExchangeAds(currentExchangeAds.filter((exchangeAd) => exchangeAd.sellerUsername.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setsearchExchangeAds(currentExchangeAds)
        } else {
            setsearchExchangeAds(currentExchangeAds.filter((exchangeAd) => isLaterDate(exchangeAd.timestamp, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setsearchExchangeAds(currentExchangeAds)
        } else {
            setsearchExchangeAds(currentExchangeAds.filter((exchangeAd) => isEarlierDate(exchangeAd.timestamp, newDate)))
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
                <HistoryAdExchangeTable
                    setCurrentExchangeAds={setsearchExchangeAds}
                    currentExchangeAds={searchExchangeAds} />
            </TableContainer>
        </Container>
    )
}

export default AdminHistoryAdExchange
