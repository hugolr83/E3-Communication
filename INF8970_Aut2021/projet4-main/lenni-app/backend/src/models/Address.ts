import { Document, Model, model, Schema } from 'mongoose'

/**
 * Interface to model the Address Schema for TypeScript.
 * @param street:string
 * @param city:string
 * @param province:date
 * @param postalCode: string
 */
export interface IAddress extends Document {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

const AddressSchema: Schema = new Schema({
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
})

const Address: Model<IAddress> = model('Address', AddressSchema)

export default Address
