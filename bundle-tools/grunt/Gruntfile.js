module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//clean: {
	      //css: 'e:/web/Public/home/css/**/*.min.css',
	      //js: 'e:/web/Public/home/js/**/*.min.js'
	    //},
   
        uglify:{
        	options:{
        		mangle:false,
        		report:'min'
        	},
        	build:{
        		files:[{
        			expand:true,
        			cwd:'e:/web/Public/home/js/',
        			src:['*.js','!*.min.js','!sea.js','{buy,cart,cheap,home,introduce,login,sell,user}/*.js','!{buy,cart,cheap,home,introduce,login,sell,user}/*.min.js'],
        			dest:'e:/web/Public/home/js/',
        			ext:'.min.js'
        		}]
        	}
        },

        /*jshint:{
        	build:['Gruntfile.js','e:/web/Public/home/js/{buy,cart,cheap,home,introduce,login,sell,user}/*.js','e:/web/Public/home/js/*.js'],
        	options:{
        		jshintrc:'.jshintrc'
        	}
        },*/

		cssmin: {
	        options: {
	          report: 'gzip'
	        },
	        target:{
		        //files:{'e:/web/Public/home/css/user/user_profile.min.css':'e:/web/Public/home/css/user/user_profile.css'}
		        files: [{
	              expand: true,
	              cwd: 'e:/web/Public/home/css/',
	              src: ['**/*.css'],
		          dest: 'e:/web/Public/home/css/',
		          ext:'.min.css'
		        }]        	
	        }
	    },

	    /*csslint:{
        	build:['e:/web/Public/home/css/{buy,cart,cheap,home,introduce,login,sell,user}/*.css'],
        	options:{
        		jshintrc:'.csslintrc'
        	}
        },*/

        watch:{
        	build:{
        		files:['Gruntfile.js','e:/web/Public/home/js/*.js','e:/web/Public/home/js/{buy,cart,cheap,home,introduce,login,sell,user}/*.js','e:/web/Public/home/css/{buy,cart,cheap,home,introduce,login,sell,user}/*.css'],
        		tasks:['uglify','cssmin'],
        		options:{spawn:false}
        	}
        }
	});
	//grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',['uglify','watch']);
};