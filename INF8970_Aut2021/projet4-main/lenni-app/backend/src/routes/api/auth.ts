import bcrypt from 'bcryptjs'
import { Router, Response } from 'express'
import { check, validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import jwt from 'jsonwebtoken'
import config from 'config'
import auth from '../../middleware/auth'
import Payload from '../../types/Payload'
import Request from '../../types/Request'
import UserInfo, { IUserInfo } from '../../models/UserInfo'
import User, { IUser } from '../../models/User'
import Supplier, { ISupplier } from '../../models/Supplier'

const dotenv = require('dotenv')
dotenv.config()

const router: Router = Router()

// @route   POST api/auth/changePassword
// @desc    POST change password of autheticated user
// @access  Private
router.post('/changePassword',
  [
    check('oldPassword', 'Invalid password').isLength({ min: 8 }),
    check('newPassword', 'Please include a valid password, must be more than 8 characters').isLength({ min: 8 })
  ], auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }

    const { oldPassword, newPassword } = req.body

    try {
      const salt = await bcrypt.genSalt(10)
      const newHashed = await bcrypt.hash(newPassword, salt)
      const userInfo = await UserInfo.findById(req.userInfoId)

      if (!userInfo) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'User not found',
              param: 'oldPassword'
            }
          ]
        })
      }
      const isMatch = await bcrypt.compare(oldPassword, userInfo.password)
      if (!isMatch) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Invalid password',
              param: 'oldPassword'
            }
          ]
        })
      }
      await UserInfo.findByIdAndUpdate(req.userInfoId, { password: newHashed })
      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server_Error')
    }
  })

// @route   GET api/isUnique
// @desc    Get authenticated user given the token
// @access  Private
router.post('/isUnique', check('username', 'Invalid_Username').isLength({ min: 6, max: 8 })
  , async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const userInfo: IUserInfo = await UserInfo.findOne({ username: req.body.username }).select('-password')
      res.json({ hasErrors: false, payload: userInfo })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server_Error')
    }
  })

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const userInfo: IUserInfo = await UserInfo.findById(req.userInfoId).select('-password')
    res.json({ hasErrors: false, payload: userInfo })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server_Error')
  }
})

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post(
  '/',
  [
    check('username', 'Invalid_Username').isLength({ min: 3, max: 10 }),
    check('password', 'Missing_Password').exists()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }

    const { username, password } = req.body
    try {
      const userInfo: IUserInfo = await UserInfo.findOne({ username }).exec()

      if (!userInfo) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Invalid_Credentials'
            }
          ]
        })
      }

      const isMatch = await bcrypt.compare(password, userInfo.password)

      if (!isMatch) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          hasErrors: true,

          errors: [
            {
              msg: 'Invalid_Credentials'
            }
          ]
        })
      }

      let isEmpty = true
      let isPending = true
      if (userInfo.role === 'SUPPLIER') {
        const supplier: ISupplier = await Supplier.findOne({ userInfo: userInfo._id })
        if (supplier) isEmpty = false
        if (supplier && !supplier.pending) isPending = false
      } else if (userInfo.role === 'USER') {
        const user: IUser = await User.findOne({ userInfo: userInfo._id })
        if (user) isEmpty = false
        if (user && !user.pending) isPending = false
      } else if (userInfo.role === 'ADMIN') {
        isEmpty = false
        isPending = false
      }

      if (isEmpty) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
          hasErrors: true,
          errors: [
            {
              msg: 'Did not find the user linked to the userInfo provided'
            }
          ]
        })
      }

      if (isPending) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
          hasErrors: true,
          errors: [
            {
              param: 'pending',
              msg: 'Your registration is still under revision'
            }
          ]
        })
      }
      userInfo.activeSessions += 1
      await userInfo.save()
      const payload: Payload = {
        userInfoId: userInfo.id,
        role: userInfo.role
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: config.get('jwtExpiration') },
        (err, token) => {
          if (err) throw err
          res.json({ hasErrors: false, payload: { token, role: userInfo.role } })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server_Error')
    }
  }
)

// @route   POST api/auth/logout
// @desc    logout user
// @access  Public
router.put(
  '/logout', auth,
  async (req: Request, res: Response) => {
    try {
      const userInfo: IUserInfo = await UserInfo.findById(req.userInfoId).exec()
      userInfo.activeSessions -= 1
      userInfo.lastConnection = new Date()
      await userInfo.save()
      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server_Error')
    }
  }
)

export default router
