// Change these to alter the screen settings.
const view = {
    height: 800,
    width: 1000,
    background: 230,
}

// NOTE:
// Some of the code below is slighly ugly/hard to read. Unfortunately
// I had to sacrifice these things for efficiency.

// Global constants used to alter boid appearance and behaviour.
const conf = {
    sizeX: 4,
    sizeY: 12,
    numBoids: 20,
    initSpeed: 10  // Max initial speed
}

// Global variable that stores all of the boids in the
// simulation. Accessible by other functions.
var boids = []

/**
 * Fills boids with randomly initialised boids. The parameters
 * used can be changed by editing conf.
 */
function createBoids() {
    // Define an area in which the boids can spawn.
    // This is set to the canvas width and height.
    const areaX = width / 2
    const areaY = height / 2

    for (let i = 0; i < conf.numBoids; i++)
        boids.push({
            x: random(-areaX, areaX),
            y: random(-areaY, areaY),
            vx: random(-conf.initSpeed, conf.initSpeed),
            vy: random(-conf.initSpeed, conf.initSpeed)
        })
}

/**
 * Renders the boids in the simulation to the screen.
 */
function drawBoids() {
    // Calculate the points that make up a triangle using the
    // settings in conf.
    // Render each boid as a triangle to the HTML canvas.
    for (let i = 0; i < boids.length; i++) {
        const x1 = boids[i].x
        const y1 = boids[i].y + (conf.sizeY * (3 / 2))
        const x2 = boids[i].x - (conf.sizeX / 2)
        const y2 = boids[i].y - (conf.sizeY / 3)
        const x3 = boids[i].x + (conf.sizeX / 2)
        const y3 = boids[i].y - (conf.sizeY / 3)

        const t = [  // Triangle co-ordinates
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: x3, y: y3 },
        ]

        // Rotate each point accordingly.
        // Convert the angle of the boid's velocity to radians.
        const angle = atan2(boids[i].vy, boids[i].vx) * (Math.PI / 180)

        for (let i = 0; i < 3; i++) {
            const angle = atan2(t[i].y, t[i].x) * (Math.PI / 180)

            t[i].x = cos(angle) * (t[i].x - boids[i].x) - sin(angle) * (t[i].y - boids[i].y) + boids[i].x
            t[i].y = sin(angle) * (t[i].x - boids[i].x) + cos(angle) * (t[i].y - boids[i].y) + boids[i].y
        }

        // Draw the triangle to the canvas.
        triangle(t[0].x, t[0].y, t[1].x, t[1].y, t[2].x, t[2].y)

        ////////////////////////////////////
        console.log(t)
    }
}

/**
 * Updates the boids in the simulation.
 * Call this in the draw function and pass in deltaTime / 1000.
 */
function updateBoids() {
    for (let i = 0; i < boids.length; i++) {
        const v1 = _rule1(boids[i])  // Boids flock towards the center of mass.
        const v2 = _rule2(boids[i])  // Boids avoid other boids.
        const v3 = _rule3(boids[i])  // Boids try to match the speed of other boids.

        // Calculate the resultant vector from the application
        // of the three rules.
        const vFinal = {
            x: v1.x + v2.x + v3.x,
            y: v1.y + v2.y + v3.y
        }

        // Update positions.
        boids[i].vx += vFinal.x
        boids[i].vy += vFinal.y

        // Update velocities.
        boids[i].x += boids[i].vx
        boids[i].y += boids[i].vy
    }
}

/**
 * Rule 1: Cohesion
 * 
 * Returns a vector that points towards the average
 * position of neighbouring boids.
 */
function _rule1(boid) {

}

/**
 * Called by p5.js before the first frame update.
 */
function setup() {
    createCanvas(view.width, view.height, WEBGL)
    rectMode(CENTER)
    noStroke()
    fill('black')

    createBoids()
}

/**
 * Called by p5.js on each frame update.
 */
function draw() {
    background(view.background)
    noLoop()
    drawBoids()
}