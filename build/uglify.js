module.exports = {
    all: {
        my_target: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
            },
            files: {
                'dist/js/lib.min.js': ['dist/js/lib.js'],
                'dist/js/binary.min.js': ['dist/js/binary.js']
            }
        }
    }
};
