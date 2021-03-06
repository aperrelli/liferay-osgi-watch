'use strict';

const fs = require('fs');
const gradle = require('./gradle');
const log = require('./log');

module.exports = () => {
	return new Promise((resolve, reject) => {
		if (global.projectDeps) {
			resolve(global.projectDeps);
		} else if (fs.existsSync('build.gradle')) {
			gradle(['dependencies', '--configuration', 'compile']).then(
				gradleOutput => {
					let projectDeps = gradleOutput
						.split('\n')
						.filter(line => line.indexOf('project :') > -1)
						.map(depLine =>
							depLine.replace(/(\+|\\)--- project /, ''),
						);

					global.projectDeps = projectDeps;

					resolve(projectDeps);
				},
				error => {
					log.warn(
						'projectDeps',
						'Unable to get compile dependencies from gradle. ' +
							'Trying to continue without it...',
					);
					resolve([]);
				},
			);
		} else {
			resolve([]);
		}
	});
};
