#!/usr/bin/node
import { createClient, print } from 'redis';

const redisClient = createClient();

redisClient.on('error', (error) => {
  console.log('Redis client not connected to the server:', error.toString());
});

const updateRedisHash = (hashKey, fieldKey, fieldValue) => {
  redisClient.HSET(hashKey, fieldKey, fieldValue, print);
};

const displayRedisHash = (hashKey) => {
  redisClient.HGETALL(hashKey, (_error, response) => console.log(response));
};

function main() {
  const cities = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  for (const [city, value] of Object.entries(cities)) {
    updateRedisHash('HolbertonSchools', city, value);
  }
  displayRedisHash('HolbertonSchools');
}

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});
