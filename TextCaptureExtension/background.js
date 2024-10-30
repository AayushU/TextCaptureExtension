chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'saveText') {
    const { url, text } = message;
    const date = new Date().toISOString();

    chrome.storage.local.get({ typedData: [] }, (data) => {
      let typedData = data.typedData;

      // Find or create an entry for this URL
      let existingEntryIndex = typedData.findIndex(entry => entry.url === url);

      if (existingEntryIndex !== -1) {
        let existingEntry = typedData[existingEntryIndex];
        const existingLines = existingEntry.text.split('\n');
        
        // Append the new text only if it’s not already part of the existing text
        if (!existingLines.includes(text)) {
          existingEntry.text += `\n${text}`;
          existingEntry.date = date; // Update date
          typedData[existingEntryIndex] = existingEntry; // Update the entry in the array
        }
      } else {
        // If no entry exists, create a new one
        typedData.push({ url, date, text });
      }

      // Save the updated data back to local storage
      chrome.storage.local.set({ typedData }, () => {
        console.log(`Text saved for ${url}: ${text}`);
        sendResponse({ status: 'success' });
      });
    });

    // Return true to indicate async response
    return true;
  }
});

