import{b as W}from"./chunk-JTEQNX6L.js";import"./chunk-LCQXFVI5.js";import{a as ue}from"./chunk-3G2DW6JY.js";import{a as te,b as ee,c as ne,d as ie,e as oe,f as ae,g as le,h as re,i as de,j as se,k as ce,l as me}from"./chunk-C235DMDT.js";import{a as Jt,b as Xt}from"./chunk-DVUCAGYN.js";import{a as qt}from"./chunk-4ZXHBL7Z.js";import{b as Dt}from"./chunk-2MJTA6BH.js";import{a as he}from"./chunk-46E45JPC.js";import{a as _e,b as ge,c as Ce,d as be}from"./chunk-J4RLDGCR.js";import{c as Mt}from"./chunk-CNWB4RCS.js";import"./chunk-TIIZLO2Y.js";import{b as Tt,c as wt,e as Et}from"./chunk-3NOUIW3T.js";import{a as fe}from"./chunk-3I6CDNCD.js";import{a as pe}from"./chunk-NSMSBFLC.js";import{a as ye}from"./chunk-2MULXT4G.js";import{c as xt}from"./chunk-2G2RABRZ.js";import{c as Kt,h as Zt}from"./chunk-SBNBPAWW.js";import{a as ft}from"./chunk-QL4F64AL.js";import{a as xe}from"./chunk-PJASEI5C.js";import{b as Nt,c as Gt}from"./chunk-EVEJNJL4.js";import{B as At,C as Ft,D as jt,E as Ut,F as Qt,G as Yt,a as It,b as Lt,f as Bt,i as Y,m as Vt,t as Ot,v as Pt,y as Rt}from"./chunk-IKIAQH2C.js";import{C as _t,J as gt,L as Ct,Ra as Wt,V as bt,Y as Q,e as st,f as ct,fa as ht,g as mt,ga as yt,ha as vt,ia as St,ja as kt,ma as $t,na as zt,oa as Ht,r as pt,s as ut}from"./chunk-HAUSOF5K.js";import{$b as it,Aa as I,Eb as L,Ec as j,Fb as C,Gb as b,Gc as dt,Ia as J,Ib as et,Jb as nt,Kb as u,Lb as o,Mb as a,Mc as U,Nb as E,Pc as w,Rb as k,Sb as M,Ub as S,Yb as g,_b as c,ac as ot,bb as r,bc as at,ca as K,cc as lt,dc as $,ea as Z,ec as z,ga as G,ia as h,ic as B,kc as V,mc as d,nc as f,oa as y,oc as D,pa as x,pc as H,qb as A,rb as X,sb as tt,tc as rt,vc as P,wa as R,wb as v,xc as p,yc as _,zc as T}from"./chunk-ELSAZ2BY.js";import"./chunk-4CLCTAJ7.js";var Ve=["button"],Oe=["*"];function Pe(e,l){if(e&1&&(o(0,"div",2),E(1,"mat-pseudo-checkbox",6),a()),e&2){let t=c();r(),u("disabled",t.disabled)}}var ve=new G("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS",{providedIn:"root",factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})}),Se=new G("MatButtonToggleGroup"),Re={provide:It,useExisting:K(()=>q),multi:!0},F=class{source;value;constructor(l,t){this.source=l,this.value=t}},q=(()=>{class e{_changeDetector=h(U);_dir=h(vt,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(t){this._name=t,this._markButtonsForCheck()}_name=h(Q).getId("mat-button-toggle-group-");vertical=!1;get value(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t.map(i=>i.value):t[0]?t[0].value:void 0}set value(t){this._setSelectionByValue(t),this.valueChange.emit(this.value)}valueChange=new R;get selected(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t:t[0]||null}get multiple(){return this._multiple}set multiple(t){this._multiple=t,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}change=new R;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(t){this._hideMultipleSelectionIndicator=t,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let t=h(ve,{optional:!0});this.appearance=t&&t.appearance?t.appearance:"standard",this._hideSingleSelectionIndicator=t?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=t?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new qt(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(t=>t.checked)),this.multiple||this._initializeTabIndex()}writeValue(t){this.value=t,this._changeDetector.markForCheck()}registerOnChange(t){this._controlValueAccessorChangeFn=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t}_keydown(t){if(this.multiple||this.disabled||bt(t))return;let n=t.target.id,s=this._buttonToggles.toArray().findIndex(O=>O.buttonId===n),m=null;switch(t.keyCode){case 32:case 13:m=this._buttonToggles.get(s)||null;break;case 38:m=this._getNextButton(s,-1);break;case 37:m=this._getNextButton(s,this.dir==="ltr"?-1:1);break;case 40:m=this._getNextButton(s,1);break;case 39:m=this._getNextButton(s,this.dir==="ltr"?1:-1);break;default:return}m&&(t.preventDefault(),m._onButtonClick(),m.focus())}_emitChangeEvent(t){let i=new F(t,this.value);this._rawValue=i.value,this._controlValueAccessorChangeFn(i.value),this.change.emit(i)}_syncButtonToggle(t,i,n=!1,s=!1){!this.multiple&&this.selected&&!t.checked&&(this.selected.checked=!1),this._selectionModel?i?this._selectionModel.select(t):this._selectionModel.deselect(t):s=!0,s?Promise.resolve().then(()=>this._updateModelValue(t,n)):this._updateModelValue(t,n)}_isSelected(t){return this._selectionModel&&this._selectionModel.isSelected(t)}_isPrechecked(t){return typeof this._rawValue>"u"?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(i=>t.value!=null&&i===t.value):t.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(t=>{t.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let t=0;t<this._buttonToggles.length;t++){let i=this._buttonToggles.get(t);if(!i.disabled){i.tabIndex=0;break}}}_getNextButton(t,i){let n=this._buttonToggles;for(let s=1;s<=n.length;s++){let m=(t+i*s+n.length)%n.length,O=n.get(m);if(O&&!O.disabled)return O}return null}_setSelectionByValue(t){if(this._rawValue=t,!this._buttonToggles)return;let i=this._buttonToggles.toArray();if(this.multiple&&t?(Array.isArray(t),this._clearSelection(),t.forEach(n=>this._selectValue(n,i))):(this._clearSelection(),this._selectValue(t,i)),!this.multiple&&i.every(n=>n.tabIndex===-1)){for(let n of i)if(!n.disabled){n.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(t=>{t.checked=!1,this.multiple||(t.tabIndex=-1)})}_selectValue(t,i){for(let n of i)if(n.value===t){n.checked=!0,this._selectionModel.select(n),this.multiple||(n.tabIndex=0);break}}_updateModelValue(t,i){i&&this._emitChangeEvent(t),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(t=>t._markForCheck())}static \u0275fac=function(i){return new(i||e)};static \u0275dir=tt({type:e,selectors:[["mat-button-toggle-group"]],contentQueries:function(i,n,s){if(i&1&&at(s,N,5),i&2){let m;$(m=z())&&(n._buttonToggles=m)}},hostAttrs:[1,"mat-button-toggle-group"],hostVars:6,hostBindings:function(i,n){i&1&&g("keydown",function(m){return n._keydown(m)}),i&2&&(L("role",n.multiple?"group":"radiogroup")("aria-disabled",n.disabled),V("mat-button-toggle-vertical",n.vertical)("mat-button-toggle-group-appearance-standard",n.appearance==="standard"))},inputs:{appearance:"appearance",name:"name",vertical:[2,"vertical","vertical",w],value:"value",multiple:[2,"multiple","multiple",w],disabled:[2,"disabled","disabled",w],disabledInteractive:[2,"disabledInteractive","disabledInteractive",w],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",w],hideMultipleSelectionIndicator:[2,"hideMultipleSelectionIndicator","hideMultipleSelectionIndicator",w]},outputs:{valueChange:"valueChange",change:"change"},exportAs:["matButtonToggleGroup"],features:[rt([Re,{provide:Se,useExisting:e}])]})}return e})(),N=(()=>{class e{_changeDetectorRef=h(U);_elementRef=h(J);_focusMonitor=h(gt);_idGenerator=h(Q);_animationDisabled=_t();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(t){this._tabIndex.set(t)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(t){this._appearance=t}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(t){t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(t){this._disabled=t}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t}_disabledInteractive;change=new R;constructor(){h(Ct).load(yt);let t=h(Se,{optional:!0}),i=h(new dt("tabindex"),{optional:!0})||"",n=h(ve,{optional:!0});this._tabIndex=I(parseInt(i)||0),this.buttonToggleGroup=t,this._appearance=n&&n.appearance?n.appearance:"standard",this._disabledInteractive=n?.disabledInteractive??!1}ngOnInit(){let t=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId("mat-button-toggle-"),t&&(t._isPrechecked(this)?this.checked=!0:t._isSelected(this)!==this._checked&&t._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add("mat-button-toggle-animations-enabled"),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let t=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),t&&t._isSelected(this)&&t._syncButtonToggle(this,!1,!1,!0)}focus(t){this._buttonElement.nativeElement.focus(t)}_onButtonClick(){if(this.disabled)return;let t=this.isSingleSelector()?!0:!this._checked;if(t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let i=this.buttonToggleGroup._buttonToggles.find(n=>n.tabIndex===0);i&&(i.tabIndex=-1),this.tabIndex=0}this.change.emit(new F(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static \u0275fac=function(i){return new(i||e)};static \u0275cmp=A({type:e,selectors:[["mat-button-toggle"]],viewQuery:function(i,n){if(i&1&&lt(Ve,5),i&2){let s;$(s=z())&&(n._buttonElement=s.first)}},hostAttrs:["role","presentation",1,"mat-button-toggle"],hostVars:14,hostBindings:function(i,n){i&1&&g("focus",function(){return n.focus()}),i&2&&(L("aria-label",null)("aria-labelledby",null)("id",n.id)("name",null),V("mat-button-toggle-standalone",!n.buttonToggleGroup)("mat-button-toggle-checked",n.checked)("mat-button-toggle-disabled",n.disabled)("mat-button-toggle-disabled-interactive",n.disabledInteractive)("mat-button-toggle-appearance-standard",n.appearance==="standard"))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],id:"id",name:"name",value:"value",tabIndex:"tabIndex",disableRipple:[2,"disableRipple","disableRipple",w],appearance:"appearance",checked:[2,"checked","checked",w],disabled:[2,"disabled","disabled",w],disabledInteractive:[2,"disabledInteractive","disabledInteractive",w]},outputs:{change:"change"},exportAs:["matButtonToggle"],ngContentSelectors:Oe,decls:7,vars:13,consts:[["button",""],["type","button",1,"mat-button-toggle-button","mat-focus-indicator",3,"click","id","disabled"],[1,"mat-button-toggle-checkbox-wrapper"],[1,"mat-button-toggle-label-content"],[1,"mat-button-toggle-focus-overlay"],["matRipple","",1,"mat-button-toggle-ripple",3,"matRippleTrigger","matRippleDisabled"],["state","checked","aria-hidden","true","appearance","minimal",3,"disabled"]],template:function(i,n){if(i&1&&(it(),o(0,"button",1,0),g("click",function(){return n._onButtonClick()}),C(2,Pe,2,1,"div",2),o(3,"span",3),ot(4),a()(),E(5,"span",4)(6,"span",5)),i&2){let s=B(1);u("id",n.buttonId)("disabled",n.disabled&&!n.disabledInteractive||null),L("role",n.isSingleSelector()?"radio":"button")("tabindex",n.disabled&&!n.disabledInteractive?-1:n.tabIndex)("aria-pressed",n.isSingleSelector()?null:n.checked)("aria-checked",n.isSingleSelector()?n.checked:null)("name",n._getButtonName())("aria-label",n.ariaLabel)("aria-labelledby",n.ariaLabelledby)("aria-disabled",n.disabled&&n.disabledInteractive?"true":null),r(2),b(n.buttonToggleGroup&&(!n.buttonToggleGroup.multiple&&!n.buttonToggleGroup.hideSingleSelectionIndicator||n.buttonToggleGroup.multiple&&!n.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),r(4),u("matRippleTrigger",s)("matRippleDisabled",n.disableRipple||n.disabled)}},dependencies:[ht,ft],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--mat-button-toggle-legacy-text-color);
  font-family: var(--mat-button-toggle-legacy-label-text-font);
  font-size: var(--mat-button-toggle-legacy-label-text-size);
  line-height: var(--mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--mat-button-toggle-legacy-label-text-tracking);
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--mat-button-toggle-legacy-disabled-state-background-color);
  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--mat-button-toggle-text-color, var(--mat-sys-on-surface));
  background-color: var(--mat-button-toggle-background-color, transparent);
  font-family: var(--mat-button-toggle-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-toggle-label-text-size, var(--mat-sys-label-large-size));
  line-height: var(--mat-button-toggle-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-weight: var(--mat-button-toggle-label-text-weight, var(--mat-sys-label-large-weight));
  letter-spacing: var(--mat-button-toggle-label-text-tracking, var(--mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-toggle-selected-state-background-color, var(--mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--mat-button-toggle-state-layer-color, var(--mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --mat-focus-indicator-border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
`],encapsulation:2,changeDetection:0})}return e})(),ke=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=X({type:e});static \u0275inj=Z({imports:[kt,N,St]})}return e})();var Fe=e=>[e,"edit"],Ne=e=>[e,"employees","new"],Me=e=>({month:e}),Ge=(e,l)=>l.id;function $e(e,l){e&1&&(o(0,"button",2)(1,"mat-icon"),d(2,"add"),a(),d(3),p(4,"translate"),a()),e&2&&(r(3),D(" ",_(4,1,"companies.addCompany")," "))}function ze(e,l){e&1&&(o(0,"span",12),d(1),p(2,"translate"),a()),e&2&&(r(),D(" (",_(2,1,"companies.inactiveLabel"),")"))}function He(e,l){if(e&1&&(o(0,"mat-option",7),d(1),C(2,ze,3,3,"span",12),a()),e&2){let t=l.$implicit;u("value",t),r(),D(" ",t.name," "),r(),b(t.isActive?-1:2)}}function je(e,l){if(e&1){let t=S();o(0,"mat-form-field",8)(1,"mat-label"),d(2),p(3,"translate"),a(),o(4,"input",13),g("click",function(){y(t);let n=B(7);return x(n.open())}),a(),E(5,"mat-datepicker-toggle",14),o(6,"mat-datepicker",15,0),g("monthSelected",function(n){y(t);let s=B(7),m=c();return x(m.onMonthSelected(n,s))}),a()()}if(e&2){let t=B(7),i=c();r(2),f(_(3,5,"companies.month")),r(2),u("matDatepicker",t)("formControl",i.monthCtrl)("max",i.maxMonth),r(),u("for",t)}}function Ue(e,l){if(e&1&&(o(0,"button",16),p(1,"translate"),o(2,"mat-icon"),d(3,"edit"),a(),d(4),p(5,"translate"),a()),e&2){let t=c(2);u("routerLink",P(7,Fe,t.selectedCompany().id))("matTooltip",_(1,3,"companies.editCompanyTooltip")),r(4),D(" ",_(5,5,"companies.editCompany")," ")}}function Qe(e,l){if(e&1&&(o(0,"div",9),C(1,Ue,6,9,"button",16),a()),e&2){let t=c();r(),b(t.authService.isAdmin()?1:-1)}}function Ye(e,l){if(e&1&&(o(0,"span",25),d(1),a()),e&2){let t=c(2);r(),f(t.ordersCount())}}function We(e,l){if(e&1){let t=S();o(0,"button",30),g("click",function(){y(t);let n=c(2);return x(n.exportOrdersExcel())}),o(1,"mat-icon"),d(2,"download"),a(),d(3," Excel "),a()}}function qe(e,l){if(e&1&&(o(0,"button",28)(1,"mat-icon"),d(2,"person_add"),a(),d(3),p(4,"translate"),a()),e&2){let t=c(2);u("routerLink",P(4,Ne,t.selectedCompany().id)),r(3),D(" ",_(4,2,"employees.addEmployee")," ")}}function Ke(e,l){e&1&&(o(0,"div",29),E(1,"mat-spinner",31),a())}function Ze(e,l){e&1&&(o(0,"th",46),d(1),p(2,"translate"),a()),e&2&&(r(),f(_(2,1,"employees.fullName")))}function Je(e,l){if(e&1){let t=S();o(0,"td",47)(1,"span",48),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),d(2),a()()}if(e&2){let t=l.$implicit;r(2),f(t.fullName)}}function Xe(e,l){e&1&&(o(0,"th",46),d(1),p(2,"translate"),a()),e&2&&(r(),f(_(2,1,"employees.embg")))}function tn(e,l){if(e&1&&(o(0,"td",47),d(1),a()),e&2){let t=l.$implicit;r(),f(t.embg)}}function en(e,l){e&1&&(o(0,"th",46),d(1),p(2,"translate"),a()),e&2&&(r(),f(_(2,1,"employees.bankAccount")))}function nn(e,l){if(e&1&&(o(0,"td",47),d(1),a()),e&2){let t=l.$implicit;r(),f(t.bankAccount)}}function on(e,l){if(e&1&&(o(0,"th",46),d(1),p(2,"translate"),p(3,"date"),a()),e&2){let t=c(4);r(),H("",_(2,2,"employees.netSalary")," (",T(3,4,t.monthCtrl.value,"MMM yyyy"),")")}}function an(e,l){if(e&1&&(o(0,"span",51),d(1),p(2,"number"),a()),e&2){let t=c(2).$implicit;r(),D("(-",T(2,1,t.deductionAmount,"1.2-2"),")")}}function ln(e,l){if(e&1&&(o(0,"span",49),d(1),p(2,"number"),C(3,an,3,4,"span",51),a()),e&2){let t=c().$implicit;r(),D(" ",T(2,2,t.recordedNetSalary,"1.2-2")," \u0434\u0435\u043D. "),r(2),b(t.deductionAmount&&t.deductionAmount>0?3:-1)}}function rn(e,l){e&1&&(o(0,"span",50),d(1,"\u2014"),a())}function dn(e,l){if(e&1&&(o(0,"td",47),C(1,ln,4,5,"span",49)(2,rn,2,0,"span",50),a()),e&2){let t=l.$implicit;r(),b(t.recordedNetSalary!==null?1:2)}}function sn(e,l){e&1&&(o(0,"th",46),d(1),p(2,"translate"),a()),e&2&&(r(),f(_(2,1,"employees.startDate")))}function cn(e,l){if(e&1&&(o(0,"td",47),d(1),p(2,"date"),a()),e&2){let t=l.$implicit;r(),f(T(2,1,t.employmentStartDate,"dd.MM.yyyy"))}}function mn(e,l){e&1&&(o(0,"th",46),d(1),p(2,"translate"),a()),e&2&&(r(),f(_(2,1,"employees.endDate")))}function pn(e,l){if(e&1&&(o(0,"td",47),d(1),p(2,"date"),a()),e&2){let t=l.$implicit;r(),D(" ",t.employmentEndDate?T(2,1,t.employmentEndDate,"dd.MM.yyyy"):"\u2014"," ")}}function un(e,l){e&1&&E(0,"th",46)}function _n(e,l){if(e&1){let t=S();o(0,"button",56),p(1,"translate"),g("click",function(){y(t);let n=c(2).$implicit,s=c(4);return x(s.editSalary(n))}),o(2,"mat-icon"),d(3,"edit_note"),a()()}e&2&&u("matTooltip",_(1,1,"employees.editRecordedSalary"))}function gn(e,l){if(e&1){let t=S();o(0,"button",57),p(1,"date"),p(2,"translate"),g("click",function(){y(t);let n=c(2).$implicit,s=c(4);return x(s.recordSalary(n))}),o(3,"mat-icon"),d(4,"payments"),a()()}if(e&2){let t=c(6);u("matTooltip",T(2,4,"employees.recordSalaryTooltip",P(7,Me,T(1,1,t.monthCtrl.value,"MMMM yyyy"))))}}function Cn(e,l){if(e&1&&C(0,_n,4,3,"button",54)(1,gn,5,9,"button",55),e&2){let t=c().$implicit,i=c(4);b(t.recordedNetSalary!==null?0:i.isMonthValidForEmployee(t)?1:-1)}}function bn(e,l){if(e&1){let t=S();o(0,"button",53),p(1,"translate"),g("click",function(n){y(t);let s=c().$implicit,m=c(4);return x(m.goToEmployeeEdit(s,n))}),o(2,"mat-icon"),d(3,"edit"),a()(),o(4,"button",58),p(5,"translate"),g("click",function(){y(t);let n=c().$implicit,s=c(4);return x(s.deleteEmployee(n))}),o(6,"mat-icon"),d(7,"delete"),a()()}e&2&&(u("matTooltip",_(1,2,"employees.editTooltip")),r(4),u("matTooltip",_(5,4,"employees.deleteTooltip")))}function hn(e,l){if(e&1){let t=S();o(0,"td",52),g("click",function(n){return n.stopPropagation()}),C(1,Cn,2,1),o(2,"button",53),p(3,"translate"),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),o(4,"mat-icon"),d(5,"visibility"),a()(),C(6,bn,8,6),a()}if(e&2){let t=c(4);r(),b(t.authService.canEditCompany(t.selectedCompany().id)?1:-1),r(),u("matTooltip",_(3,3,"employees.viewDetails")),r(4),b(t.authService.canEditCompany(t.selectedCompany().id)?6:-1)}}function fn(e,l){e&1&&E(0,"tr",59)}function yn(e,l){if(e&1){let t=S();o(0,"tr",60),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),a()}if(e&2){let t=l.$implicit;V("row-terminated",t.employmentEndDate)}}function xn(e,l){if(e&1&&(o(0,"tr",61)(1,"td",62)(2,"mat-icon"),d(3,"people_outline"),a(),o(4,"p"),d(5),p(6,"translate"),a()()()),e&2){let t=c(4);r(),L("colspan",t.allColumns.length),r(4),f(_(6,2,"employees.noEmployees"))}}function vn(e,l){if(e&1&&(o(0,"table",32),k(1,33),v(2,Ze,3,3,"th",34)(3,Je,3,1,"td",35),M(),k(4,36),v(5,Xe,3,3,"th",34)(6,tn,2,1,"td",35),M(),k(7,37),v(8,en,3,3,"th",34)(9,nn,2,1,"td",35),M(),k(10,38),v(11,on,4,7,"th",34)(12,dn,3,1,"td",35),M(),k(13,39),v(14,sn,3,3,"th",34)(15,cn,3,4,"td",35),M(),k(16,40),v(17,mn,3,3,"th",34)(18,pn,3,4,"td",35),M(),k(19,41),v(20,un,1,0,"th",34)(21,hn,7,5,"td",42),M(),v(22,fn,1,0,"tr",43)(23,yn,1,2,"tr",44)(24,xn,7,4,"tr",45),a()),e&2){let t=c(3);u("dataSource",t.displayData()),r(22),u("matHeaderRowDef",t.allColumns),r(),u("matRowDefColumns",t.allColumns)}}function Sn(e,l){e&1&&(o(0,"th",46),d(1,"\u0412\u0440\u0430\u0431\u043E\u0442\u0435\u043D"),a())}function kn(e,l){if(e&1){let t=S();o(0,"td",47)(1,"span",48),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),d(2),a()()}if(e&2){let t=l.$implicit;r(2),f(t.fullName)}}function Mn(e,l){e&1&&(o(0,"th",46),d(1,"\u0418\u0437\u0432\u0440\u0448\u0438\u0442\u0435\u043B"),a())}function Tn(e,l){if(e&1&&(o(0,"td",47),d(1),a()),e&2){let t=l.$implicit;r(),f(t.executorName)}}function wn(e,l){e&1&&(o(0,"th",46),d(1,"\u0422\u0440\u0430\u043D\u0441\u0430\u043A\u0446\u0438\u0441\u043A\u0430 \u0441\u043C\u0435\u0442\u043A\u0430"),a())}function En(e,l){if(e&1&&(o(0,"td",69),d(1),a()),e&2){let t=l.$implicit;r(),f(t.executorBankAccount)}}function Dn(e,l){e&1&&(o(0,"th",46),d(1,"\u0418.\u0431\u0440."),a())}function In(e,l){if(e&1&&(o(0,"td",47)(1,"span",70),d(2),a()()),e&2){let t=l.$implicit;r(2),f(t.orderNumber)}}function Ln(e,l){e&1&&(o(0,"th",46),d(1,"\u0418\u0437\u043D\u043E\u0441 1/5"),a())}function Bn(e,l){if(e&1&&(o(0,"span",71),d(1),p(2,"number"),a()),e&2){let t=c().$implicit;r(),D("",T(2,1,t.deductionAmount,"1.2-2")," \u0434\u0435\u043D.")}}function Vn(e,l){e&1&&(o(0,"span",72),d(1,"\u2014"),a())}function On(e,l){if(e&1&&(o(0,"td",47),C(1,Bn,3,4,"span",71)(2,Vn,2,0,"span",72),a()),e&2){let t=l.$implicit;r(),b(t.deductionAmount!==null&&t.deductionAmount>0?1:2)}}function Pn(e,l){e&1&&E(0,"th",46)}function Rn(e,l){if(e&1){let t=S();o(0,"button",56),p(1,"translate"),g("click",function(){y(t);let n=c(2).$implicit,s=c(4);return x(s.editSalary(n))}),o(2,"mat-icon"),d(3,"edit_note"),a()()}e&2&&u("matTooltip",_(1,1,"employees.editRecordedSalary"))}function An(e,l){if(e&1){let t=S();o(0,"button",57),p(1,"date"),p(2,"translate"),g("click",function(){y(t);let n=c(2).$implicit,s=c(4);return x(s.recordSalary(n))}),o(3,"mat-icon"),d(4,"payments"),a()()}if(e&2){let t=c(6);u("matTooltip",T(2,4,"employees.recordSalaryTooltip",P(7,Me,T(1,1,t.monthCtrl.value,"MMMM yyyy"))))}}function Fn(e,l){if(e&1&&C(0,Rn,4,3,"button",54)(1,An,5,9,"button",55),e&2){let t=c().$implicit,i=c(4);b(t.recordedNetSalary!==null?0:i.isMonthValidForEmployee(t)?1:-1)}}function Nn(e,l){if(e&1){let t=S();o(0,"td",52),g("click",function(n){return n.stopPropagation()}),C(1,Fn,2,1),o(2,"button",53),p(3,"translate"),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),o(4,"mat-icon"),d(5,"visibility"),a()()()}if(e&2){let t=c(4);r(),b(t.authService.canEditCompany(t.selectedCompany().id)?1:-1),r(),u("matTooltip",_(3,2,"employees.viewDetails"))}}function Gn(e,l){e&1&&E(0,"tr",59)}function $n(e,l){if(e&1){let t=S();o(0,"tr",60),g("click",function(n){let s=y(t).$implicit,m=c(4);return x(m.goToEmployee(s,n))}),a()}if(e&2){let t=l.$implicit;V("salary-paid",t.deductionAmount!==null)}}function zn(e,l){if(e&1&&(o(0,"tr",61)(1,"td",62)(2,"mat-icon"),d(3,"gavel"),a(),o(4,"p"),d(5,"\u041D\u0435\u043C\u0430 \u0432\u0440\u0430\u0431\u043E\u0442\u0435\u043D\u0438 \u0441\u043E \u0430\u043A\u0442\u0438\u0432\u043D\u0438 \u0438\u0437\u0432\u0440\u0448\u043D\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u0458\u0430 \u0437\u0430 \u043E\u0432\u043E\u0458 \u043C\u0435\u0441\u0435\u0446."),a()()()),e&2){let t=c(4);r(),L("colspan",t.ordersColumns.length)}}function Hn(e,l){if(e&1&&(o(0,"table",32),k(1,33),v(2,Sn,2,0,"th",34)(3,kn,3,1,"td",35),M(),k(4,63),v(5,Mn,2,0,"th",34)(6,Tn,2,1,"td",35),M(),k(7,64),v(8,wn,2,0,"th",34)(9,En,2,1,"td",65),M(),k(10,66),v(11,Dn,2,0,"th",34)(12,In,3,1,"td",35),M(),k(13,67),v(14,Ln,2,0,"th",34)(15,On,3,1,"td",35),M(),k(16,41),v(17,Pn,1,0,"th",34)(18,Nn,6,4,"td",42),M(),v(19,Gn,1,0,"tr",43)(20,$n,1,2,"tr",68)(21,zn,6,1,"tr",45),a()),e&2){let t=c(3);u("dataSource",t.displayData()),r(19),u("matHeaderRowDef",t.ordersColumns),r(),u("matRowDefColumns",t.ordersColumns)}}function jn(e,l){if(e&1&&(C(0,vn,25,3,"table",32),C(1,Hn,22,3,"table",32)),e&2){let t=c(2);b(t.viewMode()==="all"?0:-1),r(),b(t.viewMode()==="orders"?1:-1)}}function Un(e,l){if(e&1){let t=S();o(0,"div",10)(1,"div",17)(2,"div",18)(3,"h3",19),d(4),p(5,"translate"),o(6,"span",20),d(7),p(8,"date"),a(),o(9,"span",21),d(10),a()(),o(11,"mat-button-toggle-group",22),g("change",function(n){y(t);let s=c();return x(s.viewMode.set(n.value))}),o(12,"mat-button-toggle",23)(13,"mat-icon"),d(14,"people"),a(),o(15,"span"),d(16,"\u0421\u0438\u0442\u0435"),a()(),o(17,"mat-button-toggle",24)(18,"mat-icon"),d(19,"gavel"),a(),o(20,"span"),d(21,"\u0418\u0437\u0432\u0440\u0448\u043D\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u0458\u0430"),a(),C(22,Ye,2,1,"span",25),a()()(),o(23,"div",26),C(24,We,4,0,"button",27),C(25,qe,5,6,"button",28),a()(),C(26,Ke,2,0,"div",29)(27,jn,2,2),a()}if(e&2){let t=c();r(4),H(" ",_(5,9,"companies.employees")," \u2014 ",t.selectedCompany().name," "),r(3),f(T(8,11,t.monthCtrl.value,"MMMM yyyy")),r(3),f(t.displayData().length),r(),u("value",t.viewMode()),r(11),b(t.ordersCount()>0?22:-1),r(2),b(t.viewMode()==="orders"&&t.ordersCount()>0&&t.authService.canExportCompany(t.selectedCompany().id)?24:-1),r(),b(t.authService.canEditCompany(t.selectedCompany().id)?25:-1),r(),b(t.loadingEmployees()?26:27)}}function Qn(e,l){e&1&&(o(0,"div",11)(1,"mat-icon"),d(2,"business"),a(),o(3,"p"),d(4),p(5,"translate"),a()()),e&2&&(r(4),f(_(5,1,"companies.noSelection")))}var Zi=(()=>{class e{constructor(){this.companiesService=h(he),this.employeesService=h(fe),this.router=h(pt),this.dialog=h(Kt),this.notifications=h(Wt),this.translate=h(Tt),this.authService=h(Dt),this.companies=I([]),this.selectedCompany=I(null),this.monthlyData=I([]),this.loadingEmployees=I(!1),this.viewMode=I("all"),this.companyCtrl=new Y(null),this.monthCtrl=new Y(this.currentMonth()),this.maxMonth=new Date,this.allColumns=["fullName","embg","bankAccount","netSalary","startDate","endDate","actions"],this.ordersColumns=["fullName","executorName","executorBankAccount","orderNumber","deductionAmount","actions"],this.hasActiveOrderForMonth=t=>t.salaryRecordId!==null&&(t.deductionAmount??0)>0,this.displayData=j(()=>this.viewMode()==="orders"?this.monthlyData().filter(this.hasActiveOrderForMonth):this.monthlyData()),this.ordersCount=j(()=>this.monthlyData().filter(this.hasActiveOrderForMonth).length)}currentMonth(){let t=new Date;return t.setDate(1),t.setHours(0,0,0,0),t}ngOnInit(){let t=history.state?.selectedCompanyId;this.companiesService.getAllForDropdown().subscribe(i=>{if(this.companies.set(i),t){let n=i.find(s=>s.id===t);n&&(this.companyCtrl.setValue(n),this.onCompanySelected(n))}})}onCompanySelected(t){this.selectedCompany.set(t),this.loadMonthlyData()}onMonthSelected(t,i){let n=new Date(t.getFullYear(),t.getMonth(),1);this.monthCtrl.setValue(n),i.close(),this.selectedCompany()&&this.loadMonthlyData()}loadMonthlyData(){let t=this.selectedCompany();if(!t)return;let i=this.monthCtrl.value??this.currentMonth();this.loadingEmployees.set(!0),this.employeesService.getMonthlySalary(t.id,i.getFullYear(),i.getMonth()+1).subscribe({next:n=>{this.monthlyData.set(n),this.loadingEmployees.set(!1)},error:()=>this.loadingEmployees.set(!1)})}exportOrdersExcel(){let t=this.selectedCompany();if(!t)return;let i=this.monthCtrl.value??this.currentMonth();this.employeesService.exportEnforcementDeductionsExcel(t.id,i.getFullYear(),i.getMonth()+1).subscribe(n=>{let s=URL.createObjectURL(n),m=document.createElement("a");m.href=s,m.download=`izvrsni-${t.name}-${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}.xlsx`,m.click(),URL.revokeObjectURL(s)})}goToEmployee(t,i){i.stopPropagation(),this.router.navigate(["/companies",this.selectedCompany().id,"employees",t.id])}goToEmployeeEdit(t,i){i.stopPropagation(),this.router.navigate(["/companies",this.selectedCompany().id,"employees",t.id,"edit"])}editSalary(t){let i=this.monthCtrl.value??this.currentMonth();this.dialog.open(W,{width:"480px",data:{companyId:this.selectedCompany().id,employeeId:t.id,netSalary:t.netSalary,prefilledMonth:new Date(i.getFullYear(),i.getMonth(),1),salaryRecordId:t.salaryRecordId,recordedNetSalary:t.recordedNetSalary}}).afterClosed().subscribe(n=>{n&&(this.notifications.success(this.translate.instant("salary.saveChanges")),this.loadMonthlyData())})}recordSalary(t){let i=this.monthCtrl.value??this.currentMonth();this.dialog.open(W,{width:"480px",data:{companyId:this.selectedCompany().id,employeeId:t.id,netSalary:t.netSalary,prefilledMonth:new Date(i.getFullYear(),i.getMonth(),1)}}).afterClosed().subscribe(n=>{n&&(this.notifications.success(this.translate.instant("salary.record")),this.loadMonthlyData())})}isMonthValidForEmployee(t){let i=this.monthCtrl.value??this.currentMonth(),n=new Date(t.employmentStartDate);return i>=new Date(n.getFullYear(),n.getMonth(),1)}deleteEmployee(t){this.dialog.open(ye,{data:{title:this.translate.instant("employees.deleteEmployee"),message:this.translate.instant("employees.deleteEmployeeConfirm",{name:t.fullName}),confirmText:this.translate.instant("common.delete"),warn:!0}}).afterClosed().subscribe(i=>{i&&this.employeesService.delete(this.selectedCompany().id,t.id).subscribe({next:()=>{this.notifications.success(this.translate.instant("common.delete")),this.loadMonthlyData()},error:n=>this.notifications.error(n.error?.message??this.translate.instant("errors.failedToLoad"))})})}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=A({type:e,selectors:[["app-company-list"]],decls:17,vars:14,consts:[["monthPicker",""],[3,"title","subtitle"],["mat-flat-button","","color","primary","routerLink","new"],[1,"page-card"],[1,"selector-row"],["appearance","outline",1,"company-select"],[3,"selectionChange","formControl"],[3,"value"],["appearance","outline",1,"month-select"],[1,"company-actions"],[1,"employees-section"],[1,"no-selection"],[1,"inactive-label"],["matInput","","readonly","",3,"click","matDatepicker","formControl","max"],["matIconSuffix","",3,"for"],["startView","year",3,"monthSelected"],["mat-stroked-button","",3,"routerLink","matTooltip"],[1,"section-header"],[1,"section-header-left"],[1,"section-title"],[1,"month-label"],[1,"count-badge"],[1,"view-toggle",3,"change","value"],["value","all",1,"toggle-btn"],["value","orders",1,"toggle-btn"],[1,"orders-badge"],[1,"section-header-right"],["mat-stroked-button","",1,"export-btn"],["mat-flat-button","","color","primary",3,"routerLink"],[1,"table-loading"],["mat-stroked-button","",1,"export-btn",3,"click"],["diameter","36"],["mat-table","",1,"mat-elevation-z0",3,"dataSource"],["matColumnDef","fullName"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","embg"],["matColumnDef","bankAccount"],["matColumnDef","netSalary"],["matColumnDef","startDate"],["matColumnDef","endDate"],["matColumnDef","actions"],["mat-cell","","class","actions-cell",3,"click",4,"matCellDef"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","","class","employee-row",3,"row-terminated","click",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["mat-header-cell",""],["mat-cell",""],[1,"employee-link",3,"click"],[1,"salary-recorded"],[1,"salary-missing"],[1,"deduction-hint"],["mat-cell","",1,"actions-cell",3,"click"],["mat-icon-button","",3,"click","matTooltip"],["mat-icon-button","","color","accent",3,"matTooltip"],["mat-icon-button","","color","primary",3,"matTooltip"],["mat-icon-button","","color","accent",3,"click","matTooltip"],["mat-icon-button","","color","primary",3,"click","matTooltip"],["mat-icon-button","","color","warn",3,"click","matTooltip"],["mat-header-row",""],["mat-row","",1,"employee-row",3,"click"],[1,"mat-row"],[1,"mat-cell","empty-state"],["matColumnDef","executorName"],["matColumnDef","executorBankAccount"],["mat-cell","","class","bank-cell",4,"matCellDef"],["matColumnDef","orderNumber"],["matColumnDef","deductionAmount"],["mat-row","","class","employee-row",3,"salary-paid","click",4,"matRowDef","matRowDefColumns"],["mat-cell","",1,"bank-cell"],[1,"order-number"],[1,"amount-recorded"],[1,"text-muted"]],template:function(i,n){i&1&&(o(0,"app-page-header",1),p(1,"translate"),p(2,"translate"),C(3,$e,5,3,"button",2),a(),o(4,"div",3)(5,"div",4)(6,"mat-form-field",5)(7,"mat-label"),d(8),p(9,"translate"),a(),o(10,"mat-select",6),g("selectionChange",function(m){return n.onCompanySelected(m.value)}),et(11,He,3,3,"mat-option",7,Ge),a()(),C(13,je,8,7,"mat-form-field",8),C(14,Qe,2,1,"div",9),a(),C(15,Un,28,14,"div",10)(16,Qn,6,3,"div",11),a()),i&2&&(u("title",_(1,8,"companies.title"))("subtitle",_(2,10,"companies.subtitle")),r(3),b(n.authService.isAdmin()?3:-1),r(5),f(_(9,12,"companies.selectCompany")),r(2),u("formControl",n.companyCtrl),r(),nt(n.companies()),r(2),b(n.selectedCompany()?13:-1),r(),b(n.selectedCompany()?14:-1),r(),b(n.selectedCompany()?15:16))},dependencies:[mt,Ot,Lt,Bt,Vt,ut,Xt,At,Pt,Rt,Jt,xt,Ft,Ht,zt,$t,ke,q,N,Ut,jt,me,te,ne,le,ie,ee,re,oe,ae,de,se,ce,Zt,ue,pe,Yt,Qt,be,_e,ge,Ce,Mt,Gt,Nt,xe,Et,ct,st,wt],styles:[".selector-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px;padding:16px 16px 0;flex-wrap:wrap}.company-select[_ngcontent-%COMP%]{width:320px;min-width:200px}.month-select[_ngcontent-%COMP%]{width:200px}.company-actions[_ngcontent-%COMP%]{display:flex;gap:8px}.inactive-label[_ngcontent-%COMP%]{color:#00000061;font-size:12px}.employees-section[_ngcontent-%COMP%]{padding:0 0 16px}.section-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:20px 16px 12px;gap:12px;flex-wrap:wrap}.section-header-left[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px;flex-wrap:wrap}.section-header-right[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.section-title[_ngcontent-%COMP%]{font-size:16px;font-weight:600;margin:0;display:flex;align-items:center;gap:8px}.month-label[_ngcontent-%COMP%]{font-size:13px;font-weight:400;color:#0000008a}.count-badge[_ngcontent-%COMP%]{background:#e8eaf6;color:#3949ab;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600}.view-toggle[_ngcontent-%COMP%]{height:36px}[_nghost-%COMP%]     .toggle-btn .mat-button-toggle-label-content{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;padding:0 14px!important;line-height:36px!important}.orders-badge[_ngcontent-%COMP%]{background:#c62828;color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;line-height:16px;height:16px;min-width:16px}.export-btn[_ngcontent-%COMP%]{color:#2e7d32;border-color:#2e7d32}.table-loading[_ngcontent-%COMP%]{display:flex;justify-content:center;padding:48px}.actions-cell[_ngcontent-%COMP%]{text-align:right;white-space:nowrap}.employee-row[_ngcontent-%COMP%]{cursor:pointer}.employee-row[_ngcontent-%COMP%]:hover{background:#3949ab0a}.employee-link[_ngcontent-%COMP%]{color:#3949ab;font-weight:500;cursor:pointer}.employee-link[_ngcontent-%COMP%]:hover{text-decoration:underline}.salary-recorded[_ngcontent-%COMP%]{color:#2e7d32;font-weight:500}.salary-missing[_ngcontent-%COMP%]{color:#00000061}.deduction-hint[_ngcontent-%COMP%]{font-size:11px;color:#e53935;margin-left:4px}.order-number[_ngcontent-%COMP%]{font-weight:600;font-size:13px;color:#1565c0}.bank-cell[_ngcontent-%COMP%]{font-size:12px;color:#000000b3}.amount-recorded[_ngcontent-%COMP%]{color:#c62828;font-weight:700}.text-muted[_ngcontent-%COMP%]{color:#00000061}[_nghost-%COMP%]     .salary-paid{background:#e8f5e9!important}[_nghost-%COMP%]     .row-terminated{background:#ffebee!important}.no-selection[_ngcontent-%COMP%]{text-align:center;padding:64px;color:#00000061}.no-selection[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:56px;width:56px;height:56px;display:block;margin:0 auto 12px}.no-selection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:15px}.empty-state[_ngcontent-%COMP%]{text-align:center;padding:48px;color:#00000061}.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:48px;width:48px;height:48px;display:block;margin:0 auto 8px}"]})}}return e})();export{Zi as CompanyListComponent};
