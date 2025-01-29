import {
  MbAnimation,
  MbCustomAnimation,
  MbEvent,
  MbEventCallback,
  MbEventName,
  MbIntersectionOptions,
  MbIterationCount,
  MbOptions,
  MbPayload,
  MbTimingFunction,
  MbVendorAnimation,
  MbVendorSchema,
  MbVendorSchemaObj
} from './types'
import Utils from './utils'

class Movinblocks {
  private _started: boolean = false
  private _prepared: boolean = false
  private _payload: Set<MbPayload> = new Set()
  private _animation: MbAnimation = 'fadeIn'
  private _timingFunction: MbTimingFunction = 'ease-in-out'
  private _iterationCount: MbIterationCount = 1
  private _duration: number = 1000
  private _overlap: number = 0
  private _options: MbOptions = {}
  private _events: MbEvent = {} as MbEvent
  private _cssBaseClass = 'mb'
  private _cssRunningClass = '-running'
  private _cssVarPrefix = ''
  private _cssVendors = {
    'animate.css': {
      varPrefix: 'animate-',
      cssClassPrefix: 'animate__',
      defaultCssClasses: ['animate__animated', 'animate__delay-1s'],
    }
  }

  _isVendorAnimation(animation: MbAnimation | MbVendorAnimation): boolean {
    return Boolean(Utils.isObject(animation) && (animation as MbVendorAnimation).vendor)
  }

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

  _handleAnimationStart(item: MbPayload) {
    this._emit('animationStart', { currentElement: item })
  }

  _handleAnimationEnd(item: MbPayload) {
    this._emit('animationEnd', { currentElement: item })

    if (
      this._options.timeline &&
      this._options.timeline[this._options.timeline.length - 1] === item.id
    ) {
      this._emit('end')
    }
  }

  _handleAnimationIteration(item: MbPayload) {
    this._emit('animationIteration', { currentElement: item })
  }

  _setCssVarPrefix(item: MbPayload) {
    if (this._isVendorAnimation(item.animation)) {
      const vendorAnimation = item.animation as MbVendorAnimation
      this._cssVarPrefix = this._cssVendors[vendorAnimation.vendor].varPrefix
    } else {
      this._cssVarPrefix = `${this._cssBaseClass}-`
    }
  }

