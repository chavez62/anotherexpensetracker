// Constants
const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "expenses";
const CATEGORIES = {
  food: "Food & Dining",
  transportation: "Transportation",
  utilities: "Utilities",
  entertainment: "Entertainment",
  shopping: "Shopping",
  health: "Healthcare",
  other: "Other",
};

// State management
let expenses = [];
let currentPage = 1;
let currentFilter = "all";
let currentSort = "date-desc";

// DOM Elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");
const monthAmountElement = document.getElementById("month-amount");
const averageAmountElement = document.getElementById("average-amount");
const modal = document.getElementById("editModal");
const closeModalBtn = document.querySelector(".close-btn");
const filterCategory = document.getElementById("filter-category");
const sortBy = document.getElementById("sort-by");
const exportBtn = document.getElementById("export-btn");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const noExpenses = document.getElementById("no-expenses");

// Utility Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const sanitizeInput = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

// Toast Notifications
const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Data Management
const loadExpenses = () => {
  try {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
    if (!Array.isArray(expenses)) {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    console.error("Error loading expenses:", error);
    expenses = [];
    showToast("Error loading expenses", "error");
  }
};

const saveExpenses = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Error saving expenses:", error);
    showToast("Error saving expenses", "error");
  }
};

// Filtering and Sorting
const filterExpenses = (expenses) => {
  if (currentFilter === "all") return expenses;
  return expenses.filter((expense) => expense.category === currentFilter);
};

const sortExpenses = (expenses) => {
  return [...expenses].sort((a, b) => {
    switch (currentSort) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });
};

// Statistics Calculations
const calculateStatistics = () => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const monthTotal = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // Calculate average per month
  const dates = expenses.map((expense) => new Date(expense.date));
  if (dates.length > 0) {
    const minDate = new Date(Math.min(...dates));
    const monthsDiff =
      (currentDate.getFullYear() - minDate.getFullYear()) * 12 +
      (currentDate.getMonth() - minDate.getMonth()) +
      1;
    const average = total / monthsDiff;

    averageAmountElement.textContent = formatCurrency(average);
  } else {
    averageAmountElement.textContent = "0.00";
  }

  totalAmountElement.textContent = formatCurrency(total);
  monthAmountElement.textContent = formatCurrency(monthTotal);
};

