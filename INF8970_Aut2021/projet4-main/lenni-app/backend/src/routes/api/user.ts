import bcrypt from 'bcryptjs'
import { Router, Response } from 'express'
import { body, check, validationResult } from 'express-validator'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import User, { IUser } from '../../models/User'
import auth from '../../middleware/auth'
import UserInfo, { IUserInfo } from './../../models/UserInfo'
import CreditCard, { ICreditCard } from './../../models/CreditCard'
import { ObjectId } from 'mongoose'
import BankAccount, { IBankAccount } from './../../models/BankAccount'
import Address, { IAddress } from './../../models/Address'
import Supplier, { ISupplier } from './../../models/Supplier'
import Points, { IPoints } from './../../models/Points'
import Ad from './../../models/Ad'
import ExchangeAd from './../../models/ExchangeAd'
import Funding from './../../models/funding'
const router: Router = Router()

// @route   POST api/user/add
// @desc    create new client
// @access  Public
router.post(
  '/add',
  [
    check('lastname', 'Please include a valid lastname, must be more than 3 characters').isLength({ min: 3 }),
    check('firstname', 'Please include a valid firstname, must be more than 3 characters').isLength({ min: 3 }),
    check('username', 'Please include a valid username, must be between 3 and 10 characters').isLength({ min: 3, max: 10 }),
    check('password', 'Please include a valid password, must be more than 8 characters').isLength({ min: 8 }),
    check('email', 'Please include a valid email').normalizeEmail().isEmail(),
    check('phone', 'Please include a valid phone number').isLength({ min: 10}),
    check('funds', 'Please include a valid funds').isInt(),
    check('role', 'Please include a valid role').isLength({ min: 3 }),
    check('paymentMode', 'Please choose valid payment mode').isIn([0, 1, 2]),
    check('cardHolderFirstname', 'Please include valid firstname').if(body('paymentMode').equals('1')).isLength({ min: 3 }),
    check('cardHolderLastname', 'Please include valid lastname').if(body('paymentMode').equals('1')).isLength({ min: 3 }),
    check('cardNumber', 'Please include valid card number').if(body('paymentMode').equals('1')).isNumeric().isLength({ min: 16, max: 16 }),
    check('expirationDate', 'Please include valid expiration date').if(body('paymentMode').equals('1')).isDate(),
    check('CVV', 'Please include valid CVV').if(body('paymentMode').equals('1')).isNumeric().isLength({ min: 3, max: 3 }),
    check('bankInstitution', 'Please include valid bank institution number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 3, max: 3 }),
    check('branchNumber', 'Please include valid branch number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 5, max: 5 }),
    check('accountNumber', 'Please include valid account number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 7, max: 12 }),
    check('street', 'Please include valid street').isLength({ min: 3 }),
    check('city', 'Please include valid city').isLength({ min: 3 }),
    check('province', 'Please include valid province').isLength({ min: 2 }),
    check('postalCode', 'Please include valid postal code').isLength({ min: 6, max: 6 }),
    check('question', 'Please include valid question').isInt(),
    check('secondAuthChoice', 'Please include valid choice for auth').isInt()
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
      lastname, firstname, username, password, email, phone, funds, role, paymentMode, cardHolderFirstname,
      cardHolderLastname, cardNumber, expirationDate, CVV, bankInstitution, branchNumber, accountNumber,
      city, street, postalCode, province, question, answer, secondAuthChoice
    } = req.body

    const user: IUserInfo = await UserInfo.findOne({ email })

    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        hasErrors: true,
        errors: [
          {
            msg: 'email Already Taken',
            param: 'email'
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
            msg: 'user Already Taken',
            param: 'username'
          }
        ]
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    const pending: boolean = true
    const address: IAddress = await Address.create({ city, street, postalCode, province })
    try {
      var newUser = {}
      if (secondAuthChoice == 2) {
        var listOTP = new Array()
        var encodedOTP = [];
        for (let i = 0; i < 10; i++) {
          const code = Math.floor(100000 + Math.random() * 900000);
          listOTP[listOTP.length] = code;
          const saltOtp = await bcrypt.genSalt(10);
          const hashedOtp = await bcrypt.hash(code.toString(), saltOtp);
          encodedOTP[encodedOTP.length] = hashedOtp;
        }
        newUser = { username, email, role, password: hashed, question, answer, secondAuthChoice: secondAuthChoice, otp: encodedOTP.toString(), phone: phone} 
        const response = await fetch('http://authserver:5000/twilio/sendOtp', {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({list: listOTP, email: email, name: username}),
          referrerPolicy: 'no-referrer'
        })
        const res2 = await response.json()
          if (res2.errors) {
            res.json( { hasErrors: true, errors: res2.errors, type: res2.type })
          }   
      } else {
        newUser = { username, email, role, password: hashed, question, answer, secondAuthChoice: secondAuthChoice, phone: phone }
      }
      const userInfo: IUserInfo = await UserInfo.create(newUser)
      if (paymentMode === 0) {
        await User.create({ lastname, firstname, funds, userInfo, paymentMode, pending, address })
      } else if (paymentMode === 1) {
        const creditCard: ICreditCard = await CreditCard.create({ cardHolderFirstname, cardHolderLastname, cardNumber, expirationDate, CVV })
        const paymentInfo: ObjectId = creditCard._id
        await User.create({ lastname, firstname, funds, userInfo, paymentMode, paymentInfo, pending, address })
      } else if (paymentMode === 2) {
        const bankAccount: IBankAccount = await BankAccount.create({ bankInstitution, branchNumber, accountNumber })
        const paymentInfo: ObjectId = bankAccount._id

        await User.create({ lastname, firstname, funds, userInfo, paymentMode, paymentInfo, pending, address })
      }
      res.json({ hasErrors: false })
    } catch (err) {
      console.error(err.message)
      await UserInfo.findOneAndRemove({ email })
      const addressId: ObjectId = address._id

      await Address.findOneAndRemove({ addressId })
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
    }
  }
)
// @route   POST api/user/validatePaymentInfo
// @desc    Post to validate payment information
// @access  Public
router.post(
  '/validatePaymentInfo',
  [
    check('paymentMode', 'Please choose valid payment mode').isIn([0, 1, 2]),
    check('cardHolderFirstname', 'Please include valid firstname').if(body('paymentMode').equals('1')).isLength({ min: 3 }),
    check('cardHolderLastname', 'Please include valid lastname').if(body('paymentMode').equals('1')).isLength({ min: 3 }),
    check('cardNumber', 'Please include valid card number').if(body('paymentMode').equals('1')).isNumeric().isLength({ min: 16, max: 16 }),
    check('expirationDate', 'Please include valid expiration date').if(body('paymentMode').equals('1')).isDate(),
    check('CVV', 'Please include valid CVV').if(body('paymentMode').equals('1')).isNumeric().isLength({ min: 3, max: 3 }),
    check('bankInstitution', 'Please include valid bank institution number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 3, max: 3 }),
    check('branchNumber', 'Please include valid branch number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 5, max: 5 }),
    check('accountNumber', 'Please include valid account number').if(body('paymentMode').equals('2')).isNumeric().isLength({ min: 7, max: 12 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    res.json({ hasErrors: false })
  }
)

// @route   POST api/user/validateAddress
// @desc    Post to validate address
// @access  Public
router.post(
  '/validateAddress',
  [
    check('street', 'Please include valid street').isLength({ min: 3 }),
    check('city', 'Please include valid city').isLength({ min: 3 }),
    check('province', 'Please include valid province').isLength({ min: 2 }),
    check('postalCode', 'Please include valid postal code').isLength({ min: 6, max: 6 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    res.json({ hasErrors: false })
  }
)

// @route   GET api/user/all
// @desc    Get all clients
// @access  Public
router.get('/all', async (req: Request, res: Response) => {
  try {
    const users: Array<IUser> = await User.find()
    const usersData: Array<Object> = []
    for (const user of users) {
      const userInfoId: ObjectId = user.userInfo
      const userInfo: IUserInfo = await UserInfo.findById(userInfoId)
      if (userInfo) {
        const adresseId: ObjectId = user.address
        const address: IAddress = await Address.findById(adresseId)
        usersData.push({
          userID: user._id,
          lastname: user.lastname,
          firstname: user.firstname,
          funds: user.funds,
          paymentMode: user.paymentMode,
          userInfo: {
            email: userInfo.email,
            username: userInfo.username,
            role: userInfo.role,
            question: userInfo.question,
            answer: userInfo.answer,
            registrationDate: userInfo.registrationDate,
            lastConnection: userInfo.lastConnection,
            activeSessions: userInfo.activeSessions,
            secondAuthChoice: userInfo.secondAuthChoice
          }, address: {
            street: address.street,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode
          }, pending: user.pending })
      }
    }
    res.json({ has_error: false, payload: usersData })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})
// @route   GET api/user/current
// @desc    Get curent client
// @access  Public
router.get('/current', auth, async (req: Request, res: Response) => {
  try {
    const clientObject = await User.findOne({ userInfo: req.userInfoId }).populate('address').populate('userInfo')

    if (clientObject) {

      const clientId: ObjectId = clientObject._id
      const points: Array<IPoints> = await Points.find({ user: clientId })
      const clientPointsInfo: Array<Object> = []
      for (const point of points) {
        const supplierID: ObjectId = point.supplier
        const supplier: ISupplier = await Supplier.findById(supplierID)
        clientPointsInfo.push({
          supplierID: supplier._id,
          supplier: supplier.businessName,
          quantity: point.quantity,
          pointsToLennis: supplier.pointsToLennis
        })
      }
      let clientState = {}
      if (clientObject.paymentMode === 0) {
        clientState = {
          firstname: clientObject.firstname,
          lastname: clientObject.lastname,
          clientId: clientObject._id,
          funds: clientObject.funds,
          userInfo: clientObject.userInfo,
          points: clientPointsInfo,
          address: clientObject.address,
          paymentInfo: {
            paymentMode: clientObject.paymentMode,
            creditCard: { 
              cardHolderFirstname: '',
              cardHolderLastname: '',
              cardNumber: '',
              expirationDate: '',
              CVV: '' },
            bankAccount: {
              bankInstitution: '',
              branchNumber: '',
              accountNumber: ''
            } } }
      } else if (clientObject.paymentMode === 1) {
        const creditCard:ICreditCard = await CreditCard.findById(clientObject.paymentInfo)
        clientState = {
          firstname: clientObject.firstname,
          lastname: clientObject.lastname,
          clientId: clientObject._id,
          funds: clientObject.funds,
          userInfo: clientObject.userInfo,
          points: clientPointsInfo,
          address: clientObject.address,
          paymentInfo: {
            paymentMode: clientObject.paymentMode,
            creditCard: creditCard,
            bankAccount: {
              bankInstitution: '',
              branchNumber: '',
              accountNumber: '' 
            } } }
      } else if (clientObject.paymentMode === 2) {
        const bankAccount:IBankAccount = await BankAccount.findById(clientObject.paymentInfo)
        clientState = {
          firstname: clientObject.firstname,
          lastname: clientObject.lastname,
          clientId: clientObject._id,
          funds: clientObject.funds,
          userInfo: clientObject.userInfo,
          points: clientPointsInfo,
          address: clientObject.address,
          paymentInfo: {
            paymentMode: clientObject.paymentMode,
            creditCard: {
              cardHolderFirstname: '',
              cardHolderLastname: '',
              cardNumber: '',
              expirationDate: '',
              CVV: ''
            },
            bankAccount: bankAccount } }
      }
      res.json({ has_error: false, payload: clientState })
    } else {
      const clientState = { }
      res.json({ has_error: false, payload: clientState })
    }
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   UPDATE api/user/update
// @desc    update client with :id
// @access  Public
router.post('/update/:id', auth,
  async (req: Request, res: Response) => {
    try {
        console.log(req.params.id)
        const clientObject = await User.findById(req.params.id).populate('userInfo');
        console.log(clientObject)
        const secondAuthChoice = clientObject.userInfo.secondAuthChoice;
        if (secondAuthChoice == 1){
          res.status(400).send("Cannot update client using TOTP");
          return;
        }
        const user = User.findByIdAndUpdate(req.params.id, { pending: false },
          function (err, result) {
            if (err) {
              res.status(404).send('Did not find user')
            } else {
              res.json({ has_errors: false })
            }
          })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })




// @route   UPDATE api/user/updateCurrent
// @desc    update current client with new informations
// @access  Public
router.post('/updateCurrent', auth,
  [
    check('lastname', 'Please include a valid lastname').isLength({ min: 3 }),
    check('firstname', 'Please include a valid firstname').isLength({ min: 3 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ hasErrors: true, errors: errors.array() })
    }
    try {
      const newClient = req.body
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

      let paymentInfo:ObjectId = client.paymentInfo
      if (client.paymentMode === newClient.paymentInfo.paymentMode) {
        if (client.paymentMode === 1) {
          await CreditCard.findByIdAndUpdate(client.paymentInfo, newClient.paymentInfo.creditCard)
        } else if (client.paymentMode === 2) {
          await BankAccount.findByIdAndUpdate(client.paymentInfo, newClient.paymentInfo.bankAccount)
        }
      } else {
        if (client.paymentMode === 1) {
          await CreditCard.findByIdAndDelete(client.paymentInfo)
        } else if (client.paymentMode === 2) {
          await BankAccount.findByIdAndDelete(client.paymentInfo)
        }
        if (newClient.paymentInfo.paymentMode === 1) {
          const creditCard: ICreditCard = await CreditCard.create({
            cardHolderFirstname: newClient.paymentInfo.creditCard.cardHolderFirstname,
            cardHolderLastname: newClient.paymentInfo.creditCard.cardHolderLastname,
            cardNumber: newClient.paymentInfo.creditCard.cardNumber,
            expirationDate: newClient.paymentInfo.creditCard.expirationDate,
            CVV: newClient.paymentInfo.creditCard.CVV
          })
          paymentInfo = creditCard._id
        } else if (newClient.paymentInfo.paymentMode === 2) {
          const bankAccount: IBankAccount = await BankAccount.create({
            bankInstitution: newClient.paymentInfo.bankAccount.bankInstitution,
            branchNumber: newClient.paymentInfo.bankAccount.branchNumber,
            accountNumber: newClient.paymentInfo.bankAccount.accountNumber
          })
          paymentInfo = bankAccount._id
        } else if (newClient.paymentInfo.paymentMode === 0) {
          await CreditCard.findByIdAndDelete(client.paymentInfo)
          await BankAccount.findByIdAndDelete(client.paymentInfo)
        }
      }
      await Address.findByIdAndUpdate(client.address, newClient.address)
      await User.findByIdAndUpdate(client._id, { lastname: newClient.lastname, firstname: newClient.firstname, paymentMode: newClient.paymentInfo.paymentMode, paymentInfo: paymentInfo })
      res.json({ has_errors: false })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   DELETE api/user/delete
// @desc    Delete client with :id
// @access  Public
router.delete('/delete/:id',
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
      const userInfoId: ObjectId = user.userInfo
      await UserInfo.findByIdAndDelete(userInfoId)
      const addressId: ObjectId = user.address
      await Address.findByIdAndDelete(addressId)
      if (user.paymentMode === 1) {
        const creditCardId: ObjectId = user.paymentInfo
        await CreditCard.findByIdAndDelete(creditCardId)
      } else if (user.paymentMode === 2) {
        const bankAccountID: ObjectId = user.paymentInfo
        await BankAccount.findByIdAndDelete(bankAccountID)
      }
      const points = await Points.find({ user: user._id })
      for (const point of points) {
        await Points.findByIdAndDelete(point._id)
      }
      const fundings = await Funding.find({ clientID: user._id })
      for (const funding of fundings) {
        await Funding.findByIdAndDelete(funding._id)
      }

      // Delete unbought transaction ads
      const unboughtAds = await Ad.aggregate([
        {
          $match: { client: user._id }
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

      // Delete unbought exchange ads
      const unboughtExchangeAds = await ExchangeAd.aggregate([
        {
          $match: { seller: user._id }
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

      await User.findByIdAndDelete(req.params.id)
      res.json({ has_errors: false, payload: user })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   GET api/user/points
// @desc    Get client's points
// @access  Public
router.get('/points', auth, async (req: Request, res: Response) => {
  try {
    const client: IUser = await User.findOne({ userInfo: req.userInfoId })
    const clientID: ObjectId = client._id

    const points = await Points.find({
      $and: [
        { quantity: { $gt: 0 } },
        { user: clientID }
      ]
    }).populate('supplier')

    const pointsData: Array<Object> = Array()
    for (const point of points) {
      pointsData.push({
        supplier: point.supplier.businessName,
        supplierID: point.supplier._id,
        quantity: point.quantity,
        pointsToLennis: point.supplier.pointsToLennis,
        pointsToDollars: point.supplier.pointsToDollars
      })
    }
    res.json({ has_error: false, payload: pointsData })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   GET api/user/points/:id
// @desc    Get client points with id
// @access  Public
router.get('/points/byUser/:id', auth, async (req: Request, res: Response) => {
  try {
    const clientObject: IUser = await User.findById(req.params.id)
    const clientId: ObjectId = clientObject._id
    if (clientId) {
      const points: Array<IPoints> = await Points.find({ user: clientId })
      const clientPointsInfo: Array<Object> = []
      for (const point of points) {
        const supplierID: ObjectId = point.supplier
        const supplier: ISupplier = await Supplier.findById(supplierID)
        clientPointsInfo.push({ supplierID: supplier._id, supplier: supplier.businessName, quantity: point.quantity, pointsToLennis: supplier.pointsToLennis })
      }
      res.json({ has_error: false, payload: clientPointsInfo })
    } else {
      res.json({ has_error: false, payload: null })
    }
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
  }
})

// @route   GET api/user/funds
// @desc    Get client's funds
// @access  Public
router.get('/funds', auth, async (req: Request, res: Response) => {
  try {
    const client: IUser = await User.findOne({ userInfo: req.userInfoId })

    res.json({ has_error: false, payload: client.funds })
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   POST api/user/verifyOTP
// @desc    Verify if the OTP is correct
// @access  Public
router.post('/verifyOTP', auth, async (req: Request, res: Response) => {
  try {
    const client: IUserInfo = await UserInfo.findOne({ _id: req.userInfoId })

    const array = client.otp.split(",");
    let index = -1
    for (let i = 0; i < array.length; i++) {
      const isMatch = await bcrypt.compare(req.body.code, array[i])
      if(isMatch) {
        index = i
        break
      }
    }

    if (index > -1) {
      array.splice(index, 1);
      const user = UserInfo.findByIdAndUpdate(req.userInfoId, { otp: array.toString() },
      function (err, result) {
        if (err) {
          res.status(404).send('Did not found user')
        } else {
          console.log("Valid password")
          res.json({ has_errors: false, value: array })
        }
      })
    }
    else{
      console.log("Invalid password");
      res.json({ has_errors: true, message: "Invalid password"});
    }

  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }
})

// @route   POST api/user/generateOTP
// @desc    Generate a new OTP list
// @access  Public
router.post('/generateOTP', auth, async (req: Request, res: Response) => {
  try {
    var listOTP = new Array()
    var encodedOTP = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.floor(100000 + Math.random() * 900000);
      listOTP[listOTP.length] = code;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(code.toString(), salt);
      encodedOTP[encodedOTP.length] = hashed;
    }


    const client = await UserInfo.findByIdAndUpdate(req.userInfoId, {otp: encodedOTP.toString()});

    const response = await fetch('http://authserver:5000/twilio/sendOtp', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({list: listOTP, email: client.email, name: client.username}),
      referrerPolicy: 'no-referrer'
    })
    const res2 = await response.json()
    if (res2.errors) {
      res.json( { hasErrors: true, errors: res2.errors, type: res2.type })
    }
    res.status(200).send({status:'Sent'})
  } catch (err) {
    console.error(err.message)
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error: ' + err.message)
  }    
})

export default router
