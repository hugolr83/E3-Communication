// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import SupplierTable from '../../../Components/SupplierTable/SupplierTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllSuppliers } from '../../../Api/Core/suppliers'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { suppliersState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminSupplierPage = () => {
  const [currentSuppliers, setCurrentSuppliers] = useRecoilState(suppliersState)
  const [searchSuppliers, setSearchSuppliers] = useState(currentSuppliers)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await fetchAllSuppliers()
        if (disposed) return
        if (!response.has_errors) {
          setCurrentSuppliers(response.payload)
          setSearchSuppliers(response.payload)
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

  const changeCurrentSuppliers = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchSuppliers(currentSuppliers)
    if (newSearchValue !== '') { setSearchSuppliers(currentSuppliers.filter((supplier) => supplier.businessName.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }

  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchSuppliers(currentSuppliers)
    } else {
      setSearchSuppliers(currentSuppliers.filter((supplier) => isLaterDate(supplier.userInfo.lastConnection, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchSuppliers(currentSuppliers)
    } else {
      setSearchSuppliers(currentSuppliers.filter((supplier) => isEarlierDate(supplier.userInfo.lastConnection, newDate)))
    }
  }

  return (
    <Container>
      <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentSuppliers}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-02')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        {currentSuppliers.length === 0
      ? <Loader
      type="TailSpin"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000}
    />
    : <SupplierTable
          setCurrentSuppliers={setSearchSuppliers}
          currentSuppliers={searchSuppliers.filter(supplier => !supplier.pending)}
        />}
      </TableContainer>
    </Container>
  )
}

export default AdminSupplierPage
