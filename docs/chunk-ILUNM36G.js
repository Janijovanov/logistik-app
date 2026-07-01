import{a as nt}from"./chunk-H7PI6OE6.js";import{a as ue,b as he,c as kt,d as Dt,e as St,f as Et,g as Tt}from"./chunk-DD62HPBX.js";import{a as Pt,b as It,c as Bt,d as Ft}from"./chunk-I3YZI3EA.js";import"./chunk-UEOL7AUX.js";import{b as ce}from"./chunk-COUZ3LC6.js";import{b as le,c as V,e as j}from"./chunk-RRC727QO.js";import{a as Ot,c as Rt,e as At,f as Nt,g as Vt,h as fe}from"./chunk-FZI5EX23.js";import"./chunk-QADPG4HS.js";import{b as _t,c as wt}from"./chunk-DV23D4OI.js";import{B as ft,C as gt,D as z,E as L,F as bt,G as Ct,b as rt,d as K,f as ot,g as at,k as st,n as dt,o as lt,r as ct,t as mt,v as pt,w as ut,y as ht}from"./chunk-5PJKBLLS.js";import{b as He,d as Ze,e as Ue}from"./chunk-NO4RCILH.js";import{D as Se,F as Xe,M as Je,N as Ye,Na as yt,R as et,Z as O,da as tt,e as We,ea as de,ha as it,i as se,ia as vt,ja as me,ka as pe,n as qe,oa as xt,pa as Q,qa as Mt,sa as Ee,t as N,v as Ke,w as De,y as $e}from"./chunk-Y7TIDBJZ.js";import{Ac as g,B as Oe,C as W,Ca as te,G as Re,Gb as ye,H as Ae,Hb as _,Ia as ne,Ib as w,J as ve,Ka as R,Kb as Le,La as Ne,Lb as Qe,Mb as M,Nb as o,Ob as r,Oc as ae,Pb as b,Wb as B,Y as be,_ as x,_b as u,ac as F,bc as y,cc as v,db as s,dc as H,e as E,ec as ke,fc as k,ga as J,gc as D,ia as Ce,ib as Me,ka as a,kc as Z,lb as Ve,lc as re,mc as C,nc as Ge,oc as l,pc as h,qa as T,qc as U,ra as P,rc as oe,s as G,sb as p,tb as ie,ua as xe,ub as je,va as Y,vc as A,xb as q,ya as I,yb as ze,za as ee,zc as f}from"./chunk-XTRJ6TP4.js";import"./chunk-4CLCTAJ7.js";var we=["*"],Kt=["content"],$t=[[["mat-drawer"]],[["mat-drawer-content"]],"*"],Xt=["mat-drawer","mat-drawer-content","*"];function Jt(i,m){if(i&1){let e=B();o(0,"div",1),u("click",function(){T(e);let t=F();return P(t._onBackdropClicked())}),r()}if(i&2){let e=F();C("mat-drawer-shown",e._isShowingBackdrop())}}function Yt(i,m){i&1&&(o(0,"mat-drawer-content"),v(1,2),r())}var en=[[["mat-sidenav"]],[["mat-sidenav-content"]],"*"],tn=["mat-sidenav","mat-sidenav-content","*"];function nn(i,m){if(i&1){let e=B();o(0,"div",1),u("click",function(){T(e);let t=F();return P(t._onBackdropClicked())}),r()}if(i&2){let e=F();C("mat-drawer-shown",e._isShowingBackdrop())}}function rn(i,m){i&1&&(o(0,"mat-sidenav-content"),v(1,2),r())}var on=`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`;var an=new Ce("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),Ie=new Ce("MAT_DRAWER_CONTAINER"),ge=(()=>{class i extends Q{_platform=a(N);_changeDetectorRef=a(ae);_container=a(Pe);constructor(){let e=a(R),n=a(xt),t=a(ee);super(e,n,t)}ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>{this._changeDetectorRef.markForCheck()})}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:n}=this._container;return e!=null&&e.mode!=="over"&&e.opened||n!=null&&n.mode!=="over"&&n.opened}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=p({type:i,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(n,t){n&2&&(re("margin-left",t._container._contentMargins.left,"px")("margin-right",t._container._contentMargins.right,"px"),C("mat-drawer-content-hidden",t._shouldBeHidden()))},features:[A([{provide:Q,useExisting:i}]),q],ngContentSelectors:we,decls:1,vars:0,template:function(n,t){n&1&&(y(),v(0))},encapsulation:2,changeDetection:0})}return i})(),Te=(()=>{class i{_elementRef=a(R);_focusTrapFactory=a(Ye);_focusMonitor=a(Xe);_platform=a(N);_ngZone=a(ee);_renderer=a(Ve);_interactivityChecker=a(Je);_doc=a(Y);_container=a(Ie,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e==="end"?"end":"start",e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next()}_mode="over";get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=O(e)}_disableClose=!1;get autoFocus(){let e=this._autoFocus;return e??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(e){(e==="true"||e==="false"||e==null)&&(e=O(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(O(e))}_opened=te(!1);_openedVia=null;_animationStarted=new E;_animationEnd=new E;openedChange=new I(!0);_openedStream=this.openedChange.pipe(W(e=>e),G(()=>{}));openedStart=this._animationStarted.pipe(W(()=>this.opened),ve(void 0));_closedStream=this.openedChange.pipe(W(e=>!e),G(()=>{}));closedStart=this._animationStarted.pipe(W(()=>!this.opened),ve(void 0));_destroyed=new E;onPositionChanged=new I;_content;_modeChanged=new E;_injector=a(xe);_changeDetectorRef=a(ae);constructor(){this.openedChange.pipe(x(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,n=this._elementRef.nativeElement;return[e.listen(n,"keydown",t=>{t.keyCode===27&&!this.disableClose&&!et(t)&&this._ngZone.run(()=>{this.close(),t.stopPropagation(),t.preventDefault()})}),e.listen(n,"transitionend",this._handleTransitionEvent),e.listen(n,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_forceFocus(e,n){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let t=()=>{d(),c(),e.removeAttribute("tabindex")},d=this._renderer.listen(e,"blur",t),c=this._renderer.listen(e,"mousedown",t)})),e.focus(n)}_focusByCssSelector(e,n){let t=this._elementRef.nativeElement.querySelector(e);t&&this._forceFocus(t,n)}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":Me(()=>{!this._focusTrap.focusInitialElement()&&typeof e.focus=="function"&&e.focus()},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(e){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(e=!this.opened,n){e&&n&&(this._openedVia=n);let t=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||"program");return e||(this._openedVia=null),t}_setOpen(e,n,t){return e===this.opened?Promise.resolve(e?"open":"close"):(this._opened.set(e),this._container?._transitionsEnabled?(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()}),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",e),!e&&n&&this._restoreFocus(t),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(d=>{this.openedChange.pipe(Ae(1)).subscribe(c=>d(c?"open":"close"))}))}_setIsAnimating(e){this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",e)}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let n=this._elementRef.nativeElement,t=n.parentNode;e==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),t.insertBefore(this._anchor,n)),t.appendChild(n)):this._anchor&&this._anchor.parentNode.insertBefore(n,this._anchor)}_handleTransitionEvent=e=>{let n=this._elementRef.nativeElement;e.target===n&&this._ngZone.run(()=>{e.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static \u0275fac=function(n){return new(n||i)};static \u0275cmp=p({type:i,selectors:[["mat-drawer"]],viewQuery:function(n,t){if(n&1&&ke(Kt,5),n&2){let d;k(d=D())&&(t._content=d.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(n,t){n&2&&(ye("align",null)("tabIndex",t.mode!=="side"?"-1":null),re("visibility",!t._container&&!t.opened?"hidden":null),C("mat-drawer-end",t.position==="end")("mat-drawer-over",t.mode==="over")("mat-drawer-push",t.mode==="push")("mat-drawer-side",t.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:we,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(n,t){n&1&&(y(),o(0,"div",1,0),v(2),r())},dependencies:[Q],encapsulation:2,changeDetection:0})}return i})(),Pe=(()=>{class i{_dir=a(tt,{optional:!0});_element=a(R);_ngZone=a(ee);_changeDetectorRef=a(ae);_animationDisabled=$e();_transitionsEnabled=!1;_allDrawers;_drawers=new Ne;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=O(e)}_autosize=a(an);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:O(e)}_backdropOverride=null;backdropClick=new I;_start=null;_end=null;_left=null;_right=null;_destroyed=new E;_doCheckSubject=new E;_contentMargins={left:null,right:null};_contentMarginChanges=new E;get scrollable(){return this._userContent||this._content}_injector=a(xe);constructor(){let e=a(N),n=a(Mt);this._dir?.change.pipe(x(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),n.change().pipe(x(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(be(this._allDrawers),x(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(n=>!n._container||n._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(be(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Re(10),x(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,n=0;if(this._left&&this._left.opened){if(this._left.mode=="side")e+=this._left._getWidth();else if(this._left.mode=="push"){let t=this._left._getWidth();e+=t,n-=t}}if(this._right&&this._right.opened){if(this._right.mode=="side")n+=this._right._getWidth();else if(this._right.mode=="push"){let t=this._right._getWidth();n+=t,e-=t}}e=e||null,n=n||null,(e!==this._contentMargins.left||n!==this._contentMargins.right)&&(this._contentMargins={left:e,right:n},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(x(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!=="side"&&e.openedChange.pipe(x(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(x(this._drawers.changes)).subscribe(()=>{Me({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(x(Oe(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let n=this._element.nativeElement.classList,t="mat-drawer-container-has-open";e?n.add(t):n.remove(t)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position=="end"?(this._end!=null,this._end=e):(this._start!=null,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!=="side":this._backdropOverride}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=p({type:i,selectors:[["mat-drawer-container"]],contentQueries:function(n,t,d){if(n&1&&H(d,ge,5)(d,Te,5),n&2){let c;k(c=D())&&(t._content=c.first),k(c=D())&&(t._allDrawers=c)}},viewQuery:function(n,t){if(n&1&&ke(ge,5),n&2){let d;k(d=D())&&(t._userContent=d.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(n,t){n&2&&C("mat-drawer-container-explicit-backdrop",t._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[A([{provide:Ie,useExisting:i}])],ngContentSelectors:Xt,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(n,t){n&1&&(y($t),_(0,Jt,1,2,"div",0),v(1),v(2,1),_(3,Yt,2,0,"mat-drawer-content")),n&2&&(w(t.hasBackdrop?0:-1),s(3),w(t._content?-1:3))},dependencies:[ge],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2,changeDetection:0})}return i})(),_e=(()=>{class i extends ge{static \u0275fac=(()=>{let e;return function(t){return(e||(e=ne(i)))(t||i)}})();static \u0275cmp=p({type:i,selectors:[["mat-sidenav-content"]],hostAttrs:[1,"mat-drawer-content","mat-sidenav-content"],features:[A([{provide:Q,useExisting:i}]),q],ngContentSelectors:we,decls:1,vars:0,template:function(n,t){n&1&&(y(),v(0))},encapsulation:2,changeDetection:0})}return i})(),Be=(()=>{class i extends Te{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=O(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=Se(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=Se(e)}_fixedBottomGap=0;static \u0275fac=(()=>{let e;return function(t){return(e||(e=ne(i)))(t||i)}})();static \u0275cmp=p({type:i,selectors:[["mat-sidenav"]],hostAttrs:[1,"mat-drawer","mat-sidenav"],hostVars:16,hostBindings:function(n,t){n&2&&(ye("tabIndex",t.mode!=="side"?"-1":null)("align",null),re("top",t.fixedInViewport?t.fixedTopGap:null,"px")("bottom",t.fixedInViewport?t.fixedBottomGap:null,"px"),C("mat-drawer-end",t.position==="end")("mat-drawer-over",t.mode==="over")("mat-drawer-push",t.mode==="push")("mat-drawer-side",t.mode==="side")("mat-sidenav-fixed",t.fixedInViewport))},inputs:{fixedInViewport:"fixedInViewport",fixedTopGap:"fixedTopGap",fixedBottomGap:"fixedBottomGap"},exportAs:["matSidenav"],features:[A([{provide:Te,useExisting:i}]),q],ngContentSelectors:we,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(n,t){n&1&&(y(),o(0,"div",1,0),v(2),r())},dependencies:[Q],encapsulation:2,changeDetection:0})}return i})(),jt=(()=>{class i extends Pe{_allDrawers=void 0;_content=void 0;static \u0275fac=(()=>{let e;return function(t){return(e||(e=ne(i)))(t||i)}})();static \u0275cmp=p({type:i,selectors:[["mat-sidenav-container"]],contentQueries:function(n,t,d){if(n&1&&H(d,_e,5)(d,Be,5),n&2){let c;k(c=D())&&(t._content=c.first),k(c=D())&&(t._allDrawers=c)}},hostAttrs:[1,"mat-drawer-container","mat-sidenav-container"],hostVars:2,hostBindings:function(n,t){n&2&&C("mat-drawer-container-explicit-backdrop",t._backdropOverride)},exportAs:["matSidenavContainer"],features:[A([{provide:Ie,useExisting:i},{provide:Pe,useExisting:i}]),q],ngContentSelectors:tn,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(n,t){n&1&&(y(en),_(0,nn,1,2,"div",0),v(1),v(2,1),_(3,rn,2,0,"mat-sidenav-content")),n&2&&(w(t.hasBackdrop?0:-1),s(3),w(t._content?-1:3))},dependencies:[_e],styles:[on],encapsulation:2,changeDetection:0})}return i})(),zt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=ie({type:i});static \u0275inj=J({imports:[Ee,de,Ee]})}return i})();var ln=(i,m)=>m.route;function cn(i,m){if(i&1){let e=B();o(0,"a",8),u("click",function(){T(e);let t=F();return P(t.navItemClick.emit())}),o(1,"mat-icon",9),l(2),r(),o(3,"span",10),l(4),f(5,"translate"),r()()}if(i&2){let e=m.$implicit;M("routerLink",e.route),s(2),h(e.icon),s(2),h(g(5,3,e.labelKey))}}function mn(i,m){if(i&1&&(o(0,"div",11)(1,"mat-icon"),l(2,"account_circle"),r(),o(3,"div")(4,"div",12),l(5),r(),o(6,"div",13),l(7),r()()()),i&2){let e=m.ngIf;s(5),oe("",e.firstName," ",e.lastName),s(2),h(e.role)}}var Gt=(()=>{class i{constructor(){this.navItemClick=new I,this.authService=a(ce),this.navItems=[{labelKey:"nav.companies",icon:"business",route:"/companies"},{labelKey:"nav.users",icon:"manage_accounts",route:"/users",adminOnly:!0},{labelKey:"nav.expenses",icon:"receipt_long",route:"/expenses",adminOnly:!0}]}get visibleItems(){return this.navItems.filter(e=>!e.adminOnly||this.authService.isAdmin())}static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275cmp=p({type:i,selectors:[["app-sidebar"]],outputs:{navItemClick:"navItemClick"},decls:11,vars:1,consts:[[1,"sidebar"],[1,"sidebar-logo"],["src","assets/logistik_white_background.png","alt","Logistik",1,"logo-img"],[1,"logo-text"],[1,"nav-list"],["mat-list-item","","routerLinkActive","active-link",3,"routerLink"],[1,"sidebar-footer"],["class","user-info",4,"ngIf"],["mat-list-item","","routerLinkActive","active-link",3,"click","routerLink"],["matListItemIcon",""],["matListItemTitle",""],[1,"user-info"],[1,"user-name"],[1,"user-role","text-muted","text-sm"]],template:function(n,t){n&1&&(o(0,"div",0)(1,"div",1),b(2,"img",2),o(3,"span",3),l(4,"Logistik"),r()(),b(5,"mat-divider"),o(6,"mat-nav-list",4),Le(7,cn,6,5,"a",5,ln),r(),o(9,"div",6),ze(10,mn,8,3,"div",7),r()()),n&2&&(s(7),Qe(t.visibleItems),s(3),M("ngIf",t.authService.currentUser()))},dependencies:[se,We,Ze,Ue,Tt,Et,St,Dt,ue,kt,L,z,he,j,V],styles:[".sidebar[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;background:#fff}.sidebar-logo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:20px 16px}.logo-img[_ngcontent-%COMP%]{width:36px;height:36px;object-fit:contain;border-radius:6px}.logo-text[_ngcontent-%COMP%]{font-size:20px;font-weight:700;color:#3949ab}.nav-list[_ngcontent-%COMP%]{flex:1;padding-top:8px}.active-link[_ngcontent-%COMP%]{background-color:#5c6bc01f;color:#3949ab;border-radius:8px}.active-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#3949ab}.sidebar-footer[_ngcontent-%COMP%]{padding:16px;border-top:1px solid rgba(0,0,0,.08)}.user-info[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px}.user-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#00000061;font-size:32px;width:32px;height:32px}.user-name[_ngcontent-%COMP%]{font-weight:500;font-size:14px}"]})}}return i})();var pn=["*",[["mat-toolbar-row"]]],un=["*","mat-toolbar-row"],hn=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275dir=je({type:i,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return i})(),Wt=(()=>{class i{_elementRef=a(R);_platform=a(N);_document=a(Y);color;_toolbarRows;constructor(){}ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=p({type:i,selectors:[["mat-toolbar"]],contentQueries:function(n,t,d){if(n&1&&H(d,hn,5),n&2){let c;k(c=D())&&(t._toolbarRows=c)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(n,t){n&2&&(Ge(t.color?"mat-"+t.color:""),C("mat-toolbar-multiple-rows",t._toolbarRows.length>0)("mat-toolbar-single-row",t._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:un,decls:2,vars:0,template:function(n,t){n&1&&(y(pn),v(0),v(1,1))},styles:[`.mat-toolbar {
  background: var(--mat-toolbar-container-background-color, var(--mat-sys-surface));
  color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));
  font-size: var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));
  line-height: var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-weight: var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));
  letter-spacing: var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
  --mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var qt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=ie({type:i});static \u0275inj=J({imports:[de]})}return i})();function _n(i,m){i&1&&(o(0,"mat-error"),l(1),f(2,"translate"),r()),i&2&&(s(),h(g(2,1,"errors.required")))}function wn(i,m){i&1&&(o(0,"mat-error"),l(1),f(2,"translate"),r()),i&2&&(s(),h(g(2,1,"errors.required")))}function vn(i,m){i&1&&(o(0,"mat-error"),l(1,"Min 6 characters"),r())}function bn(i,m){i&1&&(o(0,"mat-error"),l(1),f(2,"translate"),r()),i&2&&(s(),h(g(2,1,"errors.required")))}function Cn(i,m){i&1&&(o(0,"div",7),l(1),f(2,"translate"),r()),i&2&&(s(),h(g(2,1,"auth.passwordMismatch")))}function xn(i,m){i&1&&b(0,"mat-spinner",11)}function Mn(i){let m=i.get("newPassword")?.value,e=i.get("confirmNewPassword")?.value;return m&&e&&m!==e?{passwordMismatch:!0}:null}var Ht=(()=>{class i{constructor(){this.dialogRef=a(Ot),this.http=a(qe),this.notifications=a(yt),this.translate=a(le),this.fb=a(ct),this.saving=!1,this.form=this.fb.group({currentPassword:["",[K.required]],newPassword:["",[K.required,K.minLength(6)]],confirmNewPassword:["",[K.required]]},{validators:Mn})}submit(){if(this.form.invalid){this.form.markAllAsTouched();return}this.saving=!0;let{currentPassword:e,newPassword:n}=this.form.value;this.http.post(`${it.apiUrl}/auth/change-password`,{currentPassword:e,newPassword:n}).subscribe({next:()=>{this.saving=!1,this.notifications.success(this.translate.instant("auth.passwordChanged")),this.dialogRef.close(!0)},error:t=>{this.saving=!1;let d=t.error?.[0]??t.error?.message??"Failed to change password.";this.notifications.error(d)}})}static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275cmp=p({type:i,selectors:[["app-change-password-dialog"]],decls:39,vars:26,consts:[["mat-dialog-title",""],[1,"form-container",3,"formGroup"],["appearance","outline",1,"full-width"],["matInput","","type","password","formControlName","currentPassword","autocomplete","current-password"],["matSuffix",""],["matInput","","type","password","formControlName","newPassword","autocomplete","new-password"],["matInput","","type","password","formControlName","confirmNewPassword","autocomplete","new-password"],[1,"error-msg"],["align","end"],["mat-stroked-button","",3,"click"],["mat-flat-button","","color","primary",3,"click","disabled"],["diameter","18",2,"display","inline-block","margin-right","8px"]],template:function(n,t){if(n&1&&(o(0,"h2",0),l(1),f(2,"translate"),r(),o(3,"mat-dialog-content")(4,"form",1)(5,"mat-form-field",2)(6,"mat-label"),l(7),f(8,"translate"),r(),b(9,"input",3),o(10,"mat-icon",4),l(11,"lock"),r(),_(12,_n,3,3,"mat-error"),r(),o(13,"mat-form-field",2)(14,"mat-label"),l(15),f(16,"translate"),r(),b(17,"input",5),o(18,"mat-icon",4),l(19,"lock_outline"),r(),_(20,wn,3,3,"mat-error"),_(21,vn,2,0,"mat-error"),r(),o(22,"mat-form-field",2)(23,"mat-label"),l(24),f(25,"translate"),r(),b(26,"input",6),o(27,"mat-icon",4),l(28,"lock_outline"),r(),_(29,bn,3,3,"mat-error"),r(),_(30,Cn,3,3,"div",7),r()(),o(31,"mat-dialog-actions",8)(32,"button",9),u("click",function(){return t.dialogRef.close()}),l(33),f(34,"translate"),r(),o(35,"button",10),u("click",function(){return t.submit()}),_(36,xn,1,0,"mat-spinner",11),l(37),f(38,"translate"),r()()),n&2){let d,c,S,X,Fe;s(),h(g(2,14,"auth.changePassword")),s(3),M("formGroup",t.form),s(3),h(g(8,16,"auth.currentPassword")),s(5),w((d=t.form.get("currentPassword"))!=null&&d.hasError("required")&&((d=t.form.get("currentPassword"))!=null&&d.touched)?12:-1),s(3),h(g(16,18,"auth.newPassword")),s(5),w((c=t.form.get("newPassword"))!=null&&c.hasError("required")&&((c=t.form.get("newPassword"))!=null&&c.touched)?20:-1),s(),w((S=t.form.get("newPassword"))!=null&&S.hasError("minlength")&&((S=t.form.get("newPassword"))!=null&&S.touched)?21:-1),s(3),h(g(25,20,"auth.confirmNewPassword")),s(5),w((X=t.form.get("confirmNewPassword"))!=null&&X.hasError("required")&&((X=t.form.get("confirmNewPassword"))!=null&&X.touched)?29:-1),s(),w(t.form.hasError("passwordMismatch")&&((Fe=t.form.get("confirmNewPassword"))!=null&&Fe.touched)?30:-1),s(3),h(g(34,22,"common.cancel")),s(2),M("disabled",t.saving||t.form.invalid),s(),w(t.saving?36:-1),s(),U(" ",g(38,24,"auth.changePassword")," ")}},dependencies:[se,mt,st,rt,ot,at,lt,dt,fe,At,Vt,Nt,pe,me,gt,ft,pt,ut,ht,wt,_t,L,z,Ct,bt,j,V],styles:[".form-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;min-width:340px;padding-top:8px}.full-width[_ngcontent-%COMP%]{width:100%}.error-msg[_ngcontent-%COMP%]{color:#d32f2f;font-size:12px;margin-top:-8px;margin-bottom:8px}"]})}}return i})();function yn(i,m){if(i&1&&(o(0,"div",9),l(1),r(),o(2,"div",10),l(3),r()),i&2){let e=m;s(),oe("",e.firstName," ",e.lastName),s(2),h(e.email)}}var Zt=(()=>{class i{constructor(){this.menuToggle=new I,this.authService=a(ce),this.translate=a(le),this.dialog=a(Rt),this.currentLang="mk"}ngOnInit(){let e=localStorage.getItem("lang")??"mk";this.currentLang=e,this.translate.use(e)}setLang(e){this.currentLang=e,this.translate.use(e),localStorage.setItem("lang",e)}openChangePassword(){this.dialog.open(Ht,{width:"420px"})}static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275cmp=p({type:i,selectors:[["app-navbar"]],outputs:{menuToggle:"menuToggle"},decls:28,vars:12,consts:[["userMenu","matMenu"],[1,"navbar"],["mat-icon-button","",3,"click"],[1,"flex-1"],[1,"lang-switcher"],["mat-button","",1,"lang-btn",3,"click"],["mat-icon-button","",3,"matMenuTriggerFor"],[1,"user-menu-header"],["mat-menu-item","",3,"click"],[1,"font-medium"],[1,"text-muted","text-sm"]],template:function(n,t){if(n&1&&(o(0,"mat-toolbar",1)(1,"button",2),u("click",function(){return t.menuToggle.emit()}),o(2,"mat-icon"),l(3,"menu"),r()(),b(4,"span",3),o(5,"div",4)(6,"button",5),u("click",function(){return t.setLang("mk")}),l(7,"MK"),r(),o(8,"button",5),u("click",function(){return t.setLang("en")}),l(9,"EN"),r()(),o(10,"button",6)(11,"mat-icon"),l(12,"account_circle"),r()(),o(13,"mat-menu",null,0)(15,"div",7),_(16,yn,4,3),r(),b(17,"mat-divider"),o(18,"button",8),u("click",function(){return t.openChangePassword()}),o(19,"mat-icon"),l(20,"lock_reset"),r(),l(21),f(22,"translate"),r(),o(23,"button",8),u("click",function(){return t.authService.logout()}),o(24,"mat-icon"),l(25,"logout"),r(),l(26),f(27,"translate"),r()()()),n&2){let d,c=Z(14);s(6),C("lang-active",t.currentLang==="mk"),s(2),C("lang-active",t.currentLang==="en"),s(2),M("matMenuTriggerFor",c),s(6),w((d=t.authService.currentUser())?16:-1,d),s(5),U(" ",g(22,8,"auth.changePassword")," "),s(5),U(" ",g(27,10,"nav.logout")," ")}},dependencies:[qt,Wt,L,z,pe,me,vt,Ft,It,Pt,Bt,he,ue,fe,j,V],styles:[".navbar[_ngcontent-%COMP%]{background:#fff;border-bottom:1px solid rgba(0,0,0,.08);box-shadow:0 1px 4px #0000000f;position:sticky;top:0;z-index:100}.user-menu-header[_ngcontent-%COMP%]{padding:12px 16px}mat-divider[_ngcontent-%COMP%]{margin:4px 0}.lang-switcher[_ngcontent-%COMP%]{display:flex;align-items:center;gap:2px;margin-right:8px}.lang-btn[_ngcontent-%COMP%]{min-width:36px;padding:0 8px;font-size:12px;font-weight:600;color:#00000073;border-radius:6px}.lang-active[_ngcontent-%COMP%]{color:#3949ab;background:#3949ab1a}"]})}}return i})();var tr=(()=>{class i{constructor(){this.breakpoint=a(Ke),this.isMobile=nt(this.breakpoint.observe([De.XSmall,De.Small]).pipe(G(e=>e.matches)),{initialValue:!1}),this.sidenavOpen=te(!1)}static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275cmp=p({type:i,selectors:[["app-shell"]],decls:8,vars:3,consts:[["sidenav",""],[1,"shell-container"],[1,"sidenav",3,"mode","opened","fixedInViewport"],[3,"navItemClick"],[1,"main-content"],[3,"menuToggle"],[1,"page-content"]],template:function(n,t){if(n&1){let d=B();o(0,"mat-sidenav-container",1)(1,"mat-sidenav",2,0)(3,"app-sidebar",3),u("navItemClick",function(){T(d);let S=Z(2);return P(t.isMobile()&&S.close())}),r()(),o(4,"mat-sidenav-content",4)(5,"app-navbar",5),u("menuToggle",function(){T(d);let S=Z(2);return P(S.toggle())}),r(),o(6,"main",6),b(7,"router-outlet"),r()()()}n&2&&(s(),M("mode",t.isMobile()?"over":"side")("opened",!t.isMobile()||t.sidenavOpen())("fixedInViewport",!0))},dependencies:[He,zt,Be,jt,_e,Gt,Zt],styles:[".shell-container[_ngcontent-%COMP%]{height:100vh}.sidenav[_ngcontent-%COMP%]{width:260px;border-right:none;box-shadow:2px 0 8px #00000014}.main-content[_ngcontent-%COMP%]{display:flex;flex-direction:column}.page-content[_ngcontent-%COMP%]{flex:1;padding:24px;overflow-y:auto}"]})}}return i})();export{tr as ShellComponent};
