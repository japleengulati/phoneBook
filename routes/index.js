const routes = require('express').Router();
var Contacts = require('../controllers/contacts')

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});


//Contact routes

routes.get('/contacts?', async (req, res) => {
    resd = await Contacts.getContacts()
    res.json({ result: resd })
});

routes.post('/contacts', async (req, res) => {
    resd = await Contacts.addContact()
    res.status(200).json({ result: resd })
});

routes.delete('/contacts/:id', async (req, res) => {
    resd = await Contacts.deleteContact()
    res.status(200).json({ result: resd })
});

routes.put('/contacts/:id', async (req, res) => {
    resd = await Contacts.updateContact()
    res.status(200).json({ result: resd })
});

module.exports = routes;