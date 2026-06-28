// Finnova Education Module
// Self-contained: data + rendering + quiz logic
// Exposes window.EducationModule for app.js and global functions for HTML onclick

const _LESSONS = [
  {
    id: 1,
    slug: "budgeting-50-30-20",
    title: "The 50/30/20 Rule — A Budget That Actually Works",
    type: "lesson",
    description: "Learn how to split your income across needs, wants, and savings using this simple but powerful framework.",
    content: "The 50/30/20 rule is a simple budgeting framework that divides your after-tax income into three categories:\n\n• 50% for Needs — rent, groceries, utilities, transport, minimum loan payments\n• 30% for Wants — dining out, Netflix, shopping, hobbies, travel\n• 20% for Savings — emergency fund, investments, debt repayment above minimum\n\nStep 1: Calculate your monthly after-tax income.\nStep 2: Track every rupee you spend for a month.\nStep 3: Assign each expense to Needs, Wants, or Savings.\nStep 4: Adjust your habits until you hit the 50/30/20 targets.\n\nPro tips:\n• Use separate bank accounts for needs and savings\n• Automate your savings on payday\n• Review your budget every month and adjust as your income grows",
    readTime: "5 min read",
    bannerEmoji: "\uD83D\uDCA1",
    bannerColor: "rgba(79,110,247,0.15)",
    tagColor: "var(--indigo-light)",
    tagBg: "rgba(79,110,247,0.12)"
  },
  {
    id: 2,
    slug: "micro-savings",
    title: "7 Micro-Saving Habits That Add Up to Thousands",
    type: "tip",
    description: "Small daily choices that compound into serious savings — without feeling like you're sacrificing anything.",
    content: "Micro-savings are tiny daily habits that add up to big money over time. Here are 7 you can start today:\n\n1. The 24-Hour Rule — Before buying anything over \u20B9500, wait 24 hours. Most impulse purchases lose their appeal.\n\n2. Round-Up Savings — Use an app that rounds up every transaction to the nearest \u20B910 and saves the difference. You won't miss the spare change.\n\n3. Coffee at Home — Making your own coffee saves \u20B9100-150 per cup. That's \u20B93,000-4,500 per month.\n\n4. Pack Lunch — Eating out costs \u20B9200-300 per meal. Packing saves \u20B94,000-6,000 monthly.\n\n5. No-Spend Days — Pick one day per week where you spend nothing. That's 52 days of savings per year.\n\n6. Negotiate Everything — Your phone plan, internet bill, and rent can often be reduced with a simple phone call.\n\n7. Save Windfalls — Any unexpected money (gifts, bonuses, refunds) goes straight to savings.\n\nOver a year, these habits can save you \u20B950,000+ without any major lifestyle change.",
    readTime: "4 min read",
    bannerEmoji: "\uD83D\uDCC8",
    bannerColor: "rgba(62,207,178,0.15)",
    tagColor: "var(--mint)",
    tagBg: "rgba(62,207,178,0.12)"
  },
  {
    id: 3,
    slug: "fin-literacy-quiz",
    title: "How financially literate are you? Take the 5-min quiz",
    type: "quiz",
    description: "Test your knowledge on budgeting, saving, UPI safety, and interest rates. Get a personalized score and next steps.",
    content: "Answer five quick questions about budgeting, saving, and spending wisely. Track your score and get feedback for improvement.",
    readTime: "5 questions",
    bannerEmoji: "\uD83E\uDDE0",
    bannerColor: "rgba(251,191,36,0.15)",
    tagColor: "#fbbf24",
    tagBg: "rgba(251,191,36,0.12)",
    questions: [
      {
        question: "What does the 50/30/20 budgeting rule recommend?",
        options: [
          "50% needs, 30% wants, 20% savings",
          "50% savings, 30% needs, 20% wants",
          "50% wants, 30% savings, 20% needs",
          "50% needs, 30% savings, 20% wants"
        ],
        correctIndex: 0
      },
      {
        question: "How many months of expenses should an emergency fund ideally cover?",
        options: ["1 month", "3-6 months", "12 months", "24 months"],
        correctIndex: 1
      },
      {
        question: "What is compound interest?",
        options: [
          "Interest calculated only on the principal amount",
          "Interest earned on both the principal and previously earned interest",
          "A fixed interest rate that never changes",
          "Interest paid at the end of the loan term"
        ],
        correctIndex: 1
      },
      {
        question: "Which is a safe practice when using UPI?",
        options: [
          "Sharing your UPI PIN with friends",
          "Scanning random QR codes to win prizes",
          "Never sharing your UPI PIN or OTP",
          "Clicking on SMS links to update UPI"
        ],
        correctIndex: 2
      },
      {
        question: "What is the best way to track daily expenses?",
        options: [
          "Checking your bank statement once a month",
          "Writing down every expense as it happens",
          "Guessing at the end of the month",
          "Only tracking expenses over \u20B9500"
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: 4,
    slug: "investing-basics",
    title: "Investing 101: Make Your Money Work for You",
    type: "lesson",
    description: "Stocks, mutual funds, FD, and SIP — explained simply for students who want to start investing early.",
    content: "Investing means putting your money to work so it grows over time. Here's what every student should know:\n\n\u2022 Fixed Deposits (FD) \u2014 Safest option. Banks pay 5-7% interest. Money is locked for a fixed period.\n\n\u2022 Mutual Funds \u2014 A pool of money managed by professionals. SIP (Systematic Investment Plan) lets you start with as little as \u20B9500/month.\n\n\u2022 Stocks \u2014 Buying shares of companies. Higher risk, higher reward. Not recommended until you have 6 months of expenses saved.\n\n\u2022 Public Provident Fund (PPF) \u2014 Government-backed, 7-8% interest, 15-year lock-in. Great for long-term goals.\n\n\u2022 Gold \u2014 Traditional safe haven. You can buy digital gold or gold ETFs with small amounts.\n\nStudent investing mantra: Start early, start small, stay consistent. A \u20B91,000/month SIP from age 20 vs 30 can mean a difference of \u20B91 crore at retirement thanks to compounding.",
    readTime: "6 min read",
    bannerEmoji: "\uD83D\uDCCA",
    bannerColor: "rgba(124,92,191,0.15)",
    tagColor: "#c4b5fd",
    tagBg: "rgba(124,92,191,0.12)"
  },
  {
    id: 5,
    slug: "credit-card-smart",
    title: "Credit Cards for Students: Use Smart, Not Hard",
    type: "tip",
    description: "Build your credit score early and avoid the debt trap with these student-friendly credit card habits.",
    content: "Credit cards are powerful tools if used right, and dangerous if misused.\n\nBenefits:\n\u2022 Build your credit score (CIBIL) \u2014 essential for future loans\n\u2022 Earn rewards, cashback, and travel points\n\u2022 Purchase protection and fraud insurance\n\u2022 Interest-free period of 45-50 days\n\nDangers:\n\u2022 Interest rates of 36-48% per year on unpaid balances\n\u2022 Minimum payment trap \u2014 paying only the minimum keeps you in debt for years\n\u2022 Late payment fees and credit score damage\n\nStudent Rules:\n1. Never spend more than 30% of your credit limit\n2. Pay the FULL bill every month, never just the minimum\n3. Use it only for budgeted expenses, not impulse buys\n4. Set up auto-pay so you never miss a due date\n5. One card is enough \u2014 don't juggle multiple cards\n\nA good credit score (750+) can save you lakhs in lower interest rates on future loans.",
    readTime: "5 min read",
    bannerEmoji: "\uD83D\uDCB3",
    bannerColor: "rgba(251,191,36,0.15)",
    tagColor: "#fbbf24",
    tagBg: "rgba(251,191,36,0.12)"
  },
  {
    id: 6,
    slug: "savings-challenge-quiz",
    title: "Smart Money Habits Quiz",
    type: "quiz",
    description: "Test your knowledge on saving strategies, credit scores, and smart spending. Can you score 5/5?",
    content: "Five questions to test your money management skills. Each question covers a real-world financial scenario.",
    readTime: "5 questions",
    bannerEmoji: "\uD83C\uDFC6",
    bannerColor: "rgba(248,113,113,0.15)",
    tagColor: "#f87171",
    tagBg: "rgba(248,113,113,0.12)",
    questions: [
      {
        question: "What is the 'latte factor' in personal finance?",
        options: [
          "Buying coffee every day adds up to thousands over time",
          "The cost of milk in a latte",
          "A coffee shop loyalty program",
          "The temperature at which coffee is best served"
        ],
        correctIndex: 0
      },
      {
        question: "What is a good credit score range in India (CIBIL)?",
        options: ["300-500", "500-650", "650-750", "750-900"],
        correctIndex: 3
      },
      {
        question: "What does 'APR' stand for?",
        options: [
          "Annual Percentage Rate",
          "Annual Payment Receipt",
          "Applied Percentage Rate",
          "Actual Payment Return"
        ],
        correctIndex: 0
      },
      {
        question: "Which investment has the highest potential return over 10 years?",
        options: ["Fixed Deposit", "Savings Account", "Stocks", "Gold"],
        correctIndex: 2
      },
      {
        question: "What percentage of your income should ideally go towards rent?",
        options: ["10% or less", "30% or less", "50% or less", "70% or less"],
        correctIndex: 1
      }
    ]
  }
];

// ----- Education state -----
let _lessonsCache = [];
let _selectedLesson = null;
let _quizScore = null;
let _quizCompleted = false;
let _currentQuestion = 0;
let _quizAnswers = [];

// ----- Helpers -----

function _getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("pw_user") || localStorage.getItem("user") || "null");
  } catch (e) {
    return null;
  }
}

