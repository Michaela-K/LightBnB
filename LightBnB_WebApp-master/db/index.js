const { Pool } = require("pg");
//db connection
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

module.exports = {
  query: (text, params) => {
    const start = Date.now()
    return pool
    .query(text, params) 
    .then( res => {
      const duration = Date.now() - start
      console.log('executed query', 
      { 
        text, duration, rows: res.rowCount 
      });
      return res;
  })
  .catch(err => {
    const duration = Date.now() - start + ' ms';
    console.log(err, {
        text,
        params,
        duration,
        err
    });
    throw new Error(err);
  })
 },
}
