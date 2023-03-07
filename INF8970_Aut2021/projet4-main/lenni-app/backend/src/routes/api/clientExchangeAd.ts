import { Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import Request from '../../types/Request'
import HttpStatusCodes from 'http-status-codes'
import ExchangeAd from '../../models/ExchangeAd'
import User from '../../models/User'
import auth from '../../middleware/auth'
import { ObjectId } from 'mongoose'
import Supplier from '../../models/Supplier'
import Exchange from '../../models/Exchange'
import UserInfo from '../../models/UserInfo'

const router: Router = Router()

// @route   POST api/clientAd/exchange
// @desc    Create an exchange ad
// @access  Client
router.post(
  '/',
  [], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const { _id, sellerID, sellerUsername,
        supplierFromID, supplierFromName, pointsFrom,
        supplierToID, supplierToName, pointsTo,
        timestamp } = req.body

      const seller = await User.findOne({ userInfo: req.userInfoId })

      if (!seller) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Client not found'
            }
          ]
        })
      }

      const supplierStringIDs:Array<string> = [supplierFromID, supplierToID]
      const suppliers = await Supplier.find({ _id: { $in: supplierStringIDs } });
      if (suppliers.length !== 2) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Supplier(s) missing'
            }
          ]
        })
      }

      let supplierFrom: ObjectId = suppliers[0]._id
      let supplierTo: ObjectId = suppliers[1]._id
      if (suppliers[0]._id.toHexString() !== supplierFromID) {
        supplierFrom = suppliers[1]._id
        supplierTo = suppliers[0]._id
      }

      const exchangeAd = await ExchangeAd.aggregate([
        {
          $match: {
            $and: [
              { seller: seller._id },
              { supplierFrom: supplierFrom },
              { supplierTo: supplierTo }
            ]
           }
        },
        {
            "$lookup": {
                "from": "exchanges",
                "localField": "_id",
                "foreignField": "ad",
                "as": "unbought_ads"
            }
        },
        { "$match": 
          { "unbought_ads.0": { "$exists": false }}
        }
      ]).exec()

      if (exchangeAd.length !== 0) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              param: 'existingAd',
              msg: 'An ad already exists for the given suppliers: ' + suppliers[0].businessName + ', ' + suppliers[1].businessName
            }
          ]
        })
      }
      
      const IDValidationPending: Boolean = true;
      await ExchangeAd.create({ seller, supplierFrom, pointsFrom, supplierTo, pointsTo, IDValidationPending })
      res.json({ hasErrors: false })

    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   POST api/clientAd/exchange/validateID
// @desc    Validate an ad (ID checked)
// @access  Client
router.post(
  '/validateID',
  [], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      await ExchangeAd.updateOne({_id: req.body._id, IDValidationPending: true}, {IDValidationPending: false})
      const clientUser = await User.findById(req.body.sellerID)
      const clientUserInfo = await UserInfo.findById(clientUser.userInfo)
      const response = await fetch('http://authserver:5000/twilio/validateID', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({phone: clientUserInfo.phone})
      })
      const res2 = await response.json()
      if (res2.errors) {
        res.json( { hasErrors: true, errors: res2.errors, type: res2.type })
      }
      res.json({ has_error: false })
    }
    catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)

      