function _formatCurrency(amount) {
  return "\u20B9" + Number(amount).toLocaleString("en-IN");
}

function _showToast(message, type) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast " + (type || "success");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slide-out 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----- Quiz logic -----

function _getQuizBadge(score, total) {
  const pct = (score / total) * 100;
  if (pct === 100) return { emoji: "\uD83C\uDFC6", title: "Money Master", msg: "Perfect score!" };
  if (pct >= 80) return { emoji: "\uD83C\uDF1F", title: "Budget Beginner", msg: "Excellent!" };
  if (pct >= 60) return { emoji: "\uD83D\uDC4D", title: "Saving Starter", msg: "Good job!" };
  if (pct >= 40) return { emoji: "\uD83D\uDCAA", title: "Learning Spender", msg: "Almost there!" };
  return { emoji: "\uD83D\uDCDA", title: "Fresh Wallet", msg: "Keep learning!" };
}

function _renderQuizResult(contentEl) {
  if (!contentEl || !_selectedLesson) return;
  const total = _selectedLesson.questions.length;
  const badge = _getQuizBadge(_quizScore, total);
  const pct = Math.round((_quizScore / total) * 100);
  contentEl.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-emoji">${badge.emoji}</div>
      <div class="quiz-result-score">${_quizScore}/${total}</div>
      <div class="quiz-result-pct">${pct}%</div>
      <div class="quiz-result-msg">${badge.msg}</div>
      <div class="quiz-result-badge">${badge.title}</div>
      <button class="quiz-retry-btn" onclick="EducationModule.resetQuiz()">\uD83D\uDD04 Retry Quiz</button>
    </div>
  `;
}

function _renderQuizContent() {
  const contentEl = document.getElementById("lesson-content");
  if (!contentEl) return;
  if (_quizCompleted || !_selectedLesson) {
    _renderQuizResult(contentEl);
    return;
  }
  const question = _selectedLesson.questions[_currentQuestion];
  if (!question) {
    _finishQuiz();
    return;
  }
  const total = _selectedLesson.questions.length;
  const progress = ((_currentQuestion + 1) / total) * 100;
  contentEl.innerHTML = `
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="quiz-progress-text">Question ${_currentQuestion + 1} of ${total}</div>
    <div class="quiz-question">${question.question}</div>
    <div class="quiz-options">
      ${question.options.map((opt, i) => `
        <button class="quiz-option" onclick="EducationModule.handleQuizAnswer(${i})">${opt}</button>
      `).join("")}
    </div>
  `;
}

function _finishQuiz() {
  if (!_selectedLesson) return;
  const correct = _selectedLesson.questions.filter(
    (q, i) => q.correctIndex === _quizAnswers[i]
  ).length;
  const total = _selectedLesson.questions.length;
  _quizScore = correct;
  _quizCompleted = true;
  const badge = _getQuizBadge(correct, total);
  const userId = _getStoredUser()?.id || "anonymous";
  const completed = JSON.parse(localStorage.getItem("pw_completed_quizzes") || "[]");
  if (!completed.includes(_selectedLesson.id)) {
    completed.push(_selectedLesson.id);
    localStorage.setItem("pw_completed_quizzes", JSON.stringify(completed));
  }
  const quizResults = JSON.parse(localStorage.getItem("pw_quiz_results") || "{}");
  quizResults[_selectedLesson.id] = {
    score: correct,
    total,
    badge: badge.title,
    date: new Date().toISOString().split("T")[0],
    userId,
  };
  localStorage.setItem("pw_quiz_results", JSON.stringify(quizResults));
  _renderQuizContent();
  _renderEducationCards();
}

// ----- Public API -----

window.EducationModule = {
  lessons: _LESSONS,

  loadContent: function loadContent() {
    const container = _getEduGrid();
    if (!container) return;
    container.innerHTML = '<div class="skeleton" style="height:200px;width:100%;"></div>';
    try {
      _lessonsCache = _LESSONS;
      _renderEducationCards();
    } catch (err) {
      console.error("Education load failed:", err);
      container.innerHTML = '<p style="color:#fca5a5;">Failed to load education content.</p>';
    }
  },

  openLesson: function openLesson(id) {
    const lesson = _lessonsCache.find(
      (item) => item.id == id || item.slug === id
    );
    if (!lesson) {
      const fallback = _LESSONS.find(
        (item) => item.id == id || item.slug === id
      );
      if (!fallback) return;
      _lessonsCache = _LESSONS;
      _selectedLesson = fallback;
    } else {
      _selectedLesson = lesson;
    }
    const modal = document.getElementById("lesson-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const titleEl = document.getElementById("lesson-title");
    const descriptionEl = document.getElementById("lesson-description");
    const contentEl = document.getElementById("lesson-content");
    const badgeEl = document.getElementById("lesson-badge");
    if (!_selectedLesson) {
      if (titleEl) titleEl.textContent = "Lesson unavailable.";
      if (descriptionEl) descriptionEl.textContent = "";
      if (contentEl) contentEl.innerHTML = "This lesson is currently unavailable.";
      if (badgeEl) badgeEl.textContent = "";
      return;
    }
    if (titleEl) titleEl.textContent = _selectedLesson.title;
    if (descriptionEl) descriptionEl.textContent = _selectedLesson.description;
    if (_selectedLesson.type === "quiz") {
      if (badgeEl) badgeEl.textContent = "\uD83D\uDCDD Quiz";
      if (contentEl) {
        _currentQuestion = 0;
        _quizAnswers = [];
        _quizScore = null;
        _quizCompleted = false;
        _renderQuizContent();
      }
    } else {
      if (badgeEl) badgeEl.textContent = _selectedLesson.bannerEmoji + " " + (_selectedLesson.type === "tip" ? "Tip" : "Lesson");
      if (contentEl) {
        contentEl.innerHTML = _selectedLesson.content.replace(/\n/g, "<br>");
      }
    }
  },

  closeLesson: function closeLesson() {
    const modal = document.getElementById("lesson-modal");
    if (!modal) return;
    _selectedLesson = null;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    const contentEl = document.getElementById("lesson-content");
    if (contentEl) contentEl.innerHTML = "";
    _currentQuestion = 0;
    _quizAnswers = [];
    _quizScore = null;
    _quizCompleted = false;
  },

  handleQuizAnswer: function handleQuizAnswer(index) {
    _quizAnswers.push(index);
    _currentQuestion++;
    if (_currentQuestion >= _selectedLesson.questions.length) {
      _finishQuiz();
    } else {
      _renderQuizContent();
    }
  },

  resetQuiz: function resetQuiz() {
    _currentQuestion = 0;
    _quizAnswers = [];
    _quizScore = null;
    _quizCompleted = false;
    _renderQuizContent();
  },

  getProgress: function getProgress() {
    const completed = JSON.parse(localStorage.getItem("pw_completed_quizzes") || "[]");
    const results = JSON.parse(localStorage.getItem("pw_quiz_results") || "{}");
    const quizzes = _LESSONS.filter((l) => l.type === "quiz");
    const done = quizzes.filter((q) => completed.includes(q.id));
    return { total: quizzes.length, completed: done.length, results };
  },

  getBadge: function getBadge(score, total) {
    return _getQuizBadge(score, total);
  },
};

function _getEduGrid() {
  return document.querySelector("#pw-app-content #edu-grid") || document.getElementById("edu-grid");
}

function _renderEducationCards() {
  const grid = _getEduGrid();
  if (!grid) return;
  const articles = _lessonsCache.length ? _lessonsCache : _LESSONS;
  if (!articles || articles.length === 0) {
    grid.innerHTML = '<p style="color:#cfeaff;">No lessons available.</p>';
    return;
  }
  grid.innerHTML = "";
  const completedQuizzes = JSON.parse(localStorage.getItem("pw_completed_quizzes") || "[]");
  const quizResults = JSON.parse(localStorage.getItem("pw_quiz_results") || "{}");
  articles.forEach((item, i) => {
    const delay = i > 0 ? "reveal-delay-" + Math.min(i, 4) : "";
    const isQuizCompleted = item.type === "quiz" && completedQuizzes.includes(item.id);
    const result = quizResults[item.id];
    const badgeLabel = result ? result.score + "/" + result.total + " \u00B7 " + result.badge : "";
    const btnLabel = item.type === "quiz" ? (isQuizCompleted ? "Review" : "Start quiz") : "Read";
    grid.innerHTML += `
      <div class="edu-card reveal ${delay}">
        <div class="edu-banner" style="background:${item.bannerColor};">${item.bannerEmoji}</div>
        <div class="edu-body">
          <span class="edu-tag" style="background:${item.tagBg};color:${item.tagColor};">
            ${item.type}${isQuizCompleted ? " \uD83C\uDFC6" : ""}
          </span>
          <div class="edu-title">${item.title}</div>
          <div class="edu-desc">${item.description}</div>
          <div class="edu-footer">
            <span class="edu-read">${item.readTime || "5 min read"}</span>
            <span>
              ${isQuizCompleted ? '<span class="edu-completed">\uD83C\uDFC6 ' + badgeLabel + '</span>' : ""}
              <button class="edu-btn" onclick="EducationModule.openLesson(${item.id})">
                ${btnLabel} \u2192
              </button>
            </span>
          </div>
        </div>
      </div>
    `;
  });
}

// Backward-compatible aliases (for HTML onclick attributes)
window.openArticle = function openArticle(id) {
  window.EducationModule.openLesson(id);
};

window.openLesson = function openLesson(id) {
  window.EducationModule.openLesson(id);
};

window.closeLessonModal = function closeLessonModal() {
  window.EducationModule.closeLesson();
};

window.loadEducationContent = function loadEducationContent() {
  window.EducationModule.loadContent();
};
