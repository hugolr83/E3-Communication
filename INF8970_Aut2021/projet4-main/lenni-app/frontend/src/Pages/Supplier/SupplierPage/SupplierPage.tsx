// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-use-before-define
// import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { useRecoilState } from 'recoil'
import { routesState } from '../../../Recoil/GlobalState'
import { Routes } from '../../../Api/Core/Interfaces'
import { useAuth } from '../../../Api/Auth/use-auth'

import DashboardPage from '../../Dashboard/DashboardPage'
import SupplierBalancePage from '../SupplierBalance/SupplierBalancePage'
import SupplierDashboardPage from '../SupplierDashboadPage/SupplierDashboardPage'
import SupplierPointsPage from '../SupplierPointsPage/SupplierPointsPage'
import SupplierPromotionsPage from '../SupplierPromotionsPage/SupplierPromotionPage'
import SupplierSettingPage from '../SupplierSettingsPage/SupplierSettingsPage'
import SupplierHistoryPromotionPage from '../SupplierHistoryPromotionsPage/SupplierHistoryPromotionsPage'
import SupplierTransactionsPage from '../SupplierTransactionsPage/SupplierTransactionsPage'

import DashboardIcon from '@material-ui/icons/Dashboard'
import PointsIcon from '@material-ui/icons/Redeem'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import AccountIcon from '@material-ui/icons/AccountCircle'
import BalanceIcon from '@material-ui/icons/AccountBalance'
import TransactionIcon from '@material-ui/icons/AssignmentTurnedIn'

const SupplierPage = () => {
  const [, setRoute] = useRecoilState(routesState)
  const [role, setRole] = useState('')
  const auth = useAuth()

  useEffect(() => {
    setRole(auth.checkUserRole())
    setRoute({
      all: [
        {
          categorie: 'General',
          sections: [{ text: 'Dashboard', link: '/suppliers', icon: <DashboardIcon color="secondary" fontSize="small" /> }]
        },
        {
          categorie: 'Account',
          sections: [{ text: 'Settings', link: '/suppliers/settings', icon: <AccountIcon color="secondary" fontSize="small" /> },
                      { text: 'Balance', link: '/suppliers/balance', icon: <BalanceIcon color="secondary" fontSize="small" /> }]
        },
        {
          categorie: 'Operations',
        sections: [{ text: 'Promotions', link: '/suppliers/promotions', icon: <LoyaltyIcon color="secondary" fontSize="small" />, sub: [{ text: 'Manage Promotions', link: '/suppliers/promotions' }, { text: 'Promotion History', link: '/suppliers/promotions-history' }] },
                    { text: 'Points', link: '/suppliers/points', icon: <PointsIcon color="secondary" fontSize="small" /> },
                    { text: 'Transactions Pending', link: '/suppliers/transactions', icon: <TransactionIcon color="secondary" fontSize="small" /> }]
        }
      ],
      current: { text: 'Dashboard', link: '/suppliers', icon: <DashboardIcon color="secondary" fontSize="small" /> }
    } as Routes)
  }, [])

  return (
    <div>
    {role === 'SUPPLIER'
    ? (<Switch>
        <Route path="/suppliers/balance">
          <SupplierBalancePage />
        </Route>
        <Route path="/suppliers/promotions-history">
          <SupplierHistoryPromotionPage />
        </Route>
        <Route path="/suppliers/points">
          <SupplierPointsPage />
        </Route>
        <Route path="/suppliers/promotions">
          <SupplierPromotionsPage />
        </Route>
        <Route path="/suppliers/settings">
          <SupplierSettingPage />
        </Route>
        <Route path="/suppliers/transactions">
          <SupplierTransactionsPage />
        </Route>
        <Route path="/suppliers">
          <SupplierDashboardPage />
        </Route>
        <Route path="/">
          <Redirect to="/suppliers"/>
        </Route>
      </Switch>)
    : <DashboardPage />
    }
    </div>
  )
}

export default SupplierPage
