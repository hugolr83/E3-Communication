import { useEffect, useState } from 'react'
import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { createExchangeAd } from '../../../../Api/Core/clientExchangeAds'
import { IClient, IPoints, Severity } from '../../../../Api/Core/Interfaces'
import { fetchCurrentClient, getClientPoints } from '../../../../Api/Core/users'
import { clientPointsState, errorState, userState } from '../../../../Recoil/GlobalState'

import { TextFieldStyled, SelectContainer, Container, InputLabelStyled, SelectInputLabelStyled, SuplierSelector, CreateButton, newStyle } from './Styled'

const ClientCreateAdPage = () => {
    const classes = newStyle()
    const [user, setUser] = useRecoilState(userState)
    const setCurrentErrorState = useSetRecoilState(errorState)
    const [points, setPoints] = useRecoilState(clientPointsState)
    const [showCreateAd, setShowCreateAd] = useState(true)
    const [values, setValues] = useState({
        supplierFrom: 0,
        pointsFrom: 0,
        supplierTo: 1,
        pointsTo: 0,
        maxFrom: 0

    })
    const [errorMsgs, setErrors] = useState({
        emptyAd: '',
        existingAd: ''
    })
    const [supplier, setSupplier] = useState<string[]>([])

    useEffect(() => {
        (async () => {
        try {
            const responseUser = await getClientPoints()
            if (!responseUser.hasErrors) {
                setPoints(responseUser.payload as IPoints[])
                if (responseUser.payload.length === 0) {
                    setShowCreateAd(false)
                } else {
                    setShowCreateAd(true)
                }
            }
        } catch (err: any) {
            console.error('getting client points ', err.msg)
        }
        })()
    }, [])

    useEffect(() => {
        (async () => {
        try {
            const responseUser = await fetchCurrentClient()
            if (!responseUser.has_errors) {
              setUser(responseUser.payload as IClient)
            }
        } catch (err: any) {
            console.error('updating current user', err.msg)
        }
        })()
    }, [])

    const handleSelectFrom = () => (event: any) => {
        const supplierIndex: number = event.target.value
        setValues({ ...values, supplierFrom: supplierIndex, maxFrom: points[supplierIndex].quantity, pointsFrom: 0 })
    }

    const handleSelectTo = () => (event: any) => {
        setValues({ ...values, supplierTo: event.target.value })
    }

    const handleQuantityFromChange = () => (event: any) => {
        let quantity: number = Math.round(event.target.value)
        if (quantity < 0) {
            quantity = 0
        }
        if (quantity > points[values.supplierFrom].quantity) {
            quantity = points[values.supplierFrom].quantity
        }
        setValues({ ...values, pointsFrom: quantity })
    }

    const handleQuantityToChange = () => (event: any) => {
        let quantity: number = Math.round(event.target.value)
        if (quantity < 0) {
            quantity = 0
        }
        setValues({ ...values, pointsTo: quantity })
    }

    const handleCreate = () => (event: any) => {
        (async () => {
        const createData = {
            _id: '',
            sellerID: '',
            sellerUsername: '',
            supplierFromID: points[values.supplierFrom].supplierID.toString(),
            supplierFromName: '',
            pointsFrom: values.pointsFrom,
            supplierToID: user.points[values.supplierTo].supplierID.toString(),
            supplierToName: '',
            pointsTo: values.pointsTo,
            timestamp: new Date()
        }

        if (errorMsgs.existingAd) {
            if (supplier[0] === createData.supplierFromID && supplier[1] === createData.supplierToID) {
                return
            }
        }

        if (values.pointsFrom === 0) {
            setErrors((prev) => ({ ...prev, emptyAd: 'Can\'t create an ad with 0 points' }))
            return
        }

        const { errors, hasErrors } = await createExchangeAd(createData)

        if (!hasErrors) {
            setErrors({
                emptyAd: '',
                existingAd: ''
            })
            setCurrentErrorState((prev) => ({
                ...prev,
                open: true,
                message: 'Your ad have been created',
                severity: Severity.Success
            }))
        } else if (errors) {
            let tempError = {
                emptyAd: '',
                existingAd: ''
            }
            for (const err of errors) {
            if (err.param === 'existingAd') {
                tempError = { ...tempError, [err.param]: err.msg }
                setSupplier([createData.supplierFromID, createData.supplierToID])
            }
            }
            setErrors(tempError)
            setCurrentErrorState((prev) => ({
                ...prev,
                open: true,
                message: 'Unable to create your ad',
                severity: Severity.Error
            }))
        }
          })()
    }

    return (
        <Container>
            { showCreateAd && user.points.length >= 2
            ? (
            <Box
                sx={{
                  width: '50%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                    <Typography variant='h5' color='textSecondary'>
                        Create ad to exchange points
                    </Typography>
                </div>
                <SelectContainer>
                    <SuplierSelector>
                        <SelectInputLabelStyled id="supplier-label" >From</SelectInputLabelStyled>
                        <FormControl fullWidth>
                            <Select
                                variant="outlined"
                                labelId="supplierFrom-label"
                                id="supplierFrom-select"
                                value={values.supplierFrom}
                                onChange={handleSelectFrom()}
                                className={classes.select1}
                                inputProps={{
                                    classes: {
                                        icon: classes.icon
                                    }
                                }}
                            >
                                {points.map((point, index) =>

                                <MenuItem key={index} value={index}>{point.supplier}</MenuItem>

                                )}
                            </Select>
                        </FormControl>

                        <InputLabelStyled id="points-label" >Points</InputLabelStyled>
                        <TextFieldStyled
                            id="points"
                            placeholder="Points To Sell"

                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            value={values.pointsFrom}
                            onChange={handleQuantityFromChange()}
                            type='number'
                            inputProps={{
                                    max: values.maxFrom,
                                    min: 0
                            }}
                        />
                    </SuplierSelector>

                    <SuplierSelector>
                        <SelectInputLabelStyled id="supplier-label" >To</SelectInputLabelStyled>
                        <FormControl fullWidth>
                            <Select
                                variant="outlined"
                                labelId="supplierTo-label"
                                id="supplierTo-select"
                                value={values.supplierTo}
                                onChange={handleSelectTo()}
                                className={classes.select1}
                                inputProps={{
                                    classes: {
                                        icon: classes.icon
                                    }
                                }}
                            >
                                {user.points.map((point, index) =>

                                <MenuItem key={index} value={index}>{point.supplier}</MenuItem>

                                )}
                            </Select>
                        </FormControl>

                        <InputLabelStyled id="points-label" >Points</InputLabelStyled>
                        <TextFieldStyled
                            id="points"
                            placeholder="Points To Sell"

                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            value={values.pointsTo}
                            onChange={handleQuantityToChange()}
                            type='number'
                            inputProps={{
                                    min: 0
                            }}
                        />
                    </SuplierSelector>
                </SelectContainer>

                <CreateButton
                    onClick={handleCreate()}
                    variant="contained"
                    disabled={points[values.supplierFrom].supplierID.toString() === user.points[values.supplierTo].supplierID.toString()}
                    color="primary">Create
                </CreateButton>
                {errorMsgs.emptyAd && (
                    <Typography color="error" variant="h6"> {errorMsgs.emptyAd} </Typography>
                )}
                {errorMsgs.existingAd && (
                    <div>
                        <Typography color="error" variant="h6"> {errorMsgs.existingAd} </Typography>
                        <Typography color="error" variant="h6">
                            To update it, go to <NavLink to="/client/exchange/myAds">MyAds</NavLink>
                        </Typography>
                    </div>
                )}
            </Box>
            )
            : (
                <Typography variant='h5' color='textSecondary'>
                    {user.points.length < 2 ? 'Not enough suppliers' : 'You don\'t have points from any supplier'}
                </Typography>
            )
        }
        </Container>
    )
  }

  export default ClientCreateAdPage
