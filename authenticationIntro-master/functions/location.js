'use strict';

const location = require('../models/location');

exports.locationUser = (user, longitude, latitude) => 

	new Promise((resolve,reject) => {

	    //const salt = bcrypt.genSaltSync(10);
		//const hash = bcrypt.hashSync(password, salt);

		const newlocation = new location({

			user: user,
			longitude: longitude,
			latitude: latitude,
	
		});

		newlocation.save()

		.then(() => resolve({ status: 201, message: 'location Registered Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'User location Already Registered ! !' });

			} else {

			reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});