// Rendering
const renderExpenses = () => {
  const filteredExpenses = filterExpenses(expenses);
  const sortedExpenses = sortExpenses(filteredExpenses);

  // Pagination
  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = sortedExpenses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Update pagination controls
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

  // Clear current table
  expenseList.innerHTML = "";

  if (paginatedExpenses.length === 0) {
    noExpenses.classList.remove("hidden");
    return;
  }

  noExpenses.classList.add("hidden");

  // Render expenses
  paginatedExpenses.forEach((expense, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${sanitizeInput(expense.name)}</td>
            <td>${CATEGORIES[expense.category]}</td>
            <td class="text-right">$${formatCurrency(expense.amount)}</td>
            <td class="text-center">
                <button class="edit-btn" data-id="${startIndex + index}" 
                        data-tooltip="Edit expense">Edit</button>
                <button class="delete-btn" data-id="${startIndex + index}"
                        data-tooltip="Delete expense">Delete</button>
            </td>
        `;
    expenseList.appendChild(row);
  });

  calculateStatistics();
};

// Form Handling
const validateExpenseInput = (name, amount, category, date) => {
  if (name.trim() === "") {
    showToast("Please enter an expense name", "error");
    return false;
  }

  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid positive amount", "error");
    return false;
  }

  if (amount > 999999999) {
    showToast("Amount is too large", "error");
    return false;
  }

  if (!category) {
    showToast("Please select a category", "error");
    return false;
  }

  if (!date) {
    showToast("Please select a date", "error");
    return false;
  }

  return true;
};

const addExpense = (event) => {
  event.preventDefault();

  const name = document.getElementById("expense-name").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  if (!validateExpenseInput(name, amount, category, date)) {
    return;
  }

  expenses.push({
    name,
    amount,
    category,
    date,
    created: new Date().toISOString(),
  });

  saveExpenses();
  showToast("Expense added successfully");
  expenseForm.reset();
  renderExpenses();
};

const deleteExpense = (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const index = parseInt(event.target.dataset.id);

    if (confirm("Are you sure you want to delete this expense?")) {
      expenses.splice(index, 1);
      saveExpenses();
      showToast("Expense deleted successfully");
      renderExpenses();
    }
  }
};

// Modal Handling
const showEditModal = (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const index = parseInt(event.target.dataset.id);
    const expense = expenses[index];

    document.getElementById("editName").value = expense.name;
    document.getElementById("editAmount").value = expense.amount;
    document.getElementById("editCategory").value = expense.category;
    document.getElementById("editDate").value = expense.date;
    document.getElementById("editIndex").value = index;

    modal.style.display = "block";
  }
};

const updateExpense = (event) => {
  event.preventDefault();

  const index = parseInt(document.getElementById("editIndex").value);
  const name = document.getElementById("editName").value.trim();
  const amount = parseFloat(document.getElementById("editAmount").value);
  const category = document.getElementById("editCategory").value;
  const date = document.getElementById("editDate").value;

  if (!validateExpenseInput(name, amount, category, date)) {
    return;
  }

  expenses[index] = {
    ...expenses[index],
    name,
    amount,
    category,
    date,
    modified: new Date().toISOString(),
  };

  saveExpenses();
  showToast("Expense updated successfully");
  modal.style.display = "none";
  renderExpenses();
};

// Export Functionality
const exportToCSV = () => {
  const headers = ["Date", "Name", "Category", "Amount"];
  const csvContent = [
    headers.join(","),
    ...expenses.map((expense) =>
      [
        expense.date,
        `"${expense.name}"`,
        CATEGORIES[expense.category],
        expense.amount,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Expenses exported successfully");
};

// Pagination Handlers
const changePage = (delta) => {
  const filteredExpenses = filterExpenses(expenses);
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const newPage = currentPage + delta;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderExpenses();
  }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expense-date").value = today;

  loadExpenses();
  renderExpenses();
});

expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", deleteExpense);
expenseList.addEventListener("click", showEditModal);
document.getElementById("editForm").addEventListener("submit", updateExpense);

filterCategory.addEventListener("change", (e) => {
  currentFilter = e.target.value;
  currentPage = 1;
  renderExpenses();
});

sortBy.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderExpenses();
});

exportBtn.addEventListener("click", exportToCSV);
prevPageBtn.addEventListener("click", () => changePage(-1));
nextPageBtn.addEventListener("click", () => changePage(1));

// Modal Event Listeners
closeModalBtn.onclick = () => (modal.style.display = "none");
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Keyboard Navigation
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
  }
});

// Form Input Validation
document.getElementById("expense-amount").addEventListener("input", (e) => {
  const value = e.target.value;
  if (value && (isNaN(value) || value <= 0)) {
    e.target.setCustomValidity("Please enter a valid positive amount");
  } else {
    e.target.setCustomValidity("");
  }
});

// Responsiveness Handler
const handleResize = () => {
  const width = window.innerWidth;
  if (width < 768) {
    ITEMS_PER_PAGE = 5;
  } else {
    ITEMS_PER_PAGE = 10;
  }
  currentPage = 1;
  renderExpenses();
};

window.addEventListener("resize", handleResize);

// Initialize tooltips
const initTooltips = () => {
  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);

      const rect = e.target.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    });

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
};

// Performance Optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const debouncedRender = debounce(renderExpenses, 100);

// Error Boundary
window.addEventListener("error", (event) => {
  console.error("Application error:", event.error);
  showToast("An error occurred. Please try again.", "error");
});

// Initialize the application
initTooltips();
handleResize();
