import{a as dt}from"./chunk-4MJUQGVB.js";import{a as Xe,b as Qe,c as Ze,d as Je,e as Ke,f as We,g as Ye,h as et,i as tt,j as nt,k as ct,l as at}from"./chunk-5GYVNRK4.js";import{a as je,b as Ge}from"./chunk-5DZJWLQX.js";import"./chunk-UEOL7AUX.js";import{a as it}from"./chunk-GKEDLLUA.js";import{a as ve}from"./chunk-OOP264BC.js";import{a as ot}from"./chunk-XJUMI3Z2.js";import{c as xe}from"./chunk-VGLSIMUC.js";import{c as He,h as $e}from"./chunk-FZI5EX23.js";import"./chunk-QADPG4HS.js";import{a as we,b as De,c as Te,d as Se,e as Ae}from"./chunk-OAL72Y4L.js";import{a as rt}from"./chunk-OO4ZAIQF.js";import{B as ze,C as Ue,D as Oe,E as Le,F as Ne,G as Be,a as ge,c as ye,f as Ce,m as Ee,r as Ie,t as Me,v as Re}from"./chunk-5PJKBLLS.js";import{a as le,d as he}from"./chunk-NO4RCILH.js";import{H as ke,Na as qe,U as pe,ba as _e,ca as ue,ea as fe,i as se,ia as Pe,ja as Fe,ka as Ve,y as be}from"./chunk-Y7TIDBJZ.js";import{Ca as u,Gb as M,Ha as j,Hb as Q,Ib as Z,Ic as re,Ka as G,Kb as J,Lb as K,Mb as s,Nb as i,Ob as a,Oc as de,Pb as k,Rc as x,Sc as me,Tb as C,Ub as E,Wb as I,Xb as W,_b as p,ac as _,bc as Y,cc as ee,db as d,ea as L,ec as te,fc as S,ga as N,gc as A,ia as B,ka as h,kc as ne,mc as R,nc as D,oc as o,pc as v,qa as g,qc as ce,ra as y,sa as q,sb as w,ta as H,tb as X,vc as ae,wc as ie,xc as oe,y as O,ya as T,yb as f,za as $}from"./chunk-XTRJ6TP4.js";import{a as F,b as V}from"./chunk-4CLCTAJ7.js";var lt=["input"],ht=["label"],bt=["*"],z={color:"accent",clickAction:"check-indeterminate",disabledInteractive:!1},kt=new B("mat-checkbox-default-options",{providedIn:"root",factory:()=>z}),l=(function(t){return t[t.Init=0]="Init",t[t.Checked=1]="Checked",t[t.Unchecked=2]="Unchecked",t[t.Indeterminate=3]="Indeterminate",t})(l||{}),U=class{source;checked},P=(()=>{class t{_elementRef=h(G);_changeDetectorRef=h(de);_ngZone=h($);_animationsDisabled=be();_options=h(kt,{optional:!0});focus(){this._inputElement.nativeElement.focus()}_createChangeEvent(e){let c=new U;return c.source=this,c.checked=e,c}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:"mdc-checkbox--anim-unchecked-checked",uncheckedToIndeterminate:"mdc-checkbox--anim-unchecked-indeterminate",checkedToUnchecked:"mdc-checkbox--anim-checked-unchecked",checkedToIndeterminate:"mdc-checkbox--anim-checked-indeterminate",indeterminateToChecked:"mdc-checkbox--anim-indeterminate-checked",indeterminateToUnchecked:"mdc-checkbox--anim-indeterminate-unchecked"};ariaLabel="";ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return`${this.id||this._uniqueId}-input`}required=!1;labelPosition="after";name=null;change=new T;indeterminateChange=new T;value;disableRipple=!1;_inputElement;_labelElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass="";_currentCheckState=l.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){h(ke).load(ue);let e=h(new re("tabindex"),{optional:!0});this._options=this._options||z,this.color=this._options.color||z.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=h(pe).getId("mat-mdc-checkbox-"),this.disabledInteractive=this._options?.disabledInteractive??!1}ngOnChanges(e){e.required&&this._validatorChangeFn()}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate)}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck())}_checked=!1;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck())}_disabled=!1;get indeterminate(){return this._indeterminate()}set indeterminate(e){let c=e!=this._indeterminate();this._indeterminate.set(e),c&&(e?this._transitionCheckState(l.Indeterminate):this._transitionCheckState(this.checked?l.Checked:l.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e)}_indeterminate=u(!1);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}writeValue(e){this.checked=!!e}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorChangeFn=e}_transitionCheckState(e){let c=this._currentCheckState,n=this._getAnimationTargetElement();if(!(c===e||!n)&&(this._currentAnimationClass&&n.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(c,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){n.classList.add(this._currentAnimationClass);let r=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{n.classList.remove(r)},1e3)})}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked)}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked)}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!=="noop"?(this.indeterminate&&e!=="check"&&Promise.resolve().then(()=>{this._indeterminate.set(!1),this.indeterminateChange.emit(!1)}),this._checked=!this._checked,this._transitionCheckState(this._checked?l.Checked:l.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e==="noop")&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate)}_onInteractionEvent(e){e.stopPropagation()}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck()})}_getAnimationClassForCheckStateTransition(e,c){if(this._animationsDisabled)return"";switch(e){case l.Init:if(c===l.Checked)return this._animationClasses.uncheckedToChecked;if(c==l.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case l.Unchecked:return c===l.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case l.Checked:return c===l.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case l.Indeterminate:return c===l.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return""}_syncIndeterminate(e){let c=this._inputElement;c&&(c.nativeElement.indeterminate=e)}_onInputClick(){this._handleInputClick()}_onTouchTargetClick(){this._handleInputClick(),this.disabled||this._inputElement.nativeElement.focus()}_preventBubblingFromLabel(e){e.target&&this._labelElement.nativeElement.contains(e.target)&&e.stopPropagation()}static \u0275fac=function(c){return new(c||t)};static \u0275cmp=w({type:t,selectors:[["mat-checkbox"]],viewQuery:function(c,n){if(c&1&&te(lt,5)(ht,5),c&2){let r;S(r=A())&&(n._inputElement=r.first),S(r=A())&&(n._labelElement=r.first)}},hostAttrs:[1,"mat-mdc-checkbox"],hostVars:16,hostBindings:function(c,n){c&2&&(W("id",n.id),M("tabindex",null)("aria-label",null)("aria-labelledby",null),D(n.color?"mat-"+n.color:"mat-accent"),R("_mat-animation-noopable",n._animationsDisabled)("mdc-checkbox--disabled",n.disabled)("mat-mdc-checkbox-disabled",n.disabled)("mat-mdc-checkbox-checked",n.checked)("mat-mdc-checkbox-disabled-interactive",n.disabledInteractive))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],ariaExpanded:[2,"aria-expanded","ariaExpanded",x],ariaControls:[0,"aria-controls","ariaControls"],ariaOwns:[0,"aria-owns","ariaOwns"],id:"id",required:[2,"required","required",x],labelPosition:"labelPosition",name:"name",value:"value",disableRipple:[2,"disableRipple","disableRipple",x],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?void 0:me(e)],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",x],checked:[2,"checked","checked",x],disabled:[2,"disabled","disabled",x],indeterminate:[2,"indeterminate","indeterminate",x]},outputs:{change:"change",indeterminateChange:"indeterminateChange"},exportAs:["matCheckbox"],features:[ae([{provide:ge,useExisting:L(()=>t),multi:!0},{provide:ye,useExisting:t,multi:!0}]),j],ngContentSelectors:bt,decls:15,vars:23,consts:[["checkbox",""],["input",""],["label",""],["mat-internal-form-field","",3,"click","labelPosition"],[1,"mdc-checkbox"],["aria-hidden","true",1,"mat-mdc-checkbox-touch-target",3,"click"],["type","checkbox",1,"mdc-checkbox__native-control",3,"blur","click","change","checked","indeterminate","disabled","id","required","tabIndex"],["aria-hidden","true",1,"mdc-checkbox__ripple"],["aria-hidden","true",1,"mdc-checkbox__background"],["focusable","false","viewBox","0 0 24 24",1,"mdc-checkbox__checkmark"],["fill","none","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-checkbox__checkmark-path"],[1,"mdc-checkbox__mixedmark"],["mat-ripple","","aria-hidden","true",1,"mat-mdc-checkbox-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-label",3,"for"]],template:function(c,n){if(c&1&&(Y(),i(0,"div",3),p("click",function(b){return n._preventBubblingFromLabel(b)}),i(1,"div",4,0)(3,"div",5),p("click",function(){return n._onTouchTargetClick()}),a(),i(4,"input",6,1),p("blur",function(){return n._onBlur()})("click",function(){return n._onInputClick()})("change",function(b){return n._onInteractionEvent(b)}),a(),k(6,"div",7),i(7,"div",8),q(),i(8,"svg",9),k(9,"path",10),a(),H(),k(10,"div",11),a(),k(11,"div",12),a(),i(12,"label",13,2),ee(14),a()()),c&2){let r=ne(2);s("labelPosition",n.labelPosition),d(4),R("mdc-checkbox--selected",n.checked),s("checked",n.checked)("indeterminate",n.indeterminate)("disabled",n.disabled&&!n.disabledInteractive)("id",n.inputId)("required",n.required)("tabIndex",n.disabled&&!n.disabledInteractive?-1:n.tabIndex),M("aria-label",n.ariaLabel||null)("aria-labelledby",n.ariaLabelledby)("aria-describedby",n.ariaDescribedby)("aria-checked",n.indeterminate?"mixed":null)("aria-controls",n.ariaControls)("aria-disabled",n.disabled&&n.disabledInteractive?!0:null)("aria-expanded",n.ariaExpanded)("aria-owns",n.ariaOwns)("name",n.name)("value",n.value),d(7),s("matRippleTrigger",r)("matRippleDisabled",n.disableRipple||n.disabled)("matRippleCentered",!0),d(),s("for",n.inputId)}},dependencies:[_e,ve],styles:[`.mdc-checkbox {
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
`],encapsulation:2,changeDetection:0})}return t})(),mt=(()=>{class t{static \u0275fac=function(c){return new(c||t)};static \u0275mod=X({type:t});static \u0275inj=N({imports:[P,fe]})}return t})();var _t=t=>["/users",t,"edit"],ut=()=>[],xt=(t,m)=>m.id;function ft(t,m){t&1&&(i(0,"div",0),k(1,"mat-spinner",1),a())}function vt(t,m){if(t&1&&(i(0,"div",0)(1,"mat-icon",2),o(2,"error_outline"),a(),i(3,"p"),o(4),a(),i(5,"button",3),o(6,"Back to Users"),a()()),t&2){let e=_();d(4),v(e.loadError())}}function gt(t,m){if(t&1&&(i(0,"mat-option",13),o(1),a()),t&2){let e=m.$implicit;s("value",e.id),d(),v(e.name)}}function yt(t,m){t&1&&(i(0,"th",26),o(1,"Company"),a())}function Ct(t,m){if(t&1&&(i(0,"td",27),o(1),a()),t&2){let e=m.$implicit;d(),v(e.companyName)}}function Et(t,m){t&1&&(i(0,"th",26),o(1,"View"),a())}function It(t,m){if(t&1){let e=I();i(0,"td",27)(1,"mat-checkbox",28),p("change",function(n){let r=g(e).$implicit,b=_(2);return y(b.updatePerm(r,"canView",n.checked))}),a()()}if(t&2){let e=m.$implicit;d(),s("checked",e.canView)}}function Mt(t,m){t&1&&(i(0,"th",26),o(1,"Edit"),a())}function wt(t,m){if(t&1){let e=I();i(0,"td",27)(1,"mat-checkbox",28),p("change",function(n){let r=g(e).$implicit,b=_(2);return y(b.updatePerm(r,"canEdit",n.checked))}),a()()}if(t&2){let e=m.$implicit;d(),s("checked",e.canEdit)}}function Dt(t,m){t&1&&(i(0,"th",26),o(1,"Export"),a())}function Tt(t,m){if(t&1){let e=I();i(0,"td",27)(1,"mat-checkbox",28),p("change",function(n){let r=g(e).$implicit,b=_(2);return y(b.updatePerm(r,"canExport",n.checked))}),a()()}if(t&2){let e=m.$implicit;d(),s("checked",e.canExport)}}function St(t,m){t&1&&k(0,"th",26)}function At(t,m){if(t&1){let e=I();i(0,"td",27)(1,"button",29),p("click",function(){let n=g(e).$implicit,r=_(2);return y(r.revokeCompany(n))}),i(2,"mat-icon"),o(3,"remove_circle"),a()()()}}function Rt(t,m){t&1&&k(0,"tr",30)}function zt(t,m){t&1&&k(0,"tr",31)}function Ut(t,m){if(t&1&&(i(0,"tr",32)(1,"td",33),o(2,"No companies assigned"),a()()),t&2){let e=_(2);d(),M("colspan",e.permCols.length)}}function Pt(t,m){if(t&1){let e=I();i(0,"app-page-header",4)(1,"button",3)(2,"mat-icon"),o(3,"arrow_back"),a(),o(4," Back "),a(),i(5,"button",5)(6,"mat-icon"),o(7,"edit"),a(),o(8," Edit "),a()(),i(9,"div",6)(10,"mat-card",7)(11,"mat-card-header")(12,"mat-card-title"),o(13,"User Info"),a()(),i(14,"mat-card-content")(15,"div",8)(16,"span"),o(17,"Username:"),a(),i(18,"strong"),o(19),a()(),i(20,"div",8)(21,"span"),o(22,"Email:"),a(),i(23,"strong"),o(24),a()(),i(25,"div",8)(26,"span"),o(27,"Role:"),a(),i(28,"strong"),o(29),a()(),i(30,"div",8)(31,"span"),o(32,"Status:"),a(),i(33,"span"),o(34),a()()()(),i(35,"mat-card",9)(36,"mat-card-header")(37,"mat-card-title"),o(38,"Company Permissions"),a()(),i(39,"mat-card-content")(40,"div",10)(41,"mat-form-field",11)(42,"mat-label"),o(43,"Add Company"),a(),i(44,"mat-select",12),J(45,gt,2,2,"mat-option",13,xt),a()(),i(47,"button",14),p("click",function(){g(e);let n=_();return y(n.assignCompany())}),o(48," Assign "),a()(),i(49,"table",15),C(50,16),f(51,yt,2,0,"th",17)(52,Ct,2,1,"td",18),E(),C(53,19),f(54,Et,2,0,"th",17)(55,It,2,1,"td",18),E(),C(56,20),f(57,Mt,2,0,"th",17)(58,wt,2,1,"td",18),E(),C(59,21),f(60,Dt,2,0,"th",17)(61,Tt,2,1,"td",18),E(),C(62,22),f(63,St,1,0,"th",17)(64,At,4,0,"td",18),E(),f(65,Rt,1,0,"tr",23)(66,zt,1,0,"tr",24)(67,Ut,3,1,"tr",25),a()()()()}if(t&2){let e=_();s("title",e.user().firstName+" "+e.user().lastName),d(5),s("routerLink",oe(13,_t,e.userId)),d(14),v(e.user().username),d(5),v(e.user().email),d(5),v(e.user().role),d(4),D(e.user().isActive?"chip-active":"chip-inactive"),d(),ce(" ",e.user().isActive?"Active":"Inactive"," "),d(10),s("formControl",e.companySelectCtrl),d(),K(e.availableCompanies()),d(2),s("disabled",!e.companySelectCtrl.value),d(2),s("dataSource",e.user().permissions??ie(15,ut)),d(16),s("matHeaderRowDef",e.permCols),d(),s("matRowDefColumns",e.permCols)}}var wn=(()=>{class t{constructor(){this.service=h(dt),this.companiesService=h(it),this.route=h(le),this.dialog=h(He),this.notifications=h(qe),this.fb=h(Ie),this.user=u(null),this.allCompanies=u([]),this.availableCompanies=u([]),this.loading=u(!0),this.loadError=u(null),this.permCols=["company","canView","canEdit","canExport","actions"],this.companySelectCtrl=this.fb.control(null)}ngOnInit(){this.userId=+this.route.snapshot.paramMap.get("userId"),this.loadAll()}loadAll(){this.loading.set(!0),this.loadError.set(null),O({user:this.service.getById(this.userId),companies:this.companiesService.getAll(1,100)}).subscribe({next:({user:e,companies:c})=>{this.allCompanies.set(c.items),this.user.set(e),this.updateAvailableCompanies(e),this.loading.set(!1)},error:e=>{let c=e?.error?.message??e?.error?.title??(e?.status?`HTTP ${e.status}`:"Failed to load user data.");this.loadError.set(c),this.loading.set(!1),console.error("UserDetail load error:",e)}})}loadUser(){this.service.getById(this.userId).subscribe(e=>{this.user.set(e),this.updateAvailableCompanies(e)})}updateAvailableCompanies(e){let c=(e.permissions??[]).map(n=>n.companyId);this.availableCompanies.set(this.allCompanies().filter(n=>!c.includes(n.id)))}assignCompany(){let e=this.companySelectCtrl.value;e&&this.service.assignPermission(this.userId,{companyId:e,canView:!0,canEdit:!1,canExport:!1}).subscribe({next:()=>{this.notifications.success("Company assigned."),this.companySelectCtrl.reset(),this.loadAll()},error:c=>this.notifications.error(c.error?.message??"Failed to assign company.")})}updatePerm(e,c,n){let r=V(F({},e),{[c]:n});this.service.updatePermission(this.userId,e.companyId,{canView:r.canView,canEdit:r.canEdit,canExport:r.canExport}).subscribe({next:()=>this.notifications.success("Permission updated."),error:b=>this.notifications.error(b.error?.message??"Failed to update permission.")})}revokeCompany(e){this.dialog.open(ot,{data:{title:"Revoke Access",message:`Remove access to "${e.companyName}"?`,confirmText:"Revoke",warn:!0}}).afterClosed().subscribe(c=>{c&&this.service.revokePermission(this.userId,e.companyId).subscribe({next:()=>{this.notifications.success("Access revoked."),this.loadAll()},error:n=>this.notifications.error(n.error?.message??"Failed to revoke access.")})})}static{this.\u0275fac=function(c){return new(c||t)}}static{this.\u0275cmp=w({type:t,selectors:[["app-user-detail"]],decls:3,vars:1,consts:[[1,"loading-wrap"],["diameter","40"],["color","warn"],["mat-stroked-button","","routerLink","/users"],["subtitle","User Permissions",3,"title"],["mat-stroked-button","",3,"routerLink"],[1,"content-grid"],[1,"info-card"],[1,"info-row"],[1,"permissions-card"],[1,"assign-form"],["appearance","outline"],[3,"formControl"],[3,"value"],["mat-flat-button","","color","primary",3,"click","disabled"],["mat-table","",1,"mat-elevation-z0",3,"dataSource"],["matColumnDef","company"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","canView"],["matColumnDef","canEdit"],["matColumnDef","canExport"],["matColumnDef","actions"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["mat-header-cell",""],["mat-cell",""],[3,"change","checked"],["mat-icon-button","","color","warn",3,"click"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],[1,"mat-cell","empty-state"]],template:function(c,n){c&1&&Q(0,ft,2,0,"div",0)(1,vt,7,1,"div",0)(2,Pt,68,16),c&2&&Z(n.loading()?0:n.loadError()?1:n.user()?2:-1)},dependencies:[se,he,Me,Ce,Ee,Ae,we,Te,Se,De,Ve,Fe,Pe,Le,Oe,at,Xe,Ze,Ye,Je,Qe,et,Ke,We,tt,nt,ct,mt,P,Ge,ze,Re,je,xe,Ue,Be,Ne,$e,rt],styles:[".content-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:280px 1fr;gap:16px;align-items:start}.info-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px}.assign-form[_ngcontent-%COMP%]{display:flex;gap:12px;align-items:center;margin-bottom:16px}.assign-form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{flex:1}.chip-active[_ngcontent-%COMP%]{background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500}.chip-inactive[_ngcontent-%COMP%]{background:#f5f5f5;color:#757575;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500}.empty-state[_ngcontent-%COMP%]{text-align:center;padding:24px;color:#00000061}.loading-wrap[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;gap:16px;color:#0000008a}"]})}}return t})();export{wn as UserDetailComponent};
