

// HERE YOU GO ERIK FUCKIN SQUEEZE THIS SHIT THROUGH A FUCKIN HOLE BITCH


var library = require("module-library")(require)


library.define("tasks", function() { return [
  "tap Give me work",
  "tap Choose a picture",
  "a picture appears",
  "paint some swatches",
  "type a name",
  "tap Issue card",
  "see avatar on id card",
  "see your avatar next to the It is done button",
  "see an assignment",
  "see an avatar when you start the server again",
  "see the name below the avatar",
  "tap Clock in and help",
  "see Erik is helping",
  "tap Clock out",
  "tap It's done",
  "tap Take a photo",
  "see the photo in an IMG",
  "paint pixels",
  "type Erik",
  "tap New Creature",
  "tap somewhere and creature moves",
  "tap Issue House panel bond",
  "see Bond for sale: Issued by Erik",
  "click Buy Bond - $100",
  "see You have purchased this bond!",
  "see \"Erik purchased this bond... payment pending\"",
  "enter a name and phone number and tap Continue",
  "(click Cancel purchase)",
  "Erik gets a text: so-and-so bought a bond click to generate receipt",
  "Someone clicks tick, they get the first task from the bond: \"Reserve a truck\" Are you ready to clock in?",
  "Tap Clock in. Rent the truck.",
  "Tap Clock out",
  "Bondholder gets notice of work",
  "They tap \"Send Invoice\", Erik gets a text",
  "When they receive the cash, they tap Mark Invoice Paid",
  "Bondholder gets notice of balance change",
  "[more tasks done]",
  "Tap Issue House Panel Deed",
  "Tap Buy House Panel Deed",
  "Erik gets a text: so-and-so bought a house panel click to generate receipt",
  "Erik marks receipt paid",
  "Bondholder receives bond maturation notification",
  "Bondholder clicks cash out",
  "Erik gets a text: so-and-so sold their shares click to generate receipt",
  "Bondholder marks receipt paid",
]})


library.define(
  "work",
  function() {
      var sessionsByTaskId = {}
      var currentAssignments = {}

      var work = {
        start: function(name, characterId, taskId, startTime) {
          var session = {name: name, characterId: characterId, taskId: taskId, startTime: startTime}
          var sessions = sessionsByTaskId[taskId]
          if (!sessions) {
            sessions = sessionsByTaskId[taskId] = []
          }
          sessions.push(session)
        },
        sessionsForTask: function(taskId) {
          return sessionsByTaskId[taskId] || []
        }
    }

    return work
  }
)

