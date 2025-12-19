/* assets/js/custom.js */
(function () {
  "use strict";

  // ---------- Random Helper Word ----------
  function randomWord() {
    const words = ["sky", "ocean", "forest", "ember", "pixel", "orbit", "stream", "nova"];
    return words[Math.floor(Math.random() * words.length)];
  }

  
  function setError(el, msg) {
    el.classList.add("is-invalid");
    el.classList.remove("is-valid");

    const errorBox = el.parentElement.querySelector(".error-text");
    if (errorBox) errorBox.textContent = msg;
  }

  function clearError(el) {
    el.classList.remove("is-invalid");
    el.classList.add("is-valid");

    const errorBox = el.parentElement.querySelector(".error-text");
    if (errorBox) errorBox.textContent = "";
  }

  // ---------- Validators ----------
  const onlyLetters = /^[A-Za-zÀ-ž\s'-]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(el) {
    const v = el.value.trim();
    if (!v) return setError(el, "Name cannot be empty");
    if (!onlyLetters.test(v)) return setError(el, "Only letters allowed");
    clearError(el);
  }

  function validateSurname(el) {
    const v = el.value.trim();
    if (!v) return setError(el, "Surname cannot be empty");
    if (!onlyLetters.test(v)) return setError(el, "Only letters allowed");
    clearError(el);
  }

  function validateEmail(el) {
    const v = el.value.trim();
    if (!v) return setError(el, "Email required");
    if (!emailPattern.test(v)) return setError(el, "Invalid email format");
    clearError(el);
  }

  function validateAddress(el) {
    const v = el.value.trim();
    if (!v) return setError(el, "Address required");
    if (v.length < 5) return setError(el, "Address too short");
    clearError(el);
  }

  // ---------- Correct Lithuanian Phone Mask ----------
  function maskPhone(el) {
    let digits = el.value.replace(/\D/g, "");

    // always force Lithuanian prefix
    if (!digits.startsWith("370")) {
      digits = "370" + digits;
    }

    // Correct Lithuanian mobile:
    // +370 6xx xxx xx = 370 + 9 digits = 12 numeric characters total
    digits = digits.substring(0, 12);

    let formatted = "+370 ";

    // Format: +370 6xx xxxxx (country code + 6 + 3 digits + space + 4 digits)
    if (digits.length > 3) formatted += digits[3]; // 6
    if (digits.length > 4) formatted += digits[4]; // x
    if (digits.length > 5) formatted += digits[5]; // x
    if (digits.length > 6) formatted += " " + digits[6]; // space before next group

    if (digits.length > 7) formatted += digits[7]; // x
    if (digits.length > 8) formatted += digits[8]; // x
    if (digits.length > 9) formatted += digits[9]; // x
    if (digits.length > 10) formatted += digits[10]; // x
    if (digits.length > 11) formatted += digits[11]; // x

    el.value = formatted.trim();

    // correct final pattern length is 14 chars: +370 6xx xxxxx
    const validLength = 14;

    if (formatted.length !== validLength) {
      return setError(el, "Phone must be in format +370 6xx xxxxx");
    }

    clearError(el);
  }

  // ---------- Enable Submit When Valid ----------
  function updateSubmitState() {
    const invalids = document.querySelectorAll(".is-invalid");
    const btn = document.getElementById("contact-submit");

    if (invalids.length > 0) {
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }
  }

  // ---------- Form Setup ----------
  const form = document.getElementById("extended-contact-form");
  if (!form) return;

  const f = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    address: document.getElementById("address"),
    message: document.getElementById("message")
  };

  // Attach real-time validation
  f.firstName.addEventListener("input", () => { validateName(f.firstName); updateSubmitState(); });
  f.lastName.addEventListener("input", () => { validateSurname(f.lastName); updateSubmitState(); });
  f.email.addEventListener("input", () => { validateEmail(f.email); updateSubmitState(); });
  f.address.addEventListener("input", () => { validateAddress(f.address); updateSubmitState(); });
  f.phone.addEventListener("input", () => { maskPhone(f.phone); updateSubmitState(); });

  // ---------- Form Submit ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const results = document.getElementById("contact-results");
    results.innerHTML = "";

    const fields = [
      ["Name", f.firstName.value],
      ["Surname", f.lastName.value],
      ["Email", f.email.value],
      ["Phone", f.phone.value],
      ["Address", f.address.value],
      ["Message", f.message.value]
    ];

    fields.forEach(([label, val]) => {
      const div = document.createElement("div");
      div.textContent = `${label}: ${val}`;
      results.appendChild(div);
    });
    // ---------- AVERAGE RATING ----------
const r1 = parseFloat(document.getElementById("rating1").value);
const r2 = parseFloat(document.getElementById("rating2").value);
const r3 = parseFloat(document.getElementById("rating3").value);

// Compute average with 1 decimal place
const avg = ((r1 + r2 + r3) / 3).toFixed(1);

// Create output element
const avgEl = document.createElement("div");
avgEl.classList.add("avg-rating");
avgEl.textContent = `${f.firstName.value} ${f.lastName.value}: ${avg}`;

// Color coding
const avgNumber = parseFloat(avg);
if (avgNumber < 4) {
  avgEl.style.color = "#dc091eff";        // red
} else if (avgNumber < 7) {
  avgEl.style.color = "#f58413ff";        // orange
} else {
  avgEl.style.color = "#0b794bff";        // green
}

results.appendChild(avgEl);


    alert("Form submitted successfully!");
  });

})();

