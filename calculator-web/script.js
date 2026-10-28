/**
 * Calculator Web App — Core Logic
 * Safe, modular implementation without eval() supporting decimal precision,
 * keyboard shortcuts, error handling, and memory recovery.
 */

class Calculator {
    constructor(previousOperandElement, currentOperandElement, calculatorElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.calculatorElement = calculatorElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
        this.hasError = false;
        this.removeErrorState();
        this.updateDisplay();
    }

    delete() {
        if (this.hasError) {
            this.clear();
            return;
        }
        if (this.resetScreen) return;

        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.hasError) {
            this.clear();
        }
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.hasError) {
            this.clear();
            return;
        }
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        if (this.hasError) return;
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
            case '/':
                if (current === 0) {
                    this.handleError("Division by zero");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Handle floating-point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
        this.updateDisplay();
    }

    formatResult(number) {
        // Round to avoid floating point anomalies while maintaining precision
        if (Number.isInteger(number)) {
            return number.toString();
        }
        // Round to 10 decimal places and strip trailing zeros
        return parseFloat(number.toFixed(10)).toString();
    }

    percentage() {
        if (this.hasError) return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    toggleSign() {
        if (this.hasError) return;
        if (this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
        this.updateDisplay();
    }

    handleError(message) {
        this.hasError = true;
        this.currentOperand = message;
        this.previousOperand = '';
        this.operation = undefined;
        this.calculatorElement.classList.add('error');
        this.updateDisplay();
    }

    removeErrorState() {
        this.hasError = false;
        this.calculatorElement.classList.remove('error');
    }

    getDisplayNumber(number) {
        if (this.hasError) return number;
        const stringNumber = number.toString();
        const parts = stringNumber.split('.');
        const integerDigits = parseFloat(parts[0]);
        const decimalDigits = parts[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.hasError) {
            this.currentOperandElement.innerText = this.currentOperand;
            this.previousOperandElement.innerText = '';
            return;
        }

        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            const displayOp = this.operation === '*' ? '×' : this.operation === '/' ? '÷' : this.operation;
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${displayOp}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize UI elements and Calculator instance
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const calculatorElement = document.querySelector('.calculator');

    const calculator = new Calculator(previousOperandElement, currentOperandElement, calculatorElement);

    // Button Click Listeners
    const buttonsGrid = document.querySelector('.buttons-grid');
    buttonsGrid.addEventListener('click', (event) => {
        const button = event.target;
        if (!button.classList.contains('btn')) return;

        if (button.classList.contains('number')) {
            calculator.appendNumber(button.getAttribute('data-value'));
        } else if (button.classList.contains('operator')) {
            calculator.chooseOperation(button.getAttribute('data-value'));
        } else if (button.getAttribute('data-action') === 'equals') {
            calculator.compute();
        } else if (button.getAttribute('data-action') === 'clear') {
            calculator.clear();
        } else if (button.getAttribute('data-action') === 'delete') {
            calculator.delete();
        } else if (button.getAttribute('data-action') === 'percent') {
            calculator.percentage();
        } else if (button.getAttribute('data-action') === 'sign') {
            calculator.toggleSign();
        }
    });

    // Keyboard Support
    window.addEventListener('keydown', (event) => {
        if ((event.key >= '0' && event.key <= '9') || event.key === '.') {
            calculator.appendNumber(event.key);
        } else if (event.key === '+' || event.key === '-') {
            calculator.chooseOperation(event.key);
        } else if (event.key === '*') {
            calculator.chooseOperation('*');
        } else if (event.key === '/') {
            event.preventDefault(); // Prevent browser quick find
            calculator.chooseOperation('/');
        } else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            calculator.compute();
        } else if (event.key === 'Backspace') {
            calculator.delete();
        } else if (event.key === 'Escape') {
            calculator.clear();
        } else if (event.key === '%') {
            calculator.percentage();
        }
    });
});
