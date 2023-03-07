// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import AdminDashboardPage from '../AdminDashboardPage/AdminDashboardPage'
import AdminSupplierPage from '../AdminSupplierPage/AdminSupplierPage'
import AppActivitiesHistoryPage from '../AppActivitiesHistoryPage/AppActivitiesHistoryPage'
import AdminUsersPage from '../AdminUserPage/AdminUserPage'
import AdminUserInformations from '../AdminUserInformations/AdminUserInformations'
import AdminSupplierInformations from '../AdminSupplierInformations/AdminSupplierInformations'
import DashboardPage from '../../Dashboard/DashboardPage'
import { useRecoilState } from 'recoil'
import { routesState } from '../../../Recoil/GlobalState'
import { Routes } from '../../../Api/Core/Interfaces'
import { useAuth } from '../../../Api/Auth/use-auth'
import PersonIcon from '@material-ui/icons/Person'
import StoreIcon from '@material-ui/icons/Store'
import DashboardIcon from '@material-ui/icons/Dashboard'
import RepeatIcon from '@material-ui/icons/Repeat'

const AdminPage = () => {
  const [, setRoute] = useRecoilState(routesState)
  const [role, setRole] = useState('')
  const auth = useAuth()

  useEffect(() => {
    setRole(auth.checkUserRole())
    setRoute({
      all: [
        {
          categorie: 'General',
          sections: [{ text: 'Dashboard', link: '/admin', icon: <DashboardIcon color="secondary" fontSize="small" /> }]
        },
        {
          categorie: 'Lists',
          sections: [{ text: 'Clients', link: '/admin/users', icon: <PersonIcon color="secondary" fontSize="small" /> }, { text: 'Suppliers', link: '/admin/suppliers', icon: <StoreIcon color="secondary" fontSize="small" /> }]
        },
        {
          categorie: 'Activities',
          sections: [{ text: 'History', link: '/admin/history', icon: <RepeatIcon color="secondary" fontSize="small" /> }]
        }
      ],
      current: { text: 'Dashboard', link: '/admin', icon: <DashboardIcon color="secondary" fontSize="small" /> }
    } as Routes)
  }, [])
  return (
    <div>
    {role === 'ADMIN'
    ? (<Switch>
        <Route path="/admin/suppliers">
          <AdminSupplierPage />
        </Route>
        <Route path="/admin/history">
          <AppActivitiesHistoryPage />
        </Route>
        <Route path="/admin/users">
          <AdminUsersPage />
        </Route>
        <Route path="/admin/userInformations">
          <AdminUserInformations />
        </Route>
        <Route path="/admin/supplierInformations">
          <AdminSupplierInformations />
        </Route>
        <Route path="/admin">
          <AdminDashboardPage />
        </Route>
        <Route path="/">
          <Redirect to="/admin"/>
        </Route>
      </Switch>)
    : <DashboardPage />
    }
    </div>
  )
}

export default AdminPage
