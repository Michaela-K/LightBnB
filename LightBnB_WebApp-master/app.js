const database = require('./server/database');
const apiRoutes = require('./server/apiRoutes');
const userRoutes = require('./server/userRoutes');

const path = require('path');

const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// /api/endpoints
const apiRouter = express.Router();
apiRoutes(apiRouter, database);
app.use('/api', apiRouter);

// /user/endpoints
const userRouter = express.Router();
userRoutes(userRouter, database);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, './public')));

// 404 Not Found Page
app.get("*", (req, res) => { 
  res.send("404 Not Found :)");
});

const port = process.env.PORT || 3000; 
app.listen(port, (err) => console.log(err || `listening on port ${port} 😎`));