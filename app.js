/*
  
  PocketWise · app.js
  Finnova — Frontend by: [Your Name]

  BACKEND TEAM: Search for "TODO:" to find every integration point.
  Each TODO block shows exactly what data shape the UI expects.

  API_BASE is the only variable you need to change when your backend
  is deployed. Everything else wires up automatically.
  
*/
// Frontend does not create a Supabase client directly; backend API routes handle DB access.

const API_BASE = "/api"; // TODO: replace with your deployed backend URL

const Auth = {
  getToken: () => localStorage.getItem("pw_token"),
  setToken: (t) => localStorage.setItem("pw_token", t),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("pw_user") || localStorage.getItem("user") || "null");
    } catch (err) {
      return null;
    }
  },
  setUser: (user) => {
    localStorage.setItem("pw_user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem("pw_token");
    localStorage.removeItem("pw_user");
    localStorage.removeItem("user");
  },
  isLoggedIn: () => !!localStorage.getItem("pw_token"),
};

// App-level state (simple SPA state for Phase 1)
let isLoggedIn = Auth.isLoggedIn();
let currentScreen = "dashboard"; // dashboard | expenses | budgets | education | profile

function setAppLoggedIn(user) {
  isLoggedIn = true;
  currentScreen = "dashboard";
  currentUser = user || Auth.getUser() || JSON.parse(localStorage.getItem("user") || "null");
  document.body.classList.add("logged-in");
  updateNavForLoggedInUser(currentUser);
  createAppShell();
  renderScreen();
  // Load data for app screens
  if (currentUser) {
    loadDashboardSummary();
    loadCategoryBreakdown();
    loadBudget();
    loadExpenses();
    loadBudgets();
    loadTransactions();
    loadIncomes();
    loadReport();
    renderProfileCard(currentUser);
    if (window.loadEducationContent) window.loadEducationContent();
  }
}

function setAppLoggedOut() {
  isLoggedIn = false;
  currentScreen = "dashboard";
  currentUser = null;
  document.body.classList.remove("logged-in");
  updateNavForGuest();
  removeAppShell();
}

function createAppShell() {
  if (document.getElementById("pw-app")) return;

  const shell = document.createElement("div");
  shell.id = "pw-app";
  shell.style.cssText = `position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;background:linear-gradient(rgba(2,6,23,0.95),rgba(2,6,23,0.97));color:#fff;`;

  const content = document.createElement("div");
  content.id = "pw-app-content";
  content.style.cssText = "flex:1;overflow:auto;padding:1rem;max-width:480px;margin:0 auto;width:100%;box-sizing:border-box;";
  shell.appendChild(content);

  const nav = document.createElement("div");
  nav.id = "pw-bottom-nav";
  nav.style.cssText = "display:flex;justify-content:space-around;gap:6px;padding:0.6rem;background:linear-gradient(#071129,#051022);border-top:1px solid rgba(255,255,255,0.03);";

  const navItems = [
    { key: "dashboard", label: "🏠", title: "Dashboard" },
    { key: "history", label: "📋", title: "History" },
    { key: "expenses", label: "💸", title: "Expenses" },
    { key: "budgets", label: "📊", title: "Budgets" },
    { key: "education", label: "🎓", title: "Education" },
    { key: "profile", label: "👤", title: "Profile" },
  ];

  navItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "pw-nav-btn" + (item.key === "dashboard" ? " active" : "");
    btn.title = item.title;
    btn.innerText = item.label;
    btn.dataset.screen = item.key;
    btn.onclick = () => {
      currentScreen = item.key;
      renderScreen();
      document.querySelectorAll(".pw-nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
    nav.appendChild(btn);
  });

  shell.appendChild(nav);

  document.body.appendChild(shell);
}

function removeAppShell() {
  const shell = document.getElementById("pw-app");
  if (shell) shell.remove();
}

function renderScreen() {
  const container = document.getElementById("pw-app-content");
  if (!container) return;

  if (!isLoggedIn) {
    container.innerHTML = `<div style="padding:1rem;color:#cfeaff;">Please log in to access PocketWise.</div>`;
    return;
  }

  switch (currentScreen) {
    case "dashboard":
      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <div>
            <div style="font-size:0.9rem;color:#9aa7c7;">Welcome, ${currentUser?.name?.split(" ")[0] || currentUser?.email || "User"} 👋</div>
            <h2 style="margin:0;font-size:1.2rem;">Dashboard</h2>
          </div>
          <div style="font-size:0.85rem;color:#9aa7c7;">Quick Actions</div>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
          <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:10px;">
            <div style="font-size:0.75rem;color:#9aa7c7;">Total Income</div>
            <div id="dm-income" style="font-weight:700;font-size:1.1rem;">—</div>
          </div>
          <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:10px;">
            <div style="font-size:0.75rem;color:#9aa7c7;">Total Expenses</div>
            <div id="dm-spent" style="font-weight:700;font-size:1.1rem;">—</div>
          </div>
          <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:10px;">
            <div style="font-size:0.75rem;color:#9aa7c7;">Total Savings</div>
            <div id="dm-saved" style="font-weight:700;font-size:1.1rem;">—</div>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <div style="font-size:0.85rem;color:#9aa7c7;margin-bottom:0.4rem;">Remaining balance</div>
          <div id="hero-balance" style="font-size:1.4rem;font-weight:700;">—</div>
        </div>

          <div id="category-bars" style="margin:1rem 0 0.5rem;"><div class="skeleton" style="height:80px;width:100%;"></div></div>

        <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap;">
          <button class="btn-primary" onclick="openExpenseModal();return false;">Add Expense</button>
          <button class="btn-primary" onclick="openIncomeModal();return false;">Add Income</button>
          <button class="btn-primary" onclick="currentScreen='budgets';renderScreen();return false;">Set Budget</button>
        </div>

          <div id="recent-incomes" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>

          <div id="recent-expenses" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>

          <div id="budget-list" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>

          <div id="recent-transactions" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>

          <div id="report-card" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>

          <div id="profile-card" style="margin-top:1rem;"><div class="skeleton" style="height:60px;width:100%;"></div></div>
      `;
      // populate dynamic parts
      loadDashboardSummary();
      loadExpenses();
      loadIncomes();
      loadBudgets();
      loadTransactions();
      loadReport();
      renderProfileCard(currentUser);
      break;

    case "history":
      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <h2 style="margin:0;font-size:1.2rem;">Transaction History</h2>
          <div style="font-size:0.8rem;color:var(--muted);">All activity</div>
        </div>
        <div id="full-transaction-list"><div class="skeleton" style="height:200px;width:100%;"></div></div>
      `;
      loadFullHistory();
      break;

    case "expenses":
      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <h2 style="margin:0;font-size:1.2rem;">Expenses</h2>
          <div><button class="btn-primary" onclick="openExpenseModal();return false;">+ Add Expense</button></div>
        </div>
          <div id="recent-expenses"><div class="skeleton" style="height:60px;width:100%;"></div></div>
      `;
      // fetch and render expenses
      loadExpenses();
      break;

    case "budgets":
      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <h2 style="margin:0;font-size:1.2rem;">Monthly Budgets</h2>
          <div><button class="btn-primary" onclick="openBudgetModal();return false;">+ Add Budget</button></div>
        </div>
          <div id="budget-list"><div class="skeleton" style="height:60px;width:100%;"></div></div>
      `;
      loadBudgets();
      break;

    case "goals":
      container.innerHTML = `
        <div style=\"color: #b0aec0; margin:2rem auto; text-align:center;\">Goal module is under development. Please check back soon!</div>\n`;
      // (Goals temporarily disabled)
      break;

    case "education":
      container.innerHTML = `
        <h2 style="margin:0 0 1rem;">Financial Education</h2>
        <div id="edu-grid"><div class="skeleton" style="height:200px;width:100%;"></div></div>
      `;
      if (window.loadEducationContent) window.loadEducationContent();
      break;

    case "profile":
      container.innerHTML = `
        <h2 style="margin:0 0 1rem;">Profile</h2>
        <div id="profile-card"><div class="skeleton" style="height:120px;width:100%;"></div></div>
        <div style="margin-top:1rem;"><button class="btn-primary" onclick="handleLogout();return false;">Logout</button></div>
      `;
      renderProfileCard(currentUser);
      break;

    default:
      container.innerHTML = `<div class="skeleton" style="height:200px;width:100%;"></div>`;
  }
  syncActiveNav();
}