/* File: assets/js/custom.js — APPEND the following block at the end of the existing file */
/* Memory Game module — vanilla JS, self-contained */
(function () {
  "use strict";

  /* ---------- Config & Dataset (>=6 unique items) ---------- */
  // Using emoji set to avoid external assets; each unique item will be duplicated for pairs
  const UNIQUE_ITEMS = ["🦊","🌵","🚀","🍩","🎧","⚽","🧩","🐙","🌈","🎯","🍉","🔔"]; // 12 available -> supports Hard (12 pairs)
  const DIFFICULTY_CONFIG = {
    easy: { cols: 4, rows: 3 }, // 4x3 = 12 cards => 6 pairs
    hard: { cols: 6, rows: 4 }  // 6x4 = 24 cards => 12 pairs
  };

  /* ---------- DOM references ---------- */
  const board = document.getElementById("mg-board");
  const startBtn = document.getElementById("mg-start");
  const restartBtn = document.getElementById("mg-restart");
  const difficultySelect = document.getElementById("mg-difficulty");
  const movesEl = document.getElementById("mg-moves");
  const matchesEl = document.getElementById("mg-matches");
  const winEl = document.getElementById("mg-win");

  if (!board || !startBtn || !restartBtn || !difficultySelect) return;

  /* ---------- State ---------- */
  let cols = 4, rows = 3, cardCount = 12;
  let deck = []; // shuffled array of item IDs (each duplicated)
  let flipped = []; // currently flipped card DOM elements
  let matchedCount = 0;
  let moves = 0;
  let lockBoard = false;
  let started = false;

  /* ---------- Helpers ---------- */
  function shuffle(array) {
    // Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function pickItemsForDifficulty() {
    const pairsNeeded = (cols * rows) / 2;
    const items = UNIQUE_ITEMS.slice(0); // clone
    if (pairsNeeded > items.length) {
      console.warn("Not enough unique items; duplicating available items.");
    }
    const chosen = items.slice(0, pairsNeeded);
    return chosen;
  }

  function buildDeck() {
    const chosen = pickItemsForDifficulty();
    let pairs = [];
    chosen.forEach((it) => {
      pairs.push(it, it);
    });
    deck = shuffle(pairs.slice());
    cardCount = cols * rows;
  }

  function updateStatsDisplay() {
    movesEl.textContent = moves;
    matchesEl.textContent = matchedCount;
  }

  function clearBoardDOM() {
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`;
  }

  function createCardElement(item, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "mg-card";
    wrapper.setAttribute("data-item", item);
    wrapper.setAttribute("data-index", index);
    wrapper.setAttribute("role", "gridcell");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mg-card-btn";
    btn.setAttribute("aria-label", "Memory card");
    btn.setAttribute("aria-pressed", "false");

    const inner = document.createElement("div");
    inner.className = "mg-card-inner";

    const faceFront = document.createElement("div");
    faceFront.className = "mg-face front";
    faceFront.textContent = item;

    const faceBack = document.createElement("div");
    faceBack.className = "mg-face back";
    faceBack.innerHTML = `<span class="back-icon">?</span>`;

    inner.appendChild(faceFront);
    inner.appendChild(faceBack);
    btn.appendChild(inner);
    wrapper.appendChild(btn);

    // click handler
    btn.addEventListener("click", () => handleCardClick(wrapper));

    return wrapper;
  }

  function initBoardDOM() {
    clearBoardDOM();
    deck.forEach((item, idx) => {
      const el = createCardElement(item, idx);
      board.appendChild(el);
    });
  }

  function resetStateCounters() {
    flipped = [];
    matchedCount = 0;
    moves = 0;
    lockBoard = false;
    started = false;
    updateStatsDisplay();
    winEl.hidden = true;
  }

  /* ---------- Game actions ---------- */
  function startGame() {
    if (started) return;
    started = true;
    resetStateCounters(); // also clears previous flips
    setDifficultyGrid();   // grid size may depend on difficulty select
    buildDeck();
    initBoardDOM();
    updateStatsDisplay();
  }

  function restartGame() {
    resetStateCounters();
    buildDeck();
    initBoardDOM();
    updateStatsDisplay();
  }

  function setDifficultyGrid() {
    const val = difficultySelect.value || "easy";
    const cfg = DIFFICULTY_CONFIG[val] || DIFFICULTY_CONFIG.easy;
    cols = cfg.cols;
    rows = cfg.rows;
    cardCount = cols * rows;
    // Ensure we only use up to available UNIQUE_ITEMS pairs (safety)
    const maxPairs = Math.min(UNIQUE_ITEMS.length, (cols*rows)/2);
    if (maxPairs < (cols*rows)/2) {
      console.warn("Difficulty requires more unique items than available; duplicates may appear.");
    }
    board.style.gridTemplateColumns = `repeat(${cols}, minmax(80px, 1fr))`;
  }

  function handleCardClick(cardEl) {
    if (lockBoard) return;
    if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;
    // flip
    cardEl.classList.add("flipped");
    const btn = cardEl.querySelector("button");
    if (btn) btn.setAttribute("aria-pressed", "true");

    flipped.push(cardEl);

    if (flipped.length === 2) {
      moves += 1;
      updateStatsDisplay();
      checkForMatch();
    }
  }

  function checkForMatch() {
    if (flipped.length < 2) return;
    const [a, b] = flipped;
    const itemA = a.getAttribute("data-item");
    const itemB = b.getAttribute("data-item");

    if (itemA === itemB) {
      // match
      a.classList.add("matched");
      b.classList.add("matched");
      matchedCount += 1;
      flipped = [];
      updateStatsDisplay();
      if (matchedCount === (cardCount / 2)) {
        // win
        onWin();
      }
    } else {
      // no match -> flip back after a delay
      lockBoard = true;
      setTimeout(() => {
        flipped.forEach((c) => {
          c.classList.remove("flipped");
          const btn = c.querySelector("button");
          if (btn) btn.setAttribute("aria-pressed", "false");
        });
        flipped = [];
        lockBoard = false;
      }, 1000);
    }
  }

  function onWin() {
    winEl.hidden = false;
    lockBoard = true;
    // small celebration animation (optional)
    winEl.classList.add("won");
  }

  /* ---------- Events ---------- */
  startBtn.addEventListener("click", () => {
    // On start, set difficulty and initialize
    setDifficultyGrid();
    startGame();
  });

  restartBtn.addEventListener("click", () => {
    setDifficultyGrid();
    restartGame();
  });

  difficultySelect.addEventListener("change", () => {
    // When difficulty changes, reinitialize board immediately (reshuffle & reset)
    setDifficultyGrid();
    restartGame();
  });

  // Initialize default (do not auto-start)
  (function initialRender() {
    setDifficultyGrid();
    // show empty grid placeholders for the chosen difficulty to keep layout stable
    clearBoardDOM();
    board.style.minHeight = "120px";
  })();

})();
/* ===== Memory Game – Best Score + Timer Extensions ===== */

(function () {
  "use strict";

  /* DOM references for new elements */
  const timerEl = document.getElementById("mg-timer");
  const bestEasyEl = document.getElementById("mg-best-easy");
  const bestHardEl = document.getElementById("mg-best-hard");

  /* Timer state */
  let timer = 0;
  let timerInterval = null;

  /* Load best scores on page load */
  function loadBestScores() {
    const easy = localStorage.getItem("mg_best_easy");
    const hard = localStorage.getItem("mg_best_hard");

    bestEasyEl.textContent = easy ? easy : "—";
    bestHardEl.textContent = hard ? hard : "—";
  }

  /* Save new best score */
  function updateBestScore(difficulty, moves) {
    const key = difficulty === "easy" ? "mg_best_easy" : "mg_best_hard";
    const currentBest = parseInt(localStorage.getItem(key));

    if (!currentBest || moves < currentBest) {
      localStorage.setItem(key, moves);
      if (difficulty === "easy") bestEasyEl.textContent = moves;
      else bestHardEl.textContent = moves;
    }
  }

  /* Timer helpers */
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function startTimer() {
    timer = 0;
    timerEl.textContent = "00:00";

    timerInterval = setInterval(() => {
      timer++;
      timerEl.textContent = formatTime(timer);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    timer = 0;
    timerEl.textContent = "00:00";
  }

  /* Hook into existing game functions */
  const startBtn = document.getElementById("mg-start");
  const restartBtn = document.getElementById("mg-restart");
  const difficultySelect = document.getElementById("mg-difficulty");

  /* Wrap existing Start logic */
  const originalStart = startBtn.onclick;
  startBtn.onclick = function () {
    resetTimer();
    startTimer();
    if (originalStart) originalStart();
  };

  /* Wrap existing Restart logic */
  const originalRestart = restartBtn.onclick;
  restartBtn.onclick = function () {
    resetTimer();
    startTimer();
    if (originalRestart) originalRestart();
  };

  /* When difficulty changes: reset timer */
  const originalDifficulty = difficultySelect.onchange;
  difficultySelect.onchange = function () {
    resetTimer();
    if (originalDifficulty) originalDifficulty();
  };

  /* Hook into win event */
  const winEl = document.getElementById("mg-win");

  // Use MutationObserver to detect when winEl becomes visible
  const observer = new MutationObserver(() => {
    if (!winEl.hidden) {
      stopTimer();

      // Read current difficulty and moves
      const difficulty = difficultySelect.value;
      const moves = parseInt(document.getElementById("mg-moves").textContent);

      updateBestScore(difficulty, moves);
    }
  });

  observer.observe(winEl, { attributes: true, attributeFilter: ["hidden"] });

  loadBestScores();
})();
