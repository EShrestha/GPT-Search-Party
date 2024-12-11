let P = [];


self.addEventListener("fetch", function (t) {
  var e = t.request.url;
  e.startsWith(location.origin + "/searchparty.html") &&
    !e.match("focus") &&
    ((O = !0),
    setTimeout(function () {
      O = !1;
    }, 50));
});

function l(t, e) {
  return new Promise(function (r) {
    return s("tabs")
      ? chrome.tabs.update(t, e, function () {
          return r(null);
        })
      : r(null);
  });
}

function o(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}

function d() {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
  if (s("storage"))
    return new Promise(function (e) {
      return chrome.storage.local.get(t, e);
    });
  var e = t || Object.keys(localStorage);
  return Promise.resolve(
    e.reduce(function (t, e) {
      return o(o({}, t), {}, i({}, e, u.a.getItem(e)));
    }, {})
  );
}

function s(t) {
  return function () {
    var e = this,
      r = arguments;
    return new Promise(function (n, o) {
      function i(t) {
        c(a, n, o, i, u, "next", t);
      }
      function u(t) {
        c(a, n, o, i, u, "throw", t);
      }
      var a = t.apply(e, r);
      i(void 0);
    });
  };
}

function c(t, e, r, n, o, i, u) {
  try {
    var a = t[i](u),
      c = a.value;
  } catch (t) {
    return void r(t);
  }
  a.done ? e(c) : Promise.resolve(c).then(n, o);
}


chrome.tabs.onCreated.addListener(function (t) {
  O &&
    (console.log("onCreated"),
    (function (t) {
      if (P.includes(t.id)) return null;
      s(function* () {
        if (void 0 === l) {
          var t,
            e = yield Object(d.f)(["search"]);
          l = null === (t = e.search) || void 0 === t ? void 0 : t.isAutofocus;
        }
      })(),
        l &&
          chrome.tabs.create(
            {
              url: "".concat(
                "chrome-extension://".concat(
                  chrome.runtime.id,
                  "/searchparty.html"
                ),
                "?focus=true"
              ),
              active: !0,
            },
            function (e) {
              P.unshift(e.id),
                P.splice(100),
                chrome.tabs.remove(t.id),
                chrome.tabs.update(e.id, {
                  url: "chrome://newtab/",
                });
            }
          );
    })(t));
  O = !1;
});

