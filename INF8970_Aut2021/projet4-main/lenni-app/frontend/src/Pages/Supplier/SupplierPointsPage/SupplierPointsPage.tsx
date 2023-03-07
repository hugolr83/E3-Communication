// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Paper, TableContainer, TableBody, TableHead, TableRow, InputLabel, Select, MenuItem } from '@material-ui/core'
import { Container, MiddleBox, Title, UsersBox, MyTable, MyTableCellBody, MyTableCellHead, UpdateButton } from './Styled'
import { clientPointState, errorState } from '../../../Recoil/GlobalState'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { getPoints, updatePoints } from '../../../Api/Supplier/supplier'
import { ISupplierPoints, Severity } from '../../../Api/Core/Interfaces'
import { useHistory } from 'react-router-dom'

const SupplierPointsPage = () => {
    const client = useRecoilValue(clientPointState)
    const setClient = useSetRecoilState(clientPointState)
    const setCurrentErrorState = useSetRecoilState(errorState)
    const [input, setInput] = useState<number>()
    const history = useHistory()
    const [points, setPoints] = useState<ISupplierPoints[]>([{
      userID: '',
      lastname: '',
      firstname: '',
      username: '',
      quantity: 0
    }])

    useEffect(() => {
      let disposed = false;
      (async () => {
        if (disposed) return
        try {
          const response = await getPoints()
          if (!response.hasErrors) {
            setPoints(response.payload)
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

    const handleChange = (event: any) => {
      const value = event.target.value.replace(/\+|-/ig, '')
      setInput(value)
    }

    const redirect = () => {
      history.push('/suppliers')
    }

    const changePoints = async() => {
      try {
        if (input !== undefined && input >= 0) {
          const response = await updatePoints(client.userID, input)
          if (!response.hasErrors) {
            redirect()
            setCurrentErrorState((prev) => ({
              ...prev,
              open: true,
              message: 'Points succesfully updated',
              severity: Severity.Success
            }))
          } else {
            console.error('SupplierPoints ~ updatePoints')
            setCurrentErrorState((prev) => ({
              ...prev,
              open: true,
              message: 'something went wrong',
              severity: Severity.Error
            }))
          }
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
    }

    const handleClientChange = (event: any) => {
      points.forEach(point => {
        if (point.username === event.target.value) {
          setClient(point)
        }
      })
    }

    return (
      <Container className="pcoded-main-container">
        <MiddleBox>
          <UsersBox>
            <Title variant="h6" color="textSecondary"><b>CLIENT</b></Title>
            <TableContainer component={Paper}>
            <MyTable>
              <TableHead>
                <MyTableCellHead>
                  <InputLabel id="clients" style={{ color: 'white' }}>Clients</InputLabel>
                  <Select
                    variant="outlined"
                    labelId="clients"
                    label="Client"
                    id="select-client"
                    value={client.username}
                    onChange={handleClientChange}
                  >
                    {points.map((row) => (
                      <MenuItem value={row.username}>{row.username}</MenuItem>
                    ))}
                  </Select>
                  </MyTableCellHead>
                  <MyTableCellHead></MyTableCellHead>
                </TableHead>
                {client.username === ''
                ? <TableBody>
                  <TableRow>
                    <MyTableCellBody>Choose client from list above or on the dashboard by clicking on a row</MyTableCellBody>
                  </TableRow>
                </TableBody>
                : <TableBody>
                  <TableRow>
                    <MyTableCellBody>Firstname</MyTableCellBody>
                    <MyTableCellBody align="right">{client.firstname}</MyTableCellBody>
                  </TableRow>
                  <TableRow>
                    <MyTableCellBody>Lastname</MyTableCellBody>
                    <MyTableCellBody align="right">{client.lastname}</MyTableCellBody>
                  </TableRow>
                  <TableRow>
                    <MyTableCellBody>Username</MyTableCellBody>
                    <MyTableCellBody align="right">{client.username}</MyTableCellBody>
                  </TableRow>
                  <TableRow>
                    <MyTableCellBody>UserID</MyTableCellBody>
                    <MyTableCellBody align="right">{client.userID}</MyTableCellBody>
                  </TableRow>
                  <TableRow>
                    <MyTableCellBody>Current Points</MyTableCellBody>
                    <MyTableCellBody align="right">{client.quantity}</MyTableCellBody>
                  </TableRow>
                  <TableRow>
                    <MyTableCellBody>
                      <input type = "number" value={input} onChange={handleChange.bind(this)}/>
                    </MyTableCellBody>
                    <MyTableCellBody align="right">
                      <UpdateButton onClick={() => changePoints()}>Update</UpdateButton>
                    </MyTableCellBody>
                  </TableRow>
                </TableBody>
                }
              </MyTable>
            </TableContainer>
          </UsersBox>
        </MiddleBox>
      </Container>
    )
}
export default SupplierPointsPage
