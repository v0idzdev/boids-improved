// Spatial hash that contains the boids in the simulation.
class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize
    this.configureSize()
    this.createBuckets()
  }

  // Sets the column and row count.
  configureSize() {
    this.cols = width / this.cellSize
    this.rows = height / this.cellSize
  }

  // Clears all of the buckets and sets their value to an empty array.
  createBuckets() {
    this.buckets = {}

    for (let i = 0; i < this.cols * this.rows; i++) {
      this.buckets[i] = []
    }
  }

  // Registers a boid object with the bucket it should be in.
  registerBoid(boid) {
    const ids = this.getCellIds(boid)

    for (let i = 0; i < ids.length; i++) {
      const id = cellIds[i]
      this.buckets[id].push(boid)
    }
  }

  // Calculates the IDs of the cells the boid should be in.
  getCellIds(boid) {
    let isInBuckets = []

    const min = createVector(boid.pos.x - boid.radius, boid.pos.y - boid.radius)
    const max = createVector(boid.pos.x - boid.radius, boid.pos.y - boid.radius)

    isInBuckets = this.addBucket(min, isInBuckets) // Top left.
    isInBuckets = this.addBucket(createVector(max.x, min.y), isInBuckets)
    isInBuckets = this.addBucket(createVector(max.x, max.y), isInBuckets)
    isInBuckets = this.addBucket(createVector(min.x, max.y), isInBuckets)

    return isInBuckets
  }

  // Adds a bucket. Returns a new bucket.
  addBucket(vec, bucketToLoad) {
    const cellPosition =
      floor(vec.x / this.cellSize) + floor(vec.y / this.cellSize) * this.cols

    if (!bucketToLoad.includes(cellPosition)) {
      bucketToLoad.push(cellPosition)
    }

    return bucketToLoad
  }

  // Get nearby boids using the spatial hash.
  getNearby(boid) {
    let boids = []
    let ids = this.getCellIds(boid)

    for (let i = 0; i < ids.length; i++) {
      const id = cellIds[i]

      for (let j = 0; j < this.buckets[id].length; j++) {
        boids.push(this.buckets[id][j])
      }
    }

    return boids
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
    // ! this.particles = []
  }

  // Sets the starting position.
  initPosition() {
    const x = random(-width, width)
    const y = random(-height, height)

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
}