// @route   GET api/clientAd/exchange
// @desc    Get client's unbought exchange ads
// @access  Client
router.get('/', auth, async (req: Request, res: Response) => {
    try {
      const seller = await User.findOne({ userInfo: req.userInfoId }).populate('userInfo', 'username')

      if (!seller) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Could not find client '
            }
          ]
        })
      }

      const sellerUnboughtAds = await ExchangeAd.aggregate([
        {
          $match: { seller: seller._id, IDValidationPending: false }
        },
        {
            "$lookup": {
                "from": "exchanges",
                "localField": "_id",
                "foreignField": "ad",
                "as": "unbought_ads"
            }
        },
        { "$match": 
          { "unbought_ads.0": { "$exists": false }}
        },
        {
          "$lookup": {
              "from": "suppliers",
              "localField": "supplierFrom",
              "foreignField": "_id",
              "as": "supplierFromInfo"
          }
        },
        {
          "$lookup": {
              "from": "suppliers",
              "localField": "supplierTo",
              "foreignField": "_id",
              "as": "supplierToInfo"
          }
        },
        {
          "$project": { createdAt: 1, pointsFrom : 1, pointsTo: 1,
            "supplierFromInfo._id": 1, "supplierFromInfo.businessName": 1, 
            "supplierToInfo._id": 1, "supplierToInfo.businessName": 1 }
        },
      ]).exec()

      const adsData:Array<Object> = Array()
      for (const ad of sellerUnboughtAds) {
        if (!ad.supplierToInfo[0] || !ad.supplierFromInfo[0]) {
          await ExchangeAd.find({id: ad._id, IDValidationPending: false})
          await ExchangeAd.deleteOne({id: ad._id, IDValidationPending: false})
        } else {
          // IExchangeAd
          adsData.push({ _id:ad._id, 
            sellerID: seller._id, sellerUsername: seller.userInfo.username,
            supplierFromID: ad.supplierFromInfo[0]._id, supplierFromName: ad.supplierFromInfo[0].businessName,
            supplierToID: ad.supplierToInfo[0]._id, supplierToName: ad.supplierToInfo[0].businessName,
            pointsFrom: ad.pointsFrom, pointsTo: ad.pointsTo, 
            timestamp: ad.createdAt, IDValidationPending: ad.IDValidationPending })
        }
      }
      res.json({ has_error: false, payload: adsData })

    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   GET api/clientAd/exchange/all
