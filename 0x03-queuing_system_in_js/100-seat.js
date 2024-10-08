#!/usr/bin/node
import { promisify } from 'util';
import { createClient } from 'redis';
import { createQueue } from 'kue';
import express from 'express';

let isReservationEnabled;
const redisConnection = createClient();

redisConnection.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

function setSeatReservation(number) {
  return redisConnection.SET('available_seats', number);
}

function fetchCurrentAvailableSeats() {
  const getAsync = promisify(redisConnection.GET).bind(redisConnection);
  return getAsync('available_seats');
}

const jobQueue = createQueue();

const app = express();

app.get('/available_seats', (req, res) => {
  fetchCurrentAvailableSeats()
    .then((seats) => {
      res.json({ numberOfAvailableSeats: seats });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(null);
    });
});

app.get('/reserve_seat', (req, res) => { /* eslint-disable-line consistent-return */
  if (isReservationEnabled === false) {
    return res.json({ status: 'Reservation are blocked' });
  }
  const job = jobQueue.create('reserve_seat', { task: 'reserve a seat' });
  job
    .on('complete', (status) => { /* eslint-disable-line no-unused-vars */
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .on('failed', (error) => {
      console.log(`Seat reservation job ${job.id} failed: ${error.message || error.toString()}`);
    })
    .save((error) => {
      if (error) return res.json({ status: 'Reservation failed' });
      return res.json({ status: 'Reservation in process' });
    });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
  jobQueue.process('reserve_seat', async (job, done) => {
    let availableSeats = await fetchCurrentAvailableSeats();
    availableSeats -= 1;
    setSeatReservation(availableSeats);
    if (availableSeats >= 0) {
      if (availableSeats === 0) isReservationEnabled = false;
      done();
    }
    done(new Error('Not enough seats available'));
  });
});

app.listen(1245, () => {
  setSeatReservation(50);
  isReservationEnabled = true;
  console.log('API available on localhost via port 1245');
});
