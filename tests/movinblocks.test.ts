/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Movinblocks from '../src/movinblocks'
import { MbAnimation, MbCustomAnimation, MbIterationCount, MbTimingFunction, MbVendorAnimation } from '../src/types'

describe('Movinblocks', () => {
  let movinblocks: Movinblocks

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="el1">Element id 1</div>
      <div id="el2">Element id 2</div>
      <div id="el3">Element id 3</div>
    `

    movinblocks = new Movinblocks()
      .setTimeline(['el1', 'el2'])
  })

  afterEach(() => {
    movinblocks.destroy()
  })

  describe('Preparation, Start, Destroy', () => {
    it('should start a Movinblocks instance when start() is called.', () => {
      movinblocks
        .prepare()
        .start()

      expect(movinblocks['_started']).toBe(true)
    })

    it('should throw an error if start() is called before prepare()', () => {
      expect(() => movinblocks.start()).toThrow()
    })

    it('should emit "prepare" event when prepare() is called', () => {
      const prepareSpy = vi.fn()
      movinblocks
        .on('prepare', prepareSpy)
        .prepare()

      expect(prepareSpy).toHaveBeenCalled()
    })

    it('should emit "start" event when start() is called', () => {
      const startSpy = vi.fn()
      movinblocks.setTimeline(['el1', 'el2'])
        .on('start', startSpy)
        .prepare()
        .start()

      expect(startSpy).toHaveBeenCalled()
    })

    it('should reset properties when destroy() is called', () => {
      movinblocks.setTimeline(['el1', 'el2'])
        .prepare()
        .start()
        .destroy()

      expect(movinblocks['_started']).toBe(false)
      expect(movinblocks['_payload'].size).toBe(0)
      expect(movinblocks['_options']).toEqual({})
    })
  })

  describe('Timeline', () => {
    it('should set the timeline if an array of html element ids is provided.', () => {
      const timeline = ['el1', 'el2']

      movinblocks
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].timeline).toEqual(timeline)
      expect(el1?.classList.contains('mb')).toBe(true)
      expect(el2?.classList.contains('mb')).toBe(true)
    })

    it('should throw if no timeline is present.', () => {
      movinblocks = new Movinblocks()
      expect(() => movinblocks.prepare()).toThrow()
    })

    it('should throw if a wrong id is provided and the element does not exist.', () => {
      movinblocks = new Movinblocks().setTimeline(['el1', 'nonExistentId'])
      expect(() => movinblocks.prepare()).toThrow()
    })
  })

  describe('Animations', () => {
    it('should set the animation for all timeline elements if a valid animation name string is provided.', () => {
      const animation = 'fadeIn'
      movinblocks
        .setAnimation(animation)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].animation).toBe(animation)
      expect(el1?.classList.contains('fadeIn')).toBe(true)
      expect(el2?.classList.contains('fadeIn')).toBe(true)
    })

    it('should set the animation for each timeline element if an array of valid animation names is provided.', () => {
      const animations: MbAnimation[] = ['fadeIn', 'slideInTop']
      movinblocks.setAnimation(animations)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].animation).toEqual(animations)
      expect(el1?.classList.contains('fadeIn')).toBe(true)
      expect(el2?.classList.contains('slideInTop')).toBe(true)
    })

    it('should throw if the animation array length does not match the timeline length.', () => {
      const animations: MbAnimation[] = ['fadeIn', 'slideInTop', 'slideInBottom']
      movinblocks.setAnimation(animations)

      expect(() => movinblocks.prepare()).toThrow()
    })

    describe('Vendor Animations', () => {
      it('should set a vendor animation (animate.css) for all timeline elements if a vendor animation object is provided.', () => {
        const vendorAnimation: MbVendorAnimation = {
          name: 'bounceIn',
          vendor: 'animate.css'
        }

        movinblocks
          .setAnimation(vendorAnimation)
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')

        expect(movinblocks['_options'].animation).toEqual(vendorAnimation)
        expect(el1?.classList.contains('animate__bounceIn')).toBe(true)
        expect(el1?.classList.contains('animate__animated')).toBe(true)
        expect(el2?.classList.contains('animate__bounceIn')).toBe(true)
        expect(el2?.classList.contains('animate__animated')).toBe(true)
      })

      it('should set different vendor animations (animate.css) for each timeline element if an array of vendor animation objects is provided.', () => {
        const vendorAnimations: MbVendorAnimation[] = [
          { name: 'bounceIn', vendor: 'animate.css' },
          { name: 'fadeIn', vendor: 'animate.css' }
        ]

        movinblocks
          .setAnimation(vendorAnimations)
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')

        expect(movinblocks['_options'].animation).toEqual(vendorAnimations)
        expect(el1?.classList.contains('animate__bounceIn')).toBe(true)
        expect(el1?.classList.contains('animate__animated')).toBe(true)
        expect(el2?.classList.contains('animate__fadeIn')).toBe(true)
        expect(el2?.classList.contains('animate__animated')).toBe(true)
      })

      it('should support mixing built-in and vendor animations.', () => {
        const mixedAnimations: MbAnimation[] = [
          'fadeIn',
          { name: 'bounceIn', vendor: 'animate.css' }
        ]

        movinblocks
          .setAnimation(mixedAnimations)
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')

        expect(movinblocks['_options'].animation).toEqual(mixedAnimations)
        expect(el1?.classList.contains('fadeIn')).toBe(true)
        expect(el2?.classList.contains('animate__bounceIn')).toBe(true)
        expect(el2?.classList.contains('animate__animated')).toBe(true)
      })
    })

    describe('Custom Animations', () => {
      it('should set custom animation for all timeline elements if a custom animation string is provided', () => {
        const customAnimation = 'myCustomAnimation'

        movinblocks
          .setAnimation(customAnimation as MbCustomAnimation)
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')

        expect(movinblocks['_options'].animation).toBe(customAnimation)
        expect(el1?.classList.contains(customAnimation)).toBe(true)
        expect(el2?.classList.contains(customAnimation)).toBe(true)
      })

      it('should set different custom animations for each timeline element if an array of custom animation strings is provided', () => {
        const customAnimations = ['myCustomAnimation1', 'myCustomAnimation2']

        movinblocks
          .setAnimation(customAnimations as MbCustomAnimation[])
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')

        expect(movinblocks['_options'].animation).toEqual(customAnimations)
        expect(el1?.classList.contains(customAnimations[0])).toBe(true)
        expect(el2?.classList.contains(customAnimations[1])).toBe(true)
      })

      it('should support mixing built-in, vendor and custom animations', () => {
        const mixedAnimations = [
          'fadeIn',
          { name: 'bounceIn', vendor: 'animate.css' },
          'myCustomAnimation'
        ]

        movinblocks
          .setTimeline(['el1', 'el2', 'el3'])
          .setAnimation(mixedAnimations as MbAnimation[])
          .prepare()
          .start()

        const el1 = document.getElementById('el1')
        const el2 = document.getElementById('el2')
        const el3 = document.getElementById('el3')

        expect(movinblocks['_options'].animation).toEqual(mixedAnimations)
        expect(el1?.classList.contains('fadeIn')).toBe(true)
        expect(el2?.classList.contains('animate__bounceIn')).toBe(true)
        expect(el2?.classList.contains('animate__animated')).toBe(true)
        expect(el3?.classList.contains('myCustomAnimation')).toBe(true)
      })
    })
  })

  describe('Timing', () => {
    it('should set the timingFunction for all timeline elements if a timingFunction string is provided.', () => {
      const timingFunction = 'ease-in'

      movinblocks
        .setTimingFunction(timingFunction)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].timingFunction).toBe(timingFunction)
      expect(el1?.style.getPropertyValue('--mb-timing-function')).toBe(timingFunction)
      expect(el2?.style.getPropertyValue('--mb-timing-function')).toBe(timingFunction)
    })

    it('should set the timingFunction for each timeline element if an array of valid timingFunction names is provided.', () => {
      const timingFunctions: MbTimingFunction[] = ['ease-in', 'linear']
      movinblocks.setTimingFunction(timingFunctions)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].timingFunction).toEqual(timingFunctions)
      expect(el1?.style.getPropertyValue('--mb-timing-function')).toBe(timingFunctions[0])
      expect(el2?.style.getPropertyValue('--mb-timing-function')).toBe(timingFunctions[1])
    })

    it('should throw if the timingFunction array length does not match the timeline length.', () => {
      movinblocks.setTimingFunction(['linear'])
      expect(() => movinblocks.prepare()).toThrow()
    })
  })

  describe('Iteration Count', () => {
    it('should set the iterationCount for all timeline elements if a iterationCount value is provided.', () => {
      const iterationCount = 'infinite'

      movinblocks
        .setIterationCount(iterationCount)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].iterationCount).toBe(iterationCount)
      expect(el1?.style.getPropertyValue('--mb-iteration-count')).toBe(iterationCount)
      expect(el2?.style.getPropertyValue('--mb-iteration-count')).toBe(iterationCount)
    })

    it('should set the iterationCount for each timeline element if an array of valid iterationCount values is provided.', () => {
      const iterationCounts: MbIterationCount[] = [2, 'infinite']
      movinblocks.setIterationCount(iterationCounts)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].iterationCount).toEqual(iterationCounts)
      expect(el1?.style.getPropertyValue('--mb-iteration-count')).toBe(String(iterationCounts[0]))
      expect(el2?.style.getPropertyValue('--mb-iteration-count')).toBe(iterationCounts[1])
    })

    it('should throw if the iterationCount array length does not match the timeline length.', () => {
      movinblocks.setIterationCount(['infinite'])
      expect(() => movinblocks.prepare()).toThrow()
    })
  })

  describe('Duration', () => {
    it('should set the duration for all timeline elements if a duration in milliseconds is provided.', () => {
      const duration = 500

      movinblocks
        .setDuration(duration)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].duration).toBe(duration)
      expect(el1?.style.getPropertyValue('--mb-duration')).toBe(`${duration}ms`)
      expect(el2?.style.getPropertyValue('--mb-duration')).toBe(`${duration}ms`)
    })

    it('should set the duration for each timeline element if an array of valid duration names is provided.', () => {
      const animations: MbAnimation[] = ['fadeIn', 'slideInTop']
      movinblocks.setAnimation(animations)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].animation).toEqual(animations)
      expect(el1?.classList.contains('fadeIn')).toBe(true)
      expect(el2?.classList.contains('slideInTop')).toBe(true)
    })

    it('should throw if the duration array length does not match the timeline length.', () => {
      movinblocks.setDuration([300, 400, 500, 600])
      expect(() => movinblocks.prepare()).toThrow()
    })
  })

  describe('Overlap', () => {
    it('should set the overlap for all timeline elements, except the first one, if a number is provided.', () => {
      const duration = 1000
      const overlap = 100

      movinblocks
        .setDuration(duration)
        .setOverlap(overlap)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')

      expect(movinblocks['_options'].overlap).toBe(overlap)
      expect(el1?.style.getPropertyValue('--mb-delay')).toBe(`0ms`)
      expect(el2?.style.getPropertyValue('--mb-delay')).toBe(`${duration - overlap}ms`)
    })

    it('should set the overlap for each timeline element if an array of valid time values in milliseconds is provided.', () => {
      const overlaps = [100, 200]
      const duration = 1000

      movinblocks
        .setDuration(duration)
        .setTimeline(['el1', 'el2', 'el3'])
        .setOverlap(overlaps)
        .prepare()
        .start()

      const el1 = document.getElementById('el1')
      const el2 = document.getElementById('el2')
      const el3 = document.getElementById('el3')

      expect(movinblocks['_options'].overlap).toEqual(overlaps)
      expect(el1?.style.getPropertyValue('--mb-delay')).toBe(`0ms`)
      expect(el2?.style.getPropertyValue('--mb-delay')).toBe(`${duration - overlaps[0]}ms`)
      expect(el3?.style.getPropertyValue('--mb-delay')).toBe(`${duration - overlaps[0] + duration - overlaps[1]}ms`)
    })

    it('should throw if the overlap array length is not -1 from the timeline length.', () => {
      const overlaps = [100, 200]
      const duration = 1000

      movinblocks
        .setTimeline(['el1', 'el2'])
        .setDuration(duration)
        .setOverlap(overlaps)

      expect(() => movinblocks.prepare()).toThrow()
    })
  })

  describe('Viewport Trigger', () => {
    it('should add an IntersectionObserver when setViewportTrigger() is called', () => {
      const observeMock = vi.fn()
      const intersectionObserverMock = vi.fn(() => ({
        observe: observeMock,
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        root: null,
        rootMargin: '0px',
        thresholds: [0],
        takeRecords: () => []
      })) as unknown as typeof IntersectionObserver

      window.IntersectionObserver = intersectionObserverMock

      movinblocks
        .setViewportTrigger()
        .prepare()
        .start()

      expect(intersectionObserverMock).toHaveBeenCalled()
      expect(observeMock).toHaveBeenCalled()
    })

    it('should use custom IntersectionObserver options when provided.', () => {
      const observeMock = vi.fn()
      const intersectionObserverMock = vi.fn(() => ({
        observe: observeMock,
        unobserve: vi.fn(),
        disconnect: vi.fn()
      })) as unknown as typeof IntersectionObserver

      window.IntersectionObserver = intersectionObserverMock

      const options = {
        root: null,
        threshold: 0.5,
        rootMargin: '10px'
      }

      movinblocks
        .setViewportTrigger(options)
        .prepare()
        .start()

      expect(intersectionObserverMock).toHaveBeenCalledWith(expect.any(Function), options)
      expect(observeMock).toHaveBeenCalled()
    })

    it('should emit the "intersect" event when element comes into view.', () => {
      const observeMock = vi.fn()
      const intersectionObserverMock = vi.fn(() => ({
        observe: observeMock,
        unobserve: vi.fn(),
        disconnect: vi.fn()
      })) as unknown as typeof IntersectionObserver

      window.IntersectionObserver = intersectionObserverMock

      const intersectSpy = vi.fn()

      movinblocks
        .setViewportTrigger()
        .on('intersect', intersectSpy)
        .prepare()
        .start()

      const [callback] = vi.mocked(window.IntersectionObserver).mock.calls[0]

      callback([{
        isIntersecting: true,
        target: document.getElementById('el1')!,
        intersectionRatio: 0,
        intersectionRect: new DOMRectReadOnly(0, 0, 0, 0),
        rootBounds: null,
        time: 0,
        boundingClientRect: new DOMRectReadOnly(0, 0, 0, 0)
      }])

      expect(intersectSpy).toHaveBeenCalled()
    })
  })
})
