module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    sources: [
        "sources/*.coffee",
        "sources/models/*.coffee",
        "sources/views/*.coffee",
        "sources/controllers/*.coffee"]

    coffee:
      app  : files: "app/app.js": "<%= sources %>"


    watch:
      coffee:
        files: ["<%= sources %>"]
        tasks: ["coffee:app"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", [ "coffee"]
