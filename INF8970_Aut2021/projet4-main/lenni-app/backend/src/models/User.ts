import { Document, Model, model, Schema } from 'mongoose'
import UserInfo, { IUserInfo } from './UserInfo'
import Address, { IAddress } from './Address'

/**
 * Interface to model the User Schema for TypeScript.
 * @param firstname:string
 * @param lastname:string
 * @param funds:number
 * @param address: Address
 * @param userInfo: UserInfo
 * @param paymentInfo:PaymentInfo
 */
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  funds: number;
  userInfo: IUserInfo['_id'];
  paymentMode: Number;
  paymentInfo: Schema.Types.ObjectId
  pending: boolean
  address: IAddress['_id'];
}

const userSchema: Schema = new Schema({

  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  funds: {
    type: Number,
    required: true
  },
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: UserInfo,
    required: true
  },
  paymentMode: {
    type: Schema.Types.Number,
    required: true
  },
  paymentInfo: {
    type: Schema.Types.ObjectId,
    required: false
  },
  pending: {
    type: Schema.Types.Boolean,
    required: true
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: Address,
    required: true
  }
},
{
  timestamps: true
})

const User: Model<IUser> = model('User', userSchema)

export default User
