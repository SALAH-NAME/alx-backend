#!/usr/bin/node
import { promisify } from 'util';
import { createClient, print } from 'redis';

const redisClient = createClient();

redisClient.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

const setSchoolValue = (schoolKey, schoolValue) => {
  redisClient.SET(schoolKey, schoolValue, print);
};

const getSchoolValue = async (schoolKey) => {
  console.log(await promisify(redisClient.GET).bind(redisClient)(schoolKey));
};

async function main() {
  await getSchoolValue('Holberton');
  setSchoolValue('HolbertonSanFrancisco', '100');
  await getSchoolValue('HolbertonSanFrancisco');
}

redisClient.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
