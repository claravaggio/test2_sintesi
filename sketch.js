let counter = 0; // Contatore che funge da tachimetro
let speedIncrease = 0.5; // Velocità di aumento del contatore
let decreaseFactor = 0.1; // Fattore di riduzione del contatore
let simulationStarted = false; // Controlla se la simulazione è iniziata

// Variabili per le auto
let auto1X = 10;
let auto2X = 200;
let auto2Speed = 1.5; // Velocità della seconda auto

let gameOver = false;
let maxRadius = 250; // Massima dimensione del cerchio bianco
let innerRadius; // Raggio del cerchio interno
let donutRadius; // Raggio della ciambella verde
let donutShrinkSpeed = 0.3; // Velocità di riduzione del raggio della ciambella verde

let radiusCircleUnder = 60; // Raggio di base del cerchio bianco

function preload() {
  img1 = loadImage("assets/car1.png");
  img2 = loadImage("assets/car2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  innerRadius = radiusCircleUnder; // Il cerchio bianco parte da questo valore
  donutRadius = 0; // La ciambella verde inizia invisibile
}

function draw() {
  if (gameOver) {
    // Schermata di Game Over
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(100);
    text("GAME OVER", width / 2, height / 2 - 100);
    return;
  }

  noStroke();
  background(0);

  fill(255, 255, 255);
  rect(0, 0, windowWidth, 80);

  fill(255);
  textSize(50);
  textAlign(LEFT);
  text("2", 20, height - 30);

  image(img1, auto1X, 10, img1.width / 8, img1.height / 8);
  image(img2, auto2X, 10, img2.width / 8, img2.height / 8);

  // Inizia il movimento di auto2 solo quando simulationStarted è true
  if (simulationStarted) {
    auto2X += auto2Speed;
    if (auto2X > width - img2.width / 8) {
      auto2X = width - img2.width / 8;
      auto2Speed = 0;
    }
  }

  // Aumenta il contatore e raggio del cerchio bianco quando tieni premuto invio
  if (keyIsDown(ENTER)) {
    if (!simulationStarted) {
      simulationStarted = true; // Inizia la simulazione con la prima pressione di ENTER
    }

    counter += speedIncrease;
    counter = constrain(counter, 0, 100);
    innerRadius = map(counter, 0, 100, radiusCircleUnder, maxRadius);
    auto1X += map(counter, 0, 100, 0, 5);

    // Resetta la ciambella verde se l'utente accelera di nuovo
    donutRadius = 0;
  } else {
    // Riduci il contatore e raggio del cerchio bianco quando non tieni premuto invio
    counter -= decreaseFactor;
    counter = max(counter, 0);
    innerRadius = map(counter, 0, 100, radiusCircleUnder, maxRadius);
    auto1X += map(counter, 0, 100, 0, 3);
  }

  // Gestione del tasto spacebar (per far partire la ciambella verde)
  if (keyIsDown(32)) {
    if (donutRadius === 0) {
      donutRadius = innerRadius;
    }

    // Riduzione rapida del contatore e del cerchio bianco
    counter -= decreaseFactor * 2; // Decelerazione più rapida con spacebar
    counter = max(counter, 0);
    innerRadius = map(counter, 0, 100, radiusCircleUnder, maxRadius);
  }

  // La ciambella verde inizia a ridursi autonomamente
  if (donutRadius > 0) {
    donutRadius -= donutShrinkSpeed;
    donutRadius = max(donutRadius, 0); // Non lasciare che diventi negativa
  }

  // Disegna la ciambella verde come stroke se il suo raggio è maggiore di 0
  if (donutRadius > 0) {
    stroke(130, 255, 134, 80);
    strokeWeight(30);
    noFill();
    ellipse(width / 2, height / 2, donutRadius * 2, donutRadius * 2);
  }

  // Disegna il cerchio bianco con fill
  fill(255);
  noStroke();
  ellipse(width / 2, height / 2, innerRadius * 2, innerRadius * 2);

  // Disegna il cerchio della massima velocità (bordo esterno)
  stroke(255);
  strokeWeight(2);
  noFill();
  ellipse(width / 2, height / 2, maxRadius * 2, maxRadius * 2);

  // Verifica collisione tra auto1 e auto2
  if (auto1X + img1.width / 8 > auto2X) {
    gameOver = true;
  }

  // Visualizza il contatore al centro del cerchio
  if (!gameOver) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(80);
    textFont("aktiv-grotesk");
    textStyle(BOLD);
    text(int(counter), width / 2, height / 2 + 5);
  }
}
