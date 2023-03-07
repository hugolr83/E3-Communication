// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryTransferTable from '../../../Components/HistoryTransferTable/HistoryTransferTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryTransfers } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyTransferState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from '../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminHistoryTransfer = () => {
    const [currentTransfers, setCurrentTransfers] = useRecoilState(historyTransferState)
    const [searchTransfers, setSearchTransfers] = useState(currentTransfers)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryTransfers()
                if (disposed) return
                if (!response.has_errors) {
                    setCurrentTransfers(response.payload)
                    setSearchTransfers(response.payload)
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

    const changeCurrentTransfers = (newSearchValue: string) => {
        if (newSearchValue === '') setSearchTransfers(currentTransfers)
        if (newSearchValue !== '') { setSearchTransfers(currentTransfers.filter((transfer) => transfer.username.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchTransfers(currentTransfers)
        } else {
            setSearchTransfers(currentTransfers.filter((transfer) => isLaterDate(transfer.timestamp, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchTransfers(currentTransfers)
        } else {
            setSearchTransfers(currentTransfers.filter((transfer) => isEarlierDate(transfer.timestamp, newDate)))
        }
    }

    return (
        <Container>{currentTransfers.length === 0
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
                        changeCurrentData={changeCurrentTransfers}
                    />
                    <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                    <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
                </TableActions>
                <HistoryTransferTable
                    setCurrentTransfers={setSearchTransfers}
                    currentTransfers={searchTransfers} />
            </TableContainer>}
        </Container>
    )
}

export default AdminHistoryTransfer
