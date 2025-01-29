export type MbAnimation = 'fadeIn' | 'slideInTop' | 'slideInBottom' | 'slideInLeft' | 'slideInRight' | 'revealInTop' | 'revealInBottom' | MbVendorAnimation | MbCustomAnimation

export type MbCustomAnimation = string & { __custom: true }

export type MbIterationCount = number | 'infinite'

export type MbTimingFunction = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | `cubic-bezier(${number}, ${number}, ${number}, ${number})`

export type MbEventName = 'prepare' | 'start' | 'end' | 'destroy' | 'intersect' | 'animationStart' | 'animationEnd' | 'animationIteration'

export type MbEventCallback = (data: {
  context: any
  elements: any
  [key: string]: any
}) => void

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
  iterationCount?: MbIterationCount | MbIterationCount[]
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
  iterationCount: MbIterationCount
  duration: number
  overlap?: number
}

declare class Movinblocks {
  private _started: boolean
  private _prepared: boolean
  private _payload: Set<MbPayload>
  private _animation: MbAnimation
  private _timingFunction: MbTimingFunction
  private _duration: number
  private _overlap: number
  private _options: MbOptions
  private _events: MbEvent
  private _cssBaseClass: string
  private _cssVarPrefix: string
  private _cssVendors: {
    'animate.css': {
      varPrefix: string
      cssClassPrefix: string
      defaultCssClasses: string[]
    }
  }

  private _isVendorAnimation(animation: MbAnimation | MbVendorAnimation): boolean
  private _validateTimeline(): boolean
  private _validateArrayProp(prop: string): boolean
  private _handleAnimationStart(item: MbPayload): void
  private _handleAnimationEnd(item: MbPayload): void
  private _handleAnimationIteration(item: MbPayload): void
  private _setCssVarPrefix(item: MbPayload): void
  private _setVendorCssClasses(
    el: HTMLElement,
    animation: MbVendorAnimation,
    action: 'add' | 'remove'
  ): void
  private _setPayload(): void
  private _setDuration(index: number): number
  private _setAnimation(index: number): MbAnimation | MbVendorAnimation
  private _setTimingFunction(index: number): MbTimingFunction
  private _setOverlap(index: number): number
  private _setTimeline(): void
  private _setVisibility(el: HTMLElement, action?: 'add' | 'remove'): void
  private _addObserver(el: HTMLElement): void
  private _emit(eventName: MbEventName, data?: any): this

  on(eventName: MbEventName, callback: MbEventCallback): this
  setDuration(duration: number | number[]): this
  setOverlap(overlap: number | number[]): this
  setViewportTrigger(intersectionOptions?: MbIntersectionOptions | null): this
  setAnimation(animation: MbAnimation | MbAnimation[]): this
  setTimingFunction(timingFunction: MbTimingFunction | MbTimingFunction[]): this
  setTimeline(timeline: string[]): this
  getElements(): Set<MbPayload>
  prepare(): this
  start(): this
  destroy(): void
}

export default Movinblocks
