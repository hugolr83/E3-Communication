import { Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import Request from '../../types/Request'
import HttpStatusCodes from 'http-status-codes'
import Ad, { IAd } from '../../models/Ad'
import ExchangeAd, { IExchangeAd } from '../../models/ExchangeAd'
import Transaction from '../../models/Transaction'
import Transfer from '../../models/Transfer'
import User, { IUser } from '../../models/User'
import Points, { IPoints } from '../../models/Points'
import auth from '../../middleware/auth'
import { ObjectId } from 'mongoose'
import Exchange from '../../models/Exchange'
import Funding from '../../models/funding'
const router: Router = Router()

// @route   POST api/operations/transferPoints
// @desc    Transfer points from supplier A to B
// @access  Client
router.post(
  '/transferPoints',
  [], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const { _id, supplierIDA, supplierIDB, transferredPointsFromA, pointsToLennisA, pointsToLennisB, timestamp } = req.body

      const client = await User.findOne({ userInfo: req.userInfoId })

      let supplierA:ObjectId

      let supplierB:ObjectId
      let pointBuyer:IPoints
      let pointSeller:IPoints
      const points = await Points.find({ user: client })
      for (const point of points) {
        if (point.supplier.toHexString() === supplierIDA) {
          supplierA = point.supplier
          pointBuyer = point
        } else if (point.supplier.toHexString() === supplierIDB) {
          supplierB = point.supplier
          pointSeller = point
        }
      }

      if (pointBuyer && pointSeller) {
        pointBuyer.quantity -= transferredPointsFromA
        pointSeller.quantity += Math.round((transferredPointsFromA * pointsToLennisA) / pointsToLennisB)
        await pointBuyer.save()
        await pointSeller.save()
        await Transfer.create({ client, supplierA, supplierB, transferredPointsFromA, pointsToLennisA, pointsToLennisB })
        res.json({ hasErrors: false })
      } else {
        res.json({ hasErrors: true })
        console.log('pointBuyer or pointSeller not found')
      }
    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })
// @route   GET api/operations/transferHistory
// @desc    GET current client transfers
// @access  Client
router.get(
  '/transferHistory',
  [], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const client = await User.findOne({ userInfo: req.userInfoId })
      await client.populate('userInfo')
      if (!client) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Client not found',
              param: 'client'
            }
          ]
        })
      }
      const transferData: Array<Object> = []
      const transfers = await Transfer.find({ client: client._id }).populate(['supplierA', 'supplierB'])
      for (const transfer of transfers) {
        let supplierAName = ''
        let supplierBName = ''
        if (transfer.supplierA.businessName) {
          supplierAName = transfer.supplierA.businessName
        } else {
          supplierAName = 'Deleted'
        }
        if (transfer.supplierB.businessName) {
          supplierBName = transfer.supplierB.businessName
        } else {
          supplierBName = 'Deleted'
        }
        const transferredPointsToB = Math.round(transfer.transferredPointsFromA * transfer.pointsToLennisA / transfer.pointsToLennisB)
        transferData.push({
          username: client.userInfo.username,
          _id: transfer._id,
          supplierIDA: supplierAName,
          supplierIDB: supplierBName,
          transferredPointsFromA: transfer.transferredPointsFromA,
          pointsToLennisA: transfer.pointsToLennisA,
          pointsToLennisB: transfer.pointsToLennisB,
          transferredPointsToB: transferredPointsToB,
          timestamp: transfer.createdAt
        })
      }

      res.json({ has_error: false, payload: transferData })
    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
// @route   POST api/operations/addFunds
// @desc    Add funds
// @access  Public
router.post('/addFunds', auth,
  [
    check('amount', 'Please include a valid amount').isNumeric().matches('^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9]{1,2})?$')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const client = await User.findOne({ userInfo: req.userInfoId })
      if (!client) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Client not found',
              param: 'client'
            }
          ]
        })
      }

      const { amount, paymentInfo, billingAddress } = req.body
      if (paymentInfo.paymentMode === 0) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Please chose a payment mode',
              param: 'paymentMode'
            }
          ]
        })
      }
      await Funding.create({ clientID: client, amount: amount, paymentInfo: paymentInfo, billingAddress: billingAddress })
      await User.findByIdAndUpdate(client._id, { funds: Number(client.funds) + Number(amount) })
      res.json({ has_errors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })
// @route   GET api/operations/fundingHistory
// @desc    GET current client fundings
// @access  Client
router.get(
  '/fundingHistory',
  [], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const client = await User.findOne({ userInfo: req.userInfoId })
      await client.populate('userInfo')
      if (!client) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Client not found',
              param: 'client'
            }
          ]
        })
      }
      const fundingData: Array<Object> = []
      const fundings = await Funding.find({ clientID: client._id }).populate(['billingAddress', 'paymentInfo'])
      for (const funding of fundings) {
        fundingData.push({
          client: client.userInfo.username,
          _id: funding._id,
          amount: funding.amount,
          paymentInfo: funding.paymentInfo,
          billingAddress: funding.billingAddress,
          timestamp: funding.createdAt
        })
      }

      res.json({ has_error: false, payload: fundingData })
    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
// @route   POST api/operations/transaction
// @desc    Buy points from another client
// @access  Client
router.post(
  '/transaction', auth,
  async (req: Request, res: Response) => {
    try {
      const { adID } = req.body

      const buyer: IUser = await User.findOne({ userInfo: req.userInfoId }).populate('userInfo', 'username')

      if (!buyer) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find client'
            }
          ]
        })
      }

      const ad: IAd = await Ad.findById(adID)

      if (!ad) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find ad ' + adID
            }
          ]
        })
      }

      if ((buyer.funds - ad.price) < 0) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              param: 'funds',
              msg: ad.price - buyer.funds
            }
          ]
        })
      }

      const seller: IUser = await User.findById(ad.client)

      if (!seller) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find seller ' + ad.client
            }
          ]
        })
      }

      let pointBuyer:IPoints
      let pointSeller:IPoints
      const points = await Points.find({
        $or: [
          {
            $and: [
              { user: buyer._id },
              { supplier: ad.supplier }
            ]
          },
          {
            $and: [
              { user: seller._id },
              { supplier: ad.supplier }
            ]
          }
        ]
      })

      if (points.length !== 2) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find points'
            }
          ]
        })
      }
      for (const point of points) {
        if (point.user.toHexString() === buyer._id.toHexString()) {
          pointBuyer = point
        } else if (point.user.toHexString() === seller._id.toHexString()) {
          pointSeller = point
        }
      }

      if (pointBuyer && pointSeller) {
        if (pointSeller.quantity < ad.points) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            hasErrors: true,
            errors: [
              {
                param: 'points',
                msg: 'Seller doesn\'t have enough points left'
              }
            ]
          })
        }
        pointBuyer.quantity += ad.points
        pointSeller.quantity -= ad.points
        buyer.funds -= ad.price
        seller.funds += ad.price
        await pointBuyer.save()
        await pointSeller.save()
        await buyer.save()
        await seller.save()
        await Transaction.create({ buyer, ad })
        res.json({ hasErrors: false })
      } else {
        res.json({ hasErrors: true })
        console.log('pointBuyer or pointSeller not found')
      }
    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   GET api/operations/transaction
