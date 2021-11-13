const mongoose = require('mongoose');
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');



    } catch (e) {
        console.log(e);
        throw new Error('Error initializing database');
    }
}


module.exports = {
    dbConnection
}