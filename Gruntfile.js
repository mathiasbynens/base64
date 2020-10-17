module.exports = function(grunt) {

	grunt.initConfig({
		'shell': {
			'options': {
				'stdout': true,
				'stderr': true,
				'failOnError': true
			},
			'cover-html': {
				'command': 'istanbul cover --report "html" --verbose --dir "coverage" "tests/tests.js"'
			},
			'cover-coveralls': {
				'command': 'istanbul cover --verbose --dir "coverage" "tests/tests.js" && coveralls < coverage/lcov.info; rm -rf coverage/lcov*'
			},
			'test-node': {
				'command': 'echo "Testing in Node..."; npm test'
			},
			'test-browser': {
				'command': 'echo "Testing in a browser..."; open "tests/index.html"; open "tests/index.html?norequire=true"'
			}
		},
		'template': {
			'build': {
				'options': {
					'data': function() {
						return require('./scripts/export-data.js');
					}
				},
				'files': {
					'base64.js': ['src/base64.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('cover', 'shell:cover-html');
	grunt.registerTask('ci', [
		'template',
		'shell:test-node'
	]);
	grunt.registerTask('test', [
		'ci',
		'shell:test-browser'
	]);

	grunt.registerTask('fetch', [
		'shell:fetch',
		'build'
	]);

	grunt.registerTask('build', [
		'default'
	]);

	grunt.registerTask('default', [
		'template',
		'shell:test-node'
	]);

};
