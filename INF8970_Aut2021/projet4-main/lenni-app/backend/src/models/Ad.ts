import { Document, Model, model, Schema } from 'mongoose'
import Supplier, { ISupplier } from './Supplier'
import User, { IUser } from './User'
/**
 * Interface to model the Ad Schema for TypeScript.
 * @param client:User
 * @param supplier:Supplier
 * @param points:number
 * @param price:number
 * @param createdAt: Date
 */
export interface IAd extends Document {
  client: IUser['_id'];
  supplier: ISupplier['_id'];
  points: number,
  price: number,
  createdAt: Date
}

const AdSchema: Schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }

},
  {
    timestamps: true
  })

const Ad: Model<IAd> = model('Ad', AdSchema)

export default Ad
