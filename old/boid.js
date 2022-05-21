const boidColors = ["#FB8C0D", "#E35E0B", "#FA3A00", "#E31D0B", "#FF1A4E"]

/**
 * Models a particle emitted by a boid.
 */
class Particle {
  /**
   * Create a particle instance.
   */
  constructor({ position: [x, y], velocity: [vx, vy], color: value }) {
    this.position = createVector(x, y)
    this.velocity = createVector(vx, vy)

    this.color = lerpColor(
      color(value),
      color(random(boidColors)),
      deltaTime / 1000
    )
    this.alpha = 150
    this.sizeDissipation = random(0.01, 0.63) // The speed at which the size decreases.
    this.alphaDissipation = random(1.1, 8.2) // The speed at which the transparency decreases.
    this.size = random(1.5, 9.5)

    // Random direction.
    this.position = createVector(
      random(
        this.position.x - this.velocity.y,
        this.position.x + this.velocity.y
      ),
      random(
        this.position.y - this.velocity.x,
        this.position.y + this.velocity.x
      )
    )
  }

  /**
   * Updates the particle's transparency and size values.
   */
  update() {
    this.alpha -= this.alphaDissipation
    this.size -= this.sizeDissipation
    this.color.setAlpha(this.alpha)
  }

  /**
   * Renders the particle on the canvas.
   */
  show() {
    fill(this.color)
    circle(this.position.x, this.position.y, this.size)
  }

  /**
   * Returns a boolean value indicating whether the particle is
   * invisible or has gone outside of the bounds of the simulation.
   */
  finished() {
    return (
      this.alpha < 0 ||
      this.size < 0 ||
      this.position.x < -width / 2 ||
      this.position.x > width / 2 ||
      this.position.y < -height / 2 ||
      this.position.y > height / 2
    )
  }
}

/**
 * Models an agent in the flocking simulation.
 */
class Boid {
  /**
   * Create a boid instance.
   */
  constructor() {
    this.position = createVector(random(-width, width), random(-height, height))

    this.velocity = p5.Vector.random2D().setMag(random(2, 4))
    this.acceleration = createVector()
    this.maxForce = 1 //0.2;
    this.maxSpeed = 4
    this.color = random(boidColors)
    // this.particlesPerSecond = 100;
    // this.timeSinceLastParticle = 0;
    this.particles = []
  }

  /**
   * Renders the boid on the canvas at its current position.
   */
  show() {
    fill(this.color)
    circle(this.position.x, this.position.y, 8)

    // Loop over each particle and update it.
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].show()
    }
  }

  /**
   * Updates the boid's position and velocity with respect to the
   * total force accumulated via applying the three rules of flocking.
   */
  update() {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration).limit(this.maxSpeed)
    this.acceleration.set(0, 0)

    // Create a new particle and add it to the list of particles
    // for this boid. Then loop over each particle and update it.
    this.timeSinceLastParticle += deltaTime / 1000

    // if (this.timeSinceLastParticle > this.particlesPerSecond) {
    this.particles.push(
      new Particle({
        position: [this.position.x, this.position.y],
        velocity: [this.velocity.x, this.velocity.y],
        color: this.color,
      })
    )

    //   this.timeSinceLastParticle = 0;
    // }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].finished()) {
        this.particles.splice(i, 1)
        continue
      }

      this.particles[i].update()
    }
  }

  /**
   * Applies the three rules of flocking behaviour to calculate
   * the direction to move in per frame.
   */
  flockWith(boids) {
    let alignmentForce = this.alignWith(boids).mult(alignmentSlider.value())
    let cohesionForce = this.cohesionWith(boids).mult(cohesionSlider.value())
    let separationForce = this.separationWith(boids).mult(
      separationSlider.value()
    )

    this.acceleration
      .add(alignmentForce)
      .add(cohesionForce)
      .add(separationForce)
  }

  /**
   * Calculates the average velocity of neighboring boids,
   * and steers towards it.
   */
  alignWith(boids) {
    let perceptionRadius = 50
    let steeringForce = createVector()
    let numNeighbors = 0

    for (let i = 0; i < boids.length; i++) {
      let distance = dist(
        this.position.x,
        this.position.y,
        boids[i].position.x,
        boids[i].position.y
      )

      if (boids[i] != this && distance < perceptionRadius) {
        steeringForce.add(boids[i].velocity)
        numNeighbors++
      }
    }

    if (numNeighbors > 0)
      steeringForce
        .div(numNeighbors)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce)

    return steeringForce
  }

  /**
   * Calculates the average velocity of neighboring boids,
   * and steers towards it.
   */
  cohesionWith(boids) {
    let perceptionRadius = 100
    let steeringForce = createVector()
    let numNeighbors = 0

    for (let i = 0; i < boids.length; i++) {
      let distance = dist(
        this.position.x,
        this.position.y,
        boids[i].position.x,
        boids[i].position.y
      )

      if (boids[i] != this && distance < perceptionRadius) {
        steeringForce.add(boids[i].position)
        numNeighbors++
      }
    }

    if (numNeighbors > 0)
      steeringForce
        .div(numNeighbors)
        .sub(this.position)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce)

    return steeringForce
  }

  /**
   * Steers away from other boids within a specified protected
   * radius.
   */
  separationWith(boids) {
    let perceptionRadius = 50
    let steeringForce = createVector()
    let numNeighbors = 0

    for (let i = 0; i < boids.length; i++) {
      let distance = dist(
        this.position.x,
        this.position.y,
        boids[i].position.x,
        boids[i].position.y
      )

      if (boids[i] != this && distance < perceptionRadius) {
        let difference = p5.Vector.sub(this.position, boids[i].position).div(
          distance
        )

        steeringForce.add(difference)
        numNeighbors++
      }
    }

    if (numNeighbors > 0)
      steeringForce
        .div(numNeighbors)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce)

    return steeringForce
  }

  /**
   * Implements screen wrapping to prevent boids from
   * disappearing from the canvas.
   */
  stayInBounds() {
    if (this.position.x > width / 2) this.position.x = -width / 2
    else if (this.position.x < -width / 2) this.position.x = width / 2

    if (this.position.y > height / 2) this.position.y = -height / 2
    else if (this.position.y < -height / 2) this.position.y = height / 2
  }
}
