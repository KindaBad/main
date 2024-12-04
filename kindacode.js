// ==UserScript==
// @name         Custom Encoding System
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  A custom encoding system with delayed updates and GitHub hosting support.
// @author       YourName
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/your-username/custom-encoding-system/main/custom-encoding.user.js
// @downloadURL  https://raw.githubusercontent.com/your-username/custom-encoding-system/main/custom-encoding.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Custom mappings
    const customMappings = {
        "K+0": "ﷺ",
        "K+-1": "�",
        "K+inf": "∞",
        "K+pi": "π",
        "K+sqrt": "√",
        "K+01": "࿚",
        // Add more mappings here...
    };

    // Track whether Ctrl+Shift+K was pressed
    let listeningForKPlus = false;

    // Detect active typing fields
    function isTypingElement(element) {
        return (
            element.tagName === "TEXTAREA" ||
            element.tagName === "INPUT" ||
            element.isContentEditable
        );
    }

    // Add keypress listener for Ctrl + Shift + K
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "k") {
            event.preventDefault();
            listeningForKPlus = true;

            const activeElement = document.activeElement;

            if (isTypingElement(activeElement)) {
                if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                    const cursorPosition = activeElement.selectionStart;
                    const currentValue = activeElement.value;

                    // Insert "K+" at the cursor position
                    activeElement.value =
                        currentValue.slice(0, cursorPosition) +
                        "K+" +
                        currentValue.slice(cursorPosition);

                    activeElement.setSelectionRange(cursorPosition + 2, cursorPosition + 2); // Place cursor after "K+"
                } else if (activeElement.isContentEditable) {
                    document.execCommand("insertText", false, "K+");
                }
            }
        }
    });

    // Replace sequences only when Enter is pressed
    document.addEventListener("keydown", (event) => {
        if (listeningForKPlus && event.key === "Enter") {
            event.preventDefault();
            const activeElement = document.activeElement;

            if (isTypingElement(activeElement)) {
                const currentValue =
                    activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA"
                        ? activeElement.value
                        : activeElement.textContent;

                // Replace K+ sequences based on longest match
                const regex = new RegExp(
                    Object.keys(customMappings)
                        .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape special regex characters
                        .sort((a, b) => b.length - a.length) // Sort by length (longest first)
                        .join("|"),
                    "g"
                );

                const matches = currentValue.match(regex);

                if (matches) {
                    matches.forEach((match) => {
                        const replacement = customMappings[match];
                        if (replacement) {
                            if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                                activeElement.value = currentValue.replace(match, replacement);
                            } else if (activeElement.isContentEditable) {
                                activeElement.textContent = currentValue.replace(match, replacement);
                            }
                        }
                    });
                }
            }
        }
    });
})();
