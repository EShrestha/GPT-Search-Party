const defaultSearch = document.getElementById('default-search');
const customSearchInput = document.getElementById('custom-search');

var termToSearch = "";
var defaultSearchPrefix = "https://www.google.com/search?q=";
var customSearchPrefix = "https://chatgpt.com/?q="
var customSearchPostfix = "&hints=search&ref=ext";


// Handles the tab switch between the two search inputs
function handleTabSwitch(fromInput, toInput) {
    if (fromInput.value.trim() !== "") {
        toInput.value = fromInput.value;
        fromInput.value = "";
        toInput.focus();
    }
}

// Handles the enter key for the default search input
defaultSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        termToSearch = defaultSearch.value;
        window.location.href = defaultSearchPrefix + encodeURIComponent(termToSearch);
    }
});

// Handles the tab key for the default search input
defaultSearch.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        event.preventDefault();
        handleTabSwitch(defaultSearch, customSearchInput);
    }
});

// Handles the enter key for the custom search input
customSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        termToSearch = customSearchInput.value;
        window.location.href = customSearchPrefix + encodeURIComponent(termToSearch) + customSearchPostfix;
    }
    if (event.key === "Tab") {
        event.preventDefault();
        handleTabSwitch(customSearchInput, defaultSearch);
    }
});
