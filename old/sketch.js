const boids = [];
const numBoids = 85;

let overpassMono;
let alignmentSlider, cohesionSlider, separationSlider;

function preload() {
  overpassMono = loadFont("../fonts/static/OverpassMono-SemiBold.ttf");
}

/**
 * Called by p5.js before the first frame update.
 */
function setup() {
  createCanvas(1531, 980, WEBGL);

  // Create sliders that are used to control the parameters
  // of the simulation.
  alignmentSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);

  for (let i = 0; i < numBoids; i++) {
    boids.push(new Boid());
  }
}

/**
 * Called by p5.js on each frame update.
 */
function draw() {
  background(0);
  noStroke();

  for (let i = 0; i < boids.length; i++) {
    boids[i].stayInBounds();
    boids[i].flockWith(boids);
    boids[i].update();
    boids[i].show();
  }
}
