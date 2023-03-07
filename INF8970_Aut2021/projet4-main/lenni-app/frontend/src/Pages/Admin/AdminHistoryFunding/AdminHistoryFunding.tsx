// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryFundingTable from '../../../Components/HistoryFundingTable/HistoryFundingTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryFundings } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyFundingState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from '../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminHistoryFunding = () => {
    const [currentFundings, setCurrentFundings] = useRecoilState(historyFundingState)
    const [searchFundings, setSearchFundings] = useState(currentFundings)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryFundings()
                if (disposed) return
                if (!response.has_errors) {
                    setCurrentFundings(response.payload)
                    setSearchFundings(response.payload)
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

    const changeCurrentFundings = (newSearchValue: string) => {
        if (newSearchValue === '') setSearchFundings(currentFundings)
        if (newSearchValue !== '') { setSearchFundings(currentFundings.filter((funding) => funding._id.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchFundings(currentFundings)
        } else {
            setSearchFundings(currentFundings.filter((funding) => isLaterDate(funding.timestamp, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchFundings(currentFundings)
        } else {
            setSearchFundings(currentFundings.filter((funding) => isEarlierDate(funding.timestamp, newDate)))
        }
    }

    return (
        <Container>{currentFundings.length === 0
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
                            changeCurrentData={changeCurrentFundings}
                        />
                        <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                        <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
                    </TableActions>
                    <HistoryFundingTable
                        setCurrentFundings={setSearchFundings}
                        currentFundings={searchFundings} />
                </TableContainer>
            }
        </Container>
    )
}

export default AdminHistoryFunding