function syncActiveNav() {
  document.querySelectorAll(".pw-nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.screen === currentScreen);
  });
}

const expenseData = {
  amount: "",
  category: "Food",
  description: "",
};

const incomeData = {
  amount: "",
  category: "Allowance",
  description: "",
};

let budgets = [];
let transactions = [];
let reportData = null;
let currentUser = null;
let savingsGoals = [];
let editingGoal = null;

const BUDGET_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Education",
  "Leisure",
  "Health",
];

function getStoredUser() {
  const raw = Auth.getUser() || JSON.parse(localStorage.getItem("user") || "null");
  if (raw && !raw.id && raw.user_id) {
    raw.id = raw.user_id;
  }
  return raw;
}

function setExpenseDataField(field, value) {
  expenseData[field] = value;
}

function setIncomeDataField(field, value) {
  incomeData[field] = value;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth"
  });
}
window.scrollToSection = scrollToSection;

async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    Auth.clear();
    showToast("Session expired. Please log in again.", "error");
    setAppLoggedOut();
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

async function loadUserProfile(user) {
  if (!user?.id) return user;
  try {
    const profile = await apiFetch(`/profile?user_id=${encodeURIComponent(user.id)}`);
    if (!profile) return user;
    return { ...user, ...profile };
  } catch (err) {
    console.warn("Failed to load user profile:", err.message);
    return user;
  }
}


/* =====================================================================
   AUTH — Sign Up & Login
   ===================================================================== */

async function handleSignUp({ full_name, email, password, phone, college, course, year, city, profile_image }) {
  /*
    TODO (Backend team):
    POST /api/auth?action=signup
    Body:   { full_name, email, password, phone, college, course, year, city }
    Returns: { token, user: { id, name, email } }
  */
  try {
    const data = await apiFetch("/auth?action=signup", {
      method: "POST",
      body: JSON.stringify({ full_name, email, password, phone, college, course, year, city, profile_image }),
    });
    if (!data) return false;

    const token = data.token || data.session?.access_token;
    const user = data.user || data.session?.user;

    if (!token || !user) {
      throw new Error("Signup succeeded but authentication data is missing.");
    }

    Auth.setToken(token);
    currentUser = await loadUserProfile(user);
    Auth.setUser(currentUser);

    showToast(`Welcome to PocketWise, ${currentUser.full_name || currentUser.name || currentUser.email}!`, "success");
    setAppLoggedIn(currentUser);
    scrollToDashboard();
    return true;
  } catch (err) {
    showToast(err.message || "Signup failed", "error");
    return false;
  }
}

