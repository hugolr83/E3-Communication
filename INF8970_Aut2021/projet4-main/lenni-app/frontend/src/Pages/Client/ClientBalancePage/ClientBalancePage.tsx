import { Box, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Severity } from '../../../Api/Core/Interfaces'
import { getClientFunds } from '../../../Api/Core/users'
import { addFundsValue, errorState } from '../../../Recoil/GlobalState'
import { Container, BoxMetric, BoxValue, CenteringDiv, PaperStyled, RowContainer, StyledButton } from './Styled'

const ClientBalancePage = () => {
    const [funds, setFunds] = useState()
    const [, setAddFundsInfo] = useRecoilState(addFundsValue)
    const setCurrentErrorState = useSetRecoilState(errorState)
    const history = useHistory()
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
      const handleTransfer = () => (event: any) => {
        setAddFundsInfo({ amount: 0, history: '/client/balance/viewFunds' })
        history.push('/client/balance/addFunds')
      }
    return (

        <Container>

          <Box
                sx={{
                  width: '100%'
                }}

              >
            <RowContainer>
            <CenteringDiv></CenteringDiv>
            <PaperStyled>
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
            </PaperStyled>
            <CenteringDiv></CenteringDiv>
            </RowContainer>
            <RowContainer>
            <CenteringDiv></CenteringDiv>
            <StyledButton
              onClick={handleTransfer()}
              variant="contained"
              color="primary">Add Funds</StyledButton>
            <CenteringDiv></CenteringDiv>
            </RowContainer>

            </Box>
        </Container>

    )
  }

  export default ClientBalancePage
