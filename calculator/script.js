class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  getDisplayNumber(number) {
    if (number === `INCORRECT DATA`) return number;
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      case 'xy':
        computation = prev ** current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
    this.readyToReset = true;
  }

  computeSqrt() {
    if (this.currentOperand < 0) {
      this.currentOperand = `INCORRECT DATA`;
      this.operation = undefined;
      this.previousOperand = '';
      this.readyToReset = true;
    } else {
      let computation;
      const number = parseFloat(this.currentOperand);

      computation = Math.sqrt(number);

      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';
      this.readyToReset = true;
    }
    console.log(this.currentOperand);
  }

  plusNegative() {
    this.currentOperand = -this.currentOperand;
  }

  updateDisplay() {
    console.log(this.operation, this.currentOperand);

    this.currentOperandTextElement.textContent = this.getDisplayNumber(this.currentOperand);

    if (this.operation == 'xy') {
      this.previousOperandTextElement.innerHTML = `${this.previousOperand}<sup>${this
        .currentOperand || 'y'}</sup>`;
    } else if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
    } else [ (this.previousOperandTextElement.innerText = '') ];
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const operationSqrtButton = document.querySelector('[data-operationSqrt]');
const plusNegativeButton = document.querySelector('[data-plus-negative]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (
      calculator.previousOperand === '' &&
      calculator.currentOperand !== '' &&
      calculator.readyToReset
    ) {
      calculator.currentOperand = '';
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

operationSqrtButton.addEventListener('click', () => {
  calculator.computeSqrt();
  calculator.updateDisplay();
});

plusNegativeButton.addEventListener('click', () => {
  calculator.plusNegative();
  calculator.updateDisplay();
});
