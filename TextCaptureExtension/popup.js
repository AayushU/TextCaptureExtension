function displayTextData() {
  chrome.storage.local.get({ typedData: [] }, (data) => {
    const textContainer = document.getElementById('textContainer');
    textContainer.innerHTML = ''; // Clear previous entries

    // Filter to only keep the latest entry per URL
    const uniqueEntries = data.typedData.reduce((uniqueEntries, entry) => {
      uniqueEntries[entry.url] = entry;
      return uniqueEntries;
    }, {});

    // Display each unique entry
    Object.values(uniqueEntries).forEach((entry) => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('entry');
      
      const urlDiv = document.createElement('div');
      urlDiv.classList.add('url');
      urlDiv.textContent = `Website: ${entry.url}`;
      
      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      dateDiv.textContent = `Date: ${new Date(entry.date).toLocaleString()}`;
      
      const textDiv = document.createElement('div');
      textDiv.textContent = `Text: ${entry.text}`;
      
      entryDiv.appendChild(urlDiv);
      entryDiv.appendChild(dateDiv);
      entryDiv.appendChild(textDiv);
      textContainer.appendChild(entryDiv);
    });

    if (Object.keys(uniqueEntries).length === 0) {
      textContainer.innerHTML = 'No saved text found.';
    }
  });
}

document.addEventListener('DOMContentLoaded', displayTextData);

