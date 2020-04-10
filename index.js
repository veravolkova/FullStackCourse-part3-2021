const morgan = require('morgan');
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
//app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    },
    {
      name: "Vera Popova",
      number: "040-1234567",
      id: 5
    }    
  ] 

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {    
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>`)   
  })


date: new Date(),

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  } 
}) 

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) { 
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
    
  const personToFind = persons.find(person => person.name === body.name)

    if (personToFind) {
      //return is crucial otherwise the code will execute to the very end
      return response.status(400).json({ 
        error: 'name must be unique' 
     })
    } 
  
    const person = {
      name: body.name,
      number: body.number,      
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})