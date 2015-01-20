module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/config', 'dist/fonts','dist/images', 'dist/php'],
        copy: {
            build: {
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
            homepage_css: {
                // the files to concatenate
                src: [
                    'css/font-awesome/font-awesome.css',
                    'css/screen.css'
                ],
                // the location of the resulting JS file
                dest: 'dist/css/<%= pkg.name %>.homepage.css'
            },
            homepage_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'widgets/swiper/js/idangerous.swiper.min.js',
                    'js/modernizr.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.homepage.js'
            },
            subpage_css: {
                // the files to concatenate
                src: [
                    'css/font-awesome/font-awesome.css',
                    'css/screen.css',
                    'css/subpage.css'
                ],
                // the location of the resulting JS file
                dest: 'dist/css/<%= pkg.name %>.subpage.css'
            },
            subpage_js: {
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
                dest: 'dist/js/<%= pkg.name %>.subpage.js'
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                keepSpecialComments: 0
            },
            homepage_css: {
                src: '<%= concat.homepage_css.dest %>',
                dest: 'dist/css/<%= pkg.name %>.homepage.min.css'
            },
            subpage_css: {
                src: '<%= concat.subpage_css.dest %>',
                dest: 'dist/css/<%= pkg.name %>.subpage.min.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            homepage_js: {
                files: {
                    'dist/js/<%= pkg.name %>.homepage.min.js': ['<%= concat.homepage_js.dest %>']
                }
            },
            subpage_js: {
                files: {
                    'dist/js/<%= pkg.name %>.subpage.min.js': ['<%= concat.subpage_js.dest %>']
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
    grunt.registerTask('build-homepage', ['concat:homepage_css', 'concat:homepage_js', 'cssmin:homepage_css', 'uglify:homepage_js']);
    grunt.registerTask('build-subpage', ['concat:subpage_css', 'concat:subpage_js', 'cssmin:subpage_css', 'uglify:subpage_js']);
};