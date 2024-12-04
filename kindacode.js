// ==UserScript==
// @name         Custom Encoding System
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Custom encoding system with proper Space and Enter handling.
// @author       KindaBad
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ======== Custom Mappings ========
    // Use "K+key output" for each mapping
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
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("//"))
        .reduce((mappings, line) => {
            const [key, ...output] = line.split(" ");
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
            const regex = new RegExp(`${key}(\\s|$)`, "g");
            if (regex.test(currentValue)) {
                const replacedValue = currentValue.replace(regex, (_, trailingSpace) => {
                    return customMappings[key] + (trailingSpace || "");
                });
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

        if (isTypingElement(activeElement)) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault(); // Prevent default newline (Enter) or space handling
                setTimeout(() => replaceSequence(activeElement), 0); // Allow input to update first
            }
        }
    });
})();
