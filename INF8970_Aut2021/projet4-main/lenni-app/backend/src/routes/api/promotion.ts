import { Router, Response } from 'express'
import { check, validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import auth from '../../middleware/auth'
import UserInfo, { IUserInfo } from './../../models/UserInfo'
import Supplier, { ISupplier } from '../../models/Supplier'
import { ObjectId } from 'mongoose'
import Promotion, { IPromotion } from '../../models/Promotion'
import PromotionHistory, { IPromotionHistory } from '../../models/PromotionHistory'

const router: Router = Router()

// @route   POST api/promotion/addPromotion
// @desc    Add new promotion
// @access  Public
router.post(
  '/addPromotion', auth,
  check('pointsToLennis', 'Please include a valid ratio of points to Lennis').isNumeric(),
  check('dollarsToPoints', 'Please include a valid ratio of dollars to points').isNumeric(),
  check('pointsToDollars', 'Please include a valid ratio of points to dollars').isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    const { pointsToLennis, dollarsToPoints, pointsToDollars, expirationDate } = req.body
    const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
    const userInfo: ObjectId = userInfoObject._id
    const supplier: ISupplier = await Supplier.findOne({ userInfo })
    const oldPointsToLennis = supplier.pointsToLennis
    const oldDollarsToPoints = supplier.dollarsToPoints
    const oldPointsToDollars = supplier.pointsToDollars
    const newPointsToLennis = pointsToLennis
    const newDollarsToPoints = dollarsToPoints
    const newPointsToDollars = pointsToDollars
    const active = true
    try {
      supplier.pointsToLennis = newPointsToLennis
      supplier.dollarsToPoints = newDollarsToPoints
      supplier.pointsToDollars = newPointsToDollars
      await supplier.save()
      let promotion: IPromotion = await Promotion.findOne({ supplier: supplier._id })
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000)
      const offset = -300
      const currentDate = new Date(today.getTime() + offset * 60 * 1000)
      let serverMsg = 'Promotion successfully created'

      const today2 = new Date(timeElapsed)
      today2.setHours(0, 0, 0, 0)
      const expirationDate2 = new Date(expirationDate)
      expirationDate2.setHours(0, 0, 0, 0)
      if (expirationDate2 >= today2) {
        if (promotion) {
          promotion.newPointsToLennis = newPointsToLennis
          promotion.newDollarsToPoints = newDollarsToPoints
          promotion.newPointsToDollars = newPointsToDollars
          promotion.currentDate = currentDate
          promotion.expirationDate = expirationDate
          promotion.active = active
          await promotion.save()
          await PromotionHistory.create({
            promotion,
            oldPointsToLennis,
            oldDollarsToPoints,
            oldPointsToDollars,
            newPointsToLennis,
            newDollarsToPoints,
            newPointsToDollars,
            currentDate,
            expirationDate,
            active
          })
        } else {
          promotion = await Promotion.create({
            supplier,
            oldPointsToLennis,
            oldDollarsToPoints,
            oldPointsToDollars,
            newPointsToLennis,
            newDollarsToPoints,
            newPointsToDollars,
            currentDate,
            expirationDate,
            active
          })
          await PromotionHistory.create({
            promotion,
            oldPointsToLennis,
            oldDollarsToPoints,
            oldPointsToDollars,
            newPointsToLennis,
            newDollarsToPoints,
            newPointsToDollars,
            currentDate,
            expirationDate,
            active
          })
        }
      } else {
        serverMsg = 'Please restart and input a valid date'
      }
      res.json({ hasErrors: false, payload: serverMsg })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)

// @route   DELETE api/promotion/deletePromotion
// @desc    Delete promotion
// @access  Public
router.delete(
  '/deletePromotion', auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000)
    const offset = -300
    const todayEST = new Date(today.getTime() + offset * 60 * 1000)
    try {
      const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
      const userInfo: ObjectId = userInfoObject._id
      const supplier: ISupplier = await Supplier.findOne({ userInfo })
      const promotion: IPromotion = await Promotion.findOne({ supplier: supplier._id })
      if (promotion.active) {
        const newPointsToLennis = promotion.newPointsToLennis
        const newDollarsToPoints = promotion.newDollarsToPoints
        const newPointsToDollars = promotion.newPointsToDollars

        promotion.newPointsToLennis = promotion.oldPointsToLennis
        promotion.newDollarsToPoints = promotion.oldDollarsToPoints
        promotion.newPointsToDollars = promotion.oldPointsToDollars
        promotion.expirationDate = todayEST
        promotion.active = false
        supplier.pointsToLennis = promotion.oldPointsToLennis
        supplier.dollarsToPoints = promotion.oldDollarsToPoints
        supplier.pointsToDollars = promotion.oldPointsToDollars
        await supplier.save()
        await promotion.save()

        const oldPointsToLennis = promotion.oldPointsToLennis
        const oldDollarsToPoints = promotion.oldDollarsToPoints
        const oldPointsToDollars = promotion.oldPointsToDollars
        const expirationDate = new Date()
        const active = promotion.active
        const currentDate = promotion.currentDate

        await PromotionHistory.create({
          promotion,
          oldPointsToLennis,
          oldDollarsToPoints,
          oldPointsToDollars,
          newPointsToLennis,
          newDollarsToPoints,
          newPointsToDollars,
          currentDate,
          expirationDate,
          active
        })
      }
      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)

// @route   GET api/promotion/getPromotion
// @desc    Get all info on a promotion
// @access  Public
router.get('/getPromotion', auth,
  async (req: Request, res: Response) => {
    try {
      const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
      const userInfo: ObjectId = userInfoObject._id
      const supplier: ISupplier = await Supplier.findOne({ userInfo })
      const promotion: IPromotion = await Promotion.findOne({ supplier: supplier._id })
      res.json({ has_error: false, payload: promotion || { oldPointsToLennis: supplier.pointsToLennis, oldDollarsToPoints: supplier.dollarsToPoints, oldPointsToDollars: supplier.pointsToDollars, newPointsToLennis: '', newDollarsToPoints: '', newPointsToDollars: '', expirationDate: new Date(), active: false } })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/promotion/history
// @desc    Get promotion history of the connected supplier
// @access  Client
router.get('/history', auth, async (req: Request, res: Response) => {
  try {
    const supplier: ISupplier = await Supplier.findOne({ userInfo: req.userInfoId })
    const promotion: IPromotion = await Promotion.findOne({ supplier: supplier._id })

    const promotionHistoryData:Array<Object> = Array()
    if (promotion) {
      const promotionHistoryArray:Array<IPromotionHistory> = await PromotionHistory.find({ promotion: promotion._id })
      for (const promotionHistory of promotionHistoryArray) {
        if (!promotionHistory.active) {
          const currentDateLocale = promotionHistory.currentDate.toLocaleString()
          const expirationDateLocale = promotionHistory.expirationDate.toLocaleString('en-US', { timeZone: 'EST' })
          promotionHistoryData.push({
            oldPointsToLennis: promotionHistory.oldPointsToLennis,
            oldDollarsToPoints: promotionHistory.oldDollarsToPoints,
            oldPointsToDollars: promotionHistory.oldPointsToDollars,
            newPointsToLennis: promotionHistory.newPointsToLennis,
            newDollarsToPoints: promotionHistory.newDollarsToPoints,
            newPointsToDollars: promotionHistory.newPointsToDollars,
            currentDate: currentDateLocale,
            expirationDate: expirationDateLocale
          })
        }
      }
    }
    res.json({ has_error: false, payload: promotionHistoryData })
  } catch (err) {
    console.error(err.message)

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/promotion/all
// @desc    Get all info on a promotion
// @access  Public
router.get('/all', auth,
  async (req: Request, res: Response) => {
    try {
      const promotions = await Promotion.find().populate('supplier', 'businessName')
      const promotionData:Array<Object> = Array()
      for (const promotion of promotions) {
        if (promotion.active) {
          promotionData.push({
            supplierId: promotion.supplier._id,
            newPointsToLennis: promotion.newPointsToLennis,
            newDollarsToPoints: promotion.newDollarsToPoints,
            newPointsToDollars: promotion.newPointsToDollars,
            expirationDate: promotion.expirationDate,
            supplierBusinessName: promotion.supplier.businessName
          })
        }
      }
      res.json({ has_error: false, payload: promotionData })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

export default router
