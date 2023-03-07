import { Container, TableContainer } from './Styled'
import GenericTabs from '../../../Components/GenericTabs/GenericTabs'
import SupplierPendingSellers from '../SupplierPendingBuyers/SupplierPendingSellers'

const SupplierTransactionsPage = () => {
  return (
      <Container>
        <TableContainer>
          <GenericTabs stringone="Pending sales" stringtwo="-">
            <SupplierPendingSellers />
          </GenericTabs>
        </TableContainer>
      </Container>
  )
}
export default SupplierTransactionsPage
