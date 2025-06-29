let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load from localStorage or use defaults
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

// Display a random quote filtered by category
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Add new quote from form inputs
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }
  const newQuoteObj = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuoteObj);
  saveQuotes();
  populateCategories();
  showRandomQuote();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Simulate sending quote to server
  sendQuoteToServer(newQuoteObj);
}

// Populate category filter dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Load last selected category from localStorage if any
  const lastCategory = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastCategory;
}

// Filter quotes by selected category
function filterQuotes() {
  localStorage.setItem("lastCategoryFilter", categoryFilter.value);
  showRandomQuote();
}

// Export quotes as JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: must be an array of quotes.");
        return;
      }
      // Merge imported quotes, avoid duplicates based on text+category
      importedQuotes.forEach(iq => {
        if (!quotes.some(q => q.text === iq.text && q.category === iq.category)) {
          quotes.push(iq);
        }
      });
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Show notification for updates
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// Fetch quotes from mock server (simulate with JSONPlaceholder or mock data)
async function fetchQuotesFromServer() {
  try {
    // Using JSONPlaceholder as mock - simulate with /posts endpoint for demo
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    if (!response.ok) throw new Error("Network response was not ok");
    const serverData = await response.json();

    // Map server data to quote format for demo purposes
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: server data takes precedence, merge quotes
    let updated = false;
    serverQuotes.forEach(sq => {
      if (!quotes.some(q => q.text === sq.text && q.category === sq.category)) {
        quotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showRandomQuote();
      showNotification("Quotes updated from server.");
    }
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Simulate sending new quote to server (POST)
async function sendQuoteToServer(quote) {
  try {
    // Post to mock server endpoint
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    if (!response.ok) throw new Error("Failed to send quote to server");
    const data = await response.json();
    console.log("Quote sent to server:", data);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}

// Initialization
loadQuotes();
populateCategories();
showRandomQuote();

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

// Periodic server sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);
