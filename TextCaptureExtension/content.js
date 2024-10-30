let typingTimeout;

function saveTypedText(url, newText) {
  const date = new Date().toISOString();

  chrome.storage.local.get({ typedData: [] }, (data) => {
    let typedData = data.typedData;

    // Find or create an entry for this URL
    let existingEntryIndex = typedData.findIndex(entry => entry.url === url);

    if (existingEntryIndex !== -1) {
      let existingEntry = typedData[existingEntryIndex];
      
      // Append the new text only if it’s not already part of the existing text
      if (!existingEntry.text.includes(newText)) {
        existingEntry.text += `\n${newText}`; // Properly append new text to the existing text
        existingEntry.date = date; // Update date
        typedData[existingEntryIndex] = existingEntry; // Update the entry in the array
      }
    } else {
      // If no entry exists, create a new one
      typedData.push({ url, date, text: newText });
    }

    // Save the updated data back to local storage
    chrome.storage.local.set({ typedData }, () => {
      console.log(`Text saved for ${url}: ${newText}`);
    });
  });
}

function captureText(event) {
  const target = event.target;
  let text = '';

  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    text = target.value;
  } else if (target.isContentEditable) {
    text = target.innerText;
  }

  if (text) {
    const url = window.location.href;

    // Clear previous timeout to prevent excessive saves
    clearTimeout(typingTimeout);

    // Wait for a pause in typing before saving to avoid saving each character
    typingTimeout = setTimeout(() => {
      saveTypedText(url, text);
    }, 500); // Delay in milliseconds
  }
}

// Reinitialize listeners to ensure Google search elements are captured
function reinitializeListeners() {
  document.removeEventListener('input', captureText);
  document.removeEventListener('keyup', captureText);
  document.addEventListener('input', captureText);
  document.addEventListener('keyup', captureText);
}

// Add event listeners for capturing text
document.addEventListener('DOMContentLoaded', reinitializeListeners);
window.addEventListener('focus', reinitializeListeners);
document.addEventListener('input', captureText);
document.addEventListener('keyup', captureText);

