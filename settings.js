const addEngineName = document.getElementById("addEngineName");
const addEngineShortcut = document.getElementById("addEngineShortcut");
const addEngineURL = document.getElementById("addEngineURL");
const addToLeft = document.getElementById("addToLeft");
const addToRight = document.getElementById("addToRight");
const resetToDefault = document.getElementById("resetToDefault");

function updateEnabledStatus(radio, side) {
  // Hide all enabled status indicators for the given side
  document.querySelectorAll(`.${side}-enabled`).forEach((span) => {
    span.style.display = "none";
  });

  // Show the enabled status for the selected radio
  const selectedRow = radio.closest(".engine-row");
  const enabledSpan = selectedRow.querySelector(`.${side}-enabled`);
  enabledSpan.style.display = "inline";

  const searchEngineItem = radio.closest(".search-engine-item");
  const engineId = searchEngineItem.id;

  updateEngineIsEnabled(engineId, side === "left" ? 0 : 1);
}

async function updateEngineShortcut(input) {
  const searchEngineItem = input.closest(".search-engine-item");
  const engineId = searchEngineItem.id;
  const newShortcut = input.value;

  // Find the engine in the searchEngines array and update its shortcut
  const engineToUpdate = searchEngines.find((engine) => engine.id == engineId);
  if (engineToUpdate) {
    engineToUpdate.shortcut = newShortcut;
    await saveEnginesToStorage();
    updatePageEngines();
  }
}

const updateEngineIsEnabled = async (engineId, position) => {
  searchEngines.forEach((engine) => {
    if (engine.id == engineId) {
      engine.isEnabled = true;
      if (engine.isDisgusting) {
        showToast(
          0,
          '<img src="https://c.tenor.com/FCiTPRPl8VIAAAAd/tenor.gif" alt="Disgusting Engine" style="width: 100%;"/>',
          12000
        );
      }
    } else if (engine.position === position) {
      engine.isEnabled = false;
    }
  });

  await saveEnginesToStorage();
  updatePageEngines();
};

// Update the delete button visibility based on isCustom attribute
document.querySelectorAll(".search-engine-item").forEach((item) => {
  const isCustom = item.querySelector('input[type="text"][isCustom="true"]');
  const deleteButton = item.querySelector("button");

  if (isCustom) {
    deleteButton.style.display = "inline"; // Show delete button if isCustom is true
  }
});

async function deleteCustomSearch(button) {
  const searchEngineItem = button.closest(".search-engine-item");
  const idToRemove = searchEngineItem.id;

  // Check if the engine to remove is currently enabled
  const engineToRemove = searchEngines.find(
    (engine) => engine.id == idToRemove
  );
  const wasEnabled = engineToRemove && engineToRemove.isEnabled;

  searchEngines = searchEngines.filter((engine) => engine.id != idToRemove);
  console.log("Deleted search engine ID:", idToRemove);
  console.log("AFTER DELETE:", searchEngines);

  // If the removed engine was enabled, enable the first engine in the same position
  if (wasEnabled) {
    const firstEngineInPosition = searchEngines.find(
      (engine) => engine.position === engineToRemove.position
    );
    if (firstEngineInPosition) {
      firstEngineInPosition.isEnabled = true; // Enable the first engine in the same position
    }
  }

  await saveEnginesToStorage();
  const engineName = engineToRemove ? engineToRemove.name : "the engine"; // Get the name of the removed engine
  showToast(0, `Successfully removed ${engineName}`); // Show toast notification
}

