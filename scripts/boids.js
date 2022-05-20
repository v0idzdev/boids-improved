//////////////////////
// PARTICLE SYSTEM. //
//////////////////////

// This is used to change the way particles behave.
// Dissipation is the decrease in alpha (transparency) per frame.
// Deceleration is the speed at which their velocity slows down.
const settings = {
    dissipation: 0.015,
    radius: 4.25
}

/**
 * Basic particle to be used in a simple particle effects system. Spawn
 * particles in the boid class so that they emit particles on movement.
 */
class Particle {
    constructor({ pos: [px, py], colour: string }) {
        this.pos = createVector(px, py)
        this.colour = string
        this.alpha = 1
    }

    /**
     * Updates the particles's position, velocity, and alpha.
     */
    update(delta) {
        this.alpha -= settings.dissipation
    }

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        //let colour = unhex(this.colour)  // Convert to an int

        //fill(colour, this.alpha)
        fill(this.colour)
        circle(this.pos.x, this.pos.y, settings.radius)
    }

    /**
     * Returns true if the particle is invisible or outside of the
     * canvas bounds.
     */
    finished() {
        return this.alpha < 0 ||
            this.pos.x < 0 ||
            this.pos.y < 0 ||
            this.pos.x > width ||
            this.pos.y > height
    }
}

///////////////////////////
// BOID LOGIC/BEHAVIOUR. //
///////////////////////////

// These are the possible colors that boids can be.
// They are selected at random.
const colours = [
    '#ebf9f9',
    '#77c5d5',
    '#1ac4d9',
    '#a8bfc0',
    '#dccccc'
]

/**
 * Rotates the first vector `vec1` around an origin `vec2`
 * by `angle`.
 */
const rotateVec = (vec1, vec2, angle) => {
    return createVector(
        cos(angle) * (vec1.x - vec2.x) - sin(angle) * (vec1.y - vec2.y) + vec1.x,
        sin(angle) * (vec1.x - vec2.x) + cos(angle) * (vec1.y - vec2.y) + vec1.y
    )
}

/**
 * Basic boid object that follows three rules: cohesion, separation,
 * and alignment. Also, it emits particles because sure, why not! :)
 */
class Boid {
    constructor({ pos: [px, py], vel: [vx, vy] }) {
        this.pos = createVector(px, py)
        this.vel = createVector(vx, vy)

        this.colour = random(colours)
        this.radius = 10
        this.size = createVector(4, 12)
        this.particles = []
    }

    /**
     * Called on each frame update. Responsible for updating internal
     * variables with calculations, such as position and velocity.
     */
    update(delta) {
        // Boid logic goes here...

        // !! TEMPORARY !!
        this.pos.x += this.vel.x * delta
        this.pos.y += this.vel.y * delta

        // Update particle system. Add a new one each frame.
        // Iterate backwards to avoid skipping any when one is removed.
        this.particles.push(new Particle({
            pos: [this.pos.x, this.pos.y],
            vel: [this.vel.x, this.vel.y],
            colour: this.colour
        }))

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(delta)

            if (this.particles[i].finished())  // Remove the particle if it's finished.
                this.particles.splice(i, 1)
        }
    }

    /**
     * Also called on each frame update. Responsible for rendering
     * the boid in its current.
     */
    draw() {
        // Calculate the points that make up a triangle and calculate their
        // rotation around the boid's position.
        // The points are not named because is doesn't matter which order they're in.
        const rotation = atan2(this.vel.y, this.vel.x)
        const [p1, p2, p3] = [
            createVector(
                this.pos.x - (this.size.x / 2),
                this.pos.y + (this.size.y / 3),
            ),
            createVector(
                this.pos.x + (this.size.x / 2),
                this.pos.y + (this.size.y / 3)
            ),
            createVector(
                this.pos.x,
                this.pos.y - (this.size.y / 3 * 2),
            ),
        ]
        //.map(point => rotateVec(point, this.pos, rotation))

        push()  // Save current transformation settings

        translate(this.pos.x - (this.size / 2), this.pos.y - (this.size / 2))
        rotate(rotation)


        fill(this.colour)
        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

        pop()  // Restore previous transformation settings

        // Render particles in this.particles.
        // These should be updated in this.update().
        for (let i = this.particles.length - 1; i >= 0; i--)
            this.particles[i].draw()
    }
}