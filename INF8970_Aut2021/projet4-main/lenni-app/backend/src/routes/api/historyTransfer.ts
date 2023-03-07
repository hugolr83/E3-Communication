import { Response, Router } from 'express'
import HttpStatusCodes from 'http-status-codes'
import Request from '../../types/Request'
import User, { IUser } from '../../models/User'
import auth from '../../middleware/auth'
import Transfer, { ITransfer } from '../../models/Transfer'
import UserInfo, { IUserInfo } from './../../models/UserInfo'
import { ObjectId } from 'mongoose'
import Supplier, { ISupplier } from './../../models/Supplier'

const router: Router = Router()

// @route   GET api/transfers/supplier
// @desc    Get all transfers for supplier
// @access  Public
router.get(
  '/supplier', auth,
  async (req: Request, res: Response) => {
    try {
      console.log('GET TRANSFERS FOR SUPPLIER')
      const userInfoObject: IUserInfo = await UserInfo.findById(req.userInfoId)
      const userInfo: ObjectId = userInfoObject._id
      const supplier: ISupplier = await Supplier.findOne({ userInfo })
      console.log(supplier)
      const supplierID: ObjectId = supplier._id
      const transfers: Array<ITransfer> = await Transfer.find()
      console.log(transfers)
      const transfersData: Array<Object> = []
      for (const transfer of transfers) {
        if (supplierID.toString() === transfer.supplierA.toString()) {
          console.log('Supplier A')
          const supplierIDB: ObjectId = transfer.supplierB
          const clientUserID: IUser = await User.findById(transfer.client)
          let username = '-'
          if (clientUserID) {
            const clientUserInfo:IUserInfo = await UserInfo.findById(clientUserID.userInfo)
            username = clientUserInfo.username
          }
          const supplierB: ISupplier = await Supplier.findById(supplierIDB)
          transfersData.push({ pointsAreOwed: true, username: username, supplier: supplierB ? supplierB.businessName : '-', transferredPoints: transfer.transferredPointsFromA, pointsToLennis: transfer.pointsToLennisB, timestamp: transfer.createdAt })
        } else if (supplierID.toString() === transfer.supplierB.toString()) {
          console.log('Supplier B')
          const supplierIDA: ObjectId = transfer.supplierA
          const clientUserID: IUser = await User.findById(transfer.client)
          let username = '-'
          if (clientUserID) {
            const clientUserInfo:IUserInfo = await UserInfo.findById(clientUserID.userInfo)
            username = clientUserInfo.username
          }
          const supplierA: ISupplier = await Supplier.findById(supplierIDA)

          const transferredPoint: number = transfer.transferredPointsFromA
          const factorA: number = transfer.pointsToLennisA
          const factorB: number = transfer.pointsToLennisB
          const transferredPointsScaled: any = Math.round((transferredPoint * factorA) / factorB)
          transfersData.push({ pointsAreOwed: false, username: username, supplier: supplierA ? supplierA.businessName : '-', transferredPoints: transferredPointsScaled, pointsToLennis: transfer.pointsToLennisA, timestamp: transfer.createdAt })
        }
      }

      res.json({ has_error: false, payload: transfersData })
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

export default router
