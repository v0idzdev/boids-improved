// Change these to alter the screen settings.
const view = {
    height: 800,
    width: 1000,
    background: 230,
}

// Change these to alter the way boids behave. You can change
// the colours used in library/boid.js.
const simulation = {
    numBoids: 20,
}

// This will store all of the boids in the simulation.
let boids = []

/**
 * Called by p5.js before the first frame update.
 */
function setup() {
    createCanvas(view.width, view.height, WEBGL)

    // Generate an array of boids with randomised positions and
    // velocities.
    for (let i = 0; i < simulation.numBoids; i++) {
        boids.push(new Boid({
            pos: [random(-500, 500), random(-500, 500)],
            vel: [random(-50, 50), random(-50, 50)]
        }))
    }
}

/**
 * Called by p5.js on each frame update.
 */
function draw() {
    background(view.background)
    noStroke()

    let delta = deltaTime / 1000  // Convert deltaTime from ms. to s.

    // Update and draw each boid.
    for (let i = 0; i < simulation.numBoids; i++) {
        boids[i].update(delta)
        boids[i].draw()
    }
}