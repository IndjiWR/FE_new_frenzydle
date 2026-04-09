import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-V5E57HPK.js";

// apps/frenzydle/src/app/pages/user/user.component.ts
var UserComponent = class _UserComponent {
  static \u0275fac = function UserComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserComponent, selectors: [["app-user"]], decls: 5, vars: 0, consts: [[1, "user-container"]], template: function UserComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "User Settings");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p");
      \u0275\u0275text(4, "Manage your profile and preferences");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n.user-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 60vh;\n  text-align: center;\n}\n/*# sourceMappingURL=user.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserComponent, [{
    type: Component,
    args: [{ selector: "app-user", standalone: true, template: `
    <div class="user-container">
      <h1>User Settings</h1>
      <p>Manage your profile and preferences</p>
    </div>
  `, styles: ["/* angular:styles/component:css;c0eddde72260d35e9286190d05f4c7f10d427892e258c850ce26a3dac81f3e71;C:/Users/Indji/WebstormProjects/FE_new_frenzydle/apps/frenzydle/src/app/pages/user/user.component.ts */\n.user-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 60vh;\n  text-align: center;\n}\n/*# sourceMappingURL=user.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserComponent, { className: "UserComponent", filePath: "apps/frenzydle/src/app/pages/user/user.component.ts", lineNumber: 23 });
})();
export {
  UserComponent
};
//# sourceMappingURL=chunk-35ATBYIA.js.map
