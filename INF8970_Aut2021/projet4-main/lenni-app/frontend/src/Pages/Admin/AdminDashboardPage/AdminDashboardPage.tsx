// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { BoxMetric, BoxValue, BoxContainer, Container, MiddleBox, SalesBox, Title, TopBox, UsersBox, SuppliersBox } from './Styled'
import PendingUserList from '../../../Components/PendingUserList/PendingUserList'
import PendingSupplierList from '../../../Components/PendingSupplierList/PendingSupplierList'
import { Typography } from '@material-ui/core'
import { Severity, IUser, ISuppliers } from '../../../Api/Core/Interfaces'
import { fetchAllUsers } from '../../../Api/Core/users'
import { fetchAllSuppliers } from '../../../Api/Core/suppliers'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { usersState, suppliersState, errorState } from '../../../Recoil/GlobalState'
import Loader from 'react-loader-spinner'

const value_Leni: number = 5

const AdminDashboardPage = () => {
  const [currentUsers, setCurrentUsers] = useRecoilState(usersState)
  const [currentSuppliers, setCurrentSuppliers] = useRecoilState(suppliersState)
  const [currentValue_CU, setCurrentValue_CU] = useState(0)
  const [currentValue_CS, setCurrentValue_CS] = useState(0)
  const [currentValue_RU, setCurrentValue_RU] = useState(0)
  const [currentValue_RS, setCurrentValue_RS] = useState(0)
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const responseUser = await fetchAllUsers()
        const responseSuppliers = await fetchAllSuppliers()
        if (disposed) return
        if (!responseUser.has_errors) {
          const users: IUser[] = responseUser.payload
          setCurrentUsers(users)
          setCurrentValue_RU(users.filter(user => !user.pending).length)
          setCurrentValue_CU(users.filter(user => user.userInfo.activeSessions > 0).length)
        } else {
          console.error(responseUser.err_msg)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: responseUser.err_msg,
            severity: Severity.Error
          }))
        }
        if (!responseSuppliers.has_errors) {
          const suppliers: ISuppliers[] = responseSuppliers.payload
          setCurrentSuppliers(suppliers)
          setCurrentValue_RS(suppliers.filter(supplier => !supplier.pending).length)
          setCurrentValue_CS(suppliers.filter(supplier => supplier.userInfo.activeSessions > 0).length)
        } else {
          console.error(responseSuppliers.err_msg)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: responseSuppliers.err_msg,
            severity: Severity.Error
          }))
        }
      } catch (err: any) {
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
  }, [currentUsers, currentSuppliers, currentValue_RU, currentValue_RS])

  return (
    <Container className="pcoded-main-container">
      <TopBox>
        <SalesBox elevation={1}>
          <BoxContainer>
            <BoxMetric>
            <Typography variant="h5" color="textSecondary" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                CONNECTED
              </Typography>
            </BoxMetric>
            <BoxValue>
            <Typography variant="h4" color="textSecondary" style={{ borderRight: '1px solid rgba(0, 0, 0, .5)', paddingRight: '15px' }} >
                {currentValue_CU} clients
              </Typography>
              <Typography variant="h4" color="textSecondary" style={{ paddingLeft: '15px' }} >
                {currentValue_CS} suppliers
              </Typography>
            </BoxValue>
          </BoxContainer>
        </SalesBox>
        <SalesBox elevation={1}>
          <BoxContainer>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                REGISTERED
              </Typography>
            </BoxMetric>
            <BoxValue>
            <Typography variant="h4" color="textSecondary" style={{ borderRight: '1px solid rgba(0, 0, 0, .5)', paddingRight: '15px' }} >
                {currentValue_RU} clients
              </Typography>
              <Typography variant="h4" color="textSecondary" style={{ paddingLeft: '15px' }} >
                {currentValue_RS} suppliers
              </Typography>
            </BoxValue>
          </BoxContainer>
        </SalesBox>
        <SalesBox elevation={1}>
          <BoxContainer>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" style={{ fontWeight: 'bold' }}>
                LENNI VALUE
              </Typography>
            </BoxMetric>
            <BoxValue>
              <Typography variant="h4" color="textSecondary">
                {value_Leni}$
              </Typography>
            </BoxValue>
          </BoxContainer>
        </SalesBox>
      </TopBox>
      <MiddleBox>
        <UsersBox>
          <Title variant="h6" color="textSecondary"><b>PENDING CLIENTS</b></Title>{currentUsers.length === 0
            ? <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
          : <PendingUserList currentUsers={currentUsers} setCurrentUsers={setCurrentUsers}/>}
        </UsersBox>
        <SuppliersBox>
          <Title variant="h6" color="textSecondary"><b>PENDING SUPPLIERS</b></Title>{currentSuppliers.length === 0
            ? <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
          : <PendingSupplierList currentSuppliers={currentSuppliers} setCurrentSuppliers={setCurrentSuppliers} />}
        </SuppliersBox>
      </MiddleBox>
    </Container>
  )
}

export default AdminDashboardPage
