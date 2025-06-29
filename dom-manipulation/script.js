// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  // Pick random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
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

  // Add the new quote to the array
  quotes.push({ text: newQuote, category: newCategory });

  // Clear input fields
  quoteInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");

  // Optionally, show the new quote immediately
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

// Initialize the app
window.onload = () => {
  showRandomQuote();
  createAddQuoteForm();
};

// Also bind the existing button to show a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
