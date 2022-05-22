// Use these settings to change the screen parameters.
const view = {
  width: 1000,
  height: 800,
  background: "#000000",
}

// Use these settings to change the way boids behave.
const flock = {
  numBoids: 250,
  boidDiameter: 8,
  spatialHashCellSize: 50,
  alignment: 0.5,
  separation: 0.3,
  cohesion: 0.2,
  initialVelocity: { min: 2, max: 4 },
}

// Boids will be one of these colors, chosen at random.
const colorPalette = [
  "#FB8C0D",
  "#E35E0B", 
  "#FA3A00",
  "#E31D0B",
  "#FF1A4E"
]

// This will be used to store the boids.
let boids

// These will be used to control parameters while the simulation
// is running
let cohesionSlider
let alignmentSlider
let separationSlider

/**
 * Called by p5.js before the first frame update.
 */
function setup() {
  createCanvas(view.width, view.height)
  background(view.background)

  boids = new SpatialHash({ cellSize: flock.spatialHashCellSize })

  // These are set to optimal default values.
  // These can be changed for debugging purposes if needed.
  alignmentSlider = createSlider(0, 2, 0.5, 0.1);
  cohesionSlider = createSlider(0, 2, 0.2, 0.1);
  separationSlider = createSlider(0, 2, 0.3, 0.1);

  // Generate boids based on the parameters set above.
  for (let i = 0; i < flock.numBoids; i++) {
    boids.registerBoid(new Boid({
      velocity: [
        flock.initialVelocity.min,
        flock.initialVelocity.max
      ],

      colors: colorPalette,
      radius: flock.boidDiameter / 2,
      maxForce: 0.3,
      maxSpeed: 4,
    }))
  }
}

/**
 * Called by p5.js on each frame update.
 */
function draw() {
  background(view.background)
  noStroke()

  // Loop over each boid in each cell and update it with respect to
  // the other boids in its cell.
  for (let i = 0; i < boids.buckets.length; i++) {
    let bucket = boids.buckets[i]

    for (let j = 0; j < bucket.length; j++) {
      let boid = bucket[j]

      boid.update(boids.getNearby(boid))
      boid.render()
    }
  }

  // Clear buckets and calculate new cell positions.
  boids.updateCells()
}
