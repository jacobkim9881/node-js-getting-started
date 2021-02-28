const {Sequelize} = require('sequelize')

const sequelize = process.env.USER == 'kim' ?
	new Sequelize('postgres', 'postgres', '1', {
  host: 'localhost',
  dialect: 'postgres'
}) :
new Sequelize(process.env.DATABASE_URL);

try {
  console.log('sequelize connecting: ', sequelize.config);
} catch(err) {
  console.log('Got an error while sequelize connecting: ', err);
}

module.exports = sequelize 
