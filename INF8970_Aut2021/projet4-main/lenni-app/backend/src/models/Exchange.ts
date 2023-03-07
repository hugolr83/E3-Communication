import { Document, Model, model, Schema } from 'mongoose'
import ExchangeAd, { IExchangeAd } from './ExchangeAd'
import User, { IUser } from './User'
/**
 * Interface to model the Exchange Schema for TypeScript.
 * @param buyer:User
 * @param ad: exchange ad
 * @param createdAt: Date
 */
export interface IExchange extends Document {
  buyer: IUser['_id'];
  ad: IExchangeAd['_id'];
  createdAt: Date
}

const ExchangeSchema: Schema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  ad: {
    type: Schema.Types.ObjectId,
    ref: ExchangeAd,
    required: true
  }
}
  ,
  {
    timestamps: true
  }
)

const Exchange: Model<IExchange> = model('Exchange', ExchangeSchema)

export default Exchange
