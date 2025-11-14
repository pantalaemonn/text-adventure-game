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
    this.card = card; // optional Card for battling
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
    this.card = new Card("Hero Knight", 10, 40); // Make null and add selection
    this.currentBattle = null;
  }

  startBattle(opponentName) {
    const opponent = this.currentRoom.characters.find(
      (c) => c.name.toLowerCase() === opponentName.toLowerCase()
    );
    if (!opponent) return `No one named ${opponentName} here to battle.`;
    if (!opponent.card) return `${opponent.name} doesn’t have a battle card.`;

    // Fresh copies so health resets each battle
    const playerCard = new Card(this.card.name, this.card.power, this.card.health);
    const enemyCard = new Card(opponent.card.name, opponent.card.power, opponent.card.health);

    this.currentBattle = new Battle(playerCard, enemyCard);

    // Render to UI
    renderCard(playerCard, "card");
    renderCard(enemyCard, "enemyCard");

    const logDiv = document.getElementById("battleLog");
    const attackBtn = document.getElementById("attackBtn");
    attackBtn.disabled = false;
    logDiv.innerHTML = `Battle begins! ${playerCard.name} vs ${enemyCard.name}<br><br>`;

    return `You challenge ${opponent.name} to a battle! Press Attack to fight.`;
  }
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
    const target = rest.join(" ");
    
    switch (action.toLowerCase()) {
      case "talk":
        return this.player.talk(target);
      case "take":
        return this.player.take(target);
      case "look":
        return this.player.currentRoom.describe();
      case "go":
        return this.player.move(target);
      case "battle":
        return this.player.startBattle(target);
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

// Character Cards
const lunaCard = new Card("Luna", 9, 32);
const lorenzoCard = new Card("Lorenzo", 10, 34);

const luna = new Character(
  "Luna",
  {
    default:
      "Welcome, glad you could make it! Choose your Starter card: Fox, Wolf, or Owl.",
  },
  lunaCard
);
const lorenzo = new Character(
  "Lorenzo",
  {
    default: "Wowzers, you're a grown-up! Go easy on me, okay?",
  },
  lorenzoCard
);

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
