// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import DatePicker from '../../../Components/DatePicker/DatePicker'
import UserTable from '../../../Components/UserTable/UserTable'
import { Severity } from '../../../Api/Core/Interfaces'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { fetchAllUsers } from '../../../Api/Core/users'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { usersState, errorState } from '../../../Recoil/GlobalState'
import { isLaterDate, isEarlierDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminUserPage = () => {
  const [currentUsers, setCurrentUsers] = useRecoilState(usersState)
  const [searchUsers, setSearchUsers] = useState(currentUsers)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await fetchAllUsers()
        if (disposed) return
        if (!response.has_errors) {
          setCurrentUsers(response.payload)
          setSearchUsers(response.payload)
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

  const changeCurrentUsers = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchUsers(currentUsers)
    if (newSearchValue !== '') { setSearchUsers(currentUsers.filter((user) => user.firstname.toLowerCase().includes(newSearchValue.toLowerCase()))) }
  }
  const changeFromDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchUsers(currentUsers)
    } else {
      setSearchUsers(currentUsers.filter((user) => isLaterDate(user.userInfo.lastConnection, newDate)))
    }
  }

  const changeToDate = (newDate: MaterialUiPickersDate) => {
    if (!newDate) {
      setSearchUsers(currentUsers)
    } else {
      setSearchUsers(currentUsers.filter((user) => isEarlierDate(user.userInfo.lastConnection, newDate)))
    }
  }

  return (
    <Container> <TableContainer>
        <TableActions>
          <SearchInput
            changeCurrentData={changeCurrentUsers}
          />
          <DatePicker name="From" defaultValue={new Date('2021-01-01')} changeDate={changeFromDate} />
          <DatePicker name="To" defaultValue={new Date()} changeDate={changeToDate} />
        </TableActions>
        {currentUsers.length === 0
      ? <Loader
      type="TailSpin"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000}
    />
    : <UserTable
          setCurrentUsers={setSearchUsers}
          currentUsers={searchUsers.filter(user => !user.pending)} />}
      </TableContainer>
    </Container>
  )
}

export default AdminUserPage
