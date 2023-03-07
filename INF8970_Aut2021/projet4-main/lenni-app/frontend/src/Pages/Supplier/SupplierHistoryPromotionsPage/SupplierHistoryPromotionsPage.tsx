// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../../src/Components/SearchInput/SearchInput'
import DatePicker from '../../../../src/Components/DatePicker/DatePicker'
import { IPromotionData, Severity } from '../../../../src/Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { getPromotionHistory } from '../../../../src/Api/Core/supplierOperations'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLaterDate, isEarlierDate } from './../../../../src/Api/utils'
import { errorState, supplierPromotionsState } from '../../../../src/Recoil/GlobalState'
import SupplierHistoryPromotionsTable from '../../../../src/Components/SupplierHistoryPromotionsTable/SupplierHistoryPromotionsTable'

const SupplierHistoryPromotionsPage = () => {
  const [currentSupplierPromotions, setCurrentSupplierPromotions] = useRecoilState(supplierPromotionsState)
  const [searchSupplierPromotions, setSearchSupplierPromotions] = useState(currentSupplierPromotions)
  const setCurrentErrorState = useSetRecoilState(errorState)
  console.log(setCurrentSupplierPromotions)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getPromotionHistory()
        if (disposed) return
        if (!response.hasErrors) {
          const temp: IPromotionData[] = []
          response.payload.forEach((promotion: any) => {
            temp.push({
              _id: promotion._id,
              oldPointsToLennis: promotion.oldPointsToLennis,
              oldDollarsToPoints: promotion.oldDollarsToPoints,
              oldPointsToDollars: promotion.oldPointsToDollars,
              newPointsToLennis: promotion.newPointsToLennis,
              newDollarsToPoints: promotion.newDollarsToPoints,
              newPointsToDollars: promotion.newPointsToDollars,
              // eslint-disable-next-line no-useless-escape
              currentDate: new Date(promotion.currentDate.replace(/-/g, '\/').replace(/T.+/, '')),
              // eslint-disable-next-line no-useless-escape
              expirationDate: new Date(promotion.expirationDate.replace(/-/g, '\/').replace(/T.+/, '')),
              expired: promotion.expired
            })
          })
          setCurrentSupplierPromotions(temp)
          setSearchSupplierPromotions(temp)
          console.log('🚀 ~ SupplierHistoryPromotionsPage ~ response.payload', response.payload)
        } else {
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Error while fetching promotions',
            severity: Severity.Error
          }))
        }
      } catch (err: any) {
        console.error(err.msg)
        setCurrentErrorState((prev) => ({
          ...prev,
          open: true,
          message: 'Something went wrong',
          severity: Severity.Error
        }))
      }
    })()
    return () => {
      disposed = true
    }
  }, [])

  const changeCurrentSuppliersPromotions = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchSupplierPromotions(currentSupplierPromotions)
    if (newSearchValue !== '') { setSearchSupplierPromotions(currentSupplierPromotions.filter((promotion) => promotion.oldPointsToLennis.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchSupplierPromotions(currentSupplierPromotions)
    } else {
      setSearchSupplierPromotions(currentSupplierPromotions.filter((promotion) => isLaterDate(promotion.expirationDate, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchSupplierPromotions(currentSupplierPromotions)
    } else {
      setSearchSupplierPromotions(currentSupplierPromotions.filter((promotion) => isEarlierDate(promotion.expirationDate, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentSuppliersPromotions}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        <SupplierHistoryPromotionsTable
          setCurrentSupplierPromotions={setSearchSupplierPromotions}
          currentSupplierPromotions={searchSupplierPromotions} />
      </TableContainer>
    </Container>
  )
}

export default SupplierHistoryPromotionsPage
