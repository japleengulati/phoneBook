const express = require('express')
const app = express()
const port = 7493

const routes = require('./routes');

//  Connect all our routes to our application
app.use('/', routes);

app.listen(port, () => {
  console.log(`Phonebook app listening on http://localhost:${port}`)
})