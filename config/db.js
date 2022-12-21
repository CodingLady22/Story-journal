const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING, {
            // These 3 below are no longer required.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useOneAndReplace: false
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        // This line stops everything if there is an error and '1' means failure
        process.exit(1)
    }
}

module.exports = connectDB