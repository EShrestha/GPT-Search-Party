var onboardingStarted = false;
// Function to set a cookie
function setCookie(name, value) {
  document.cookie = name + "=" + encodeURIComponent(value) + "; path=/"; // No expiration date for indefinite
}

// Function to get a cookie
function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

// Initialize the Intro.js tour
function startTour() {
  introJs()
    .setOptions({
      steps: [
        {
          intro:
            "Welcome to the SearchParty!<br/><br/>Let's take a quick tour. 🥳🎈",
        },
        {
          element: "#left-search",
          intro: "Search with your left engine here.",
        },
        {
          element: "#right-search",
          intro: "You guessed it,</br>right engine on this side!",
        },
        {
          element: "#left-right-search",
          intro:
            "These are the default engines.<br/></br>You can change them in the settings if you'd like 😃",
        },
        {
          element: ".settings-info",
          intro:
            "Speaking of...</br></br>Settings ⚙️<br/>and</br>information ℹ️</br></br> are down here.",
        },
        {
          element: "#settings-modal",
          intro:
            "Now, let's open up settings.<br/><br/>Go on, give ⚙️ a click!</br></br>I know you want to...",
        },
      ],
      tooltipClass: "centered-tooltip bold-tooltip", // Add a custom class for centering and bold text
      disableInteraction: true, // Disable interaction to make the tour unskippable
      showPrevButton: false, // Hide the previous button
      showNextButton: false, // Hide the next button
      exitOnOverlayClick: false, // Prevent exiting on overlay click
      exitOnEsc: false, // Prevent exiting with the escape key
      hidePrev: true, // Hide the previous button
    })
    .onbeforechange(function (targetElement) {
      const currentStep = this._currentStep; // Get the current step index

      if (currentStep === 0) {
        this.setOptions({
          nextLabel: "Let's Start!",
          skipLabel: "Skip Introduction",
        });
      }
      if (currentStep === 1) {
        this.setOptions({
          nextLabel: "Next",
          skipLabel: "Skip Introduction",
        });
      }
      if (currentStep === 3) {
        this.setOptions({
          nextLabel: "Got it!",
          skipLabel: "Skip Introduction",
        });
      }
      if (currentStep === 4) {
        this.setOptions({
          nextLabel: "Okay",
          skipLabel: "Skip Introduction",
        });
      }
      if (currentStep === 5) {
        this.setOptions({
          doneLabel: "Fine 🙄",
          skipLabel: "Skip Introduction",
        });
      }

      //   switch (currentStep) {
      //       case 0:
      //           this.setOptions({
      //               nextLabel: "Let's Start! 💪",
      //               skipLabel: "Skip Introduction",
      //           });
      //           break;
      //       case 1:
      //           this.setOptions({
      //             nextLabel: "Okay",
      //             skipLabel: "Okay",
      //           });
      //       default:
      //           this.setOptions({
      //             nextLabel: "Next",
      //             skipLabel: "Next",
      //           });
      //   }
    })
    .start();
}

