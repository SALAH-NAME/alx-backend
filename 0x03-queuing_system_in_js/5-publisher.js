#!/usr/bin/node
import { createClient } from 'redis';

const redisConnection = createClient();

redisConnection.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

const sendMessage = (message, delay) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    redisConnection.publish('holberton school channel', message);
  }, delay);
};

redisConnection.on('connect', () => {
  console.log('Redis client connected to the server');
});

sendMessage('Holberton Student #1 starts course', 100);
sendMessage('Holberton Student #2 starts course', 200);
sendMessage('KILL_SERVER', 300);
sendMessage('Holberton Student #3 starts course', 400);
