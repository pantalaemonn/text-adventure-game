// Card class
class Card {
  constructor(name, power, health) {
    this.name = name;
    this.power = power;
    this.health = health;
  }

  attack(opponentCard) {
    console.log(
      `${this.name} attacks ${opponentCard.name} for ${this.power} damage!`
    );
    opponentCard.takeDamage(this.power);
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`${this.name} now has ${this.health} health.`);
  }

  isDefeated() {
    return this.health <= 0;
  }
}

// Deck class
class Deck {
  constructor() {
    this.cards = [];
    this.generateRandomDeck();
  }

  generateRandomDeck() {
    const names = [
      "Knight",
      "Wizard",
      "Archer",
      "Goblin",
      "Dragon",
      "Elf",
      "Orc",
    ];
    for (let i = 0; i < 5; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const power = Math.floor(Math.random() * 10) + 5; // 5–15
      const health = Math.floor(Math.random() * 20) + 20; // 20–40
      this.cards.push(new Card(name, power, health));
    }
  }

  hasCardsLeft() {
    return this.cards.some((card) => !card.isDefeated());
  }

  getNextCard() {
    return this.cards.find((card) => !card.isDefeated());
  }
}

// Player class
class Player {
  constructor(name) {
    this.name = name;
    this.deck = new Deck();
  }

  playTurn(opponent) {
    const myCard = this.deck.getNextCard();
    const opponentCard = opponent.deck.getNextCard();

    if (myCard && opponentCard) {
      myCard.attack(opponentCard);

      if (opponentCard.isDefeated()) {
        console.log(`${opponentCard.name} has been defeated!`);
      }
    }
  }

  hasLost() {
    return !this.deck.hasCardsLeft();
  }
}

// Battle class
class Battle {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    console.log(
      `Battle starts between ${this.player1.name} and ${this.player2.name}!`
    );

    while (!this.player1.hasLost() && !this.player2.hasLost()) {
      this.player1.playTurn(this.player2);
      if (this.player2.hasLost()) break;

      this.player2.playTurn(this.player1);
    }

    if (this.player1.hasLost()) {
      console.log(`${this.player2.name} wins the battle!`);
      return this.player2;
    } else {
      console.log(`${this.player1.name} wins the battle!`);
      return this.player1;
    }
  }
}

// Game class
class Game {
  constructor(playerName) {
    this.player = new Player(playerName);
    this.room = 1;
  }

  nextRoom() {
    console.log(`Entering Room ${this.room}...`);
    const enemy = new Player(`Enemy Room ${this.room}`);
    const battle = new Battle(this.player, enemy);
    const winner = battle.start();

    if (winner === this.player) {
      console.log(`You defeated the enemy in Room ${this.room}!`);
      this.room++;
      this.nextRoom();
    } else {
      console.log("Game Over. You lost!");
    }
  }

  start() {
    console.log(`Welcome, ${this.player.name}, to the Card Adventure!`);
    this.nextRoom();
  }
}

// Start the game
const game = new Game("Hero");
game.start();
