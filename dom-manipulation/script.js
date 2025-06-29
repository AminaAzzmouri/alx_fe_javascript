// ... existing code ...

function showNotification(message) {
  const notificationDiv = document.getElementById('notification');
  notificationDiv.textContent = message;

  // Hide notification after 3 seconds
  setTimeout(() => {
    notificationDiv.textContent = '';
  }, 3000);
}

async function syncQuotes() {
  try {
    const response = await fetch(serverURL);
    if (!response.ok) throw new Error('Failed to fetch server quotes');
    const serverQuotes = await response.json();

    // Conflict resolution: server data takes precedence
    quotes = serverQuotes;

    saveQuotes();
    populateCategories();
    filterQuotes();

    showNotification('Quotes synced with server!');
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// ... existing code ...

// Call syncQuotes periodically as before
setInterval(syncQuotes, 30000);

// Initial call on load
syncQuotes();