  _setVendorCssClasses(
    el: HTMLElement,
    animation: MbVendorAnimation,
    action: 'add' | 'remove'
  ) {
    const vendor: MbVendorSchemaObj = this._cssVendors[animation.vendor as keyof MbVendorSchema]

    if (action === 'add') {
      el.classList.add(...vendor.defaultCssClasses, `${vendor.cssClassPrefix}${animation.name}`)
      return
    }

    el.classList.remove(...vendor.defaultCssClasses, `${vendor.cssClassPrefix}${animation.name}`)
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
            iterationCount: this._setIterationCount(index),
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

  _setAnimation(index: number): MbAnimation | MbVendorAnimation {
    if (
      Utils.isString(this._options.animation) ||
      Utils.isObject(this._options.animation)
    ) {
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

  _setIterationCount(index: number): MbIterationCount {   
    if (Utils.isNumber(this._options.iterationCount)) {
      return this._options.iterationCount as number
    }

    if (this._options.iterationCount === 'infinite') {
      return this._options.iterationCount
    }

    if (Utils.isArray(this._options.iterationCount as MbIterationCount[])) {
      this._validateArrayProp('iterationCount')
      return (this._options.iterationCount as MbIterationCount[])[index]
    }

    return this._iterationCount
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
      this._setCssVarPrefix(item)

      Utils.setCssVar(item.el, `${this._cssVarPrefix}duration`, `${item.duration}ms`)
      Utils.setCssVar(item.el, `${this._cssVarPrefix}timing-function`, item.timingFunction)
      Utils.setCssVar(item.el, `${this._cssVarPrefix}iteration-count`, item.iterationCount)

      if (prevDuration) {
        currDelay += prevDuration - item.overlap!
      }

      if (this._options.viewportTrigger) {
        this._addObserver(item)
      } else {
        Utils.setCssVar(item.el, `${this._cssVarPrefix}delay`, `${currDelay}ms`)
        this._setVisibility(item.el)
      }

      item.el.addEventListener('animationstart', () => this._handleAnimationStart(item))
      item.el.addEventListener('animationend', () => this._handleAnimationEnd(item))
      item.el.addEventListener('animationiteration', () => this._handleAnimationIteration(item))

      prevDuration = item.duration
    }
  }

  _setVisibility(el: HTMLElement, action: 'add' | 'remove' = 'add') {
    const animation = Utils.findInSet(this._payload, el.id).animation

    if (this._isVendorAnimation(animation)) {
      this._setVendorCssClasses(el, animation, action)
      return
    }

    if (action === 'add') {
      el.classList.add(this._cssBaseClass, animation)
      return
    }

    el.classList.remove(this._cssBaseClass, animation)
  }

  _addObserver(item: MbPayload) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = this._options.timeline!.indexOf(entry.target.id)

        if (index !== -1) {
          const el = entry.target as HTMLElement

          if (entry.isIntersecting) {
            this._setVisibility(el)
            this._emit('intersect', { currentElement: item })
            observer.disconnect()
          }
        }
      })
    }, this._options.intersectionOptions!)

    observer.observe(item.el)
  }

  _emit(eventName: MbEventName, data: any = null) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((cb: MbEventCallback) => cb({
        context: this,
        elements: this._payload,
        ...data
      }))
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

  setViewportTrigger(intersectionOptions: MbIntersectionOptions | null = null) {
    this._options.viewportTrigger = true
    this._options.intersectionOptions = intersectionOptions || {
      root: null,
      threshold: 0,
      rootMargin: '0px'
    }

    return this
  }

  setAnimation(animation: MbAnimation | MbAnimation[] | MbCustomAnimation | MbCustomAnimation[] | MbVendorAnimation | MbVendorAnimation[]) {
    this._options.animation = animation
    return this
  }

  setTimingFunction(timingFunction: MbTimingFunction | MbTimingFunction[]) {
    this._options.timingFunction = timingFunction
    return this
  }

  setIterationCount(iterationCount: MbIterationCount | MbIterationCount[]) {
    this._options.iterationCount = iterationCount
    return this
  }

  setTimeline(timeline: string[]) {
    this._options.timeline = timeline
    return this
  }

  prepare() {
    if (!this._started && this._validateTimeline()) {
      this._setPayload()
      this._setTimeline()
      this._prepared = true
      this._emit('prepare')
    }

    return this
  }

  start() {
    if (!this._prepared) {
      throw new Error('Please call prepare() before start().')
    }

    if (!this._started) {
      if (this._validateTimeline()) {
        for (const item of this._payload) {
          item.el.classList.add(this._cssBaseClass + this._cssRunningClass)
        }

        this._started = true
        this._emit('start')
      }
    }

    return this
  }

  destroy() {
    for (const item of this._payload) {
      item.el.classList.remove(this._cssBaseClass)
      item.el.classList.remove(this._cssBaseClass + this._cssRunningClass)
      this._setVisibility(item.el, 'remove')
      this._setCssVarPrefix(item)

      Utils.removeCssVar(item.el, `${this._cssVarPrefix}duration`)
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}delay`)
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}timing-function`)
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}iteration-count`)

      item.el.removeEventListener('animationstart', () => this._handleAnimationStart(item))
      item.el.removeEventListener('animationend', () => this._handleAnimationEnd(item))
      item.el.removeEventListener('animationiteration', () => this._handleAnimationIteration(item))
    }

    this._started = false
    this._payload = new Set()
    this._animation = 'fadeIn'
    this._timingFunction = 'ease-in-out'
    this._duration = 1000
    this._overlap = 0
    this._options = {}
    this._cssBaseClass = 'mb'
    this._cssVarPrefix = ''

    this._emit('destroy')
    this._events = {}
  }
}

if (typeof window !== 'undefined') {
  (window as any).Movinblocks = Movinblocks
}

export default Movinblocks
