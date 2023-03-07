import { Document, Model, model, Schema } from 'mongoose'
import Promotion, { IPromotion } from './Promotion'

/**
 * Interface to model the PromotionHistory Schema for TypeScript.
 * @param promotion:IPromotion
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
export interface IPromotionHistory extends Document {
  promotion: IPromotion;
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

const promotionHistorySchema: Schema = new Schema({

  promotion: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: Promotion
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
  active: {
    type: Boolean,
    required: true,
    default: false
  }
})

const PromotionHistory: Model<IPromotionHistory> = model('PromotionHistory', promotionHistorySchema)

export default PromotionHistory