function populateEnginesInSettings(engines, engineToFocus, shortcutOrQuery) {
  refreshSettingsEngines();
  console.log("HERE:", engines);
  const leftSection = document.querySelector(".left-engines"); // Left Search Engines section
  const rightSection = document.querySelector(".right-engines"); // Right Search Engines section

  engines.forEach((engine) => {
    console.log("LOOKING AT ENGINE IN POP:", engine);
    // Create the search engine item structure
    const searchEngineItem = document.createElement("div");
    searchEngineItem.id = engine.id;
    searchEngineItem.className = "search-engine-item";

    const engineRow = document.createElement("div");
    engineRow.className = "engine-row";

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = engine.position === 0 ? "left-engine" : "right-engine";
    radioInput.id = engine.name.toLowerCase().replace(/\s+/g, "-");
    radioInput.checked = engine.isEnabled;
    radioInput.onchange = function () {
      updateEnabledStatus(radioInput, engine.position === 0 ? "left" : "right");
    };

    const label = document.createElement("label");
    label.setAttribute("for", radioInput.id);
    label.textContent = engine.name;

    const shortcutInput = document.createElement("input");
    shortcutInput.className = "setting-input shortcut-input";
    shortcutInput.type = "text";
    shortcutInput.value = engine.shortcut;
    shortcutInput.size = 5;

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-danger delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.style.display = engine.isCustom ? "inline" : "none"; // Show if isCustom
    deleteButton.onclick = function () {
      deleteCustomSearch(this);
    };

    const enabledStatus = document.createElement("span");
    enabledStatus.style.color = "green";
    enabledStatus.textContent = "Enabled";
    enabledStatus.style.display = engine.isEnabled ? "inline" : "none";
    enabledStatus.className = `enabled-status ${
      engine.position === 0 ? "left-enabled" : "right-enabled"
    }`;

    const queryInput = document.createElement("input");
    queryInput.className = "setting-input query-input";
    queryInput.type = "text";
    queryInput.value = engine.url;
    queryInput.style.width = "100%";
    queryInput.isCustom = "true";

    // Append elements to the engine row
    engineRow.appendChild(radioInput);
    engineRow.appendChild(label);
    engineRow.appendChild(shortcutInput);
    engineRow.appendChild(deleteButton);
    engineRow.appendChild(enabledStatus);

    // Append the engine row to the search engine item
    searchEngineItem.appendChild(engineRow);
    searchEngineItem.appendChild(queryInput);

    // Append the search engine item to the appropriate section
    if (engine.position === 0) {
      leftSection.appendChild(searchEngineItem);
    } else if (engine.position === 1) {
      rightSection.appendChild(searchEngineItem);
    }
  });

  if (engineToFocus) {
    if (shortcutOrQuery == 0) {
      console.log("LOOKING FOR:", engineToFocus);
      document
        .getElementById(engineToFocus)
        .querySelector(".shortcut-input")
        .focus();
    } else if (shortcutOrQuery == 1) {
      document
        .getElementById(engineToFocus)
        .querySelector(".query-input")
        .focus();
    }
  }

  document.querySelectorAll(".shortcut-input").forEach((input) => {
    console.log("Changing shortcut:", input);
    input.addEventListener("input", async () => {
      console.log("input received");
      const engineId = input.closest(".search-engine-item").id;
      if (input.value.trim() == "" || !input.value.trim().startsWith(";")) {
        showToast(1, "Shortcut has to start with ;", 6000);
        input.value = searchEngines.find(
          (engine) => engine.id == engineId
        ).shortcut;
      } else {
        if (input.value.length < 2) {
          showToast(
            1,
            "Shortcut must have at least one character after the ;",
            6000
          );
          return;
        }
        const engineToUpdate = searchEngines.find(
          (engine) => engine.id == engineId
        );
        if (engineToUpdate) {
          engineToUpdate.shortcut = input.value; // Change the shortcut to input.value
        }
        await saveEnginesToStorage(engineId, 0);
      }
    });
  });

  document.querySelectorAll(".query-input").forEach((input) => {
    input.addEventListener("input", async () => {
      const engineId = input.closest(".search-engine-item").id;
      if (input.value.trim() == "" || input.value.trim().length < 5) {
        showToast(1, "Query url is looking a little fishy", 6000);

        return;
      } else {
        
        const engineToUpdate = searchEngines.find(
          (engine) => engine.id == engineId
        );
        if (engineToUpdate) {
          engineToUpdate.url = input.value; // Change the query to input.value
        }
        await saveEnginesToStorage(engineId, 1); // Pass 1 for query
      }
    });
  });
}

const addCustomEngine = async (position) => {
  let engine = {
    id: Math.floor(Math.random() * 10000), // Generates a random numerical id
    name: addEngineName.value.trim(),
    url: addEngineURL.value.trim(),
    shortcut: addEngineShortcut.value.trim(),
    position: position,
    isCustom: true,
    isEnabled: false,
  };

  if (
    !addEngineName.value.trim() ||
    !addEngineURL.value.trim() ||
    !addEngineShortcut.value.trim()
  ) {
    showToast(1, "Please fill in all the fields.", 3000);
    return;
  }

  // Check if shortcut starts with ';' and is at least 2 characters long
  if (!engine.shortcut.startsWith(";") || engine.shortcut.length < 2) {
    showToast(1, "Shortcut must start with ';' and have at least one character after it.", 6000);
    return;
  }

  // Check if URL is at least 5 characters long
  if (engine.url.length < 5) {
    showToast(1, "Query URL is looking a little fishy.", 3000);
    return;
  }

  // Check if an engine with the same name, shortcut, or URL exists
  if (
    searchEngines.some((existingEngine) => existingEngine.name == engine.name)
  ) {
    showToast(1, "An engine with this name already exists.", 3000);
    return;
  } else if (
    searchEngines.some(
      (existingEngine) => existingEngine.shortcut == engine.shortcut
    )
  ) {
    showToast(1, "An engine with this shortcut already exists.", 3000);
    return;
  } else if (
    searchEngines.some((existingEngine) => existingEngine.url == engine.url)
  ) {
    showToast(1, "An engine with this URL already exists.", 3000);
    return;
  } else {
    searchEngines.push(engine); // add engine to inmem array
    await saveEnginesToStorage();
    showToast(0, "Added new engine!", 3000);
    addEngineName.value = "";
    addEngineURL.value = "";
    addEngineShortcut.value = "";
  }
};

const addShortcutChangeHandler = async () => {
  // Add change event listeners to all shortcut inputs
};

const addQueryChangeHandler = () => {
  // Add change event listeners to all shortcut inputs
};

const refreshSettingsEngines = () => {
  const items = document.querySelectorAll(".search-engine-item");
  items.forEach((item) => item.remove());
};

addToLeft.onclick = () => addCustomEngine(0);
addToRight.onclick = () => addCustomEngine(1);
resetToDefault.onclick = () => resetToDefaultSettings();
