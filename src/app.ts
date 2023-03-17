import express from 'express'
import {
  stringToDate,
  validateCost,
  validateDate,
  validateDistance,
  validateEndAddress,
  validateStartAddress,
} from './input-validations'
import Ride from './models/Ride';
const app = express()
app.use(express.json())
const port = 3004

export let rides: Ride[] = []

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

app.get('/rides/:fromdate/:todate', (req, res) => {
  try {
    const queryFromDate = validateDate(req.params.fromdate as string)
    const queryToDate = validateDate(req.params.todate as string)

    if (stringToDate(queryFromDate) > stringToDate(queryToDate)) {
      throw new Error('from date cannot be greater than to date')
    }

    const accumulatedCostAndDistance = rides
      .filter(
        (ride) =>
          stringToDate(ride.date) >= stringToDate(queryFromDate) &&
          stringToDate(ride.date) <= stringToDate(queryToDate)
      )
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

export default app
