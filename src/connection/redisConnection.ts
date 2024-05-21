import { createClient } from 'redis';
import { logger } from "../logger";
import dotenv from 'dotenv';
dotenv.config()
let redisOption: any = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}

const redis = createClient(redisOption);

const connectRedis = () => {
    try {
        redis.connect()
        redis.on("connect", () => {
            logger.info("Redis Connected...");
        })
        redis.on('error', (error: any) => {
            logger.error(`CATCH_ERROR connectRedis :: ${error}`);
        });
    } catch (error) {
        logger.error(`CATCH_ERROR connectRedis :: ${error}`);
    }
}

export { redis, connectRedis, redisOption }