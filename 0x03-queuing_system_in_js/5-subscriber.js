#!/usr/bin/node
import { createClient } from 'redis';

const redisConnection = createClient();
const TERMINATE_MSG = 'KILL_SERVER';

redisConnection.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

redisConnection.on('connect', () => {
  console.log('Redis client connected to the server');
});

redisConnection.subscribe('holberton school channel');

redisConnection.on('message', (_error, message) => {
  console.log(message);
  if (message === TERMINATE_MSG) {
    redisConnection.unsubscribe();
    redisConnection.quit();
  }
});
