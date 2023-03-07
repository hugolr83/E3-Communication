import bcrypt from 'bcryptjs'
import { Router, Response } from 'express'
import { check, validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import auth from '../../middleware/auth'
import UserInfo, { IUserInfo } from './../../models/UserInfo'
import Address, { IAddress } from './../../models/Address'
import Supplier, { ISupplier } from '../../models/Supplier'
import { ObjectId } from 'mongoose'
import Points from '../../models/Points'
import Transfer, { ITransfer } from '../../models/Transfer'
import Ad from '../../models/Ad'
import ExchangeAd from '../../models/ExchangeAd'
import Promotion from '../../models/Promotion'
import PromotionHistory from '../../models/PromotionHistory'

const router: Router = Router()

// @route   POST api/supplier/add
// @desc    Register supplier
// @access  Public
router.post(
  '/add',
  [
    check('username', 'Please include a valid username, must be between 3 and 10 characters').trim().rtrim().isLength({ min: 3, max: 10 }),
    check('password', 'Please include a valid password, must be min 8 characters)').trim().rtrim().isLength({ min: 8 }),
    check('businessName', 'Please include a valid business name, must be min 3 characters)').trim().rtrim().isLength({ min: 3 }),
    check('businessNumber', 'Please, include a valid business number, must be between 1 and 9 digits').trim().rtrim().isInt().isLength({ min: 1, max: 9 }),
    check('pointsToLennis', 'Please include a valid ratio of points to Lennis').isNumeric(),
    check('dollarsToPoints', 'Please include a valid ratio of dollars to points').isNumeric(),
    check('pointsToDollars', 'Please include a valid ratio of points to dollars').isNumeric(),
    check('street', 'Please include a valid street').trim().rtrim().isLength({ min: 3 }),
    check('city', 'Please include a valid city').trim().rtrim().isLength({ min: 3 }),
    check('postalCode', 'Please include a valid postal code').trim().rtrim().isLength({ min: 6, max: 7 }),
    check('province', 'Please include valid province').isLength({ min: 2 }),
    check('email', 'Please include a valid email').trim().rtrim().normalizeEmail().isEmail()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    // eslint-disable-next-line no-unused-vars
    const {
      businessName, businessNumber, pointsToLennis, dollarsToPoints, pointsToDollars, street, city, province,
      postalCode, username, password, email
    } = req.body
    const supplier: IUserInfo = await UserInfo.findOne({ email })
    if (supplier) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'Business Already Exists'
          }
        ]
      })
    }
    const userCheck: IUserInfo = await UserInfo.findOne({ username })
    if (userCheck) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'Username Already Taken'
          }
        ]
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    const role = 'SUPPLIER'
    const pending: boolean = true
    try {
      const lastConnection: Date = new Date()
      const registrationDate: Date = new Date()
      const userInfo: IUserInfo = await UserInfo.create({ email, username, password: hashed, role, registrationDate, lastConnection })
      const address: IAddress = await Address.create({ street, city, province, postalCode })
      await Supplier.create({
        businessName,
        businessNumber,
        pointsToLennis,
        dollarsToPoints,
        pointsToDollars,
        address,
        userInfo,
        pending
      })

      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      await UserInfo.findOneAndRemove({ email })
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
// @route   UPDATE api/supplier/updateParams
// @desc    update supplier parameters
// @access  Public
router.post('/updateParams', auth,
  [
    check('username', 'Please include a valid username, must be between 3 and 10 characters').trim().rtrim().isLength({ min: 3, max: 10 }),
    check('businessName', 'Please include a valid business name, must be min 3 characters)').trim().rtrim().isLength({ min: 3 }),
    check('businessNumber', 'Please, include a valid business number, must be between 1 and 9 digits').trim().rtrim().isInt().isLength({ min: 1, max: 9 }),
    check('pointsToLennis', 'Please include a valid ratio of points to Lennis').trim().rtrim().isDecimal(),
    check('dollarsToPoints', 'Please include a valid ratio of dollars to points').trim().rtrim().isDecimal(),
    check('pointsToDollars', 'Please include a valid ratio of points to dollars').trim().rtrim().isDecimal(),
    check('street', 'Please include a valid street').trim().rtrim().isLength({ min: 3 }),
    check('city', 'Please include a valid city').trim().rtrim().isLength({ min: 3 }),
    check('postalCode', 'Please include a valid postal code').trim().rtrim().isLength({ min: 6, max: 7 }), // 6 pour A1A1A1, 7 pour A1A 1A1
    check('email', 'Please include a valid email').trim().rtrim().normalizeEmail().isEmail()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const { businessName, businessNumber, username, email, pointsToLennis, dollarsToPoints, pointsToDollars, street, city, province, postalCode } = req.body
      const supplier: ISupplier = await Supplier.findOne({ userInfo: req.userInfoId })
      await Address.findByIdAndUpdate(supplier.address, { street: street, city: city, province: province, postalCode: postalCode })
      await UserInfo.findByIdAndUpdate(req.userInfoId, { username: username, email: email })
      await Supplier.findByIdAndUpdate(supplier._id, { businessName: businessName, businessNumber: businessNumber, pointsToLennis: pointsToLennis, dollarsToPoints: dollarsToPoints, pointsToDollars: pointsToDollars })
      res.json({ has_error: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/supplier/getParams
// @desc    get supplier parameters
// @access  Public
router.get('/getParams', auth,
  async (req: Request, res: Response) => {
    try {
      const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
      if (userInfoObject != null) {
        if (userInfoObject.role == 'SUPPLIER') {
          const userInfo: ObjectId = userInfoObject._id
          const supplier: ISupplier = await Supplier.findOne({ userInfo })
          if (supplier != null) {
            const address: IAddress = await Address.findById(supplier.address)
            if (address != null) {
              const supplierData: Array<Object> = Array()
              supplierData.push({
                businessName: supplier.businessName,
                businessNumber: supplier.businessNumber,
                username: userInfoObject.username,
                email: userInfoObject.email,
                pointsToLennis: supplier.pointsToLennis,
                dollarsToPoints: supplier.dollarsToPoints,
                pointsToDollars: supplier.pointsToDollars,
                street: address.street,
                city: address.city,
                province: address.province,
                postalCode: address.postalCode
              })
              res.json({ has_error: false, payload: supplierData })
            } else {
              res.status(HttpStatusCodes.BAD_REQUEST).send({ has_error: true, err_msg: 'Something wrong with the address' })
            }
          } else {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ has_error: true, err_msg: 'This account could not be found' })
          }
        } else {
          res.status(HttpStatusCodes.BAD_REQUEST).send({ has_error: true, err_msg: 'This account doesn\'t belong to a supplier' })
        }
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ has_error: true, err_msg: 'This account could not be found' })
      }
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/supplier/all
// @desc    Get all suppliers
// @access  Public
router.get('/all', async (req: Request, res: Response) => {
  try {
    const suppliers: Array<ISupplier> = await Supplier.find()
    const suppliersData: Array<Object> = Array()
    for (const supplier of suppliers) {
      const userInfoId: ObjectId = supplier.userInfo
      const userInfo: IUserInfo = await UserInfo.findById(userInfoId)
      if (userInfo) {
        const adresseId: ObjectId = supplier.address
        const address: IAddress = await Address.findById(adresseId)
        suppliersData.push({ supplierID: supplier._id, businessName: supplier.businessName, businessNumber: supplier.businessNumber, pointsToLennis: supplier.pointsToLennis, dollarToPoints: supplier.dollarsToPoints, pointsToDollars: supplier.pointsToDollars, userInfo: { email: userInfo.email, username: userInfo.username, role: userInfo.role, registrationDate: userInfo.registrationDate, lastConnection: userInfo.lastConnection, activeSessions: userInfo.activeSessions }, address: { street: address.street, city: address.city, province: address.province, postalCode: address.postalCode }, pending: supplier.pending })
      }
    }
    res.json({ has_error: false, payload: suppliersData })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   UPDATE api/supplier/update
// @desc    update supplier with :id
// @access  Public
router.post('/update/:id',
  (req: Request, res: Response) => {
    try {
      const supplier = Supplier.findByIdAndUpdate(req.params.id, { pending: false },
        function (err, result) {
          if (err) {
            res.status(404).send('Did not found supplier')
          } else {
            res.json({ has_errors: false })
          }
        })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   DELETE api/supplier/delete
// @desc    Delete supplier with :id
// @access  Public
router.delete('/delete/:id',
  async (req: Request, res: Response) => {
    try {
      const supplier = await Supplier.findById(req.params.id)
      const userInfoId: ObjectId = supplier.userInfo
      await UserInfo.findByIdAndDelete(userInfoId)
      const addressId: ObjectId = supplier.address
      await Address.findByIdAndDelete(addressId)

      const points = await Points.find({ supplier: supplier._id })
      for (const point of points) {
        await Points.findByIdAndDelete(point._id)
      }
      const transfers: Array<ITransfer> = await Transfer.find({ $or: [{ supplierA: supplier._id }, { supplierB: supplier._id }] })
      for (const transfer of transfers) {
        await Transfer.findByIdAndDelete(transfer._id)
      }

      // Delete unbought transaction ads related to supplier
      const unboughtAds = await Ad.aggregate([
        {
          $match: { supplier: supplier._id }
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
          $match:
          { 'bought_ads.0': { $exists: false } }
        }
      ]).exec()
      for (const ad of unboughtAds) {
        await Ad.findByIdAndDelete(ad._id)
      }

      // Delete unbought exchange ads related to supplier
      const unboughtExchangeAds = await ExchangeAd.aggregate([
        {
          $match: {
            $or: [
              { supplierFrom: supplier._id },
              { supplierTo: supplier._id }
            ]
          }
        },
        {
          $lookup: {
            from: 'exchanges',
            localField: '_id',
            foreignField: 'ad',
            as: 'bought_ads'
          }
        },
        {
          $match:
          { 'bought_ads.0': { $exists: false } }
        }
      ]).exec()
      for (const ad of unboughtExchangeAds) {
        await ExchangeAd.findByIdAndDelete(ad._id)
      }

      const promotion = await Promotion.findOne({ supplier: supplier._id })
      if (promotion) {
        await PromotionHistory.deleteMany({ promotion: promotion._id })
        await Promotion.deleteOne({ supplier: supplier._id })
      }
      await Supplier.findByIdAndDelete(req.params.id)
      res.json({ has_errors: false, payload: supplier })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

export default router
