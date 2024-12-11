const leftSearchInput = document.getElementById("left-search");
const rightSearchInput = document.getElementById("right-search");

var termToSearch = "";

//////// DEFAULT ITEMS ////////
var searchEngines = [
  {
    name: "Google",
    url: "https://www.google.com/search?q=",
    shortcut: "//g",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    shortcut: "//b",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
    shortcut: "//y",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    name: "Duck Duck Go",
    url: "https://duckduckgo.com/?q=",
    shortcut: "//d",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    name: "Yandex",
    url: "https://yandex.com/search/?text=",
    shortcut: "//ya",
    position: 0,
    isCustom: false,
    isEnabled: true,
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com/?q=",
    shortcut: "//gpt",
    position: 1,
    isCustom: false,
    isEnabled: true,
  },
];

var currentLeftSearch = searchEngines[0];
var currentRightSearch = searchEngines[1];

// Get any custom search engines from the storage
const getAndPushCustomSearchEngines = async () => {
    const customSearchEngines = await chrome.storage.local.get("searchEngines");
    searchEngines = customSearchEngines.Engines || searchEngines;
};

const getPageReady = async () => {
  getAndPushCustomSearchEngines();

    searchEngines.forEach((engine) => {
      console.log("LOOKING AT ENGINE:", engine)
    if (engine.isEnabled) {
      if (engine.position === 0) {
          currentLeftSearch = engine;
          updatePlaceholderText(0, "Search with " + engine.name)
          console.log("LEFT", currentLeftSearch)
      } else {
          currentRightSearch = engine;
            updatePlaceholderText(1, "Search with " + engine.name)

          console.log("RIGHT", currentRightSearch);
          
      }
    }
  });
};

// Handles the tab switch between the two search inputs
function handleTabSwitch(fromInput, toInput, toDefaultPlaceholder, placeholderText) {
    //fromInput.placeholder = placeholderText;
    
    if (fromInput.value.trim() === "") {
        toInput.placeholder = "";
        fromInput.placeholder = placeholderText;
        toInput.focus();
    } else {
        toInput.placeholder = toDefaultPlaceholder;
        fromInput.placeholder = placeholderText;
        toInput.value = fromInput.value;
        fromInput.value = "";
        toInput.focus();
    }
}

const updatePlaceholderText = (index, text) => {
    if (index === 0) {
        leftSearchInput.placeholder = text;
    } else {
        rightSearchInput.placeholder = text;
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  getPageReady();

  const searchInputs = [leftSearchInput, rightSearchInput];
  const searchUrls = [currentLeftSearch.url, currentRightSearch.url];
  const oppositeInputs = [rightSearchInput, leftSearchInput];

  searchInputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          const url = searchUrls[index] + encodeURIComponent(input.value);
          window.location.href = url;
          break;
        case "Tab":
          event.preventDefault();
          handleTabSwitch(
            input,
            oppositeInputs[index],
            index === 0
              ? "Search with " + currentRightSearch.name
              : "Search with " + currentLeftSearch.name,
            index === 0
              ? "Searching with " + currentRightSearch.name + " ➡️"
              : "⬅️ Searching with " + currentLeftSearch.name
          );
          break;
          default:
              oppositeInputs[index].placeholder =
                index === 0
                ? "⬅️ Searching with " + currentLeftSearch.name
                      : "Searching with " + currentRightSearch.name + " ➡️"
              searchInputs[index].placeholder = ""

          break;
        }
        
    });
  });
});
