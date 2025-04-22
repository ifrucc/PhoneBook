const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

app.use(express.json())

morgan.token('content-body', function (req, res) { return JSON.stringify(req.body) })
const format = ':method :url :status :res[content-length] - :response-time ms :content-body'
app.use(morgan(format))

let options={
    origin : ['http://localhost:3000'],
    methods: 'GET,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }
  
app.use(cors(options))
const PORT = process.env.PORT || 5000

let persons = [

    {

        id: 1,

        name: "Arto Hellas",

        number: "040-123456"

    },

    {

        id: 2,

        name: "Ada Lovelace",

        number: "39-44-5323523"

    },

    {

        id: 3,

        name: "Dan Abramov",

        number: "12-43-234345"

    },

    {

        id: 4,

        name: "Mary Poppendieck",

        number: "39-23-6423122"

    }

]


app.get('/api/persons', (req, res) => {

    res.json(persons)

})


app.get('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)

    persons.find(e => e.id === id) ?
        res.json(persons[id - 1]) :
        res.status(404).send('Error 404: Contact Not Found')

})


app.get('/info', (req, res) => {

    let response = `Phonebook has info for ${persons.length} persons`
    response = response + `\n${new Date()}`
    res.send(response)

})


app.post('/api/persons', (req, res) => {

    const generateId = text => {

        return Number((Array.from(text).map(e => e.charCodeAt(e)).join("")))
    }

    const body = req.body

    if (!body.name || body.name.length < 6 || !body.number || body.number.length < 6) {
        res.status(400)
            .send('Error 400: Bad request. "name" or "phone" prop must be at least 6 chars ')
            .end()
    }
    else {

        const newcontact = { id: generateId(body.name), name: body.name, number: body.number }

        persons.find(e => e.name === newcontact.name) ?
            res.status(401).send('Eror 401: Duplicated value. Contatct is existed') :
            persons = persons.concat(newcontact)
    }
    console.log(persons)

    res.status(200).send('Contact successfully added')
})
app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    if (persons.find(e=>e.id===id)){
        persons= persons.filter(e=> e.id !== id)
        response.status(200).send('ok')
    }
    else{
        response.status(404).end()
    }
    
   console.log(persons)

  })

app.listen(PORT, () => {
    console.log(`server running at PORT ${PORT}`)
})