import { Document, Model, model, Schema } from 'mongoose'
import Supplier, { ISupplier } from './Supplier'
import User, { IUser } from './User'
/**
 * Interface to model the Transfer Schema for TypeScript.
 * @param client:User
 * @param supplierA:Supplier
 * @param supplierB:Supplier
 * @param TransferredPointsFromA:number
 * @param pointsToLennisA:number
 * @param pointsToLennisB:number
 */
export interface ITransfer extends Document {
  client: IUser['_id'];
  supplierA: ISupplier['_id'];
  supplierB: ISupplier['_id'];
  transferredPointsFromA: number,
  pointsToLennisA: number,
  pointsToLennisB: number,
  createdAt: Date
}

const TransferSchema: Schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  supplierA: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  supplierB: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  transferredPointsFromA: {
    type: Number,
    required: true
  },
  pointsToLennisA: {
    type: Number,
    required: true
  },
  pointsToLennisB: {
    type: Number,
    required: true
  }

}
,
{
  timestamps: true
}
)

const Transfer: Model<ITransfer> = model('Transfer', TransferSchema)

export default Transfer
