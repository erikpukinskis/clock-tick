var library = require("module-library")(require)

module.exports = library.export(
  "id-card",
  [library.ref(), "paint-on-picture", "web-host", "bridge-module", "web-element", "browser-bridge", "html-painting"],
  function(lib, paintOnPicture, host, bridgeModule, element, BrowserBridge, htmlPainting) {

    var bridge = new BrowserBridge()

    var picture = bridge.defineSingleton("picture", function() { return {} })

    var paintingUniverse = bridge.defineSingleton(
      "paintingUniverse",
      [bridgeModule(lib, "tell-the-universe", bridge), bridgeModule(lib, "html-painting", bridge), picture],
      function(aWildUniverseAppeared, htmlPainting, picture) {
        var node

        var paintingUniverse = aWildUniverseAppeared("paintings", {
          htmlPainting: "html-painting"})

        paintingUniverse.mute()

        paintingUniverse.onStatement(function(call, args) {
          if (call == "htmlPainting") {
            picture.paintingId = args[0]
            document.querySelector(".id-card").style.display = "block"
            htmlPainting.renderTo(picture.paintingId, ".id-photo-swatches")
          } else if (call == "htmlPainting.stroke") {
            var bounds = args[2]
            updateViewport(bounds)
          }
        })

        function updateViewport(bounds) {
          if (typeof picture.minX == "undefined" || bounds.minX < picture.minX) {
            picture.minX = bounds.minX
          }
          if (typeof picture.maxX == "undefined" || bounds.maxX > picture.maxX) {
            picture.maxX = bounds.maxX
          }
          if (typeof picture.minY == "undefined" || bounds.minY < picture.minY) {
            picture.minY = bounds.minY
          }
          if (typeof picture.maxY == "undefined" || bounds.maxY > picture.maxY) {
            picture.maxY = bounds.maxY
          }

          var widthUsed = picture.maxX - picture.minX
          picture.scale = idCard.TARGET_WIDTH/widthUsed
          picture.offsetLeft = -Math.ceil(picture.minX)
          picture.offsetTop = -Math.ceil(picture.minY)

          document.querySelector(".id-photo-swatches").style.transform = "scale("+picture.scale+") translate("+picture.offsetLeft+"px, "+picture.offsetTop+"px)"

        }

        return paintingUniverse
      }
    )

    var painting = paintOnPicture(bridge, paintingUniverse)


    var persistCharacter = bridge.defineFunction(
      [paintingUniverse, picture, bridgeModule(lib, "tell-the-universe", bridge), bridgeModule(lib, "./character", bridge)],
      function persistCharacter(paintingUniverse, picture, aWildUniverseAppeared, character, event) {

        paintingUniverse.persistToLocalStorage()
        paintingUniverse.persistNow()

        var characterUniverse = aWildUniverseAppeared("characters", {character: character})
        characterUniverse.persistToLocalStorage()

        var name = document.querySelector(".name-input").value

        var avatar = {
          paintingId: picture.paintingId,
          offsetLeft: picture.offsetLeft,
          offsetTop: picture.offsetTop,
          scale: picture.scale
        }

        var id = character(null, name, avatar)

        document.querySelector(".character-id-input").value = id
        characterUniverse.do("character", id, name, avatar)
      }
    )

    var id = element(
      "form.id-card",
      {method: "post", action: "/avatars", onsubmit: persistCharacter.withArgs(bridge.event).evalable()},
      element.style({"display": "none"}),[
      element(".label", "IDENTIFICATION"),
      element(".id-photo", element(".id-photo-swatches")),
      element("input.name-input", {type: "text", placeholder: "Your Name", name: "name"}),
      element("input.character-id-input", {type: "hidden", name: "characterId"}),
      element("input", {type: "submit", value: "Issue card"}, element.style({"margin-top": "10px"})),
    ])

    var idStyle = element.style(".id-card", {
      "border": "5px solid #eee",
      "color": "#ccc",
      "background": "#dff",
      "border-radius": "10px",
      "margin-top": "10px",
      "width": "260px",
      "height": "140px",

      " .label": {
        "text-align": "center",
        "border-radius": "7px 7px 0 0",
        "background": "#77f",
        "color": "#dff",
        "text-align": "center",
        "font-size": "12px",
        "font-weight": "bold",
        "line-height": "20px",
      },

      " .name-input": {
        "width": "130px",
      },

      " .id-photo": {
        "float": "left",
        "position": "relative",
        "overflow": "hidden",
        "margin": "10px",
        "width": "70px",
        "height": "90px",
        "background": "#e7e2f6",
      },

      " .id-photo-swatches": {
        "position": "absolute",
      },
    })

    var narrowPic = element.style(".trace", {"max-width": "400px"})

    var page = element([
      painting,
      id,
      element.stylesheet(idStyle, narrowPic)
    ])

    function idCard(site, onAvatar) {
      site.addRoute("post", "/avatars", function(request, response) {
        var name = request.body.name
        var id = request.body.characterId
        onAvatar(id, name, response)
      })

      site.addRoute("get", "/id-card", bridge.requestHandler(page))
    }

    idCard.TARGET_WIDTH = 70

    return idCard
  }
)


