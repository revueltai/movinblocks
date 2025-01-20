!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Movinblocks=i()}(this,(function(){"use strict";var t=Object.defineProperty,i=(i,s,e)=>((i,s,e)=>s in i?t(i,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[s]=e)(i,"symbol"!=typeof s?s+"":s,e);class Utils{static isNumber(t){return"number"==typeof t&&Number.isFinite(t)}static isString(t){return"string"==typeof t}static isObject(t){return"object"==typeof t&&null!==t&&Object.getPrototypeOf(t)===Object.prototype}static isArray(t){return Array.isArray(t)}static isEmptyObject(t){return this.isObject(t)&&0===Object.keys(t).length}static isEmptyArray(t){return Array.isArray(t)&&0===t.length}static isEmptySet(t){return 0===t.size}static findInSet(t,i){for(const s of t)if(s.id===i)return s;return null}static setCssVar(t,i,s){t.style.setProperty(`--${i}`,String(s))}static removeCssVar(t,i){t.style.removeProperty(`--${i}`)}}class Movinblocks{constructor(){i(this,"_started",!1),i(this,"_prepared",!1),i(this,"_payload",new Set),i(this,"_animation","fadeIn"),i(this,"_timingFunction","ease-in-out"),i(this,"_iterationCount",1),i(this,"_duration",1e3),i(this,"_overlap",0),i(this,"_options",{}),i(this,"_events",{}),i(this,"_cssBaseClass","mb"),i(this,"_cssRunningClass","-running"),i(this,"_cssVarPrefix",""),i(this,"_cssVendors",{"animate.css":{varPrefix:"animate-",cssClassPrefix:"animate__",defaultCssClasses:["animate__animated","animate__delay-1s"]}})}_isVendorAnimation(t){return Boolean(Utils.isObject(t)&&t.vendor)}_validateTimeline(){if(!this._options.timeline)throw new Error("No timeline provided.");for(const t of this._options.timeline){if(!document.getElementById(t))throw new Error(`Element id "${t}" does not exist.`)}return!0}_validateArrayProp(t){const i=this._options[t].length,s=this._options.timeline.length;if("overlap"===t){if(i!==s-1)throw new Error(`The "${t}" array must be one element shorter than the timeline. ${s-1} elements expected, got ${i} instead.`);return!0}if(i!==s)throw new Error(`The "${t}" array must be the same length as timeline. ${s} elements expected, got ${i} instead.`);return!0}_handleAnimationStart(t){this._emit("animationStart",{currentElement:t})}_handleAnimationEnd(t){this._emit("animationEnd",{currentElement:t}),this._options.timeline&&this._options.timeline[this._options.timeline.length-1]===t.id&&this._emit("end")}_handleAnimationIteration(t){this._emit("animationIteration",{currentElement:t})}_setCssVarPrefix(t){if(this._isVendorAnimation(t.animation)){const i=t.animation;this._cssVarPrefix=this._cssVendors[i.vendor].varPrefix}else this._cssVarPrefix=`${this._cssBaseClass}-`}_setVendorCssClasses(t,i,s){const e=this._cssVendors[i.vendor];"add"!==s?t.classList.remove(...e.defaultCssClasses,`${e.cssClassPrefix}${i.name}`):t.classList.add(...e.defaultCssClasses,`${e.cssClassPrefix}${i.name}`)}_setPayload(){if(this._options.timeline){let t=0;for(const i of this._options.timeline){const s=document.getElementById(i);s&&this._payload.add({el:s,id:i,duration:this._setDuration(t),animation:this._setAnimation(t),timingFunction:this._setTimingFunction(t),iterationCount:this._setIterationCount(t),overlap:this._setOverlap(t)}),t++}}}_setDuration(t){return Utils.isNumber(this._options.duration)?this._options.duration:Utils.isArray(this._options.duration)?(this._validateArrayProp("duration"),this._options.duration[t]):this._duration}_setAnimation(t){return Utils.isString(this._options.animation)||Utils.isObject(this._options.animation)?this._options.animation:Utils.isArray(this._options.animation)?(this._validateArrayProp("animation"),this._options.animation[t]):this._animation}_setTimingFunction(t){return Utils.isString(this._options.timingFunction)?this._options.timingFunction:Utils.isArray(this._options.timingFunction)?(this._validateArrayProp("timingFunction"),this._options.timingFunction[t]):this._timingFunction}_setIterationCount(t){return Utils.isNumber(this._options.iterationCount)?this._options.iterationCount:Utils.isArray(this._options.iterationCount)?(this._validateArrayProp("iterationCount"),this._options.iterationCount[t]):this._iterationCount}_setOverlap(t){if(t>0){if(Utils.isNumber(this._options.overlap))return this._options.overlap;if(Utils.isArray(this._options.overlap))return this._validateArrayProp("overlap"),this._options.overlap[t-1]}return this._overlap}_setTimeline(){let t=0,i=0;for(const s of this._payload)this._setCssVarPrefix(s),Utils.setCssVar(s.el,`${this._cssVarPrefix}duration`,`${s.duration}ms`),Utils.setCssVar(s.el,`${this._cssVarPrefix}timing-function`,s.timingFunction),Utils.setCssVar(s.el,`${this._cssVarPrefix}iteration-count`,s.iterationCount),i&&(t+=i-s.overlap),this._options.viewportTrigger?this._addObserver(s):(Utils.setCssVar(s.el,`${this._cssVarPrefix}delay`,`${t}ms`),this._setVisibility(s.el)),s.el.addEventListener("animationstart",(()=>this._handleAnimationStart(s))),s.el.addEventListener("animationend",(()=>this._handleAnimationEnd(s))),s.el.addEventListener("animationiteration",(()=>this._handleAnimationIteration(s))),i=s.duration}_setVisibility(t,i="add"){const s=Utils.findInSet(this._payload,t.id).animation;this._isVendorAnimation(s)?this._setVendorCssClasses(t,s,i):"add"!==i?t.classList.remove(this._cssBaseClass,s):t.classList.add(this._cssBaseClass,s)}_addObserver(t){const i=new IntersectionObserver((s=>{s.forEach((s=>{if(-1!==this._options.timeline.indexOf(s.target.id)){const e=s.target;s.isIntersecting&&(this._setVisibility(e),this._emit("intersect",{currentElement:t}),i.disconnect())}}))}),this._options.intersectionOptions);i.observe(t.el)}_emit(t,i=null){return this._events[t]&&this._events[t].forEach((t=>t({elements:this._payload,...i}))),this}on(t,i){return this._events[t]||(this._events[t]=[]),this._events[t].push(i),this}setDuration(t){return this._options.duration=t,this}setOverlap(t){return this._options.overlap=t,this}setViewportTrigger(t=null){return this._options.viewportTrigger=!0,this._options.intersectionOptions=t||{root:null,threshold:0,rootMargin:"0px"},this}setAnimation(t){return this._options.animation=t,this}setTimingFunction(t){return this._options.timingFunction=t,this}setIterationCount(t){return this._options.iterationCount=t,this}setTimeline(t){return this._options.timeline=t,this}prepare(){return!this._started&&this._validateTimeline()&&(this._setPayload(),this._setTimeline(),this._prepared=!0,this._emit("prepare")),this}start(){if(!this._prepared)throw new Error("Please call prepare() before start().");if(!this._started&&this._validateTimeline()){for(const t of this._payload)t.el.classList.add(this._cssBaseClass+this._cssRunningClass);this._started=!0,this._emit("start")}return this}destroy(){for(const t of this._payload)t.el.classList.remove(this._cssBaseClass),t.el.classList.remove(this._cssBaseClass+this._cssRunningClass),this._setVisibility(t.el,"remove"),this._setCssVarPrefix(t),Utils.removeCssVar(t.el,`${this._cssVarPrefix}duration`),Utils.removeCssVar(t.el,`${this._cssVarPrefix}delay`),Utils.removeCssVar(t.el,`${this._cssVarPrefix}timing-function`),Utils.removeCssVar(t.el,`${this._cssVarPrefix}iteration-count`),t.el.removeEventListener("animationstart",(()=>this._handleAnimationStart(t))),t.el.removeEventListener("animationend",(()=>this._handleAnimationEnd(t))),t.el.removeEventListener("animationiteration",(()=>this._handleAnimationIteration(t)));this._started=!1,this._payload=new Set,this._animation="fadeIn",this._timingFunction="ease-in-out",this._duration=1e3,this._overlap=0,this._options={},this._cssBaseClass="mb",this._cssVarPrefix="",this._emit("destroy"),this._events={}}}return"undefined"!=typeof window&&(window.Movinblocks=Movinblocks),Movinblocks}));
