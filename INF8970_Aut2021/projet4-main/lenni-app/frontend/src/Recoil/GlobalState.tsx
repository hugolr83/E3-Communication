import { atom } from 'recoil'
import { IClient, Severity, Routes, IUser, ISuppliers, ITransferData, ISupplierPoints, IAd, IExchangeAd, IExchangeData, IPendingExchangeAd, ITransactionData, IPoints, IPromotion, IFundingData, IPromotionData } from '../Api/Core/Interfaces'
import PersonIcon from '@material-ui/icons/Person'
import StoreIcon from '@material-ui/icons/Store'
import DashboardIcon from '@material-ui/icons/Dashboard'
import RepeatIcon from '@material-ui/icons/Repeat'

export const routesState = atom({
  key: 'routes',
  default: {
    all: [
      {
        categorie: 'General',
        sections: [{ text: 'Dashboard', link: '/admin', icon: <DashboardIcon color="secondary" fontSize="small" /> }]
      },
      {
        categorie: 'Lists',
        sections: [{ text: 'Users', link: '/admin/users', icon: <PersonIcon color="secondary" fontSize="small" /> }, { text: 'Suppliers', link: '/admin/suppliers', icon: <StoreIcon color="secondary" fontSize="small" /> }]
      },
      {
        categorie: 'History',
        sections: [{ text: 'Operations', link: '/admin/history', icon: <RepeatIcon color="secondary" fontSize="small" /> }]
      }
    ],
    current: { text: 'Dashboard', link: '/admin', icon: <DashboardIcon color="secondary" fontSize="small" /> }
  } as Routes
})

export const suppliersState = atom({
  key: 'suppliers',
  default: [] as ISuppliers[]
})
export const usersState = atom({
  key: 'users',
  default: [] as IUser[]
})

export const historyTransferState = atom({
  key: 'historyTransfers',
  default: [] as ITransferData[]
})
export const historyTransactionState = atom({
  key: 'historyTransactions',
  default: [] as ITransactionData[]
})
export const historyExchangeState = atom({
  key: 'historyExchanges',
  default: [] as IExchangeData[]
})

export const historyExchangeAdState = atom({
  key: 'historyExchangesAds',
  default: [] as IExchangeAd[]
})

export const historyPromotionState = atom({
  key: 'historyPromotions',
  default: [] as IPromotion[]
})

export const historyFundingState = atom({
  key: 'historyFundings',
  default: [] as IFundingData[]
})

export const historyAdState = atom({
  key: 'historyAds',
  default: [] as IAd[]
})
// Transaction ads available to buy
export const adsState = atom({
  key: 'ads',
  default: [] as IAd[]
})

// Unbought transaction ads of the client
export const clientAdsState = atom({
  key: 'clientAds',
  default: [] as IAd[]
})

// Transactions made by the client
export const clientTransactionsState = atom({
  key: 'clientTransactionsState',
  default: [] as ITransactionData[]
})
// Transfers made by the client
export const clientTransfersState = atom({
  key: 'clientTransfersState',
  default: [] as ITransferData[]
})
// Fundings made by the client
export const clientFundingsState = atom({
  key: 'clientFundingsState',
  default: [] as IFundingData[]
})

// Bought transaction ads of the client
export const clientBoughtAdsState = atom({
  key: 'clientBoughtAdsState',
  default: [] as ITransactionData[]
})

// Exchange ads available to buy
export const exchangeAdsState = atom({
  key: 'exchangeAdsState',
  default: [] as IExchangeAd[]
})

// Unbought exchange ads of the client
export const clientExchangeAdsState = atom({
  key: 'clientExchangeAdsState',
  default: [] as IExchangeAd[]
})

// Pending exchange ads of the client
export const clientPendingExchangeAdsState = atom({
  key: 'clientExchangeAdsState',
  default: [] as IPendingExchangeAd[]
})

// Exchanges made by the client
export const clientExchangesState = atom({
  key: 'clientExchangesState',
  default: [] as IExchangeData[]
})

// Bought exchange ads of the client
export const clientExchangeBoughtAdsState = atom({
  key: 'clientExchangeBoughtAdsState',
  default: [] as IExchangeData[]
})

// Promotions made by the supplier
export const supplierPromotionsState = atom({
  key: 'supplierPromotionsState',
  default: [] as IPromotionData[]
})

export const errorState = atom({
  key: 'errorState',
  default: { open: false, severity: Severity.Error, message: '' }
})

export const clientPointState = atom({
  key: 'userProfile',
  default: {
    username: '',
    firstname: '',
    lastname: '',
    userID: '',
    quantity: 0
  } as ISupplierPoints
})

export const clientPointsState = atom({
  key: 'clientPointsState',
  default: [{ quantity: 12, supplier: 'Walmart', supplierID: '', pointsToLennis: 0 }, { quantity: 123, supplier: 'Lenni', supplierID: '', pointsToLennis: 0 }] as IPoints[]
})

export const userState = atom({
  key: 'userState',
  default: {
    firstname: 'Joe',
    lastname: 'Snape',
    clientId: '',
    funds: 13.5,
    userInfo: {
      email: 'joe@gmail.com',
      username: 'joe',
      password: '',
      role: 'client',
      question: 1,
      answer: 'answer',
      secondAuthChoice: -1,
      registrationDate: new Date('2021-01-01'),
      lastConnection: new Date('2021-01-01'),
      activeSessions: 1
    },
    address: {
      street: 'joe@gmail.com',
      city: 'joe',
      province: '',
      postalCode: 'client'
    },
    pending: false,
    points: [{ quantity: 12, supplier: 'Walmart', supplierID: '', pointsToLennis: 0, pointsToDollars: 0 }, { quantity: 123, supplier: 'Lenni', supplierID: '', pointsToLennis: 0, pointsToDollars: 0 }, { quantity: 321, supplier: 'Tim Hortons', supplierID: '', pointsToLennis: 0, pointsToDollars: 0 }],
    paymentInfo: {
      paymentMode: 0,
      bankAccount: {
        bankInstitution: '',
        branchNumber: '',
        accountNumber: ''
      },
      creditCard: {
        cardHolderFirstname: '',
        cardHolderLastname: '',
        cardNumber: '',
        expirationDate: '',
        CVV: ''
      }
    }
  } as IClient
})
export const addFundsValue = atom({
  key: 'addFundsValue',
  default: {
    amount: 0,
    history: '/client/balance/viewFunds'
  }
})
