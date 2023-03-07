// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import HistoryPromotionTable from '../../../Components/HistoryPromotionTable/HistoryPromotionTable'
import { IPromotion, Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllHistoryPromotions } from '../../../Api/Core/AppAcitvitiesHistory'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { historyPromotionState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from '../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminHistoryPromotion = () => {
    const [currentPromotions, setCurrentPromotions] = useRecoilState(historyPromotionState)
    const [searchPromotions, setSearchPromotions] = useState(currentPromotions)
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
            try {
                const response = await fetchAllHistoryPromotions()
                if (disposed) return
                if (!response.has_errors) {
                    console.log(response.payload)
                    const temp: IPromotion[] = []
                    response.payload.forEach((promotion: any) => {
                        temp.push({
                        _id: promotion._id,
                        supplierId: promotion.supplierId,
                        supplierBusinessName: promotion.supplierBusinessName,
                        supplierBusinnessNumber: promotion.supplierBusinnessNumber,
                        oldPointsToLennis: promotion.oldPointsToLennis,
                        oldDollarsToPoints: promotion.oldDollarsToPoints,
                        oldPointsToDollars: promotion.oldPointsToDollars,
                        newPointsToLennis: promotion.newPointsToLennis,
                        newDollarsToPoints: promotion.newDollarsToPoints,
                        newPointsToDollars: promotion.newPointsToDollars,
                        // eslint-disable-next-line no-useless-escape
                        startDate: new Date(promotion.startDate.replace(/-/g, '\/').replace(/T.+/, '')),
                        // eslint-disable-next-line no-useless-escape
                        expirationDate: new Date(promotion.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
                        })
                    })
                    setCurrentPromotions(temp)
                    setSearchPromotions(temp)
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

    const changeCurrentPromotions = (newSearchValue: string) => {
        if (newSearchValue === '') setSearchPromotions(currentPromotions)
        if (newSearchValue !== '') { setSearchPromotions(currentPromotions.filter((promotion) => promotion._id.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }
    const changeFromDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchPromotions(currentPromotions)
        } else {
            setSearchPromotions(currentPromotions.filter((promotion) => isLaterDate(promotion.startDate, newDate)))
        }
    }

    const changeToDate = (newDate: MaterialUiPickersDate) => {
        if (!newDate) {
            setSearchPromotions(currentPromotions)
        } else {
            setSearchPromotions(currentPromotions.filter((promotion) => isEarlierDate(promotion.startDate, newDate)))
        }
    }

    return (
        <Container>{currentPromotions.length === 0
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
                            changeCurrentData={changeCurrentPromotions}
                        />
                        <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
                        <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
                    </TableActions>
                    <HistoryPromotionTable
                        setCurrentPromotions={setSearchPromotions}
                        currentPromotions={searchPromotions} />
                </TableContainer>
            }
        </Container>
    )
}

export default AdminHistoryPromotion
