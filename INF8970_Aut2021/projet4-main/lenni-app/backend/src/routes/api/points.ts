import { Router, Response } from 'express'
import { validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import User, { IUser } from '../../models/User'
import auth from '../../middleware/auth'
import { ObjectId } from 'mongoose'
import Points, { IPoints } from '../../models/Points'
import Supplier, { ISupplier } from '../../models/Supplier'
import UserInfo, { IUserInfo } from '../../models/UserInfo'

const router: Router = Router()

// @route   POST api/points/add
// @desc    Post user with :id
// @access  Public
router.post(
  '/add', auth,

  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }

    const { quantity, userId } = req.body
    const supplierObject: ISupplier = await Supplier.findOne({ userInfo: req.userInfoId })
    const supplierId = supplierObject._id

    try {
      const points: IPoints = await Points.findOne({
        $and: [

          { user: userId },
          { supplier: supplierId }
        ]
      })
      if (points) {
        points.quantity = quantity
        await points.save()
        res.json({ hasErrors: false })
      } else {
        const userObject: IUser = await User.findById(userId)
        const supplierObject: ISupplier = await Supplier.findById(supplierId)
        const user: ObjectId = userObject._id
        const supplier: ObjectId = supplierObject._id

        await Points.create({ quantity, user, supplier })

        res.json({ hasErrors: false })
      }
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)

// @route   GET api/points/all
// @desc    Get all users possessing points from a specific supplier given in parameters
// @access  Public
router.get(
  '/all', auth,
  async (req: Request, res: Response) => {
    try {
      const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
      const userInfo: ObjectId = userInfoObject._id
      const supplier: ISupplier = await Supplier.findOne({ userInfo })
      const points: Array<IPoints> = await Points.find()
      const pointsData: Array<Object> = Array()
      for (const point of points) {
        if (point.supplier._id.toString() === supplier._id.toString()) {
          const quantity = point.quantity
          const userId: ObjectId = point.user
          const user: IUser = await User.findById(userId)
          const userInfo: IUserInfo = await UserInfo.findById(user.userInfo)
          pointsData.push({ userID: user._id, lastname: user.lastname, firstname: user.firstname, username: userInfo.username, quantity })
        }
      }
      res.json({ has_error: false, payload: pointsData })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/points/all/:id
// @desc    Get all users possessing points from a specific supplier by id
// @access  Public
router.get(
  '/all/:id', auth,
  async (req: Request, res: Response) => {
    try {
      const supplier: ISupplier = await Supplier.findById(req.params.id)
      const points: Array<IPoints> = await Points.find()
      const pointsData: Array<Object> = Array()
      for (const point of points) {
        if (point.supplier._id.toString() === supplier._id.toString()) {
          const quantity = point.quantity
          const userId: ObjectId = point.user
          const user: IUser = await User.findById(userId)
          const userInfo: IUserInfo = await UserInfo.findById(user.userInfo)
          pointsData.push({ userID: user._id, lastname: user.lastname, firstname: user.firstname, username: userInfo.username, quantity })
        }
      }
      res.json({ has_error: false, payload: pointsData })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/points/userPoints
// @desc    Get all points for connected user
// @access  Public
router.get('/userPoints', auth, async (req: Request, res: Response) => {
  try {
    const userObject: IUser = await User.findOne({ userInfo: req.userInfoId })
    const user: ObjectId = userObject._id
    const points: Array<IPoints> = await Points.find({ user })
    let userPointsInfo: Array<Object>
    for (const point of points) {
      const supplierID: ObjectId = point.supplier
      const supplier: ISupplier = await Supplier.findOne({ supplierID })
      userPointsInfo.push({ userID: userObject._id, supplierID: supplier._id, businessName: supplier.businessName, totalPoints: point.quantity, pointsToLennis: supplier.pointsToLennis })
    }
    res.json({ has_error: false, payload: userPointsInfo })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})
// @route   POST api/points/generatePoints
// @desc    POST points to all users for all suppliers
// @access  Public
router.post('/generatePoints', async (req: Request, res: Response) => {
  try {
    const users: Array<IUser> = await User.find()
    const suppliers: Array<ISupplier> = await Supplier.find()
    for (const user of users) {
      if (!user.pending) {
        for (const supplier of suppliers) {
          if (!supplier.pending) {
            const point: IPoints = await Points.findOne({
              $and: [
                { user: user._id },
                { supplier: supplier._id }
              ]
            })
            if (!point) {
              const quantity: Number = Math.floor(Math.random() * 101)
              await Points.create({ quantity, user, supplier })
            }
          }
        }
      }
    }
    res.json({ has_error: false })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   POST api/points/add/byClient/:id
// @desc    POST points to client for all suppliers
// @access  Public
router.post('/add/byClient/:id', async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findById(req.params.id)

    const suppliers: Array<ISupplier> = await Supplier.find()

    if (!user.pending) {
      for (const supplier of suppliers) {
        if (!supplier.pending) {
          const point: IPoints = await Points.findOne({
            $and: [
              { user: user._id },
              { supplier: supplier._id }
            ]
          })
          if (!point) {
            const quantity: Number = 0
            await Points.create({ quantity, user, supplier })
          }
        }
      }
      res.json({ has_error: false })
    } else {
      console.error('user is pending')
      res.json({ has_error: true, err_msg: 'Server Error: ' + 'user is pending' })
    }
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   POST api/points/add/bySupplier/:id
// @desc    POST points to all client for supplier
// @access  Public
router.post('/add/bySupplier/:id', async (req: Request, res: Response) => {
  try {
    const supplier: ISupplier = await Supplier.findById(req.params.id)

    const users: Array<IUser> = await User.find()

    if (!supplier.pending) {
      for (const user of users) {
        if (!user.pending) {
          const point: IPoints = await Points.findOne({
            $and: [
              { user: user._id },
              { supplier: supplier._id }
            ]
          })
          if (!point) {
            const quantity: Number = 0
            await Points.create({ quantity, user, supplier })
          }
        }
      }
      res.json({ has_error: false })
    } else {
      console.error('user is pending')
      res.json({ has_error: true, err_msg: 'Server Error: ' + 'user is pending' })
    }
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

router.delete('/deleteAll', async (req: Request, res: Response) => {
  try {
    const points: Array<IPoints> = await Points.find()

    for (const point of points) {
      await Points.findByIdAndDelete(point._id)
    }
    res.json({ has_error: false })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})
export default router
