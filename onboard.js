// Initialize the Intro.js tour
function startTour() {
  introJs()
    .setOptions({
      steps: [
        {
          intro:
            "Welcome to the Search Party!<br/><br/>Let's take a quick tour 😊",
        },
        {
          element: "#left-search",
          intro: "Search with your left engine here.",
        },
        {
          element: "#right-search",
          intro: "You guessed it, right engine on this side!",
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
          intro: "As you can see,<br/>this is the settings page",
        },
        {
          element: "#engines-holder",
          intro:
            "Search engines are in here.<br/></br>You can click to expand and see the default or your custom ones.</br></br>*cough*</br>foreshadowing</br>*cough*</br>👀",
        },
        {
          intro:
            "Woah! who did that?!</br></br>Are you using telekinesis?? 🤨</br></br>Well... since we're here let me take you through this section 🤷‍♂️ ",
        },
        {
          intro:
            "Here you can see the all the engines you have.</br></br>You can switch to a different engine by clicking the radio button next to the name.",
        },
        {
          element: ".shortcut-input",
          intro:
            "This is the shortcut for a particular engine</br></br>Change it to your liking, BUT it MUST start with \";\"</br></br>You can use an engines shortcut to search with that engine even if it's not enabled!</br></br>Keep that in mind, I'll show you in a little bit!",
        },
        {
          element: ".query-input",
          intro:
            "This the query url for a particular engine. It is what is used to search with that engine.</br></br>I don't recommend changing the default ones.",
        },
        {
          element: "#custom-engines",
          intro:
            "Waaaaaay down here you can add a custom engine if you'd like!",
        },
        {
          intro:
            "Did you keep in mind what I said about the shortcut?</br></br>Let me show you 😊",
        },
        {
          element: "#left-search",
          intro:
            "Here you have Google enabled, but what if you want to use youtube?</br></br>Well you can simply do [shortcut] [What you want to search]</br>or</br>[What you want to search] [shortcut]</br></br>For Example:</br>;yt cute dogs</br>or</br>cute dogs ;yt",
        },
        {
          element: "#right-search",
          intro: "Shortcuts work here too!",
        },
        {
          element: ".container",
          intro: "Shortcuts even work in your browsers address bar up here!!!",
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
      if (currentStep === 8) {
        const exitModal = document.querySelector("#settingsModal");
        if (exitModal) {
          exitModal.click();
        }
      }
    })
    .start();
}

// Start the tour when the page loads
window.onload = function () {
  startTour();
};

// Listen for the modal open event
$("#settingsModal").on("shown.bs.modal", function () {
  startModalTour();
});

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
