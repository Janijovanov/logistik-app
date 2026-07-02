import{a as bt}from"./chunk-4MJUQGVB.js";import{a as We,b as Ye,c as et,d as tt,e as nt,f as ct,g as it,h as at,i as ot,j as rt,k as dt,l as mt}from"./chunk-5GYVNRK4.js";import{a as Je,b as Ke}from"./chunk-5DZJWLQX.js";import"./chunk-UEOL7AUX.js";import{a as st}from"./chunk-GKEDLLUA.js";import{a as ye}from"./chunk-OOP264BC.js";import{b as Ce,c as Ee,e as Ie}from"./chunk-RRC727QO.js";import{a as lt}from"./chunk-XJUMI3Z2.js";import{c as ve}from"./chunk-VGLSIMUC.js";import{c as Qe,h as Ze}from"./chunk-FZI5EX23.js";import"./chunk-QADPG4HS.js";import{a as Ae,b as Re,c as Ue,d as Pe,e as Ve}from"./chunk-OAL72Y4L.js";import{a as ht}from"./chunk-OO4ZAIQF.js";import{B as Fe,C as Le,D as He,E as je,F as $e,G as Ge,a as Me,c as we,f as De,m as Te,r as Se,t as ze,v as Be}from"./chunk-5PJKBLLS.js";import{a as be,d as ke}from"./chunk-NO4RCILH.js";import{H as _e,Na as Xe,U as ue,ba as xe,ca as fe,ea as ge,i as he,ia as Oe,ja as Ne,ka as qe,y as pe}from"./chunk-Y7TIDBJZ.js";import{Ac as l,Ca as g,Gb as T,Ha as Q,Hb as K,Ib as W,Ic as me,Ka as Z,Kb as Y,Lb as ee,Mb as h,Nb as i,Ob as a,Oc as se,Pb as u,Rc as y,Sc as le,Tb as M,Ub as w,Wb as D,Xb as te,_b as x,ac as f,bc as ne,cc as ce,db as o,ea as q,ec as ie,fc as R,ga as H,gc as U,ia as j,ka as b,kc as ae,mc as P,nc as z,oc as r,pc as k,qa as E,qc as v,ra as I,sa as $,sb as S,ta as G,tb as J,vc as oe,wc as re,xc as de,y as N,ya as A,yb as C,za as X,zc as s}from"./chunk-XTRJ6TP4.js";import{a as L,b as O}from"./chunk-4CLCTAJ7.js";var _t=["input"],ut=["label"],xt=["*"],V={color:"accent",clickAction:"check-indeterminate",disabledInteractive:!1},ft=new j("mat-checkbox-default-options",{providedIn:"root",factory:()=>V}),p=(function(t){return t[t.Init=0]="Init",t[t.Checked=1]="Checked",t[t.Unchecked=2]="Unchecked",t[t.Indeterminate=3]="Indeterminate",t})(p||{}),B=class{source;checked},F=(()=>{class t{_elementRef=b(Z);_changeDetectorRef=b(se);_ngZone=b(X);_animationsDisabled=pe();_options=b(ft,{optional:!0});focus(){this._inputElement.nativeElement.focus()}_createChangeEvent(e){let c=new B;return c.source=this,c.checked=e,c}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:"mdc-checkbox--anim-unchecked-checked",uncheckedToIndeterminate:"mdc-checkbox--anim-unchecked-indeterminate",checkedToUnchecked:"mdc-checkbox--anim-checked-unchecked",checkedToIndeterminate:"mdc-checkbox--anim-checked-indeterminate",indeterminateToChecked:"mdc-checkbox--anim-indeterminate-checked",indeterminateToUnchecked:"mdc-checkbox--anim-indeterminate-unchecked"};ariaLabel="";ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return`${this.id||this._uniqueId}-input`}required=!1;labelPosition="after";name=null;change=new A;indeterminateChange=new A;value;disableRipple=!1;_inputElement;_labelElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass="";_currentCheckState=p.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){b(_e).load(fe);let e=b(new me("tabindex"),{optional:!0});this._options=this._options||V,this.color=this._options.color||V.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=b(ue).getId("mat-mdc-checkbox-"),this.disabledInteractive=this._options?.disabledInteractive??!1}ngOnChanges(e){e.required&&this._validatorChangeFn()}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate)}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck())}_checked=!1;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck())}_disabled=!1;get indeterminate(){return this._indeterminate()}set indeterminate(e){let c=e!=this._indeterminate();this._indeterminate.set(e),c&&(e?this._transitionCheckState(p.Indeterminate):this._transitionCheckState(this.checked?p.Checked:p.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e)}_indeterminate=g(!1);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}writeValue(e){this.checked=!!e}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorChangeFn=e}_transitionCheckState(e){let c=this._currentCheckState,n=this._getAnimationTargetElement();if(!(c===e||!n)&&(this._currentAnimationClass&&n.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(c,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){n.classList.add(this._currentAnimationClass);let d=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{n.classList.remove(d)},1e3)})}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked)}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked)}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!=="noop"?(this.indeterminate&&e!=="check"&&Promise.resolve().then(()=>{this._indeterminate.set(!1),this.indeterminateChange.emit(!1)}),this._checked=!this._checked,this._transitionCheckState(this._checked?p.Checked:p.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e==="noop")&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate)}_onInteractionEvent(e){e.stopPropagation()}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck()})}_getAnimationClassForCheckStateTransition(e,c){if(this._animationsDisabled)return"";switch(e){case p.Init:if(c===p.Checked)return this._animationClasses.uncheckedToChecked;if(c==p.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case p.Unchecked:return c===p.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case p.Checked:return c===p.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case p.Indeterminate:return c===p.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return""}_syncIndeterminate(e){let c=this._inputElement;c&&(c.nativeElement.indeterminate=e)}_onInputClick(){this._handleInputClick()}_onTouchTargetClick(){this._handleInputClick(),this.disabled||this._inputElement.nativeElement.focus()}_preventBubblingFromLabel(e){e.target&&this._labelElement.nativeElement.contains(e.target)&&e.stopPropagation()}static \u0275fac=function(c){return new(c||t)};static \u0275cmp=S({type:t,selectors:[["mat-checkbox"]],viewQuery:function(c,n){if(c&1&&ie(_t,5)(ut,5),c&2){let d;R(d=U())&&(n._inputElement=d.first),R(d=U())&&(n._labelElement=d.first)}},hostAttrs:[1,"mat-mdc-checkbox"],hostVars:16,hostBindings:function(c,n){c&2&&(te("id",n.id),T("tabindex",null)("aria-label",null)("aria-labelledby",null),z(n.color?"mat-"+n.color:"mat-accent"),P("_mat-animation-noopable",n._animationsDisabled)("mdc-checkbox--disabled",n.disabled)("mat-mdc-checkbox-disabled",n.disabled)("mat-mdc-checkbox-checked",n.checked)("mat-mdc-checkbox-disabled-interactive",n.disabledInteractive))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],ariaExpanded:[2,"aria-expanded","ariaExpanded",y],ariaControls:[0,"aria-controls","ariaControls"],ariaOwns:[0,"aria-owns","ariaOwns"],id:"id",required:[2,"required","required",y],labelPosition:"labelPosition",name:"name",value:"value",disableRipple:[2,"disableRipple","disableRipple",y],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?void 0:le(e)],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",y],checked:[2,"checked","checked",y],disabled:[2,"disabled","disabled",y],indeterminate:[2,"indeterminate","indeterminate",y]},outputs:{change:"change",indeterminateChange:"indeterminateChange"},exportAs:["matCheckbox"],features:[oe([{provide:Me,useExisting:q(()=>t),multi:!0},{provide:we,useExisting:t,multi:!0}]),Q],ngContentSelectors:xt,decls:15,vars:23,consts:[["checkbox",""],["input",""],["label",""],["mat-internal-form-field","",3,"click","labelPosition"],[1,"mdc-checkbox"],["aria-hidden","true",1,"mat-mdc-checkbox-touch-target",3,"click"],["type","checkbox",1,"mdc-checkbox__native-control",3,"blur","click","change","checked","indeterminate","disabled","id","required","tabIndex"],["aria-hidden","true",1,"mdc-checkbox__ripple"],["aria-hidden","true",1,"mdc-checkbox__background"],["focusable","false","viewBox","0 0 24 24",1,"mdc-checkbox__checkmark"],["fill","none","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-checkbox__checkmark-path"],[1,"mdc-checkbox__mixedmark"],["mat-ripple","","aria-hidden","true",1,"mat-mdc-checkbox-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-label",3,"for"]],template:function(c,n){if(c&1&&(ne(),i(0,"div",3),x("click",function(_){return n._preventBubblingFromLabel(_)}),i(1,"div",4,0)(3,"div",5),x("click",function(){return n._onTouchTargetClick()}),a(),i(4,"input",6,1),x("blur",function(){return n._onBlur()})("click",function(){return n._onInputClick()})("change",function(_){return n._onInteractionEvent(_)}),a(),u(6,"div",7),i(7,"div",8),$(),i(8,"svg",9),u(9,"path",10),a(),G(),u(10,"div",11),a(),u(11,"div",12),a(),i(12,"label",13,2),ce(14),a()()),c&2){let d=ae(2);h("labelPosition",n.labelPosition),o(4),P("mdc-checkbox--selected",n.checked),h("checked",n.checked)("indeterminate",n.indeterminate)("disabled",n.disabled&&!n.disabledInteractive)("id",n.inputId)("required",n.required)("tabIndex",n.disabled&&!n.disabledInteractive?-1:n.tabIndex),T("aria-label",n.ariaLabel||null)("aria-labelledby",n.ariaLabelledby)("aria-describedby",n.ariaDescribedby)("aria-checked",n.indeterminate?"mixed":null)("aria-controls",n.ariaControls)("aria-disabled",n.disabled&&n.disabledInteractive?!0:null)("aria-expanded",n.ariaExpanded)("aria-owns",n.ariaOwns)("name",n.name)("value",n.value),o(7),h("matRippleTrigger",d)("matRippleDisabled",n.disableRipple||n.disabled)("matRippleCentered",!0),o(),h("for",n.inputId)}},dependencies:[xe,ye],styles:[`.mdc-checkbox {
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
}
.mdc-checkbox:hover > .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control {
  position: absolute;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
  width: var(--mat-checkbox-state-layer-size, 40px);
  height: var(--mat-checkbox-state-layer-size, 40px);
  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
}

.mdc-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.mdc-checkbox__background {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 2px;
  background-color: transparent;
  pointer-events: none;
  will-change: background-color, border-color;
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));
  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
}

