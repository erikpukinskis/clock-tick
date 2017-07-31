var element = require("web-element")

    // ask-form

    function askForm(question, variableName, path, callToAction, callback) {
      var el = element("form.lil-page", {method: "post", action: "/statements"}, [
        element("p", question),
        element("p", element("input", {type: "text", name: variableName})),
        element("input", {type: "submit", value: callToAction}),
      ])

      el.addRoute = addFormRoute.bind(null, path, variableName, callback)

      return el
    }

    function addFormRoute(path, variableName, callback, site) {

      site.addRoute("post", path, handleFormResponse.bind(null, variableName, callback))
    }

    function handleFormResponse(variableName, callback, request, response) {
      var value = request.body[variableName]
      callback(value, response)
    }

    module.exports = askForm