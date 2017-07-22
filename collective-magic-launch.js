var clockTick = require(".")

// HERE YOU GO ERIK FUCKIN SQUEEZE THIS SHIT THROUGH A FUCKIN HOLE BITCH


var library = require("module-library")(require)


library.define("ticks", function() { return [
  "tap give me work",
  "tap Take a photo",
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


library.using(
  ["web-host", "browser-bridge", "web-element", "bridge-module", "add-html", "ticks", "basic-styles"],
  function(host, BrowserBridge, element, bridgeModule, addHtml, ticks, basicStyles) {

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)
    var page = [
      element("h1", "Here's a goal."),
      element("Make it so you can "+ticks[0])
    ]
    
    host.onSite(function(site) {
      site.addRoute("get", "/hole", bridge.requestHandler(page))
    })

  }
)