library.using(
  [library.ref(), "web-host", "browser-bridge", "web-element", "bridge-module", "add-html", "tasks", "basic-styles", "tell-the-universe", "./id-card", "./character", "work"],
  function(lib, host, BrowserBridge, element, bridgeModule, addHtml, tasks, basicStyles, aWildUniverseAppeared, idCard, character, work) {

    var finishedTasks = []
    var finishedCount = 0

    var baseBridge = new BrowserBridge()
    basicStyles.addTo(baseBridge)

    var nextTaskId = 0

    var characters = aWildUniverseAppeared("characters", {
      character: "./character"
    })

    var s3Options = {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
    }
    characters.persistToS3(s3Options)
    characters.load()

    function giveAssignment(request, response) {

      var bridge = new BrowserBridge()
      basicStyles.addTo(bridge)

      var meId = request.cookies.characterId

      if (!meId) {
        response.redirect("/id-card")
        return
      }

      var myName = character.getName(meId)

      var workSessions = element(
        "ul",
        work.sessionsForTask(nextTaskId).map(renderSession)
      )

      function renderSession(session) {
        var description = session.name+" has been helping for "+timeBetween(new Date(session.startTime), new Date())
        return element("li", description)
      }

      function timeBetween(start, end) {
        var seconds = (end - start)/1000
        var minutes = Math.round(seconds/60)
        return minutes+" minutes"
      }

      var swatches = bridge.defineSingleton("swatches",
        function swatches() { return {} }
      )

      var paintSwatch = bridge.defineFunction(
        [swatches, bridgeModule(lib, "add-html", bridge), bridgeModule(lib, "web-element", bridge)],
        function paintSwatch(swatches, addHtml, element, bounds, color) {


          var div = element(element.style({
            "position": "absolute",
            "background": color,
            "left": bounds.minX+"px",
            "top": bounds.minY+"px",
            "width": (bounds.maxX - bounds.minX)+"px",
            "height": (bounds.maxY - bounds.minY)+"px",
          }))

          addHtml.inside(swatches.node, div.html())
        }
      )

      var percent = Math.round(finishedCount/tasks.length*100)+"%"

      var avatarStyle = element.style(".avatar", {

        "position": "absolute",
        "top": "300px",
        "left": "200px",

        " .swatches": {
        },

        " .name": {
          "position": "absolute",
          "top": "-30px",
          "width": idCard.TARGET_WIDTH+"px",
          "text-align": "center",
          "font-weight": "bold",
        },
      })

      function postButton(label, action, data) {
        var form = element(
          "form",
          element.style({"display": "inline"}),
          {method: "POST", action: action},[
          element("input", {type: "submit", value: label}),
        ])

        if (data) {
          for(var key in data) {
            var field = element("input", {type: "hidden", name: key, value: data[key].toString()})
            form.addChild(field)
          }
        }

        return form
      }

      var page = element(".lil-page", [
        element("p", finishedCount+"/"+tasks.length+" til Collective Magic ("+percent+")"),
        element("h1", "Here's a goal."),
        element("p", "Make it so you can "+tasks[nextTaskId]+"."),
        postButton("It is done.", "/finish", {taskId: nextTaskId}),
        " ",
        postButton("Clock in and help", "/work-session", {taskId: nextTaskId}),
        workSessions,
        element(".avatar", [
          element(".swatches"),
          element(".name", myName)
        ]),
        element.stylesheet(avatarStyle),
      ])        

      bridge.domReady(
        [swatches, bridgeModule(lib, "html-painting", bridge), bridgeModule(lib, "character", bridge), bridgeModule(lib, "tell-the-universe", bridge), meId],
        function(swatches, htmlPainting, character, aWildUniverseAppeared, meId) {

          var paintings = aWildUniverseAppeared("paintings", {htmlPainting: htmlPainting})
          paintings.persistToLocalStorage()
          paintings.load()

          var characterUniverse = aWildUniverseAppeared("characters", {character: character})
          characterUniverse.persistToLocalStorage()
          characterUniverse.load()

          var picture = character.getPicture(meId)

          var transform = "scale("+picture.scale+") translate("+picture.offsetLeft+"px, "+picture.offsetTop+"px)"

          swatches.node = document.querySelector(".swatches")
          swatches.node.style.transform = transform 


          if (!picture.paintingId) {
            throw new Error("No painting id")
          }

          htmlPainting.playBackInto(picture.paintingId, ".swatches")
        }
      )

      var content = page.html()
      bridge.forResponse(response).send(content)
    }


    
    var getWork = [
      element("a.button", "Give me work", {href: "/assignment"}),
    ]

    host.onSite(function(site) {
      site.addRoute("get", "/assignment", giveAssignment)

      site.addRoute("post", "/finish", function(request, response) {
        var id = request.body.taskId
        if (!id) {
          throw new Error("wtf")
        }
        finishedTasks[id] = true
        finishedCount++
        nextTaskId++
        response.redirect("/assignment")
      })

      var workLog = aWildUniverseAppeared("work", {
          work: "work"})

      site.addRoute("post", "/work-session", function(request, response) {
        var taskId = request.body.taskId
        var meId = request.cookies.characterId
        var name = character.getName(meId)
        var when = new Date().toString()
        work.start(name, meId, taskId, when)

        workLog.do("work.start", name, meId, taskId, when)

        response.redirect("/assignment")
      })

      site.addRoute("get", "/give-me-work", baseBridge.requestHandler(getWork))

      idCard(site, onAvatar)
    })

    var minutes = 60
    var hours = 60*minutes
    var days = 24*hours
    var years = 365*days

    function onAvatar(meId, name, response) {

      character(meId, name)

      characters.do("character", meId, name)

      response.cookie(
        "characterId",
        meId,{
        maxAge: 10*years,
        httpOnly: true})

      response.redirect("/assignment")
    }

  }
)


