import "../../envConfig.ts"; // Ensure this path is correct and envConfig.ts is properly configured
import { MongoClient, ServerApiVersion } from "mongodb";

// Ensure CONN_STRING is set
if (!process.env.CONN_STRING) {
  throw new Error("CONN_STRING environment variable is not set.");
}

// Singleton instance of the MongoDB client
let client: MongoClient;

// Immediately create and connect the MongoDB client
try {
  client = new MongoClient(process.env.CONN_STRING, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Connect to MongoDB synchronously (using async/await in a top-level context)
  (async () => {
    await client.connect();
    console.log("Connected to MongoDB");
  })();
} catch (error) {
  console.error("Failed to initialize MongoDB client", error);
  process.exit(1); // Exit the process if initialization fails
}

// Export the singleton client instance
export default client;