// Initialize the modal tour
function startModalTour() {
  introJs()
    .setOptions({
      steps: [
        {
          intro: "See... I knew you wanted to 🤭",
        },
        {
          element: "#settings-modal-body",
          intro: "As you can see,<br/>this is the settings page.",
        },
        {
          element: "#engines-holder",
          intro:
            "Search engines are in here.<br/></br>You can click to expand and see the default or your custom ones.</br></br>*cough*</br>foreshadowing</br>*cough*</br>👀",
        },
        {
          intro:
            "Woah! Who did that?!</br></br>Are you using telekinesis?? 🤨</br></br>Well... since we're here let me take you through this section 🤷‍♂️ ",
        },
        {
          element: "#settings-modal-body",
          intro:
            "Here you can see all the engines you have.</br></br>You can switch to a different engine by clicking the radio button next to it.",
        },
        {
          element: ".shortcut-input",
          intro:
            "This is the shortcut for a particular engine.</br></br>Change it to your liking, BUT it MUST start with \";\"</br></br>You can use an engines shortcut to search with that engine even if it's not enabled!</br></br>Keep that in mind, I'll show you in a little bit!",
        },
        {
          element: ".query-input",
          intro:
            "This is the query url for a particular engine. The engine uses this to search.</br></br>I don't recommend changing the default ones.",
        },
        {
          element: "#custom-engines",
          intro:
            "Waaaaaay down here you can add a custom engine if you'd like!",
        },
        {
          element: "#resetToDefault",
          intro:
            "If you ever mess something up or want to delete all of you custom engines...</br></br>Press this shiny red button.",
        },
        {
          element: "#resetOnboarding",
          intro: "If you ever miss me, I'm just a click away 💖",
        },
        {
          intro:
            "Did you keep in mind what I said about the shortcut?</br></br>Let me show you 😊",
        },
        {
          element: "#left-search",
          intro:
            "Here you may have Google enabled, but what if you want to use youtube?</br></br>Well, follow me 🏃‍♀️‍➡️",
        },
        {
          element: "#left-search",
          intro:
            "You can simply do</br>[terms] [shortcut]</br>or</br>[shortcut] [terms]",
        },
        {
          element: "#left-right-search",
          intro:
            "For Example:</br></br>cute dogs ;yt</br>or</br>;yt cute dogs</br></br>;yt is currently set for YouTube</br>but you can use any shortcut.",
        },
        {
          element: "#right-search",
          intro: "Shortcuts work here too!",
        },
        {
          element: "#top-placeholder",
          intro:
            "👆👆👆👆👆👆</br>Even way up here in the address bar!!</br></br>Try it sometime 🙌",
          //intro: "<div style='position: fixed; top: 0; left: 50%; transform: translateX(-50%);'>⬆️ Even way up here in you browsers address bar!!</br>Try it sometime.</div>",
        },
        {
          intro:
            "Well this is the end 🥺</br></br>Tell your family, friends, pets, and strangers about SearchParty 😚</br></br>Happy searching!!!",
          //intro: "<div style='position: fixed; top: 0; left: 50%; transform: translateX(-50%);'>⬆️ Even way up here in you browsers address bar!!</br>Try it sometime.</div>",
        },
      ],
      tooltipClass: "centered-tooltip bold-tooltip introjs-closeButton", // Add a custom class for centering and bold text
      disableInteraction: true, // Disable interaction to make the modal tour unskippable
      showPrevButton: false, // Hide the previous button
      showNextButton: true, // Hide the next button
      exitOnOverlayClick: false, // Prevent exiting on overlay click
      exitOnEsc: false, // Prevent exiting with the escape key
      hidePrev: true, // Hide the previous button
      hideNext: false, // Hide the next button
      showCloseButton: false, // Hide the close button
      disableInteraction: true, // Ensure the modal cannot be closed
    })
    .onbeforechange(function (targetElement) {
      const currentStep = this._currentStep; // Get the current step index
      if (currentStep === 0) {
        this.setOptions({
          nextLabel: "Yeah, whatever 😪",
          skipLabel: "Skip Introduction",
        });
        onboardingStarted = false;
      }
      if (currentStep === 1) {
        this.setOptions({
          nextLabel: "Next",
          skipLabel: "Skip Introduction",
        });
      }

      if (currentStep === 3) {
        this.setOptions({
          nextLabel: "Fine",
          skipLabel: "Skip Introduction",
        });
      }
      if (currentStep === 4) {
        this.setOptions({
          nextLabel: "Next",
          skipLabel: "Skip Introduction",
        });
      }
    })
    .onchange(function (targetElement) {
      const currentStep = this._currentStep;
      if (currentStep === 3) {
        const leftEngineExpand = document.querySelector("#leftExpand");
        if (leftEngineExpand) {
          leftEngineExpand.click();
        }
      }
      if (currentStep === 10) {
        const exitModal = document.querySelector("#settingsModal");
        if (exitModal) {
          exitModal.click();
        }
      }

      if (currentStep === 12) {
        const leftInput = document.querySelector("#left-search");
        const rightInput = document.querySelector("#right-search");
        leftInput.value = "cute dogs ;yt";
        rightInput.value = ";yt cute dogs";
      }
      if (currentStep === 16) {
        setCookie("onboarded", "true");
        chrome.storage.sync.set({ onboarded: true });
      }
    })
    .start();
}

// Add CSS for centered tooltip and bold text
const style = document.createElement("style");
style.innerHTML = `
  .centered-tooltip {
    text-align: center;
  }
  .bold-tooltip {
    font-size: 1.2rem; /* Increase font size */
    font-weight: bold; /* Make text bold */
  }
.introjs-skipbutton{
  display: none !important;
}

`;
document.head.appendChild(style);

// Start the tour when the page loads
window.onload = function () {
  const onboardedCookie = getCookie("onboarded");
  checkOnboardedAndStartTour(onboardedCookie, startTour);
};

function checkOnboardedAndStartTour(onboardedCookie, tourFunction) {
  if (onboardedCookie === "true") {
    // Cookie is true, do nothing
    return;
  } else {
    // Check Chrome storage sync
    chrome.storage.sync.get("onboarded", function (data) {
      if (data.onboarded === true) {
        // Set cookie to true if onboarded in Chrome storage
        setCookie("onboarded", "true");
      } else {
        onboardingStarted = true;
        // Start the specified tour if not onboarded
        tourFunction();
        // Listen for the modal open event
        $("#settingsModal").on("shown.bs.modal", function () {
          if (onboardingStarted) {
            startModalTour();
          }
        });
        // Set both cookie and Chrome storage to true at the end
        // setCookie("onboarded", "true");
        // chrome.storage.sync.set({ onboarded: true });
      }
    });
  }
}
