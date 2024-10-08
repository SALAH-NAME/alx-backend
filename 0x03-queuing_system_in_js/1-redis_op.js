#!/usr/bin/node
import { createClient, print } from 'redis';

const redisClient = createClient();

redisClient.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

const setSchoolValue = (schoolKey, schoolValue) => {
  redisClient.SET(schoolKey, schoolValue, print);
};

const getSchoolValue = (schoolKey) => {
  redisClient.GET(schoolKey, (_error, response) => {
    console.log(response);
  });
};

getSchoolValue('Holberton');
setSchoolValue('HolbertonSanFrancisco', '100');
getSchoolValue('HolbertonSanFrancisco');
