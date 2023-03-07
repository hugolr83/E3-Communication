import { useEffect, useState } from 'react'
import { BoxMetric, BoxValue, LeftBoxContainer, RightBoxContainer, Container, MiddleBox, MyTable, MyTableCellBody, MyTableCellHead, SalesBox, Title, TopBox, PromotionsBox, PointsBox } from './Styled'
import { clientPointsState, errorState } from '../../../Recoil/GlobalState'
import { useSetRecoilState, useRecoilState } from 'recoil'

import { TableBody, TableContainer, TableHead, TableRow, Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ClientDashboardTabs from '../../../Components/ClientDashboardTabs/ClientDashboardTabs'
import { getClientFunds, getClientPoints } from '../../../Api/Core/users'
import { getActivePromotions } from '../../../Api/Core/supplierOperations'
import { IPromotion, Severity } from '../../../Api/Core/Interfaces'
import { convertDate } from '../../../Api/utils'

const useStyles = makeStyles({
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 }
  }
})

const ClientDashboardPage = () => {
  const classes = useStyles()
  const [points, setPoints] = useRecoilState(clientPointsState)
  const [funds, setFunds] = useState()
  const [promotions, setPromotions] = useState<IPromotion[]>([])
  const setCurrentErrorState = useSetRecoilState(errorState)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getClientPoints()
        if (disposed) return
        if (!response.hasErrors) {
          setPoints(response.payload)
        } else {
          console.error('🚀 ~ clientDashboard ~ getClientPoints')
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
          message: err.msg,
          severity: Severity.Error
        }))
      }
    })()
    return () => {
      disposed = true
    }
  }, [points])

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getClientFunds()
        if (disposed) return
        if (!response.hasErrors) {
          setFunds(response.payload)
        } else {
          console.error('🚀 ~ clientDashboard ~ getClientPoints')
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
          message: err.msg,
          severity: Severity.Error
        }))
      }
    })()
    return () => {
      disposed = true
    }
  }, [])

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const response = await getActivePromotions()
        if (disposed) return
        if (!response.hasErrors) {
          const temp: IPromotion[] = []
          response.payload.forEach((promotion: any) => {
            temp.push({
              _id: '',
              supplierId: promotion.supplierId,
              supplierBusinessName: promotion.supplierBusinessName,
              supplierBusinnessNumber: 0,
              oldPointsToLennis: 0,
              oldDollarsToPoints: 0,
              oldPointsToDollars: 0,
              newPointsToLennis: promotion.newPointsToLennis,
              newDollarsToPoints: promotion.newDollarsToPoints,
              newPointsToDollars: promotion.newPointsToDollars,
              startDate: new Date(),
              // eslint-disable-next-line no-useless-escape
              expirationDate: new Date(promotion.expirationDate.replace(/-/g, '\/').replace(/T.+/, ''))
            })
          })
          setPromotions(temp)
        } else {
          console.error('🚀 ~ clientDashboard ~ getActivePromotions')
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
          message: err.msg,
          severity: Severity.Error
        }))
      }
    })()
    return () => {
      disposed = true
    }
  }, [promotions])

  return (
    <Container className="pcoded-main-container">
      <LeftBoxContainer>
        <TopBox>
          <SalesBox elevation={1}>
              <BoxMetric>
                <Typography variant="h5" color="textSecondary" >
                  Funds
                </Typography>
              </BoxMetric>
              <BoxValue>
                <Typography variant="h4" color="textSecondary" style={{ fontWeight: 'bold' }}>
                {funds} $
                </Typography>
              </BoxValue>
          </SalesBox>
        </TopBox>
        <MiddleBox>
          <PointsBox>
            <Title variant="h6" color="textSecondary"><b>POINTS</b></Title>
            <TableContainer component={Paper}>
                <MyTable>
                  <TableHead>
                    <TableRow>
                      <MyTableCellHead>Supplier </MyTableCellHead>
                      <MyTableCellHead align="right">Points</MyTableCellHead>
                      <MyTableCellHead align="center" colSpan={2}>Equivalence</MyTableCellHead>
                    </TableRow>
                    <TableRow>
                      <MyTableCellHead colSpan={2} />
                      <MyTableCellHead align="right">App Points</MyTableCellHead>
                      <MyTableCellHead align="right">Dollars</MyTableCellHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {points.length !== 0
                      ? points.map((row) => (
                        <TableRow
                          key={row.supplier}
                          className={classes.tableRow}
                        >
                          <MyTableCellBody component="th" scope="row">
                            {row.supplier}
                          </MyTableCellBody>
                          <MyTableCellBody align="right">{row.quantity}</MyTableCellBody>
                          <MyTableCellBody align="right">{Math.round(row.quantity * row.pointsToLennis)}</MyTableCellBody>
                          <MyTableCellBody align="right">{Math.round(row.quantity * row.pointsToDollars * 100) / 100}</MyTableCellBody>
                        </TableRow>
                        ))
                        : <MyTableCellBody colSpan={5}> You don't have any points at the moment </MyTableCellBody>}
                  </TableBody>
                </MyTable>
              </TableContainer>
          </PointsBox>
        </MiddleBox>
        <MiddleBox>
          <PromotionsBox>
            <Title variant="h6" color="textSecondary"><b>SUPPLIER PROMOTIONS</b></Title>
            <TableContainer component={Paper}>
                <MyTable>
                  <TableHead>
                    <TableRow>
                      <MyTableCellHead>Supplier </MyTableCellHead>
                      <MyTableCellHead align="right">Points to app</MyTableCellHead>
                      <MyTableCellHead align="right">Dollars to points</MyTableCellHead>
                      <MyTableCellHead align="right">Points to dollars</MyTableCellHead>
                      <MyTableCellHead align="right">Expiration date</MyTableCellHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions.length !== 0
                      ? promotions.map((row) => (
                        <TableRow
                          key={row.supplierBusinessName}
                          className={classes.tableRow}
                        >
                          <MyTableCellBody component="th" scope="row">
                            {row.supplierBusinessName}
                          </MyTableCellBody>
                          <MyTableCellBody align="center">{Math.round(row.newPointsToLennis * 1000) / 1000}</MyTableCellBody>
                          <MyTableCellBody align="center">{Math.round(row.newDollarsToPoints * 1000) / 1000}</MyTableCellBody>
                          <MyTableCellBody align="center">{Math.round(row.newPointsToDollars * 1000) / 1000}</MyTableCellBody>
                          <MyTableCellBody align="right">{convertDate(row.expirationDate)}</MyTableCellBody>
                        </TableRow>
                        ))
                      : <MyTableCellBody colSpan={5}> No promotions at the moment </MyTableCellBody>}
                  </TableBody>
                </MyTable>
              </TableContainer>
          </PromotionsBox>
        </MiddleBox>
      </LeftBoxContainer>
      <RightBoxContainer>
        <TableContainer>
          <ClientDashboardTabs />
        </TableContainer>
      </RightBoxContainer>
    </Container>
  )
}

export default ClientDashboardPage
