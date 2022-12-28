require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const count = Person.countDocuments()
    .then(res => {
      const date = new Date()
      response.send(
        `
        <p>Phonebook has info for ${res} people</p>
        <p>${date}</p>
        `
      )
    })
  
  
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.statusMessage = `Person ${request.params.id} does not exist`
        response.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      response.status(500).end()
    })

})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(res => {
    response.status(204).end()
  })
  .catch(err => next(err))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
