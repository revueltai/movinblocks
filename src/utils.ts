export default class Utils {
  static isNumber(input: unknown): boolean {
    return typeof input === 'number' && Number.isFinite(input)
  }

  static isString(input: unknown): input is string {
    return typeof input === 'string'
  }

  static isObject(input: unknown): input is Record<string, unknown> {
    return typeof input === 'object' && input !== null &&
      Object.getPrototypeOf(input) === Object.prototype
  }

  static isArray(arr: any[]): boolean {
    return Array.isArray(arr)
  }

  static isEmptyObject(input: unknown): boolean {
    return this.isObject(input) && Object.keys(input).length === 0
  }

  static isEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length === 0
  }

  static isEmptySet(set: Set<any>): boolean {
    return set.size === 0
  }

  static findInSet(set: Set<any>, id: string): any {
    for (const item of set) {
      if (item.id === id) return item
    }

    return null
  }

  static setCssVar(el: HTMLElement, varName: string, varValue: any) {
    el.style.setProperty(`--${varName}`, String(varValue))
  }

  static removeCssVar(el: HTMLElement, varName: string) {
    el.style.removeProperty(`--${varName}`)
  }
}
