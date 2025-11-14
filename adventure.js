// Room
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
    this.characters = characters;
    this.items = items;
    this.exits = {};
    this.roomImage = roomImage;
  }

  describe() {
    return `${this.name}: ${this.description}`;
  }

  connect(exitKey, roomObj) {
    this.exits[exitKey.toLowerCase()] = roomObj;
  }
}

// Character (now supports an optional card)
class Character {
  constructor(name, dialogue, card = null) {
    this.name = name;
    this.dialogue = dialogue;
    this.card = card;
    this.hasBeenDefeated = false; // track battle outcome
    this.postBattleDialogue = null; // optional dialogue after defeat
  }

  talk() {
    if (this.hasBeenDefeated && this.postBattleDialogue) {
      return `${this.name} says: "${this.postBattleDialogue}"`;
    }
    return `${this.name} says: "${this.dialogue.default}"`;
  }
}

// Item
class Item {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

// Player
class Player {
  constructor(name, currentRoom) {
    this.name = name;
    this.currentRoom = currentRoom;
    this.inventory = [];
    this.card = new Card("Hero Knight", 10, 40); // or set after starter selection
    this.currentBattle = null;
  }

  startBattle(opponentName) {
    const opponent = this.currentRoom.characters.find(
      (c) => c.name.toLowerCase() === opponentName.toLowerCase()
    );
    if (!opponent) return `No one named ${opponentName} here to battle.`;
    if (opponent.hasBeenDefeated)
      return `${opponent.name} has already been defeated.`;
    if (!opponent.card) return `${opponent.name} doesn’t have a battle card.`;

    // Fresh copies so health resets each battle
    const playerCard = new Card(
      this.card.name,
      this.card.power,
      this.card.health
    );
    const enemyCard = new Card(
      opponent.card.name,
      opponent.card.power,
      opponent.card.health
    );

    this.currentBattle = new Battle(playerCard, enemyCard);

    // Show battle div, hide game-image div
    document.getElementById("battleSystem").style.display = "block";
    document.getElementById("gameImage").style.display = "none";

    // Clear game log
    gameLog.innerHTML = "";

    // Render to UI
    renderCard(playerCard, "card");
    renderCard(enemyCard, "enemyCard");

    const logDiv = document.getElementById("battleLog");
    const attackBtn = document.getElementById("attackBtn");
    attackBtn.disabled = false;
    logDiv.innerHTML = `Battle begins! ${playerCard.name} vs ${enemyCard.name}<br><br>`;

    return `You challenge ${opponent.name} to a battle! Press Attack to fight.`;
  }

  take(itemName) {
    const item = this.currentRoom.items.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    if (item) {
      this.inventory.push(item);
      this.currentRoom.items = this.currentRoom.items.filter((i) => i !== item);
      updateImage(`${item.name.toLowerCase()}.png`, item.name);
      return `You picked up ${item.name}.`;
    }
    return `No item named ${itemName} here.`;
  }

  talk(characterName) {
    const character = this.currentRoom.characters.find(
      (c) => c.name.toLowerCase() === characterName.toLowerCase()
    );
    if (character) {
      updateImage(`${character.name.toLowerCase()}.png`, character.name);
      return character.talk();
    }
    return `No one named ${characterName} here.`;
  }

  move(exitKey) {
    const nextRoom = this.currentRoom.exits[exitKey.toLowerCase()];
    if (nextRoom) {
      this.currentRoom = nextRoom;
      updateImage(nextRoom.roomImage, nextRoom.name);
      // Clear the game log
      gameLog.innerHTML = "";
      return `You move to the ${nextRoom.name}. ${nextRoom.describe()}`;
    }
    return `You can't go to ${exitKey} from here.`;
  }
}

// Game
class Game {
  constructor(player) {
    this.player = player;
  }

  processCommand(command) {
    const [action, ...rest] = command.split(" ");
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

// Image updater
function updateImage(src, alt) {
  const gameImage = document.getElementById("gameImage");
  gameImage.src = src;
  gameImage.alt = alt;
}

// Load Local Storage for Defeated Characters
function loadDefeatedStates(characters) {
  const defeated = JSON.parse(localStorage.getItem("defeatedCharacters")) || {};
  characters.forEach((char) => {
    if (defeated[char.name]) {
      char.hasBeenDefeated = true;
    }
  });
}

// ----- Setup world -----
// Ensure Card and Battle are loaded before this script

// Character Cards
const lunaCard = new Card("Luna", 9, 32);
const lorenzoCard = new Card("Lorenzo", 10, 34);

// NPCs without battles
const guard = new Character("Guard", { default: "Stay vigilant, stranger." });
const merchant = new Character("Merchant", {
  default: "I sell rare boosters.",
});

// Characters with cards
const luna = new Character(
  "Luna",
  {
    default:
      "Welcome, glad you could make it! Want a warm-up battle before you start? Just type 'battle' and then my name!",
  },
  lunaCard
);
luna.postBattleDialogue =
  "You fought bravely… I’ll be cheering you on from here!";

const lorenzo = new Character(
  "Lorenzo",
  { default: "Wowzers, you're a grown-up! Go easy on me, okay?" },
  lorenzoCard
);
lorenzo.postBattleDialogue =
  "You only won because I'm a kid... I'll be back when I'm older!";

const booster = new Item("Booster", "Enhances your card’s power.");

// Load defeated states
loadDefeatedStates([luna, lorenzo]);

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

// Map
mainLobby.connect("north", northWing);
northWing.connect("lobby", mainLobby);

// Player & Game
const player = new Player("Hero", mainLobby);
const game = new Game(player);

// DOM
const gameLog = document.getElementById("gameLog");
const commandInput = document.getElementById("commandInput");
const submitBtn = document.getElementById("submitBtn");

// Log helper
function log(message) {
  gameLog.innerHTML += message + "<br>";
  gameLog.scrollTop = gameLog.scrollHeight;
}

// Initial state
log(player.currentRoom.describe());
updateImage(player.currentRoom.roomImage, player.currentRoom.name);

// Command handling
submitBtn.addEventListener("click", () => {
  const command = commandInput.value.trim();
  if (command) {
    const result = game.processCommand(command);
    log(`> ${command}`);
    log(result);
    commandInput.value = "";
  }
});

commandInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitBtn.click();
});
