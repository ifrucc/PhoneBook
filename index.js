
require('dotenv').config()
const express = require('express')

const path = require('path')
const Person = require('./models/mongodb')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build/')));

const PORT = process.env.PORT


app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'build/', 'index.html'));

})


app.get('/api/persons', (req, res, next) => {

    Person.find({})
        .then(result => { res.json(result) })
        .catch((err) => {
            console.log("Fetch failed")
            next(err)

        })

})


app.get('/api/persons/:id', (req, res, next) => {

    const id = req.params.id

    Person.findById(id)
        .then(result => res.json(result))
        .catch((err) => {
            console.log("Fetch failed")
            res.status(400).end()
            next(err)
        })

})


app.post('/api/persons', (req, res, next) => {

    const body = req.body

    Person.exists({ name: body.name })
        .then(result => {
            if (result) {
                return res.status(400).send({ error: 'Name is already exists' })
            }
            else {
                const newcontact = new Person({ name: body.name, number: body.number })
                newcontact.save()
                    .then(result => {
                        res.json(result)
                    })
                    .catch((err) => {
                        res.status(400).send({ error: err.message })
                        next(err)
                    })
            }

        })
        .catch((err) => {
            console.log("Fetch failed")
            next(err)

        })
})






app.put('/api/persons/:id', (req, res, next) => {

    const id = req.params.id

    const person = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
        .then((result) => {

            if (result == null) {
                res.status(404).end()
            }
            else {
                res.json(result)
            }
        })
        .catch((err) => {
            res.status(400).send({ error: err.message })
            next(err)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {

    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(result => {

            if (result == null) {
                res.status(404).end()
            }
            else {
                res.json(result)
            }
        })
        .catch((err) => {
            res.status(404)
            next(err)
        })

})


const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {

        console.log('CastError: Id is Not formated correctly')
    }
    else {

        console.log(error.message)
    }

    next()
}


const unknownEndpoint = (req, res) => {

    res.status(404).send({ error: "Unknow Endpoint/Route not found!" })
}

app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(PORT, () => {

    console.log(`server running at PORT ${PORT}`)
})
