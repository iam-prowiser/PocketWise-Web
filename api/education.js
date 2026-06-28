const lessons = [
  {
    id: 1,
    slug: "budgeting-50-30-20",
    title: "The 50/30/20 Rule — A Budget That Actually Works",
    type: "lesson",
    description: "Learn how to split your income across needs, wants, and savings using this simple but powerful framework.",
    content: "The 50/30/20 rule is a simple budgeting framework that divides your after-tax income into three categories:\n\n• 50% for Needs — rent, groceries, utilities, transport, minimum loan payments\n• 30% for Wants — dining out, Netflix, shopping, hobbies, travel\n• 20% for Savings — emergency fund, investments, debt repayment above minimum\n\nStep 1: Calculate your monthly after-tax income.\nStep 2: Track every rupee you spend for a month.\nStep 3: Assign each expense to Needs, Wants, or Savings.\nStep 4: Adjust your habits until you hit the 50/30/20 targets.\n\nPro tips:\n• Use separate bank accounts for needs and savings\n• Automate your savings on payday\n• Review your budget every month and adjust as your income grows",
    readTime: "5 min read",
    bannerEmoji: "💡",
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
    content: "Micro-savings are tiny daily habits that add up to big money over time. Here are 7 you can start today:\n\n1. The 24-Hour Rule — Before buying anything over ₹500, wait 24 hours. Most impulse purchases lose their appeal.\n\n2. Round-Up Savings — Use an app that rounds up every transaction to the nearest ₹10 and saves the difference. You won't miss the spare change.\n\n3. Coffee at Home — Making your own coffee saves ₹100-150 per cup. That's ₹3,000-4,500 per month.\n\n4. Pack Lunch — Eating out costs ₹200-300 per meal. Packing saves ₹4,000-6,000 monthly.\n\n5. No-Spend Days — Pick one day per week where you spend nothing. That's 52 days of savings per year.\n\n6. Negotiate Everything — Your phone plan, internet bill, and rent can often be reduced with a simple phone call.\n\n7. Save Windfalls — Any unexpected money (gifts, bonuses, refunds) goes straight to savings.\n\nOver a year, these habits can save you ₹50,000+ without any major lifestyle change.",
    readTime: "4 min read",
    bannerEmoji: "📈",
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
    bannerEmoji: "🧠",
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
          "Only tracking expenses over ₹500"
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
    content: "Investing means putting your money to work so it grows over time. Here's what every student should know:\n\n• Fixed Deposits (FD) — Safest option. Banks pay 5-7% interest. Money is locked for a fixed period.\n\n• Mutual Funds — A pool of money managed by professionals. SIP (Systematic Investment Plan) lets you start with as little as ₹500/month.\n\n• Stocks — Buying shares of companies. Higher risk, higher reward. Not recommended until you have 6 months of expenses saved.\n\n• Public Provident Fund (PPF) — Government-backed, 7-8% interest, 15-year lock-in. Great for long-term goals.\n\n• Gold — Traditional safe haven. You can buy digital gold or gold ETFs with small amounts.\n\nStudent investing mantra: Start early, start small, stay consistent. A ₹1,000/month SIP from age 20 vs 30 can mean a difference of ₹1 crore at retirement thanks to compounding.",
    readTime: "6 min read",
    bannerEmoji: "📊",
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
    content: "Credit cards are powerful tools if used right, and dangerous if misused.\n\nBenefits:\n• Build your credit score (CIBIL) — essential for future loans\n• Earn rewards, cashback, and travel points\n• Purchase protection and fraud insurance\n• Interest-free period of 45-50 days\n\nDangers:\n• Interest rates of 36-48% per year on unpaid balances\n• Minimum payment trap — paying only the minimum keeps you in debt for years\n• Late payment fees and credit score damage\n\nStudent Rules:\n1. Never spend more than 30% of your credit limit\n2. Pay the FULL bill every month, never just the minimum\n3. Use it only for budgeted expenses, not impulse buys\n4. Set up auto-pay so you never miss a due date\n5. One card is enough — don't juggle multiple cards\n\nA good credit score (750+) can save you lakhs in lower interest rates on future loans.",
    readTime: "5 min read",
    bannerEmoji: "💳",
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
    bannerEmoji: "🏆",
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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  return res.status(200).json(lessons);
}
