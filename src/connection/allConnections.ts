import { connectDb } from "./dbConnection";
import { RedLockConnction } from "./reLockConnection";
import { connectRedis } from "./redisConnection";
import { socketConnection } from "./socketConnection";

const allConnections = async () => {
    await socketConnection();
    await connectDb();
    await RedLockConnction();
    await connectRedis();
}

export { allConnections}