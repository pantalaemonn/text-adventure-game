function renderCard(card, elementId) {
  const cardElement = document.getElementById(elementId);

  // Update name
  cardElement.querySelector(".cardname h3").textContent = card.name;

  // Update power
  cardElement.querySelector(".power h3").textContent = card.power;

  // Update health
  cardElement.querySelector(".health h3").textContent = card.health;
}
