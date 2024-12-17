document.addEventListener('DOMContentLoaded', () => {
    const toggleCheckbox = document.getElementById('toggle-darkmode');
    const body = document.body;

    toggleCheckbox.addEventListener('change', () => {
        body.classList.toggle('light-mode');
        document.querySelectorAll('.calculator, .screen, button').forEach(element => {
            element.classList.toggle('light-mode');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById("output");
    const historyList = document.getElementById("history-list");

    let currentInput = ""; // Ce qui est affiché actuellement
    let previousInput = ""; // Entrée précédente
    let operator = ""; // Opérateur sélectionné

    // Mettre à jour l'écran
    function updateDisplay(value) {
        outputElement.innerText = value;
    }

    // Ajouter un calcul à l'historique
    function addToHistory(expression, result) {
        const listItem = document.createElement("li");
        listItem.innerText = `${expression} = ${result}`;
        historyList.appendChild(listItem);
    }

    // Effectuer le calcul
    function calculate(a, b, operator) {
        a = parseFloat(a);
        b = parseFloat(b);
        switch (operator) {
            case "+": return (a + b).toFixed(3);
            case "-": return (a - b).toFixed(3);
            case "*": return (a * b).toFixed(3);
            case "/": return b !== 0 ? (a / b).toFixed(3) : "Error";
            default: return "0";
        }
    }

    // Gérer les clics sur les boutons
    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => handleInput(button.getAttribute("data-value")));
    });

    // Gérer les entrées clavier
    document.addEventListener("keydown", (event) => {
        const validKeys = "0123456789.+-*/=EnterBackspace^pPi";
        if (validKeys.includes(event.key)) {
            if (event.key === "Enter") handleInput("=");
            else if (event.key === "Backspace") handleInput("C");
            else if (event.key.toLowerCase() === "p") handleInput("π");
            else if (event.key === "^") handleInput("²");
            else handleInput(event.key);
        }
    });

    // Gérer les entrées utilisateur
    function handleInput(value) {
        if (!isNaN(value) || value === ".") {
            // Nombres ou point décimal
            if (value === "." && currentInput.includes(".")) return;
            currentInput += value;
            updateDisplay(currentInput);
        } else if (value === "ON/C") {
            // Réinitialisation
            currentInput = "";
            previousInput = "";
            operator = "";
            updateDisplay("0");
        } else if (value === "=") {
            // Calculer le résultat
            if (previousInput && currentInput && operator) {
                const expression = `${previousInput} ${operator} ${currentInput}`;
                currentInput = calculate(previousInput, currentInput, operator);
                addToHistory(expression, currentInput);
                previousInput = "";
                operator = "";
                updateDisplay(currentInput);
            }
        } else if (["+", "-", "*", "/"].includes(value)) {
            // Opérateur
            if (currentInput) {
                if (previousInput) {
                    previousInput = calculate(previousInput, currentInput, operator);
                } else {
                    previousInput = currentInput;
                }
                operator = value;
                currentInput = "";
            }
        } else if (value === "²") {
            // Puissance de 2
            if (currentInput) {
                const expression = `${currentInput}²`;
                currentInput = (parseFloat(currentInput) ** 2).toFixed(3);
                addToHistory(expression, currentInput);
                updateDisplay(currentInput);
            }
        } else if (value === "√") {
            // Racine carrée
            if (currentInput) {
                const expression = `√${currentInput}`;
                currentInput = Math.sqrt(parseFloat(currentInput)).toFixed(3);
                addToHistory(expression, currentInput);
                updateDisplay(currentInput);
            }
        } else if (value === "π") {
            // Constante Pi
            const expression = `${currentInput || 1} * π`;
            currentInput = (parseFloat(currentInput || 1) * Math.PI).toFixed(3);
            addToHistory(expression, currentInput);
            updateDisplay(currentInput);
        }
    }
});
