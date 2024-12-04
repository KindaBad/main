// ==UserScript==
// @name         Custom Encoding System
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Custom encoding system like unicode
// @author       KindaBad
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ======== Custom Mappings ========
    // Just add "K+key output" on each line (no parentheses, no commas, no indentation)
    const mappingText = `
K+0 ﷺ
K+-1 �
K+inf ∞
K+pi π
K+sqrt √
K+skull 💀
    `;

    // ======== Parse Mappings ========
    const customMappings = mappingText
        .split("\n") // Split by line
        .map((line) => line.trim()) // Trim whitespace
        .filter((line) => line && !line.startsWith("//")) // Ignore empty lines and comments
        .reduce((mappings, line) => {
            const [key, ...output] = line.split(" "); // Split into key and output
            if (key && output.length) mappings[key] = output.join(" ");
            return mappings;
        }, {});

    // ======== Helper Functions ========

    /**
     * Checks if the active element is a typing field (textarea, input, contenteditable).
     * @param {HTMLElement} element - The currently active DOM element.
     * @returns {boolean} - True if the element is a typing field.
     */
    function isTypingElement(element) {
        return (
            element.tagName === "TEXTAREA" ||
            element.tagName === "INPUT" ||
            element.isContentEditable
        );
    }

    /**
     * Replaces matching sequences in the active typing field with their corresponding values.
     * @param {HTMLElement} activeElement - The currently active DOM element.
     */
    function replaceSequence(activeElement) {
        const currentValue =
            activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA"
                ? activeElement.value
                : activeElement.textContent;

        Object.keys(customMappings).forEach((key) => {
            const regex = new RegExp(`\\b${key}\\b`, "g"); // Match whole word
            if (regex.test(currentValue)) {
                const replacedValue = currentValue.replace(regex, customMappings[key]);
                if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                    activeElement.value = replacedValue;
                } else if (activeElement.isContentEditable) {
                    activeElement.textContent = replacedValue;
                }
            }
        });
    }

    // ======== Main Listeners ========

    /**
     * Listens for Space or Enter and triggers replacement.
     */
    document.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;

        if (isTypingElement(activeElement) && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            replaceSequence(activeElement);
        }
    });
})();
