import AWS from 'aws-sdk';
import { QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

export default {
    async put<T>(TableName: string, Item: T) {
		var params = {
			TableName,
			Item
        }
        try {
            await dynamodb.put(params).promise();
        } catch(e) {
            console.log(e.message);
        }
	},

    async update(params: UpdateItemInput) {
        try {
            await dynamodb.update(params).promise() 
        }
        catch (e) {
            console.log(e.message);
        }
        return {'statusCode': 202};
    },

    async query(params: QueryInput) {
        let data;
        try {
            data = await dynamodb.query(params).promise() 
        }
        catch (e) {
            console.log(e.message)
        }
        return data;
    },

    async query2(params: QueryInput) {
        let data;
        try {
            data = await dynamodb.query(params).promise() 
        }
        catch (e) {
            console.log(e.message)
        }
        return data?.Items;
    }
};
