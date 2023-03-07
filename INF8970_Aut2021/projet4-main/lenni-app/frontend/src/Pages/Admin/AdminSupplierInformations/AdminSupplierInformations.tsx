// eslint-disable-next-line no-use-before-define
import React, { Fragment, useEffect, useState } from 'react'
import FaceIcon from '@material-ui/icons/Face'
import { Typography } from '@material-ui/core'
import { Container, Container2, MiddleBox, Title, UsersBox, CustomInput, CustomInput2, CustomInput3, PointsBox, GraphBox, ChartPaper, Myscroll } from './Styled'
import { Chart } from 'react-google-charts'
import { useLocation } from 'react-router-dom'
import { getPointsById } from '../../../Api/Supplier/supplier'
import { ISuppliers, ISupplierPoints } from '../../../Api/Core/Interfaces'
import { convertDate } from './../../../Api/utils'
import Loader from 'react-loader-spinner'

const AdminSupplierInformations = () => {
    const location = useLocation<ISuppliers>()
    const [currentUsers, setCurrentUsers] = useState<ISupplierPoints[]>()
    const [currentData, setCurrentData] = useState<any[]>([])

    const transformData = (currentDatas : ISupplierPoints[]) : any[] => {
        const temp: any[] = [['Reparitions', 'Number of User']]
        let repartition1 = 0
        let repartition2 = 0
        let repartition3 = 0
        let repartition4 = 0
        let repartition5 = 0
        currentDatas.forEach(user => {
            if (user.quantity < 100) { repartition1++ }
            if (user.quantity > 100 && user.quantity < 200) { repartition2++ }
            if (user.quantity > 200 && user.quantity < 300) { repartition3++ }
            if (user.quantity > 300 && user.quantity < 400) { repartition4++ }
            if (user.quantity > 500) { repartition5++ }
        })

        temp.push(['0 to 100 points', repartition1])
        temp.push(['100 to 200 points', repartition2])
        temp.push(['200 to 300 points', repartition3])
        temp.push(['300 to 400 points', repartition4])
        temp.push(['more than 400', repartition5])

        return temp
    }

    useEffect(() => {
        (async () => {
        try {
            const responseUser = await getPointsById(location.state)
            const tempClient = responseUser.payload
            if (!responseUser.hasErrors) {
              setCurrentData(transformData(tempClient))
              setCurrentUsers(tempClient)
            }
        } catch (err: any) {
            console.error('updating current user', err.msg)
        }
        })()
    }, [location])

    return (
        <Container className="pcoded-main-container">
            <MiddleBox>
                <UsersBox>
                <Title variant="h6" color="textSecondary"><b>SUPPLIER INFORMATIONS</b></Title>
                    <CustomInput
                        required
                        value= {location.state.userInfo.role}
                        size="small"
                        id="filled-required"
                        label="Role"
                        InputLabelProps={{ shrink: true }}
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
                        variant="outlined"
                        color="secondary"
                    />
                     <CustomInput2
                        required
                        value= {location.state.businessName}
                        size="small"
                        id="filled-required"
                        label="Business Name"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {location.state.businessNumber}
                        size="small"
                        id="filled-required"
                        label="Business Number"
                        InputLabelProps={{ shrink: true }}
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
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.pointsToLennis}
                        size="small"
                        id="filled-required"
                        label="Points to Lennis"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.dollarToPoints}
                        size="small"
                        id="filled-required"
                        label="Dollars to Points"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput
                        required
                        value= {location.state.pointsToDollars}
                        size="small"
                        id="filled-required"
                        label="Points to Dollars"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                     <CustomInput2
                        required
                        value= {convertDate(location.state.userInfo.lastConnection)}
                        size="small"
                        id="filled-required"
                        label="Last Connection"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                    <CustomInput2
                        required
                        value= {convertDate(location.state.userInfo.registrationDate)}
                        size="small"
                        id="filled-required"
                        label="Registration Date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        color="secondary"
                    />
                </UsersBox>
                <PointsBox>
                    <Title variant="h6" color="textSecondary"><b>CLIENT LIST</b></Title>{currentUsers?.length === 0
                    ? <Loader
                    type="TailSpin"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000}
                />
                : <Fragment>
                    <Myscroll>
                        {currentUsers?.map((user, index) => {
                                return (
                                    <Container2>
                                        <FaceIcon color="secondary" fontSize="large" />
                                        <Typography color="textSecondary">
                                            {user.firstname}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {user.lastname}
                                        </Typography>
                                        <Typography variant="h6" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                            {user.quantity}
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
                <Title variant="h6" color="textSecondary"><b>USERS STATISTICS</b></Title>{currentData.length === 0
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

export default AdminSupplierInformations
