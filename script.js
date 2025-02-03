const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// Set initial slider and strength indicator
handleSlider();
setIndicator("#ccc");

// Function to update slider UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = `${((passwordLength - min) * 100) / (max - min)}% 100%`;
}

// Function to set strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Function to generate a random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Character generators
const generateRandomNumber = () => getRndInteger(0, 9);
const generateLowerCase = () => String.fromCharCode(getRndInteger(97, 123));
const generateUpperCase = () => String.fromCharCode(getRndInteger(65, 91));
const generateSymbol = () => symbols.charAt(getRndInteger(0, symbols.length));

// Function to calculate password strength
function calcStrength() {
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNum = numbersCheck.checked;
    const hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // Strong
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // Medium
    } else {
        setIndicator("#f00"); // Weak
    }
}

// Function to copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch {
        copyMsg.innerText = "Failed!";
    }

    copyMsg.classList.add("active");
    setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

// Function to shuffle characters in the password (Fisher-Yates shuffle)
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

// Checkbox change event listener
function handleCheckBoxChange() {
    checkCount = [...allCheckBox].filter(checkbox => checkbox.checked).length;
    
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Add event listeners for checkboxes
allCheckBox.forEach(checkbox => checkbox.addEventListener("change", handleCheckBoxChange));

// Update password length when slider is changed
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Copy password to clipboard
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

// Generate password logic
generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    password = "";

    // Add at least one of each selected character type
    funcArr.forEach(func => (password += func()));

    // Fill remaining characters
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        password += funcArr[getRndInteger(0, funcArr.length)]();
    }

    // Shuffle and update UI
    password = shufflePassword([...password]);
    passwordDisplay.value = password;
    
    // Calculate and display strength
    calcStrength();
});