async function handleLogin(email, password) {
  /*
    TODO (Backend team):
    POST /api/auth?action=login
    Body:   { email, password }
    Returns: { token, user: { id, name, email } }
  */
  try {
    const data = await apiFetch("/auth?action=login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!data) return false;

    const token = data.token || data.session?.access_token;
    const user = data.user || data.session?.user;

    if (!token || !user) {
      throw new Error("Login succeeded but authentication data is missing.");
    }

    Auth.setToken(token);
    currentUser = await loadUserProfile(user);
    Auth.setUser(currentUser);

    showToast(`Welcome back, ${currentUser.full_name || currentUser.name || currentUser.email}!`, "success");
    setAppLoggedIn(currentUser);
    scrollToDashboard();
    return true;
  } catch (err) {
    showToast(err.message || "Login failed", "error");
    return false;
  }
}

function handleLogout() {
  currentUser = null;
  isLoggedIn = false;

  Auth.clear();

  removeAppShell();

  updateNavForGuest();

  location.reload();
}


/* =====================================================================
   DASHBOARD — Summary Metrics
   ===================================================================== */

async function loadDashboardSummary() {
  /*
    TODO (Backend team):
    GET /api/dashboard/summary
    Headers: Authorization: Bearer <token>
    Returns: {
      totalIncome:   number,   // e.g. 8000
      totalExpenses: number,   // e.g. 4760
      totalSaved:    number,   // e.g. 3240
      savingsGoal:   number,   // e.g. 5000
      savingsStreak: number,   // days tracked in a row
    }
  */
  if (!Auth.isLoggedIn()) return;

  const incomeEl = document.getElementById("dm-income");
  const spentEl = document.getElementById("dm-spent");
  const savedEl = document.getElementById("dm-saved");
  const balanceEl = document.getElementById("hero-balance");
  if (incomeEl) incomeEl.textContent = "—";
  if (spentEl) spentEl.textContent = "—";
  if (savedEl) savedEl.textContent = "—";
  if (balanceEl) balanceEl.textContent = "—";

  try {
    const user = getStoredUser();
    if (!user) throw new Error("No user");
    const data = await apiFetch(`/dashboard/summary?user_id=${encodeURIComponent(user.id)}`);
    if (!data) throw new Error("No data");
    renderDashboardMetrics(data);
  } catch (err) {
    if (incomeEl) incomeEl.textContent = "—";
    if (spentEl) spentEl.textContent = "—";
    if (savedEl) savedEl.textContent = "—";
    if (balanceEl) balanceEl.textContent = "—";
    const container = document.getElementById("pw-app-content");
    if (container) {
      const existing = document.getElementById("dashboard-error");
      if (!existing) {
        const msg = document.createElement("div");
        msg.id = "dashboard-error";
        msg.style.color = "#fca5a5";
        msg.style.marginTop = "0.5rem";
        msg.innerHTML = `Unable to load dashboard. Please try again. <button onclick="loadDashboardSummary()">Retry</button>`;
        container.prepend(msg);
      }
    }
  }
}

function renderDashboardMetrics(data) {
  const incomeEl  = document.getElementById("dm-income");
  const spentEl   = document.getElementById("dm-spent");
  const savedEl   = document.getElementById("dm-saved");
  const balanceEl = document.getElementById("hero-balance");
  const spentHeroEl = document.getElementById("hero-spent");
  const goalEl    = document.getElementById("savings-goal-text");
  const goalBarEl = document.getElementById("savings-goal-bar");
  const streakEl  = document.getElementById("mini-streak");

  if (incomeEl)  incomeEl.textContent  = formatCurrency(data.totalIncome);
  if (spentEl)   spentEl.textContent   = formatCurrency(data.totalExpenses);
  if (savedEl)   savedEl.textContent   = formatCurrency(data.totalSaved);
  if (balanceEl) balanceEl.textContent = formatCurrency(data.totalIncome - data.totalExpenses);
  if (spentHeroEl) spentHeroEl.textContent = formatCurrency(data.totalExpenses);

  if (goalEl && data.savingsGoal) {
    goalEl.textContent = `${formatCurrency(data.totalSaved)} / ${formatCurrency(data.savingsGoal)}`;
  }
  if (goalBarEl && data.savingsGoal) {
    const pct = Math.min((data.totalSaved / data.savingsGoal) * 100, 100).toFixed(1);
    goalBarEl.style.width = `${pct}%`;
    const labelEl = document.getElementById("savings-goal-label");
    if (labelEl) labelEl.textContent = `${pct}% of monthly goal`;
  }
  if (streakEl) streakEl.textContent = `${data.savingsStreak} days tracked`;
}


/* =====================================================================
   EXPENSES — Category Breakdown
   ===================================================================== */

async function loadCategoryBreakdown() {
  /*
    TODO (Backend team):
    GET /api/expenses/breakdown?month=YYYY-MM
    Headers: Authorization: Bearer <token>
    Returns: [
      { category: "Food",          icon: "🍱", spent: 2100, limit: 2500 },
      { category: "Transport",     icon: "🚌", spent: 640,  limit: 1000 },
      { category: "Books",         icon: "📚", spent: 400,  limit: 600  },
      { category: "Leisure", icon: "🎮", spent: 1020, limit: 800  },
      { category: "Health",        icon: "🏥", spent: 300,  limit: 500  },
    ]
  */
  if (!Auth.isLoggedIn()) return;

  try {
    const user = getStoredUser();
    if (!user) return;

    // Fetch raw expenses and budgets, then compute breakdown client-side
    const expenses = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}&type=expense`) || [];
    const userBudgets = await apiFetch(`/budgets?user_id=${encodeURIComponent(user.id)}`) || [];

    // Aggregate spent by category
    const spentByCategory = {};
    (expenses || []).forEach((e) => {
      const cat = e.category || "Other";
      spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(e.amount || 0);
    });

    const categories = Object.keys(spentByCategory).length
      ? Object.keys(spentByCategory).map((cat) => {
          const budget = (userBudgets || []).find((b) => b.category === cat) || {};
          return {
            category: cat,
            icon: "💸",
            spent: spentByCategory[cat],
            limit: budget.budget_limit || 0,
          };
        })
      : // fallback to budgets list if no expenses yet
        (userBudgets || []).map((b) => ({ category: b.category, icon: "💸", spent: 0, limit: b.budget_limit }));

    renderCategoryBars(categories);
    renderHeroBudgetBars(categories);
  } catch (err) {
    console.warn("Failed to compute category breakdown:", err.message);
    // don't spam users with toasts for missing backend; show friendly message in UI
    const container = document.getElementById("category-bars");
    if (container) container.innerHTML = `<div style="color:#fca5a5;">Unable to load category breakdown.</div>`;
  }
}

function renderCategoryBars(categories) {
  const container = document.getElementById("category-bars");
  if (!container) return;
  container.innerHTML = "";

  categories.forEach((cat) => {
    const pct = Math.min((cat.spent / cat.limit) * 100, 100).toFixed(0);
    const overBudget = cat.spent > cat.limit;
    const barColor = overBudget
      ? "linear-gradient(to right,#f87171,#fb923c)"
      : "linear-gradient(to right,#4F6EF7,#7B94FF)";

    const row = document.createElement("div");
    row.className = "cat-row";
    row.innerHTML = `
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-name">${cat.category}</span>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width:${pct}%;background:${barColor};"></div>
      </div>
      <span class="cat-amount">${formatCurrency(cat.spent)}</span>
    `;
    container.appendChild(row);
  });
}

function renderHeroBudgetBars(categories) {
  const container = document.getElementById("hero-budget-bars");
  if (!container) return;
  container.innerHTML = "";

  const totalSpent = categories.reduce((sum, cat) => sum + Number(cat.spent || 0), 0);
  const totalLimit = categories.reduce((sum, cat) => sum + Number(cat.limit || 0), 0);
  const budgetPct = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100).toFixed(0) : 0;
  const badge = document.getElementById("hero-savings-badge");
  if (badge) {
    badge.textContent = totalLimit > 0
      ? `Budget used ${budgetPct}%`
      : "Set a budget to get started";
  }

  categories.slice(0, 3).forEach((cat) => {
    const pct = Math.min((cat.spent / cat.limit) * 100, 100).toFixed(0);
    const overBudget = cat.spent > cat.limit;
    const barColor = overBudget
      ? "linear-gradient(to right,#f87171,#fb923c)"
      : "linear-gradient(to right,#4F6EF7,#7B94FF)";
    const amountColor = overBudget ? "#f87171" : "var(--warm-white)";

    container.innerHTML += `
      <div class="budget-row">
        <span>${cat.category}</span>
        <span style="color:${amountColor};font-weight:600;">
          ${formatCurrency(cat.spent)} / ${formatCurrency(cat.limit)}
        </span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct}%;background:${barColor};"></div>
      </div>
    `;
  });

  const summaryEl = document.getElementById("hero-budget-summary");
  if (summaryEl) {
    summaryEl.textContent = totalLimit > 0
      ? `${categories.length} category budgets · ${formatCurrency(totalSpent)} spent of ${formatCurrency(totalLimit)}`
      : "Start adding category budgets to see your progress.";
  }
}


/* =====================================================================
   EXPENSE — Add New Expense
   ===================================================================== */

async function handleAddExpense() {
  try {
    const user = getStoredUser();
    if (!user?.id) {
      showToast("Please log in first.", "error");
      return;
    }

    const amount = Number(document.getElementById("expense-amount")?.value || expenseData.amount);
    const category = document.getElementById("expense-category")?.value || expenseData.category;
    const description = document.getElementById("expense-description")?.value || expenseData.description || "";
    const date = new Date().toISOString().split("T")[0];

    if (!amount || amount <= 0) {
      showToast("Enter a valid expense amount.", "error");
      return;
    }
    if (!category) {
      showToast("Please select a category.", "error");
      return;
    }

    console.log("[handleAddExpense] Sending:", { user_id: user.id, amount, category, description, date });

    if (editingExpense) {
      await apiFetch("/transactions", {
        method: "PUT",
        body: JSON.stringify({
          transaction_id: editingExpense.transaction_id,
          amount,
          category,
          description,
          date,
          user_id: user.id,
        }),
      });

      editingExpense = null;
      showToast("Expense updated!", "success");
    } else {
      await apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          amount,
          category,
          description,
          date,
          type: "Expense",
        }),
      });

      showToast("Expense added successfully!", "success");
    }

    closeExpenseModal();
    setExpenseDataField("amount", "");
    setExpenseDataField("category", "Food");
    setExpenseDataField("description", "");
    await loadDashboardSummary();
    await loadCategoryBreakdown();
    await loadExpenses();
    await loadIncomes();
    await loadTransactions();
    await loadBudgets();
  } catch (error) {
    console.error("[handleAddExpense] Error:", error);
    showToast(error.message || "Failed to add expense", "error");
  }
}

async function handleAddIncome() {
  try {
    const user = getStoredUser();

    const amount = Number(document.getElementById("income-amount")?.value || incomeData.amount);
    const category = document.getElementById("income-category")?.value || incomeData.category;
    const description = document.getElementById("income-description")?.value || incomeData.description || "";
    const date = new Date().toISOString().split("T")[0];

    if (!amount || amount <= 0) {
      showToast("Enter a valid income amount.", "error");
      return;
    }
    if (!category) {
      showToast("Please select a category.", "error");
      return;
    }

    if (editingIncome) {
      await apiFetch("/transactions", {
        method: "PUT",
        body: JSON.stringify({
          transaction_id: editingIncome.transaction_id,
          amount,
          category,
          description,
          date,
          user_id: user?.id,
        }),
      });

      editingIncome = null;
      showToast("Income updated!", "success");
    } else {
      await apiFetch("/transactions", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id,
          amount,
          category,
          description,
          date,
          type: "Income",
        }),
      });

      showToast("Income added successfully!", "success");
    }

    closeIncomeModal();
    setIncomeDataField("amount", "");
    setIncomeDataField("category", "Pocket Money");
    setIncomeDataField("description", "");
    await loadDashboardSummary();
    await loadTransactions();
    await loadIncomes();
  } catch (error) {
    console.error(error);
    showToast(error.message || "Failed to add income", "error");
  }
}

async function loadExpenses() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("recent-expenses");
    if (container) container.innerHTML = `<div class="expense-empty">No expenses yet.<br>Add your first expense.</div>`;
    return;
  }

  const container = document.getElementById("recent-expenses");
  if (container) container.innerHTML = `<div class="skeleton" style="height:60px;width:100%;"></div>`;

  try {
    const data = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}&type=expense`);

    if (!data || data.length === 0) {
      if (container) container.innerHTML = `<div class="expense-empty">No expenses yet.<br>Add your first expense.</div>`;
      return;
    }

    renderRecentExpenses(data);
  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<div class="expense-empty">No expenses yet.<br>Add your first expense.</div>`;
  }
}

function renderRecentExpenses(expenses) {
  const container = document.getElementById("recent-expenses");
  if (!container) return;

  const recent = (expenses || []).slice(-5).reverse();
  if (!recent.length) {
    container.innerHTML = `<div class="expense-empty">No expenses yet.<br>Add your first expense.</div>`;
    return;
  }

  container.innerHTML = recent
    .map((expense) => {
      const description = expense.description || "No description";
      return `
        <div class="expense-row">
          <div class="expense-col">
            <div class="expense-category">${expense.category}</div>
            <div class="expense-description">${description}</div>
          </div>
          <div class="expense-amount">${formatCurrency(expense.amount)}</div>
        </div>
        <div class="expense-actions">

  <button
    class="expense-btn expense-btn-edit"
    onclick="
      editExpense(
        '${expense.transaction_id}'
      )
    "
    title="Edit expense"
  >
    ✏️
  </button>

  <button
    class="expense-btn expense-btn-delete"
    onclick="
      deleteExpense(
        '${expense.transaction_id}'
      )
    "
    title="Delete expense"
  >
    🗑️
  </button>

