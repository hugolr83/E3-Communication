import { Router, Response } from "express";
import Request from '../../types/Request'
import HttpStatusCodes from 'http-status-codes'
import User from "../../models/User";

const router: Router = Router()
// @route   POST api/totp/init/:id
// @desc    Call the server Authserver
// @access  Public
router.post('/init/:id',
  async (req: Request, res: Response) => {
    try {
      const clientObject = await User.findById(req.params.id).populate('userInfo');
        const response = await fetch('http://authserver:5000/totp/init/', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({friendlyName: clientObject.userInfo.username, userId: req.params.id})
      })
      const res2 = await response.json()
      if (res2.errors) {
        res.json( { hasErrors: true, errors: res2.errors, type: res2.type })
      }
      res.status(200).send({secret: res2.binding.secret});
      
      
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })

// @route   POST api/totp/verify/:id
// @desc    Call the server Authserver
// @access  Public
router.post('/verify/:id',
  async (req: Request, res: Response) => {
    try {
        const response = await fetch('http://authserver:5000/totp/verify/', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ userId: req.params.id, code:req.body.code})
      })
      const res2 = await response.text()
      if (res2 === "verified")
      {
        const user = User.findByIdAndUpdate(req.params.id, { pending: false },
          function (err, result) {
            if (err) {
              res.status(404).send('Did not find user')
            } else {
              res.send(res2)
            }
          })
      }
      else
      {
        res.send(res2)
      }
    } catch (err) {
      console.error(err.message)
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
  })  

export default router