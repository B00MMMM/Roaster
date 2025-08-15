require('dotenv').config();
const mongoose = require('mongoose');
const Roast = require('./models/Roast');

// Sample roasts to seed the database
const sampleRoasts = [
  // Savage roasts
  {
    text: "Hey {name}, you're like a participation trophy.\nEveryone gets one, but nobody really wants it! 🏆😂",
    tags: ["trophy", "participation", "unwanted", "savage"]
  },
  {
    text: "Yo {name}, if you were any more basic,\nyou'd be a pH strip! 🧪😆",
    tags: ["basic", "chemistry", "simple", "savage"]
  },
  {
    text: "{name}, you're like airplane WiFi.\nEveryone's excited until they actually try to use you! ✈️📶",
    tags: ["airplane", "wifi", "disappointing", "savage"]
  },
  {
    text: "Hey {name}, you're like a gym membership.\nPeople sign up for you but never actually use you! 💪😴",
    tags: ["gym", "membership", "unused", "savage"]
  },
  {
    text: "{name}, you're like a printer.\nYou never work when someone actually needs you! 🖨️😤",
    tags: ["printer", "broken", "unreliable", "savage"]
  },
  {
    text: "Sup {name}, you're like a conspiracy theory.\nInteresting at first, but the more people think about you, the less sense you make! 🤔👽",
    tags: ["conspiracy", "confusing", "nonsense", "savage"]
  },
  {
    text: "{name}, you're like a pop-up ad.\nNobody wants to see you, but there you are anyway! 💻🚫",
    tags: ["annoying", "unwanted", "popup", "savage"]
  },
  {
    text: "Hey {name}, you're like a weather app.\nUsually wrong, but people check you out of habit! 🌦️📱",
    tags: ["weather", "wrong", "habit", "savage"]
  },
  {
    text: "{name}, you're like a microwaved pizza.\nTechnically food, but nobody's really excited about it! 🍕🔥",
    tags: ["food", "disappointing", "microwave", "savage"]
  },
  {
    text: "Yo {name}, you're like a expired coupon.\nYou had potential once, but now you're just embarrassing! 🎫😬",
    tags: ["expired", "potential", "embarrassing", "savage"]
  },

  // Friendly roasts
  {
    text: "{name}, you're like Monday morning.\nNobody's excited to see you! ☕😴",
    tags: ["monday", "morning", "tired", "friendly"]
  },
  {
    text: "Listen {name}, you've got the personality\nof unsalted crackers! 🍘😊",
    tags: ["personality", "bland", "crackers", "friendly"]
  },
  {
    text: "Hey {name}, you're like a software update.\nEveryone ignores you until there's a problem! 💻😅",
    tags: ["software", "update", "ignored", "friendly"]
  },
  {
    text: "{name}, you're like a group project.\nSomeone always has to carry you! 📚🎒",
    tags: ["group", "project", "carry", "friendly"]
  },
  {
    text: "Sup {name}, you're like a free trial.\nFun at first, but eventually people move on! 🆓⏰",
    tags: ["trial", "temporary", "fun", "friendly"]
  },
  {
    text: "{name}, you're like a dad joke.\nEveryone pretends you're not funny, but secretly they love you! 😄👨",
    tags: ["dad", "joke", "secretly", "friendly"]
  },
  {
    text: "Hey {name}, you're like a snooze button.\nPeople love you in the moment but regret it later! ⏰😴",
    tags: ["snooze", "regret", "moment", "friendly"]
  },
  {
    text: "{name}, you're like a fortune cookie.\nSweet on the outside, but the message inside is questionable! 🥠✨",
    tags: ["fortune", "sweet", "questionable", "friendly"]
  },
  {
    text: "Yo {name}, you're like autocorrect.\nYou try to help, but you usually make things worse! 📱🤦",
    tags: ["autocorrect", "help", "worse", "friendly"]
  },
  {
    text: "{name}, you're like a bookmark.\nUseful sometimes, but mostly just taking up space! 📖🔖",
    tags: ["bookmark", "useful", "space", "friendly"]
  },

  // Professional roasts
  {
    text: "Oh {name}, you're like a broken GPS.\nAlways lost and giving wrong directions! 🧭🤦‍♂️",
    tags: ["gps", "lost", "directions", "professional"]
  },
  {
    text: "{name}, you're like a conference call.\nEveryone shows up, but nobody really wants to be there! 💼📞",
    tags: ["conference", "call", "meeting", "professional"]
  },
  {
    text: "Hey {name}, you're like office coffee.\nNecessary, but nobody's particularly impressed! ☕💼",
    tags: ["office", "coffee", "necessary", "professional"]
  },
  {
    text: "{name}, you're like a team building exercise.\nForced participation that nobody enjoys! 🤝😐",
    tags: ["team", "building", "forced", "professional"]
  },
  {
    text: "Sup {name}, you're like a quarterly report.\nLots of pages, but very little substance! 📊📋",
    tags: ["report", "pages", "substance", "professional"]
  },
  {
    text: "{name}, you're like a company retreat.\nSounds fun in theory, but it's mostly awkward! 🏢🏔️",
    tags: ["retreat", "theory", "awkward", "professional"]
  },
  {
    text: "Hey {name}, you're like a performance review.\nEveryone dreads the meeting! ��",
    tags: ["performance", "review", "dread", "professional"]
  },
  {
    text: "{name}, you're like office Wi-Fi.\nWhen you work, great! But most of the time... nope! 📶💻",
    tags: ["wifi", "office", "unreliable", "professional"]
  },
  {
    text: "Yo {name}, you're like a mandatory training.\nRequired, but nobody pays attention! 📚😴",
    tags: ["training", "mandatory", "attention", "professional"]
  },
  {
    text: "{name}, you're like a company picnic.\nSeems like a good idea until you're actually there! 🧺🎪",
    tags: ["picnic", "company", "idea", "professional"]
  },

  // Random/Absurd roasts
  {
    text: "{name}, you're like a math problem.\nComplicated, confusing, and most people skip you! 🧮😂",
    tags: ["math", "complicated", "confusing", "random"]
  },
  {
    text: "Hey {name}, you're like a rubber duck.\nYou just sit there while people talk to themselves! 🦆🛁",
    tags: ["rubber", "duck", "sit", "random"]
  },
  {
    text: "{name}, you're like a screensaver.\nYou show up when nobody's paying attention! 💻🌌",
    tags: ["screensaver", "attention", "show", "random"]
  },
  {
    text: "Sup {name}, you're like a house plant.\nPeople forget about you until you start dying! 🪴💀",
    tags: ["plant", "forget", "dying", "random"]
  },
  {
    text: "{name}, you're like a traffic cone.\nBright, orange, and in everyone's way! 🚧🧡",
    tags: ["traffic", "cone", "orange", "random"]
  },
  {
    text: "Hey {name}, you're like a pickle jar.\nSomeone always has to help you open up! 🥒🫙",
    tags: ["pickle", "jar", "help", "random"]
  },
  {
    text: "{name}, you're like a sock drawer.\nFull of things that don't match! 🧦👕",
    tags: ["sock", "drawer", "match", "random"]
  },
  {
    text: "Yo {name}, you're like a magic 8-ball.\nPeople shake you and get random nonsense! 🎱�",
    tags: ["magic", "ball", "random", "random"]
  },
  {
    text: "{name}, you're like a lava lamp.\nMesserizing to look at, but completely useless! 🌋💡",
    tags: ["lava", "lamp", "useless", "random"]
  },
  {
    text: "Hey {name}, you're like a carnival mirror.\nYou make everything look weird and distorted! 🎪🪞",
    tags: ["carnival", "mirror", "weird", "random"]
  },

  // Tech-themed roasts
  {
    text: "{name}, you're like Internet Explorer.\nSlow, outdated, and everyone's moved on! 🌐🐌",
    tags: ["internet", "explorer", "slow", "tech"]
  },
  {
    text: "Hey {name}, you're like a 404 error.\nPeople look for you but you're nowhere to be found! 🔍❌",
    tags: ["404", "error", "nowhere", "tech"]
  },
  {
    text: "{name}, you're like a buffering video.\nEveryone's waiting for you to load! ⏳📹",
    tags: ["buffering", "video", "waiting", "tech"]
  },
  {
    text: "Sup {name}, you're like a captcha.\nAnnoying and nobody understands why you exist! 🤖🔤",
    tags: ["captcha", "annoying", "exist", "tech"]
  },
  {
    text: "{name}, you're like a password requirement.\nComplicated and everybody finds you irritating! 🔐😤",
    tags: ["password", "complicated", "irritating", "tech"]
  },
  {
    text: "Hey {name}, you're like a software bug.\nUnexpected and cause problems for everyone! 🐛💻",
    tags: ["bug", "software", "problems", "tech"]
  },
  {
    text: "{name}, you're like spam email.\nNobody wants you, but you keep showing up! 📧🚫",
    tags: ["spam", "email", "unwanted", "tech"]
  },
  {
    text: "Yo {name}, you're like a low battery warning.\nAnnoying and always showing up at the worst time! 🔋⚠️",
    tags: ["battery", "warning", "annoying", "tech"]
  },
  {
    text: "{name}, you're like a Windows update.\nYou force yourself on people when they're busy! 🪟⏰",
    tags: ["windows", "update", "force", "tech"]
  },
  {
    text: "Hey {name}, you're like airplane mode.\nUseful for avoiding people! ✈️�",
    tags: ["airplane", "mode", "avoiding", "tech"]
  },

  // Food-themed roasts
  {
    text: "{name}, you're like decaf coffee.\nYou exist, but what's the point? ☕😐",
    tags: ["decaf", "coffee", "pointless", "food"]
  },
  {
    text: "Sup {name}, you're like a diet soda.\nTrying to be something you're not! 🥤🙄",
    tags: ["diet", "soda", "pretending", "food"]
  },
  {
    text: "{name}, you're like a fortune cookie.\nCrumbly and full of generic advice! 🥠📝",
    tags: ["fortune", "cookie", "generic", "food"]
  },
  {
    text: "Hey {name}, you're like a gas station sandwich.\nAvailable 24/7 but nobody's first choice! 🥪⛽",
    tags: ["gas", "sandwich", "choice", "food"]
  },
  {
    text: "{name}, you're like a banana.\nYellow, curved, and goes bad quickly! 🍌⏰",
    tags: ["banana", "yellow", "bad", "food"]
  },
  {
    text: "Yo {name}, you're like instant noodles.\nCheap, easy, and not very nutritious! 🍜💰",
    tags: ["noodles", "cheap", "nutritious", "food"]
  },
  {
    text: "{name}, you're like white bread.\nBasic, bland, and easily forgotten! 🍞😴",
    tags: ["bread", "basic", "bland", "food"]
  },
  {
    text: "Hey {name}, you're like ketchup.\nYou try to make everything better but usually make it worse! 🍅🙃",
    tags: ["ketchup", "better", "worse", "food"]
  },
  {
    text: "{name}, you're like a vending machine snack.\nOverpriced and disappointing! 🍿💸",
    tags: ["vending", "overpriced", "disappointing", "food"]
  },
  {
    text: "Sup {name}, you're like lukewarm pizza.\nBetter than nothing, but barely! 🍕🌡️",
    tags: ["pizza", "lukewarm", "barely", "food"]
  },

  // Animal-themed roasts
  {
    text: "{name}, you're like a sloth.\nSlow moving and always hanging around! 🦥🌳",
    tags: ["sloth", "slow", "hanging", "animal"]
  },
  {
    text: "Hey {name}, you're like a mosquito.\nAnnoying buzz and nobody wants you around! 🦟🚫",
    tags: ["mosquito", "buzz", "annoying", "animal"]
  },
  {
    text: "{name}, you're like a house cat.\nLazy, demanding, and act like you own the place! 🐱👑",
    tags: ["cat", "lazy", "demanding", "animal"]
  },
  {
    text: "Yo {name}, you're like a penguin.\nWaddling around like you know what you're doing! 🐧❄️",
    tags: ["penguin", "waddling", "clueless", "animal"]
  },
  {
    text: "{name}, you're like a goldfish.\nShort memory and going in circles! ��",
    tags: ["goldfish", "memory", "circles", "animal"]
  },
  {
    text: "Sup {name}, you're like a peacock.\nAll show and very little substance! 🦚✨",
    tags: ["peacock", "show", "substance", "animal"]
  },
  {
    text: "{name}, you're like a hamster.\nRunning on a wheel but getting nowhere! 🐹⚙️",
    tags: ["hamster", "wheel", "nowhere", "animal"]
  },
  {
    text: "Hey {name}, you're like a chicken.\nAlways running around with your head cut off! 🐔🏃",
    tags: ["chicken", "running", "headless", "animal"]
  },
  {
    text: "{name}, you're like a llama.\nFluffy, dramatic, and occasionally spits! 🦙💦",
    tags: ["llama", "fluffy", "dramatic", "animal"]
  },
  {
    text: "Yo {name}, you're like a turtle.\nSlow to the party and hiding in your shell! 🐢🏠",
    tags: ["turtle", "slow", "hiding", "animal"]
  },

  // Weather-themed roasts
  {
    text: "{name}, you're like a cloudy day.\nBlocking everyone's sunshine! ☁️🌞",
    tags: ["cloudy", "blocking", "sunshine", "weather"]
  },
  {
    text: "Hey {name}, you're like a tornado.\nLots of spinning around but causing chaos! 🌪️💨",
    tags: ["tornado", "spinning", "chaos", "weather"]
  },
  {
    text: "{name}, you're like a light drizzle.\nMild annoyance that won't go away! 🌦️😒",
    tags: ["drizzle", "annoyance", "persistent", "weather"]
  },
  {
    text: "Sup {name}, you're like humidity.\nMaking everyone uncomfortable just by existing! 💧😰",
    tags: ["humidity", "uncomfortable", "existing", "weather"]
  },
  {
    text: "{name}, you're like a weather forecast.\nWrong 50% of the time! 📺❌",
    tags: ["forecast", "wrong", "unreliable", "weather"]
  },
  {
    text: "Hey {name}, you're like morning fog.\nConfusing and hard to see through! 🌫️👀",
    tags: ["fog", "confusing", "unclear", "weather"]
  },
  {
    text: "{name}, you're like a heat wave.\nUnbearable and everyone wants you to leave! 🌡️🔥",
    tags: ["heat", "unbearable", "leave", "weather"]
  },
  {
    text: "Yo {name}, you're like a snowflake.\nSpecial and unique, but you melt under pressure! ❄️�",
    tags: ["snowflake", "special", "pressure", "weather"]
  },
  {
    text: "{name}, you're like a thunderstorm.\nLoud, dramatic, and over before anyone notices! ⛈️🎭",
    tags: ["thunderstorm", "loud", "dramatic", "weather"]
  },
  {
    text: "Hey {name}, you're like wind.\nYou're there, but nobody really sees you! 💨👻",
    tags: ["wind", "invisible", "unnoticed", "weather"]
  },

  // Transportation-themed roasts
  {
    text: "{name}, you're like a shopping cart.\nWobbly wheels and going in random directions! 🛒🎯",
    tags: ["cart", "wobbly", "random", "transport"]
  },
  {
    text: "Sup {name}, you're like a bicycle.\nTwo-wheeled and nobody rides you! 🚲😔",
    tags: ["bicycle", "wheels", "unused", "transport"]
  },
  {
    text: "{name}, you're like public transportation.\nCheap, unreliable, and smells funny! 🚌👃",
    tags: ["public", "unreliable", "smells", "transport"]
  },
  {
    text: "Hey {name}, you're like a taxi.\nExpensive and takes forever to show up! 🚕💸",
    tags: ["taxi", "expensive", "slow", "transport"]
  },
  {
    text: "{name}, you're like a speed bump.\nAnnoying obstacle that slows everyone down! 🚗⚠️",
    tags: ["speed", "bump", "obstacle", "transport"]
  },
  {
    text: "Yo {name}, you're like a parking meter.\nAlways demanding money for nothing! 🅿️💰",
    tags: ["parking", "meter", "demanding", "transport"]
  },
  {
    text: "{name}, you're like a flat tire.\nUseless until someone fixes you! 🛞🔧",
    tags: ["tire", "flat", "useless", "transport"]
  },
  {
    text: "Hey {name}, you're like a traffic jam.\nEveryone's stuck because of you! 🚦🚗",
    tags: ["traffic", "jam", "stuck", "transport"]
  },
  {
    text: "{name}, you're like a GPS recalculating.\nAlways saying 'turn around when possible'! 🗺️🔄",
    tags: ["gps", "recalculating", "lost", "transport"]
  },
  {
    text: "Sup {name}, you're like a toll booth.\nSlowing everyone down and taking their money! 🛣️💸",
    tags: ["toll", "booth", "slowing", "transport"]
  },

  // Gaming-themed roasts
  {
    text: "{name}, you're like a loading screen.\nEveryone's waiting for you to finish! ⏳🎮",
    tags: ["loading", "screen", "waiting", "gaming"]
  },
  {
    text: "Hey {name}, you're like a tutorial level.\nEveryone wants to skip you! 📚🎯",
    tags: ["tutorial", "skip", "boring", "gaming"]
  },
  {
    text: "{name}, you're like a side quest.\nOptional and most people ignore you! 🗺️⚔️",
    tags: ["side", "quest", "optional", "gaming"]
  },
  {
    text: "Yo {name}, you're like lag.\nMaking everything slower and more frustrating! 🐌�",
    tags: ["lag", "slow", "frustrating", "gaming"]
  },
  {
    text: "{name}, you're like a game crash.\nShowing up at the worst possible moment! 💥🎮",
    tags: ["crash", "worst", "moment", "gaming"]
  },
  {
    text: "Sup {name}, you're like a microtransaction.\nNobody wants to pay for you! 💳🚫",
    tags: ["microtransaction", "pay", "unwanted", "gaming"]
  },
  {
    text: "{name}, you're like an NPC.\nRepeating the same thing over and over! 🤖🔄",
    tags: ["npc", "repeating", "boring", "gaming"]
  },
  {
    text: "Hey {name}, you're like a glitch.\nUnexpected and usually breaking things! ⚡🔧",
    tags: ["glitch", "unexpected", "breaking", "gaming"]
  },
  {
    text: "{name}, you're like a pay-to-win game.\nPeople only like you if they can buy their way through! 💰🏆",
    tags: ["pay", "win", "money", "gaming"]
  },
  {
    text: "Yo {name}, you're like a checkpoint.\nEveryone uses you but forgets about you immediately! 🚩📍",
    tags: ["checkpoint", "forget", "temporary", "gaming"]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Check existing roasts count
    const existingCount = await Roast.countDocuments();
    console.log(`📊 Found ${existingCount} existing roasts`);
    
    // Insert new sample roasts
    await Roast.insertMany(sampleRoasts);
    console.log(`✅ Added ${sampleRoasts.length} new roasts to database`);

    // Display final count
    const finalCount = await Roast.countDocuments();
    console.log(`🎯 Total roasts in database: ${finalCount}`);

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
