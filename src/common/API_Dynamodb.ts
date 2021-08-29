import AWS from 'aws-sdk';

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
        console.log(JSON.stringify(Item, null, 1));
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

    async update<T>(params: T) {
        console.log(JSON.stringify(params, null, 1))
        try {
            await dynamodb.update(params).promise() 
        }
        catch (e) {
            return(e.message)
        }
        return {'statusCode': 202};
    },

    async query<T>(params: T) {
        let data;
        try {
            data = await dynamodb.query(params).promise() 
        }
        catch (e) {
            console.log(e.message)
        }
        console.log(JSON.stringify(data));
        return data;
    }
};
