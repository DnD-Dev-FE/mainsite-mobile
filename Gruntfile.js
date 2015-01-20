module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/config', 'dist/fonts','dist/images', 'dist/php'],
        copy: {
            main: {
                files: [
                    {expand: true, src: ['config/**'], dest: 'dist'},

                    {expand: true, src: ['fonts/**'], dest: 'dist'},

                    {expand: true, src: ['images/**'], dest: 'dist'},

                    {expand: true, src: ['php/**'], dest: 'dist'}
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
            css: {
                // the files to concatenate
                src: [
                    'css/font-awesome/font-awesome.css',
                    'css/screen.css',
                    'css/subpage.css'
                ],
                // the location of the resulting JS file
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'widgets/swiper/js/idangerous.swiper.min.js',
                    'js/modernizr.js',
                    'js/signals.min.js',
                    'js/hasher.min.js',
                    'js/crossroads.min.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                keepSpecialComments: 0
            },
            css: {
                src: '<%= concat.css.dest %>',
                dest: 'dist/css/<%= pkg.name %>.min.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            js: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
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

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy', 'concat', 'cssmin', 'uglify']);
};