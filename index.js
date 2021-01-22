const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

const cors = require('cors');

const { Pool } = require('pg');

const poolConfig = {
  host: 'localhost',
  user: 'postgres',
  database: 'postgres',
  password: '1',	
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000	
}

const heroPool = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

const getPool = process.env.USER == 'kim' ? poolConfig : heroPool;

const pool = new Pool(getPool);

const app = express();

app.use('/static', express.static('public'));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app
  .get('/', async (req, res) => {	  
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
