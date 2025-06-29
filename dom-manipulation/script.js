// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" }
];

// Function to display a random quote using innerHTML for formatting
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available.</em>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><strong>Category:</strong> ${quote.category}</p>`;
}

// Function to add a new quote from user input
function addQuote() {
  const quoteInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = quoteInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newQuote === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newQuote, category: newCategory });

  quoteInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
  showRandomQuote();
}

// Function to create and insert the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Initialize the app on window load
window.onload = () => {
  showRandomQuote();
  createAddQuoteForm();
};

// Bind the existing button to show a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
