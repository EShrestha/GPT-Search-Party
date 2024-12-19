const title = document.getElementById("title");
const leftSearchInput = document.getElementById("left-search");
const rightSearchInput = document.getElementById("right-search");

var termToSearch = "";

//////// DEFAULT ITEMS ////////
const defaultEngines = [
  {
    id: 1000,
    name: "Google",
    url: "https://www.google.com/search?q=",
    shortcut: ";g",
    position: 0,
    isCustom: false,
    isEnabled: true,
  },
  {
    id: 1001,
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    shortcut: ";bin",
    position: 0,
    isCustom: false,
    isEnabled: false,
    isDisgusting: true,
  },
  {
    id: 1002,
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
    shortcut: ";yah",
    position: 0,
    isCustom: false,
    isEnabled: false,
    isDisgusting: true,
  },
  {
    id: 1003,
    name: "Duck Duck Go",
    url: "https://duckduckgo.com/?q=",
    shortcut: ";ddg",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1004,
    name: "Yandex",
    url: "https://yandex.com/search/?text=",
    shortcut: ";yan",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1005,
    name: "ChatGPT",
    url: "https://chat.openai.com/?q=",
    shortcut: ";gpt",
    position: 1,
    isCustom: false,
    isEnabled: true,
  },
  {
    id: 1006,
    name: "Claude.ai",
    url: "https://claude.ai/new?q=",
    shortcut: ";cl",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1007,
    name: "Copilot",
    url: "https://www.bing.com/search?showconv=1&sendquery=0&q=",
    shortcut: ";co",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1008,
    name: "Mistral.ai",
    url: "https://chat.mistral.ai/chat?q=",
    shortcut: ";mis",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1009,
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    shortcut: ";yt",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1010,
    name: "Reddit",
    url: "https://www.reddit.com/search?q=",
    shortcut: ";it",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1011,
    name: "Twitch",
    url: "https://www.twitch.tv/search?term=",
    shortcut: ";tw",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1012,
    name: "Google Maps",
    url: "http://maps.google.com/?q=",
    shortcut: ";gm",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
];

const changingTitles = [
  "🫵😈",
  "🔍🎉",
  "💡🤔",
  "🛠️⚙️",
  "💔🩹",
  "🛌💤",
  "⏰💣",
  "👩‍💻☕📚 ",
  "🛒💳🎁",
  "🎈🎂🎉",
  "📆🕰️🗓️",
  "🎧🎤🎶💃",
  "🔑🚪🕵️‍♂️🧩",
  "🕹️🎮👾💥",
  "🍷🍝🕯️🎻",
  "🛌🕰️☕💻📑",
  "🍳🥓🍞☕🍊",
  "👩‍🚀🪐🚀🔭🌌",
  "🚶‍♂️🌳🏞️⛺🔥",
];

const setRandomTitle = () => {
  const randomIndex = Math.floor(Math.random() * changingTitles.length);
  title.innerHTML = changingTitles[randomIndex];
};

setTimeout(() => {
  setRandomTitle();
  setInterval(setRandomTitle, 5000); // Change title every 5 seconds
}, 15000); // Initial change after 15 seconds

var searchEngines = [...defaultEngines];

var currentLeftSearch = searchEngines[0];
var currentRightSearch = searchEngines[1];

// Get any custom search engines from the storage
const getEnginesFromStorage = async () => {
  await chrome.storage.sync.get(["searchEngines"], (value) => {
    searchEngines = value.searchEngines || searchEngines;
    updatePageEngines();
    populateEnginesInSettings(searchEngines);
    addShortcutChangeHandler();
    addQueryChangeHandler();
  });
};

// Function to save search engines to storage
const saveEnginesToStorage = async (engineToFocus, shortcutOrQuery) => {
  await chrome.storage.sync.set({ searchEngines: searchEngines }, () => {
    populateEnginesInSettings(searchEngines, engineToFocus, shortcutOrQuery);
  });
};

const resetToDefaultSettings = async () => {
  await chrome.storage.sync.clear(); // Clear all data in chrome storage
  searchEngines = [...defaultEngines]; // Reset searchEngines to default
  saveEnginesToStorage();
  updatePageEngines(); // Update the page with default engines
  populateEnginesInSettings(searchEngines); // Populate settings with default engines
  showToast(0, `All Settings Reset`); // Show toast notification
  window.location.href = "searchparty.html";
};

const getPageReady = async () => {
  await getEnginesFromStorage();
};

const updatePageEngines = () => {
  searchEngines.forEach((engine) => {
    if (engine.isEnabled) {
      if (engine.position === 0) {
        currentLeftSearch = engine;
        updatePlaceholderText(0, "Search with " + engine.name);
        console.log("LEFT", currentLeftSearch);
      } else {
        currentRightSearch = engine;
        updatePlaceholderText(1, "Search with " + engine.name);
        console.log("RIGHT", currentRightSearch);
      }
    }
  });
  console.log("updatePageEngines", searchEngines);
};

// Handles the tab switch between the two search inputs
function handleTabSwitch(
  fromInput,
  toInput,
  toDefaultPlaceholder,
  placeholderText
) {
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
};

const getSearchInputs = () => {
  return [leftSearchInput, rightSearchInput];
};

const getSearchUrls = () => {
  return [currentLeftSearch.url, currentRightSearch.url];
};

const getOppositeInputs = () => {
  return [rightSearchInput, leftSearchInput];
};

const showToast = (type, msg, duration = 3000) => {
  // Create a toast element
  const toast = document.createElement("div");
  toast.className = `toast`; // Add the type class for styling
  toast.style.position = "fixed";
  toast.style.bottom = "-100px"; // Start off-screen
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.zIndex = "1050"; // Bootstrap toast z-index
  toast.style.fontSize = "1.5rem"; // Increase font size for better readability
  toast.style.backgroundColor = "rgba(30, 30, 30, 0.9)"; // Set background color to a lighter dark theme
  toast.style.padding = "15px 25px"; // Increase padding for better spacing
  toast.style.borderRadius = "20px"; // Increase border radius for a more modern and roundish look
  toast.style.transition = "bottom 0.5s ease"; // Add transition for sliding effect
  toast.style.textAlign = "center"; // Center the toast text horizontally
  toast.style.maxWidth = "100%";

  const toastBody = document.createElement("div");
  toastBody.className = "toast-body";

  if (type === 0) {
    toastBody.style.color = "green"; // Set text color to green for success
  } else if (type === 1) {
    toastBody.style.color = "red"; // Set text color to red for danger
  } else {
    toastBody.style.color = "white"; // Set text color to white for other types
  }

  toastBody.innerHTML = msg;
  toast.appendChild(toastBody);

  // Append the toast to the body
  document.body.appendChild(toast);

  // Show the toast by sliding it up
  setTimeout(() => {
    toast.style.bottom = "20px"; // Slide up to visible position
  }, 10); // Small delay to allow the toast to be added to the DOM

  // Remove the toast after the specified duration
  setTimeout(() => {
    toast.style.bottom = "-100px"; // Slide down to off-screen
    setTimeout(() => {
      toast.remove();
    }, 500); // Wait for the slide-down animation to complete
  }, duration);
};

// Example usage
// showToast('bg-success', 'This is a success message!', 3000); // 3 seconds
// showToast('bg-danger', 'This is an error message!', 3000); // 3 seconds

const customSearch = (searchUrl, searchTerm) => {
  const regex = /^(?:([^;]+)\s)?(;[^\s]+)(?:\s(.+))?|(;[^\s]+)\s(.+)$/;
  const match = searchTerm.match(regex);
  const defaultRedirect = () => window.location.href = searchUrl + encodeURIComponent(searchTerm);

  if (match) {
    const command = match[2];
    const query = match[1] || match[3];

    if (command && query) {
      console.log("Matched");
      console.log("Command:", command);
      console.log("Query:", query);

      const engine = searchEngines.find(engine => engine.shortcut === command);
      window.location.href = engine ? engine.url + encodeURIComponent(query) : defaultRedirect();
    } else {
      defaultRedirect();
    }
  } else {
    defaultRedirect();
  }
};

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  getPageReady();

  getSearchInputs().forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          // const url = getSearchUrls()[index] + encodeURIComponent(input.value);
          // window.location.href = url;
          customSearch(getSearchUrls()[index], input.value);
          break;
        case "Tab":
          event.preventDefault();
          handleTabSwitch(
            input,
            getOppositeInputs()[index],
            index === 0
              ? "Search with " + currentRightSearch.name
              : "Search with " + currentLeftSearch.name,
            index === 0
              ? "Searching with " + currentRightSearch.name + " ➡️"
              : "⬅️ Searching with " + currentLeftSearch.name
          );
          break;
        default:
          getOppositeInputs()[index].placeholder =
            index === 0
              ? "⬅️ Searching with " + currentLeftSearch.name
              : "Searching with " + currentRightSearch.name + " ➡️";
          getSearchInputs()[index].placeholder = "";

          break;
      }
    });
  });
});

document.querySelectorAll(".setting-heading").forEach((heading) => {
  heading.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent event bubbling
    const icon = this.querySelector(".collapse-icon");
    const isExpanded = this.getAttribute("aria-expanded") === "true";

    // Toggle the aria-expanded attribute
    this.setAttribute("aria-expanded", !isExpanded);

    // Toggle the collapse class
    const content = this.nextElementSibling; // Get the corresponding content div
    if (isExpanded) {
      content.classList.remove("show"); // Collapse the content
      icon.innerHTML = `⬇️ <span class="collapse-text">open</span>`; // Update icon text
    } else {
      content.classList.add("show"); // Expand the content
      icon.innerHTML = `⬆️ <span class="collapse-text">close</span>`; // Update icon text
    }
  });
});

// Add event listener to collapse-text spans
document.querySelectorAll(".collapse-text").forEach((collapseText) => {
  collapseText.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click from bubbling up to the heading
    const heading = this.closest(".setting-heading");
    heading.click(); // Trigger the click event on the heading
  });
});
