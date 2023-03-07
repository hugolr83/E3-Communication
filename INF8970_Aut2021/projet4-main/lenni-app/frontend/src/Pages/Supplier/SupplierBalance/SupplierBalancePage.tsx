// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { ISupplierBalance, ITransferSupplier, Severity } from '../../../Api/Core/Interfaces'
import { Paper, TableContainer, TableHead, TableRow, TableBody } from '@material-ui/core'
import { Container, MiddleBox, Title, UsersBox, MyTable, MyTableCellHead, MyTableCellBody, TopBox } from './Styled'

import { getTransfersHistory } from '../../../Api/Supplier/supplier'
import { errorState } from '../../../Recoil/GlobalState'
const SupplierBalancePage = () => {
    const [transfers, setTransfers] = useState<ITransferSupplier[]>([{
        pointsAreOwed: false,
        username: '',
        supplier: '',
        transferredPoints: 0,
        pointsToLennis: 0,
        timestamp: ''
    }])
    const [balances, setBalances] = useState([{
        supplier: '',
        total: 0
    }])
    const setCurrentErrorState = useSetRecoilState(errorState)

    useEffect(() => {
        let disposed = false;
        (async () => {
          try {
            const response = await getTransfersHistory()
            if (disposed) return
            if (!response.hasErrors) {
                setTransfers(response.payload)
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
        const tempBalances: Array <ISupplierBalance> = []
        transfers.forEach(transfer => {
            let exists = false
            tempBalances.forEach(balance => {
                if (transfer.supplier === balance.supplier) {
                    balance.total += transfer.pointsAreOwed ? -transfer.transferredPoints : transfer.transferredPoints
                    exists = true
                }
            })
            if (!exists) {
                tempBalances.push({
                    supplier: transfer.supplier,
                    total: transfer.pointsAreOwed ? -transfer.transferredPoints : transfer.transferredPoints
                })
            }
        })
        setBalances(tempBalances)
      }, [transfers])

      const getBackgroundColor = (pointsAreOwed: boolean) => {
          return pointsAreOwed ? '#ffcccb' : '#ddffdd'
      }

    return (
        <Container className="pcoded-main-container">
            <TopBox>
                <UsersBox>
                    <Title variant="h6" color="textSecondary"><b>Balance</b></Title>
                    <TableContainer component={Paper}>
                        <MyTable>
                            <TableHead>
                                <TableRow>
                                    <MyTableCellHead>Supplier</MyTableCellHead>
                                    <MyTableCellHead align="right">Balance</MyTableCellHead>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {balances.map((row) => (
                                    <TableRow>
                                        <MyTableCellBody component="th" scope="row">{row.supplier}</MyTableCellBody>
                                        <MyTableCellBody component="th" scope="row" align="right">{row.total}</MyTableCellBody>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </MyTable>
                    </TableContainer>
                </UsersBox>
            </TopBox>
            <MiddleBox>
                <UsersBox>
                    <Title variant="h6" color="textSecondary"><b>Transfers History</b></Title>
                    <TableContainer component={Paper}>
                        <MyTable>
                            <TableHead>
                                <TableRow>
                                    <MyTableCellHead>Username</MyTableCellHead>
                                    <MyTableCellHead>Supplier</MyTableCellHead>
                                    <MyTableCellHead>Transferred Points</MyTableCellHead>
                                    <MyTableCellHead>Points to Lenni</MyTableCellHead>
                                    <MyTableCellHead>Date</MyTableCellHead>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transfers.map((row) => (
                                    <TableRow style={{ backgroundColor: getBackgroundColor(row.pointsAreOwed) }}>
                                        <MyTableCellBody component="th" scope="row">{row.username}</MyTableCellBody>
                                        <MyTableCellBody component="th" scope="row">{row.supplier}</MyTableCellBody>
                                        <MyTableCellBody component="th" scope="row">{row.transferredPoints}</MyTableCellBody>
                                        <MyTableCellBody component="th" scope="row">{row.pointsToLennis}</MyTableCellBody>
                                        <MyTableCellBody component="th" scope="row">{row.timestamp.split('T')[0]}</MyTableCellBody>
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
export default SupplierBalancePage
