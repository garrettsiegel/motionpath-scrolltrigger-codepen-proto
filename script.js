gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const viewport = document.querySelector("#viewport");
const world = document.querySelector("#world");
const bee = document.querySelector("#bee");
const sections = document.querySelectorAll(".page > div");
const scrollPath = document.querySelector("#scrollPath");
const setX = gsap.quickSetter(world, "x", "px");
const setY = gsap.quickSetter(world, "y", "px");
const setOrigin = gsap.quickSetter(world, "transformOrigin");
const beeProps = gsap.getProperty(bee);
let vw, vh, clampX, clampY, worldWidth, worldHeight;
let scrollTweenObject;

function generatePath() {
    let d = "";
    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2 + window.scrollY

      // need to make this a bezier curve instead of straight line
      d += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
    });

    scrollPath.setAttribute("d", d);
}

function createScrollTween() {
  scrollTweenObject = gsap.from(bee, {
    scrollTrigger: {
      trigger: "#viewport",
      pin: "#viewport",
      start: "top top",
      scrub: true,
      markers: true,
      // this seems to be cutting off too short
      end: "+=" + world.offsetHeight
    },
    motionPath: {
      path: scrollPath,
      align: scrollPath,
      alignOrigin: [0.5, 0.5],
      // why is this in reverse?
      start: 1,
      end: 0
    },
    ease: "linear",
    onUpdate: () => {
      const x = beeProps("x");
      const y = beeProps("y");
      setOrigin(`${x}px ${y}px`);
      setX(-clampX(x - vw / 2));
      setY(-clampY(y - vh / 2));
    }
  });
}

function onResize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  worldWidth = world.offsetWidth;
  worldHeight = world.offsetHeight;
  clampX = gsap.utils.clamp(0, worldWidth - vw);
  clampY = gsap.utils.clamp(0, worldHeight - vh);

  generatePath();

  if (scrollTweenObject) {
    let progress = scrollTweenObject.progress();
    scrollTweenObject.kill();
    scrollTweenObject = createScrollTween();
    scrollTweenObject.progress(progress);
  } else {
    scrollTweenObject = createScrollTween();
  }
}

window.addEventListener("resize", onResize);
window.addEventListener("load", onResize);
