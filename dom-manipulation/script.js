let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "life", id: 1 },
  { text: "The way to get started is to quit talking and begin doing.", category: "motivation", id: 2 },
  { text: "Don't let yesterday take up too much of today.", category: "inspiration", id: 3 }
];

const LOCAL_STORAGE_KEY = 'quotes';
const LOCAL_STORAGE_FILTER_KEY = 'selectedCategory';
const SERVER_API = 'https://jsonplaceholder.typicode.com/posts'; // Mock API

// Load quotes and filter from localStorage on init
function init() {
  const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    saveQuotes();
  }

  populateCategories();

  const savedFilter = localStorage.getItem(LOCAL_STORAGE_FILTER_KEY);
  if (savedFilter) {
    document.getElementById('categoryFilter').value = savedFilter;
  }

  filterQuotes();
  fetchServerQuotes(); // Initial fetch from server
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// Populate categories dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  // Remove all except 'all'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const filter = document.getElementById('categoryFilter').value;
  localStorage.setItem(LOCAL_STORAGE_FILTER_KEY, filter);

  let filteredQuotes = filter === 'all' ? quotes : quotes.filter(q => q.category === filter);

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = 'No quotes found for this category.';
    return;
  }

  // Show a random filtered quote
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" — ${quote.category}`;
}

// Show random quote ignoring filter
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" — ${quote.category}`;
}

// Add new quote
async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }

  const newQuote = { text, category, id: Date.now() };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  // Simulate sending new quote to server
  try {
    const response = await fetch(SERVER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote)
    });
    if (!response.ok) throw new Error('Failed to sync with server');
    alert('Quote added and synced with server.');
  } catch (error) {
    console.error('Sync error:', error);
    alert('Quote added locally, but failed to sync with server.');
  }

  textInput.value = '';
  categoryInput.value = '';
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error('Invalid JSON format');
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Failed to import quotes: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Notification UI
function showNotification(message) {
  const notif = document.getElementById('syncNotification');
  notif.textContent = '';
  notif.style.display = 'block';

  // Add message and dismiss button
  const span = document.createElement('span');
  span.textContent = message;
  notif.appendChild(span);

  const btn = document.createElement('button');
  btn.textContent = 'Dismiss';
  btn.onclick = hideNotification;
  notif.appendChild(btn);
}

function hideNotification() {
  document.getElementById('syncNotification').style.display = 'none';
}

// Fetch quotes from server (simulate)
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_API);
    if (!response.ok) throw new Error('Failed to fetch from server');
    const serverQuotesRaw = await response.json();

    // Map server data to quote format (take first 10 for demo)
    const serverQuotes = serverQuotesRaw.slice(
