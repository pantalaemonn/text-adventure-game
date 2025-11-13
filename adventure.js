class Room {
  constructor(
    name,
    description,
    characters = [],
    items = [],
    roomImage = "main.png"
  ) {
    this.name = name;
    this.description = description;
    this.characters = characters; // array of Character objects
    this.items = items; // array of Item objects
    this.exits = {}; // exits to battle rooms
    this.roomImage = roomImage; // default image for the room
  }

  describe() {
    return `${this.name}: ${this.description}`;
  }

  connect(roomName, roomObj) {
    this.exits[roomName.toLowerCase()] = roomObj;
  }
}

class Character {
  constructor(name, dialogue) {
    this.name = name;
    this.dialogue = dialogue; // object with different dialogue options
  }

  talk() {
    return `${this.name} says: "${this.dialogue.default}"`;
  }
}

class Item {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Player {
  constructor(name, currentRoom) {
    this.name = name;
    this.currentRoom = currentRoom;
    this.inventory = [];
    this.card = null; // chosen starter card
  }

  take(itemName) {
    const item = this.currentRoom.items.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    if (item) {
      this.inventory.push(item);
      this.currentRoom.items = this.currentRoom.items.filter((i) => i !== item);

      // Update image when item is taken
      updateImage(`${item.name.toLowerCase()}.png`, item.name);
      // Base take system
      return `You picked up ${item.name}.`;
    }
    return `No item named ${itemName} here.`;
  }

  talk(characterName) {
    const character = this.currentRoom.characters.find(
      (c) => c.name.toLowerCase() === characterName.toLowerCase()
    );
    if (character) {
      // Update image when talking
      updateImage(`${character.name.toLowerCase()}.png`, character.name);
      // Base talk function
      return character.talk();
    }
    return `No one named ${characterName} here.`;
  }

  move(roomName) {
    const nextRoom = this.currentRoom.exits[roomName.toLowerCase()];
    if (nextRoom) {
      this.currentRoom = nextRoom;
      // Reset to room image
      updateImage(nextRoom.roomImage, nextRoom.name);
      return `You move to the ${nextRoom.name}. ${nextRoom.describe()}`;
    }
    return `You can't go to ${roomName} from here.`;
  }
}

class Game {
  constructor(player) {
    this.player = player;
  }

  processCommand(command) {
    const [action, target] = command.split(" ");
    switch (action.toLowerCase()) {
      case "talk":
        return this.player.talk(target);
      case "take":
        return this.player.take(target);
      case "look":
        return this.player.currentRoom.describe();
      case "go":
        return this.player.move(target);
      default:
        return "Unknown command.";
    }
  }
}

// Updates left image (character/item)
function updateImage(src, alt) {
  const gameImage = document.getElementById("gameImage");
  gameImage.src = src;
  gameImage.alt = alt;
}

// Setup world
const luna = new Character("Luna", {
  default:
    "Welcome, glad you could make it! Choose your Starter card: Fox, Wolf, or Owl.",
});
const lorenzo = new Character("Lorenzo", {
  default: "Wowzers, you're a grown-up! Go easy on me, okay?",
});
const guard = new Character("Guard", { default: "Stay vigilant, stranger." });
const merchant = new Character("Merchant", {
  default: "I sell rare boosters.",
});

const booster = new Item("Booster", "Enhances your card’s power.");

// Rooms
const mainLobby = new Room(
  "Main Lobby",
  "You enter a bustling lobby full of adventurers. There's a chest to your left. You see a girl waving at you, is that.. Luna? You should probably talk to her first.",
  [luna, guard, merchant],
  [booster],
  "main.png"
);

const northWing = new Room(
  "North Wing",
  "A boy greets you on entering. 'Hey! Pleasure to meet you. I'm Lorenzo. You'll have to beat me in battle if you want to win this thing.",
  [lorenzo],
  [booster],
  "north.png"
);

// Room Setup
mainLobby.connect("north", northWing);
northWing.connect("lobby", mainLobby);

// Player & Game Setup
const player = new Player("Hero", mainLobby);
const game = new Game(player);

// DOM elements
const gameLog = document.getElementById("gameLog");
const commandInput = document.getElementById("commandInput");
const submitBtn = document.getElementById("submitBtn");

// Helper to print to log
function log(message) {
  gameLog.innerHTML += message + "<br>";
  gameLog.scrollTop = gameLog.scrollHeight; // auto-scroll
}

// Initial description
log(player.currentRoom.describe());

// Handle commands
submitBtn.addEventListener("click", () => {
  const command = commandInput.value.trim();
  if (command) {
    const result = game.processCommand(command);
    log(`> ${command}`);
    log(result);
    commandInput.value = "";
  }
});

// Allow pressing Enter
commandInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitBtn.click();
});
