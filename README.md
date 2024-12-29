![Movinwblocks Logo](https://a.storyblok.com/f/99692/1280x640/09cb8a5371/movinblocks-logo.jpg)

# Movinblocks
Movinblocks is a lightweight plugin for animating HTML elements sequentially.

## Playground
Explore Movinblocks's capabilities in the [Playground]().

---

## Installation
```sh
npm install movinblocks
# npx movinblocks
# pnpm add movinblocks
# yarn add movinblocks
```

## Basic Usage
### HTML
```html
<header id="header">I am a header</header>
<main id="main">
  <section id="section">I am a section</section>
</main>
<footer id="footer">I am a footer</footer>
```

### Javascript & CSS
#### Using a Framework or Bundler (Recommended)
```typescript
import Movinblocks from 'movinblocks';
import 'movinblocks/styles';

const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .start();
```

##### CSS Imports
You can include all css styles at once:
```typescript
import Movinblocks from 'movinblocks';

// Imports ALL styles
import 'movinblocks/styles';
```

Or import the styles you need only:
```typescript
import Movinblocks from 'movinblocks';

// Import the base styles (required)
import 'movinblocks/styles/base';

// Only import the animations you need
import 'movinblocks/styles/fadeIn';
import 'movinblocks/styles/revealInTop';
```

#### Using a CDN
```html
<script src="https://unpkg.com/movinblocks/dist/movinblocks.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/movinblocks@1.0.1/dist/styles/movinblocks.css">
<!--
 Or you can import animations individually:

 <link rel="stylesheet" href="https://unpkg.com/movinblocks@1.0.1/dist/styles/base.css">
 <link rel="stylesheet" href="https://unpkg.com/movinblocks@1.0.1/dist/styles/animations/fadein.css">
 <link rel="stylesheet" href="https://unpkg.com/movinblocks@1.0.1/dist/styles/animations/revealintop.css">
 -->

<script>
  (function () {
    const mbInstance = new Movinblocks()
      .setTimeline(['header', 'main', 'section', 'footer'])
      .start();
  })();
</script>
```

## API
Movinblocks comes with a minimal API:

| Method | Description |
|--|--|
| `setTimeline()` | Sets the sequence of HTML element IDs that will be animated in order of appearence (See [setTimeline()](#settimeline)). |
| `setAnimation()`| Specifies the animation style to be applied to the elements (e.g., `fadeIn`) (See [setAnimation()](#setAnimation)). |
| `setDuration()` | Defines the duration (in milliseconds) for each animation in the sequence (See [setDuration()](#setDuration)). |
| `setTimingFunction()` | Defines the css timing function for each animation in the sequence (See [setTimingFunction()](#setTimingFunction)). |
| `setOverlap()`  | Sets the overlap time (in milliseconds) between consecutive animations (See [setOverlap()](#setOverlap)). |
| `setViewportTrigger()` | Starts the animations when the elements intersects the viewport (See [setViewportTrigger()](#setViewportTrigger)). |
| `on()`          | Registers a callback for a specific event (e.g., `start`) during the animation (See [on()](#on)). |
| `start()`       | Initiates the animation sequence based on the configured timeline and settings (See [start()](#start)). |
| `destroy()`       | Destroy the Movinblocks instance (See [destroy()](#destroy)). |

### setTimeline
```typescript
setTimeline(elementIds: string | string[])
```

Use `setTimeline()` to set the sequence and order of appearence of the HTML **element IDs** that will be animated.
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']) // header appears first, main second, section third, etc.
  .start()
```

### setAnimation
```typescript
setAnimation(animationName: MbAnimation | MbAnimation[])
```

Use `setAnimation()` to choose the animation (or animations) for your elements.

If you want each element to have its own animation, declare it as an
*array of MbAnimation strings, with the same length and order as the timeline*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation(['fadeIn', 'slideInTop', 'slideInBottom', 'slideInLeft']) // different animations for each element.
  .start();
```

If you want all elements to have the same animation, declare it as a *MbAnimation string*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('fadeIn') // all elements use the same animation.
  .start();
```

#### Animations Configuration
Movinblocks comes with these CSS Animations:

| Name | Effect |
|--|--|
| `fadeIn` | Elements fade in |
| `fadeOut` | Elements fade out |
| `slideInTop`    | Elements slide+fade in from top to bottom |
| `slideInBottom` | Elements slide+fade in from bottom to top |
| `slideInLeft`   | Elements slide+fade in from left to right |
| `slideInRight`  | Elements slide+fade in from right to left |
| `revealInTop`   | Elements slide+fade in from top to bottom inside a hidden container |
| `revealInBottom` | Elements slide+fade in from bottom to top inside a hidden container |

Alternatively, you can *add custom animations of your own creation, or import them from other vendors* (e.g: [animate.css](https://animate.style/)).

##### Custom Animation
Here is an example of how to add a **custom animation**:
```css
@keyframes myCustomAnimation {
  from {
    opacity: 1;
    background-color: #000;
  }

  to {
    opacity: 0;
    background-color: #4BAFFF;
  }
}

.myCustomAnimation {
  animation-name: myCustomAnimation;
}
```

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('myCustomAnimation' as MbCustomAnimation)
  .start()
```

##### Vendor Animation
Here is an example of how to add the `bounceInUp` animation of [animate.css](https://animate.style/):

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('animate__animated animate__bounceInUp' as MbCustomAnimation)
  .start()
```

### setTimingFunction
```typescript
setTimingFunction(timingFunctionName: MbTimingFunction | MbTimingFunction[])
```

Use `setTimingFunction()` to choose the timing function (or functions) for your elements.

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setTimingFunction(['ease-in', 'linear', 'ease-in-out', 'ease-out']) // different timing functions for each element.
  .start();
```

If you want all elements to have the same timing function, declare it as a *MbTimingFunction string*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setTimingFunction('linear') // all elements use the same timing function.
  .start();
```

### setDuration
```typescript
setDuration(duration: number | number[])
```

Use `setDuration()` to set the duration (in milliseconds) of your element's animations.

If you want each element to have its own duration, declare it as an *array of numbers with the same length and order as the timeline*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration([1000, 500, 1200, 600]) // different durations for each element.
  .start();
```

If you want all elements to have the same animation, declare it as a *number*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(420) // all elements use the same duration.
  .start();
```

### setOverlap
```typescript
setOverlap(overlap: number | number[])
```

Use `setOverlap()` to set the overlap time (in milliseconds) between the animations of your elements.

Important:
Overlap is not supported when `setViewportTrigger()` is enabled (See [setViewportTrigger()](#setOverlap-and-setViewportTrigger) for details).

If you want each element to have its own overlap time, declare it as an array of numbers:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setOverlap([400, 300, 500]) // different overlap times for each element.
  .start();
```
Note:
`setOverlap` takes one value less than the timeline.

So, the `setOverlap([400, 300, 500])` array defines the overlap times for the elements **except for the first one (header)**:
```markdown
1. **0ms** for the `header` element id (first element in the timeline):
  it will start without any overlap.

2. **400ms** for the `main` element id:
  it will start 400ms before `header` finishes.

3. **300ms** for the `section` element id:
  it will start 300ms before `main` finishes.

4. **500ms** for the `footer` element id:
  it will start 500ms before `section` finishes.
```

If you want all elements to have the same overlap time, declare it as a number:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setOverlap(350) // all elements have the same overlap time.
  .start();
```

### setViewportTrigger
```typescript
setViewportTrigger(intersectionOptions: MbIntersectionOptions | null = null)
```

You can choose to trigger Movinblocks **only when the element enters the viewport**.

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setViewportTrigger() // each elements will start animating once inside the viewport.
  .start();
```

If you wish to modify the intersection properties, you can provide an `intersectionOptions` object as parameter of the method.
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setViewportTrigger({
      root: document.querySelector("#myElement"),
      rootMargin: "100px",
      threshold: 1.0,
    })
  .start();
```

#### setOverlap and setViewportTrigger
The **Overlap** functionality is not supported when `setViewportTrigger()` is enabled, as each element animates based on its own appearance in the viewport and no longer adheres to the shared timeline.

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setOverlap(400) // ❌ It won't take effect because setViewportTrigger() is defined.
  .setViewportTrigger()
  .start();
```

### on
Use `on()` to register event listeners for specific events during the animation process.

The `on()` method allows you to define callbacks that will be triggered when these events occurs:
| Method | Description |
|--|--|
| `start` | Triggered when Movinblocks starts. |
| `end` | Triggered when Movinblocks ends. |
| `destroy` | Triggered when the Movinblocks instance is destroyed.|
| `animationStart` | Triggered when an animation starts. |
| `animationIteration` | Triggered when an animation loop completes. |
| `animationEnd` | Triggered when an animation ends. |

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('fadeIn')
  .setDuration(1000)
  .on('start', (data) => console.log('Movinblocks started!', data))
  .on('end', (data) => console.log('Movinblocks ended!', data))
  .start();
```

### start
The `start()` method initiates the animation sequence configured for Movinblocks.

You can call `start()` as the last method in the instance chain for a straightforward setup:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .start();
```

Alternatively, you can detach it from the instance declaration and invoke it later in your code:
```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']);
  .setDuration(420);

setTimeout(() => console.log('Just killing time'), 2000);
mbInstance.start();
```

### destroy
The `destroy()` method destroys a Movinblocks instance (including events, classes, and other resources).

```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']);
  .start();

setTimeout(() => mbInstance.destroy(), 2000) // Triggers the destroy after 2 seconds.
```
