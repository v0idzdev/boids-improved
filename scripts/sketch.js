// Use these settings to change the screen parameters.
const view = {
  width: 1000,
  height: 800,
  background: "#FFFFFF",
}

// Use these settings to change the way boids behave.
const flock = {
  numBoids: 50,
  boidDiameter: 10,
  spatialHashCellSize: view.height / (boidDiameter * 4),
  alignment: 0.5,
  separation: 0.3,
  cohesion: 0.2,
}

/**
 * Called by p5.js before the first frame update.
 */
function setup() {
  createCanvas(view.width, view.height, WEBGL)
}

/**
 * Called by p5.js on each frame update.
 */
function draw() {
  background(view.background)
}
