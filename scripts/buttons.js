/** @type { HTMLInputElement } */
const screen1RowLeft = document.getElementById("screen1RowLeft");
/** @type { HTMLInputElement } */
const screen1RowRight = document.getElementById("screen1RowRight");
/** @type { HTMLInputElement } */
const screen2Row = document.getElementById("screen2Row");

const calculator = new Calculator()

function render() {
  const { bottom, topRight, topLeft } = calculator.getDisplay();
  screen1RowLeft.value = topLeft;
  screen1RowRight.value = topRight;
  screen2Row.value = bottom;
}

/** @type {Object.<string, ButtonAction>}  */
const buttons = {
    "0": () => calculator.digit(0),
    "1": () => calculator.digit(1),
    "2": () => calculator.digit(2),
    "3": () => calculator.digit(3),
    "4": () => calculator.digit(4),
    "5": () => calculator.digit(5),
    "6": () => calculator.digit(6),
    "7": () => calculator.digit(7),
    "8": () => calculator.digit(8),
    "9": () => calculator.digit(9),
    "sum": () => calculator.setOperator("+"),
    "sub": () => calculator.setOperator("-"),
    "mul": () => calculator.setOperator("x"),
    "div": () => calculator.setOperator("÷"),
    "sep": () => calculator.colon(),
    "per": () => calculator.percent(),
    "clr": () => calculator.clear(),
    "del": () => calculator.backspace(),
    "eql": () => calculator.equals()
}


document.querySelectorAll("#calculator button").forEach(button => {
    button.onclick = () => {
      buttons[button.id]();
      render();
    }
})

window.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) calculator.digit(e.key);
  else if (e.key === ":") calculator.colon();
  else if (e.key === "Backspace") calculator.backspace();
  else if (e.key === "Escape") calculator.clear();
  else if (e.key === "+") calculator.setOperator("+");
  else if (e.key === "-") calculator.setOperator("-");
  else if (e.key === "*") calculator.setOperator("x");
  else if (e.key === "/") calculator.setOperator("÷");
  else if (e.key === "%") calculator.percent();
  else if (e.key === "Enter" || e.key === "=") calculator.equals();
  else return;
  render();
});

render();