/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

export interface IPromotion {
  _id: string;
  supplierId:string;
  supplierBusinessName: string;
  supplierBusinnessNumber: number;
  oldPointsToLennis: number;
  oldDollarsToPoints: number;
  oldPointsToDollars: number;
  newPointsToLennis: number;
  newDollarsToPoints: number;
  newPointsToDollars: number;
  startDate: Date
  expirationDate: Date
}

export interface IFundingData {
  _id: string;
  client: string;
  amount: number;
  paymentInfo: IPaymentInfo;
  billingAddress: IAddress;
  timestamp: Date;
}
export interface ISupplierBalance{
  supplier: string,
  total: number
}
export interface IUserInfo {
  email: string;
  username: string;
  password: string;
  question: number;
  answer: string;
  secondAuthChoice: number;
  role: string;
  registrationDate: Date;
  lastConnection: Date,
  activeSessions:number;
}
export interface IPoints {
  supplier: string,
  quantity: number,
  supplierID: string,
  pointsToLennis: number,
  pointsToDollars: number
}
export interface ISupplierPoints {
  userID: string,
  lastname: string,
  firstname: string,
  username: string,
  quantity: number
}

export interface SupplierData {
  businessName: string;
  businessNumber: string;
  username: string;
  password: string;
  newPassword?: string,
  email: string;
  pointsToLennis: string;
  dollarsToPoints: string;
  pointsToDollars: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}
export interface IUser {

  userID: string,
  lastname: string,
  firstname: string,
  funds: number,
  paymentMode: number,
  userInfo: IUserInfo;
  address: IAddress;
  pending: Boolean
}

export interface ITransfer {
  _id: string;
  supplierIDA: string;
  supplierIDB: string;
  transferredPointsFromA: number,
  pointsToLennisA: number,
  pointsToLennisB: number,
  timestamp: Date;
}

export interface ITransferSupplier {
  pointsAreOwed: boolean,
  username: string,
  supplier: string,
  transferredPoints: number,
  pointsToLennis: number,
  timestamp: '',
}

export interface ITransferData {
  username: string;
  _id: string;
  supplierIDA: string;
  supplierIDB: string;
  transferredPointsFromA: number;
  pointsToLennisA: number;
  pointsToLennisB: number;
  transferredPointsToB: number;
  timestamp: Date;
}

export interface IClient {
  firstname: string;
  lastname: string;
  clientId: string;
  funds: number;
  userInfo: IUserInfo;
  address: IAddress;
  pending:Boolean;
  points: IPoints[];
  paymentInfo: IPaymentInfo;
}
export interface IPaymentInfo{
  paymentMode:number;
  bankAccount: IBankAccount;
  creditCard: ICreditCard;
}
export interface IBankAccount{
  bankInstitution: string;
  branchNumber: string;
  accountNumber: string
}
export interface ICreditCard{
  cardHolderFirstname: string;
  cardHolderLastname: string;
  cardNumber: string
  expirationDate: string;
  CVV: string
}

export interface ISuppliers {
  supplierID: string,
  businessName: string;
  businessNumber: string;
  pointsToLennis: number;
  dollarToPoints: number;
  pointsToDollars: number;
  address: IAddress;
  userInfo: IUserInfo;
  pending: Boolean
}
export interface IAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Section {
  text: string;
  link: string;
  // eslint-disable-next-line no-undef
  icon: JSX.Element;
  sub?: {
    text: string,
    link: string
  }[];
}

interface RoutesNav {
  sections: Section[];
  categorie?: string;
}

export interface Routes {
  all: RoutesNav[];
  current: Section
}

export interface stateType {
  from: { pathname: string }
}

export interface ApiResponse {
  hasErrors: boolean;
  type?: string;
  errors?: [{ msg: string, param?: string }];
  payload?: any
}
export interface ClientData {
  lastname: string,
  firstname: string,
  username: string,
  password: string,
  email: string,
  phone: string,
  secondAuthChoice: number,
  question: number,
  answer: string,
  funds: number,
  role: string,
  paymentMode: number,
  cardHolderFirstname: string,
  cardHolderLastname: string,
  cardNumber: string,
  expirationDate: string,
  CVV: string,
  bankInstitution: string,
  branchNumber: string,
  accountNumber: string,
  city: string,
  street: string,
  postalCode: string,
  province: string,
  pending: Boolean,
  registrationDate: Date,
  lastConnection: Date,
}

export enum Severity {
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  Success = 'success',
}

export interface IAd {
  _id: string;
  clientID: string;
  clientUsername: string;
  supplierID: string;
  supplierName: string;
  points: number;
  price: number;
  timestamp: Date;
}

export interface IExchangeAd {
  _id: string;
  sellerID: string;
  sellerUsername: string;
  supplierFromID: string;
  supplierFromName: string;
  pointsFrom: number;
  supplierToID: string;
  supplierToName: string;
  pointsTo: number;
  timestamp: Date;
}

export interface IPendingExchangeAd {
  _id: string;
  sellerID: string;
  sellerUsername: string;
  sellerFirstname: string;
  sellerLastname: string;
  supplierFromID: string;
  supplierFromName: string;
  pointsFrom: number;
  supplierToID: string;
  supplierToName: string;
  pointsTo: number;
  timestamp: Date;
}

export interface ITransactionData {
  _id: string;
  sellerUsername: string;
  buyerUsername: string;
  supplierName: string;
  adID: string;
  adCreationDate: Date;
  points: number;
  price: number;
  timestamp: Date;
}

export interface IExchangeData {
  _id: string;
  exchangeAdID: string;
  sellerUsername: string;
  supplierFromName: string;
  pointsFrom: number;
  supplierToName: string;
  pointsTo: number;
  exchangeAdCreationDate: Date;
  buyerUsername: string;
  exchangeDate: Date;
}

export interface IPromotionData {
  _id: string;
  oldPointsToLennis: string;
  oldDollarsToPoints: string;
  oldPointsToDollars: string;
  newPointsToLennis: string;
  newDollarsToPoints: string;
  newPointsToDollars: string;
  currentDate: Date;
  expirationDate: Date;
  expired: string;
}
