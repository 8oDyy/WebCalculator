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

document.addEventListener("DOMContentLoaded", () => {
    let currentInput = ""; // Entrée actuelle affichée à l'écran
    let previousInput = ""; // Entrée précédente (utilisée pour les opérations)
    let operator = ""; // Opérateur actuellement sélectionné
    const outputElement = document.getElementById("output");
    const historyList = document.getElementById("history-list"); // Sélectionne l'élément de la liste d'historique

    // Fonction pour mettre à jour l'affichage
    function updateDisplay(value) {
        outputElement.innerText = value;
    }

    // Fonction pour ajouter un calcul à l'historique
    function addToHistory(expression, result) {
        const listItem = document.createElement("li");
        listItem.innerText = `${expression} = ${result}`;
        historyList.appendChild(listItem);
    }

    // Gérer les clics sur les boutons
    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");

            if (!value) return;

            if (!isNaN(value) || value === ".") {
                // Nombres ou point décimal
                if (value === "." && currentInput.includes(".")) return; // Empêcher plusieurs points
                currentInput += value;
                updateDisplay(currentInput);
            } else if (value === "ON/C") {
                // Réinitialiser tout
                currentInput = "";
                previousInput = "";
                operator = "";
                updateDisplay("0");
            } else if (value === "+/-") {
                // Changer le signe
                currentInput = (parseFloat(currentInput) * -1).toString();
                updateDisplay(currentInput);
            } else if (value === "√") {
                // Racine carrée
                currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                //addToHistory("√" + expression, currentInput.toFixed(3));
                updateDisplay(currentInput.toFixed(3));
            } else if (value === "%") {
                // Pourcentage
                currentInput = (parseFloat(currentInput) / 100).toString();
                updateDisplay(currentInput);
            } else if (value === "=") {
                // Calculer le résultat
                if (previousInput && currentInput && operator) {
                    const expression = `${previousInput} ${operator} ${currentInput}`;
                    currentInput = calculate(previousInput, currentInput, operator);
                    addToHistory(expression, currentInput); // Ajouter à l'historique
                    previousInput = "";
                    operator = "";
                    updateDisplay(currentInput);
                }
            } else if (value === "²") {
                // Carré
                currentInput *= currentInput;
                updateDisplay(currentInput.toFixed(3));
            } else if (value === "π") {
                // Multiplication par Pi
                const expression = `${previousInput} ${operator} ${currentInput}`;
                currentInput *= Math.PI;
                addToHistory(expression + "π", currentInput.toFixed(3)); // Ajouter à l'historique
                updateDisplay(currentInput.toFixed(3));
            } else {
                // Opérateurs (+, -, *, /)
                if (currentInput) {
                    if (previousInput) {
                        previousInput = calculate(previousInput, currentInput, operator);
                    } else {
                        previousInput = currentInput;
                    }
                    operator = value;
                    currentInput = "";
                }
            }
        });
    });

    // Fonction pour calculer le résultat
    function calculate(a, b, operator) {
        a = parseFloat(a);
        b = parseFloat(b);
        let result;

        switch (operator) {
            case "+":
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                result = b !== 0 ? a / b : "Error"; // Empêcher la division par 0
                break;
            default:
                result = 0;
        }

        return result !== "Error" ? result.toFixed(3) : result.toString();
    }
});

