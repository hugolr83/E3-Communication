import express from 'express'
import connectDB from '../config/database'
import managePromotions from '../config/managePromotions'
import admin from './routes/api/admin'
import auth from './routes/api/auth'
import totp from './routes/api/totp'
import supplier from './routes/api/supplier'
import user from './routes/api/user'
import points from './routes/api/points'
import clientOperations from './routes/api/clientOperations'
import appActivitiesHistory from './routes/api/appActivitiesHistory'
import historyTransfer from './routes/api/historyTransfer'
import clientAd from './routes/api/clientAd'
import clientExchangeAd from './routes/api/clientExchangeAd'
import promotion from './routes/api/promotion'

import cors from 'cors'


const app = express()

// Connect to MongoDB
connectDB()
// Manage promotions
managePromotions()

// Express configuration
app.set('port', process.env.PORT || 8081)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get('/', (_req, res) => {
  res.send('API Running')
})

app.use('/api/auth', auth)
app.use('/api/totp', totp)
app.use('/api/user', user)
app.use('/api/supplier', supplier)
app.use('/api/admin', admin)
app.use('/api/points', points)
app.use('/api/operations', clientOperations)
app.use('/api/history-app', appActivitiesHistory)
app.use('/api/clientAd/transaction', clientAd)
app.use('/api/clientAd/exchange', clientExchangeAd)
app.use('/api/promotion', promotion)
app.use('/api/transfers', historyTransfer)

const port = app.get('port')
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
)

export default server

