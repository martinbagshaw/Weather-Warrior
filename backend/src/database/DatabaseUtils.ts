import { MongoClient, OptionalId, Document } from "mongodb";
import { mongoEnvVars } from "../env-variables";

export class DatabaseUtils {
  public static async getCollectionContents<T>(collectionName: string): Promise<T[]> {
    // TODO: pass in record type type: T returns promise<T>
    const client = this.createClient();

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      const db = client.db(mongoEnvVars.dbName);

      // TODO: object mapper to avoid type casting
      return (await db.collection(collectionName).find().toArray()) as T[];
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  }

  public static async saveCollectionContents<T>(collectionName: string, records: T[]) {
    const client = DatabaseUtils.createClient();

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      const db = client.db(mongoEnvVars.dbName);

      // TODO: object mapper to avoid type casting
      const res = await db.collection(collectionName).insertMany(records as Array<OptionalId<Document>>);
      console.log("saved ", res.insertedCount, " records");
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  }

  public static async createRecord<T>(client: MongoClient, collectionName: string, newRecord: T) {
    await client
      .db(mongoEnvVars.dbName)
      .collection(collectionName)
      .insertOne(newRecord as OptionalId<Document>);
  }

  public static async findRecord(client: MongoClient, collectionName: string, recordName: string) {
    await client.db(mongoEnvVars.dbName).collection(collectionName).findOne({ name: recordName });
  }

  public static createClient = () => {
    const { username, password, url } = mongoEnvVars;
    const databaseUrl = `mongodb+srv://${username}:${password}@${url}`;
    return new MongoClient(databaseUrl);
  };
}
