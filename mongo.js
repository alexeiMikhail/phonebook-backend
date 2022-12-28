const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const argc = process.argv.length

if (argc !== 3 && argc !== 5) {
  console.log("Usage: node mongo.js <password> [<name> <number>]")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@fsocluster.d3tnact.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

const printPhonebook = () => {
  mongoose
    .connect(url)
    .then(res => {
      Person.find({}).then(persons => {
        console.log("phonebook:")
        persons.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
}

const addPerson = () => {
  mongoose
    .connect(url)
    .then(res => {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      return person.save()
    })
    .then(person => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch(err => console.log(err))
}


if (argc === 3) {
  printPhonebook()
}

if (argc === 5) {
  addPerson()
}