const { Pool } = require('pg')

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
return pool 
      .query(` SELECT *
      FROM users
      WHERE users.email = $1;`,[email])
      .then(res => {
        if(res.rows) {
          return res.rows[0];
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    };  
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  return pool 
      .query(` SELECT * FROM users
      WHERE users.id = $1
      ;`,[id])
      .then(res => {
        if(res.rows) {
          return res.rows[0];
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
};  

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool 
      .query(` INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING *
      ;`,[user.name, user.email, user.password])
      .then(res => (res.rows), console.log("addUser .then ran"))
      .catch((err) => {
        console.log(err.message);
      });
}
exports.addUser = addUser;
//Add RETURNING *; to the end of an INSERT query to return the objects that were inserted. This is handy when you need the auto generated id of an object you've just added to the database.

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
const getAllProperties = (options, limit = 10) => {
  return pool //by returning the entire promise chain we are returning a promise that will reslt in res.rows
      .query(`SELECT * FROM properties LIMIT $1`,[limit]).then((res) => {
        console.log("something ran");
        return res.rows;
      })
      .catch((err) => {
        console.log('error: ', err.message);
      });
    };  
    getAllProperties().then(data => {
      console.log("got properties data");
    })
  exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;