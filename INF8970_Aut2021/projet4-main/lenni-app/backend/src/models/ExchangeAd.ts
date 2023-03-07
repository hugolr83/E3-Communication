import { Document, Model, model, Schema } from 'mongoose'
import Supplier, { ISupplier } from './Supplier'
import User, { IUser } from './User'
/**
 * Interface to model the ExchangeAd Schema for TypeScript.
 * @param seller:User
 * @param supplierFrom:Supplier
 * @param pointsFrom:number
 * @param supplierTo:Supplier
 * @param pointsTo:number
 * @param createdAt: Date
 */
export interface IExchangeAd extends Document {
  seller: IUser['_id'];
  supplierFrom: ISupplier['_id'];
  pointsFrom: number,
  supplierTo: ISupplier['_id'];
  pointsTo: number,
  createdAt: Date,
  IDValidationPending: boolean
}

const ExchangeAdSchema: Schema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  supplierFrom: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  pointsFrom: {
    type: Number,
    required: true
  },
  supplierTo: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  pointsTo: {
    type: Number,
    required: true
  },
  IDValidationPending: {
    type: Boolean,
    required: true
  }

},
{
  timestamps: true
})

const ExchangeAd: Model<IExchangeAd> = model('ExchangeAd', ExchangeAdSchema)

export default ExchangeAd
