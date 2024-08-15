import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

beforeEach(async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterEach(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
