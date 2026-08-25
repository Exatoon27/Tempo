class Calculator {
  constructor() {
    this.currentInput = ""     // What is being typed (Second row of screen)
    this.accumulator = 0       // Confirmed value before the pending operator, in minutes
    this.pendingOp = null      // "+", "-", "x", "÷" o null
    this.justEvaluated = false // True immediately after "=" (the next digit starts with a blank space)
  }

  /**
   * Convert a time string (HH:mm) into a number of minutes.
   * @param {string} time - time in HH:mm.
   * @returns {number} minutes.
   */
  timeToMinutes(time) {
    if (!time) return 0;
    const negative = time.startsWith("-");
    const clean = negative ? time.slice(1) : time;
    let minutes;
    if (clean.includes(":")) {
      const [h, m] = clean.split(":");
      minutes = (Number(h) || 0) * 60 + (Number(m) || 0);
    } else {
      minutes = Number(clean) || 0;
    }
    return negative ? -minutes : minutes;
  }
  
  /**
   * Convert a number of minutos in time and time + days representations.
   * @param {number} totalMin - total minutes.
   * @returns {{full: string, wrapped: string}} full is the HH:mm representation, wrapped is the HH:mm (+Xd) representation if applicable.
   */
  minutesToDisplay(totalMin) {
    const sign = totalMin < 0 ? "-" : "";
    const abs = Math.round(Math.abs(totalMin));
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    const full = `${sign}${h}:${String(m).padStart(2, "0")}`;

    const days = Math.floor(h / 24);
    const remH = h % 24;
    const wrapped =
      days > 0
        ? `${sign}${remH}:${String(m).padStart(2, "0")} (+${days}d)`
        : full;

    return { full, wrapped };
  }

  /** 
   * Adds the specified digit to the input.
   * @param {string} digit 
   */
  digit(digit) {
    if (this.justEvaluated) {
      this.currentInput = "";
      this.justEvaluated = false;
    }
    if (this.currentInput === "0") this.currentInput = ""; // avoid "00"
    this.currentInput += digit;
  }

  /** Adds ":" to the input. */
  colon() {
    if (this.justEvaluated) {
      this.currentInput = "";
      this.justEvaluated = false;
    }
    if (this.currentInput.includes(":")) return; // Only one ":" is allow
    this.currentInput += this.currentInput ? ":" : "0:";
  }

  /** Calculates the percentage of the current input. */
  percent() {
    const value =
      this.currentInput !== "" ? this.timeToMinutes(this.currentInput) : 0;

    if (this.pendingOp === "+" || this.pendingOp === "-") {
      const pct = this.accumulator * (value / 100);
      this.accumulator = this.combine(this.accumulator, pct, this.pendingOp);
    } else if (this.pendingOp === "x" || this.pendingOp === "÷") {
      this.accumulator = this.combine(this.accumulator, value / 100, this.pendingOp);
    } else {
      this.accumulator = this.accumulator * (value / 100);
    }

    this.currentInput = "";
    this.pendingOp = null;
    this.justEvaluated = true;
  }

  /** Removes the last char in the input. */
  backspace() {
    this.currentInput = this.currentInput.slice(0, -1);
  }

  /** Clear the complete input and display.  */
  clear() {
    this.currentInput = "";
    this.accumulator = 0;
    this.pendingOp = null;
    this.justEvaluated = false;
  }

  /** 
   * Sets the operator for the next calculation.
   * @param {"+" | "-" | "x" | "÷"} op - the operator ("+", "-", "x", "÷").
  */
  setOperator(op) {
    if (this.currentInput !== "") {
      const value = this.timeToMinutes(this.currentInput);
      this.accumulator = this.pendingOp
        ? this.combine(this.accumulator, value, this.pendingOp)
        : value;
      this.currentInput = "";
    }
    this.pendingOp = op;
    this.justEvaluated = false;
  }

  /** 
   * Combines two values with the specified operator .
   * @param {number} acc - the accumulated value.
   * @param {number} value - the new value to combine.
   * @param {"+" | "-" | "x" | "÷"} op - the operator ("+", "-", "x", "÷").
   * @returns {number} the result of the operation.
  */
  combine(acc, value, op) {
    switch (op) {
      case "+":
        return acc + value;
      case "-":
        return acc - value;
      case "x":
        return acc * value;
      case "÷":
        return value === 0 ? acc : acc / value;
      default:
        return value;
    }
  }
  
  
  /** Calculates the result of the current operation. */
  equals() {
    if (this.pendingOp && this.currentInput !== "") {
      const value = this.timeToMinutes(this.currentInput);
      this.accumulator = this.combine(this.accumulator, value, this.pendingOp);
    } else if (this.currentInput !== "") {
      this.accumulator = this.timeToMinutes(this.currentInput);
    }
    this.currentInput = "";
    this.pendingOp = null;
    this.justEvaluated = true;
  }

  /** 
   * Returns the current display values.
   * @returns {{bottom: string, topRight: string, topLeft: string}} bottom is the current input, topRight is the full time representation, topLeft is the wrapped time representation.
  */
  getDisplay() {
    const { full, wrapped } = this.minutesToDisplay(this.accumulator);
    return {
      bottom: this.currentInput || "0",
      topRight: full,
      topLeft: wrapped,
    };
  }

  /** 
   * Toggle sign of the input.
   * Note: No implemented in UI.
  */
  toggleSign() {
    if (this.currentInput) {
      this.currentInput = this.currentInput.startsWith("-")
        ? this.currentInput.slice(1)
        : "-" + this.currentInput;
    } else {
      this.accumulator = -this.accumulator;
    }
  } 
}

