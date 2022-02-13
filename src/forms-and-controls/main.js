/**
 * @param {string} id
 */
function findElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Cannot find element by ID: ${id}`);
  }
  return element;
}

/**
 * @param {string} id
 */
function findInputById(id) {
  const element = findElementById(id);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Element with ID ${id} is not <input>`);
  }
  return element;
}

/**
 * @param {number} amount
 * @returns {[dollars: number, cents: number]}
 */
function splitDollarsAndCents(amount) {
  const dollars = Math.trunc(amount);
  const cents = Math.round(100 * (amount - dollars));
  return [dollars, cents];
}

/**
 * Clamp the given value such that `minVal <= x <= maxVal`.
 * If `x` is `NaN`, return the `fallback` value instead.
 * @param {number} x
 * @param {number} minVal
 * @param {number} maxVal
 * @param {number} fallback
 */
function sanitize(x, minVal, maxVal, fallback) {
  const value = Math.max(Math.min(x, maxVal), minVal);
  return Number.isNaN(value) ? fallback : value;
}

function createApp() {
  const dollarInput = findInputById("dollars");
  const centInput = findInputById("cents");
  const totalEl = findElementById("total");
  const resetButton = findElementById("reset-total");

  // These "private" variables represent our session state.
  let _printAmount = 0;
  let _total = 0;

  // App object, which is effectively our "record set".
  // The first half of two-way data binding (session state -> screen state)
  const app = {
    get printAmount() {
      return _printAmount;
    },
    set printAmount(x) {
      // Basic sanitization (clamp value, fallback to zero if NaN)
      _printAmount = sanitize(x, 0, 10000, 0);

      const [dollars, cents] = splitDollarsAndCents(_printAmount);
      // We don't have to worry about cycles in our two-way data binding.
      // Since programmatically updating DOM properties do not cause events, we
      // get cycle avoidance for free.
      dollarInput.value = String(dollars);
      centInput.value = String(cents);
    },
    get total() {
      return _total;
    },
    set total(x) {
      // Basic sanitization (clamp value, fallback to zero if NaN)
      _total = sanitize(x, 0, 1_000_000_000, 0);

      totalEl.textContent = _total.toFixed(2);
    },
  };

  // The other half of two-way data binding (screen state -> session state)
  function updateDollarsAndCents() {
    // Fowler's article indicates that it's okay to read the screen state
    // (dollarInput.value and centInput.value) in a Forms & Controls architecture.
    const dollars = Number(dollarInput.value);
    const cents = Number(centInput.value);
    app.printAmount = dollars + 0.01 * cents;
  }
  dollarInput.addEventListener("input", updateDollarsAndCents);
  centInput.addEventListener("input", updateDollarsAndCents);

  resetButton.addEventListener("click", () => {
    app.total = 0;
  });

  // We don't need to propagate screen state to session state for the total
  // amount, because the "input" for total amount is technically a regular HTML
  // element and cannot be modified by the user.

  return app;
}

const app = createApp();

// Initialize the session state, which also initializes the screen state via
// data binding.
app.printAmount = 12.34;
app.total = 0;

// Print money every second
setInterval(() => {
  app.total += app.printAmount;
}, 1000);
