const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
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
    .query(
      ` SELECT *
      FROM users
      WHERE users.email = $1;`,
      [email]
    )
    .then((res) => {
      if (res.rows) {
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
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);
  return pool
    .query(
      ` SELECT * FROM users
      WHERE users.id = $1
      ;`,
      [id]
    )
    .then((res) => {
      if (res.rows) {
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
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool
    .query(
      ` INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING *
      ;`,
      [user.name, user.email, user.password]
    )
    .then((res) => res.rows, console.log("addUser .then ran"))
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;
//Add RETURNING *; to the end of an INSERT query to return the objects that were inserted. This is handy when you need the auto generated id of an object you've just added to the database.

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  return pool
    .query(
      `SELECT properties.*, reservations.*, AVG(rating) as rating
      FROM reservations 
      JOIN properties ON properties.id = reservations.property_id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1 
      AND reservations.end_date < now()::date
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date 
      limit $2;`,
      [guest_id, limit]
    )
    .then((res) => {
      console.log("getReservations ran");
      // console.log(`guest_id = ${guest_id}, limit  = ${limit}`);
      // console.log(`res.rows = `,res.rows);
      return res.rows;
    })
    .catch((err) => {
      console.log("Res-error: ", err.message);
    });
};
// getAllReservations().then(data => {
//   console.log("got reservations data");
// })

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
  // 1 Setup an array to hold any parameters that may be available for the query
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  //Check if a city has been passed in as an option. Add the city to the params
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 0) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    if (queryParams.length === 0) {
      queryString += `WHERE cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    }
  }
  queryString += `GROUP BY properties.id`;
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  if (limit) {
    queryParams.push(limit);
    queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  }

  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows, console.log("getProperties ran"), console.log(queryString))
    .catch((err) => {
      console.log("Prop-error: ", err.message);
    });
  // return pool //by returning the entire promise chain we are returning a promise that will reslt in res.rows
  //     .query(`SELECT * FROM properties LIMIT $1`,[limit]).then((res) => {
  //       console.log("getProperties ran");
  //       return res.rows;
  //     })
  //     .catch((err) => {
  //       console.log('Prop-error: ', err.message);
  //     });
  //   };
  //   getAllProperties().then(data => {
  //     console.log("got properties data");
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  return pool
    .query(
      ` INSERT INTO properties ( 
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        cost_per_night,
        street,
        city,
        province,
        post_code,
        country,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      ;`,
      [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms]
    )
    .then((res) => res.rows, console.log("addProperty ran"))
    .catch((err) => {
      console.log("Add Prop Error:", err.message);
    });
};
exports.addProperty = addProperty;
