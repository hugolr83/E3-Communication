import { Document, Model, model, Schema } from 'mongoose'
import Address, { IAddress } from './Address'
import UserInfo, { IUserInfo } from './UserInfo'

/**
 * Interface to model the Supplier Schema for TypeScript.
 * @param businessName:string
 * @param businessNumber:string
 * @param pointsToLennis:string
 * @param dollarsToPoints:string
 * @param pointsToDollars:string
 * @param address:IAddress
 * @param userInfo: IUserInfo
 * @param pending: boolean
 */
export interface ISupplier extends Document {
  businessName: string;
  businessNumber: Number;
  pointsToLennis: Number;
  dollarsToPoints: Number;
  pointsToDollars: Number;
  address: IAddress['_id'];
  userInfo: IUserInfo['_id'];
  pending: boolean;
}

const supplierSchema: Schema = new Schema({

  businessName: {
    type: String,
    required: true
  },
  businessNumber: {
    type: Number,
    required: true
  },
  pointsToLennis: {
    type: Number,
    required: true
  },

  dollarsToPoints: {
    type: Number,
    required: true
  },
  pointsToDollars: {
    type: Number,
    required: true
  },
  address: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: Address
  },
  userInfo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: UserInfo
  },
  pending: {
    type: Boolean,
    required: true
  }
},
{
  timestamps: true
})

const Supplier: Model<ISupplier> = model('Supplier', supplierSchema)

export default Supplier
