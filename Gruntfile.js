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
            homepage_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'widgets/swiper/js/idangerous.swiper.min.js',
                    'js/modernizr.js',
                    'js/pattern.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.homepage.js'
            },
            posts_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'widgets/swiper/js/idangerous.swiper.min.js',
                    'js/modernizr.js',
                    'js/signals.min.js',
                    'js/hasher.min.js',
                    'js/crossroads.min.js',
                    'js/pattern.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.posts.js'
            },
            post_details_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'js/modernizr.js',
                    'js/pattern.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.post-details.js'
            },
            gallery_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'js/modernizr.js',
                    'js/pattern.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.gallery.js'
            },
            search_js: {
                // the files to concatenate
                src: [
                    'js/jquery2.min.js',
                    'js/modernizr.js',
                    'js/pattern.js',
                    'js/main.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/js/<%= pkg.name %>.search.js'
            }
        },
        cssmin: {
            homepage_css: {
                files: {
                    'dist/css/<%= pkg.name %>.homepage.min.css': ['css/screen.css']
                }
            },
            subpage_css: {
                files: {
                    'dist/css/<%= pkg.name %>.subpage.min.css': ['css/subpage.css']
                }
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
            posts_js: {
                files: {
                    'dist/js/<%= pkg.name %>.posts.min.js': ['<%= concat.posts_js.dest %>']
                }
            },
            post_details_js: {
                files: {
                    'dist/js/<%= pkg.name %>.post-details.min.js': ['<%= concat.post_details_js.dest %>']
                }
            },
            gallery_js: {
                files: {
                    'dist/js/<%= pkg.name %>.gallery.min.js': ['<%= concat.gallery_js.dest %>']
                }
            },
            search_js: {
                files: {
                    'dist/js/<%= pkg.name %>.search.min.js': ['<%= concat.search_js.dest %>']
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

    grunt.registerTask('build-homepage', ['concat:homepage_js', 'cssmin:homepage_css', 'uglify:homepage_js']);

    grunt.registerTask('build-subpage', [
        'concat:posts_js',
        'concat:post_details_js',
        'concat:gallery_js',
        'concat:search_js',

        'cssmin:subpage_css',

        'uglify:posts_js',
        'uglify:post_details_js',
        'uglify:gallery_js',
        'uglify:search_js'
    ]);
};