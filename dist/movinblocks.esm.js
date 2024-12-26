var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class Utils {
  static isNumber(input) {
    return typeof input === "number" && Number.isFinite(input);
  }
  static isString(input) {
    return typeof input === "string";
  }
  static isArray(arr) {
    return Array.isArray(arr);
  }
  static isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
  }
  static isEmptySet(set) {
    return set.size === 0;
  }
  static setCssVar(el, varName, varValue) {
    el.style.setProperty(varName, String(varValue));
  }
  static removeCssVar(el, varName) {
    el.style.removeProperty(varName);
  }
}
class Movinblocks {
  constructor() {
    __publicField(this, "_started", false);
    __publicField(this, "_payload", /* @__PURE__ */ new Set());
    __publicField(this, "_animation", "fadeIn");
    __publicField(this, "_timingFunction", "ease-in-out");
    __publicField(this, "_duration", 1e3);
    __publicField(this, "_overlap", 0);
    __publicField(this, "_options", {});
    __publicField(this, "_events", {});
    __publicField(this, "_cssPrefix", "--mb-");
  }
  _validateTimeline() {
    if (!this._options.timeline) {
      throw new Error(`No timeline provided.`);
    }
    for (const id of this._options.timeline) {
      const el = document.getElementById(id);
      if (!el) {
        throw new Error(`Element id "${id}" does not exist.`);
      }
    }
    return true;
  }
  _handleAnimationStart() {
    this._emit("animationStart");
  }
  _handleAnimationEnd(id) {
    this._emit("animationEnd");
    if (this._options.timeline && this._options.timeline[this._options.timeline.length - 1] === id) {
      this._emit("end");
    }
  }
  _handleAnimationIteration() {
    this._emit("animationIteration");
  }
  _setPayload() {
    if (this._options.timeline) {
      let index = 0;
      for (const id of this._options.timeline) {
        const el = document.getElementById(id);
        if (el) {
          this._payload.add({
            el,
            id,
            duration: this._setDuration(index),
            animation: this._setAnimation(index),
            timingFunction: this._setTimingFunction(index),
            overlap: this._setOverlap(index)
          });
        }
        index++;
      }
    }
  }
  _setDuration(index) {
    if (Utils.isNumber(this._options.duration)) {
      return this._options.duration;
    }
    if (Utils.isArray(this._options.duration)) {
      return this._options.duration[index];
    }
    return this._duration;
  }
  _setAnimation(index) {
    if (Utils.isString(this._options.animation)) {
      return this._options.animation;
    }
    if (Utils.isArray(this._options.animation)) {
      return this._options.animation[index];
    }
    return this._animation;
  }
  _setTimingFunction(index) {
    if (Utils.isString(this._options.timingFunction)) {
      return this._options.timingFunction;
    }
    if (Utils.isArray(this._options.timingFunction)) {
      return this._options.timingFunction[index];
    }
    return this._timingFunction;
  }
  _setOverlap(index) {
    if (index > 0) {
      if (Utils.isNumber(this._options.overlap)) {
        return this._options.overlap;
      }
      if (Utils.isArray(this._options.overlap)) {
        return this._options.overlap[index - 1];
      }
    }
    return this._overlap;
  }
  _setTimeline() {
    let currDelay = 0;
    let prevDuration = 0;
    for (const item of this._payload) {
      item.el.classList.add("mb");
      item.el.classList.add(item.animation);
      if (prevDuration && item.overlap) {
        currDelay += prevDuration - item.overlap;
      }
      Utils.setCssVar(item.el, `${this._cssPrefix}duration`, `${item.duration}ms`);
      Utils.setCssVar(item.el, `${this._cssPrefix}delay`, `${currDelay}ms`);
      Utils.setCssVar(item.el, `${this._cssPrefix}timing-function`, item.timingFunction);
      item.el.addEventListener("animationstart", () => this._handleAnimationStart());
      item.el.addEventListener("animationend", () => this._handleAnimationEnd(item.id));
      item.el.addEventListener("animationiteration", () => this._handleAnimationIteration());
      prevDuration = item.duration;
    }
  }
  _triggerStart() {
    if (this._validateTimeline()) {
      this._setPayload();
      this._setTimeline();
      this._started = true;
      this._emit("start");
    }
  }
  _emit(eventName) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((cb) => cb(this._payload));
    }
    return this;
  }
  // Public Methods
  on(eventName, callback) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
    return this;
  }
  setDuration(duration) {
    this._options.duration = duration;
    return this;
  }
  setOverlap(overlap) {
    this._options.overlap = overlap;
    return this;
  }
  setAnimation(animation) {
    this._options.animation = animation;
    return this;
  }
  setTimingFunction(timingFunction) {
    this._options.timingFunction = timingFunction;
    return this;
  }
  setTimeline(timeline) {
    this._options.timeline = timeline;
    return this;
  }
  getElements() {
    return this._payload;
  }
  start() {
    if (!this._started) {
      this._triggerStart();
    }
    return this;
  }
  destroy() {
    for (const item of this._payload) {
      item.el.classList.remove("mb");
      item.el.classList.remove(item.animation);
      Utils.removeCssVar(item.el, `${this._cssPrefix}duration`);
      Utils.removeCssVar(item.el, `${this._cssPrefix}delay`);
      Utils.removeCssVar(item.el, `${this._cssPrefix}timing-function`);
      item.el.removeEventListener("animationstart", () => this._handleAnimationStart());
      item.el.removeEventListener("animationend", () => this._handleAnimationEnd(item.id));
      item.el.removeEventListener("animationiteration", () => this._handleAnimationIteration());
    }
    this._started = false;
    this._payload = /* @__PURE__ */ new Set();
    this._animation = "fadeIn";
    this._timingFunction = "ease-in-out";
    this._duration = 1e3;
    this._overlap = 0;
    this._options = {};
    this._events = {};
    this._emit("destroy");
  }
}
if (typeof window !== "undefined") {
  window.Movinblocks = Movinblocks;
}
export {
  Movinblocks as default
};
