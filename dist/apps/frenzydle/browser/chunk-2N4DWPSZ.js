import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-V5E57HPK.js";

// apps/frenzydle/src/app/pages/home/home.component.ts
var HomeComponent = class _HomeComponent {
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 5, vars: 0, consts: [[1, "home-container"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Welcome to FrenzyDle");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p");
      \u0275\u0275text(4, "Your daily quiz game platform");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n.home-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 60vh;\n  text-align: center;\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, template: `
    <div class="home-container">
      <h1>Welcome to FrenzyDle</h1>
      <p>Your daily quiz game platform</p>
    </div>
  `, styles: ["/* angular:styles/component:css;e475f9c3dfc962c346ddedc448e70a7bfafb71f0a9aa896addcac5ddbdfd3886;C:/Users/Indji/WebstormProjects/FE_new_frenzydle/apps/frenzydle/src/app/pages/home/home.component.ts */\n.home-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 60vh;\n  text-align: center;\n}\n/*# sourceMappingURL=home.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "apps/frenzydle/src/app/pages/home/home.component.ts", lineNumber: 23 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-2N4DWPSZ.js.map
