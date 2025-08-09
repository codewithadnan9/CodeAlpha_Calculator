
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
        this.setupKeyboardSupport();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetSign = false;
    }

    delete() {
        if (this.resetSign) return;

        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;

        if (this.resetSign) {
            this.currentOperand = number;
            this.resetSign = false;
        } else {
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.resetSign = true;
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
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetSign = true;
    }

    addDecimalPoint() {
        if (this.resetSign) {
            this.currentOperand = '0.';
            this.resetSign = false;
            return;
        }

        if (this.currentOperand.includes('.')) return;

        this.currentOperand += '.';
    }

    getDisplayNumber(number) {
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

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            const key = e.key;

            // Handle number keys
            if (!isNaN(key) || key === '.') {
                if (key === '.') {
                    this.addDecimalPoint();
                } else {
                    this.appendNumber(key);
                }
                this.updateDisplay();
                return;
            }

            // Handle operation keys
            if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                let operation;
                switch (key) {
                    case '*': operation = '×'; break;
                    case '/': operation = '÷'; break;
                    case '-': operation = '−'; break;
                    default: operation = key;
                }
                this.chooseOperation(operation);
                this.updateDisplay();
                return;
            }

            // Handle equals/Enter key
            if (key === 'Enter' || key === '=') {
                this.compute();
                this.updateDisplay();
                return;
            }

            // Handle backspace/Delete key
            if (key === 'Backspace' || key === 'Delete') {
                this.delete();
                this.updateDisplay();
                return;
            }

            // Handle escape key (clear)
            if (key === 'Escape') {
                this.clear();
                this.updateDisplay();
                return;
            }
        });
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="equals"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="backspace"]');
const decimalButton = document.querySelector('[data-action="decimal"]');
const percentageButton = document.querySelector('[data-action="percentage"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

// Create calculator instance
const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement
);

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');

        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'backspace') {
            calculator.delete();
        } else if (action === 'decimal') {
            calculator.addDecimalPoint();
        } else if (action === 'equals') {
            calculator.compute();
        } else {
            calculator.chooseOperation(button.textContent);
        }

        calculator.updateDisplay();
    });
});
