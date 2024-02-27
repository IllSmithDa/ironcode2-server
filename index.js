const express =  require('express');
const dotenv =  require('dotenv');
const bodyParser =  require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
var compression = require('compression')


const routes = require('./routes');
const {client, connectClient} = require('./db')

dotenv.config();
const corsOptions = require('./corsOptions');

connectClient();
client.connect();

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(compression({ filter: shouldCompress }))
app.set("trust proxy", 1);


// creat new session

// note that sameSite and secure must be reenabled when using the cookie in production and must be disabled when using localhost 
app.use(expressSession({
  genid: function() {
    // https://geshan.com.np/blog/2022/01/nodejs-uuid/
    return crypto.randomUUID() // use UUIDs for session IDs
  },
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // sameSite: 'None', 
    // secure: false,
    httpOnly: false
  },
  proxy: true,
  name: 'new_cookie_ironcodeman',
  resave: true,
  saveUninitialized: true,
  store:  new pgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions' 
  }),
}))


// https://stackoverflow.com/questions/72224168/why-is-my-cookie-not-being-saved-on-safari-but-being-saved-on-chrome
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  // res.header("Cache-Control", "no-store,no-cache,must-revalidate");
  res.header("Cache-Control", "public, max-age=31536000, immutable");
  res.header("Access-Control-Allow-Headers", ["Content-Type","X-Requested-With","X-HTTP-Method-Override","Accept"]);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  // res.header("Vary", "Origin");
  next();
})


const port = process.env.PORT;
app.listen(port || 5000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


routes(app);