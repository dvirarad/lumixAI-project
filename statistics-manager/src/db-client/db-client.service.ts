import {ConsoleLogger, Injectable} from '@nestjs/common';
import {MongoClient} from "mongodb";
import {MONGO_HOST_NAME} from "../config";

@Injectable()
export class DbClientService {
    private readonly uri: string = `mongodb://${MONGO_HOST_NAME}:27017/?maxPoolSize=20&w=majority`;
    private client: MongoClient;

    async onModuleInit() {
        this.client = new MongoClient(this.uri);
        try {
            await this.client.connect();
            await this.client.db(this.getDbName()).command({ping: 1});
            console.log("Connected successfully to MongoDB server");
        } catch (error) {
            console.log(`Error connecting to MongoDB server: ${error}`);
        }
    }

    async onModuleDestroy() {
        await this.client.close();
    }

    async ensureIndex(collectionName: string, index: any) {
        await this.client.db(this.getDbName()).collection(collectionName).createIndex(index);
    }
    async insert(collectionName:string,data: any) {
        const collection = this.client.db(this.getDbName()).collection(collectionName);
        await collection.insertOne(data);
    }

    async find(collectionName,mongoQuery: {},sort={},limit=1000) {
        const collection = this.client.db(this.getDbName()).collection(collectionName);
        return collection.find(mongoQuery,{sort,limit}).toArray();
    }

    private getDbName() {
        return "prod";
    }

    async initializeUnorderedBulkOp(collectionName: string, bulkUpdateList: any[]) {
        const bulk = await this.client.db(this.getDbName()).collection(collectionName).initializeUnorderedBulkOp()
        bulkUpdateList.forEach((item) => {
            bulk.find(item.selector).upsert().updateOne(item.updateDocument);
        });
        await bulk.execute();
    }
}
