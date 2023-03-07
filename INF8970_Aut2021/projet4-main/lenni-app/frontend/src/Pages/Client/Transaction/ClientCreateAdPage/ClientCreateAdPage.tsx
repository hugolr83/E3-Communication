import { useEffect, useState } from 'react'
import { Box, FormControl, MenuItem, Select, Typography } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { createAd } from '../../../../Api/Core/clientAds'
import { IPoints, Severity } from '../../../../Api/Core/Interfaces'
import { getClientPoints } from '../../../../Api/Core/users'
import { clientPointsState, errorState } from '../../../../Recoil/GlobalState'

import { TextFieldStyled, SelectContainer, Container, InputLabelStyled, SelectInputLabelStyled, SuplierSelector, CreateButton, newStyle } from './Styled'

const ClientCreateAdPage = () => {
    const classes = newStyle()
    const setCurrentErrorState = useSetRecoilState(errorState)
    const [points, setPoints] = useRecoilState(clientPointsState)
    const [showCreateAd, setShowCreateAd] = useState(true)
    const [values, setValues] = useState({
        supplier: 0,
        points: 0,
        price: 0,
        maxA: 0

    })
    const [errorMsgs, setErrors] = useState({
        emptyAd: '',
        existingAd: ''
    })
    const [supplier, setSupplier] = useState('')

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

    const handleSelectA = () => (event: any) => {
        const supplierIndex: number = event.target.value
        setValues({ ...values, supplier: supplierIndex, maxA: points[supplierIndex].quantity, points: 0, price: 0 })
    }

    const handleQuantityChange = () => (event: any) => {
        let quantity: number = Math.round(event.target.value)
        if (quantity < 0) {
            quantity = 0
        }
        if (quantity > points[values.supplier].quantity) {
            quantity = points[values.supplier].quantity
        }
        setValues({ ...values, points: quantity })
    }

    const handlePriceChange = () => (event: any) => {
        let price: number = event.target.value
        if (price < 0) {
            price = 0
        }
        setValues({ ...values, price: price })
    }

    const handleCreate = () => (event: any) => {
        (async () => {
        const createData = {
            _id: '',
            clientID: '',
            clientUsername: '',
            supplierID: points[values.supplier].supplierID.toString(),
            supplierName: '',
            points: values.points,
            price: values.price,
            timestamp: new Date()
        }

        if (errorMsgs.existingAd) {
            if (supplier === createData.supplierID) {
                return
            }
        }

        if (values.points === 0) {
            setErrors((prev) => ({ ...prev, emptyAd: 'Can\'t create an ad with 0 points' }))
            return
        }

        const { errors, hasErrors } = await createAd(createData)

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
                setSupplier(createData.supplierID)
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
            { showCreateAd
            ? (
            <Box
                sx={{
                  width: '50%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                    <Typography variant='h5' color='textSecondary'>
                        Create ad to sell points
                    </Typography>
                </div>
                <SelectContainer>
                    <SuplierSelector>
                        <SelectInputLabelStyled id="supplier-label" >Supplier</SelectInputLabelStyled>
                        <FormControl fullWidth>
                            <Select
                                variant="outlined"
                                labelId="supplier-label"
                                id="supplier-select"
                                value={values.supplier}
                                onChange={handleSelectA()}
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
                            value={values.points}
                            onChange={handleQuantityChange()}
                            type='number'
                            inputProps={{
                                    max: values.maxA,
                                    min: 0
                            }}
                        />

                        <InputLabelStyled id="price-label" >Price</InputLabelStyled>
                        <TextFieldStyled
                            id="price"
                            placeholder="Price"

                            variant="filled"
                            InputProps={{ style: { color: '#888' } }}
                            value={values.price}
                            onChange={handlePriceChange()}
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
                    color="primary">Create
                </CreateButton>
                {errorMsgs.emptyAd && (
                    <Typography color="error" variant="h6"> {errorMsgs.emptyAd} </Typography>
                )}
                {errorMsgs.existingAd && (
                    <div>
                        <Typography color="error" variant="h6"> {errorMsgs.existingAd} </Typography>
                        <Typography color="error" variant="h6">
                            To update it, go to <NavLink to="/client/transaction/myAds">MyAds</NavLink>
                        </Typography>
                    </div>
                )}
            </Box>
            )
            : (
                <Typography variant='h5' color='textSecondary'>
                    You don't have points from any supplier
                </Typography>
            )}
        </Container>
    )
  }

  export default ClientCreateAdPage
