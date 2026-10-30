/* ============================================================

   MODERN FINANCE — 2026

   COMPLETE JAVASCRIPT

   ============================================================ */

(() => {

  "use strict";

  /* ==========================================================

     CONFIGURATION

     ========================================================== */

  const ENTRY_KEY =

    "aurora_finance_entries_2026";

  const LOGIN_KEY =

    "aurora_finance_logged_in_2026";

  const REMEMBER_KEY =

    "aurora_finance_remember_2026";

  const DELETE_PASSWORD =

    "dash2026";

  /*

   * Demo application login.

   * Change these two values when you want

   * to use your own credentials.

   */

  const LOGIN_EMAIL =

    "sakhiomid714@gmail.com";

  const LOGIN_PASSWORD =

    "dash2026";

  /* ==========================================================

     HELPERS

     ========================================================== */

  const $ = (selector, parent = document) =>

    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>

    Array.from(parent.querySelectorAll(selector));

  /* ==========================================================

     DOM REFERENCES

     ========================================================== */

  const app =

    $("#app");

  const loginScreen =

    $("#loginScreen");

  const loginForm =

    $("#loginForm");

  const loginEmail =

    $("#loginEmail");

  const loginPassword =

    $("#loginPassword");

  const loginError =

    $("#loginError");

  const rememberLogin =

    $("#rememberLogin");

  const quickAdd =

    $("#quickAdd");

  const navButtons =

    $$(".nav button");

  const periodButtons =

    $$(".period button");

  const toast =

    $("#toast");

  const creatorButton =

    $("#creatorButton");

  const profileMenu =

    $("#profileMenu");

  const logoutButton =

    $("#logoutButton");

  const themeToggle =

    $("#themeToggle");

  const profileSettings =

    $("#profileSettings");

  const openProfileFromSettings =

    $("#openProfileFromSettings");

  /* ==========================================================

     PROFILE PHOTO FALLBACK

     The requested file is image/sakhi-profile.jpg.
     If the local folder currently contains the older
     filename image/sakh-profile.jpg, use it automatically.

     ========================================================== */

  const profilePhoto =

    $("#profilePhoto");

  if (profilePhoto) {

    profilePhoto.addEventListener(

      "error",

      () => {

        if (!profilePhoto.dataset.fallbackTried) {

          profilePhoto.dataset.fallbackTried = "true";

          profilePhoto.src = "image/sakh-profile.jpg";

        }

      }

    );

  }

  /* ==========================================================

     TOAST

     ========================================================== */

  let toastTimer;

  function notify(message) {

    if (!toast) {

      return;

    }

    toast.textContent =

      message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =

      setTimeout(() => {

        toast.classList.remove("show");

      }, 2400);

  }

  /* ==========================================================

     SAFE HTML

     ========================================================== */

  function safe(value) {

    return String(value)

      .replace(/[&<>'"]/g, character => {

        const map = {

          "&": "&amp;",

          "<": "&lt;",

          ">": "&gt;",

          "'": "&#39;",

          '"': "&quot;"

        };

        return map[character];

      });

  }

  /* ==========================================================

     LOGIN / LOGOUT

     ========================================================== */

  function isLoggedIn() {

    return (

      localStorage.getItem(LOGIN_KEY) === "true"

    );

  }

  function showApplication() {

    if (loginScreen) {

      loginScreen.classList.add("hidden");

    }

    if (app) {

      app.style.display = "";

    }

    document.body.style.overflowY =

      "auto";

  }

  function showLogin() {

    if (loginScreen) {

      loginScreen.classList.remove("hidden");

    }

    if (app) {

      app.style.display = "none";

    }

    document.body.style.overflow =

      "hidden";

    if (loginEmail) {

      loginEmail.focus();

    }

  }

  function performLogin() {

    const email =

      String(

        loginEmail?.value || ""

      )

      .trim()

      .toLowerCase();

    const password =

      String(

        loginPassword?.value || ""

      );

    if (

      email !== LOGIN_EMAIL.toLowerCase() ||

      password !== LOGIN_PASSWORD

    ) {

      if (loginError) {

        loginError.textContent =

          "Incorrect email or password.";

      }

      return;

    }

    if (loginError) {

      loginError.textContent = "";

    }

    localStorage.setItem(

      LOGIN_KEY,

      "true"

    );

    if (rememberLogin?.checked) {

      localStorage.setItem(

        REMEMBER_KEY,

        "true"

      );

    } else {

      localStorage.removeItem(

        REMEMBER_KEY

      );

    }

    showApplication();

    notify(

      "Welcome to Modern Finance."

    );

  }

  function logout() {

    if (

      !window.confirm(

        "Are you sure you want to log out of Modern Finance?"

      )

    ) {

      return;

    }

    localStorage.removeItem(

      LOGIN_KEY

    );

    profileMenu?.classList.remove(

      "show"

    );

    showLogin();

    notify(

      "You have been logged out."

    );

  }

  loginEmail?.addEventListener("input", () => {
    if (loginError) loginError.textContent = "";
  });
  loginPassword?.addEventListener("input", () => {
    if (loginError) loginError.textContent = "";
  });

  if (loginForm) {

    loginForm.addEventListener(

      "submit",

      event => {

        event.preventDefault();

        performLogin();

      }

    );

  }

  const forgotPassword =

    $("#forgotPassword");

  if (forgotPassword) {

    forgotPassword.addEventListener(

      "click",

      () => {

        window.alert(

          "For this demo version, the login password is:\n\ndash2026\n\nYou can change it in script.js."

        );

      }

    );

  }

  if (logoutButton) {

    logoutButton.addEventListener(

      "click",

      logout

    );

  }

  function getStoredTheme() {

    const savedTheme =

      localStorage.getItem("modern_finance_theme");

    if (savedTheme === "light" || savedTheme === "dark") {

      return savedTheme;

    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  }

  function applyTheme(theme) {

    const nextTheme = theme === "dark" ? "dark" : "light";

    document.body.dataset.theme = nextTheme;

    if (themeToggle) {

      const isDark = nextTheme === "dark";

      themeToggle.setAttribute(

        "aria-label",

        isDark ? "Switch to light mode" : "Switch to dark mode"

      );

      themeToggle.setAttribute(

        "title",

        isDark ? "Switch to light mode" : "Switch to dark mode"

      );

      const icon = themeToggle.querySelector(".toggle-icon");

      const label = themeToggle.querySelector(".toggle-label");

      if (icon) {

        icon.textContent = isDark ? "☀" : "☾";

      }

      if (label) {

        label.textContent = isDark ? "Light" : "Dark";

      }

    }

    localStorage.setItem("modern_finance_theme", nextTheme);

  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

    });

  }

  applyTheme(getStoredTheme());

  /* ==========================================================

     CREATOR PROFILE

     ========================================================== */

  function toggleProfileMenu() {

    if (!profileMenu) {

      return;

    }

    profileMenu.classList.toggle(

      "show"

    );

  }

  if (creatorButton) {

    creatorButton.addEventListener(

      "click",

      event => {

        event.stopPropagation();

        toggleProfileMenu();

      }

    );

  }

  document.addEventListener(

    "click",

    event => {

      if (

        profileMenu &&

        !profileMenu.contains(event.target) &&

        !creatorButton?.contains(event.target)

      ) {

        profileMenu.classList.remove(

          "show"

        );

      }

    }

  );

  if (profileSettings) {

    profileSettings.addEventListener(

      "click",

      () => {

        profileMenu?.classList.remove(

          "open"

        );

        notify(

          "Creator profile settings selected."

        );

      }

    );

  }

  if (openProfileFromSettings) {

    openProfileFromSettings.addEventListener(

      "click",

      () => {

        profileMenu?.classList.add(

          "open"

        );

        creatorButton?.focus();

      }

    );

  }

  /* ==========================================================

     SIDEBAR NAVIGATION

     ========================================================== */

  function activateNavigation(

    button,

    shouldScroll = true

  ) {

    navButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      const view = button.dataset.view || "Overview";
      const targetMap = {
        "Overview": ".hero",
        "Projects": "#projectPortfolioCard",
        "Invoices": "#entriesSection",
        "Expenses": "#expenseMixCard",
        "Cash Flow": "#cashPositionCard",
        "Reports": ".chart-card",
        "Team": "#recentActivityCard",
        "Settings": ".topbar"
      };
      const targetId = button.dataset.target || targetMap[view];
      const breadcrumb = $(".crumb strong");

      if (breadcrumb) {
        breadcrumb.textContent = view === "Overview" ? "Executive overview" : view;
      }

      if (shouldScroll && targetId) {
        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }

      if (window.innerWidth <= 760) {
        document.getElementById("mainContent")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      notify(view + " workspace selected");
    }

    navButtons.forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        activateNavigation(button);
      });
    });

    const sectionMap = [];

  navButtons.forEach(

    button => {

      const targetReference =

        button.dataset.target ||

        ({
          "Overview": ".hero",
          "Projects": "#projectPortfolioCard",
          "Invoices": "#entriesSection",
          "Expenses": "#expenseMixCard",
          "Cash Flow": "#cashPositionCard",
          "Reports": ".chart-card",
          "Team": "#recentActivityCard",
          "Settings": ".topbar"
        }[button.dataset.view || "Overview"]);

      const target = targetReference?.startsWith("#")

        ? document.getElementById(targetReference.slice(1))

        : document.querySelector(targetReference || "");

      if (target) {

        sectionMap.push({

          button,

          target

        });

      }

    }

  );

  if (

    "IntersectionObserver" in window

  ) {

    const observer =

      new IntersectionObserver(

        entries => {

          const visible =

            entries

              .filter(

                entry =>

                  entry.isIntersecting

              )

              .sort(

                (a, b) =>

                  b.intersectionRatio -

                  a.intersectionRatio

              )[0];

          if (!visible) {

            return;

          }

          const found =

            sectionMap.find(

              item =>

                item.target ===

                visible.target

            );

          if (found) {

            navButtons.forEach(

              item =>

                item.classList.remove(

                  "active"

                )

            );

            found.button.classList.add(

              "active"

            );

            const breadcrumb =

              $(".crumb strong");

            if (breadcrumb) {

              breadcrumb.textContent =

                found.button.dataset.view ===

                "Overview"

                  ? "Executive overview"

                  : found.button.dataset.view;

            }

          }

        },

        {

          root: null,

          rootMargin:

            "-18% 0px -65% 0px",

          threshold:

            [0, .2, .5, .8]

        }

      );

    sectionMap.forEach(

      item =>

        observer.observe(

          item.target

        )

    );

  }

  /* ==========================================================

     PERIOD BUTTONS

     ========================================================== */

  periodButtons.forEach(

    button => {

      button.addEventListener(

        "click",

        event => {

          event.preventDefault();

          periodButtons.forEach(

            item =>

              item.classList.remove(

                "active"

              )

          );

          button.classList.add(

            "active"

          );

          notify(

            "Financial period: " +

            button.textContent

          );

        }

      );

    }

  );

  /* ==========================================================

     ENTRIES — LOCAL STORAGE

     ========================================================== */

  function getEntries() {

    try {

      return JSON.parse(

        localStorage.getItem(

          ENTRY_KEY

        ) || "[]"

      );

    } catch {

      return [];

    }

  }

  function saveEntries(

    entries

  ) {

    localStorage.setItem(

      ENTRY_KEY,

      JSON.stringify(entries)

    );

  }

  /* ==========================================================

     MONEY

     ========================================================== */

  function formatMoney(

    amount,

    currency = "USD"

  ) {

    const number =

      Number(amount) || 0;

    try {

      return new Intl.NumberFormat(

        undefined,

        {

          style: "currency",

          currency,

          minimumFractionDigits: 2,

          maximumFractionDigits: 2

        }

      ).format(number);

    } catch {

      return (

        currency +

        " " +

        number.toLocaleString(

          undefined,

          {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

          }

        )

      );

    }

  }

  /*

   * Modern uses the USD figures for its primary

   * KPI cards. Other currencies remain visible

   * in Recent Entries.

   */

  function usdEntries() {

    return getEntries().filter(

      entry =>

        String(

          entry.currency || "USD"

        ).toUpperCase() === "USD"

    );

  }

  /* ==========================================================

     DASHBOARD CALCULATIONS

     ========================================================== */

  function calculateDashboard() {

    const entries =

      usdEntries();

    const invoices =

      entries.filter(

        entry =>

          String(

            entry.type

          ).toLowerCase() ===

          "invoice"

      );

    const expenses =

      entries.filter(

        entry =>

          String(

            entry.type

          ).toLowerCase() ===

          "expense"

      );

    const revenue =

      invoices.reduce(

        (total, entry) =>

          total +

          Number(entry.amount || 0),

        0

      );

    const operatingCosts =

      expenses.reduce(

        (total, entry) =>

          total +

          Number(entry.amount || 0),

        0

      );

    const netProfit =

      revenue -

      operatingCosts;

    const outstandingInvoices =

      invoices.filter(

        entry => {

          const status =

            String(

              entry.status || ""

            ).toLowerCase();

          return (

            status !== "paid" &&

            status !== "completed"

          );

        }

      );

    const outstanding =

      outstandingInvoices.reduce(

        (total, entry) =>

          total +

          Number(entry.amount || 0),

        0

      );

    const margin =

      revenue > 0

        ? (netProfit / revenue) * 100

        : 0;

    const expenseRatio =

      revenue > 0

        ? (operatingCosts / revenue) * 100

        : 0;

    const capital =

      entries

        .filter(

          entry =>

            String(

              entry.type

            ).toLowerCase() ===

            "capital"

        )

        .reduce(

          (total, entry) =>

            total +

            Number(entry.amount || 0),

          0

        );

    const cash =

      revenue +

      capital -

      operatingCosts;

    return {

      entries,

      invoices,

      expenses,

      revenue,

      operatingCosts,

      netProfit,

      outstanding,

      outstandingInvoices,

      margin,

      expenseRatio,

      capital,

      cash

    };

  }

  /* ==========================================================

     KPI RENDERING

     ========================================================== */

  function renderDashboard() {

    const data =

      calculateDashboard();

    const revenueValue =

      $("#totalRevenueValue");

    const revenueSub =

      $("#totalRevenueSub");

    const profitValue =

      $("#netProfitValue");

    const profitSub =

      $("#netProfitSub");

    const outstandingValue =

      $("#outstandingValue");

    const outstandingCount =

      $("#outstandingCount");

    const outstandingSub =

      $("#outstandingSub");

    const costsValue =

      $("#operatingCostsValue");

    const costsSub =

      $("#operatingCostsSub");

    const revenueTrend =

      $("#revenueTrend");

    const profitTrend =

      $("#profitTrend");

    const costTrend =

      $("#costTrend");

    if (revenueValue) {

      revenueValue.textContent =

        formatMoney(

          data.revenue,

          "USD"

        );

    }

    if (revenueSub) {

      revenueSub.textContent =

        data.invoices.length === 0

          ? "No invoice revenue yet"

          : data.invoices.length +

            " invoice" +

            (

              data.invoices.length === 1

                ? ""

                : "s"

            ) +

            " recorded";

    }

    if (revenueTrend) {

      revenueTrend.textContent =

        data.revenue > 0

          ? "Live"

          : "Waiting";

    }

    if (profitValue) {

      profitValue.textContent =

        formatMoney(

          data.netProfit,

          "USD"

        );

    }

    if (profitSub) {

      profitSub.textContent =

        data.revenue > 0

          ? data.margin.toFixed(1) +

            "% net margin"

          : "0.0% net margin";

    }

    if (profitTrend) {

      profitTrend.textContent =

        data.netProfit >= 0

          ? "Positive"

          : "Negative";

      profitTrend.style.color =

        data.netProfit >= 0

          ? "var(--accent2)"

          : "var(--danger)";

    }

    if (outstandingValue) {

      outstandingValue.textContent =

        formatMoney(

          data.outstanding,

          "USD"

        );

    }

    if (outstandingCount) {

      outstandingCount.textContent =

        data.outstandingInvoices.length +

        " invoice" +

        (

          data.outstandingInvoices.length === 1

            ? ""

            : "s"

        );

    }

    if (outstandingSub) {

      outstandingSub.textContent =

        formatMoney(

          data.outstanding,

          "USD"

        ) +

        " currently due";

    }

    if (costsValue) {

      costsValue.textContent =

        formatMoney(

          data.operatingCosts,

          "USD"

        );

    }

    if (costsSub) {

      costsSub.textContent =

        data.revenue > 0

          ? data.expenseRatio.toFixed(1) +

            "% of total revenue"

          : "0% of total revenue";

    }

    if (costTrend) {

      costTrend.textContent =

        data.operatingCosts > 0

          ? "Live"

          : "Waiting";

    }

    renderCash(

      data

    );

    renderExpenseMix(

      data

    );

    renderChart(

      data

    );

  }

  /* ==========================================================

     CASH POSITION

     ========================================================== */

  function renderCash(

    data

  ) {

    const value =

      $("#cashValue");

    const bar =

      $("#cashBar");

    const sub =

      $("#cashSub");

    const health =

      $("#cashHealth");

    if (value) {

      value.textContent =

        formatMoney(

          data.cash,

          "USD"

        );

    }

    const target =

      Math.max(

        1,

        data.revenue ||

        data.operatingCosts ||

        1000

      );

    let percentage =

      Math.round(

        (Math.max(data.cash, 0) /

          target) *

        100

      );

    percentage =

      Math.min(

        100,

        percentage

      );

    if (bar) {

      bar.style.width =

        percentage + "%";

    }

    if (sub) {

      sub.textContent =

        percentage +

        "% of current revenue target";

    }

    if (health) {

      health.textContent =

        data.cash >= 0

          ? "Healthy"

          : "Review";

      health.style.color =

        data.cash >= 0

          ? "var(--accent2)"

          : "var(--danger)";

    }

  }

  /* ==========================================================

     EXPENSE MIX

     ========================================================== */

  function renderExpenseMix(

    data

  ) {

    const donut =

      $("#expenseDonut");

    const breakdown =

      $("#expenseBreakdown");

    if (!donut || !breakdown) {

      return;

    }

    const total =

      data.operatingCosts;

    if (total <= 0) {

      donut.style.background =

        "conic-gradient(var(--line) 0 100%)";

      donut.style.setProperty(

        "--donut-total",

        "$0"

      );

      donut.innerHTML =

        "";

      breakdown.innerHTML =

        `

          <div>

            <span>Expenses</span>

            <b>0%</b>

          </div>

        `;

      return;

    }

    const expensePercent =

      Math.min(

        100,

        Math.round(

          (total /

            Math.max(

              total,

              data.revenue

            )) *

          100

        )

      );

    donut.style.background =

      `

      conic-gradient(

        var(--accent) 0 ${expensePercent}%,

        var(--surface2) ${expensePercent}% 100%

      )

      `;

    donut.innerHTML =

      "";

    const center =

      document.createElement(

        "span"

      );

    center.textContent =

      formatMoney(

        total,

        "USD"

      );

    center.style.cssText = `

      width:91px;

      height:91px;

      border-radius:50%;

      background:var(--surface);

      display:grid;

      place-items:center;

      font-weight:800;

      font-size:14px;

    `;

    donut.appendChild(

      center

    );

    breakdown.innerHTML =

      `

        <div>

          <span>Operating costs</span>

          <b>${expensePercent}%</b>

        </div>

        <div>

          <span>USD expenses</span>

          <b>${formatMoney(total, "USD")}</b>

        </div>

      `;

  }

  /* ==========================================================

     FINANCIAL CHART

     ========================================================== */

  function renderChart(

    data

  ) {

    const revenueLine =

      $("#revenueLine");

    const profitLine =

      $("#profitLine");

    const revenueArea =

      $("#revenueArea");

    const chartEmpty =

      $("#chartEmpty");

    if (

      !revenueLine ||

      !profitLine ||

      !revenueArea

    ) {

      return;

    }

    if (

      data.revenue <= 0 &&

      data.operatingCosts <= 0

    ) {

      revenueLine.setAttribute(

        "d",

        ""

      );

      profitLine.setAttribute(

        "d",

        ""

      );

      revenueArea.setAttribute(

        "d",

        ""

      );

      if (chartEmpty) {

        chartEmpty.style.opacity =

          "1";

      }

      return;

    }

    if (chartEmpty) {

      chartEmpty.style.opacity =

        "0";

    }

    const width =

      800;

    const height =

      190;

    const invoices =

      [...data.invoices]

        .sort(

          (a, b) =>

            new Date(a.date) -

            new Date(b.date)

        );

    const expenses =

      [...data.expenses]

        .sort(

          (a, b) =>

            new Date(a.date) -

            new Date(b.date)

        );

    const points =

      Math.max(

        5,

        invoices.length,

        expenses.length

      );

    const maxValue =

      Math.max(

        data.revenue,

        data.operatingCosts,

        1

      );

    function makePoints(

      values

    ) {

      const result = [];

      for (

        let i = 0;

        i < points;

        i++

      ) {

        const value =

          values[i] ||

          0;

        const x =

          points === 1

            ? 0

            : (i /

                (points - 1)) *

              width;

        const y =

          height -

          (value /

            maxValue) *

          145;

        result.push({

          x,

          y

        });

      }

      return result;

    }

    const revenueValues =

      [];

    let runningRevenue =

      0;

    invoices.forEach(

      entry => {

        runningRevenue +=

          Number(

            entry.amount || 0

          );

        revenueValues.push(

          runningRevenue

        );

      }

    );

    const expenseValues =

      [];

    let runningExpense =

      0;

    expenses.forEach(

      entry => {

        runningExpense +=

          Number(

            entry.amount || 0

          );

        expenseValues.push(

          Math.max(

            0,

            data.revenue -

            runningExpense

          )

        );

      }

    );

    while (

      revenueValues.length <

      points

    ) {

      revenueValues.push(

        data.revenue

      );

    }

    while (

      expenseValues.length <

      points

    ) {

      expenseValues.push(

        Math.max(

          0,

          data.netProfit

        )

      );

    }

    const revenuePoints =

      makePoints(

        revenueValues

      );

    const profitPoints =

      makePoints(

        expenseValues

      );

    function pathFromPoints(

      points

    ) {

      return points

        .map(

          (point, index) =>

            (

              index === 0

                ? "M"

                : "L"

            ) +

            point.x.toFixed(1) +

            " " +

            point.y.toFixed(1)

        )

        .join(" ");

    }

    const revenuePath =

      pathFromPoints(

        revenuePoints

      );

    const profitPath =

      pathFromPoints(

        profitPoints

      );

    revenueLine.setAttribute(

      "d",

      revenuePath

    );

    profitLine.setAttribute(

      "d",

      profitPath

    );

    revenueArea.setAttribute(

      "d",

      revenuePath +

      ` L ${width} 190 L 0 190 Z`

    );

  }

  /* ==========================================================

     ENSURE RECENT ENTRIES CONTAINER

     ========================================================== */

  function ensureEntriesSection() {

    let section =

      $("#entriesSection");

    let entryList =

      $("#entryList");

    if (section && entryList) {

      return entryList;

    }

    const main =

      $("main.main");

    if (!main) {

      return null;

    }

    if (!section) {

      section = document.createElement("section");

      section.className = "card entries-card";

      section.id = "entriesSection";

      section.setAttribute("aria-label", "Recent data entries");

      section.innerHTML = `

        <div class="card-head">

          <div>

            <div class="card-title">Recent entries</div>

            <div class="card-sub">Created financial records and their deletion controls</div>

          </div>

        </div>

        <div id="entryList"></div>

      `;

      main.appendChild(section);

    }

    entryList =

      $("#entryList", section);

    return entryList;

  }

  /* ==========================================================

     RENDER ENTRIES

     ========================================================== */

  function renderEntries() {

    const ensuredList = ensureEntriesSection();

    if (!ensuredList) {

      return;

    }

    const entryList =

      ensuredList;

    const items =

      getEntries()

        .sort(

          (a, b) =>

            new Date(b.date) -

            new Date(a.date)

        );

    if (!items.length) {

      entryList.innerHTML =

        `

          <div class="empty-entries">

            No entries yet. Use

            <strong>New entry</strong>

            to create your first record.

          </div>

        `;

      return;

    }

    entryList.innerHTML =

      items.map(

        item => {

          const type =

            safe(

              item.type || "Entry"

            );

          const name =

            safe(

              item.name || "Unnamed entry"

            );

          const date =

            safe(

              item.date || ""

            );

          const status =

            safe(

              item.status || ""

            );

          const currency =

            safe(

              item.currency || "USD"

            );

          const amount =

            Number(

              item.amount || 0

            ).toLocaleString(

              undefined,

              {

                minimumFractionDigits: 2,

                maximumFractionDigits: 2

              }

            );

          return `

            <div

              class="entry-row"

              data-entry-row="${safe(item.id)}"

            >

              <div class="entry-icon">

                ${safe(

                  String(

                    item.type ||

                    "E"

                  ).charAt(0)

                )}

              </div>

              <div>

                <div class="entry-name">

                  ${name}

                </div>

                <small class="entry-meta">

                  ${type}

                  ·

                  ${date}

                  ·

                  ${status}

                </small>

              </div>

              <div class="entry-money">

                ${currency}

                ${amount}

              </div>

              <button

                type="button"

                class="delete-entry"

                data-delete-entry="${safe(item.id)}"

              >

                Delete

              </button>

            </div>

          `;

        }

      )

      .join("");

    $$(

      "[data-delete-entry]",

      entryList

    ).forEach(

      button => {

        button.addEventListener(

          "click",

          () =>

            deleteEntry(

              button.dataset.deleteEntry

            )

        );

      }

    );

  }

  /* ==========================================================

     DELETE PASSWORD

     ========================================================== */

  function passwordOK(

    action

  ) {

    const value =

      window.prompt(

        action +

        " requires the dashboard password:"

      );

    if (value === null) {

      return false;

    }

    if (

      value !==

      DELETE_PASSWORD

    ) {

      window.alert(

        "Incorrect password. The data was not changed."

      );

      return false;

    }

    return true;

  }

  /* ==========================================================

     DELETE ONE ENTRY

     ========================================================== */

  function deleteEntry(

    id

  ) {

    const items =

      getEntries();

    const item =

      items.find(

        entry =>

          entry.id === id

      );

    if (!item) {

      return;

    }

    if (

      !window.confirm(

        `Delete "${item.name}"?\n\nThis will also update the dashboard totals.`

      )

    ) {

      return;

    }

    if (

      !passwordOK(

        "Deleting this entry"

      )

    ) {

      return;

    }

    const remaining =

      items.filter(

        entry =>

          entry.id !== id

      );

    saveEntries(

      remaining

    );

    renderEntries();

    renderDashboard();

    notify(

      "Entry deleted successfully."

    );

  }

  /* ==========================================================

     DELETE ALL

     ========================================================== */

  function clearAllFinanceData() {
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      const lower = key.toLowerCase();
      const isFinancialKey =
        key === ENTRY_KEY ||
        lower.includes("finance_entries") ||
        lower.includes("financial_entries") ||
        lower.includes("dashboard_entries") ||
        lower.includes("aurora_finance") ||
        lower.includes("modern_finance") ||
        lower.includes("modern_dashboard_data") ||
        lower.includes("modern_dashboard_entries");
      if (isFinancialKey && key !== LOGIN_KEY && key !== REMEMBER_KEY) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.setItem("modern_dashboard_cleared_2026","true");
    const entryList=$("#entryList");
    if(entryList) entryList.innerHTML="";
  }

  const deleteAllEntries = $("#deleteAllEntries");
  if (deleteAllEntries) {
    deleteAllEntries.addEventListener("click", () => {
      if (!window.confirm("Delete ALL financial data from Modern Finance?\n\nThis will clear created records and reset the dashboard overview.")) return;
      if (!passwordOK("Deleting all financial data")) return;
      clearAllFinanceData();
      renderEntries();
      renderDashboard();
      const projectEmpty=$("#projectPortfolioEmpty");
      const activityEmpty=$("#recentActivityEmpty");
      if(projectEmpty) projectEmpty.innerHTML='No project data yet. Use <strong>New entry</strong> to add financial records.';
      if(activityEmpty) activityEmpty.textContent="No recent activity yet. New financial movements will appear here.";
      notify("All financial data has been deleted.");
    });
  }

  /* ==========================================================

     NEW ENTRY MODAL

     ========================================================== */

  function openEntryModal() {

    const backdrop =

      document.createElement(

        "div"

      );

    backdrop.className =

      "modal-backdrop";

    backdrop.innerHTML =

      `

        <div class="entry-modal">

          <div class="modal-header">

            <strong>

              Create new entry

            </strong>

            <button

              type="button"

              class="modal-close"

              data-close

            >

              ×

            </button>

          </div>

          <form

            id="entryForm"

            class="entry-form"

          >

            <div class="entry-form-grid">

              <label>

                Type

                <select name="type">

                  <option>

                    Invoice

                  </option>

                  <option>

                    Project

                  </option>

                  <option>

                    Expense

                  </option>

                  <option>

                    Capital

                  </option>

                  <option>

                    Debit

                  </option>

                </select>

              </label>

              <label>

                Date

                <input

                  name="date"

                  type="date"

                  value="${new Date()

                    .toISOString()

                    .slice(0, 10)}"

                  required

                >

              </label>

              <label>

                Name / description

                <input

                  name="name"

                  required

                  placeholder="Enter a description"

                >

              </label>

              <label>

                Amount

                <input

                  name="amount"

                  required

                  type="number"

                  min="0"

                  step="0.01"

                  placeholder="0.00"

                >

              </label>

              <label>

                Currency

                <select name="currency">

                  <option>

                    USD

                  </option>

                  <option>

                    AFN

                  </option>

                  <option>

                    EUR

                  </option>

                  <option>

                    GBP

                  </option>

                </select>

              </label>

              <label>

                Status

                <select name="status">

                  <option>

                    Pending

                  </option>

                  <option>

                    Paid

                  </option>

                  <option>

                    Completed

                  </option>

                  <option>

                    Active

                  </option>

                  <option>

                    Draft

                  </option>

                </select>

              </label>

            </div>

            <div class="modal-actions">

              <button

                type="button"

                class="modal-cancel"

                data-close

              >

                Cancel

              </button>

              <button

                type="submit"

                class="modal-create"

              >

                Create entry

              </button>

            </div>

          </form>

        </div>

      `;

    document.body.appendChild(

      backdrop

    );

    const modal =

      $(".entry-modal", backdrop);

    const previousBodyOverflow =

      document.body.style.overflow;

    document.body.style.overflow =

      "hidden";

    function close() {

      backdrop.remove();

      document.body.style.overflow =

        previousBodyOverflow;

    }

    $$(

      "[data-close]",

      backdrop

    ).forEach(

      button => {

        button.addEventListener(

          "click",

          close

        );

      }

    );

    backdrop.addEventListener(

      "click",

      event => {

        if (

          event.target ===

          backdrop

        ) {

          close();

        }

      }

    );

    const form =

      $("#entryForm", backdrop);

    form.addEventListener(

      "submit",

      event => {

        event.preventDefault();

        const data =

          new FormData(form);

        const amount =

          Number(

            data.get("amount")

          );

        const name =

          String(

            data.get("name") ||

            ""

          ).trim();

        if (

          !name ||

          !Number.isFinite(amount) ||

          amount <= 0

        ) {

          notify(

            "Please enter a name and valid amount."

          );

          return;

        }

        const items =

          getEntries();

        const entry = {

          id:

            Date.now()

              .toString(36) +

            Math.random()

              .toString(36)

              .slice(2, 8),

          type:

            String(

              data.get("type")

            ),

          date:

            String(

              data.get("date")

            ),

          name,

          amount,

          currency:

            String(

              data.get("currency")

            ),

          status:

            String(

              data.get("status")

            )

        };

        items.unshift(

          entry

        );

        saveEntries(

          items

        );

        renderEntries();

        renderDashboard();

        close();

        notify(

          entry.type +

          " created and added to Recent Entries."

        );

        setTimeout(

          () => {

            document

              .getElementById(

                "entriesSection"

              )

              ?.scrollIntoView({

                behavior: "smooth",

                block: "start"

              });

          },

          100

        );

      }

    );

    setTimeout(

      () => {

        $(

          '[name="name"]',

          backdrop

        )?.focus();

      },

      40

    );

  }

  if (quickAdd) {

    quickAdd.addEventListener(

      "click",

      event => {

        event.preventDefault();

        openEntryModal();

      }

    );

  }

  /* ==========================================================

     SEARCH

     ========================================================== */

  const searchButton =

    $("#searchButton");

  if (searchButton) {

    searchButton.addEventListener(

      "click",

      () => {

        const query =

          window.prompt(

            "Search Modern entries:"

          );

        if (

          query === null ||

          !query.trim()

        ) {

          return;

        }

        const term =

          query

            .trim()

            .toLowerCase();

        const match =

          getEntries().find(

            entry =>

              String(

                entry.name

              )

                .toLowerCase()

                .includes(term) ||

              String(

                entry.type

              )

                .toLowerCase()

                .includes(term)

          );

        if (match) {

          document

            .getElementById(

              "entriesSection"

            )

            ?.scrollIntoView({

              behavior: "smooth"

            });

          notify(

            "Found: " +

            match.name

          );

        } else {

          notify(

            "No matching entry found."

          );

        }

      }

    );

  }

  /* ==========================================================

     NOTIFICATIONS

     ========================================================== */

  const notificationButton =

    $("#notificationButton");

  if (notificationButton) {

    notificationButton.addEventListener(

      "click",

      () => {

        const count =

          getEntries().length;

        notify(

          count +

          " saved financial " +

          (

            count === 1

              ? "entry"

              : "entries"

          ) +

          " available."

        );

      }

    );

  }

  /* ==========================================================

     OTHER BUTTONS

     ========================================================== */

  const insightButton =

    $("#insightButton");

  if (insightButton) {

    insightButton.addEventListener(

      "click",

      () => {

        const data =

          calculateDashboard();

        notify(

          "Net position: " +

          formatMoney(

            data.netProfit,

            "USD"

          )

        );

      }

    );

  }

  const expenseMore =

    $("#expenseMore");

  if (expenseMore) {

    expenseMore.addEventListener(

      "click",

      () => {

        document

          .getElementById(

            "expensesSection"

          )

          ?.scrollIntoView({

            behavior: "smooth"

          });

      }

    );

  }

  const projectButton =

    $("#projectButton");

  if (projectButton) {

    projectButton.addEventListener(

      "click",

      () => {

        document

          .getElementById(

            "projectsSection"

          )

          ?.scrollIntoView({

            behavior: "smooth"

          });

      }

    );

  }

  const activityMore =

    $("#activityMore");

  if (activityMore) {

    activityMore.addEventListener(

      "click",

      () => {

        document

          .getElementById(

            "entriesSection"

          )

          ?.scrollIntoView({

            behavior: "smooth"

          });

      }

    );

  }

  /* ==========================================================

     ESCAPE KEY

     ========================================================== */

  window.addEventListener(

    "keydown",

    event => {

      if (

        event.key ===

        "Escape"

      ) {

        profileMenu?.classList.remove(

          "open"

        );

        const modal =

          document.querySelector(

            ".modal-backdrop"

          );

        if (modal) {

          modal.remove();

          document.body.style.overflow =

            "";

        }

      }

    }

  );

  function enforceEmptyOverviewAfterClear() {
    if (localStorage.getItem("modern_dashboard_cleared_2026") !== "true") return;
    const projectEmpty=$("#projectPortfolioEmpty");
    const activityEmpty=$("#recentActivityEmpty");
    if(projectEmpty) projectEmpty.innerHTML='No project data yet. Use <strong>New entry</strong> to add financial records.';
    if(activityEmpty) activityEmpty.textContent="No recent activity yet. New financial movements will appear here.";
  }

  /* ==========================================================

     START APPLICATION

     ========================================================== */

  function initialize() {

    renderEntries();

    renderDashboard();

    enforceEmptyOverviewAfterClear();

    /*

     * Existing saved login is respected.

     * If the user has not logged in, the

     * login screen is displayed.

     */

    if (isLoggedIn()) {

      showApplication();

    } else {

      showLogin();

    }

  }

  initialize();

})();
