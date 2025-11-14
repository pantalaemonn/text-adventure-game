// Card class: represents a single character card
class Card {
  constructor(name, power, health) {
    this.name = name; // character name
    this.power = power; // attack strength
    this.health = health; // hit points
  }

  // Attack another card
  attack(opponent) {
    opponent.takeDamage(this.power);
    return `${this.name} attacks ${opponent.name} for ${this.power} damage!`;
  }

  // Reduce health when taking damage
  takeDamage(damage) {
    this.health -= damage;

    // Get card element
    const cardElement = document.querySelector(
      this.name === "Hero Knight" ? "#card" : "#enemyCard"
    );

    // Add animation class
    cardElement.classList.add("damage-animation", "flash");

    // Remove after 0.5s
    setTimeout(() => {
      cardElement.classList.remove("damage-animation", "flash");
    }, 500);
  }

  // Check if defeated
  isDefeated() {
    return this.health <= 0;
  }
}

// Battle class: handles the fight between two cards
class Battle {
  constructor(playerCard, enemyCard) {
    this.playerCard = playerCard;
    this.enemyCard = enemyCard;
    this.turn = "player"; // whose turn it is
  }

  // Play one turn of the battle
  playTurn() {
    let logMessage = "";

    if (this.turn === "player") {
      logMessage = this.playerCard.attack(this.enemyCard);
      if (this.enemyCard.isDefeated()) {
        return logMessage + `<br>${this.enemyCard.name} is defeated! You win!`;
      }
      this.turn = "enemy"; // switch turn
    } else {
      logMessage = this.enemyCard.attack(this.playerCard);
      if (this.playerCard.isDefeated()) {
        return (
          logMessage + `<br>${this.playerCard.name} is defeated! You lose!`
        );
      }
      this.turn = "player"; // switch turn
    }

    return (
      logMessage +
      `<br>${this.playerCard.name} HP: ${this.playerCard.health}, ${this.enemyCard.name} HP: ${this.enemyCard.health}`
    );
  }
}

// Render card stats to UI
function renderCard(card, elementId) {
  const cardElement = document.getElementById(elementId);
  cardElement.querySelector(".cardname h3").textContent = card.name;
  cardElement.querySelector(".power h3").textContent = card.power;
  cardElement.querySelector(".health h3").textContent = card.health;
}

// Helper: mark opponent defeated and save to localStorage
function markDefeated(opponent) {
  if (!opponent) return;
  opponent.hasBeenDefeated = true;

  const key = opponent.name.toLowerCase();
  const defeated = JSON.parse(localStorage.getItem("defeatedCharacters")) || {};
  defeated[key] = true;
  localStorage.setItem("defeatedCharacters", JSON.stringify(defeated));
}

// Hook up UI
const attackBtn = document.getElementById("attackBtn");
const logDiv = document.getElementById("battleLog");

attackBtn.addEventListener("click", () => {
  const battle = player.currentBattle;
  if (!battle) return; // no active battle

  // PLAYER TURN
  const result = battle.playTurn();
  logDiv.innerHTML += result + "<br><br>";
  renderCard(battle.playerCard, "card");
  renderCard(battle.enemyCard, "enemyCard");

  // If enemy died on player's turn
  if (battle.enemyCard.isDefeated()) {
    attackBtn.disabled = true;
    const opponent = player.currentRoom.characters.find(
      (c) =>
        c.card &&
        c.card.name.toLowerCase() === battle.enemyCard.name.toLowerCase()
    );
    markDefeated(opponent);
    document.getElementById("battleSystem").style.display = "none";
    document.getElementById("gameImage").style.display = "block";
    logDiv.innerHTML = ""; // Clear battle log
    log(player.currentRoom.describe());
    updateImage(player.currentRoom.roomImage, player.currentRoom.name);

    player.currentBattle = null;
    return;
  }

  // ENEMY TURN (auto) if battle continues
  setTimeout(() => {
    const enemyResult = battle.playTurn();
    logDiv.innerHTML += enemyResult + "<br><br>";
    renderCard(battle.playerCard, "card");
    renderCard(battle.enemyCard, "enemyCard");

    // If player died
    if (battle.playerCard.isDefeated()) {
      attackBtn.disabled = true;
      document.getElementById("battleSystem").style.display = "none";
      document.getElementById("gameImage").style.display = "block";
      log(player.currentRoom.describe());
      updateImage(player.currentRoom.roomImage, player.currentRoom.name);
      player.currentBattle = null;
      return;
    }

    // If enemy died on enemy's turn
    if (battle.enemyCard.isDefeated()) {
      attackBtn.disabled = true;
      const opponent = player.currentRoom.characters.find(
        (c) =>
          c.card &&
          c.card.name.toLowerCase() === battle.enemyCard.name.toLowerCase()
      );
      markDefeated(opponent);

      document.getElementById("battleSystem").style.display = "none";
      document.getElementById("gameImage").style.display = "block";
      log(player.currentRoom.describe());
      updateImage(player.currentRoom.roomImage, player.currentRoom.name);

      player.currentBattle = null;
      return;
    }
  }, 800);
});
