const quotesKey = "quotes";
const categoryFilterKey = "categoryFilter";
const lastQuoteKey = "lastQuote";

let quotes = JSON.parse(localStorage.getItem(quotesKey)) || [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" },
  { text: "So many books, so little time.", category: "Reading" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem(quotesKey, JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
  sessionStorage.setItem(lastQuoteKey, JSON.stringify(randomQuote));
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(categoryFilterKey);
  if (savedFilter && [...categories, "all"].includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  } else {
    categoryFilter.value = "all";
  }
}

function filterQuotes() {
  localStorage.setItem(categoryFilterKey, categoryFilter.value);
  showRandomQuote();
}

function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Expected an array of quotes.");
      }
    } catch (e) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    // Simulate server quotes from posts (using title as quote, userId as category)
    return data.map(item => ({
      text: item.title,
      category: `User ${item.userId}`
    }));
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

async function postQuotesToServer(newQuotes) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuotes)
    });
    if (!response.ok) throw new Error("Failed to post quotes");
    return await response.json();
  } catch (error) {
    console.error("Failed to post quotes to server:", error);
  }
}

// New function to sync local quotes with server data
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes.length) return;

  // Merge server quotes with local quotes, server takes precedence on conflicts
  const combinedQuotes = [...quotes];

  serverQuotes.forEach(serverQuote => {
    const exists = combinedQuotes.some(
      localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
    );
    if (!exists) {
      combinedQuotes.push(serverQuote);
    }
  });

  if (combinedQuotes.length !== quotes.length) {
    quotes = combinedQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Quotes synced with server successfully!");
  }
}

window.onload = () => {
  populateCategories();
  showRandomQuote();

  // Sync quotes every 30 seconds
  setInterval(syncQuotes, 30000);
};

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

window.addQuote = addQuote;
window.exportQuotes = exportQuotes;
window.importFromJsonFile = importFromJsonFile;
window.filterQuotes = filterQuotes;
