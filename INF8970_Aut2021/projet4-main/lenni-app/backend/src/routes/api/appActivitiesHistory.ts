import { Router, Response } from 'express'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import Ad, { IAd } from '../../models/Ad'
import ExchangeAd from '../../models/ExchangeAd'
import Exchange from '../../models/Exchange'
import Funding, { IFunding } from '../../models/funding'
import PromotionHistory, { IPromotionHistory } from '../../models/PromotionHistory'
import Transaction from '../../models/Transaction'
import Transfer, { ITransfer } from '../../models/Transfer'
import UserInfo from '../../models/UserInfo'
import Supplier, { ISupplier } from '../../models/Supplier'
import { ObjectId } from 'mongoose'
import auth from '../../middleware/auth'
import User, { IUser } from '../../models/User'

const router: Router = Router()

// @route   GET api/history-app/ads/all
// @desc    Get all ads
// @access  Public
router.get('/ads/all', async (req: Request, res: Response) => {
  try {
    const ads: Array<IAd> = await Ad.find()
      .populate({ path: 'client', populate: { path: 'userInfo' } })
      .populate({ path: 'supplier', populate: { path: 'userInfo' } })

    const adsData: Array<Object> = []
    for (const ad of ads) {
      adsData.push({
        clientUsername: ad.client ? ad.client.userInfo.username : '-',
        clientID: ad.client ? ad.client._id : '-',
        _id: ad._id,
        supplierID: ad.supplier ? ad.supplier.id : '-',
        supplierName: ad.supplier ? ad.supplier.businessName : '-',
        points: ad.points,
        price: ad.price,
        timestamp: ad.createdAt
      })
    }

    res.json({ has_error: false, payload: adsData })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   GET api/history-app/adExchanges/all
// @desc    Get all adExchanges
// @access  Public
router.get('/adExchanges/all/:IDValidationPending', async (req: Request, res: Response) => {
  try {
    const adsExchangeHistory = await ExchangeAd.aggregate([
      {
        $match: { IDValidationPending: Boolean(req.params.IDValidationPending)}
      },

      {
        $lookup: {
          from: 'exchanges',
          localField: '_id',
          foreignField: 'ad',
          as: 'unbought_ads'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplierFrom',
          foreignField: '_id',
          as: 'supplierFromInfo'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplierTo',
          foreignField: '_id',
          as: 'supplierToInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $lookup: {
          from: 'userinfos',
          localField: 'sellerInfo.userInfo',
          foreignField: '_id',
          as: 'userInfos'
        }
      },
      {
        $project: {
          createdAt: 1,
          pointsFrom: 1,
          pointsTo: 1,
          'supplierFromInfo._id': 1,
          'supplierFromInfo.businessName': 1,
          'supplierToInfo._id': 1,
          'supplierToInfo.businessName': 1,
          'sellerInfo._id': 1,
          'userInfos.username': 1,
          'sellerInfo.firstname' : 1,
          'sellerInfo.lastname' : 1
        }
      }
    ]).exec()

    const adExchangesData: Array<Object> = []
    for (const ad of adsExchangeHistory) {
      adExchangesData.push({
        _id: ad._id,
        sellerID: ad.sellerInfo[0] ? ad.sellerInfo[0]._id : '-',
        sellerUsername: ad.userInfos[0] ? ad.userInfos[0].username : '-',
        sellerFirstname: ad.sellerInfo[0] ? ad.sellerInfo[0].firstname : '-',
        sellerLastname: ad.sellerInfo[0] ? ad.sellerInfo[0].lastname : '-',
        supplierFromID: ad.supplierFromInfo[0] ? ad.supplierFromInfo[0]._id : '-',
        supplierFromName: ad.supplierFromInfo[0] ? ad.supplierFromInfo[0].businessName : '-',
        supplierToID: ad.supplierToInfo[0] ? ad.supplierToInfo[0]._id : '-',
        supplierToName: ad.supplierToInfo[0] ? ad.supplierToInfo[0].businessName : '-',
        pointsFrom: ad.pointsFrom,
        pointsTo: ad.pointsTo,
        timestamp: ad.createdAt
      })
    }

    res.json({ has_error: false, payload: adExchangesData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/history-app/exchange/all
// @desc    Get all exchanges
// @access  Public
router.get('/exchanges/all', async (req: Request, res: Response) => {
  try {
    const exchangeHistory = await Exchange.aggregate([
      {
        $lookup: {
          from: 'exchangeads',
          localField: 'ad',
          foreignField: '_id',
          as: 'ads'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'ads.supplierFrom',
          foreignField: '_id',
          as: 'supplierFromInfo'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'ads.supplierTo',
          foreignField: '_id',
          as: 'supplierToInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ads.seller',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyerInfo'
        }
      },
      {
        $lookup: {
          from: 'userinfos',
          localField: 'sellerInfo.userInfo',
          foreignField: '_id',
          as: 'userInfos'
        }
      },
      {
        $lookup: {
          from: 'userinfos',
          localField: 'buyerInfo.userInfo',
          foreignField: '_id',
          as: 'buyerUserInfos'
        }
      },
      {
        $project: {

          _id: 1,
          createdAt: 1,
          'ads.pointsFrom': 1,
          'ads.pointsTo': 1,
          'ads._id': 1,
          'supplierFromInfo.businessName': 1,
          'supplierToInfo.businessName': 1,
          'userInfos.username': 1,
          'buyerUserInfos.username': 1,
          'ads.createdAt': 1
        }
      }
    ]).exec()

    const exchangeData: Array<Object> = []
    for (const exchange of exchangeHistory) {
      exchangeData.push({
        _id: exchange._id,
        exchangeAdID: exchange.ads[0]._id,
        sellerUsername: exchange.userInfos[0] ? exchange.userInfos[0].username : '-',
        supplierFromName: exchange.supplierFromInfo[0] ? exchange.supplierFromInfo[0].businessName : '-',
        supplierToName: exchange.supplierToInfo[0] ? exchange.supplierToInfo[0].businessName : '-',
        pointsFrom: exchange.ads[0].pointsFrom,
        pointsTo: exchange.ads[0].pointsTo,
        exchangeAdCreationDate: exchange.ads[0].createdAt,
        buyerUsername: exchange.buyerUserInfos[0] ? exchange.buyerUserInfos[0].username : '-',
        exchangeDate: exchange.createdAt
      })
    }

    res.json({ has_error: false, payload: exchangeData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/history-app/funding/all
// @desc    Get all fundings
// @access  Public
router.get('/fundings/all', auth, async (req: Request, res: Response) => {
  try {
    const fundings: Array<IFunding> = await Funding.find().populate({ path: 'clientID', populate: { path: 'userInfo' } })
    const fundingData: Array<Object> = []
    for (const funding of fundings) {
      fundingData.push({
        _id: funding._id,
        client: funding.clientID.userInfo.username,
        amount: funding.amount,
        paymentInfo: funding.paymentInfo,
        timestamp: funding.createdAt
      })
    }

    res.json({ has_error: false, payload: fundingData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/history-app/promotion/all
// @desc    Get all promotions
// @access  Public
router.get('/promotions/all', auth, async (req: Request, res: Response) => {
  try {
    const promotionHistory: Array<IPromotionHistory> = await PromotionHistory.find().populate({ path: 'promotion', populate: { path: 'supplier' } })
    const promotionData: Array<Object> = []
    for (const promotion of promotionHistory) {
      promotionData.push({
        _id: promotion._id,
        supplierBusinessName: promotion.promotion.supplier.businessName,
        supplierBusinnessNumber: promotion.promotion.supplier.businessNumber,
        oldPointsToLennis: promotion.oldPointsToLennis,
        oldDollarsToPoints: promotion.oldDollarsToPoints,
        oldPointsToDollars: promotion.oldPointsToDollars,
        newPointsToLennis: promotion.newPointsToLennis,
        newDollarsToPoints: promotion.newDollarsToPoints,
        newPointsToDollars: promotion.newPointsToDollars,
        startDate: promotion.currentDate,
        expirationDate: promotion.expirationDate
      })
    }

    res.json({ has_error: false, payload: promotionData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/history-app/transaction/all
// @desc    Get all transactions
// @access  Public
router.get('/transactions/all', auth, async (req: Request, res: Response) => {
  try {
    const transactionHistory = await Transaction.aggregate([
      {
        $lookup: {
          from: 'ads',
          localField: 'ad',
          foreignField: '_id',
          as: 'bought_ads'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'bought_ads.supplier',
          foreignField: '_id',
          as: 'supplierInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyerInfo'
        }
      },
      {
        $lookup: {
          from: 'userinfos',
          localField: 'buyerInfo.userInfo',
          foreignField: '_id',
          as: 'buyerUserInfos'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'bought_ads.client',
          foreignField: '_id',
          as: 'clientInfo'
        }
      },
      {
        $lookup: {
          from: 'userinfos',
          localField: 'clientInfo.userInfo',
          foreignField: '_id',
          as: 'userInfos'
        }
      },
      {
        $project: {
          createdAt: 1,
          'bought_ads.price': 1,
          'bought_ads.points': 1,
          'bought_ads._id': 1,
          'supplierInfo.businessName': 1,
          'userInfos.username': 1,
          'buyerUserInfos.username': 1
        }
      }
    ]).exec()

    const transactionData: Array<Object> = []
    for (const transaction of transactionHistory) {
      transactionData.push({
        _id: transaction._id,
        sellerUsername: transaction.userInfos[0] ? transaction.userInfos[0].username : '-',
        buyerUsername: transaction.buyerUserInfos[0] ? transaction.buyerUserInfos[0].username : '-',
        adID: transaction.bought_ads[0]._id,
        points: transaction.bought_ads[0].points,
        price: transaction.bought_ads[0].price,
        supplierName: transaction.supplierInfo[0] ? transaction.supplierInfo[0].businessName : '-',
        timestamp: transaction.createdAt
      })
    }

    res.json({ has_error: false, payload: transactionData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/history-app/transfers/all
// @desc    Get all transfers
// @access  Public
router.get('/transfers/all', async (req: Request, res: Response) => {
  try {
    const transfers: Array<ITransfer> = await Transfer.find()
    const transfersData: Array<Object> = []
    for (const transfer of transfers) {
      const supplierIDA: ObjectId = transfer.supplierA
      const supplierIDB: ObjectId = transfer.supplierB
      const clientID: ObjectId = transfer.client

      const transferredPoint: number = transfer.transferredPointsFromA
      const timestamp: Date = transfer.createdAt
      const factorA: number = transfer.pointsToLennisA
      const factorB: number = transfer.pointsToLennisB
      const user: IUser = await User.findById(clientID)

      const supplierA: ISupplier = await Supplier.findById(supplierIDA)
      const supplierB: ISupplier = await Supplier.findById(supplierIDB)
      let username = '-'
      if (user) {
        const userInfo = await UserInfo.findById(user.userInfo)
        username = userInfo.username
      }
      const valueOfTransferredPointsToB: any = Math.round((transferredPoint * factorA) / factorB)
      transfersData.push({ username: username, _id: transfer._id, supplierIDA: supplierA ? supplierA.businessName : '-', supplierIDB: supplierB ? supplierB.businessName : '-', transferredPointsFromA: transfer.transferredPointsFromA, pointsToLennisA: transfer.pointsToLennisA, pointsToLennisB: transfer.pointsToLennisB, timestamp, transferredPointsToB: valueOfTransferredPointsToB })
    }

    res.json({ has_error: false, payload: transfersData })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})
export default router
