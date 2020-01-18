const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();
server.use(express.json());

server.get('/api/accounts', (req, res) => {
  db
    .select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Failed to get accounts' })
    })
})

server.get('/api/accounts/:id', (req, res) => {
  db
    .select('*')
    .from('accounts')
    // .where('id', '=', req.params.id)
    .where({ id: req.params.id })
    .first() //grabs the first object in the array. Otherwise we will get an object in an array
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Failed to get specified account' })
    })
})

// shorthand for --- db.select('*').from('accounts')

server.post('/api/accounts/', (req, res) => {
  db('accounts') // shorthand for --- db.insert(req.body).into('accounts')
    .insert(req.body, 'id') //second argument 'id' will show a warning on console when using SQLite
    .then(ids => {
      //returns an array of one element, the id of the last record inserted
      const id = ids[0];

      return db('accounts')
        .where({ id })
        .first()
        .then(newAccount => {
          res.status(201).json(newAccount); //returns the first item in the array, aka, the one we just created
        })
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Failed to create new account' })
    })
})

// server.get('/api/accounts', async (req, res, next) => {
//   try {
//     //translates to 'SELECT * FROM accounts'
//     res.json(await db.select('*').from('accounts'))
//   } catch (err) {
//       next(err)
//   }
// })

// server.post('/api/accounts', async (req, res, next) => {
//   try {
//     const payload = {
//       name: req.body.name,
//       budget: req.body.budget
//     }
//     const [id] = await db('accounts').insert(payload)
//     res.json({ id })
//   } catch(error) {
//       next(error)
//   }
// })



module.exports = server;