module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        src: ["**/*.ts", "!node_modules/**/*.ts"],
        watch: "."  //will re-run this task if any .ts or .html file is changed.
      },
      options: {
        comments: true, //preserves comments in output.
        compiler: 'C:/Users/Gunnar/AppData/Roaming/npm/node_modules/typescript/bin/tsc' // Specify the compiler to use
        }        
      }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};