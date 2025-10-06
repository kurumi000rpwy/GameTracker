const mongoose = require('mongoose');
const chalk = require('chalk');

const mongo_url = "mongodb+srv://cristianmanuel:Kobayashi.27@jc.ojklatp.mongodb.net/?retryWrites=true&w=majority&appName=JC";

async function connectDB(){
	try{
		await mongoose.connect(mongo_url);
		console.log(`La conexion a la base de datos fue ${chalk.green("exitosa")}.`);
	}catch(error){
		console.log(chalk.red(`No se pudo conectar a la base de datos, error: ${error}`));
	};
};

module.exports = connectDB;
