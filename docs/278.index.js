"use strict";(self.webpackChunkwasm_draw_pixel=self.webpackChunkwasm_draw_pixel||[]).push([[278],{278:(t,r,e)=>{e.a(t,(async(t,n)=>{try{e.r(r),e.d(r,{Image:()=>a.Ee,InternalState:()=>a.zm,__wbindgen_throw:()=>a.Or});var a=e(932),i=t([a]);a=(i.then?(await i)():i)[0],n()}catch(t){n(t)}}))},932:(t,r,e)=>{e.a(t,(async(n,a)=>{try{e.d(r,{Ee:()=>s,Or:()=>y,zm:()=>h});var i=e(626);t=e.hmd(t);var o=n([i]);i=(o.then?(await o)():o)[0];var _=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});_.decode();var p=new Uint8Array;function w(){return 0===p.byteLength&&(p=new Uint8Array(i.memory.buffer)),p}var u=new Int32Array;function f(){return 0===u.byteLength&&(u=new Int32Array(i.memory.buffer)),u}var c=0;function d(t,r){var e=r(1*t.length);return w().set(t,e/1),c=t.length,e}var s=function(){function t(r,e){var n=i.image_new(r,e);return t.__wrap(n)}return t.__wrap=function(r){var e=Object.create(t.prototype);return e.ptr=r,e},t.prototype.__destroy_into_raw=function(){var t=this.ptr;return this.ptr=0,t},t.prototype.free=function(){var t=this.__destroy_into_raw();i.__wbg_image_free(t)},t.prototype.width=function(){return i.image_width(this.ptr)>>>0},t.prototype.height=function(){return i.image_height(this.ptr)>>>0},t.prototype.cells=function(){try{var t=i.__wbindgen_add_to_stack_pointer(-16);i.image_cells(t,this.ptr);var r=f()[t/4+0],e=f()[t/4+1],n=(a=r,o=e,w().subarray(a/1,a/1+o)).slice();return i.__wbindgen_free(r,1*e),n}finally{i.__wbindgen_add_to_stack_pointer(16)}var a,o},t.prototype.brush=function(r,e,n){var a=d(n,i.__wbindgen_malloc),o=c,_=i.image_brush(this.ptr,r,e,a,o);return 0===_?void 0:t.__wrap(_)},t}(),h=function(){function t(r,e){var n=i.internalstate_new(r,e);return t.__wrap(n)}return t.__wrap=function(r){var e=Object.create(t.prototype);return e.ptr=r,e},t.prototype.__destroy_into_raw=function(){var t=this.ptr;return this.ptr=0,t},t.prototype.free=function(){var t=this.__destroy_into_raw();i.__wbg_internalstate_free(t)},t.prototype.image=function(){var t=i.internalstate_image(this.ptr);return s.__wrap(t)},t.prototype.brush=function(t,r,e){var n=d(e,i.__wbindgen_malloc),a=c;i.internalstate_brush(this.ptr,t,r,n,a)},t.prototype.undo=function(){i.internalstate_undo(this.ptr)},t.prototype.redo=function(){i.internalstate_redo(this.ptr)},t.prototype.clear=function(){i.internalstate_clear(this.ptr)},t}();function y(t,r){throw new Error((e=t,n=r,_.decode(w().subarray(e,e+n))));var e,n}a()}catch(l){a(l)}}))},626:(t,r,e)=>{e.a(t,(async(n,a)=>{try{var i,o=n([i=e(932)]),[i]=o.then?(await o)():o;await e.v(r,t.id,"a2234eda0d6b9bf177f7",{"./index_bg.js":{__wbindgen_throw:i.Or}}),a()}catch(t){a(t)}}),1)}}]);