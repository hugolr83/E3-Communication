// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Paper, TableContainer, TableHead, TableRow, TableBody, Typography } from '@material-ui/core'
import { Container, BoxContainer, TopBox, MiddleBox, Title, SalesBox, UsersBox, MyTable, MyTableCellHead, MyTableCellBody, BoxMetric, BoxValue } from './Styled'
import { getPoints } from '../../../Api/Supplier/supplier'
import { useHistory } from 'react-router'
import { useSetRecoilState } from 'recoil'
import { errorState, clientPointState } from '../../../Recoil/GlobalState'
import { ISupplierPoints, Severity } from '../../../Api/Core/Interfaces'

// userID: user._id, lastname:user.lastname, firstname:user.firstname, username:userInfo.username, quantity

const SupplierDashboardPage = () => {
  const [points, setPoints] = useState<ISupplierPoints[]>([{
    userID: '',
    lastname: '',
    firstname: '',
    username: '',
    quantity: 0
  }])
  const [totalPoints, setTotalPoints] = useState<number>(0)
  // const [pointValue, setPointValue] = useState(0)
  const setClientPoint = useSetRecoilState(clientPointState)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const history = useHistory()

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getPoints()
        if (disposed) return
        if (!response.hasErrors) {
          setPoints(response.payload)
          disposed = true
        } else {
          console.error('SupplierDashboard ~ getPoints')
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'something went wrong',
            severity: Severity.Error
          }))
        }
      } catch (err: any) {
        console.error(err.msg)
        setCurrentErrorState((prev) => ({
          ...prev,
          open: true,
          message: 'something went wrong',
          severity: Severity.Error
        }))
      }
    })()
    return () => {
      disposed = true
    }
  }, [])

  useEffect(() => {
    let total = 0
    points.forEach(point => {
      total += point.quantity
    })
    setTotalPoints(total)
  }, [points])

  const handlePointClick = (client: ISupplierPoints) => {
    setClientPoint(client)
    history.push('suppliers/points')
  }

  return (
    <Container className="pcoded-main-container">
      <TopBox>
        <SalesBox elevation={1}>
          <BoxContainer>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" >
                Total Points
              </Typography>
            </BoxMetric>
            <BoxValue>
              <Typography variant="h4" color="textSecondary" style={{ fontWeight: 'bold' }}>
                {totalPoints}
              </Typography>
            </BoxValue>
          </BoxContainer>
        </SalesBox>
      </TopBox>
      <MiddleBox>
        <UsersBox>
          <Title variant="h6" color="textSecondary"><b>POINTS</b></Title>
          <TableContainer component={Paper}>
              <MyTable>
                <TableHead>
                  <TableRow>
                    <MyTableCellHead>Firstname </MyTableCellHead>
                    <MyTableCellHead>Lastname </MyTableCellHead>
                    <MyTableCellHead align="right">Points</MyTableCellHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {points.map((row) => (
                      row.quantity === 0
                      ? <div></div>
                      : <TableRow key={row.userID} onClick={() => handlePointClick(row)}>
                        <MyTableCellBody component="th" scope="row">{row.firstname}</MyTableCellBody>
                        <MyTableCellBody component="th" scope="row">{row.lastname}</MyTableCellBody>
                        <MyTableCellBody align="right">{row.quantity}</MyTableCellBody>
                      </TableRow>
                    ))}
                </TableBody>
              </MyTable>
            </TableContainer>
        </UsersBox>
      </MiddleBox>
    </Container>
  )
}

export default SupplierDashboardPage
