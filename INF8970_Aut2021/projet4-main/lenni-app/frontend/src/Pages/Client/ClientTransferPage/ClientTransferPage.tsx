import { Box, FormControl, IconButton, MenuItem, Select, TextField } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { transferPoints } from '../../../Api/Core/clientOperations'
import { IClient, IPromotion, Severity } from '../../../Api/Core/Interfaces'
import { getActivePromotions } from '../../../Api/Core/supplierOperations'
import { fetchCurrentClient } from '../../../Api/Core/users'
import { errorState, userState } from '../../../Recoil/GlobalState'
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle'

import { Container, InputLabelStyled, PaperStyled, TransferButton, RowContainer, ContentDiv, CenteringDiv, newStyle } from './Styled'

const ClientTransferPage = () => {
    const classes = newStyle()
    const [client, setClient] = useRecoilState(userState)
    const [promotions, setPromotions] = useState<IPromotion[]>([])
    const setCurrentErrorState = useSetRecoilState(errorState)
    const [values, setValues] = useState({
        supplierA: 0,
        supplierB: 1,
        pointsA: 0

    })
    const [errorMsgs, setErrors] = useState({
        transferError: ''
    })

    useEffect(() => {
        (async () => {
        try {
            const responseUser = await fetchCurrentClient()
            if (!responseUser.has_errors) {
              setClient(responseUser.payload as IClient)
            }
        } catch (err: any) {
            console.error('updating current client', err.msg)
        }
        })()
    }, [client])
    useEffect(() => {
        let disposed = false;
        (async () => {
          try {
            const response = await getActivePromotions()
            if (disposed) return
            if (!response.hasErrors) {
              setPromotions(response.payload)
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

    const handleSelectA = () => (event: any) => {
        const supplierIndex: number = event.target.value
        const updatedValues = {
            supplierA: supplierIndex,
            supplierB: values.supplierB,
            pointsA: 0
        }
        setValues(updatedValues)
    }
    const handleSelectB = () => (event: any) => {
        let newValues = values
        newValues = { ...newValues, supplierB: event.target.value }
        newValues = { ...newValues, pointsA: 0 }
        setValues(newValues)
    }
    const findMinmumAmount = (factor:number) => {
        let minInteger = 0
        for (let i = 1; i <= client.points[values.supplierA].quantity; i++) {
            const roundedValue = Math.floor(i * factor)
            const trueValue = i * factor
            if (trueValue === roundedValue) {
                minInteger = trueValue
                break
            }
        }
        return minInteger
    }
    const handleChange = (prop: any) => (event: any) => {
        let quantity: number = event.target.value
        if (quantity < 0) {
            quantity = 0
        }
        if (quantity > client.points[values.supplierA].quantity) {
            quantity = client.points[values.supplierA].quantity
        }
        const factor = client.points[values.supplierA].pointsToLennis / client.points[values.supplierB].pointsToLennis
        const roundedQantity = Math.floor(quantity * factor)
        const trueQantity = quantity * factor
        if (trueQantity > roundedQantity) {
            const minInteger = findMinmumAmount(factor)
            if (minInteger === 0) {
                setValues({ ...values, pointsA: 0 })
                return
            }
            if (quantity > values.pointsA) {
                quantity = Math.round((minInteger * Math.ceil(trueQantity / minInteger)) / factor)
            } else {
                quantity = Math.round((minInteger * Math.floor(trueQantity / minInteger)) / factor)
            }
        }
       if (quantity > client.points[values.supplierA].quantity) {
        quantity = Math.floor((roundedQantity) / factor)
       }
        setValues({ ...values, pointsA: quantity })
    }
    const handleTransfer = () => (event: any) => {
        (async () => {
            setValues({ ...values, pointsA: 0 })

            const oldQuantityB = client.points[values.supplierB].quantity
            const newQuantityB = oldQuantityB + Math.floor(values.pointsA * client.points[values.supplierA].pointsToLennis / client.points[values.supplierB].pointsToLennis)
            if (oldQuantityB === newQuantityB) {
                const tempError = {
                    transferError: 'can\'t transfer 0 points'
                }
                setErrors(tempError)
                return
            }
            const transferData = {
                _id: '',
                supplierIDA: client.points[values.supplierA].supplierID,
                supplierIDB: client.points[values.supplierB].supplierID,
                transferredPointsFromA: values.pointsA,
                pointsToLennisA: client.points[values.supplierA].pointsToLennis,
                pointsToLennisB: client.points[values.supplierB].pointsToLennis,
                timestamp: new Date()
            }
            const { errors, hasErrors } = await transferPoints(transferData)

            if (!hasErrors) {
                try {
                    const responseUser = await fetchCurrentClient()
                    if (!responseUser.has_errors) {
                    setClient(responseUser.payload as IClient)
                    }
                    setErrors({ transferError: '' })
                } catch (err: any) {
                    console.error('updating current client', err.msg)
                }
            } else if (errors) {
                let tempError = {
                    transferError: ''
                }
                for (const err of errors) {
                if (err.param) {
                    tempError = { ...tempError, [err.param]: err.msg }
                }
                }
                setErrors(tempError)
            }
        })()
    }
    const swap = () => {
        setValues({ supplierA: values.supplierB, supplierB: values.supplierA, pointsA: 0 })
    }
    return (
        <Container>
            {client.points.length >= 2
            ? <Box
                sx={{
                  width: '100%'
                }}
              >
                  <RowContainer>
                  <CenteringDiv></CenteringDiv>
                      <ContentDiv>
            <RowContainer>
                <PaperStyled>
                    <InputLabelStyled id="supplierA-label" >From</InputLabelStyled>
                    <FormControl fullWidth>

                        <Select
                            variant="outlined"
                            labelId="supplierA-label"
                            id="supplierA-select"
                            value={values.supplierA}
                            onChange={handleSelectA()}
                            className={classes.select1}
                            inputProps={{
                                classes: {
                                    icon: classes.icon
                                }
                            }}
                        >
                            {client.points.map((point, index) =>

                            <MenuItem value={index}>{point.supplier}</MenuItem>

                            )}
                        </Select>
                    </FormControl>

                    <TextField
                          id="pointsA"
                          placeholder="PointsA to Transfer"
                          variant="outlined"
                          className={classes.textField}
                          value={values.pointsA}
                          onChange={handleChange('pointsA')}
                          type='number'
                          inputProps={{

                                max: client.points[values.supplierA].quantity,
                                min: 0

                        }}
                        />
                </PaperStyled>

                <IconButton color="primary" style={{ alignSelf: 'center' }} onClick={swap}>
                    <SwapHorizontalCircleIcon fontSize= 'large' />
                </IconButton>

                <PaperStyled>
                    <InputLabelStyled id="supplierB-label" >To</InputLabelStyled>
                    <FormControl fullWidth
                    >

                        <Select
                            variant="outlined"
                            labelId="supplierB-label"
                            id="supplierB-select"
                            value={values.supplierB}
                            onChange={handleSelectB()}
                            className={classes.select1}
                            inputProps={{
                                classes: {
                                    icon: classes.icon
                                }
                              }}

                        >
                            {client.points.map((point, index) =>

                                <MenuItem value={index}>{point.supplier}</MenuItem>

                            )}

                        </Select>
                    </FormControl>
                    <h1>{Math.round(values.pointsA * client.points[values.supplierA].pointsToLennis / client.points[values.supplierB].pointsToLennis)}</h1>
                </PaperStyled>
            </RowContainer>
            <RowContainer>
                <PaperStyled>
                <InputLabelStyled id="PromotionA" >Promotion</InputLabelStyled>
                {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierA].supplierID).length === 1
                ? <div>
                    <h3 id="suplierA" >Points to app: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierA].supplierID)[0].newPointsToLennis}</h3>
                    <h3 id="suplierA" >Dollars to points: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierA].supplierID)[0].newDollarsToPoints}</h3>
                    <h3 id="suplierA" >Points to dollars: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierA].supplierID)[0].newPointsToDollars}</h3>

                </div>
                : <h3 id="suplierA" >No promotion</h3>}
                </PaperStyled>
                <PaperStyled>
                <InputLabelStyled id="PromotionB" >Promotion</InputLabelStyled>
                {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierB].supplierID).length === 1
                ? <div>
                    <h3 id="suplierA" >Points to app: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierB].supplierID)[0].newPointsToLennis}</h3>
                    <h3 id="suplierA" >Dollars to points: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierB].supplierID)[0].newDollarsToPoints}</h3>
                    <h3 id="suplierA" >Points to dollars: {promotions.filter(promotion => promotion.supplierId === client.points[values.supplierB].supplierID)[0].newPointsToDollars}</h3>

                </div>
                : <h3 id="suplierA" >No promotion</h3>}
                </PaperStyled>
            </RowContainer>
            <RowContainer>
                <PaperStyled>
                    <InputLabelStyled id="totalA" >Total</InputLabelStyled>
                    <h3 id="suplierA" >{client.points[values.supplierA].supplier}</h3>
                    <h1>{client.points[values.supplierA].quantity}</h1>
                </PaperStyled>
                <PaperStyled>
                    <InputLabelStyled id="factor" >Transfer factor</InputLabelStyled>
                    <h1>x{Math.round((client.points[values.supplierA].pointsToLennis / client.points[values.supplierB].pointsToLennis) * 1000) / 1000}</h1>
                </PaperStyled>
                <PaperStyled>
                    <InputLabelStyled id="totalB" >Total</InputLabelStyled>
                    <h3 id="suplierA" >{client.points[values.supplierB].supplier}</h3>
                    <h1>{client.points[values.supplierB].quantity}</h1>
                </PaperStyled>
            </RowContainer>

            <RowContainer>
            <CenteringDiv></CenteringDiv>
            <TransferButton
            onClick={handleTransfer()}
            variant="contained"

            disabled={values.supplierA === values.supplierB}
            color="primary">Transfer</TransferButton>
            <CenteringDiv></CenteringDiv>
            </RowContainer>
            {errorMsgs.transferError && (
                <p className="error"> {errorMsgs.transferError} </p>
            )}
            </ContentDiv>
            <CenteringDiv></CenteringDiv>
            </RowContainer>
            </Box>
            : <p>Not enough suppliers</p>}
        </Container>
    )
  }

  export default ClientTransferPage
