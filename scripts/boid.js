/**
 * Custom data type that provides an abstracted interface for working
 * with spatial hashing/spatial subdivisions.
 */
class SpatialHash {
  /**
   * Creates a new SpatialHash instance. Append boids to the spatial hash
   * by calling SpatialHash.add(boid).
   *
   * @param {Object} params Parameters used to construct the spatial hash.
   */
  constructor({ cellSize: size = 50 }) {
    this.cellSize = size
    this.hashTable = {}
  }

  /**
   * Appends a boid to the spatial hash. Pass in the boid instance as
   * opposed to its attributes.
   *
   * @param {Boid} boid The boid object to add to the hash table.
   */
  add(boid) {
    let key = this._calculateKey(boid)
    if (this.hashTable[key] == undefined) this.hashTable[key] = []
    this.hashTable[key].push(boid)
  }

  /**
   * Removes a boid from the spatial hash. Pass in the boid instance as
   * opposed to its attributes.
   *
   * @param {Boid} boid The boid object to remove from the hash table.
   */
  remove(boid) {
    let key = this._calculateKey(boid)
    if (this.hashTable[key] == undefined) this.hashTable[key] = []
    delete this.hashTable[key]
  }

  /**
   * Returns an array of boids at the cell that encompasses its position
   * co-ordinates.
   *
   * @param {Boid} boid The boid to return all items for in its cell.
   */
  get(boid) {
    let key = this._calculateKey(boid)
    if (this.hashTable[key] == undefined) this.hashTable[key] = []
    return this.hashTable[key]
  }

  /**
   * Calculates the key of a given boid within the hash table. Used as
   * a private, internal method.
   *
   * @param {Boid} boid The boid to find the key of.
   */
  _calculateKey(boid) {
    return `${round(boid.position.x / this.cellSize) * this.cellSize},${
      round(boid.position.y / this.cellSize) * this.cellSize
    }`
  }
}

/**
 * Represents the collection of boids being simulated. Parameters
 * used here affect all of the boids within the simulation.
 */
class Flock {
  /**
   * Create a flock object. Change parameters passed in to alter
   * the behaviour of all boids in the simulation.
   *
   * @param {Object} params The parameters used to initialise the flock.
   */
  constructor({
    spatialHashCellSize: size,
    numBoids: num,
    boidSettings: {
      // Controls boid parameters.
      // Used to create new boids in the Flock constructor.
      boidDiameter: diameterValue,
      alignment: alignmentValue,
      separation: separationValue,
      cohesion: cohesionValue,
      initialVelocityRange: {
        min: minVelocityValue = 2, // Minimum initial velocity.
        max: maxVelocityValue = 4, // Maximum initial velocity.
      },

      maxForce: maxForceValue,
      maxSpeed: maxSpeedValue,
      colorPalette: hexColorValues = [
        // These are set to a default value.
        "#FB8C0D",
        "#E35E0B",
        "#FA3A00",
        "#E31D0B",
        "#FF1A4E",
      ],
    },
  }) {
    this.boids = this._generateBoids()
    this.spatialHashCellSize = size
    this.numBoids = num
    this.boidSettings = boidSettings
  }

  /**
   * Renders the boids on screen on a cell-by-cell basis,
   * using the spatial partition created for the boid simulation.
   */
  update() {
    // Update the spatial hash table

    // Update each cell and the boids within it
    for (const [key, boidArray] of Object.entries(this.boids))
      for (let i = 0; i < boidArray.length; i++) {
        boidArray[i].update(boidArray)
      }
  }

  /**
   * Generates an array of boids and appends them to the spatial partition
   * table. Generates boids randomly based on Flock parameters.
   */
  _generateBoids() {
    let boids = new SpatialHash({ cellSize: this.spatialHashCellSize })

    for (let i = 0; i < this.numBoids; i++)
      boids.add(new Boid(this.boidSettings))

    return boids
  }
}

/**
 * Represents a boid within the simulation. Can be configured
 * by changing the parameters passed into the constructor.
 */
class Boid {
  /**
   * Create a boid object. In order to exhibit different behaviour,
   * change the parameters used in this function.
   *
   * @param {Object} boidSettings Settings to control the boid.
   */
  constructor({
    boidSettings: {
      // Controls boid parameters.
      boidDiameter: diameterValue,
      alignment: alignmentValue,
      separation: separationValue,
      cohesion: cohesionValue,
      initialVelocityRange: {
        min: minVelocityValue = 2, // Minimum initial velocity.
        max: maxVelocityValue = 4, // Maximum initial velocity.
      },

      maxForce: maxForceValue,
      maxSpeed: maxSpeedValue,
      colorPalette: hexColorValues = [
        // These are set to a default value.
        "#FB8C0D",
        "#E35E0B",
        "#FA3A00",
        "#E31D0B",
        "#FF1A4E",
      ],
    },
  }) {
    // Configure basic parameters.
    this.diameter = diameterValue
    this.alignment = alignmentValue
    this.separation = separationValue
    this.cohesion = cohesionValue

    // Initialise the boid's position as a random location on screen.
    this.position = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2)
    )

    // Initialise the boid's velocity randomly between the minimum and
    // maximum initial velocities passed in.
    this.velocity = p5.Vector.random2D().setMag(
      random(minVelocityValue, maxVelocityValue)
    )

    // Configure acceleration and force parameters.
    // Choose a random color from the color palette passed in.
    this.acceleration = createVector()
    this.maxForce = maxForceValue
    this.maxSpeed = maxSpeedValue
    this.color = random(hexColorValues)
  }

  /**
   * Renders the boids on screen on a cell-by-cell basis,
   * using the spatial partition created for the boid simulation.
   *
   * @param {Boid} boids The array of boids in the same cell.
   */
  update(boids) {
    // Render the boid to the canvas.
    fill(this.color)
    circle(this.position.x, this.position.y, this.diameter)
  }

  /**
   * Enforces separation, alignment, and cohesion with respect to
   * the boids in the same cell.
   *
   * @param {Boid} boids The neighboring boids in the same cell.
   */
  _enforceRules(boids) {}
}
