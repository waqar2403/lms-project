import Redis from 'ioredis';
//import { Redis } from '@upstash/redis'
require("dotenv").config();///////////////////
export const redis = new Redis(process.env.REDIS_URL as string);