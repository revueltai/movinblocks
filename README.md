![Movinwblocks Logo](https://a.storyblok.com/f/99692/600x315/0e60a87860/movinblocks-ogimage.jpg)

# Movinblocks
Movinblocks is a lightweight plugin for animating HTML elements sequentially.

## Playgrounds
Explore Movinblocks's capabilities in the [Playground](https://movinblocks.vercel.app/).

Movinblocks is also available for your favorite Frameworks!

[![Vue](https://a.storyblok.com/f/99692/80x80/38a9ffe002/vue.png)](https://stackblitz.com/edit/movinblocks-vue)
[![React](https://a.storyblok.com/f/99692/80x80/2162faf2ae/react.png)](https://stackblitz.com/edit/movinblocks-react)
[![Nuxt](https://a.storyblok.com/f/99692/80x80/1ee8d02e68/nuxt.png)](https://stackblitz.com/edit/movinblocks-nuxt)
[![Next](https://a.storyblok.com/f/99692/80x80/3d5e4cb32d/next.png)](https://stackblitz.com/edit/movinblocks-next)
[![Svelte](https://a.storyblok.com/f/99692/80x80/316e3ea903/svelte.png)](https://stackblitz.com/edit/movinblocks-svelte)
[![Angular](https://a.storyblok.com/f/99692/80x80/2a2726dabb/angular.png)](https://stackblitz.com/edit/movinblocks-angular)


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
  .prepare()
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
      .prepare()
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
| `prepare()`       | Sets up the timeline, elements, and settings required for the animation sequence, ensuring everything is ready to run (See [prepare()](#prepare)). |
| `start()`       | Triggers the animation sequence using the timeline and settings that were previously prepared (See [start()](#start)). |
| `destroy()`       | Destroy the Movinblocks instance (See [destroy()](#destroy)). |

### setTimeline
```typescript
setTimeline(elementIds: string | string[])
```

Use `setTimeline()` to set the sequence and order of appearence of the HTML **element IDs** that will be animated.
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']) // header appears first, main second, section third, etc.
  .prepare()
  .start();
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
  .prepare()
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
Here is an example of how to add various animations of [animate.css](https://animate.style/):

**Important: Make sure to import animate.css styles.**
`import 'animate.css'`

1. **Using the Same Animation for All Elements**
Apply a shared animate.css animation to all elements in the timeline:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation({ name: 'bounceInUp', vendor: 'animate.css' })
  .start()
```

2. **Using Different Animations for Each Element**
Assign a unique animate.css animation to each element:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation([
    { name: 'fadeIn', vendor: 'animate.css' },
    { name: 'fadeInDown', vendor: 'animate.css' },
    { name: 'bounceInUp', vendor: 'animate.css' },
    { name: 'bounceIn', vendor: 'animate.css' }
  ])
  .start()
```

3. **Mixing animate.css and Built-in Movinblocks Animations**
Combine Movinblocks animations and animate.css animations for different elements:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation([
    // Movinblocks' built-in "fadeIn" animation.
    'fadeIn',

    // Custom animate.css animations.
    { name: 'fadeInDown', vendor: 'animate.css' },
    { name: 'bounceInUp', vendor: 'animate.css' },
    { name: 'bounceIn', vendor: 'animate.css' }
  ])
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
  .prepare()
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
  .prepare()
  .start();
```

If you want all elements to have the same animation, declare it as a *number*:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(420) // all elements use the same duration.
  .prepare()
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
  .prepare()
  .start();
```
Note:
`setOverlap` takes one value less than the timeline.

So, the `setOverlap([400, 300, 500])` array defines the overlap times for the elements **except for the first one (header)**:
```markdown
1. 0ms for the `header` element id (first element in the timeline):
  it will start without any overlap.

2. 400ms for the `main` element id:
  it will start 400ms before `header` finishes.

3. 300ms for the `section` element id:
  it will start 300ms before `main` finishes.

4. 500ms for the `footer` element id:
  it will start 500ms before `section` finishes.
```

If you want all elements to have the same overlap time, declare it as a number:
```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setDuration(1000)
  .setOverlap(350) // all elements have the same overlap time.
  .prepare()
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
  .prepare()
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
  .prepare()
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
  .prepare()
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
  .prepare()
  .start();
```

#### Event Callback Data
When using the `on()` method, the callback function receives an event data object containing the following properties:

| Property          | Type                 | Description                                                        |
|--|--|--|
| `elements`        | `Set<MbPayload>`    | A set containing all elements managed by the current Movinblocks instance. |
| `currentElement`  | `MbPayload`         | The specific element affected by the current event.                |

```js
{
  elements: Set<MbPayload>, // All elements in the Movinblocks instance.
  currentElement: MbPayload // The element affected by this event.
}
```

This data lets you dynamically access and manipulate elements during the animation process.

### prepare
The `prepare()` method sets up all necessary configurations for the animation sequence, such as the timeline, elements, and duration. This step ensures that everything is ready before calling `start()`.
It's useful when you want to separate the initialization phase from execution.

```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('fadeIn')
  .setDuration(500)
  .prepare();
```

You can use `prepare()` to perform setup tasks early and then call start() at the desired moment:
```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .setAnimation('fadeIn')
  .setDuration(500)
  .prepare();

// Start the animation later
document.getElementById('myButton')?.addEventListener('click', () => mbInstance.start());
```

This separation makes your code more modular and easier to manage in interactive scenarios.

### start
The `start()` method initiates the animation sequence configured for Movinblocks.

You can call `start()` as the last method in the instance chain for a straightforward setup:

```typescript
new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer'])
  .prepare()
  .start();
```

Alternatively, you can detach it from the instance declaration and invoke it later in your code:
```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']);
  .setDuration(420);
  .prepare()

setTimeout(() => console.log('Just killing time'), 2000);
mbInstance.start();
```

Note: Make sure to have called `prepare()` before calling `start()`.

### destroy
The `destroy()` method destroys a Movinblocks instance (including events, classes, and other resources).

```typescript
const mbInstance = new Movinblocks()
  .setTimeline(['header', 'main', 'section', 'footer']);
  .prepare()
  .start();

setTimeout(() => mbInstance.destroy(), 2000) // Triggers the destroy after 2 seconds.
```

---

#### Like Movinblocks, but you want to animate texts instead? 
## [Try Movinwords!](https://github.com/revueltai/movinwords)
It's another lightweight plugin I created, designed for animating sentences, words, and letters in various creative ways. 

[Give it a go!](https://github.com/revueltai/movinwords)