</div>
      `;
    })
    .join("");
}
async function loadIncomes() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("recent-incomes");
    if (container) container.innerHTML = `<p>No income yet.</p>`;
    return;
  }

  const container = document.getElementById("recent-incomes");
  if (container) container.innerHTML = `<div class="skeleton" style="height:60px;width:100%;"></div>`;

  try {
    const data = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}&type=income`);

    if (!data || data.length === 0) {
      if (container) container.innerHTML = `<p>No income yet.</p>`;
      return;
    }

    renderRecentIncomes(data);
  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<p>No income yet.</p>`;
  }
}

function renderRecentIncomes(incomes) {
  const container = document.getElementById("recent-incomes");
  if (!container) return;

  const recent = (incomes || []).slice(-5).reverse();
  if (!recent.length) {
    container.innerHTML = `<div class="expense-empty">No income yet.</div>`;
    return;
  }

  container.innerHTML = recent
    .map((income) => {
      const description = income.description || "No description";
      return `
        <div class="expense-row">
          <div class="expense-col">
            <div class="expense-category">${income.category}</div>
            <div class="expense-description">${description}</div>
          </div>
          <div class="expense-amount" style="color:var(--mint);">${formatCurrency(income.amount)}</div>
        </div>
        <div class="expense-actions">
          <button
            class="expense-btn expense-btn-edit"
            onclick="editIncome('${income.transaction_id}')"
            title="Edit income"
          >✏️</button>
          <button
            class="expense-btn expense-btn-delete"
            onclick="deleteIncome('${income.transaction_id}')"
            title="Delete income"
          >🗑️</button>
        </div>
      `;
    })
    .join("");
}

async function deleteExpense(id) {
  const ok = confirm("Delete this expense?");
  if (!ok) return;

  const user = getStoredUser();
  await apiFetch(`/transactions?id=${id}&user_id=${encodeURIComponent(user?.id || "")}`, { method: "DELETE" });

  showToast("Expense deleted!", "success");

  loadExpenses();
  loadDashboardSummary();
  loadCategoryBreakdown();
  loadTransactions();
  loadBudgets();
  loadIncomes();
}

let editingExpense = null;
let editingBudget = null;
let editingIncome = null;
function editExpense(id) {
  editingExpense = transactions.find((x) => x.transaction_id === id);
  if (!editingExpense) return;

  expenseData.amount = editingExpense.amount;
  expenseData.category = editingExpense.category;
  expenseData.description = editingExpense.description;

  document.getElementById("expense-amount").value = editingExpense.amount;
  document.getElementById("expense-category").value = editingExpense.category;
  document.getElementById("expense-description").value = editingExpense.description;

  const titleEl = document.querySelector("#expense-modal .modal-title");
  const btnEl = document.querySelector("#expense-modal .modal-button");
  if (titleEl) titleEl.textContent = "Edit Expense";
  if (btnEl) btnEl.textContent = "Update Expense";

  openExpenseModal();
}

function editIncome(id) {
  editingIncome = transactions.find((x) => x.transaction_id === id);
  if (!editingIncome) return;

  incomeData.amount = editingIncome.amount;
  incomeData.category = editingIncome.category;
  incomeData.description = editingIncome.description;

  document.getElementById("income-amount").value = editingIncome.amount;
  document.getElementById("income-category").value = editingIncome.category;
  document.getElementById("income-description").value = editingIncome.description;

  const titleEl = document.querySelector("#income-modal .modal-title");
  const btnEl = document.querySelector("#income-modal .modal-button");
  if (titleEl) titleEl.textContent = "Edit Income";
  if (btnEl) btnEl.textContent = "Update Income";

  openIncomeModal();
}

async function deleteIncome(id) {
  const ok = confirm("Delete this income entry?");
  if (!ok) return;

  const user = getStoredUser();
  await apiFetch(`/transactions?id=${id}&user_id=${encodeURIComponent(user?.id || "")}`, { method: "DELETE" });

  showToast("Income deleted!", "success");

  loadIncomes();
  loadDashboardSummary();
  loadTransactions();
}

async function loadBudgets() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("budget-list");
    if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
    return;
  }
  const container = document.getElementById("budget-list");
  if (container) container.innerHTML = `<div class="skeleton" style="height:60px;width:100%;"></div>`;

  try {
    const budgetsData = await apiFetch(`/budgets?user_id=${encodeURIComponent(user.id)}`);
    const expensesData = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}&type=expense`);

    if (!budgetsData || budgetsData.length === 0) {
      if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
      return;
    }

    budgets = budgetsData;
    renderBudgetList(budgets, expensesData || []);
  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
  }
}

