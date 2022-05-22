// Spatial hash that contains the boids in the simulation.
class SpatialHash {
  constructor({ cellSize: size }) {
    this.cellSize = size
    this.configureSize()
    this.createNewBuckets()
  }

  // Sets the column and row count.
  configureSize() {
    this.cols = width / this.cellSize
    this.rows = height / this.cellSize
  }

  // Clears all of the buckets and sets their value to an empty array.
  createNewBuckets() {
    this.buckets = []

    for (let i = 0; i < this.cols * this.rows; i++)
      this.buckets.push([])
  }

  // Registers a boid object with the bucket it should be in.
  registerBoid(boid) {
    let id = this.getCellId(boid)

    if (id >= 0 && id < this.buckets.length) {
      if (!this.buckets[id].includes(boid)) 
        this.buckets[id].push(boid)
    }
  }

  // Recalculates cell IDs of all boids and moves them if necessary.
  updateCells() {
    let temp = this.buckets
      .map(x => x.map(x => x))
      .reduce((a, b) => a.concat(...b), [])

    this.createNewBuckets()
    
    for (let i = 0; i < temp.length; i++) {
      this.registerBoid(temp[i])
    }
  }

  // Calculates the IDs of the cells the boid should be in.
  getCellId(boid) {
    return floor(boid.pos.x / this.cellSize) +
           floor(boid.pos.y / this.cellSize) *
           this.cols
  }

  // Get nearby boids using the spatial hash.
  getNearby(boid) {
    let id = this.getCellId(boid)

    return (id < 0 || id >= this.buckets.length)
      ? []
      : this.buckets[id] 
            .map(x => x)
            .filter(x => x !== boid)
  }
}

// Models a particle emitted by a boid.
class Particle {
  constructor({ pos, vel, colorValue }) {
    this.pos = pos 
    this.vel = vel 
    this.color = this.initColor(colorValue)

    this.alpha = 150
    this.sizeDissipation = random(0.1, 0.63)
    this.alphaDissipation = random(0.11, 8.2)
    this.size = random(1.5, 6.5)

    this.pos = createVector(random(this.pos.x - this.vel.y,
                                   this.pos.x + this.vel.y),
                            random(this.pos.y - this.vel.x,
                                   this.pos.y + this.vel.x))
  }

  // Chooses a color from colorPalette and linearly
  // interpolates to it from the emitting boid's color.
  initColor(colorValue) {
    let randomColor = random(colorPalette)

    return lerpColor(color(colorValue),
                     color(randomColor),
                     deltaTime / 1000)
  }

  // Updates the particle's transparency and alpha values.
  update() {
    this.alpha -= this.alphaDissipation
    this.size -= this.sizeDissipation
    this.color.setAlpha(alpha)
  }

  // Renders the particle on screen.
  render() {
    fill(this.color)
    circle(this.pos.x, this.pos.y, this.size)
  }

  // Returns a boolean indicating whether to delete the particle.
  // True if it's invisible or off screen.
  finished() {
    return (
      this.alpha < 0 ||
      this.size < 0 ||
      this.pos.x < 0 ||
      this.pos.y < 0 ||
      this.pos.x > width ||
      this.pos.y > height
    )
  }
}

// Models a single boid in the simuation.
class Boid {
  constructor({ velocity: [min, max], colors, radius, maxForce, maxSpeed }) {
    this.pos = this.initPosition()
    this.vel = this.initVelocity(min, max)

    // Set up colors, particles, etc.
    this.color = random(colors)
    this.accel = createVector()
    this.radius = radius
    this.maxForce = maxForce
    this.maxSpeed = maxSpeed
    this.particles = []
  }

  // Sets the starting position.
  initPosition() {
    const x = random(0, width)
    const y = random(0, height)
    return createVector(x, y)
  }

  // Sets the starting velocity.
  initVelocity(min, max) {
    return p5.Vector
      .random2D()
      .setMag(min, max)
  }

  // Renders the boid to the canvas.
  render() {
    fill(this.color)
    circle(this.pos.x, this.pos.y, this.radius * 2)
  }

  // Updates the boid's position and velociy with respect to others.
  update(others) {
    let numNeighbors = 0
    let force = {
      alignment: createVector(),
      cohesion: createVector(),
      separation: createVector()
    }

    // Loop over every other boid and update this one.
    for (let i = 0; i < others.length; i++) {
      let distance = dist(this.pos.x,
                          this.pos.y,
                          others[i].pos.x,
                          others[i].pos.y)
      
      // Calculate forces.
      force.alignment.add(others[i].vel)
      force.cohesion.add(others[i].pos)

      let sep = p5.Vector.sub(this.pos, others[i].pos).div(distance)
      force.separation.add(sep)
      numNeighbors++
    }

    // Find the direction to go in to achieve the desired velocity.
    if (numNeighbors > 0) {
      force.alignment
           .div(numNeighbors)
           .setMag(this.maxSpeed)
           .sub(this.vel)
           .limit(this.maxForce)
           .mult(alignmentSlider.value())
        
      force.cohesion
           .div(numNeighbors)
           .sub(this.pos)
           .setMag(this.maxSpeed)
           .sub(this.vel)
           .limit(this.maxForce)
           .mult(cohesionSlider.value())
        
      force.separation
           .div(numNeighbors)
           .setMag(this.maxSpeed)
           .sub(this.vel)
           .limit(this.maxForce)
           .mult(separationSlider.value())
    }

    this.pos.add(this.vel)
    this.vel.add(this.accel).limit(this.maxSpeed)

    // Finally, update acceleration so we can change the boid's
    // velocity and position.
    // Reset velocity before adding forces.
    this.accel.set(0, 0)
              .add(force.alignment)
              .add(force.cohesion)
              .add(force.separation)

    this.screenWrap()
    this.handleParticles()
  }

  // Implements screen wrapping so that the boids stay in bounds.
  screenWrap() {
    if (this.pos.x + this.radius > width) this.pos.x = this.radius
    if (this.pos.y + this.radius > height) this.pos.y = this.radius
    if (this.pos.x - this.radius < 0) this.pos.x = width - this.radius
    if (this.pos.y - this.radius < 0) this.pos.y = height - this.radius
  }

  // Handles particles emitted by the boid.
  // This includes spawning, updating, and rendering.
  handleParticles() {
    this.particles.push(new Particle({
      pos: this.pos,
      vel: this.vel,
      colorValue: this.color
    }))

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i]

      if (particle.finished())
        this.particles.splice(i, 1)

      particle.update()
      particle.render()
    }
  }
}
