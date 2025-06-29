let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspirational" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", category: "Humor" },
  { text: "So many books, so little time.", category: "Books" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const notification = document.getElementById('notification');

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  const lastFilter = localStorage.getItem('lastFilter') || 'all';
  categoryFilter.value = lastFilter;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('lastFilter', selected);
  showRandomQuote();
}

function showRandomQuote() {
  let filteredQuotes = quotes;
  const selected = categoryFilter.value;
  if (selected && selected !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available for this category.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — (${filteredQuotes[randomIndex].category})`;
  sessionStorage.setItem('lastQuote', filteredQuotes[randomIndex].text);
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();
  if (!newText || !newCategory) {
    alert('Please enter both quote and category.');
    return;
  }
  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  showRandomQuote();
  textInput.value = '';
  categoryInput.value = '';
}

// JSON Export
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid JSON format.');
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert('Quotes imported successfully!');
    } catch {
      alert('Failed to parse JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Sync with Mock Server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Network response was not ok');
    const serverData = await response.json();
    // Simulate server quotes (map or filter real API data to our quotes structure if needed)
    // Here we just simulate no new data:
    // If your mock server returned real quotes, you'd merge here with conflict resolution
    // For demo, we assume server data takes precedence but no changes simulated
  } catch (error) {
    console.error('Fetch from server failed:', error);
  }
}

async function postQuotesToServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    console.log('Quotes posted successfully:', result);
  } catch (error) {
    console.error('Posting quotes failed:', error);
  }
}

// Periodic sync every 30 seconds
setInterval(() => {
  fetchQuotesFromServer();
  postQuotesToServer();
}, 30000);

window.onload = () => {
  loadQuotes();
  populateCategories();
  showRandomQuote();
};

newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
