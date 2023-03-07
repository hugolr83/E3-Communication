// eslint-disable-next-line no-use-before-define
import { Container, TableContainer } from './Styled'
import HistoryTabs from '../../../Components/HistoryTabs/HistoryTabs'

const AppActivitiesHistoryPage = () => {
  return (
    <Container>
      <TableContainer>
        <HistoryTabs/>
      </TableContainer>
    </Container>
  )
}

export default AppActivitiesHistoryPage
