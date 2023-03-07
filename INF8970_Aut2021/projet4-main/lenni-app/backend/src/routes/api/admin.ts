import bcrypt from 'bcryptjs'
import { Router, Response } from 'express'
import { check, validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import UserInfo, { IUserInfo } from '../../models/UserInfo'

const router: Router = Router()

// @route   POST api/admin/add
// @desc    Post admin
// @access  Public
router.post(
  '/add',
  [
    check('username', 'Please include a valid username, must be between 3 and 10 characters').isLength({ min: 3, max: 10 }),
    check('password', 'Please include a valid password').isLength({ min: 5 }),
    check('email', 'Please include a valid email').normalizeEmail().isEmail()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }

    console.log('here->>', req.body)
    // eslint-disable-next-line no-unused-vars
    const { username, password, email } = req.body

    const user: IUserInfo = await UserInfo.findOne({ email })
    console.log('🚀 ~ email', email)
    console.log('🚀 ~ user', user)

    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'email Already Taken'
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
            msg: 'user Already Taken'
          }
        ]
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    try {
      const userInfo: IUserInfo = await UserInfo.create({ username, email, role: 'ADMIN', password: hashed })
      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
export default router
