var library = require("module-library")(require)

module.exports = library.export(
  "character",
  ["identifiable"],
  function(identifiable) {
    var names = {}
    var avatars = {}

    function character(id, name, avatar) {
      if (typeof name == "undefined") {
        throw new Error("No name")
      }
      if (!id) {
        id = identifiable.assignId(names, name)
      }
      names[id] = name
      avatars[id] = avatar
      return id
    }

    character.getPicture = identifiable.getFrom(avatars, {description: "avatar"})

    character.getName = identifiable.getFrom(names, {description: "character name"})

    return character
  }
)