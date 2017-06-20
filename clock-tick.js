var library = require("module-library")(require)

library.define(
  "tick",
  ["web-host", "web-element", "basic-styles", "browser-bridge"],
  function(host, element, basicStyles, BrowserBridge) {

    var ticks = 0

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)

    var page = element.template.container(
      ".page",
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

    var button = element("a.button", "Tick", {href: "/tick"})

    var start = page(
      element("h1", "You are "+ticks+" ticks old."),
      button
    )

    var ask = page(
      element("h1", "What should happen?"))

    host.onRequest(function(getBridge) {
      var bridge = getBridge()
      bridge.addToHead(element.stylesheet(page))
      basicStyles.addTo(bridge)
      bridge.send(start)
    })

    host.onSite(function (site) {
      site.addRoute("get", "/tick", bridge.requestHandler(ask))
    })


    return {}
  }
)

library.get("tick")