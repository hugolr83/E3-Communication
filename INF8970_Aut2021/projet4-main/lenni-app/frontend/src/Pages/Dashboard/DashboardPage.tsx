import { useState, useEffect } from 'react'
import AdminPage from '../Admin/AdminPage/AdminPage'
import ClientPage from '../Client/ClientPage/ClientPage'
import SupplierPage from '../Supplier/SupplierPage/SupplierPage'
import { useAuth } from '../../Api/Auth/use-auth'

const DashboardPage = ({ ...rest }) => {
  const [role, setRole] = useState('')
  const auth = useAuth()

  useEffect(() => {
    const res = auth.checkUserRole()
    setRole(res)
  }, [])

  return (
    <div>
    {role === 'ADMIN'
      ? <AdminPage />
      : (role === 'USER')
      ? <ClientPage />
      : (role === 'SUPPLIER')
      ? <SupplierPage />
      : <div></div> // do nothing
    }</div>
  )
}

export default DashboardPage
