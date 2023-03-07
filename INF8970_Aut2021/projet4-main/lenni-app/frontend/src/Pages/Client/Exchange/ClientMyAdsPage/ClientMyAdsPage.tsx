import { Typography } from '@material-ui/core'
import { BoxMetric, BoxValue, Container, CreateAdButton, SalesBox, TopBox, TableContainer } from './Styled'
import ClientAdTabs from '../../../../Components/ClientAdTabs/ClientAdTabs'
import { useHistory } from 'react-router-dom'

const ClientMyAdsPage = () => {
  const history = useHistory()

  const redirect = () => {
    history.push('/client/exchange/myAds/create')
  }

  return (
    <Container>
      <TopBox>
        <SalesBox elevation={1}>
            <BoxMetric>
              <Typography variant="h5" color="textSecondary" >
                Want to exchange points?
              </Typography>
            </BoxMetric>
            <BoxValue>
              <CreateAdButton
                onClick={redirect}
                variant="contained"
                color="primary">
              Create an ad
              </CreateAdButton>
            </BoxValue>
        </SalesBox>
      </TopBox>
      <TableContainer>
        <ClientAdTabs isTransaction={false}/>
      </TableContainer>
    </Container>
  )
}

export default ClientMyAdsPage