function renderBudgetList(budgets, expenses = []) {
  const container = document.getElementById("budget-list");
  if (!container) return;

  if (!budgets || !budgets.length) {
    container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
    return;
  }

  container.innerHTML = budgets
    .map((budget) => {
      const spent = (expenses || [])
        .filter((x) => x.category === budget.category)
        .reduce((sum, x) => sum + Math.abs(Number(x.amount || 0)), 0);
      const limit = Number(budget.budget_limit || 1);
      const percent = Math.min((spent / limit) * 100, 100);
      const percentLabel = `${Math.round(percent)}%`;
      const remaining = limit - spent;
      const remainingLabel = remaining >= 0
        ? `${formatCurrency(remaining)} remaining`
        : `${formatCurrency(Math.abs(remaining))} over budget`;

      let fillColor = "var(--mint)";
      let warning = "";
      if (percent >= 100) {
        fillColor = "var(--danger)";
        warning = "⚠️ Budget exceeded";
      } else if (percent >= 90) {
        fillColor = "var(--warning)";
        warning = "⚠️ Almost reached budget limit";
      }

      return `
        <div class="budget-card">
          <div class="budget-card-header">
            <span class="budget-category">${budget.category}</span>
            <span class="budget-month">${budget.month}</span>
          </div>
          <div class="budget-progress">
            <div class="budget-progress-fill" style="width:${percent}%;background:${fillColor};"></div>
          </div>
          <div class="budget-stats">
            <span class="budget-amount">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
            <span class="budget-percent">${percentLabel}</span>
          </div>
          <div class="budget-remaining ${remaining >= 0 ? "remaining-ok" : "remaining-over"}">${remainingLabel}</div>
          ${warning ? `<div class="budget-warning">${warning}</div>` : ""}
          <div class="budget-actions">
            <button class="budget-btn budget-btn-edit" onclick="editBudget('${budget.budget_id}')" title="Edit budget">✏️</button>
            <button class="budget-btn budget-btn-delete" onclick="deleteBudget('${budget.budget_id}')" title="Delete budget">🗑️</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function handleBudgetFormSubmit(event) {
  // Strict validation for all budget fields
  event.preventDefault();
  const user = getStoredUser();

if (!user) {
    showToast("Please login first.", "error");
    return;
}
  try {
    
    const category = document.getElementById("budget-category")?.value?.trim();
    const limitValue = document.getElementById("budget-limit")?.value;
    const month = document.getElementById("budget-month")?.value?.trim();
    if (!category) {
      showToast("Category is required.", "error");
      return;
    }
    if (!month) {
      showToast("Month is required.", "error");
      return;
    }
    if (!limitValue) {
      showToast("Please enter a budget amount.", "error");
      return;
    }
    const budget_limit = Number(limitValue);
    if (!budget_limit || budget_limit <= 0) {
      showToast("Enter a valid budget amount.", "error");
      return;
    }
    const userId = user?.id || user?.user_id;
    if (!userId) {
      showToast("User ID not found. Please log in again.", "error");
      return;
    }

    if (editingBudget) {
      await apiFetch("/budgets", {
        method: "PUT",
        body: JSON.stringify({
          budget_id: editingBudget.budget_id,
          category,
          budget_limit,
          month,
          user_id: userId,
        }),
      });
      editingBudget = null;
      showToast("Budget updated!", "success");
    } else {
      await apiFetch("/budgets", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          category,
          budget_limit,
          month,
        }),
      });
      showToast("Budget added!", "success");
    }
    closeBudgetModal();
    await loadBudgets();
    await loadCategoryBreakdown();
  } catch (err) {
    showToast(err.message || "Failed to save budget.", "error");
}
  }


function editBudget(budgetId) {
  editingBudget = budgets.find((b) => b.budget_id === budgetId);
  if (!editingBudget) return;

  document.getElementById("budget-category").value = editingBudget.category;
  document.getElementById("budget-limit").value = editingBudget.budget_limit;
  document.getElementById("budget-month").value = editingBudget.month;

  const titleEl = document.getElementById("budget-modal-title");
  const btnEl = document.getElementById("budget-modal-btn");
  if (titleEl) titleEl.textContent = "Edit Budget";
  if (btnEl) btnEl.textContent = "Update Budget";

  openBudgetModal();
}

async function deleteBudget(budgetId) {
  const ok = confirm("Delete this budget?");
  if (!ok) return;

  const user = getStoredUser();
  await apiFetch(`/budgets?id=${budgetId}&user_id=${encodeURIComponent(user?.id || "")}`, { method: "DELETE" });

  showToast("Budget deleted!", "success");

  if (editingBudget?.budget_id === budgetId) {
    editingBudget = null;
    const titleEl = document.getElementById("budget-modal-title");
    const btnEl = document.getElementById("budget-modal-btn");
    if (titleEl) titleEl.textContent = "Set Budget";
    if (btnEl) btnEl.textContent = "Save Budget";
  }

  loadBudgets();
  loadDashboardSummary();
  loadCategoryBreakdown();
}

async function loadSavingsGoals() {
  // Goals temporarily disabled for now
  // Only call if user & user.id exist
  // (No-op for now)
  return;

  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("goals-list");
    if (container) container.innerHTML = `<div class="expense-empty">Please log in to view goals.</div>`;
    return;
  }
  const container = document.getElementById("goals-list");
  if (container) container.innerHTML = `<div class="skeleton" style="height:60px;width:100%;"></div>`;

  try {
    const data = await apiFetch(`/goals?user_id=${encodeURIComponent(user.id)}`);
    if (!data || data.length === 0) {
      if (container) container.innerHTML = `<div class="expense-empty">No savings goals yet. Create your first goal!</div>`;
      return;
    }
    savingsGoals = data;
    renderSavingsGoals(data);
  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<div class="expense-empty">No savings goals yet. Create your first goal!</div>`;
  }
}

function renderSavingsGoals(goals) {
  const container = document.getElementById("goals-list");
  if (!container) return;

  if (!goals || !goals.length) {
    container.innerHTML = `<div class="expense-empty">No savings goals yet. Create your first goal!</div>`;
    return;
  }

  container.innerHTML = goals
    .map((goal) => {
      const saved = Number(goal.current_amount || 0);
      const target = Number(goal.target_amount || 1);
      const percent = Math.min((saved / target) * 100, 100);
      const remaining = target - saved;
      const isComplete = saved >= target;

      let fillColor = "var(--mint)";
      let statusLabel = "";
      if (isComplete) {
        fillColor = "var(--mint)";
        statusLabel = `<span class="badge badge-success">🎉 Goal Achieved!</span>`;
      } else if (percent >= 90) {
        fillColor = "var(--warning)";
        statusLabel = `<span class="badge badge-warning">⚠️ Almost there!</span>`;
      } else if (percent >= 50) {
        fillColor = "var(--indigo)";
        statusLabel = `<span class="badge badge-info">💪 Halfway there</span>`;
      } else {
        fillColor = "var(--indigo)";
        statusLabel = `<span class="badge badge-info">🚀 Just started</span>`;
      }

      return `
        <div class="goal-card" style="background:rgba(255,255,255,0.03);border-radius:14px;padding:1rem;margin-bottom:0.75rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
            <div>
              <div style="font-weight:700;font-size:1rem;">${goal.title || "Savings Goal"}</div>
              <div style="font-size:0.8rem;color:var(--muted);">${goal.category || "General"} ${goal.target_date ? `• Target: ${goal.target_date}` : ""}</div>
            </div>
            ${statusLabel}
          </div>
          <div style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;margin-bottom:0.5rem;">
            <div style="width:${percent}%;height:100%;background:${fillColor};transition:width 0.3s ease;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;">
            <span>${formatCurrency(saved)} / ${formatCurrency(target)}</span>
            <span style="font-weight:600;color:${isComplete ? "var(--mint)" : "var(--muted)"};">
              ${isComplete ? "Completed!" : `${Math.round(percent)}% • ${formatCurrency(Math.max(0, remaining))} to go`}
            </span>
          </div>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
            <button class="btn-ghost" onclick="openGoalModal('${goal.goal_id}')" style="flex:1;">✏️ Edit</button>
            <button class="btn-ghost" onclick="addToGoal('${goal.goal_id}')" style="flex:1;">+ Add Savings</button>
            <button class="btn-ghost" onclick="deleteGoal('${goal.goal_id}')" style="flex:1;color:var(--danger);">🗑️ Delete</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openGoalModal(goalId = null) {
  // Goals module temporarily disabled for now
  // (No-op)
  return;

  editingGoal = goalId ? savingsGoals.find((g) => g.goal_id === goalId) : null;

  const titleEl = document.getElementById("goal-modal-title");
  const btnEl = document.getElementById("goal-modal-btn");
  const form = document.getElementById("goal-form");

  if (editingGoal) {
    document.getElementById("goal-title").value = editingGoal.title || "";
    document.getElementById("goal-target").value = editingGoal.target_amount || "";
    document.getElementById("goal-category").value = editingGoal.category || "General";
    document.getElementById("goal-date").value = editingGoal.target_date || "";
    if (titleEl) titleEl.textContent = "Edit Goal";
    if (btnEl) btnEl.textContent = "Update Goal";
  } else {
    form?.reset();
    document.getElementById("goal-category").value = "General";
    if (titleEl) titleEl.textContent = "Add Savings Goal";
    if (btnEl) btnEl.textContent = "Save Goal";
  }

  const modal = document.getElementById("goal-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeGoalModal() {
  editingGoal = null;
  const modal = document.getElementById("goal-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    const form = document.getElementById("goal-form");
    if (form) form.reset();
    const titleEl = document.getElementById("goal-modal-title");
    const btnEl = document.getElementById("goal-modal-btn");
    if (titleEl) titleEl.textContent = "Add Savings Goal";
    if (btnEl) btnEl.textContent = "Save Goal";
  }
}

async function handleGoalFormSubmit(event) {
  event.preventDefault();
  try {
    const user = getStoredUser();
    if (!user) throw new Error("Please log in to add a goal.");

    const title = document.getElementById("goal-title")?.value;
    const target = document.getElementById("goal-target")?.value;
    const category = document.getElementById("goal-category")?.value;
    const target_date = document.getElementById("goal-date")?.value;

    if (!title || !target) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    const target_amount = Number(target);
    if (!target_amount || target_amount <= 0) {
      showToast("Enter a valid target amount.", "error");
      return;
    }

    const payload = {
      user_id: user.id,
      title,
      target_amount,
      category,
      target_date,
      current_amount: editingGoal?.current_amount || 0,
    };

    if (editingGoal) {
      await apiFetch("/goals", {
        method: "PUT",
        body: JSON.stringify({ ...payload, goal_id: editingGoal.goal_id }),
      });
      showToast("Goal updated!", "success");
    } else {
      await apiFetch("/goals", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      showToast("Goal created!", "success");
    }

    closeGoalModal();
    await loadSavingsGoals();
    await loadDashboardSummary();
  } catch (err) {
    showToast(err.message || "Failed to save goal.", "error");
  }
}

async function addToGoal(goalId) {
  const goal = savingsGoals.find((g) => g.goal_id === goalId);
  if (!goal) return;

  const amount = prompt(`Add savings to "${goal.title}". Enter amount:`);
  if (!amount) return;

  const addAmount = Number(amount);
  if (!addAmount || addAmount <= 0) {
    showToast("Enter a valid amount.", "error");
    return;
  }

  try {
    const user = getStoredUser();
    const newAmount = (Number(goal.current_amount) || 0) + addAmount;
    await apiFetch("/goals", {
      method: "PUT",
      body: JSON.stringify({ goal_id: goalId, user_id: user.id, current_amount: newAmount }),
    });
    showToast(`Added ${formatCurrency(addAmount)} to "${goal.title}"!`, "success");
    await loadSavingsGoals();
    await loadDashboardSummary();
  } catch (err) {
    showToast(err.message || "Failed to add savings.", "error");
  }
}

async function deleteGoal(goalId) {
  const ok = confirm("Delete this savings goal?");
  if (!ok) return;

  try {
    const user = getStoredUser();
    await apiFetch(`/goals?id=${goalId}&user_id=${encodeURIComponent(user?.id || "")}`, { method: "DELETE" });
    showToast("Goal deleted!", "success");
    await loadSavingsGoals();
    await loadDashboardSummary();
  } catch (err) {
    showToast(err.message || "Failed to delete goal.", "error");
  }
}

async function loadTransactions() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("recent-transactions");
    if (container) container.innerHTML = `<div class="expense-empty">No transactions found.</div>`;
    return;
  }
  const container = document.getElementById("recent-transactions");
  if (container) container.innerHTML = `<div class="skeleton" style="height:60px;width:100%;"></div>`;
  try {
    const data = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}`);
    if (!data) {
      if (container) container.innerHTML = `<div class="expense-empty">No transactions found.</div>`;
      return;
    }
    transactions = data;
    renderRecentTransactions(data);
  } catch (err) {
    console.warn("Failed to load recent transactions.", err.message);
    if (container) container.innerHTML = `<div class="expense-empty">No transactions found.</div>`;
  }
}

function renderRecentTransactions(items) {
  const container = document.getElementById("recent-transactions");
  if (!container) return;

  const recent = (items || []).slice(-5).reverse();
  if (!recent.length) {
    container.innerHTML = `<div class="expense-empty">No transactions found.</div>`;
    return;
  }

  container.innerHTML = recent
    .map((tx) => {
      const value = Number(tx.amount || 0);
      const isExpense = tx.type && tx.type.toLowerCase() === "expense";
      const sign = isExpense ? "-" : value >= 0 ? "+" : "-";
      return `
        <div class="transaction-row">
          <div>
            <div class="transaction-category">${tx.category || tx.description || "Transaction"}</div>
            <div class="transaction-meta">${tx.month || tx.date || "Today"}</div>
          </div>
          <div class="transaction-amount ${isExpense || value < 0 ? "negative" : "positive"}">
            ${sign}${formatCurrency(Math.abs(value))}
          </div>
        </div>
      `;
    })
    .join("");
}

async function loadReport() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) {
    const container = document.getElementById("report-card");
    if (container) container.innerHTML = `<div class="report-empty">No reports available.</div>`;
    return;
  }

  try {
    const data = await apiFetch(`/dashboard/summary?user_id=${encodeURIComponent(user.id)}&report=true`);
    if (!data) {
      renderReport(null);
      return;
    }
    reportData = data;
    renderReport(data);
  } catch (err) {
    showToast("Failed to load financial report.", "error");
    const container = document.getElementById("report-card");
    if (container) container.innerHTML = `<div class="report-empty">No reports available.</div>`;
  }
}

