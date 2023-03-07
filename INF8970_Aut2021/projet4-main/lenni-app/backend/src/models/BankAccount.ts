import { Document, Model, model, Schema } from 'mongoose'

/**
 * Interface to model the BankAccount Schema for TypeScript.
 * @param bankInstitution:number
 * @param branchNumber:number
 * @param accountNumber:number
 */
export interface IBankAccount extends Document {
    bankInstitution: Number;
    branchNumber: Number;
    accountNumber: Number;
}

const BankAccountSchema: Schema = new Schema({
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
})

const BankAccount: Model<IBankAccount> = model('BankAccount', BankAccountSchema)

export default BankAccount
