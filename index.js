const calcKeys = document.querySelector(".buttons");
const input = document.querySelector("#input");
const calculator = document.querySelector(".calculator");
const result = document.querySelector("#result");
let isEqualPressed = false;
let equation = 0;
let finalResult;
let checkForDecimal = "";

calcKeys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return;

  const key = event.target;
  const keyValue = key.textContent;
  let inputDisplay = input.textContent;
  const { type } = key.dataset;
  const { previousKeyType } = calculator.dataset;

  if (type === "number" && !isEqualPressed) {
    if (inputDisplay === "0") {
      input.textContent =
        previousKeyType === "operator" ? inputDisplay + keyValue : keyValue;
      equation =
        previousKeyType === "operator" ? equation + key.value : key.value;
      checkForDecimal = checkForDecimal + keyValue;
    } else {
      if (checkForDecimal.length >= 19) {
        var replaceNumber = checkForDecimal;
        checkForDecimal = Number(checkForDecimal).toExponential(2);
        input.textContent = inputDisplay.replace(
          replaceNumber,
          checkForDecimal
        );
      } else {
        input.textContent = input.textContent.includes("N")
          ? "NaN"
          : input.textContent.includes("I")
          ? "Infinity"
          : inputDisplay + keyValue;
        equation = equation + key.value;
        checkForDecimal = checkForDecimal + keyValue;
      }
    }
  }

  if (
    type === "operator" &&
    previousKeyType !== "operator" &&
    !inputDisplay.includes("Infinity")
  ) {
    if(isEqualPressed){
        inputDisplay = result.textContent;
        equation = finalResult;
        isEqualPressed = false;
    }
    checkForDecimal = "";
    input.textContent = inputDisplay + " " + keyValue + " ";
    equation = equation + " " + key.value + " ";
  }

  if (
    type === "decimal" &&
    (previousKeyType === "number" || inputDisplay === "0") &&
    !isEqualPressed &&
    !inputDisplay.includes("Infinity")
  ) {
    if (!checkForDecimal.includes(".")) {
      input.textContent = inputDisplay + keyValue;
      equation = equation + key.value;
      checkForDecimal = checkForDecimal + keyValue;
    }
  }

  if ((type === "back" || type === "clear") && inputDisplay !== "0") {
    if (type === "back" && !isEqualPressed) {
      input.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
      equation = equation.substring(0, equation.length - 1);
      checkForDecimal = checkForDecimal.substring(
        0,
        checkForDecimal.length - 1
      );
    } else {
      inputDisplay = "0";
      input.textContent = inputDisplay;
      result.innerHTML = "&nbsp;";
      isEqualPressed = false;
      equation = "";
      checkForDecimal = "";
    }
  }

  if (type === "equal") {
    isEqualPressed = true;
    finalResult = handleEquation(equation);

    if (finalResult || finalResult === 0) {
      result.textContent = !Number.isInteger(finalResult)
        ? finalResult.toFixed(2)
        : finalResult.toString().length >= 16
        ? finalResult.toExponential(2)
        : finalResult;
    } else {
      result.textContent = "Error";
    }
  }

  calculator.dataset.previousKeyType = type;
});

function calculate(firstNumber, operator, secondNumber) {
  firstNumber = Number(firstNumber);
  secondNumber = Number(secondNumber);

  if (operator === "plus" || operator === "+")
    return firstNumber + secondNumber;
  if (operator === "minus" || operator === "-")
    return firstNumber - secondNumber;
  if (operator === "multiply" || operator === "x")
    return firstNumber * secondNumber;
  if (operator === "divide" || operator === "/")
    return firstNumber / secondNumber;
  if (operator === "procent" || operator === "%")
    return firstNumber / 100;
  if (operator === "power" || operator === "^")
    return Math.pow(firstNumber, secondNumber);
}

function handleEquation(equation) {
  equation = equation.split(" ");
  const operators = ["/", "x", "%", "+", "-", "^"];
  let firstNumber;
  let secondNumber;
  let operator;
  let operatorIndex;
  let result;

  for (var i = 0; i < operators.length; i++) {
    while (equation.includes(operators[i])) {
      operatorIndex = equation.findIndex((item) => item === operators[i]);
      firstNumber = equation[operatorIndex - 1];
      operator = equation[operatorIndex];
      secondNumber = equation[operatorIndex + 1];
      result = calculate(firstNumber, operator, secondNumber);
      equation.splice(operatorIndex - 1, 3, result);
    }
  }
  return result;
}

document.addEventListener("keydown", (event) => {
  let getOperators = {
    "/": "divide",
    "x": "multiply",
    "*": "multiply",
    "%": "procent",
    "+": "plus",
    "-": "minus",
    "^": "power",
  };

  if (!isNaN(event.key) && event.key !== " ") {
    document.getElementById(`digit-${event.key}`).click();
  }
  if (["/", "x", "+", "-", "*", "%", "^"].includes(event.key)) {
    document.getElementById(getOperators[event.key]).click();
  }
  if (event.key === "Backspace" || event.key === "c" || event.key === "C") {
    document.getElementById("back").click();
  }
  if (event.key === "=" || event.key === "Enter") {
    document.getElementById("equals").click();
  }
  if (event.key === ".") {
    document.getElementById("decimal").click();
  }
});
