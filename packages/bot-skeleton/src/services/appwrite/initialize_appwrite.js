import { Client } from 'appwrite';

// Init your Web SDK
export const client = new Client();
export const cc = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('65fd057cb22be40ed1c7');
cc.setEndpoint('https://cloud.appwrite.io/v1').setProject('65e94de0e88ed3878323');

export const DATABASE_ID = '65fd1d5a950799af9f7a';
export const COLLECTION_ID = '65fd1d673a5cb90b3cdd';
