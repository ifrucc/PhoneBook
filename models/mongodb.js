const mongoose = require('mongoose')

const url = process.env.MONGO_URL

const noteSchema = new mongoose.Schema({

    name: { type: String, minLength: 3, required: [true, 'User Name is missing'] },

    number: {
        type:String,
        validate: {
            validator: (v) => {
                return /^(\d{2}-\d{6,9})$|^(\d{3}-\d{5,8})$|^(\d{8,11})$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']

    }
})

noteSchema.set('toJSON', {

    transform: (document, returnedObject) => {

        returnedObject.id = returnedObject._id.toString()

        delete returnedObject._id

        delete returnedObject.__v

    }

})

mongoose.connect(url)

    .then(() => {

        console.log(`connected @${new Date()}`)

    })
    .catch(() => {
        console.log("Connection failed")
        return mongoose.connection.close()
    }
    )

module.exports = mongoose.model('Person', noteSchema)
