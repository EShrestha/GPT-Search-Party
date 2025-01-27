let P = [];
let O = false;
let searchPartyUrl = `chrome-extension://${chrome.runtime.id}/searchparty.html`;

// Handle fetch events
self.addEventListener("fetch", function (t) {
  var e = t.request.url;
  e.startsWith(location.origin + "/searchparty.html") &&
    !e.match("focus") &&
    ((O = true),
    setTimeout(function () {
      O = false;
    }, 50));
});

// Helper functions
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

// Handle tab creation logic
chrome.tabs.onCreated.addListener(function (t) {
  O &&
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
              url: `${searchPartyUrl}?focus=true`,
              active: true,
            },
            function (e) {
              P.unshift(e.id);
              P.splice(100);
              chrome.tabs.remove(t.id);
              chrome.tabs.update(e.id, { url: "chrome://newtab/" });
            }
          );
    })(t);
  O = false;
});

// Handle query modification
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    const queryParams = new URLSearchParams(url.search);
    const rawQuery = queryParams.get("q");
    console.log("queryParams", queryParams);
    console.log("rawQuery", rawQuery);


    if (!rawQuery) {
      console.log("rawQuery is null")
      return;
    }

    const regex = /^(?:([^;]+)\s)?(;[^\s]+)(?:\s(.+))?|(;[^\s]+)\s(.+)$/;
    const match = rawQuery.match(regex);
    console.log("match:", match);

    if (match) {
      const command = match[2];
      const query = match[1] || match[3];
      console.log("Command", command);
      console.log("Query", query);

      if (!(command && query)) {
        return;
      }

      const { searchEngines } = await chrome.storage.sync.get([
        "searchEngines",
      ]);
      const engine = searchEngines.find(
        (engine) => engine.shortcut === command
      );

      if (engine) {
        console.log("ENGINE FOUND");
        console.log("Engine ID", engine.id);
        if (engine.id === 0) {
          console.log("DEFAULT");
          chrome.search.query({
            text: query,
            disposition: "CURRENT_TAB",
          });
        } else {
          chrome.tabs.update(tabId, {
            url: engine.url + encodeURIComponent(query),
          });
        }
      } else {
        console.log("ENGINE NOT FOUND");
        return;
      }
    } else {
      console.log("inElse:rawQuery:", rawQuery);
      chrome.search.query({
        text: rawQuery,
        disposition: "CURRENT_TAB",
      });
      return;
    }
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "chrome://newtab/" }, (tab) => {});
});

// Open searchparty.html when a new window is created
chrome.windows.onCreated.addListener((window) => {
  if (window.type === "normal") {
    chrome.tabs.query({ windowId: window.id }, (tabs) => {
      if (tabs.length === 1 && tabs[0].url === "chrome://newtab/") {
        chrome.tabs.update(tabs[0].id, { url: searchPartyUrl });
      }
    });
  }
});

// Handle Chrome startup
chrome.runtime.onStartup.addListener(() => {
  chrome.windows.getAll({ populate: true }, (windows) => {
    if (windows.length === 0) {
      // If no windows are open, create one with the custom page
      chrome.windows.create({ url: searchPartyUrl });
    } else {
      const alreadyOpen = windows.some((win) =>
        win.tabs.some((tab) => tab.url === searchPartyUrl)
      );

      if (!alreadyOpen) {
        chrome.tabs.create({ url: searchPartyUrl });
      }
    }
  });
});
("");

// Prevent multiple searchparty.html tabs
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url === searchPartyUrl) {
    chrome.tabs.query({ url: searchPartyUrl }, (tabs) => {
      if (tabs.length > 1) {
        chrome.tabs.remove(tab.id);
      }
    });
  }
});
