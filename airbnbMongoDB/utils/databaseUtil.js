const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const MONGO_URL = 'mongodb+srv://<username>:<password>@codewithjs.a0vhajb.mongodb.net/?retryWrites=true&w=majority&appName=CodeWithJs';

let _db;

const MongoConnect = (callback) => {
    MongoClient.connect(MONGO_URL).then((client) => {
        _db = client.db('airbnbMongoDB');
        callback();
    }).catch((error) => {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    })
}

const getDb = () => {
    if (!_db) {
        throw new Error('No database found!');
    }
    return _db;
}

exports.MongoConnect = MongoConnect;

exports.getDb = getDb;
