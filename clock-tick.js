var library = require("module-library")(require)


var ticks = [
  "run",
  "cook dinner",
  "do a pomodoro",
]

var notDo = [
  "be mean on the internet"
]





library.define(
  "tick",
  ["web-host", "web-element", "basic-styles", "browser-bridge", "tell-the-universe"],
  function(host, element, basicStyles, BrowserBridge, tellTheUniverse) {

    var ticks = 0

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)


    var whatAreYouDoing = [
      element("h1", "What are you doing?"),
      element(
        "input",
        {name: "log", type: "text"}
      ),
      element("p", element(
        "input",
        {type: "submit", value: 
        "It is being done"}
      )),
    ]

    var log = element("form.lil-page", whatAreYouDoing, {
      method: "POST", action: "/log"})


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

    var startSomething = element("form.lil-page", whatShouldHappen, {method: "POST", action: "/statements"})

    // all statements will be

    // all stories will be

    var noticationBridge = bridge.copy()

    var subscribe = noticationBridge.defineFunction(function requestNotificationPrivileges() {

      Notification.requestPermission(sayHey)

      function sayHey(permission) {
        if (permission != "granted") { return }

        var notification = new Notification("Time to log! Click here now")

         notification.onclick = function() { 
          window.location.href = "http://localhost:1413/log"
        }
      }
    })



    var log = element(".lil-page", [
      element("p", "I recommend you start logging what you're up to."),
      element("p", element("input", {type: "text", placeholder: "What are you doing right now?"})),
      element("button", "Log it"),
      " ",
      element("button", "No thanks"),
    ])



    var subscriptionRequest = element(".lil-page", [
      element("p", "Logging works best if you do it regularly. If you enable notifications, I can help you remember to."),
      element("button", "Sign up for logging", {onclick: subscribe.evalable()})
    ])



    var waves = element(".lil-page", [
      element("p", "You usually drink coffee around this time. If you do it right now, you'll increase your waviness 50pts"),
      element("button", "I made coffee!"),
      " ",
      element("button", "I don't want coffee"),
    ])



    var talkToSomeone = element(".lil-page", [
      element("p", "Talk to me!"),
      element("input.thing-to-say", {type: "text"}),
      element("button", {onclick: sayIt.withArgs(".thing-to-say").evalable()}, "Say it")
    ])


    host.onSite(function (site) {

      site.addRoute("get", "/waves", bridge.sendPage(waves))

      site.addRoute("get", "/hi", bridge.sendPage(talkToSomeone))

      site.addRoute("get", "/log", bridge.sendPage(log))

      site.addRoute("get", "/notify", noticationBridge.sendPage(subscriptionRequest))

      site.addRoute("get", "/tick", function(request, response) {
        ticks++
        bridge.forResponse(response).send(startSomething)
      })

      site.addRoute("get", "/again", function(request, response) {
        var tickAgain = element(".lil-page", 
          element("h1", "You are "+ticks+" ticks old."),
          // element("p", "WAVINESS 25pts"),
          element("a.button", "Tick", {href: "/tick"})
        )
        bridge.forResponse(response).send(tickAgain)
      })

      var universe = tellTheUniverse.called("statements").withNames({
        "statement": "statement"
      })

      // tellTheUniverse.loadFromSimperium(function() {
      //   console.log("// log has been played back")
      // })

      site.addRoute("post", "/statements", function(request, response) {

        universe.do("statement", "text", request.body.statement)

        response.redirect("/again")
      })

    })


    return {}
  }
)

library.get("tick")