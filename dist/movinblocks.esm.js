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
  static isObject(input) {
    return typeof input === "object" && input !== null && Object.getPrototypeOf(input) === Object.prototype;
  }
  static isArray(arr) {
    return Array.isArray(arr);
  }
  static isEmptyObject(input) {
    return this.isObject(input) && Object.keys(input).length === 0;
  }
  static isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
  }
  static isEmptySet(set) {
    return set.size === 0;
  }
  static findInSet(set, id) {
    for (const item of set) {
      if (item.id === id) return item;
    }
    return null;
  }
  static setCssVar(el, varName, varValue) {
    el.style.setProperty(`--${varName}`, String(varValue));
  }
  static removeCssVar(el, varName) {
    el.style.removeProperty(`--${varName}`);
  }
}
class Movinblocks {
  constructor() {
    __publicField(this, "_started", false);
    __publicField(this, "_prepared", false);
    __publicField(this, "_payload", /* @__PURE__ */ new Set());
    __publicField(this, "_animation", "fadeIn");
    __publicField(this, "_timingFunction", "ease-in-out");
    __publicField(this, "_iterationCount", 1);
    __publicField(this, "_duration", 1e3);
    __publicField(this, "_overlap", 0);
    __publicField(this, "_options", {});
    __publicField(this, "_events", {});
    __publicField(this, "_cssBaseClass", "mb");
    __publicField(this, "_cssRunningClass", "-running");
    __publicField(this, "_cssVarPrefix", "");
    __publicField(this, "_cssVendors", {
      "animate.css": {
        varPrefix: "animate-",
        cssClassPrefix: "animate__",
        defaultCssClasses: ["animate__animated", "animate__delay-1s"]
      }
    });
  }
  _isVendorAnimation(animation) {
    return Boolean(Utils.isObject(animation) && animation.vendor);
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
  _validateArrayProp(prop) {
    const mbOption = this._options[prop];
    const mbOptionLength = mbOption.length;
    const timelineLength = this._options.timeline.length;
    if (prop === "overlap") {
      if (mbOptionLength !== timelineLength - 1) {
        throw new Error(`The "${prop}" array must be one element shorter than the timeline. ${timelineLength - 1} elements expected, got ${mbOptionLength} instead.`);
      }
      return true;
    }
    if (mbOptionLength !== timelineLength) {
      throw new Error(`The "${prop}" array must be the same length as timeline. ${timelineLength} elements expected, got ${mbOptionLength} instead.`);
    }
    return true;
  }
  _handleAnimationStart(item) {
    this._emit("animationStart", { currentElement: item });
  }
  _handleAnimationEnd(item) {
    this._emit("animationEnd", { currentElement: item });
    if (this._options.timeline && this._options.timeline[this._options.timeline.length - 1] === item.id) {
      this._emit("end");
    }
  }
  _handleAnimationIteration(item) {
    this._emit("animationIteration", { currentElement: item });
  }
  _setCssVarPrefix(item) {
    if (this._isVendorAnimation(item.animation)) {
      const vendorAnimation = item.animation;
      this._cssVarPrefix = this._cssVendors[vendorAnimation.vendor].varPrefix;
    } else {
      this._cssVarPrefix = `${this._cssBaseClass}-`;
    }
  }
  _setVendorCssClasses(el, animation, action) {
    const vendor = this._cssVendors[animation.vendor];
    if (action === "add") {
      el.classList.add(...vendor.defaultCssClasses, `${vendor.cssClassPrefix}${animation.name}`);
      return;
    }
    el.classList.remove(...vendor.defaultCssClasses, `${vendor.cssClassPrefix}${animation.name}`);
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
            iterationCount: this._setIterationCount(index),
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
      this._validateArrayProp("duration");
      return this._options.duration[index];
    }
    return this._duration;
  }
  _setAnimation(index) {
    if (Utils.isString(this._options.animation) || Utils.isObject(this._options.animation)) {
      return this._options.animation;
    }
    if (Utils.isArray(this._options.animation)) {
      this._validateArrayProp("animation");
      return this._options.animation[index];
    }
    return this._animation;
  }
  _setTimingFunction(index) {
    if (Utils.isString(this._options.timingFunction)) {
      return this._options.timingFunction;
    }
    if (Utils.isArray(this._options.timingFunction)) {
      this._validateArrayProp("timingFunction");
      return this._options.timingFunction[index];
    }
    return this._timingFunction;
  }
  _setIterationCount(index) {
    if (Utils.isNumber(this._options.iterationCount)) {
      return this._options.iterationCount;
    }
    if (Utils.isArray(this._options.iterationCount)) {
      this._validateArrayProp("iterationCount");
      return this._options.iterationCount[index];
    }
    return this._iterationCount;
  }
  _setOverlap(index) {
    if (index > 0) {
      if (Utils.isNumber(this._options.overlap)) {
        return this._options.overlap;
      }
      if (Utils.isArray(this._options.overlap)) {
        this._validateArrayProp("overlap");
        return this._options.overlap[index - 1];
      }
    }
    return this._overlap;
  }
  _setTimeline() {
    let currDelay = 0;
    let prevDuration = 0;
    for (const item of this._payload) {
      this._setCssVarPrefix(item);
      Utils.setCssVar(item.el, `${this._cssVarPrefix}duration`, `${item.duration}ms`);
      Utils.setCssVar(item.el, `${this._cssVarPrefix}timing-function`, item.timingFunction);
      Utils.setCssVar(item.el, `${this._cssVarPrefix}iteration-count`, item.iterationCount);
      if (prevDuration) {
        currDelay += prevDuration - item.overlap;
      }
      if (this._options.viewportTrigger) {
        this._addObserver(item);
      } else {
        Utils.setCssVar(item.el, `${this._cssVarPrefix}delay`, `${currDelay}ms`);
        this._setVisibility(item.el);
      }
      item.el.addEventListener("animationstart", () => this._handleAnimationStart(item));
      item.el.addEventListener("animationend", () => this._handleAnimationEnd(item));
      item.el.addEventListener("animationiteration", () => this._handleAnimationIteration(item));
      prevDuration = item.duration;
    }
  }
  _setVisibility(el, action = "add") {
    const animation = Utils.findInSet(this._payload, el.id).animation;
    if (this._isVendorAnimation(animation)) {
      this._setVendorCssClasses(el, animation, action);
      return;
    }
    if (action === "add") {
      el.classList.add(this._cssBaseClass, animation);
      return;
    }
    el.classList.remove(this._cssBaseClass, animation);
  }
  _addObserver(item) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = this._options.timeline.indexOf(entry.target.id);
        if (index !== -1) {
          const el = entry.target;
          if (entry.isIntersecting) {
            this._setVisibility(el);
            this._emit("intersect", { currentElement: item });
            observer.disconnect();
          }
        }
      });
    }, this._options.intersectionOptions);
    observer.observe(item.el);
  }
  _emit(eventName, data = null) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((cb) => cb({
        elements: this._payload,
        ...data
      }));
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
  setViewportTrigger(intersectionOptions = null) {
    this._options.viewportTrigger = true;
    this._options.intersectionOptions = intersectionOptions || {
      root: null,
      threshold: 0,
      rootMargin: "0px"
    };
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
  setIterationCount(iterationCount) {
    this._options.iterationCount = iterationCount;
    return this;
  }
  setTimeline(timeline) {
    this._options.timeline = timeline;
    return this;
  }
  prepare() {
    if (!this._started && this._validateTimeline()) {
      this._setPayload();
      this._setTimeline();
      this._prepared = true;
      this._emit("prepare");
    }
    return this;
  }
  start() {
    if (!this._prepared) {
      throw new Error("Please call prepare() before start().");
    }
    if (!this._started) {
      if (this._validateTimeline()) {
        for (const item of this._payload) {
          item.el.classList.add(this._cssBaseClass + this._cssRunningClass);
        }
        this._started = true;
        this._emit("start");
      }
    }
    return this;
  }
  destroy() {
    for (const item of this._payload) {
      item.el.classList.remove(this._cssBaseClass);
      item.el.classList.remove(this._cssBaseClass + this._cssRunningClass);
      this._setVisibility(item.el, "remove");
      this._setCssVarPrefix(item);
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}duration`);
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}delay`);
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}timing-function`);
      Utils.removeCssVar(item.el, `${this._cssVarPrefix}iteration-count`);
      item.el.removeEventListener("animationstart", () => this._handleAnimationStart(item));
      item.el.removeEventListener("animationend", () => this._handleAnimationEnd(item));
      item.el.removeEventListener("animationiteration", () => this._handleAnimationIteration(item));
    }
    this._started = false;
    this._payload = /* @__PURE__ */ new Set();
    this._animation = "fadeIn";
    this._timingFunction = "ease-in-out";
    this._duration = 1e3;
    this._overlap = 0;
    this._options = {};
    this._cssBaseClass = "mb";
    this._cssVarPrefix = "";
    this._emit("destroy");
    this._events = {};
  }
}
if (typeof window !== "undefined") {
  window.Movinblocks = Movinblocks;
}
export {
  Movinblocks as default
};
