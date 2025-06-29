// Initial Quotes Array
let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", category: "Humor" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

let filteredQuotes = [];
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Initialize app
function init() {
  loadQuotes();
  populateCategories();
  categoryFilter.value = lastSelectedCategory;
  filterQuotes();
  showRandomQuote();

  newQuoteBtn.addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotesToJson);
}

// Load quotes from localStorage or use default
function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote from filteredQuotes or all quotes
function showRandomQuote() {
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <br> <small>— ${quote.category}</small>`;

  // Save last shown quote text in sessionStorage
  sessionStorage.setItem("lastQuote", quote.text);
}

// Populate categories dropdown dynamically
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Clear existing except the "all"
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  if (selected === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  showRandomQuote();
}

// Add new quote and update storage & categories
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  // Update categories dropdown if new category added
  populateCategories();

  // If current filter is "all" or matches new quote's category, refresh filtered quotes
  if (categoryFilter.value === "all" || categoryFilter.value === category) {
    filterQuotes();
  }

  textInput.value = "";
  categoryInput.value = "";
}

// Export quotes as JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format.");

      // Validate quotes structure
      importedQuotes.forEach(q => {
        if (!q.text || !q.category) throw new Error("Quote missing text or category.");
      });

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();

      alert('Quotes imported successfully!');
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Run init on page load
window.onload = init;
