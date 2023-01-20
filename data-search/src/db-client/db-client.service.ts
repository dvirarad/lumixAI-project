import {ConsoleLogger, Injectable} from '@nestjs/common';
import {MongoClient} from "mongodb";
import {MONGO_HOST_NAME} from "../../config";


@Injectable()
export class DbClientService {
//docker run --name mongodb -d -p 27017:27017 mongo
    private readonly uri: string = `mongodb://${MONGO_HOST_NAME}:27017/?maxPoolSize=20&w=majority`;
    private client: MongoClient;

    constructor(private logger: ConsoleLogger) {
    }

    async onModuleInit() {
        this.client = new MongoClient(this.uri);
        try {
            await this.client.connect();
            await this.client.db(this.getDbName()).createIndex(this.getCollectionName(),{"$**": "text"})
            console.log("Connected successfully to MongoDB server");
        } catch (error) {
            console.log(`Error connecting to MongoDB server: ${error}`);
        }
    }

    async onModuleDestroy() {
        await this.client.close();
    }


    async insertMany(data: any) {
        let insertWithoutError = true;
        const collection = this.client.db(this.getDbName()).collection(this.getCollectionName());
        for (let i = 0; i < data.length; i += 100) {
            try {
                await this.insertData(collection, data, i, i + 100);
            } catch (error) {
                insertWithoutError = false;
            }
        }
        if (insertWithoutError) {
            this.logger.log(`Data has been inserted successfully`);
        } else {
            this.logger.warn(`Error occurred while inserting data`);
        }
    }

    search(text: string) {
        const collection = this.client.db(this.getDbName()).collection(this.getCollectionName());
        return collection.find({$text: {$search: text}}).toArray();
    }

    private getDbName() {
        return "prod";
    }

    private getCollectionName() {
        return "fetched-data";
    }

    private async  insertData(collection, data, startIndex, endIndex) {
        try {
            this.logger.log(`Inserting data from index ${startIndex} to ${endIndex}`);
            await collection.insertMany(data.slice(startIndex, endIndex));
            this.logger.log(`Data from index ${startIndex} to ${endIndex} has been inserted successfully`);
        } catch (error) {
            this.logger.error(`Error occurred while inserting data from index ${startIndex} to ${endIndex}: ${error}`);
            throw error;
        }
    }
}
