import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import parking from './models/parking'

const request = require('request')

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.use('/', express.static('ui'));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

const minutes = 5, interval = minutes * 60 * 1000;

setInterval(() => {
	request('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json', {}, (err, res, body) => {
		if(err) {return console.log(err)}
		body = JSON.parse(body)
		body = body.map(m => {
			return {
				'name': m.name,
				'available': m.parkingStatus.availableCapacity,
				'total': m.parkingStatus.totalCapacity,
				'open': m.parkingStatus.open 
			}
		})
		parking.push({
			datetime: new Date(),
			parking: body
		})
	})
	
}, interval)

export default app;
