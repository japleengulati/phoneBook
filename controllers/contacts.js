const mysql = require('mysql');
const util = require('util');

//To be made configurable, picked from ecosystem/environment file
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Locomoco',
    database: 'japnadb'
}

//DB connections
function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}


// ------------------ CONTROLLERS FOR CONTACTS -------------------
async function getAllContacts($) {
    let user_id='ADMIN'
    if ($.query.user_id){
        user_id=$.query.user_id
    }
    const db = makeDb(dbConfig);
    let contacts = []
    try {
        //Filtering based on if phonebook is being viewed by admin/each user for their own contacts only
        if (user_id == 'ADMIN') {
            contacts = await db.query('SELECT * FROM contacts');

        }
        else {
            contacts = await db.query('SELECT * FROM contacts WHERE user_id=?', (user_id));
        }

        if (contacts.length > 0) {
            console.log("contacts", contacts)
            return contacts
        }
        else {
            console.log("No contacts found")
            return ({})
        }
    } catch (err) {
        return("ERROR", err)
    } finally {
        await db.close();
    }
}
//There should be more get contact endpoints, to get 

async function addContact($) {
    const db = makeDb(dbConfig);
    let contact = []
    try {
        contact = req.body.contact
        if (contacts.length == 0) {
            console.log("contacts", contacts)
            //Status code error also to be included
            return ({status: false, message: "No contacts provided to be inserted!"})
        }
        else {
            await db.query("START TRANSACTION")

            // FE to send as null values (non-required) that haven't been input by the user
            let contactInsert = await db.query("INSERT INTO contacts (name, phonework, phonehome, phonemobile, emailaddress, mailingAddressCity, mailingAddressCountry, emailingAddress, postcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [contact.name, contact.phonework, contact.phonehome, contact.phonemobile, contact.emailaddress, contact.mailingAddressCity, contact.mailingAddressCountry, contact.emailingAddress, contact.postcode])
            console.log("Contact insert ==", contactInsert['insertId'])
            let commit = await db.query('COMMIT')
            return ({ 'Status': true, newContactID: 'contactInsert'['insertId'] })
        }
    } catch (err) {
        let rollback = await db.query('ROLLBACK')
        return("ERROR", err)
    } finally {
        await db.close();
    }
}

async function deleteContact($) {
    const db = makeDb(dbConfig)
    contactID = req.params.id

    try {
        await db.query("START TRANSACTION")

        let contactInsert = await db.query("DELETE FROM contacts WHERE id=?", [contactID])
        let commit = await db.query('COMMIT')

        return ({ 'Status': true, message: 'Contact Deleted' })

    } catch (err) {
        let rollback = await db.query('ROLLBACK')
        return("ERROR in deleting contact", err)
    } finally {
        await db.close();
    }
}

async function updateContact(req) {
    const db = makeDb(dbConfig)

    try {
        contactID = req.params.id

        if (contactID != null) {

            await db.query("START TRANSACTION")

            let updateQuery = "UPDATE contacts SET `".concat(req.body[0]['field']).concat("` = '").concat(req.body[0]['value']).concat("' WHERE id = ").concat(contactID)

            let updatingRun = await db.query(updateQuery)

            let commit = await db.query('COMMIT')
            return ({ 'Status': true, message: 'Contact Updated' })
        }
        else {

            return ('Contact not chosen to be updated!')

        }

    } catch (err) {
        let rollback = await db.query('ROLLBACK')
        return("ERROR in deleting contact", err)
    } finally {
        await db.close();
    }
}




exports.getContacts = getAllContacts
exports.addContact = addContact
exports.deleteContact = deleteContact
exports.updateContact = updateContact


/* update controller test code
let bod =[{'field':'postcode', 'value':'SW15 4AQ'}]
updateReq = {
    params:{'id':'2'},
    body: bod
}
updateContact(updateReq)*/