function renderReport(report) {
  const container = document.getElementById("report-card");
  if (!container) return;

  if (!report) {
    container.innerHTML = `<div class="report-empty">No reports available.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="report-row"><span>Income:</span><strong>${formatCurrency(report.income || 0)}</strong></div>
    <div class="report-row"><span>Expenses:</span><strong>${formatCurrency(report.expenses || 0)}</strong></div>
    <div class="report-row"><span>Savings:</span><strong>${formatCurrency(report.savings || 0)}</strong></div>
    <div class="report-row"><span>Best Category:</span><strong>${report.topCategory || "—"}</strong></div>
    <div class="report-row"><span>Worst Category:</span><strong>${report.highestExpense || "—"}</strong></div>
  `;
}

async function loadFullHistory() {
  if (!Auth.isLoggedIn()) return;
  const user = getStoredUser();
  if (!user) return;

  const container = document.getElementById("full-transaction-list");
  if (!container) return;
  container.innerHTML = `<div class="skeleton" style="height:120px;width:100%;"></div>`;

  try {
    const data = await apiFetch(`/transactions?user_id=${encodeURIComponent(user.id)}`);
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--muted);">
          <div style="font-size:2rem;margin-bottom:0.5rem;">📭</div>
          <p>No transactions yet. Start by adding an expense or income.</p>
        </div>`;
      return;
    }

    const sorted = [...data].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    container.innerHTML = sorted
      .map((tx) => {
        const value = Number(tx.amount || 0);
        const isExpense = tx.type && tx.type.toLowerCase() === "expense";
        const sign = isExpense ? "-" : "+";
        const color = isExpense ? "var(--danger)" : "var(--mint)";
        const typeLabel = isExpense ? "Expense" : "Income";
        return `
          <div class="transaction-row" style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="width:36px;height:36px;border-radius:10px;background:${isExpense ? "rgba(248,113,113,0.12)" : "rgba(62,207,178,0.12)"};display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">
              ${isExpense ? "💸" : "💰"}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:0.9rem;">${tx.category || tx.description || "Transaction"}</div>
              <div style="font-size:0.75rem;color:var(--muted);display:flex;gap:0.5rem;align-items:center;margin-top:0.15rem;">
                <span style="font-size:0.65rem;padding:0.1rem 0.4rem;border-radius:4px;background:${isExpense ? "rgba(248,113,113,0.1)" : "rgba(62,207,178,0.1)"};color:${color};">${typeLabel}</span>
                <span>${tx.date || "—"}</span>
                <span>${tx.description || ""}</span>
              </div>
            </div>
            <div style="font-weight:700;font-size:1rem;color:${color};white-space:nowrap;">${sign}${formatCurrency(Math.abs(value))}</div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.warn("Failed to load full history:", err.message);
    if (container) container.innerHTML = `<div class="expense-empty">Unable to load history. Please try again.</div>`;
  }
}

