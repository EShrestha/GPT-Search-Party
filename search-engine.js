const leftSearchInput = document.getElementById("left-search");
const rightSearchInput = document.getElementById("right-search");

var termToSearch = "";

//////// DEFAULT ITEMS ////////
var searchEngines = [
  {
    id: 1000,
    name: "Google",
    url: "https://www.google.com/search?q=",
    shortcut: "//g",
    position: 0,
    isCustom: false,
    isEnabled: true,
  },
  {
    id: 1001,
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    shortcut: "//bin",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1002,
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
    shortcut: "//yah",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1003,
    name: "Duck Duck Go",
    url: "https://duckduckgo.com/?q=",
    shortcut: "//ddg",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1004,
    name: "Yandex",
    url: "https://yandex.com/search/?text=",
    shortcut: "//yan",
    position: 0,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1005,
    name: "ChatGPT",
    url: "https://chat.openai.com/?q=",
    shortcut: "//gpt",
    position: 1,
    isCustom: false,
    isEnabled: true,
  },
  {
    id: 1006,
    name: "Claude.ai",
    url: "https://claude.ai/new?q=",
    shortcut: "//cl",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1007,
    name: "Copilot",
    url: "https://www.bing.com/search?showconv=1&sendquery=0&q=",
    shortcut: "//co",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1008,
    name: "Mistral.ai",
    url: "https://chat.mistral.ai/chat?q=",
    shortcut: "//mis",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1009,
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    shortcut: "//yt",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
  {
    id: 1010,
    name: "Google Maps",
    url: "http://maps.google.com/?q=",
    shortcut: "//gm",
    position: 1,
    isCustom: false,
    isEnabled: false,
  },
];

var currentLeftSearch = searchEngines[0];
var currentRightSearch = searchEngines[1];

// Get any custom search engines from the storage
const getEnginesFromStorage = async () => {
  await chrome.storage.local.get(["searchEngines"], (value) => {
      searchEngines = value.searchEngines || searchEngines;
      updatePageEngines();
      populateEnginesInSettings(searchEngines);
    });
};

// Function to save search engines to storage
const saveEnginesToStorage = async () => {
  await chrome.storage.local.set({ "searchEngines": searchEngines }, () => {
    populateEnginesInSettings(searchEngines)

  });
  
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
}

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

const getSearchInputs = () => {
  return [leftSearchInput, rightSearchInput];
}

const getSearchUrls = () => {
  return [currentLeftSearch.url, currentRightSearch.url]
}

const getOppositeInputs = () => {
  return [rightSearchInput, leftSearchInput];
}

const showToast = (type, msg, duration) => {
    // Create a toast element
    const toast = document.createElement('div');
    toast.className = `toast`; // Add the type class for styling
    toast.style.position = 'fixed';
    toast.style.bottom = '-100px'; // Start off-screen
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '1050'; // Bootstrap toast z-index
    toast.style.fontSize = '1.5rem'; // Increase font size for better readability
    toast.style.backgroundColor = 'rgba(30, 30, 30, 0.9)'; // Set background color to a lighter dark theme
    toast.style.padding = '15px 25px'; // Increase padding for better spacing
    toast.style.borderRadius = '20px'; // Increase border radius for a more modern and roundish look
    toast.style.transition = 'bottom 0.5s ease'; // Add transition for sliding effect
  toast.style.textAlign = 'center'; // Center the toast text horizontally
  toast.style.maxWidth = "100%";

    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';

    if (type === 0) {
        toastBody.style.color = 'green'; // Set text color to green for success
    } else if (type === 1) {
        toastBody.style.color = 'red'; // Set text color to red for danger
    } else {
        toastBody.style.color = 'white'; // Set text color to white for other types
    }

    toastBody.textContent = msg;
    toast.appendChild(toastBody);

    // Append the toast to the body
    document.body.appendChild(toast);

    // Show the toast by sliding it up
    setTimeout(() => {
        toast.style.bottom = '20px'; // Slide up to visible position
    }, 10); // Small delay to allow the toast to be added to the DOM

    // Remove the toast after the specified duration
    setTimeout(() => {
        toast.style.bottom = '-100px'; // Slide down to off-screen
        setTimeout(() => {
            toast.remove();
        }, 500); // Wait for the slide-down animation to complete
    }, duration);
};

// Example usage
// showToast('bg-success', 'This is a success message!', 3000); // 3 seconds
// showToast('bg-danger', 'This is an error message!', 3000); // 3 seconds

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  getPageReady();

  getSearchInputs().forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          const url = getSearchUrls()[index] + encodeURIComponent(input.value);
          window.location.href = url; 
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
                      : "Searching with " + currentRightSearch.name + " ➡️"
              getSearchInputs()[index].placeholder = ""

          break;
        }
        
    });
  });
});
