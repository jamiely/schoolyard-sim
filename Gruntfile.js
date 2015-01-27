/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-bower-install');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    bowerInstall: {
      default: {
        src: 'app/index.html'
      }
      //test: { // https://github.com/stephenplusplus/grunt-wiredep/issues/35
        //src: 'karma.conf.js',
        //fileTypes: {
          //js: {
            //block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            //detect: {
              //js: /'.*\.js'/gi
            //},
            //replace: {
              //js: '\'{{filePath}}\','
            //}
          //}
        //}
      //}
    },    
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      js: {
        files: [
          {
            src: 'src/scripts/**/*.js',
            dest: 'app/js/schoolyard-simulation.js'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'app'
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:8080/index.html'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded',
          sourcemap: 'inline'
        },
        files: {                         // Dictionary of files
          'app/css/main.css': 'src/styles/main.scss'
        }
      }
    },
    watch: {
      styles: {
        files: ['src/styles/*.scss'],
        tasks: ['sass:dist']
      },
      scripts: {
        files: ['src/scripts/**/*.js', 'Gruntfile.js'],
        tasks: ['concat:js']
      }
    }
  });

  // Default task.
  //grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['connect', 'open', 'concat:js', 'watch']);
  

};
