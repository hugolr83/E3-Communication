import { Document, Model, model, Schema } from 'mongoose'
import Supplier, { ISupplier } from './Supplier'
import User, { IUser } from './User'
/**
 * Interface to model the Points Schema for TypeScript.
 * @param quantity:number
 * @param supplier:Supplier
 * @param user:User
 */
export interface IPoints extends Document {
  quantity: number;
  supplier: ISupplier['_id'];
  user: IUser['id'];
}

const pointsSchema: Schema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: Supplier,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  }

})

const Points: Model<IPoints> = model('Points', pointsSchema)

export default Points
