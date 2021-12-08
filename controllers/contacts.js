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


exports.getContacts = getAllContacts(2)
