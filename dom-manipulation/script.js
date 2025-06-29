// Initial quotes array
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
];

// Load quotes from localStorage if available
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

// Show random quote and save last displayed quote in sessionStorage (optional)
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <cite>— ${quote.category}</cite>
  `;
  // Save last shown quote index to sessionStorage
  sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

// Add a new quote from input fields
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
  textInput.value = "";
  categoryInput.value = "";
  showRandomQuote();
}

// Create the form for adding new quotes and import/export buttons
function createAddQuoteForm() {
  const container = document.createElement("div");

  // Quote input
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  container.appendChild(quoteInput);

  // Category input
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  container.appendChild(categoryInput);

  // Add quote button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;
  container.appendChild(addBtn);

  // Export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes as JSON";
  exportBtn.onclick = exportQuotesAsJson;
  container.appendChild(exportBtn);

  // Import input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.id = "importFile";
  importInput.onchange = importFromJsonFile;
  container.appendChild(importInput);

  document.body.appendChild(container);
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON format: Expected an array of quotes.");
      }
    } catch (err) {
      alert("Error parsing JSON file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize app
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  showRandomQuote();

  // Restore last shown quote from sessionStorage (optional)
  const lastIndex = sessionStorage.getItem("lastQuoteIndex");
  if (lastIndex !== null && quotes[lastIndex]) {
    const quote = quotes[lastIndex];
    document.getElementById("quoteDisplay").innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <cite>— ${quote.category}</cite>
    `;
  }
};

// Bind Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