// @desc    Get all exchange ads available for the client
// @access  Client
router.get('/all', auth, async (req: Request, res: Response) => {
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

    const unboughtAds = await ExchangeAd.aggregate([
      {
        $match: {seller: { $ne: buyer._id }, IDValidationPending: false }
      },
      {
          "$lookup": {
              "from": "exchanges",
              "localField": "_id",
              "foreignField": "ad",
              "as": "unbought_ads"
          }
      },
      { "$match": 
        { "unbought_ads.0": { "$exists": false }}
      },
      {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplierFrom",
            "foreignField": "_id",
            "as": "supplierFromInfo"
        }
      },
      {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplierTo",
            "foreignField": "_id",
            "as": "supplierToInfo"
        }
      },
      {
        "$lookup": {
            "from": "users",
            "localField": "seller",
            "foreignField": "_id",
            "as": "sellerInfo"
        }
      },
      {
        "$lookup": {
            "from": "userinfos",
            "localField": "sellerInfo.userInfo",
            "foreignField": "_id",
            "as": "userInfos"
        }
      },
      {
        "$project": { createdAt: 1, pointsFrom : 1, pointsTo: 1, 
          "supplierFromInfo._id": 1, "supplierFromInfo.businessName": 1, 
          "supplierToInfo._id": 1, "supplierToInfo.businessName": 1,
          "sellerInfo._id": 1, "userInfos.username": 1 }
      }
    ]).exec()

    const adsData: Array<Object> = []
    for (const ad of unboughtAds) {
      if (!ad.supplierToInfo[0] || !ad.supplierFromInfo[0]) {
        await ExchangeAd.find({id: ad._id, IDValidationPending: false})
        await ExchangeAd.deleteOne({id: ad._id, IDValidationPending: false})
      } else {
        // IExchangeData
        adsData.push({ _id:ad._id, 
          sellerID: ad.sellerInfo[0]._id, sellerUsername: ad.userInfos[0].username,
          supplierFromID: ad.supplierFromInfo[0]._id, supplierFromName: ad.supplierFromInfo[0].businessName,
          supplierToID: ad.supplierToInfo[0]._id, supplierToName: ad.supplierToInfo[0].businessName,
          pointsFrom: ad.pointsFrom, pointsTo: ad.pointsTo, 
          timestamp: ad.createdAt })
      }
    }

    res.json({ has_error: false, payload: adsData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   DELETE api/clientAd/exchange
// @desc    Delete ad with ad :id
// @access  Public
router.delete('/remove/:id', auth,
  async (req: Request, res: Response) => {
    try {
      const ad = await ExchangeAd.find({id: req.body._id})
      await ExchangeAd.deleteOne({id: req.body._id})
      res.json({ has_errors: false, payload: ad })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/clientAd/exchange/bought
// @desc    Get client's bought exchange ads
// @access  Client
router.get('/bought', auth, async (req: Request, res: Response) => {
  try {
    const seller = await User.findOne({ userInfo: req.userInfoId }).populate('userInfo', 'username')

    if (!seller) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'Could not find client '
          }
        ]
      })
    }

    const sellerBoughtAds = await ExchangeAd.aggregate([
      {
        $match: { seller: seller._id, IDValidationPending: false }
      },
      {
          "$lookup": {
              "from": "exchanges",
              "localField": "_id",
              "foreignField": "ad",
              "as": "bought_ads"
          }
      },
      { "$match": 
        { "bought_ads.0": { "$exists": true }}
      },
      {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplierFrom",
            "foreignField": "_id",
            "as": "supplierFromInfo"
        }
      },
      {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplierTo",
            "foreignField": "_id",
            "as": "supplierToInfo"
        }
      },
      {
        "$lookup": {
            "from": "users",
            "localField": "bought_ads.buyer",
            "foreignField": "_id",
            "as": "buyerInfo"
        }
      },
      {
        "$lookup": {
            "from": "userinfos",
            "localField": "buyerInfo.userInfo",
            "foreignField": "_id",
            "as": "userInfos"
        }
      },
      {
        "$project": { createdAt: 1, pointsFrom : 1, pointsTo: 1, 
                      "supplierFromInfo.businessName": 1, 
                      "supplierToInfo.businessName": 1,
                      "userInfos.username": 1, 
                      "bought_ads.createdAt": 1 }
      }
    ]).exec()

    const adsData:Array<Object> = Array()
    for (const ad of sellerBoughtAds) {
      // IExchangeData
      adsData.push({ _id: ad.bought_ads[0]._id, exchangeAdID: ad._id,
        sellerUsername: seller.userInfo.username, 
        supplierFromName: ad.supplierFromInfo[0] ? ad.supplierFromInfo[0].businessName : '-',
        supplierToName: ad.supplierToInfo[0] ? ad.supplierToInfo[0].businessName : '-',
        pointsFrom: ad.pointsFrom, pointsTo: ad.pointsTo, 
        exchangeAdCreationDate: ad.createdAt,
        buyerUsername: ad.userInfos[0] ? ad.userInfos[0].username : '-',
        exchangeDate: ad.bought_ads[0].createdAt })
    }
    res.json({ has_error: false, payload: adsData })

  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   POST api/clientAd/exchange/update/:id
// @desc    Update an ad
// @access  Client
router.post(
  '/update/:id',
  [
    check('pointsFrom', 'Please include valid points').isInt(),
    check('pointsTo', 'Please include valid points').isInt()
  ], auth,
  async (req: Request, res: Response) => {
    try {
      const { pointsFrom, pointsTo } = req.body
      const exchange = await Exchange.findOne({ ad: req.params.id })
      if (exchange) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              param: 'alreadyExchanged',
              msg: 'Ad has been exchanged'
            }
          ]
        })
      }
      await ExchangeAd.findByIdAndUpdate(req.params.id, { pointsFrom: pointsFrom, pointsTo: pointsTo })
      res.json({ has_error: false })
    } catch (err){
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
export default router
