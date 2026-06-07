import { createClient } from 'redis';

const redisClient = createClient({ url: "rediss://default:gQAAAAAAAcl3AAIgcDE0NjQyNDUzNTljYjg0MTU3OGIyODEwNGM0ZDAzOTM5Yw@apparent-beetle-117111.upstash.io:6379"   // default
  // password: 'yourpassword',       // if needed
  // socket: { reconnectStrategy: retries => Math.min(retries * 100, 3000) }
});

redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));



// fetch messages 




await redisClient.connect();

export {redisClient};