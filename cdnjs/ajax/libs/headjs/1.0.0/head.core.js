///#source 1 1 /src/1.0.0/core.js
/*! head.core - v1.0.2 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
(function(win, undefined) {
    "use strict";

    // gt, gte, lt, lte, eq breakpoints would have been more simple to write as ['gt','gte','lt','lte','eq']
    // but then we would have had to loop over the collection on each resize() event,
    // a simple object with a direct access to true/false is therefore much more efficient
    var doc   = win.document,
        nav   = win.navigator,
        loc   = win.location,
        html  = doc.documentElement,
        klass = [],
        conf  = {
            screens   : [240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920],
            screensCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": false },
            browsers  : [
                            { ie: { min: 6, max: 11 } }
                           //,{ chrome : { min: 8, max: 31 } }
                           //,{ ff     : { min: 3, max: 26 } }
                           //,{ ios    : { min: 3, max:  7 } }
                           //,{ android: { min: 2, max:  4 } }
                           //,{ webkit : { min: 9, max: 12 } }
                           //,{ opera  : { min: 9, max: 12 } }
            ],
            browserCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": true },
            html5     : true,
            page      : "-page",
            section   : "-section",
            head      : "head"
        };

    if (win.head_conf) {
        for (var item in win.head_conf) {
            if (win.head_conf[item] !== undefined) {
                conf[item] = win.head_conf[item];
            }
        }
    }

    function pushClass(name) {
        klass[klass.length] = name;
    }

    function removeClass(name) {
        // need to test for both space and no space
        // https://github.com/headjs/headjs/issues/270
        // https://github.com/headjs/headjs/issues/226
        var re = new RegExp(" ?\\b" + name + "\\b");
        html.className = html.className.replace(re, "");
    }

    function each(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    // API
    var api = win[conf.head] = function() {
        api.ready.apply(null, arguments);
    };

    api.feature = function(key, enabled, queue) {

        // internal: apply all classes
        if (!key) {
            html.className += " " + klass.join(" ");
            klass = [];

            return api;
        }

        if (Object.prototype.toString.call(enabled) === "[object Function]") {
            enabled = enabled.call();
        }

        pushClass((enabled ? "" : "no-") + key);
        api[key] = !!enabled;

        // apply class to HTML element
        if (!queue) {
            removeClass("no-" + key);
            removeClass(key);
            api.feature();
        }

        return api;
    };

    // no queue here, so we can remove any eventual pre-existing no-js class
    api.feature("js", true);

    // browser type & version
    var ua     = nav.userAgent.toLowerCase(),
        mobile = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(ua);

    // useful for enabling/disabling feature (we can consider a desktop navigator to have more cpu/gpu power)
    api.feature("mobile" , mobile , true);
    api.feature("desktop", !mobile, true);

    // http://www.zytrax.com/tech/web/browser_ids.htm
    // http://www.zytrax.com/tech/web/mobile_ids.html
    ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || // Chrome & Firefox
        /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile IOS
        /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile Webkit
        /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Safari & Opera
        /(msie) ([\w.]+)/.exec(ua) ||
        /(trident).+rv:(\w.)+/.exec(ua) || [];

    var browser = ua[1],
        version = parseFloat(ua[2]);

    switch (browser) {
    case "msie":
    case "trident":
        browser = "ie";
        version = doc.documentMode || version;
        break;
        
    case "firefox":
        browser = "ff";
        break;
        
    case "ipod":
    case "ipad":
    case "iphone":
        browser = "ios";
        break;
        
    case "webkit":
        browser = "safari";
        break;
    }

    // Browser vendor and version
    api.browser = {
        name: browser,
        version: version
    };
    api.browser[browser] = true;

    for (var i = 0, l = conf.browsers.length; i < l; i++) {
        for (var key in conf.browsers[i]) {
            if (browser === key) {
                pushClass(key);

                var min = conf.browsers[i][key].min;
                var max = conf.browsers[i][key].max;

                for (var v = min; v <= max; v++) {
                    if (version > v) {
                        if (conf.browserCss.gt) {
                            pushClass("gt-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    } else if (version < v) {
                        if (conf.browserCss.lt) {
                            pushClass("lt-" + key + v);
                        }

                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }
                    } else if (version === v) {
                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }

                        if (conf.browserCss.eq) {
                            pushClass("eq-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    }
                }
            } else {
                pushClass("no-" + key);
            }
        }
    }

    pushClass(browser);
    pushClass(browser + parseInt(version, 10));

    // IE lt9 specific
    if (conf.html5 && browser === "ie" && version < 9) {
        // HTML5 support : you still need to add html5 css initialization styles to your site
        // See: assets/html5.css
        each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(el) {
            doc.createElement(el);
        });
    }

    // CSS "router"
    each(loc.pathname.split("/"), function(el, i) {
        if (this.length > 2 && this[i + 1] !== undefined) {
            if (i) {
                pushClass(this.slice(i, i + 1).join("-").toLowerCase() + conf.section);
            }
        } else {
            // pageId
            var id = el || "index", index = id.indexOf(".");
            if (index > 0) {
                id = id.substring(0, index);
            }

            html.id = id.toLowerCase() + conf.page;

            // on root?
            if (!i) {
                pushClass("root" + conf.section);
            }
        }
    });

    // basic screen info
    api.screen = {
        height: win.screen.height,
        width : win.screen.width
    };

    // viewport resolutions: w-100, lt-480, lt-1024 ...
    function screenSize() {
        // remove earlier sizes
        html.className = html.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g, "");

        // Viewport width
        var iw = win.innerWidth || html.clientWidth,
            ow = win.outerWidth || win.screen.width;

        api.screen.innerWidth = iw;
        api.screen.outerWidth = ow;

        // for debugging purposes, not really useful for anything else
        pushClass("w-" + iw);

        each(conf.screens, function(width) {
            if (iw > width) {
                if (conf.screensCss.gt) {
                    pushClass("gt-" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            } else if (iw < width) {
                if (conf.screensCss.lt) {
                    pushClass("lt-" + width);
                }

                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }
            } else if (iw === width) {
                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }

                if (conf.screensCss.eq) {
                    pushClass("e-q" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            }
        });

        // Viewport height
        var ih = win.innerHeight || html.clientHeight,
            oh = win.outerHeight || win.screen.height;

        api.screen.innerHeight = ih;
        api.screen.outerHeight = oh;

        // no need for onChange event to detect this
        api.feature("portrait" , (ih > iw));
        api.feature("landscape", (ih < iw));
    }

    screenSize();

    // Throttle navigators from triggering too many resize events
    var resizeId = 0;

    function onResize() {
        win.clearTimeout(resizeId);
        resizeId = win.setTimeout(screenSize, 50);
    }

    // Manually attach, as to not overwrite existing handler
    if (win.addEventListener) {
        win.addEventListener("resize", onResize, false);

    } else {
        // IE8 and less
        win.attachEvent("onresize", onResize);
    }
}(window));