// @desc    Get transaction history of the connected client
// @access  Client
router.get('/transaction', auth, async (req: Request, res: Response) => {
  try {
    const buyer = await User.findOne({ userInfo: req.userInfoId })

    if (!buyer) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'Could not find client '
          }
        ]
      })
    }

    const transactionHistory = await Ad.aggregate([
      {
        $match: { client: { $ne: buyer._id } }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'ad',
          as: 'bought_ads'
        }
      },
      {
        $match: {
          $and: [
            { 'bought_ads.0': { $exists: true } },
            { 'bought_ads.buyer': { $eq: buyer._id } }
          ]
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplierInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'client',
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
          price: 1,
          points: 1,
          'supplierInfo.businessName': 1,
          'userInfos.username': 1,
          'bought_ads._id': 1,
          'bought_ads.createdAt': 1
        }
      }
    ]).exec()

    const transactionData: Array<Object> = []
    for (const transaction of transactionHistory) {
      transactionData.push({
        _id: transaction.bought_ads[0]._id,
        adID: transaction._id,
        sellerUsername: transaction.userInfos[0] ? transaction.userInfos[0].username : '-',
        supplierName: transaction.supplierInfo[0] ? transaction.supplierInfo[0].businessName : '-',
        points: transaction.points,
        price: transaction.price,
        adCreationDate: transaction.createdAt,
        buyerUsername: buyer.userInfo.username,
        timestamp: transaction.bought_ads[0].createdAt
      })
    }

    res.json({ has_error: false, payload: transactionData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   POST api/operations/exchange
// @desc    Exchange points with another client
// @access  Client
router.post(
  '/exchange', auth,
  async (req: Request, res: Response) => {
    try {
      const { adID } = req.body

      const buyer: IUser = await User.findOne({ userInfo: req.userInfoId }).populate('userInfo', 'username')

      if (!buyer) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find client'
            }
          ]
        })
      }

      const ad: IExchangeAd = await ExchangeAd.findById(adID)

      if (!ad) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find exchange ad ' + adID
            }
          ]
        })
      }

      const seller: IUser = await User.findById(ad.seller)

      if (!seller) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find seller ' + ad.seller
            }
          ]
        })
      }

      const points = await Points.find({
        $or: [
          {
            $and: [
              { user: buyer._id },
              { supplier: ad.supplierFrom }
            ]
          },
          {
            $and: [
              { user: buyer._id },
              { supplier: ad.supplierTo }
            ]
          },
          {
            $and: [
              { user: seller._id },
              { supplier: ad.supplierFrom }
            ]
          },
          {
            $and: [
              { user: seller._id },
              { supplier: ad.supplierTo }
            ]
          }
        ]
      })

      if (points.length !== 4) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find points'
            }
          ]
        })
      }

      let pointFromBuyer:IPoints
      let pointToBuyer:IPoints
      let pointFromSeller:IPoints
      let pointToSeller:IPoints
      for (const point of points) {
        if (point.user.toHexString() === buyer._id.toHexString()) {
          if (point.supplier.toHexString() === ad.supplierFrom.toHexString()) {
            pointFromBuyer = point
          } else if (point.supplier.toHexString() === ad.supplierTo.toHexString()) {
            pointToBuyer = point
          }
        } else if (point.user.toHexString() === seller._id.toHexString()) {
          if (point.supplier.toHexString() === ad.supplierFrom.toHexString()) {
            pointFromSeller = point
          } else if (point.supplier.toHexString() === ad.supplierTo.toHexString()) {
            pointToSeller = point
          }
        }
      }

      if (pointFromBuyer && pointToBuyer && pointFromSeller && pointToSeller) {
        if (pointToBuyer.quantity < ad.pointsTo) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            hasErrors: true,
            errors: [
              {
                param: 'points',
                msg: 'Buyer doesn\'t have enough points left'
              }
            ]
          })
        }

        if (pointFromSeller.quantity < ad.pointsFrom) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            hasErrors: true,
            errors: [
              {
                param: 'points',
                msg: 'Seller doesn\'t have enough points left'
              }
            ]
          })
        }

        pointFromBuyer.quantity += ad.pointsFrom
        pointToBuyer.quantity -= ad.pointsTo
        pointFromSeller.quantity -= ad.pointsFrom
        pointToSeller.quantity += ad.pointsTo
        await pointFromBuyer.save()
        await pointToBuyer.save()
        await pointFromSeller.save()
        await pointToSeller.save()
        await Exchange.create({ buyer, ad })
        res.json({ hasErrors: false })
      } else {
        res.json({ hasErrors: true })
        console.log('pointBuyer or pointSeller not found')
      }
    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   GET api/operations/exchange
// @desc    Get exchange history of the connected client
// @access  Client
router.get('/exchange', auth, async (req: Request, res: Response) => {
  try {
    const buyer = await User.findOne({ userInfo: req.userInfoId })

    if (!buyer) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'Could not find client '
          }
        ]
      })
    }

    const exchangeHistory = await ExchangeAd.aggregate([
      {
        $match: { seller: { $ne: buyer._id }, IDValidationPending: false }
      },
      {
        $lookup: {
          from: 'exchanges',
          localField: '_id',
          foreignField: 'ad',
          as: 'exchange'
        }
      },
      {
        $match: {
          $and: [
            { 'exchange.0': { $exists: true } },
            { 'exchange.buyer': { $eq: buyer._id } }
          ]
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
          'exchange._id': 1,
          'supplierFromInfo.businessName': 1,
          'supplierToInfo.businessName': 1,
          'userInfos.username': 1,
          'exchange.createdAt': 1
        }
      }
    ]).exec()

    const exchangeData: Array<Object> = []
    for (const exchange of exchangeHistory) {
      // IExchangeData
      exchangeData.push({
        _id: exchange.exchange[0]._id,
        exchangeAdID: exchange._id,
        sellerUsername: exchange.userInfos[0] ? exchange.userInfos[0].username : '-',
        supplierFromName: exchange.supplierFromInfo[0] ? exchange.supplierFromInfo[0].businessName : '-',
        supplierToName: exchange.supplierToInfo[0] ? exchange.supplierToInfo[0].businessName : '-',
        pointsFrom: exchange.pointsFrom,
        pointsTo: exchange.pointsTo,
        exchangeAdCreationDate: exchange.createdAt,
        buyerUsername: buyer.userInfo.username,
        exchangeDate: exchange.exchange[0].createdAt
      })
    }

    res.json({ has_error: false, payload: exchangeData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})
export default router
