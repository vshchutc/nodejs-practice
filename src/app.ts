import { getUnixTime } from 'date-fns';

import express from 'express';
import { validateCost, validateDate, validateDistance, validateEndAddress, validateStartAddress } from './input-validations';
import IRide from './models/Ride';

const app = express()
const port = 3004;
let rides: IRide[] = []

app.use(express.json());
app.use(express.urlencoded());

app.post('/add',async (req, res) => {
    try {
        const payload = await req.body();
        console.log(payload)
        const ride: IRide = {
            startAddress: validateStartAddress(payload.startAddress as string),
            endAddress: validateEndAddress(payload.endAddress as string),
            cost: validateCost(payload.cost as string),
            date: validateDate(payload.date as string),
            distance: validateDistance(payload.distance as string),
        }
        rides.push(ride)
        res.status(200).send(rides)
    } catch (error) {
        res.status(400).send(error)
    }
})
app.get('/report-daily', (req, res) => {
    try {
      const queryDate = validateDate(req.query.date as string)
      res
        .status(200)
        .send(rides.filter((ride) => getUnixTime(ride.date) === getUnixTime(queryDate)))
    } catch (error) {
      res.status(400).send(error)
    }
  })
  
  app.get('/report-range', (req, res) => {
    try {
      const queryFromDate = validateDate(req.query.fromDate as string)
      const queryToDate = validateDate(req.query.toDate as string)
      res
        .status(200)
        .send(
          rides.filter(
            (ride) => getUnixTime(ride.date) >= getUnixTime(queryFromDate) && getUnixTime(ride.date) <= getUnixTime(queryToDate)
          )
        )
    } catch (error) {
      res.status(400).send(error)
    }
  })
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

