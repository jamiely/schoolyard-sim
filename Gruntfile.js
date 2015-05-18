/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  var webpackConfig = require('./webpack.config.js');
  var stagingDirectory = '.tmp';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    bowerInstall: {
      default: {
        src: 'app/index.html'
      },
      test: { // https://github.com/stephenplusplus/grunt-wiredep/issues/35
        src: 'karma.conf.js',
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
              js: /'.*\.js'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },
    clean: ['dist', '.tmp'],
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      // for development
      watchAndWebpackServer: ['watch', 'webpack-dev-server:start']
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'app'
        }
      }
    },
    copy: {
      build: {
        files: [
          { src: 'bower_components/**', expand: true, dest: stagingDirectory, cwd: 'app' }
        ]
      },
      dist: {
        files: [
          { src: 'css/*', expand: true, dest: 'dist', cwd: 'app' }
        ]
      }
    },
    filerev: {
      js: {
        files: [
          {
            src: '.tmp/js/scripts.js',
            dest: 'dist/js'
          },
          {
            src: '.tmp/js/vendor.js',
            dest: 'dist/js'
          }
        ]
      }
    },
    htmlbuild: {
      options: {
        parseTag: 'htmlbuild'
      },
      dev: {
        src: 'src/html/index.html',
        dest: 'app/'
      },
      dist: {
        src: 'src/html/index.html',
        dest: stagingDirectory + '/index.html'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true
        },
        files: {
          'dist/index.html': '.tmp/index.html'
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:8080/index.html'
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
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '.tmp/',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: '.tmp/index.html',
      options: {
        assetsDirs: ['.tmp/']
      }
    },
    watch: {
      options: {
        livereload: true
      },
      styles: {
        files: ['src/styles/*.scss'],
        tasks: ['sass:dist']
      },
      js: {
        files: ['src/scripts/**'],
        tasks: ['jshint']
      },
      html: {
        files: ['app/index.html']
      },
      grunt: {
        files: ['Gruntfile.js'],
        options: {
          livereload: false
        }
      }
    },
    webpack: {
      dist: {
        context: webpackConfig.context,
        entry: webpackConfig.entry,
        output: {
          path: stagingDirectory + '/js',
          filename: webpackConfig.output.filename
        }
      }
    },
    "webpack-dev-server": {
      options: {
        webpack: webpackConfig,
        publicPath: '/js/',
        contentBase: 'app/',
        hot: true,
        inline: true,
        port: 9090
      },
      start: {
        keepAlive: true,
        webpack: {
          devtool: 'source-map',
          debug: true
        }
      }
    },
    debug: {a:{}}
  });

  grunt.registerTask('default', ['connect', 'build:dev',
                     'concurrent:watchAndWebpackServer',
                     'open']);

  grunt.registerTask('build:dev', ['htmlbuild:dev']);
  grunt.registerTask('build:dist', [
    'htmlbuild:dist', 'webpack:dist', 'copy:build',
    'useminPrepare', 'concat:generated', 'uglify:generated', 'filerev', 'usemin',
    'copy:dist', 'htmlmin:dist']);

  grunt.registerTask('dist', ['htmlbuild:dist']);
};
