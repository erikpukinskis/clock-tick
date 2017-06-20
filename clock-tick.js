var library = require("module-library")(require)

library.define(
  "tick",
  ["web-host", "web-element", "basic-styles", "browser-bridge", "tell-the-universe"],
  function(host, element, basicStyles, BrowserBridge, tellTheUniverse) {

    var ticks = 0

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)

    var page = element.template.container(
      "form.page",
      element.style({
        "max-width": "240px",
        "min-height": "320px",
        "padding-top": "30px",
        "box-sizing": "border-box",
        "text-align": "center",
        "background": "#eee",
      })
    )

    bridge.addToHead(element.stylesheet(page))


    var whatShouldHappen = [
      element("h1", "What should happen?"),
      element(
        "input",
        {name: "statement", type: "text"}
      ),
      element("p", element(
        "input",
        {type: "submit", value: 
        "I have told it"}
      )),
    ]
    var ask = page(whatShouldHappen
    )
    ask.addAttributes({
      method: "POST", action: "/statements"})

    // all statements will be

    // all stories will be

    host.onSite(function (site) {

      site.addRoute("get", "/tick", function(request, response) {
        ticks++
        bridge.forResponse(response).send(ask)
      })

      site.addRoute("get", "/again", function(request, response) {
        var tickAgain = page(
          element("h1", "You are "+ticks+" ticks old."),
          element("a.button", "Tick", {href: "/tick"})
        )
        bridge.forResponse(response).send(tickAgain)
      })

      var universe = tellTheUniverse.called("statements").withNames({
        "statement": "statement"
      })

      site.addRoute("post", "/statements", function(request, response) {

        universe.do("statement", "text", request.body.statement)

        response.redirect("/again")
      })

    })


    return {}
  }
)

library.get("tick")