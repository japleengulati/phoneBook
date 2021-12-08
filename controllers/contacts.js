const mysql = require( 'mysql');
const util = require( 'util');

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
async function getAllContacts(user_id='ADMIN') {
    const db = makeDb(dbConfig);
    let contacts = []
    try {
        //Filtering based on if phonebook is being viewed by admin/each user for their own contacts only
        if (user_id=='ADMIN'){
             contacts = await db.query('SELECT * FROM contacts');

        }
        else {
             contacts = await db.query('SELECT * FROM contacts WHERE user_id=?',(user_id));
        }

        if (contacts.length > 0) {
            console.log("contacts", contacts)
            return contacts
        }
        else {
            console.log("No contacts found")
            return({})
        }
    } catch (err) {
        console.log("ERROR", err)
    } finally {
        await db.close();
    }
}
//There should be more get contact endpoints, to get 

async function addContact($) {
    const db = makeDb(dbConfig);
    let contact = []
    try {
        contact=req.body.contact
        if (contacts.length == 0) {
            console.log("contacts", contacts)
            //Status code error also to be included
            return ("No contacts to be inserted!")
        }
        else {
            // FE to send as null values (non-required) that haven't been input by the user
            let contactInsert = await db.query("INSERT INTO contacts (name, phonework, phonehome, phonemobile, emailaddress, mailingAddressCity, mailingAddressCountry, emailingAddress, postcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [contact.name, contact.phonework, contact.phonehome, contact.phonemobile, contact.emailaddress, contact.mailingAddressCity, contact.mailingAddressCountry, contact.emailingAddress, contact.postcode])
            console.log("Contact insert ==", contactInsert['insertId'])
            return({'Status': 'Successful', newContactID: 'contactInsert'['insertId']})
        }
    } catch (err) {
        console.log("ERROR", err)
    } finally {
        await db.close();
    }
}

async function deleteContact($) {
    const db = makeDb(dbConfig)
    contactID=req.params.contactID

    try {
            let contactInsert = await db.query("DELETE FROM contacts WHERE id=?", [contactID])
            return({'Status': 'Successful', message: 'Contact Deleted'})
        
    } catch (err) {
        console.log("ERROR in deleting contact", err)
    } finally {
        await db.close();
    }
}

exports.getContacts = getAllContacts
exports.addContact = addContact
exports.deleteContact = deleteContact
