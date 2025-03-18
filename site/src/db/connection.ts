"use server"
import "../../envConfig.js";
import {MongoClient, ServerApiVersion} from "mongodb";
const client = new MongoClient(process.env.CONN_STRING, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

export default client;