.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox--disabled .mdc-checkbox__background {
  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}
@media (forced-colors: active) {
  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));
  background-color: transparent;
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));
}

.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
    border-color: GrayText;
  }
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}

.mdc-checkbox__checkmark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);
  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__checkmark {
    color: CanvasText;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
    color: GrayText;
  }
}

.mdc-checkbox__checkmark-path {
  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);
  stroke: currentColor;
  stroke-width: 3.12px;
  stroke-dashoffset: 29.7833385;
  stroke-dasharray: 29.7833385;
}

.mdc-checkbox__mixedmark {
  width: 100%;
  height: 0;
  transform: scaleX(0) rotate(0deg);
  border-width: 1px;
  border-style: solid;
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__mixedmark {
    margin: 0 1px;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
    border-color: GrayText;
  }
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,
.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,
.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,
.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
  animation-duration: 180ms;
  animation-timing-function: linear;
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;
  transition: none;
}

.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;
  transition: none;
}
.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;
  transition: none;
}
.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;
  transition: none;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {
  stroke-dashoffset: 0;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);
  opacity: 1;
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(-45deg);
}

.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(0deg);
  opacity: 1;
}

@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
  0%, 50% {
    stroke-dashoffset: 29.7833385;
  }
  50% {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
  0%, 68.2% {
    transform: scaleX(0);
  }
  68.2% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
  from {
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: -29.7833385;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-checkmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(45deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-checkmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(45deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(315deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
  0% {
    animation-timing-function: linear;
    transform: scaleX(1);
    opacity: 1;
  }
  32.8%, 100% {
    transform: scaleX(0);
    opacity: 0;
  }
}
.mat-mdc-checkbox {
  display: inline-block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-checkbox label {
  cursor: pointer;
}
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--mat-checkbox-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-checkbox-label-text-font, var(--mat-sys-body-medium-font));
  line-height: var(--mat-checkbox-label-text-line-height, var(--mat-sys-body-medium-line-height));
  font-size: var(--mat-checkbox-label-text-size, var(--mat-sys-body-medium-size));
  letter-spacing: var(--mat-checkbox-label-text-tracking, var(--mat-sys-body-medium-tracking));
  font-weight: var(--mat-checkbox-label-text-weight, var(--mat-sys-body-medium-weight));
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
  cursor: default;
  color: var(--mat-checkbox-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
    color: GrayText;
  }
}
.mat-mdc-checkbox label:empty {
  display: none;
}
.mat-mdc-checkbox .mdc-checkbox__ripple {
  opacity: 0;
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple,
.mdc-checkbox__ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),
.mdc-checkbox__ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-mdc-checkbox-ripple .mat-ripple-element {
  opacity: 0.1;
}

.mat-mdc-checkbox-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--mat-checkbox-touch-target-size, 48px);
  width: var(--mat-checkbox-touch-target-size, 48px);
  transform: translate(-50%, -50%);
  display: var(--mat-checkbox-touch-target-display, block);
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {
  border-radius: 50%;
}

.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2,changeDetection:0})}return t})(),kt=(()=>{class t{static \u0275fac=function(c){return new(c||t)};static \u0275mod=J({type:t});static \u0275inj=H({imports:[F,ge]})}return t})();var gt=t=>["/users",t,"edit"],yt=()=>[],Ct=(t,m)=>m.id;function Et(t,m){t&1&&(i(0,"div",0),u(1,"mat-spinner",1),a())}function It(t,m){if(t&1&&(i(0,"div",0)(1,"mat-icon",2),r(2,"error_outline"),a(),i(3,"p"),r(4),a(),i(5,"button",3),r(6),s(7,"translate"),a()()),t&2){let e=f();o(4),k(e.loadError()),o(2),k(l(7,2,"users.backToUsers"))}}function Mt(t,m){if(t&1&&(i(0,"mat-option",13),r(1),a()),t&2){let e=m.$implicit;h("value",e.id),o(),k(e.name)}}function wt(t,m){t&1&&(i(0,"th",26),r(1),s(2,"translate"),a()),t&2&&(o(),k(l(2,1,"users.company")))}function Dt(t,m){if(t&1&&(i(0,"td",27),r(1),a()),t&2){let e=m.$implicit;o(),k(e.companyName)}}function Tt(t,m){t&1&&(i(0,"th",26),r(1),s(2,"translate"),a()),t&2&&(o(),k(l(2,1,"users.canView")))}function St(t,m){if(t&1){let e=D();i(0,"td",27)(1,"mat-checkbox",28),x("change",function(n){let d=E(e).$implicit,_=f(2);return I(_.updatePerm(d,"canView",n.checked))}),a()()}if(t&2){let e=m.$implicit;o(),h("checked",e.canView)}}function zt(t,m){t&1&&(i(0,"th",26),r(1),s(2,"translate"),a()),t&2&&(o(),k(l(2,1,"users.canEdit")))}function At(t,m){if(t&1){let e=D();i(0,"td",27)(1,"mat-checkbox",28),x("change",function(n){let d=E(e).$implicit,_=f(2);return I(_.updatePerm(d,"canEdit",n.checked))}),a()()}if(t&2){let e=m.$implicit;o(),h("checked",e.canEdit)}}function Rt(t,m){t&1&&(i(0,"th",26),r(1),s(2,"translate"),a()),t&2&&(o(),k(l(2,1,"users.canExport")))}function Ut(t,m){if(t&1){let e=D();i(0,"td",27)(1,"mat-checkbox",28),x("change",function(n){let d=E(e).$implicit,_=f(2);return I(_.updatePerm(d,"canExport",n.checked))}),a()()}if(t&2){let e=m.$implicit;o(),h("checked",e.canExport)}}function Pt(t,m){t&1&&u(0,"th",26)}function Vt(t,m){if(t&1){let e=D();i(0,"td",27)(1,"button",29),x("click",function(){let n=E(e).$implicit,d=f(2);return I(d.revokeCompany(n))}),i(2,"mat-icon"),r(3,"remove_circle"),a()()()}}function Bt(t,m){t&1&&u(0,"tr",30)}function Ft(t,m){t&1&&u(0,"tr",31)}function Lt(t,m){if(t&1&&(i(0,"tr",32)(1,"td",33),r(2),s(3,"translate"),a()()),t&2){let e=f(2);o(),T("colspan",e.permCols.length),o(),k(l(3,2,"users.noPermissions"))}}function Ot(t,m){if(t&1){let e=D();i(0,"app-page-header",4),s(1,"translate"),i(2,"button",3)(3,"mat-icon"),r(4,"arrow_back"),a(),r(5),s(6,"translate"),a(),i(7,"button",5)(8,"mat-icon"),r(9,"edit"),a(),r(10),s(11,"translate"),a()(),i(12,"div",6)(13,"mat-card",7)(14,"mat-card-header")(15,"mat-card-title"),r(16),s(17,"translate"),a()(),i(18,"mat-card-content")(19,"div",8)(20,"span"),r(21),s(22,"translate"),a(),i(23,"strong"),r(24),a()(),i(25,"div",8)(26,"span"),r(27),s(28,"translate"),a(),i(29,"strong"),r(30),a()(),i(31,"div",8)(32,"span"),r(33),s(34,"translate"),a(),i(35,"strong"),r(36),a()(),i(37,"div",8)(38,"span"),r(39),s(40,"translate"),a(),i(41,"span"),r(42),s(43,"translate"),a()()()(),i(44,"mat-card",9)(45,"mat-card-header")(46,"mat-card-title"),r(47),s(48,"translate"),a()(),i(49,"mat-card-content")(50,"div",10)(51,"mat-form-field",11)(52,"mat-label"),r(53),s(54,"translate"),a(),i(55,"mat-select",12),Y(56,Mt,2,2,"mat-option",13,Ct),a()(),i(58,"button",14),x("click",function(){E(e);let n=f();return I(n.assignCompany())}),r(59),s(60,"translate"),a()(),i(61,"table",15),M(62,16),C(63,wt,3,3,"th",17)(64,Dt,2,1,"td",18),w(),M(65,19),C(66,Tt,3,3,"th",17)(67,St,2,1,"td",18),w(),M(68,20),C(69,zt,3,3,"th",17)(70,At,2,1,"td",18),w(),M(71,21),C(72,Rt,3,3,"th",17)(73,Ut,2,1,"td",18),w(),M(74,22),C(75,Pt,1,0,"th",17)(76,Vt,4,0,"td",18),w(),C(77,Bt,1,0,"tr",23)(78,Ft,1,0,"tr",24)(79,Lt,4,4,"tr",25),a()()()()}if(t&2){let e=f();h("title",e.user().firstName+" "+e.user().lastName)("subtitle",l(1,24,"users.userPermissions")),o(5),v(" ",l(6,26,"common.back")," "),o(2),h("routerLink",de(48,gt,e.userId)),o(3),v(" ",l(11,28,"common.edit")," "),o(6),k(l(17,30,"users.userInfo")),o(5),v("",l(22,32,"auth.username"),":"),o(3),k(e.user().username),o(3),v("",l(28,34,"common.email"),":"),o(3),k(e.user().email),o(3),v("",l(34,36,"users.role"),":"),o(3),k(e.user().role),o(3),v("",l(40,38,"common.status"),":"),o(2),z(e.user().isActive?"chip-active":"chip-inactive"),o(),v(" ",l(43,40,e.user().isActive?"common.active":"common.inactive")," "),o(5),k(l(48,42,"users.companyPermissions")),o(6),k(l(54,44,"companies.addCompany")),o(2),h("formControl",e.companySelectCtrl),o(),ee(e.availableCompanies()),o(2),h("disabled",!e.companySelectCtrl.value),o(),v(" ",l(60,46,"users.assign")," "),o(2),h("dataSource",e.user().permissions??re(50,yt)),o(16),h("matHeaderRowDef",e.permCols),o(),h("matRowDefColumns",e.permCols)}}var Un=(()=>{class t{constructor(){this.service=b(bt),this.companiesService=b(st),this.route=b(be),this.dialog=b(Qe),this.notifications=b(Xe),this.translate=b(Ce),this.fb=b(Se),this.user=g(null),this.allCompanies=g([]),this.availableCompanies=g([]),this.loading=g(!0),this.loadError=g(null),this.permCols=["company","canView","canEdit","canExport","actions"],this.companySelectCtrl=this.fb.control(null)}ngOnInit(){this.userId=+this.route.snapshot.paramMap.get("userId"),this.loadAll()}loadAll(){this.loading.set(!0),this.loadError.set(null),N({user:this.service.getById(this.userId),companies:this.companiesService.getAll(1,100)}).subscribe({next:({user:e,companies:c})=>{this.allCompanies.set(c.items),this.user.set(e),this.updateAvailableCompanies(e),this.loading.set(!1)},error:e=>{let c=e?.error?.message??e?.error?.title??(e?.status?`HTTP ${e.status}`:"Failed to load user data.");this.loadError.set(c),this.loading.set(!1),console.error("UserDetail load error:",e)}})}loadUser(){this.service.getById(this.userId).subscribe(e=>{this.user.set(e),this.updateAvailableCompanies(e)})}updateAvailableCompanies(e){let c=(e.permissions??[]).map(n=>n.companyId);this.availableCompanies.set(this.allCompanies().filter(n=>!c.includes(n.id)))}assignCompany(){let e=this.companySelectCtrl.value;e&&this.service.assignPermission(this.userId,{companyId:e,canView:!0,canEdit:!1,canExport:!1}).subscribe({next:()=>{this.notifications.success(this.translate.instant("users.companyAssigned")),this.companySelectCtrl.reset(),this.loadAll()},error:c=>this.notifications.error(c.error?.message??this.translate.instant("errors.failedToLoad"))})}updatePerm(e,c,n){let d=O(L({},e),{[c]:n});this.service.updatePermission(this.userId,e.companyId,{canView:d.canView,canEdit:d.canEdit,canExport:d.canExport}).subscribe({next:()=>this.notifications.success(this.translate.instant("users.permissionUpdated")),error:_=>this.notifications.error(_.error?.message??this.translate.instant("errors.failedToLoad"))})}revokeCompany(e){this.dialog.open(lt,{data:{title:this.translate.instant("users.revokeAccess"),message:this.translate.instant("users.revokeConfirm",{companyName:e.companyName}),confirmText:this.translate.instant("users.revoke"),warn:!0}}).afterClosed().subscribe(c=>{c&&this.service.revokePermission(this.userId,e.companyId).subscribe({next:()=>{this.notifications.success(this.translate.instant("users.accessRevoked")),this.loadAll()},error:n=>this.notifications.error(n.error?.message??this.translate.instant("errors.failedToLoad"))})})}static{this.\u0275fac=function(c){return new(c||t)}}static{this.\u0275cmp=S({type:t,selectors:[["app-user-detail"]],decls:3,vars:1,consts:[[1,"loading-wrap"],["diameter","40"],["color","warn"],["mat-stroked-button","","routerLink","/users"],[3,"title","subtitle"],["mat-stroked-button","",3,"routerLink"],[1,"content-grid"],[1,"info-card"],[1,"info-row"],[1,"permissions-card"],[1,"assign-form"],["appearance","outline"],[3,"formControl"],[3,"value"],["mat-flat-button","","color","primary",3,"click","disabled"],["mat-table","",1,"mat-elevation-z0",3,"dataSource"],["matColumnDef","company"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","canView"],["matColumnDef","canEdit"],["matColumnDef","canExport"],["matColumnDef","actions"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["mat-header-cell",""],["mat-cell",""],[3,"change","checked"],["mat-icon-button","","color","warn",3,"click"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],[1,"mat-cell","empty-state"]],template:function(c,n){c&1&&K(0,Et,2,0,"div",0)(1,It,8,4,"div",0)(2,Ot,80,51),c&2&&W(n.loading()?0:n.loadError()?1:n.user()?2:-1)},dependencies:[he,ke,ze,De,Te,Ve,Ae,Ue,Pe,Re,qe,Ne,Oe,je,He,mt,We,et,it,tt,Ye,at,nt,ct,ot,rt,dt,kt,F,Ke,Fe,Be,Je,ve,Le,Ge,$e,Ze,ht,Ie,Ee],styles:[".content-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:280px 1fr;gap:16px;align-items:start}.info-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px}.assign-form[_ngcontent-%COMP%]{display:flex;gap:12px;align-items:center;margin-bottom:16px}.assign-form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{flex:1}.chip-active[_ngcontent-%COMP%]{background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500}.chip-inactive[_ngcontent-%COMP%]{background:#f5f5f5;color:#757575;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500}.empty-state[_ngcontent-%COMP%]{text-align:center;padding:24px;color:#00000061}.loading-wrap[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;gap:16px;color:#0000008a}"]})}}return t})();export{Un as UserDetailComponent};
