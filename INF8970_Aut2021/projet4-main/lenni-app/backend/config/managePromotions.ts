import PromotionHistory, { IPromotionHistory } from '../src/models/PromotionHistory'
import Promotion from '../src/models/Promotion'
import { IPromotion } from '../src/models/Promotion'
import Supplier from '../src/models/Supplier'
import { ISupplier } from '../src/models/Supplier'

const managePromotions = async () => {
  const schedule = require('node-schedule');
  const job = schedule.scheduleJob('* 0 * * *', async function(){ 
    const timeElapsed = Date.now()
    let today = new Date(timeElapsed)
    today.setTime(today.getTime()+today.getTimezoneOffset()*60*1000)
    let offset = -300 
    let todayEST = new Date(today.getTime() + offset*60*1000)
    todayEST.setHours(0, 0, 0, 0)
    try {
      const suppliers: Array<ISupplier> = await Supplier.find()
      for (const supplier of suppliers) {
        const promotion: IPromotion = await Promotion.findOne({ supplier: supplier._id })
        if (!promotion) {
          const oldPointsToLennis = supplier.pointsToLennis
          const oldDollarsToPoints = supplier.dollarsToPoints
          const oldPointsToDollars = supplier.pointsToDollars
          const newPointsToLennis = supplier.pointsToLennis
          const newDollarsToPoints = supplier.dollarsToPoints
          const newPointsToDollars = supplier.pointsToDollars
          const expirationDate = todayEST
          const active = false
          await Promotion.create({ supplier, oldPointsToLennis, oldDollarsToPoints, oldPointsToDollars,
            newPointsToLennis, newDollarsToPoints, newPointsToDollars, expirationDate, active})      
          }
      }
      const promotions:Array<IPromotion> = await Promotion.find()
      for (const promotion of promotions){
        if (promotion.expirationDate < todayEST && promotion.active == true) {
          let supplier: ISupplier = await Supplier.findOne( promotion.supplier._id )
          const newPointsToLennis = promotion.newPointsToLennis
          const newDollarsToPoints = promotion.newDollarsToPoints
          const newPointsToDollars = promotion.newPointsToDollars

          supplier.pointsToLennis = promotion.oldPointsToLennis
          supplier.dollarsToPoints = promotion.oldDollarsToPoints
          supplier.pointsToDollars = promotion.oldPointsToDollars
          await supplier.save()
          promotion.newPointsToLennis = promotion.oldPointsToLennis
          promotion.newDollarsToPoints = promotion.oldDollarsToPoints
          promotion.newPointsToDollars = promotion.oldPointsToDollars
          promotion.expirationDate = new Date()
          promotion.active = false
          await promotion.save()
          const oldPointsToLennis = promotion.oldPointsToLennis
          const oldDollarsToPoints = promotion.oldDollarsToPoints
          const oldPointsToDollars = promotion.oldPointsToDollars
          const currentDate = promotion.currentDate
          const expirationDate = promotion.expirationDate
          const active = promotion.active

          await PromotionHistory.create({
            promotion,
            oldPointsToLennis,
            oldDollarsToPoints,
            oldPointsToDollars,
            newPointsToLennis,
            newDollarsToPoints,
            newPointsToDollars,
            currentDate,
            expirationDate,
            active })
        }
      }
    } catch (err) {
      console.error(err.message)
      process.exit(1)
    }
  })
}

export default managePromotions
