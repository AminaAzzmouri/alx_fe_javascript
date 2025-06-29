// Initial quotes array
let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" },
  { text: "So many books, so little time.", category: "Books" }
];

let lastQuoteIndex = null;

// Load quotes from localStorage if any
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available.";
    return;
  }
  
  let index;
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (index === lastQuoteIndex && quotes.length > 1);

  lastQuoteIndex = index;

  const quote = quotes[index];
  document.getElementById("quoteDisplay").textContent = `"${quote.text}" — Category: ${quote.category}`;

  // Save last displayed quote index in sessionStorage
  sessionStorage.setItem("lastQuoteIndex", index);
}

// Add a new quote from input fields
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Export quotes to JSON file
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file input
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: expected an array of quotes.");
        return;
      }

      // Optional: validate objects inside array
      for (const quote of importedQuotes) {
        if (typeof quote.text !== "string" || typeof quote.category !== "string") {
          alert("Invalid quote format in JSON.");
          return;
        }
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (error) {
      alert("Error reading JSON file: " + error.message);
    }
  };
  if (event.target.files.length > 0) {
    fileReader.readAsText(event.target.files[0]);
  }
}

// Initialization function on page load
window.onload = function() {
  loadQuotes();

  // Show last displayed quote from sessionStorage if available
  const lastIndex = sessionStorage.getItem("lastQuoteIndex");
  if (lastIndex !== null && quotes[lastIndex]) {
    lastQuoteIndex = Number(lastIndex);
    const quote = quotes[lastQuoteIndex];
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" — Category: ${quote.category}`;
  } else {
    showRandomQuote();
  }

  // Bind buttons and input event listeners
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotesAsJson);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
};
