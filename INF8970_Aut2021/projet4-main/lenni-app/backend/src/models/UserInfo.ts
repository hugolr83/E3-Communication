import { Document, Model, model, Schema } from 'mongoose'

/**
 * Interface to model the UserInfo Schema for TypeScript.
 * @param username:string
 * @param password:string
 * @param registrationDate:date
 * @param lastConnection:date
 * @param email: string
 * @param activeSessions: string
 */
export interface IUserInfo extends Document {
  email: string;
  username: string;
  password: string;
  role: string;
  question: string;
  answer: string;
  registrationDate: Date;
  activeSessions:number;
  lastConnection: Date;
  secondAuthChoice: number;
  otp: string;
  phone: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    required: true,
    type: String
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'User'
  },
  question: {
    required: false,
    type: Number,
  },
  answer: {
    type: String,
    required: false
  },
  activeSessions: {
    type: Number,
    required: true,
    default: 0
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastConnection: {
    type: Date,
    required: true,
    default: Date.now
  },
  secondAuthChoice: {
    type: Number,
    required: true,
    default: 0
  },
  otp: {
    required: false,
    type: String
    },
  phone: {
    type: String,
    required: false
  }
})

const UserInfo: Model<IUserInfo> = model('UserInfo', userSchema)

export default UserInfo