function renderProfileCard(user) {
  const container = document.getElementById("profile-card");
  if (!container || !user) return;

  const budgetsCreated = budgets.length;
  const expensesAdded = transactions.length;
  const savings = reportData?.savings ?? 0;
  const fullName = user.full_name || user.name || user.email;
  const profileImage = user.profile_image
    ? `<img src="${user.profile_image}" alt="${fullName}" style="width:72px;height:72px;border-radius:18px;object-fit:cover;" />`
    : `<div style="width:72px;height:72px;border-radius:18px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#cbd5e1;">${(fullName || "U")[0].toUpperCase()}</div>`;

  container.innerHTML = `
  
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
      ${profileImage}
      <div>
        <div style="font-size:1.05rem;font-weight:700;color:#fff;">${fullName}</div>
        <div style="color:#94a3b8;font-size:0.9rem;">${user.email}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.8rem;margin-bottom:1rem;">
      <div style="background:rgba(255,255,255,0.04);padding:0.9rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">College</div>
        <div style="font-weight:700;">${user.college || "Not set"}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:0.9rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Course</div>
        <div style="font-weight:700;">${user.course || "Not set"}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:0.9rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Year</div>
        <div style="font-weight:700;">${user.year || "Not set"}</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:0.9rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">City</div>
        <div style="font-weight:700;">${user.city || "Not set"}</div>
      </div>
    </div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">
      <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.85rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Phone</div>
        <div style="font-weight:700;">${user.phone || "Not set"}</div>
      </div>
      <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.85rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Total Savings</div>
        <div style="font-weight:700;">${formatCurrency(savings)}</div>
      </div>
    </div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.85rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Expenses Added</div>
        <div style="font-weight:700;">${expensesAdded}</div>
      </div>
      <div style="flex:1;min-width:120px;background:rgba(255,255,255,0.03);padding:0.85rem;border-radius:14px;">
        <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.35rem;">Budgets Created</div>
        <div style="font-weight:700;">${budgetsCreated}</div>
      </div>
    </div>
    <div style="margin-top:1rem;">
  <button
    class="btn-primary"
    onclick="openEditProfileModal()"
  >
    Edit Profile
  </button>
</div>
  `;
}


/* =====================================================================
   BUDGET — Load & Update Monthly Budget
   ===================================================================== */

async function loadBudget() {
  /*
    TODO (Backend team):
    GET /api/budget/current
    Headers: Authorization: Bearer <token>
    Returns: {
      month: "2025-01",
      totalBudget: 8000,
      categories: [
        { category: "Food", limit: 2500 },
        ...
      ]
    }
  */
  if (!Auth.isLoggedIn()) return;
  try {
    const user = getStoredUser();
    if (!user) {
      const container = document.getElementById("budget-list");
      if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
      return;
    }
    const data = await apiFetch(`/budgets?user_id=${encodeURIComponent(user.id)}`);
    if (!data) {
      const container = document.getElementById("budget-list");
      if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
      return;
    }
    budgets = data;
    renderBudgetList(budgets);
    return budgets;
  } catch (err) {
    console.warn("Failed to load budgets:", err.message);
    const container = document.getElementById("budget-list");
    if (container) container.innerHTML = `<div class="budget-empty">No budgets created yet.</div>`;
  }
}

