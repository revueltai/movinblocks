export type MbAnimation = 'fadeIn' | 'slideInTop' | 'slideInBottom' | 'slideInLeft' | 'slideInRight' | 'revealInTop' | 'revealInBottom' | string & { __custom: true }

export type MbTimingFunction = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | `cubic-bezier(${number}, ${number}, ${number}, ${number})`

export type MbEventName = 'start' | 'end' | 'destroy' | 'intersect' | 'animationStart' | 'animationEnd' | 'animationIteration'

export type MbEventCallback = (data: any) => void

export type MbEvent = {
  [key in MbEventName]?: MbEventCallback[]
}

export type MbVendor = 'animate.css'

export type MbVendorAnimation = {
  name: string
  vendor: MbVendor
}

export type MbVendorSchemaObj = {
  defaultCssClasses: string[]
  varPrefix: string
  cssClassPrefix: string
}

export interface MbVendorSchema {
  [key in MbVendor]: MbVendorSchemaObj
}

export interface MbIntersectionOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number
}

export interface MbOptions {
  timeline?: string[]
  animation?: MbAnimation | MbAnimation[] | MbVendorAnimation | MbVendorAnimation[]
  timingFunction?: MbTimingFunction | MbTimingFunction[]
  duration?: number | number[]
  overlap?: number | number[]
  viewportTrigger?: boolean
  intersectionOptions?: MbIntersectionOptions | null
}

export interface MbPayload {
  el: HTMLElement
  id: string
  animation: MbAnimation | MbVendorAnimation
  timingFunction: MbTimingFunction
  duration: number
  overlap?: number
}

declare class Movinblocks {
  private _started: boolean
  private _payload: Set<MbPayload>
  private _animation: MbAnimation
  private _timingFunction: MbTimingFunction
  private _duration: number
  private _overlap: number
  private _options: MbOptions
  private _events: MbEvent
  private _cssPrefix: string

  constructor() {
    this._started = false
    this._payload = new Set()
    this._animation = 'fadeIn'
    this._timingFunction = 'ease-in-out'
    this._duration = 1000
    this._overlap = 0
    this._options = {}
    this._events = {} as MbEvent
    this._cssPrefix = '--mb-'
  }

  private _validateTimeline(): boolean
  private _handleAnimationStart(): void
  private _handleAnimationEnd(id: string): void
  private _handleAnimationIteration(): void
  private _setPayload(): void
  private _setDuration(index: number): number
  private _setAnimation(index: number): MbAnimation
  private _setTimingFunction(index: number): MbTimingFunction
  private _setOverlap(index: number): number
  private _setTimeline(): void
  private _triggerStart(): void
  private _emit(eventName: MbEventName): this

  on(eventName: MbEventName, callback: MbEventCallback): this
  setDuration(duration: number | number[]): this
  setOverlap(overlap: number | number[]): this
  setAnimation(animation: MbAnimation | MbAnimation[]): this
  setTimingFunction(timingFunction: MbTimingFunction | MbTimingFunction[]): this
  setTimeline(timeline: string[]): this
  getElements(): Set<MbPayload>
  start(): this
  destroy(): void
}

export default Movinblocks
