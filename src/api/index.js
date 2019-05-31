import { version } from '../../package.json';
import { Router } from 'express';
import parking from './parking';

export default ({ config, db }) => {
	let api = Router();

	// mount the parking resource
	api.use('/parking', parking({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
