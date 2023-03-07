import { Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import Request from '../../types/Request'
import HttpStatusCodes from 'http-status-codes'
import Ad from '../../models/Ad'
import User from '../../models/User'
import auth from '../../middleware/auth'
import Supplier from '../../models/Supplier'
import Transaction from '../../models/Transaction'

const router: Router = Router()

// @route   POST api/clientAd/transaction
// @desc    Create an ad
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
      const { _id, clientID, clientUsername, supplierID, supplierName, points, price, timestamp } = req.body

      const client = await User.findOne({ userInfo: req.userInfoId })

      if (!client) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Client not found'
            }
          ]
        })
      }

      const supplier = await Supplier.findById( supplierID )

      if (!supplier) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Supplier not found'
            }
          ]
        })
      }

      const ad = await Ad.aggregate([
        {
          $match: {
            $and: [
              { client: client._id },
              { supplier: supplier._id }
            ]
           }
        },
        {
            "$lookup": {
                "from": "transactions",
                "localField": "_id",
                "foreignField": "ad",
                "as": "unbought_ads"
            }
        },
        { "$match": 
          { "unbought_ads.0": { "$exists": false }}
        }
      ]).exec()

      if (ad.length !== 0) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              param: 'existingAd',
              msg: 'An ad already exists for the supplier ' + supplier.businessName
            }
          ]
        })
      }
      
      await Ad.create({ client, supplier, points, price })
      res.json({ hasErrors: false })

    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   GET api/clientAd/transaction
// @desc    Get client's unbought ads
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

      const clientUnboughtAds = await Ad.aggregate([
        {
          $match: { client: seller._id }
        },
        {
            "$lookup": {
                "from": "transactions",
                "localField": "_id",
                "foreignField": "ad",
                "as": "bought_ads"
            }
        },
        { "$match": 
          { "bought_ads.0": { "$exists": false }}
        },
        {
          "$lookup": {
              "from": "suppliers",
              "localField": "supplier",
              "foreignField": "_id",
              "as": "supplierInfo"
          }
        },
        {
          "$project": { createdAt: 1, price : 1, points: 1, "supplierInfo._id": 1, "supplierInfo.businessName": 1 }
        },
      ]).exec()

      const adsData:Array<Object> = Array()
      for (const ad of clientUnboughtAds) {
        if (!ad.supplierInfo[0]) {
          await Ad.findByIdAndDelete(ad._id)
        } else {
          adsData.push({ _id:ad._id, 
            clientID: seller._id, clientUsername: seller.userInfo.username, 
            supplierID: ad.supplierInfo[0]._id, supplierName: ad.supplierInfo[0].businessName,
            points: ad.points, price: ad.price, 
            timestamp: ad.createdAt })
        }
      }

      res.json({ has_error: false, payload: adsData })

    } catch (err) {
      console.error(err.message)

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  })

// @route   GET api/clientAd/transaction/all
// @desc    Get all ads available for the client
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

    const unboughtAds = await Ad.aggregate([
      {
        $match: {client: { $ne: buyer._id } }
      },
      {
          "$lookup": {
              "from": "transactions",
              "localField": "_id",
              "foreignField": "ad",
              "as": "bought_ads"
          }
      },
      { "$match": 
        { "bought_ads.0": { "$exists": false }}
      },
      {
        "$lookup": {
            "from": "suppliers",
            "localField": "supplier",
            "foreignField": "_id",
            "as": "supplierInfo"
        }
      },
      {
        "$lookup": {
            "from": "users",
            "localField": "client",
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
        "$project": { createdAt: 1, price : 1, points: 1, "supplierInfo._id": 1, "supplierInfo.businessName": 1, "sellerInfo._id": 1, "userInfos.username": 1 }
      }
    ]).exec()

    const adsData: Array<Object> = []
    for (const ad of unboughtAds) {
      if (!ad.supplierInfo[0]) {
        await Ad.findByIdAndDelete(ad._id)
      } else {
        adsData.push({ _id: ad._id, 
          clientID: ad.sellerInfo[0]._id, clientUsername: ad.userInfos[0].username, 
          supplierID: ad.supplierInfo[0]._id, supplierName: ad.supplierInfo[0].businessName,
          points: ad.points, price: ad.price, 
          timestamp: ad.createdAt })
        }
    }

    res.json({ has_error: false, payload: adsData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   DELETE api/clientAd/transaction/remove/:id
// @desc    Delete ad with ad :id
// @access  Public
router.delete('/remove/:id', auth,
  async (req: Request, res: Response) => {
    try {
      const ad = await Ad.findByIdAndDelete(req.params.id)
      res.json({ has_errors: false, payload: ad })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/clientAd/transaction/bought
// @desc    Get client's bought ads
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

    const clientBoughtAds = await Ad.aggregate([
      {
        $match: { client: seller._id }
      },
      {
          "$lookup": {
              "from": "transactions",
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
            "localField": "supplier",
            "foreignField": "_id",
            "as": "supplierInfo"
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
        "$project": { createdAt: 1, price : 1, points: 1, 
                      "supplierInfo.businessName": 1, 
                      "userInfos.username": 1, 
                      "bought_ads._id": 1, "bought_ads.createdAt": 1 }
      }
    ]).exec()

    const adsData:Array<Object> = Array()
    for (const ad of clientBoughtAds) {
      adsData.push({ _id: ad.bought_ads[0]._id, adID: ad._id,
        clientUsername: seller.userInfo.username, 
        supplierName: ad.supplierInfo[0] ? ad.supplierInfo[0].businessName : '-',
        points: ad.points, price: ad.price, 
        adCreationDate: ad.createdAt,
        buyerUsername: ad.userInfos[0] ? ad.userInfos[0].username : '-',
        timestamp: ad.bought_ads[0].createdAt })
    }
    res.json({ has_error: false, payload: adsData })

  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   POST api/clientAd/transaction/update/:id
// @desc    Update an ad
// @access  Client
router.post(
  '/update/:id',
  [
    check('points', 'Please include valid points').isInt(),
    check('price', 'Please include a valid price').isNumeric()
  ], auth,
  async (req: Request, res: Response) => {
    try {
      const { points, price } = req.body
      const transaction = await Transaction.findOne({ ad: req.params.id })
      if (transaction) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              param: 'alreadyBought',
              msg: 'Ad has been bought'
            }
          ]
        })
      }
      await Ad.findByIdAndUpdate(req.params.id, { points: points, price: price })
      res.json({ has_error: false })
    } catch (err){
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
export default router
