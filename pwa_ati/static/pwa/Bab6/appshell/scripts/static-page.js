! function e(t, n, o) {
    function r(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var u = "function" == typeof require && require;
                if (!s && u) return u(a, !0);
                if (i) return i(a, !0);
                var c = new Error("Cannot find module '" + a + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            var l = n[a] = {
                exports: {}
            };
            t[a][0].call(l.exports, function(e) {
                var n = t[a][1][e];
                return r(n ? n : e)
            }, l, l.exports, e, t, n, o)
        }
        return n[a].exports
    }
    for (var i = "function" == typeof require && require, a = 0; a < o.length; a++) r(o[a]);
    return r
}({
    1: [function(e, t, n) {
        "use strict";

        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n), o && e(t, o), t
            }
        }();
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("../libs/ToasterSingleton"),
            s = o(a),
            u = function() {
                function e() {
                    r(this, e);
                    var t = arguments.length <= 0 || void 0 === arguments[0] ? !0 : arguments[0];
                    t && this.registerServiceWorker()
                }
                return i(e, [{
                    key: "registerServiceWorker",
                    value: function() {
                        "serviceWorker" in navigator && navigator.serviceWorker.register("sw.js", {
                            scope: "./"
                        }).then(function(e) {
                            console.log("Service worker is registered.");
                            var t = !1;
                            e.active && (t = !0), e.onupdatefound = function(n) {
                                console.log("A new Service Worker version has been found..."), e.installing.onstatechange = function(e) {
                                    "installed" === this.state && (t ? s["default"].getToaster().toast("App updated. Restart for the new version.") : s["default"].getToaster().toast("App ready for offline use."))
                                }
                            }
                        })["catch"](function(e) {
                            console.log("Unable to register service worker.", e)
                        })
                    }
                }, {
                    key: "loadScript",
                    value: function(e) {
                        return new Promise(function(t, n) {
                            var o = document.createElement("script");
                            o.async = !0, o.src = e, o.onload = t, o.onerror = n, document.head.appendChild(o)
                        })
                    }
                }, {
                    key: "loadCSS",
                    value: function(e) {
                        return new Promise(function(t, n) {
                            var o = new XMLHttpRequest;
                            o.open("GET", e), o.responseType = "text", o.onload = function(e) {
                                if (200 === this.status) {
                                    var r = document.createElement("style");
                                    r.textContent = o.response, document.head.appendChild(r), t()
                                } else n()
                            }, o.send()
                        })
                    }
                }]), e
            }();
        n["default"] = u
    }, {
        "../libs/ToasterSingleton": 3
    }],
    2: [function(e, t, n) {
        "use strict";

        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var s = e("./Controller"),
            u = o(s),
            c = e("./../view/NavDrawerView"),
            l = o(c),
            f = function(e) {
                function t() {
                    r(this, t);
                    var e = i(this, Object.getPrototypeOf(t).call(this)),
                        n = new l["default"],
                        o = document.querySelector(".js-toggle-menu");
                    return o.addEventListener("click", function() {
                        n.toggle()
                    }), e
                }
                return a(t, e), t
            }(u["default"]);
        n["default"] = f
    }, {
        "./../view/NavDrawerView": 5,
        "./Controller": 1
    }],
    3: [function(e, t, n) {
        "use strict";

        function o(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n), o && e(t, o), t
            }
        }();
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {
                o(this, e)
            }
            return r(e, null, [{
                key: "getToaster",
                value: function() {
                    return "undefined" != typeof window.ToasterInstance_ ? window.ToasterInstance_ : (window.ToasterInstance_ = new a, window.ToasterInstance_)
                }
            }]), e
        }();
        n["default"] = i;
        var a = function() {
            function e() {
                o(this, e), this.view = document.querySelector(".js-toast-view"), this.hideTimeout = 0
            }
            return r(e, [{
                key: "toast",
                value: function(e) {
                    var t = this;
                    this.view.textContent = e, this.view.classList.add("toast-view--visible"), clearTimeout(this.hideTimeout), this.hideTimeout = setTimeout(function() {
                        t.hide()
                    }, 3e3)
                }
            }, {
                key: "hide",
                value: function() {
                    this.view.classList.remove("toast-view--visible")
                }
            }]), e
        }()
    }, {}],
    4: [function(e, t, n) {
        "use strict";

        function o(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = e("./controller/StaticPageController"),
            i = o(r);
        new i["default"]
    }, {
        "./controller/StaticPageController": 2
    }],
    5: [function(e, t, n) {
        "use strict";

        function o(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }
            return function(t, n, o) {
                return n && e(t.prototype, n), o && e(t, o), t
            }
        }();
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {
                var t = this;
                o(this, e), this.rootElement = document.querySelector(".js-side-nav"), this.sideNavContent = this.rootElement.querySelector(".js-side-nav-content");
                var n, r, i = function(e) {
                        n = e.touches[0].pageX
                    },
                    a = function(e) {
                        var o = e.touches[0].pageX;
                        r = Math.min(0, o - n), 0 > r && e.preventDefault(), t.sideNavContent.style.transform = "translateX(" + r + "px)"
                    },
                    s = function(e) {
                        -1 > r && t.closeSideNav()
                    };
                this.rootElement.addEventListener("click", function() {
                    t.close()
                }), this.sideNavContent.addEventListener("click", function(e) {
                    e.stopPropagation()
                }), this.sideNavContent.addEventListener("touchstart", i), this.sideNavContent.addEventListener("touchmove", a), this.sideNavContent.addEventListener("touchend", s)
            }
            return r(e, [{
                key: "isOpen",
                value: function() {
                    return this.rootElement.classList.contains("side-nav--visible")
                }
            }, {
                key: "toggle",
                value: function() {
                    this.isOpen() ? this.close() : this.open()
                }
            }, {
                key: "close",
                value: function() {
                    this.rootElement.classList.remove("side-nav--visible"), this.sideNavContent.classList.add("side-nav__content--animatable"), this.sideNavContent.style.transform = "translateX(-102%)"
                }
            }, {
                key: "open",
                value: function() {
                    var e = this;
                    this.rootElement.classList.add("side-nav--visible");
                    var t = function n(t) {
                        e.sideNavContent.tabIndex = 0, e.sideNavContent.focus(), e.sideNavContent.removeAttribute("tabIndex"), e.sideNavContent.classList.remove("side-nav__content--animatable"), e.sideNavContent.removeEventListener("transitionend", n)
                    };
                    this.sideNavContent.classList.add("side-nav__content--animatable"), this.sideNavContent.addEventListener("transitionend", t), requestAnimationFrame(function() {
                        e.sideNavContent.style.transform = "translateX(0px)"
                    })
                }
            }]), e
        }();
        n["default"] = i
    }, {}]
}, {}, [4]);