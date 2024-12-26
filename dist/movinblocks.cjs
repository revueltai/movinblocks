"use strict";var t=Object.defineProperty,i=(i,s,n)=>((i,s,n)=>s in i?t(i,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[s]=n)(i,"symbol"!=typeof s?s+"":s,n);class Utils{static isNumber(t){return"number"==typeof t&&Number.isFinite(t)}static isString(t){return"string"==typeof t}static isArray(t){return Array.isArray(t)}static isEmptyArray(t){return Array.isArray(t)&&0===t.length}static isEmptySet(t){return 0===t.size}static setCssVar(t,i,s){t.style.setProperty(i,String(s))}static removeCssVar(t,i){t.style.removeProperty(i)}}class Movinblocks{constructor(){i(this,"_started",!1),i(this,"_payload",new Set),i(this,"_animation","fadeIn"),i(this,"_timingFunction","ease-in-out"),i(this,"_duration",1e3),i(this,"_overlap",0),i(this,"_options",{}),i(this,"_events",{}),i(this,"_cssPrefix","--mb-")}_validateTimeline(){if(!this._options.timeline)throw new Error("No timeline provided.");for(const t of this._options.timeline){if(!document.getElementById(t))throw new Error(`Element id "${t}" does not exist.`)}return!0}_handleAnimationStart(){this._emit("animationStart")}_handleAnimationEnd(t){this._emit("animationEnd"),this._options.timeline&&this._options.timeline[this._options.timeline.length-1]===t&&this._emit("end")}_handleAnimationIteration(){this._emit("animationIteration")}_setPayload(){if(this._options.timeline){let t=0;for(const i of this._options.timeline){const s=document.getElementById(i);s&&this._payload.add({el:s,id:i,duration:this._setDuration(t),animation:this._setAnimation(t),timingFunction:this._setTimingFunction(t),overlap:this._setOverlap(t)}),t++}}}_setDuration(t){return Utils.isNumber(this._options.duration)?this._options.duration:Utils.isArray(this._options.duration)?this._options.duration[t]:this._duration}_setAnimation(t){return Utils.isString(this._options.animation)?this._options.animation:Utils.isArray(this._options.animation)?this._options.animation[t]:this._animation}_setTimingFunction(t){return Utils.isString(this._options.timingFunction)?this._options.timingFunction:Utils.isArray(this._options.timingFunction)?this._options.timingFunction[t]:this._timingFunction}_setOverlap(t){if(t>0){if(Utils.isNumber(this._options.overlap))return this._options.overlap;if(Utils.isArray(this._options.overlap))return this._options.overlap[t-1]}return this._overlap}_setTimeline(){let t=0,i=0;for(const s of this._payload)s.el.classList.add("mb"),s.el.classList.add(s.animation),i&&s.overlap&&(t+=i-s.overlap),Utils.setCssVar(s.el,`${this._cssPrefix}duration`,`${s.duration}ms`),Utils.setCssVar(s.el,`${this._cssPrefix}delay`,`${t}ms`),Utils.setCssVar(s.el,`${this._cssPrefix}timing-function`,s.timingFunction),s.el.addEventListener("animationstart",(()=>this._handleAnimationStart())),s.el.addEventListener("animationend",(()=>this._handleAnimationEnd(s.id))),s.el.addEventListener("animationiteration",(()=>this._handleAnimationIteration())),i=s.duration}_triggerStart(){this._validateTimeline()&&(this._setPayload(),this._setTimeline(),this._started=!0,this._emit("start"))}_emit(t){return this._events[t]&&this._events[t].forEach((t=>t(this._payload))),this}on(t,i){return this._events[t]||(this._events[t]=[]),this._events[t].push(i),this}setDuration(t){return this._options.duration=t,this}setOverlap(t){return this._options.overlap=t,this}setAnimation(t){return this._options.animation=t,this}setTimingFunction(t){return this._options.timingFunction=t,this}setTimeline(t){return this._options.timeline=t,this}getElements(){return this._payload}start(){return this._started||this._triggerStart(),this}destroy(){for(const t of this._payload)t.el.classList.remove("mb"),t.el.classList.remove(t.animation),Utils.removeCssVar(t.el,`${this._cssPrefix}duration`),Utils.removeCssVar(t.el,`${this._cssPrefix}delay`),Utils.removeCssVar(t.el,`${this._cssPrefix}timing-function`),t.el.removeEventListener("animationstart",(()=>this._handleAnimationStart())),t.el.removeEventListener("animationend",(()=>this._handleAnimationEnd(t.id))),t.el.removeEventListener("animationiteration",(()=>this._handleAnimationIteration()));this._started=!1,this._payload=new Set,this._animation="fadeIn",this._timingFunction="ease-in-out",this._duration=1e3,this._overlap=0,this._options={},this._events={},this._emit("destroy")}}"undefined"!=typeof window&&(window.Movinblocks=Movinblocks),module.exports=Movinblocks;
