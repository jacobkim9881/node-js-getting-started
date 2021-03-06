const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
//const session = require('express-session')
//const SequelizeStore = require("connect-session-sequelize")(session.Store);
//const sequelize = require('./db')
const sendmail = require('sendmail')()
const user = require('./user')

const PORT = process.env.PORT || 5000

const cors = require('cors');

const app = express();

app.use('/', user);

app.use('/static', express.static('public'));

app.use(cors());

app.set('trust proxy', 1) // trust first proxy
/*
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
      expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
  }),
  saveUninitialized: true,
  cookie: { secure: true }
}))
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

/*
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
*/


/*
class User extends Model {
  static getAdmin() {
  return 'admin'
  }

}

try {
  console.log('Get admin is successfull: ', User.getAdmin())
} catch(err) {
  console.log('Got an error while getting admin: ', err)
}

User.init({
  id: {
	  type: DataTypes.INTEGER,
	  primaryKey: true,
	  autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  salt: {
    type: DataTypes.STRING,
    timestamps: true	  
  },
	hash: {
		type: DataTypes.STRING,
		timestamps: true
	}	

},{
  sequelize,
  tableName: 'test_table'	
})

//// THIS MAKES THE TABLE DROPPED AND CREATE
//sequelize.sync({ force: true });
////


try {
  console.log('Defining table: ', User);
} catch(err) {
  console.log('Error is occured while defining table: ', err);

}

app.get('/', async (req, res) => {

  const users = await User.findAll();
  
  try {
  res.json(users);
  console.log('Select is successfull.');	 
  } catch(err) {
  console.log('Error is occured while select: ', err);
  res.end();	  
  }

})
  const url= 'https://localhost:3000/';
  const signupUrl = url + 'account-sign-up.html';	
  const signinUrl = url + 'account-sign-in.html';	

app.post('/create', async(req, res) => {
	console.log('req.body: ', req.body);
 const sameName = await User.findAll({
	  where: { name : req.body.name}
	  })

  if(!req.body.name) {
    console.log('Error is occured while post: Write name.');
    res.redirect(signupUrl);
  } else if(req.body.password !== req.body["signup-password-confirm"]) {

    console.log('Error is occured while post: passwords are not same.');
    res.redirect(signupUrl);
  } else if(sameName[0] !== undefined) {
  console.log('Has same name: ', req.body.name);
    res.redirect(signupUrl);
  } else {
await hash({ password: req.body.password }, (error, pass, salt, hash) =>{
 const time = new Date().getTime();
 const user1 = User.create({ name: req.body.name, salt: salt, hash: hash, createdAt: time, updatedAt: time }); 

 try {
  console.log('Post is successfull: ', user1._previousDataValues);
 } catch(err) {
  console.log('Error is occured while post: ', err);  
 }
 res.redirect(signinUrl);
 })

 }
})

app.get('/find/:userId', async (req, res) => {
  const userId = await User.findAll({
	  where: {
		  id: req.params.userId*1
	  }
  });

  try{
  console.log('Finding user by ID is successfull: ', JSON.stringify(userId));
  res.json(userId);	  
  } catch(err) {
  console.log('Error is occured while finding user by ID: ', err);
  res.end();	  
  }
	
})

app.post('/auth', async (req,res)=> {

  if(!req.body.name) {
    console.log('Error is occured while auth: Write name: ', req.body);
    res.redirect(signinUrl);
  } else {


  const user = await User.findAll({
    where: {
      name: req.body.name
    }
  })

  try{
  console.log('Loading id is successfull: ', user[0].dataValues);
  } catch(err) {
  console.log('Error is occured while loading id: ', err);  	 
  res.json({"Error": "Email address is not valid"});	  
  }
  const data = user[0].dataValues;

 hash({ password: req.body.password, salt:data.salt  }, (error, pass, salt, hash) => {
 if (error) {
  console.log('Error is occured while hash: ', error);
  res.redirect(signinUrl);	 
 } else if (hash === data.hash) {
 console.log('Auth is successfull: ', data.id, data.name)
req.session.loggedin = true;
  req.session.username = data.name;
  req.session.cookie.maxAge = 1000 * 60 * 60;	
	 console.log('res: ', res.req.session);
  console.log(req.session)	 
//  res.redirect(url)
  res.json( {  session: req.session  } )	 
 } else {
  console.log('Password is not valid');
  res.json({"Error": "Password is not valid"});	 
 }
 })

//res.json({name: data.name});
  }	 
})

app.post('/info', async (req, res) => {
  if (!req.body.name && !req.body.password && !req.body["new_password"]) {
  console.log('Information was not put');
  res.redirect(url + 'account-info.html');	  
  } else {
  const user = await User.findAll({
    where: {
      name: req.body.name
    }
  })

  try{
  console.log('Loading id is successfull: ', user[0].dataValues);	  
  } catch(err) {
  console.log('Error is occured while loading id: ', err);
  res.redirect(url + 'account-info.html');	  
  }
  const data = user[0].dataValues;

 new Promise((resolve, reject) => { hash({ password: req.body.password, salt:data.salt  }, (error, pass, salt, hash) => {
 if (error) {
  console.log('Error is occured while hash: ', error);
  res.redirect(url + 'account-info.html');	  
  reject();	
} else if (hash === data.hash) {
 console.log('Auth is successfull: ', data.id, data.name)
 resolve();	 
} else { 
 console.log('Password is not same');
// res.redirect(url + 'account-info.html');	 
 res.json({ "Error": "password is not valid"}); 
 reject();	
 } 	 
 })
 })
.then( () => { hash({ password: req.body["new_password"] }, async (error, pass, salt, hash) =>{
 if (error) {
 console.log('Error is occured while changing password: ', error);
 res.redirect(url + 'account-info.html');	  
 } else {
 const time = new Date().getTime();
 const updatedUser = await User.update({ 
	 salt: salt, 
	 hash: hash, 
	 updatedAt: time}, {
   where: {
     name: req.body.name
   }
 });	 

 console.log('User update is successful: ', updatedUser);	 
 res.redirect(url);	  

 }
 })
})
  }
})

app.get('/home', (req, res) => {
  console.log(req.session);
  res.end();
})

app.get('/email', (req,res) => {

  sendmail({
    from: 'jacobkim116@gmail.com',
    to: 'jacobkim9881@gmail.com ',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});	

  res.end();
})
*/
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
