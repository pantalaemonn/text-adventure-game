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

    // Remove
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

function renderCard(card, elementId) {
  const cardElement = document.getElementById(elementId);
  cardElement.querySelector(".cardname h3").textContent = card.name;
  cardElement.querySelector(".power h3").textContent = card.power;
  cardElement.querySelector(".health h3").textContent = card.health;
}

// Create one player card and one enemy card
const hero = new Card("Hero Knight", 10, 40);
const enemy = new Card("Goblin", 8, 35);

// Render Card Stats
renderCard(hero, "card"); // updates the hero card display
renderCard(enemy, "enemyCard"); // updates the enemy card display

// Create a battle
const battle = new Battle(hero, enemy);

// Hook up UI
const logDiv = document.getElementById("battleLog");
const attackBtn = document.getElementById("attackBtn");

attackBtn.addEventListener("click", () => {
  const result = battle.playTurn();
  logDiv.innerHTML += result + "<br><br>";

  // Update both cards in the UI
  renderCard(hero, "card");
  renderCard(enemy, "enemyCard");

  // If enemy still alive, auto‑attack after a short delay
  if (!enemy.isDefeated()) {
    setTimeout(() => {
      const enemyResult = battle.playTurn();
      logDiv.innerHTML += enemyResult + "<br><br>";
      renderCard(hero, "card");
      renderCard(enemy, "enemyCard");

      if (hero.isDefeated()) {
        attackBtn.disabled = true;
      }
    }, 800); // delay for readability
  }

  // Disable button if someone is defeated
  if (hero.isDefeated() || enemy.isDefeated()) {
    attackBtn.disabled = true;
  }
});

// Initial message
logDiv.innerHTML = `Battle begins! ${hero.name} vs ${enemy.name}<br><br>`;
