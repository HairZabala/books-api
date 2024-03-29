const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            dbName: "books"
        });

        console.log('BD online!');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de conectar la BD, ver LOGS.');
    }

}

module.exports = {
    dbConnection
}