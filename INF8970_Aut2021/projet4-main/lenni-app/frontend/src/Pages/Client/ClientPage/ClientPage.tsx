import { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { useRecoilState } from 'recoil'
import { routesState } from '../../../Recoil/GlobalState'
import { Routes } from '../../../Api/Core/Interfaces'

import ClientDashboardPage from '../ClientDashboardPage/ClientDashboardPage'
import ClientBalancePage from '../ClientBalancePage/ClientBalancePage'
import ClientTransferPage from '../ClientTransferPage/ClientTransferPage'
import ClientProfilePage from '../ClientProfilePage/ClientProfilePage'
import ClientCreateAdPage from '../Transaction/ClientCreateAdPage/ClientCreateAdPage'
import ClientMyAdsPage from '../Transaction/ClientMyAdsPage/ClientMyAdsPage'
import ClientHistoryPage from '../Transaction/ClientHistoryPage/ClientHistoryPage'
import TransactionPage from '../Transaction/TransactionPage/TransactionPage'
import ClientExchangeCreateAdPage from '../Exchange/ClientCreateAdPage/ClientCreateAdPage'
import ClientExchangeMyAdsPage from '../Exchange/ClientMyAdsPage/ClientMyAdsPage'
import ClientExchangeHistoryPage from '../Exchange/ClientHistoryPage/ClientHistoryPage'
import ExchangePage from '../Exchange/ExchangePage/ExchangePage'

import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import DashboardIcon from '@material-ui/icons/Dashboard'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import DashboardPage from '../../Dashboard/DashboardPage'
import { useAuth } from '../../../Api/Auth/use-auth'
import ClientAddFundsPage from '../ClientBalancePage/ClientAddFundsPage/ClientAddFundsPage'
import TransferHistoryPage from '../ClientTransferPage/TransferHistoryPage/TransferHistoryPage'
import FundingHistoryPage from '../ClientBalancePage/ClientFundingHistoryPage/ClientFundingHistoryPage'

const ClientPage = () => {
  const [, setRoute] = useRecoilState(routesState)
  const [role, setRole] = useState('')
  const auth = useAuth()

  useEffect(() => {
    setRole(auth.checkUserRole())
    setRoute({
      all: [
        {
          categorie: 'General',
          sections: [{ text: 'Dashboard', link: '/client', icon: <DashboardIcon color="secondary" fontSize="small" /> }]
        },
        {
          categorie: 'Account',
          sections: [{ text: 'Profile', link: '/client/profile', icon: <AccountCircleIcon color="secondary" fontSize="small" /> },
                      { text: 'Transfer', link: '/client/transfer', icon: <LoyaltyIcon color="secondary" fontSize="small" />, sub: [{ text: 'Tranfer Points', link: '/client/transfer/newTransfer' }, { text: 'History', link: '/client/transfer/history' }] },
                      { text: 'Balance', link: '/client/balance', icon: <AccountBalanceIcon color="secondary" fontSize="small" />, sub: [{ text: 'Add Funds', link: '/client/balance/viewFunds' }, { text: 'History', link: '/client/balance/history' }] }]
        },
        {
          categorie: 'Marketplace',
          sections: [{ text: 'Exchange', link: '/client/exchange', icon: <SwapHorizIcon color="secondary" fontSize="small" />, sub: [{ text: 'Exchange Points', link: '/client/exchange/exchangePoints' }, { text: 'My Ads', link: '/client/exchange/myAds' }, { text: 'History', link: '/client/exchange/history' }] },
                      { text: 'Transaction', link: '', icon: <AttachMoneyIcon color="secondary" fontSize="small" />, sub: [{ text: 'Buy Points', link: '/client/transaction/buyPoints' }, { text: 'My Ads', link: '/client/transaction/myAds' }, { text: 'History', link: '/client/transaction/history' }] }]
        }
      ],
      current: { text: 'Dashboard', link: '/client', icon: <DashboardIcon color="secondary" fontSize="small" /> }
    } as Routes)
  }, [])

  return (
    <div>
    {role === 'USER'
    ? (<Switch>
        <Route path="/client/profile">
          <ClientProfilePage />
        </Route>
        <Route path="/client/balance/viewFunds">
          <ClientBalancePage />
        </Route>
        <Route path="/client/balance/addFunds">
          <ClientAddFundsPage />
        </Route>
        <Route path="/client/balance/history">
          <FundingHistoryPage />
        </Route>
        <Route path="/client/transfer/newTransfer">
          <ClientTransferPage />
        </Route>
        <Route path="/client/transfer/history">
          <TransferHistoryPage />
        </Route>
        <Route path="/client/exchange/myAds/create">
          <ClientExchangeCreateAdPage />
        </Route>
        <Route path="/client/exchange/myAds">
          <ClientExchangeMyAdsPage />
        </Route>
        <Route path="/client/exchange/history">
          <ClientExchangeHistoryPage />
        </Route>
        <Route path="/client/exchange/exchangePoints">
          <ExchangePage />
        </Route>
        <Route path="/client/exchange">
          <Redirect to="/client/exchange/exchangePoints" />
        </Route>
        <Route path="/client/transaction/buyPoints">
          <TransactionPage />
        </Route>
        <Route path="/client/transaction/myAds/create">
          <ClientCreateAdPage />
        </Route>
        <Route path="/client/transaction/myAds">
          <ClientMyAdsPage />
        </Route>
        <Route path="/client/transaction/history">
          <ClientHistoryPage />
        </Route>
        <Route path="/client/transaction">
          <Redirect to="/client/transaction/buyPoints" />
        </Route>
        <Route path="/client/">
          <ClientDashboardPage />
        </Route>
        <Route path="/">
          <Redirect to="/client"/>
        </Route>
      </Switch>)
  : <DashboardPage />
  }
  </div>
  )
}

export default ClientPage
