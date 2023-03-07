// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryTransactionTable from '../../../Components/HistoryTransactionTable/HistoryTransactionTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryTransactions } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyTransactionState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminHistoryTransaction = () => {
    const [currentTransactions, setCurrentTransactions] = useRecoilState(historyTransactionState)
    const [searchTransactions, setSearchTransactions] = useState(currentTransactions)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryTransactions()
                if (disposed) return
                if (!response.has_errors) {
                    setCurrentTransactions(response.payload)
                    setSearchTransactions(response.payload)
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

    const changeCurrentTransactions = (newSearchValue: string) => {
        if (newSearchValue === '') setSearchTransactions(currentTransactions)
        if (newSearchValue !== '') { setSearchTransactions(currentTransactions.filter((transaction) => transaction._id.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchTransactions(currentTransactions)
        } else {
            setSearchTransactions(currentTransactions.filter((transaction) => isLaterDate(transaction.timestamp, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchTransactions(currentTransactions)
        } else {
            setSearchTransactions(currentTransactions.filter((transaction) => isEarlierDate(transaction.timestamp, newDate)))
        }
    }

    return (
        <Container>{currentTransactions.length === 0
            ? <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
            />
            : <TableContainer>
                    <TableActions>
                        <SearchInput
                            changeCurrentData={changeCurrentTransactions}
                        />
                        <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                        <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
                    </TableActions>
                    <HistoryTransactionTable
                        setCurrentTransactions={setSearchTransactions}
                        currentTransactions={searchTransactions} />
                </TableContainer>
            }
        </Container>
    )
}

export default AdminHistoryTransaction
