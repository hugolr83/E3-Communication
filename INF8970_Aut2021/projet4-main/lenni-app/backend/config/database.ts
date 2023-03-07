import { connect } from 'mongoose'

const dotenv = require('dotenv')
dotenv.config()

const connectDB = async () => {
    
  const timeElapsed = Date.now()
  let today = new Date(timeElapsed)
  today.setTime(today.getTime()+today.getTimezoneOffset()*60*1000)
  let offset = -300 //Timezone offset for EST in minutes.
  let todayEST = new Date(today.getTime() + offset*60*1000)
  todayEST.setHours(0, 0, 0, 0)
  try {
    const mongoURI: string = process.env.MONGO_URI
    const options: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    await connect(mongoURI, options)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

export default connectDB
