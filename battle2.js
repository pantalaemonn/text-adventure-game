class Card {
  constructor(name, power, health) {
    this.name = name;
    this.power = power;
    this.health = health;
  }
  attack(opponent) {
    opponent.takeDamage(this.power);
  }
  takeDamage(damage) {
    this.health -= damage;
  }
  isDefeated() {
    return this.health <= 0;
  }
}

function renderCard(card, elementId) {
  const cardElement = document.getElementById(elementId);
  cardElement.querySelector(".cardname h3").textContent = card.name;
  cardElement.querySelector(".power h3").textContent = card.power;
  cardElement.querySelector(".health h3").textContent = card.health;
}

// Create cards
const hero = new Card("Hero Knight", 12, 40);
const enemy = new Card("Goblin", 8, 35);

// Initial render
renderCard(hero, "card");
renderCard(enemy, "enemyCard");

// Button logic
const attackBtn = document.getElementById("attackBtn");
attackBtn.addEventListener("click", () => {
  hero.attack(enemy);
  renderCard(hero, "card");
  renderCard(enemy, "enemyCard");

  if (enemy.isDefeated()) {
    alert("Enemy defeated!");
    attackBtn.disabled = true;
  }
});
