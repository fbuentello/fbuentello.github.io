module.exports = function(grunt) {

	// grunt config
	require('load-grunt-tasks')(grunt);

	var watchFiles = {
		viewFiles: ['app/index.html'],
		lessFiles: ['app/less/**/*.less'],
		cssFiles: ['app/css/**/*.css'],
		jsFiles: ['app/js/**/*.js'],
		imagesFiles: ['app/images/*']
	};
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			base: {
				src: ['js/src/*.js'],
				dest: 'js/base.js',
			},
			project: {
				src: ['js/src-project/*.js'],
				dest: 'js/project.js'
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					base: [
					'app'
					]
				}
			},
		},
		cssmin: {
			base: {
				src: ['css/base.css'],
				dest: 'css/base.min.css'
			},
			project: {
				src: ['css/project.css'],
				dest: 'css/project.min.css'
			}
		},

		less: {
			development: {
				files: {
					"app/css/fabian.css": watchFiles.lessFiles
				}
			}
		},
		uglify: {
			base: {
				files: {
					'js/base.min.js': ['js/base.js']
				}
			},
			project: {
				files: {
					'js/main.min.js': ['js/app.js']
				}
			}
		},

		watch: {
			clientViews: {
				files: watchFiles.viewFiles,
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.cssFiles,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.jsFiles,
				options: {
					livereload: true
				}
			},
			clientImages: {
				files: watchFiles.imagesFiles,
				options: {
					livereload: true
				}
			},
			clientLESS: {
				files: watchFiles.lessFiles,
				tasks: ['less'],
				options: {
					livereload: true,
				}
			},
		},

		// dev update
		devUpdate: {
			main: {
				options: {
					semver: false,
					updateType: 'prompt'
				}
			}
		}
	});
grunt.registerTask('serve', function (target) {
	grunt.task.run([
		'connect:livereload',
		'watch'
		]);
});
};


