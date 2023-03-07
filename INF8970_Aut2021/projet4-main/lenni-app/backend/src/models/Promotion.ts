import { Document, Model, model, Schema } from 'mongoose'
import Supplier, { ISupplier } from './Supplier'


/**
 * Interface to model the Promotion Schema for TypeScript.
 * @param supplier:ISupplier
 * @param oldPointsToLennis:number
 * @param oldDollarsToPoints:number
 * @param oldPointsToDollars:number
 * @param newPointsToLennis:number
 * @param newDollarsToPoints:number
 * @param newPointsToDollars:number
 * @param currentDate:date
 * @param expirationDate:date
 * @param active:boolean
 */
export interface IPromotion extends Document {
  supplier: ISupplier;
  oldPointsToLennis: Number;
  oldDollarsToPoints: Number;
  oldPointsToDollars: Number;
  newPointsToLennis: Number;
  newDollarsToPoints: Number;
  newPointsToDollars: Number;
  currentDate: Date;
  expirationDate: Date;
  active: boolean
}

const promotionSchema: Schema = new Schema({

  supplier: { 
    type: Schema.Types.ObjectId,
    required: true,
    ref: Supplier
  },
  oldPointsToLennis: {
    type: Number,
    required: true
  },
  oldDollarsToPoints: {
    type: Number,
    required: true
  },
  oldPointsToDollars: {
    type: Number,
    required: true
  },
  newPointsToLennis: {
    type: Number,
    required: true
  },
  newDollarsToPoints: {
    type: Number,
    required: true
  },
  newPointsToDollars: {
    type: Number,
    required: true
  },
  currentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  expirationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  active:{
    type: Boolean,
    required: true,
    default: false 
  }
})

const Promotion: Model<IPromotion> = model('Promotion', promotionSchema)

export default Promotion
