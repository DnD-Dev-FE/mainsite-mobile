module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/config', 'dist/fonts','dist/images'],
        copy: {
            build: {
                files: [
                    {expand: true, src: ['config/**'], dest: 'dist'},

                    {expand: true, src: ['fonts/**'], dest: 'dist'},

                    {expand: true, src: ['images/**'], dest: 'dist'}
                    
                ]
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                process: function(src, filepath) {
                    var filepath = filepath.split('.');
                    var ext = filepath[filepath.length-1];
                    if ( ext == 'js' ) {
                        return src + ( src.substr(src.length-1) == ';' ? '' : ';' ) + '\n';
                    }
                    return src + '\n';
                }
            },
            minisub_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',                    
                    'js/modernizr.js',
                    'js/pattern.js',
                    'js/activeMenu.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.minisub.js'
            }

        },
        cssmin: {
            promotion_css: {
                files: {
                    'dist/css/<%= pkg.name %>.minisub.min.css': ['css/minisub.css']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            promotion_js: {
                files: {
                    'dist/js/<%= pkg.name %>.minisub.min.js': ['<%= concat.minisub_js.dest %>']
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // set of task(s).
    grunt.registerTask('build', ['clean', 'copy', 'concat', 'cssmin', 'uglify']);

    grunt.registerTask('build-js', ['concat', 'uglify']);

    grunt.registerTask('build-css', ['cssmin']);

    grunt.registerTask('build-promotion', ['concat:minisub_js', 'cssmin:minisub_css', 'uglify:minisub_js']);
};