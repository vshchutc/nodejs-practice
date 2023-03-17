import app, { rides } from './app'

import request from 'supertest'

describe('POST /rides', () => {
  beforeEach(() => {
    rides.length = 0
  })

  test('err if input data is invalid', async () => {
    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAdsdress: 'Address 2',
        cost: 100,
        date: '2021-01-10',
        distance: 12.4,
      })
      .expect(400)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAdsdress: 'Address 2',
        cosat: 100,
        date: '2021-01-10',
        distance: 12.4,
      })
      .expect(400)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAdsdress: 'Address 2',
        cost: 100,
        dafte: '2021-01-10',
        distance: 12.4,
      })
      .expect(400)
  })

  test('add single ride', async () => {
    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAddress: 'Address 2',
        cost: 100,
        date: '2021-01-10',
        distance: 12.4,
      })
      .expect(200)

    await request(app)
      .get('/rides')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify([
            {
              startAddress: 'Address 1',
              endAddress: 'Address 2',
              cost: 100,
              date: '2021-01-10',
              distance: 12.4,
            },
          ])
        )
      })
  })

  test('add and get multiple rides', async () => {
    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAddress: 'Address 2',
        cost: 100,
        date: '2021-01-10',
        distance: 12.4,
      })
      .expect(200)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 3',
        endAddress: 'Address 4',
        cost: 102,
        date: '2021-01-11',
        distance: 12.4,
      })
      .expect(200)

    await request(app)
      .get('/rides')
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify([
            {
              startAddress: 'Address 1',
              endAddress: 'Address 2',
              cost: 100,
              date: '2021-01-10',
              distance: 12.4,
            },
            {
              startAddress: 'Address 3',
              endAddress: 'Address 4',
              cost: 102,
              date: '2021-01-11',
              distance: 12.4,
            },
          ])
        )
      })
  })
})

describe('GET /rides/:date', () => {
  beforeAll(async () => {
    rides.length = 0

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAddress: 'Address 2',
        cost: 102,
        date: '2021-01-11',
        distance: 14.4,
      })
      .expect(200)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 3',
        endAddress: 'Address 4',
        cost: 122,
        date: '2021-01-11',
        distance: 12.4,
      })
      .expect(200)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 5',
        endAddress: 'Address 6',
        cost: 1092,
        date: '2021-01-12',
        distance: 1.4,
      })
      .expect(200)
  })

  test('can handle date with no rides', async () => {
    await request(app)
      .get('/rides/2021-01-10')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify({
            cost: 0,
            distance: 0,
          })
        )
      })
  })
  test('can handle date with multiple rides', async () => {
    await request(app)
      .get('/rides/2021-01-11')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify({
            cost: 224,
            distance: 26.8,
          })
        )
      })
  })
  test('can handle date with single ride', async () => {
    await request(app)
      .get('/rides/2021-01-12')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify({
            cost: 1092,
            distance: 1.4,
          })
        )
      })
  })

  test('err if input date is invalid', async () => {
    await request(app).get('/rides/2021-01-1d2').expect(400)
  })
})

describe('GET /rides/:fromdate/:todate', () => {
  beforeAll(async () => {
    rides.length = 0

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 1',
        endAddress: 'Address 2',
        cost: 102,
        date: '2021-01-11',
        distance: 14.4,
      })
      .expect(200)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 3',
        endAddress: 'Address 4',
        cost: 122,
        date: '2021-01-11',
        distance: 12.4,
      })
      .expect(200)

    await request(app)
      .post('/rides')
      .send({
        startAddress: 'Address 5',
        endAddress: 'Address 6',
        cost: 1092,
        date: '2021-01-12',
        distance: 1.4,
      })
      .expect(200)
  })

  test('can handle date range with no rides', async () => {
    await request(app)
      .get('/rides/2021-01-09/2021-01-10')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(JSON.stringify({
          cost: 0,
          distance: 0,
        }))
      })
  })
  test('can handle date range with multiple rides over multiple dates', async () => {
    await request(app)
      .get('/rides/2021-01-10/2021-01-12')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify({
            cost: 1316,
            distance: 28.2,
          })
        )
      })
  })

  test('can handle date range with single day, similar to rides/:date', async () => {
    await request(app)
      .get('/rides/2021-01-11/2021-01-11')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res) => {
        expect(res.text).toEqual(
          JSON.stringify({
            cost: 224,
            distance: 26.8,
          })
        )
      })
  })

  test('err if input range is invalid', async () => {
    await request(app).get('/rides/2021-01-12/2021-01-10').expect(400)
  })
})
