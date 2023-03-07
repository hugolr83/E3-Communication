import { Document, Model, model, Schema } from 'mongoose'
import Ad, { IAd } from './Ad'
import User, { IUser } from './User'
/**
 * Interface to model the Transaction Schema for TypeScript.
 * @param buyer:User
 * @param ad: ID of Ad 
 * @param createdAt:Date
 */

export interface ITransaction extends Document {
    buyer: IUser['_id'];
    ad: IAd['_id'];
    createdAt: Date
}

const TransactionSchema: Schema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    ad: {
        type: Schema.Types.ObjectId,
        ref: Ad,
        required: true
    }
}
    ,
    {
        timestamps: true
    }
)

const Transaction: Model<ITransaction> = model('Transaction', TransactionSchema)

export default Transaction