function openEditProfileModal() {

  const user = currentUser;

  document.getElementById(
    "edit-name"
  ).value = user.full_name || "";

  document.getElementById(
    "edit-phone"
  ).value = user.phone || "";

  document.getElementById(
    "edit-college"
  ).value = user.college || "";

  document.getElementById(
    "edit-course"
  ).value = user.course || "";

  document.getElementById(
    "edit-year"
  ).value = user.year || "";

  document.getElementById(
    "edit-city"
  ).value = user.city || "";

  document
    .getElementById(
      "edit-profile-modal"
    )
    .classList.remove("hidden");

}
function closeEditProfileModal() {

  document
    .getElementById(
      "edit-profile-modal"
    )
    .classList.add("hidden");

}
async function updateBudgetCategory(category, limit) {
  /*
    TODO (Backend team):
    PUT /api/budget/category
    Headers: Authorization: Bearer <token>
    Body:   { category, limit }
    Returns: { category, limit, updatedAt }
  */
  try {
    const user = getStoredUser();
    if (!user) throw new Error("Please log in to update budgets.");

    const month = new Date().toISOString().slice(0, 7);
    const payload = { user_id: user.id, category, budget_limit: Number(limit), month };
    const data = await apiFetch("/budgets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!data) return;
    showToast(`Budget for ${category} saved.`, "success");
    await loadBudgets();
    await loadCategoryBreakdown();
    return data;
  } catch (err) {
    showToast(err.message || "Failed to update budget.", "error");
  }
}


/* Education module is now in data/education.js
   - window.EducationModule.loadContent() renders the cards
   - window.EducationModule.openLesson(id) opens articles/quizzes
   - window.EducationModule.closeLesson() closes the modal
   - window.openArticle(id) / window.openLesson(id) are backward-compatible globals
*/

async function handleEditProfile(e) {
  e.preventDefault();

  try {
    const userId = currentUser?.id || currentUser?.user_id;
    if (!userId) {
      showToast("User ID not found. Please log in again.", "error");
      return;
    }

    const data = await apiFetch("/profile", {
      method: "PUT",
      body: JSON.stringify({
        user_id: userId,
        full_name: document.getElementById("edit-name").value,
        phone: document.getElementById("edit-phone").value,
        college: document.getElementById("edit-college").value,
        course: document.getElementById("edit-course").value,
        year: document.getElementById("edit-year").value,
        city: document.getElementById("edit-city").value,
      }),
    });

    currentUser = data;
    Auth.setUser(data);

    renderProfileCard(data);
    closeEditProfileModal();
    showToast("Profile updated!", "success");

    if (currentScreen === "dashboard") {
      loadDashboardSummary();
      loadCategoryBreakdown();
      loadReport();
    } else {
      renderScreen();
    }
  } catch (err) {
    showToast(err.message || "Failed to update profile", "error");
  }
}
/* =====================================================================
   REAL-TIME — WebSocket / Socket.io
   ===================================================================== */

let socket = null;

function connectSocket() {
  /*
    TODO (Backend team):
    Set up a Socket.io or native WebSocket server.
    Events the frontend listens for:
      "budget:alert"   → { category, spent, limit }
      "expense:added"  → { amount, category }
      "summary:update" → fresh dashboard summary object
  */

  // TODO: uncomment and replace URL once socket server is live
  // socket = io("http://localhost:5000");

  // socket.on("connect", () => console.log("Socket connected:", socket.id));

  // socket.on("budget:alert", (data) => {
  //   showToast(`⚠️ ${data.category} budget ${Math.round((data.spent/data.limit)*100)}% used!`, "error");
  // });

  // socket.on("expense:added", (data) => {
  //   showToast(`New expense: ${formatCurrency(data.amount)} in ${data.category}`, "success");
  //   loadDashboardSummary();
  //   loadCategoryBreakdown();
  // });

  // socket.on("summary:update", (data) => {
  //   renderDashboardMetrics(data);
  // });

  console.log("Socket stub loaded — uncomment connectSocket() body when backend is ready.");
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


/* =====================================================================
   UI UTILITIES
   ===================================================================== */

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slide-out 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function updateNavForLoggedInUser(user) {
  const ctaBtn = document.getElementById("nav-cta-btn");
  const loginBtn = document.getElementById("nav-login-btn");
  const badge = document.getElementById("nav-user-badge");

  if (ctaBtn) {
    ctaBtn.textContent = "Dashboard";
    ctaBtn.onclick = () => scrollToSection("dashboard");
  }

  if (loginBtn) {
    loginBtn.textContent = "Logout";
    loginBtn.onclick = handleLogout;
  }

  if (badge) {
    badge.textContent = `Hello, ${user.name?.split(" ")[0] || user.email} 👋`;
    badge.classList.remove("hidden");
  }
}

function updateNavForGuest() {
  const ctaBtn = document.getElementById("nav-cta-btn");
  const loginBtn = document.getElementById("nav-login-btn");
  const badge = document.getElementById("nav-user-badge");

  if (ctaBtn) {
    ctaBtn.textContent = "Get Started →";
    ctaBtn.onclick = showSignupModal;
  }

  if (loginBtn) {
    loginBtn.textContent = "Login";
    loginBtn.onclick = showLoginModal;
  }

  if (badge) {
    badge.textContent = "";
    badge.classList.add("hidden");
  }
}

function scrollToDashboard() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =====================================================================
   MODAL MANAGEMENT
   ===================================================================== */

function showSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("signup-form").reset();
    document.body.style.overflow = "";
  }
}

function showLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("login-form").reset();
    document.body.style.overflow = "";
  }
}

function openExpenseModal() {
  const modal = document.getElementById("expense-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function openIncomeModal() {
  const modal = document.getElementById("income-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeIncomeModal() {
  editingIncome = null;
  const modal = document.getElementById("income-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("income-amount").value = "";
    document.getElementById("income-category").value = "Allowance";
    document.getElementById("income-description").value = "";
    setIncomeDataField("amount", "");
    setIncomeDataField("category", "Allowance");
    setIncomeDataField("description", "");
    document.body.style.overflow = "";
  }
  const titleEl = document.querySelector("#income-modal .modal-title");
  const btnEl = document.querySelector("#income-modal .modal-button");
  if (titleEl) titleEl.textContent = "Add Income";
  if (btnEl) btnEl.textContent = "Add Income";
}

function openBudgetModal() {
  const modal = document.getElementById("budget-modal");
  if (modal) {
    document.getElementById("budget-form")?.reset();
    document.getElementById("budget-category").value = "Food";
    document.getElementById("budget-limit").value = "";
    const now = new Date();
    document.getElementById("budget-month").value = now.toISOString().slice(0, 7);
    const titleEl = document.getElementById("budget-modal-title");
    const btnEl = document.getElementById("budget-modal-btn");
    if (titleEl) titleEl.textContent = "Set Budget";
    if (btnEl) btnEl.textContent = "Save Budget";
    editingBudget = null;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeBudgetModal() {
  const modal = document.getElementById("budget-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function closeExpenseModal() {
  editingExpense = null;
  const modal = document.getElementById("expense-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").value = "Food";
    document.getElementById("expense-description").value = "";
    setExpenseDataField("amount", "");
    setExpenseDataField("category", "Food");
    setExpenseDataField("description", "");
    document.body.style.overflow = "";
  }
  const titleEl = document.querySelector("#expense-modal .modal-title");
  const btnEl = document.querySelector("#expense-modal .modal-button");
  if (titleEl) titleEl.textContent = "Add Expense";
  if (btnEl) btnEl.textContent = "Add Expense";
}

async function handleSignupFormSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("signup-email").value;
  const name = document.getElementById("signup-name").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (!email || !name || !password || !confirm) {
    showToast("Please fill in all fields.", "error");
    return;
  }
  if (password !== confirm) {
    showToast("Passwords do not match.", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  const success = await handleSignUp({
    full_name: name,
    email,
    password,
  });
  if (success) {
    closeSignupModal();
  }
}

async function handleLoginFormSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  const success = await handleLogin(email, password);
  if (success) {
    closeLoginModal();
  }
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function reRegisterReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  els.forEach((el) => revealObserver.observe(el));
}

function attachRipple(btn) {
  btn.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      border-radius:50%;background:rgba(255,255,255,0.2);
      top:${e.clientY - rect.top - size / 2}px;
      left:${e.clientX - rect.left - size / 2}px;
      transform:scale(0);animation:ripple-anim 0.5s ease forwards;
      pointer-events:none;
    `;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}


/* =====================================================================
   SCROLL OBSERVERS
   ===================================================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);


/* =====================================================================
   INIT
   ===================================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  const style = document.createElement("style");
  style.textContent = `@keyframes ripple-anim { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(style);

  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));
  document.querySelectorAll(".btn-primary, .btn-nav, .btn-ghost").forEach(attachRipple);

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSignupModal();
      closeLoginModal();
      closeIncomeModal();
      closeExpenseModal();
      closeBudgetModal();
      closeEditProfileModal();
      if (window.EducationModule) window.EducationModule.closeLesson();
    }
  });

  // Initialize nav based on auth status
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (err) {
      currentUser = null;
    }
  }

  if (Auth.isLoggedIn()) {
    const user = Auth.getUser() || currentUser;
    if (user) {
      currentUser = await loadUserProfile(user);
      setAppLoggedIn(currentUser);
    } else {
      setAppLoggedOut();
    }
    if (currentUser && window.loadEducationContent) {
      window.loadEducationContent();
    }
    connectSocket();
  } else {
    setAppLoggedOut();
  }
});

async function testConnection() {
  if (!currentUser || typeof supabaseClient === "undefined") return;

  const { data, error } = await supabaseClient
    .from("users")
    .select("*");

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Users:", data);
  }
}

if (currentUser) {
  testConnection();
}
