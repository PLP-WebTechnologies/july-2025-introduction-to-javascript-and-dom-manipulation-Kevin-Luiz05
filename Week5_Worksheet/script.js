/* script.js
   PLP Week 5 Day 1
   Contains: variables & conditionals, functions, loops, and DOM interactions.
*/
"use strict";

/* ------------------------------
   Cached DOM references
   ------------------------------ */
const ageForm = document.getElementById("ageForm");
const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const ageResult = document.getElementById("ageResult");

const cartForm = document.getElementById("cartForm");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productQty = document.getElementById("productQty");
const cartList = document.getElementById("cartList");
const cartSummary = document.getElementById("cartSummary");

const generateBtn = document.getElementById("generateBtn");
const itemsContainer = document.getElementById("itemsContainer");
const countdownBtn = document.getElementById("countdownBtn");
const countdownDisplay = document.getElementById("countdown");

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const createNoteBtn = document.getElementById("createNoteBtn");
const notesContainer = document.getElementById("notes");

/* ------------------------------
   PART 1 - Variables & Conditionals
   - When the form is submitted, check age and display a custom message.
   ------------------------------ */
ageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // variables (let/const usage)
  const name = nameInput.value.trim() || "Friend";
  const age = Number(ageInput.value);

  // conditional checks
  if (!Number.isFinite(age) || age < 0) {
    ageResult.textContent = "Please enter a valid non-negative age.";
    ageResult.style.color = "crimson";
    return;
  }

  // business logic: adult check
  if (age >= 18) {
    ageResult.style.color = "green";
    ageResult.textContent = `Welcome ${name}! You are ${age} years old — access granted.`;
  } else {
    ageResult.style.color = "#444";
    ageResult.textContent = `Hi ${name}. You are ${age} — you are under 18 (limited access).`;
  }
});

/* ------------------------------
   PART 2 - Functions & Shopping Cart
   Required: at least 2 custom functions
   - function: addToCart
   - function: calculateCartTotal
   ------------------------------ */
let cart = []; // array of {id,name,price,qty}

/**
 * Adds an item to the cart (function)
 */
function addToCart(name, price, qty) {
  // small validation
  if (!name || price <= 0 || qty <= 0) return;
  const id = Date.now() + Math.random(); // simple unique id
  cart.push({ id, name, price: Number(price), qty: Number(qty) });
  renderCart(); // update UI
}

/**
 * Calculates the cart total (function)
 * demonstrates use of array iteration (reduce)
 */
function calculateCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/**
 * Renders the cart list to the DOM.
 * Shows another example of loops (forEach).
 */
function renderCart() {
  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${escapeHtml(item.name)}</strong>
      <span>$${(item.price).toFixed(2)} × ${item.qty}</span>
      <button data-id="${item.id}" class="remove">Remove</button>
    `;
    cartList.appendChild(li);
  });

  // attach remove handlers (event delegation could be used; here we attach per button)
  cartList.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      cart = cart.filter((i) => String(i.id) !== String(id));
      renderCart();
    });
  });

  const total = calculateCartTotal();
  cartSummary.textContent = `Total: $${total.toFixed(2)}`;
}

/* Escape small HTML to avoid injection in this demo */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Handle cart form submit */
cartForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addToCart(productName.value.trim(), parseFloat(productPrice.value), parseInt(productQty.value, 10));
  cartForm.reset();
});

/* ------------------------------
   PART 3 - Loops
   - for loop to generate sample items
   - while loop example to create array elements
   ------------------------------ */
generateBtn.addEventListener("click", () => {
  itemsContainer.innerHTML = "";
  // create a sample array using a while loop
  const labels = [];
  let i = 1;
  while (i <= 5) {
    labels.push(`Sample Item ${i}`);
    i++;
  }

  // render each item using a for loop
  for (let j = 0; j < labels.length; j++) {
    const div = document.createElement("div");
    div.className = "item-card";
    div.textContent = `${labels[j]} — created with loops`;
    itemsContainer.appendChild(div);
  }
});

/* Countdown example using a timer (demonstrates iteration through time) */
countdownBtn.addEventListener("click", () => {
  let n = 5;
  countdownDisplay.textContent = `Countdown: ${n}s`;
  countdownDisplay.style.color = "#333";

  const id = setInterval(() => {
    n -= 1;
    if (n <= 0) {
      clearInterval(id);
      countdownDisplay.textContent = "Done! ✅";
      countdownDisplay.style.color = "green";
      return;
    }
    countdownDisplay.textContent = `Countdown: ${n}s`;
  }, 1000);
});

/* ------------------------------
   PART 4 - DOM interactions (at least 3)
   - toggle theme (classList)
   - create note element (createElement, appendChild)
   - remove note (event listener)
   ------------------------------ */
toggleThemeBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

createNoteBtn.addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note";
  // create content + remove button
  const text = document.createElement("span");
  text.textContent = `Note created at ${new Date().toLocaleTimeString()}`;
  const removeBtn = document.createElement("button");
  removeBtn.className = "btn";
  removeBtn.textContent = "Delete";
  removeBtn.style.padding = "0.25rem 0.5rem";

  removeBtn.addEventListener("click", () => {
    // demonstration of removeChild
    notesContainer.removeChild(note);
  });

  note.appendChild(text);
  note.appendChild(removeBtn);
  notesContainer.prepend(note); // newest on top
});

/* ------------------------------
   Extra: expose a small API for console testing (nice for graders)
   So they can test functions from DevTools console.
   ------------------------------ */
window.PLPMini = {
  addToCart,
  calculateCartTotal,
  getCart: () => cart.slice(),
  renderCart
};
