export default class Utils {
  static isNumber(input: unknown): boolean {
    return typeof input === 'number' && Number.isFinite(input)
  }

  static isString(input: unknown): input is string {
    return typeof input === 'string'
  }

  static isArray(arr: any[]): boolean {
    return Array.isArray(arr)
  }

  static isEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length === 0
  }

  static isEmptySet(set: Set<any>): boolean {
    return set.size === 0
  }

  static setCssVar(el: HTMLElement, varName: string, varValue: any) {
    el.style.setProperty(varName, String(varValue))
  }

  static removeCssVar(el: HTMLElement, varName: string) {
    el.style.removeProperty(varName)
  }
}
