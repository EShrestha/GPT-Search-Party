const addEngineName = document.getElementById("addEngineName");
const addEngineShortcut = document.getElementById("addEngineShortcut");
const addEngineURL = document.getElementById("addEngineURL");
const addToLeft = document.getElementById("addToLeft");
const addToRight = document.getElementById("addToRight");

function updateEnabledStatus(radio, side) {
    // Hide all enabled status indicators for the given side
    console.log("radio,side:", radio, side)
  document.querySelectorAll(`.${side}-enabled`).forEach((span) => {
    span.style.display = "none";
  });

  // Show the enabled status for the selected radio
  const selectedRow = radio.closest(".engine-row");
    const enabledSpan = selectedRow.querySelector(`.${side}-enabled`);
    console.log("selectedRow", selectedRow);
    console.log("enabledSpan", enabledSpan);
  enabledSpan.style.display = "inline";
}

// Update the delete button visibility based on isCustom attribute
document.querySelectorAll(".search-engine-item").forEach((item) => {
  const isCustom = item.querySelector('input[type="text"][isCustom="true"]');
  const deleteButton = item.querySelector("button");

  if (isCustom) {
    deleteButton.style.display = "inline"; // Show delete button if isCustom is true
  }
});

function deleteCustomSearch(button) {
    // Find the parent search engine item of the clicked button
    const searchEngineItem = button.closest('.search-engine-item');
    
    // Find the radio input within the search engine item
    const radioInput = searchEngineItem.querySelector('input[type="radio"]');
    
    // Get the ID of the radio input
    const radioId = radioInput ? radioInput.id : null;

    // Log the ID (or handle it as needed)
    console.log("Deleted search engine ID:", radioId);

    // Remove the search engine item from the DOM
    if (searchEngineItem) {
        searchEngineItem.remove();
    }
}

function populateEngines(engines) {
    console.log("HERE:", engines)
    const leftSection = document.querySelector(".left-engines"); // Left Search Engines section
    const rightSection = document.querySelector(".right-engines"); // Right Search Engines section



    engines.forEach(engine => {
        console.log("LOOKING AT ENGINE IN POP:", engine);
        // Create the search engine item structure
        const searchEngineItem = document.createElement('div');
        searchEngineItem.id = engine.id;
        searchEngineItem.className = "search-engine-item";

        const engineRow = document.createElement('div');
        engineRow.className = 'engine-row';

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = engine.position === 0 ? 'left-engine' : 'right-engine';
        radioInput.id = engine.name.toLowerCase().replace(/\s+/g, '-');
        radioInput.checked = engine.isEnabled;
        radioInput.onchange = function () {
          updateEnabledStatus(radioInput, engine.position === 0 ? "left" : "right");
        };

        const label = document.createElement('label');
        label.setAttribute('for', radioInput.id);
        label.textContent = engine.name;

        const shortcutInput = document.createElement('input');
        shortcutInput.className = 'setting-input shortcut-input';
        shortcutInput.type = 'text';
        shortcutInput.value = engine.shortcut;
        shortcutInput.size = 5;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-danger delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.style.display = engine.isCustom ? 'inline' : 'none'; // Show if isCustom
        deleteButton.onclick = function() { deleteCustomSearch(this); };

        const enabledStatus = document.createElement('span');
        enabledStatus.style.color = 'green';
        enabledStatus.textContent = "Enabled";
        enabledStatus.style.display = engine.isEnabled ? "inline" : "none";
        enabledStatus.className = `enabled-status ${engine.position === 0 ? "left-enabled" : "right-enabled"}`;


        const queryInput = document.createElement('input');
        queryInput.className = "setting-input";
        queryInput.type = "text";
        queryInput.value = engine.url;
        queryInput.style.width = "100%"
        queryInput.isCustom = "true"

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
}

const addCustomEngine = (position) => {
    let engine = {
      name: addEngineName.value,
      url: addEngineURL.value,
      shortcut: addEngineShortcut.value,
      position: position,
      isCustom: true,
      isEnabled: false,
    };

    console.log("Trying to add:", engine)
}
