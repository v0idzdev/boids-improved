# Boids

## What are Boids?

"Boids" is an **artificial life simulation** originally created by **Craig Reynolds** *(cs.stanford.edu, n.d)*, designed to imitate the flocking behaviour exhibited by birds. Boid behaviour is governed by three mathematical principles.

These are as follows *(Ben Eater, n. d)*:

* **Cohesion**: Each boid flies towards other boids, gradually steering towards the average position of its neighbours. 
* **Separation**: Each boid tries to avoid running into other boids. If it gets too close to another, it'll steer away.
* **Alignment**: Each boid tries to match the speed and direction of the other boids around it.

## Examples

Here are some examples from my implementation. If you'd like to learn more about boids, look at **[Sebastian Lague's video](https://www.youtube.com/watch?v=bqtqltqcQhw)** about them on YouTube. **I've added all of the websites**, **YouTube** videos, and **scientific papers** I used to create Boids in the **[references](#references)** section if you're interested.

![image](https://user-images.githubusercontent.com/88111643/169629779-3da92622-704a-47ce-a591-5f317d8082c3.png)

> [Above] Boids abide by three rules: **separation**, **alignment**, and **cohesion**.

![image](https://user-images.githubusercontent.com/88111643/169629804-14f9c2ff-5641-4030-8404-c98b27129066.png)

> [Above] As you can see, the boids aren't in one large group. This is because each of them has a **view radius**.

## Running This Implementation of Boids

You can simply download this repository as a **.ZIP** file and open `index.html` in your preferred browser.

However, when this is run directly, issues sometimes occur. I would recommend running this simulation using the following steps. Firstly, **clone the repository** and **navigate to the root directory** by running:

```bash
git clone https://github.com/matthewflegg/boids-improved.git
cd boids-improved
```

Then, if you have **Python** installed, run the following command. This will **serve the HTML file locally** using Python's built in HTTP server.

```bash
pushd index.html
python3 -m http.server 9999
popd
<browser> 0.0.0.0:9999  # Replace <browser> with your browser. For instance, `google-chrome`, or `firefox`.
```

If you do not have **Python** installed, **run either of the following commands**, depending on your browser. If you use a different one than what's listed below, try and type its name in the same format:

```bash
google-chrome index.html  # For Chrome users.
firefox index.html         # For Firefox users.
<browser> index.html      # Replace <browser> with your browser.
```

## Am I Going To Develop This Further?

**Yes, of course**! I'd really like to write some **[GLSL shaders](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiO37LIwu_3AhVISkEAHRWkCIkQFnoECAwQAw&url=https%3A%2F%2Fwww.khronos.org%2Fopengl%2Fwiki%2FOpenGL_Shading_Language&usg=AOvVaw1MAt44nlQbnOwDcka6Fxx4)** as p5.js offers support for them via their **[WEBGL Rendering Context](https://p5js.org/reference/#/p5/WEBGL)**.

## References

*cs.stanford.edu. (n.d.)*. **Boids**. [online] Available at: **https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html**.

‌*Ben Eater. (n.d.)*. **Boids algorithm**. [online] Available at: **https://eater.net/boids**.

*Sebastian Lague. (n.d.)*. **Coding Adventure: Boids**. [online] Available at: **https://www.youtube.com/watch?v=bqtqltqcQhw** [Accessed 21 May 2022].

*Sergio Abreu. (n.d.)*. **Boids - The Emergence of Flocks**. [online] Available at: **https://www.youtube.com/watch?v=pXQCasmBhY4&t=247s** [Accessed 21 May 2022].

*dante. (n.d.)*. **How do Boids Work? A Flocking Simulation**. [online] Available at: **https://www.youtube.com/watch?v=QbUPfMXXQIY&t=101s [Accessed 21 May 2022]**.

*http://www.cs.cmu.edu (2010)*. **Flocking and Steering Behaviors**. [online] Available at: **http://www.cs.cmu.edu/afs/cs/academic/class/15462-s10/www/lec-slides/Lecture24_flocking.pdf** [Accessed 21 May 2022].
