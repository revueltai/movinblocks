import Utils from './utils'
import {
  MbAnimation,
  MbTimingFunction,
  MbEvent,
  MbEventName,
  MbOptions,
  MbPayload,
  MbEventCallback
} from './types'

class Movinblocks {
  private _started: boolean = false
  private _payload: Set<MbPayload> = new Set()
  private _animation: MbAnimation = 'fadeIn'
  private _timingFunction: MbTimingFunction = 'ease-in-out'
  private _duration: number = 1000
  private _overlap: number = 0
  private _options: MbOptions = {}
  private _events: MbEvent = {} as MbEvent
  private _cssPrefix = '--mb-'

  _validateTimeline() {
    if (!this._options.timeline) {
      throw new Error(`No timeline provided.`)
    }

    for (const id of this._options.timeline) {
      const el = document.getElementById(id)

      if (!el) {
        throw new Error(`Element id "${id}" does not exist.`)
      }
    }

    return true
  }

  _validateArrayProp(prop: string): boolean {
    const mbOption = this._options[prop as keyof MbOptions]
    const mbOptionLength = (mbOption as MbOptions[]).length
    const timelineLength = this._options.timeline!.length

    if (prop === 'overlap') {
      if (mbOptionLength !== timelineLength - 1) {
        throw new Error(`The "${prop}" array must be one element shorter than the timeline. ${timelineLength - 1} elements expected, got ${mbOptionLength} instead.`)
      }

      return true
    }

    if (mbOptionLength !== timelineLength) {
      throw new Error(`The "${prop}" array must be the same length as timeline. ${timelineLength} elements expected, got ${mbOptionLength} instead.`)
    }

    return true
  }

  _handleAnimationStart() {
    this._emit('animationStart')
  }

  _handleAnimationEnd(id: string) {
    this._emit('animationEnd')

    if (
      this._options.timeline &&
      this._options.timeline[this._options.timeline.length - 1] === id
    ) {
      this._emit('end')
    }
  }

  _handleAnimationIteration() {
    this._emit('animationIteration')
  }

  _setPayload() {
    if (this._options.timeline) {
      let index: number = 0
      for (const id of this._options.timeline) {
        const el = document.getElementById(id)

        if (el) {
          this._payload.add({
            el,
            id,
            duration: this._setDuration(index),
            animation: this._setAnimation(index),
            timingFunction: this._setTimingFunction(index),
            overlap: this._setOverlap(index),
          })
        }

        index++
      }
    }
  }

  _setDuration(index: number): number {
    if (Utils.isNumber(this._options.duration)) {
      return this._options.duration as number
    }

    if (Utils.isArray(this._options.duration as number[])) {
      this._validateArrayProp('duration')
      return (this._options.duration as number[])[index]
    }

    return this._duration
  }

  _setAnimation(index: number): MbAnimation {
    if (Utils.isString(this._options.animation)) {
      return this._options.animation
    }

    if (Utils.isArray(this._options.animation as MbAnimation[])) {
      this._validateArrayProp('animation')
      return (this._options.animation as MbAnimation[])[index]
    }

    return this._animation
  }

  _setTimingFunction(index: number): MbTimingFunction {
    if (Utils.isString(this._options.timingFunction)) {
      return this._options.timingFunction
    }

    if (Utils.isArray(this._options.timingFunction as MbTimingFunction[])) {
      this._validateArrayProp('timingFunction')
      return (this._options.timingFunction as MbTimingFunction[])[index]
    }

    return this._timingFunction
  }

  _setOverlap(index: number): number {
    if (index > 0) {
      if (Utils.isNumber(this._options.overlap)) {
        return this._options.overlap as number
      }

      if (Utils.isArray(this._options.overlap as number[])) {
        this._validateArrayProp('overlap')
        return (this._options.overlap as number[])[index - 1]
      }
    }

    return this._overlap
  }

  _setTimeline() {
    let currDelay = 0
    let prevDuration = 0

    for (const item of this._payload) {
      item.el.classList.add('mb')
      item.el.classList.add(item.animation)

      if (prevDuration && item.overlap) {
        currDelay += (prevDuration - item.overlap)
      }

      Utils.setCssVar(item.el, `${this._cssPrefix}duration`, `${item.duration}ms`)
      Utils.setCssVar(item.el, `${this._cssPrefix}delay`, `${currDelay}ms`)
      Utils.setCssVar(item.el, `${this._cssPrefix}timing-function`, item.timingFunction)

      item.el.addEventListener('animationstart', () => this._handleAnimationStart())
      item.el.addEventListener('animationend', () => this._handleAnimationEnd(item.id))
      item.el.addEventListener('animationiteration', () => this._handleAnimationIteration())

      prevDuration = item.duration
    }
  }

  _triggerStart() {
    if (this._validateTimeline()) {
      this._setPayload()
      this._setTimeline()
      this._started = true
      this._emit('start')
    }
  }

  _emit(eventName: MbEventName) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((cb: MbEventCallback) => cb(this._payload))
    }

    return this
  }

  // Public Methods
  on(eventName: MbEventName, callback: MbEventCallback) {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }

    this._events[eventName].push(callback)
    return this
  }

  setDuration(duration: number | number[]) {
    this._options.duration = duration
    return this
  }

  setOverlap(overlap: number | number[]) {
    this._options.overlap = overlap
    return this
  }

  setAnimation(animation: MbAnimation | MbAnimation[]) {
    this._options.animation = animation
    return this
  }

  setTimingFunction(timingFunction: MbTimingFunction | MbTimingFunction[]) {
    this._options.timingFunction = timingFunction
    return this
  }

  setTimeline(timeline: string[]) {
    this._options.timeline = timeline
    return this
  }

  getElements() {
    return this._payload
  }

  start() {
    if (!this._started) {
      this._triggerStart()
    }

    return this
  }

  destroy() {
    for (const item of this._payload) {
      item.el.classList.remove('mb')
      item.el.classList.remove(item.animation)

      Utils.removeCssVar(item.el, `${this._cssPrefix}duration`)
      Utils.removeCssVar(item.el, `${this._cssPrefix}delay`)
      Utils.removeCssVar(item.el, `${this._cssPrefix}timing-function`)

      item.el.removeEventListener('animationstart', () => this._handleAnimationStart())
      item.el.removeEventListener('animationend', () => this._handleAnimationEnd(item.id))
      item.el.removeEventListener('animationiteration', () => this._handleAnimationIteration())
    }

    this._started = false
    this._payload = new Set()
    this._animation = 'fadeIn'
    this._timingFunction = 'ease-in-out'
    this._duration = 1000
    this._overlap = 0
    this._options = {}
    this._events = {}

    this._emit('destroy')
  }
}

if (typeof window !== 'undefined') {
  (window as any).Movinblocks = Movinblocks
}

export default Movinblocks
