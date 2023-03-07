import { Document, Model, model, ObjectId, Schema } from 'mongoose'
import User, { IUser } from './User'

/**
 * Interface to model the Funding Schema for TypeScript.
 * @param clientID: ObjectId
 * @param amount:number
 * @param billingAddress:Object
 * @param paymentInfo: Object
 */
export interface IFunding extends Document {
  clientID: IUser['_id'],
  amount:Number,

  billingAddress:{
      street: String,
      city: String,
      province: String,
      postalCode: String,
    },
  paymentInfo:{
    paymentMode: Number
    creditCard: {
      cardHolderFirstname: String,
      cardHolderLastname: String,
      cardNumber: Number,
      expirationDate: Date,
      CVV: Number,
    },
    bankAccount: {
      bankInstitution: Number,
      branchNumber: Number,
      accountNumber: Number,
    }
  },
  createdAt: Date

}

const fundingSchema: Schema = new Schema({
  clientID: {
    type: Schema.Types.ObjectId,
    ref: User
  },
  amount: {
    type: Number,
    required: true
  },
  billingAddress: {
    type: Object,
    required: true,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  paymentInfo:
  {
    type: Object,
    required: true,
    paymentMode: {
      type: Schema.Types.Number,
      required: true
    },
    creditCard: {
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
    },
    bankAccount: {
      bankInstitution: {
        type: Number,
        required: true
      },
      branchNumber: {
        type: Number,
        required: true
      },
      accountNumber: {
        type: Number,
        required: true
      }
    }
  }
},
{
  timestamps: true
})

const Funding: Model<IFunding> = model('Funding', fundingSchema)

export default Funding
