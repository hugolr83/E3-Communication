// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryExchangeTable from '../../../Components/HistoryExchangeTable/HistoryExchangeTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryExchanges } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyExchangeState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminHistoryExchange = () => {
    const [currentExchanges, setCurrentExchanges] = useRecoilState(historyExchangeState)
    const [searchExchanges, setSearchExchanges] = useState(currentExchanges)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryExchanges()
                if (disposed) return
                if (!response.has_errors) {
                    setCurrentExchanges(response.payload)
                    setSearchExchanges(response.payload)
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

    const changeCurrentExchanges = (newSearchValue: string) => {
        if (newSearchValue === '') setSearchExchanges(currentExchanges)
        if (newSearchValue !== '') { setSearchExchanges(currentExchanges.filter((exchange) => exchange._id.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchExchanges(currentExchanges)
        } else {
            setSearchExchanges(currentExchanges.filter((exchange) => isLaterDate(exchange.exchangeDate, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchExchanges(currentExchanges)
        } else {
            setSearchExchanges(currentExchanges.filter((exchange) => isEarlierDate(exchange.exchangeDate, newDate)))
        }
    }

    return (
        <Container>{!currentExchanges
            ? <Loader
                type="TailSpin"
                color="#00BFFF"
                height={100}
                width={100}
            />
            : <TableContainer>
            timeout={3000}
                <TableActions>
                    <SearchInput
                        changeCurrentData={changeCurrentExchanges}
                    />
                    <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                    <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
                </TableActions>
                <HistoryExchangeTable
                    setCurrentExchanges={setSearchExchanges}
                    currentExchanges={searchExchanges} />
            </TableContainer>}
        </Container>
    )
}

export default AdminHistoryExchange
