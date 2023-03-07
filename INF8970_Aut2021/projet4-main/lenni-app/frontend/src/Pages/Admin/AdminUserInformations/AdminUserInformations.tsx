// eslint-disable-next-line no-use-before-define
import React, { Fragment, useEffect, useState } from 'react'
import StoreIcon from '@material-ui/icons/Store'
import { Typography } from '@material-ui/core'
import { Container, Container2, MiddleBox, Title, UsersBox, CustomInput, CustomInput2, CustomInput3, PointsBox, GraphBox, ChartPaper, Myscroll } from './Styled'
import { Chart } from 'react-google-charts'
import { useLocation } from 'react-router-dom'
import { fetchClientPoints } from '../../../Api/Core/users'
import { IUser, IPoints } from '../../../Api/Core/Interfaces'
import { convertDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminUserInformations = () => {
    const location = useLocation<IUser>()
    const [currentPoints, setCurrentPoints] = useState<IPoints[]>()
    const [currentData, setCurrentData] = useState<any[]>([])

    const transformData = (currentDatas : IPoints[]) : any[] => {
        const temp: any[] = [['Company', 'Quantity']]
        currentDatas.forEach(point => {
            temp.push([point.supplier, point.quantity])
        })
        return temp
    }

    useEffect(() => {
        (async () => {
        try {
            const responseUser = await fetchClientPoints(location.state)
            const tempPoints = responseUser.payload
            if (!responseUser.hasErrors) {
              setCurrentData(transformData(tempPoints))
              setCurrentPoints(tempPoints)
            }
        } catch (err: any) {
            console.error('WTF', err.msg)
        }
        })()
    }, [location])

    return (
        <Container className="pcoded-main-container">
            <MiddleBox>
                <UsersBox>
                <Title variant="h6" color="textSecondary"><b>CLIENT INFORMATIONS</b></Title>
                    <CustomInput
                        required
                        value= {location.state.userInfo.role}
                        size="small"
                        id="filled-required"
                        label="Role"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.userInfo.username}
                        size="small"
                        id="filled-required"
                        label="Username"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.userInfo.email}
                        size="small"
                        id="filled-required"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                     <CustomInput2
                        required
                        value= {location.state.firstname}
                        size="small"
                        id="filled-required"
                        label="First Name"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {location.state.lastname}
                        size="small"
                        id="filled-required"
                        label="Last Name"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput3
                        required
                        value= {location.state.address.street}
                        size="small"
                        id="filled-required"
                        label="Street"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.address.city}
                        size="small"
                        id="filled-required"
                        label="City"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.address.province}
                        size="small"
                        id="filled-required"
                        label="Province"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.address.postalCode}
                        size="small"
                        id="filled-required"
                        label="Postal Code"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {location.state.paymentMode === 0 ? 'None' : location.state.paymentMode === 1 ? 'Credit card' : 'Bank Account'}
                        size="small"
                        id="filled-required"
                        label="Payment mode"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {location.state.funds}
                        size="small"
                        id="filled-required"
                        label="Funds"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                     <CustomInput2
                        required
                        value= {location.state.userInfo.lastConnection && convertDate(location.state.userInfo.lastConnection)}
                        size="small"
                        id="filled-required"
                        label="Last Connection"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {location.state.userInfo.registrationDate && convertDate(location.state.userInfo.registrationDate)}
                        size="small"
                        id="filled-required"
                        label="Registration Date"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => { updateField(e.target.value) }}
                        variant="outlined"
                        color="secondary"
                    />
                </UsersBox>
                <PointsBox>
                <Title variant="h6" color="textSecondary"><b>POINTS INFORMATIONS</b></Title>{currentPoints?.length === 0
                    ? <Loader
                    type="TailSpin"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000}
                />
                : <Fragment>
                    <Myscroll>
                        {currentPoints?.map((point, index) => {
                                return (
                                    point.quantity !== 0 &&
                                    <Container2>
                                        <StoreIcon color="secondary" fontSize="large" />
                                        <Typography color="textSecondary">
                                            {point.supplier}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {point.supplierID}
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                            {point.quantity}
                                        </Typography>
                                    </Container2>
                                )
                            })}
                        </Myscroll>
                    </Fragment>}
                </PointsBox>
            </MiddleBox>
            <GraphBox>

                <ChartPaper>
                <Title variant="h6" color="textSecondary"><b>POINTS STATISTICS</b></Title>{currentData.length === 0
                    ? <Loader
                    type="TailSpin"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000}
                />
                : <Chart
                        width={'700px'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={currentData}
                        rootProps={{ 'data-testid': '1' }}
                        />}
                </ChartPaper>
            </GraphBox>
        </Container>
    )
}

export default AdminUserInformations
