import { getUnixTime } from 'date-fns';

import express from 'express';
import {
  validateCost,
  validateDate,
  validateDistance,
  validateEndAddress, 
  validateStartAddress } 
  from './input-validations';
import Ride from './models/Ride';

const app = express()
const port = 3004;
let rides: Ride[] = []

app.use(express.json());
app.use(express.urlencoded());

app.post('/rides', async (req, res) => {
  const payload = req.body

    try {
    const ride: Ride = {
            startAddress: validateStartAddress(payload.startAddress as string),
            endAddress: validateEndAddress(payload.endAddress as string),
            cost: validateCost(payload.cost as string),
            date: validateDate(payload.date as string),
            distance: validateDistance(payload.distance as string),
        }
        rides.push(ride)
    res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/rides', (req, res) => {
  res.status(200).send(JSON.stringify(rides))
})

app.get('/rides/:date', (req, res) => {
    try {
    const queryDate = validateDate(req.params.date as string)

    const accumulatedCostAndDistance = rides
      .filter((ride) => validateDate(ride.date) === validateDate(queryDate))
      .reduce(
        (acc, curr) => {
          acc.distance += curr.distance
          acc.cost += curr.cost
          return acc
        },
        {
          cost: 0,
          distance: 0,
        }
      )

    res.status(200).send(accumulatedCostAndDistance)
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

