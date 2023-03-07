import { Document, Model, model, Schema } from 'mongoose'

/**
 * Interface to model the CreditCard Schema for TypeScript.
 * @param cardHolderFirstname:string
 * @param cardHolderLastname:string
 * @param cardNumber:number
 * @param expirationDate:date
 * @param CVV: string
 */
export interface ICreditCard extends Document {
    cardHolderFirstname: string;
    cardHolderLastname: string;
    cardNumber: number;
    expirationDate: Date;
    CVV: number;
}

const CreditCardSchema: Schema = new Schema({
  cardHolderFirstname: {
    type: String,
    required: true
  },
  cardHolderLastname: {
    type: String,
    required: true
  },
  cardNumber: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  CVV: {
    type: Number,
    required: true
  }
})

const CreditCard: Model<ICreditCard> = model('CreditCard', CreditCardSchema)

export default CreditCard
