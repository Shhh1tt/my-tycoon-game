// Master Game State Object
let gameData = {
    money: 0,
    moneyPerSecond: 0,
    moneyPerClick: 1,
    totalEarned: 0,
    totalStaff: 0,
    bonusMultiplier: 1.0, // 1.0 means 100% normal income

    clickUpgradeCost: 50,
    devCost: 15,
    leadCost: 200,
    serverCost: 1500,

    byteCoinsOwned: 0,
    achievements: {
        firstCode: false,
        techStartup: false,
        cryptoWhale: false
    }
};

// Market Engine Variable
let byteCoinPrice = 100;

// Gather DOM targets
const moneyDisplay = document.getElementById('money-display');
const mpsDisplay = document.getElementById('mps-display');
const mpcDisplay = document.getElementById('mpc-display');
const bonusDisplay = document.getElementById('bonus-display');

const clickUpgradeCostDisplay = document.getElementById('click-upgrade-cost');
const devCostDisplay = document.getElementById('dev-cost');
const leadCostDisplay = document.getElementById('lead-cost');
const serverCostDisplay = document.getElementById('server-cost');

const coinPriceDisplay = document.getElementById('coin-price');
const coinOwnedDisplay = document.getElementById('coin-owned');

const clickBtn = document.getElementById('click-btn');
const actionZone = document.getElementById('action-zone');

// Manual Action + Floating Visual System
clickBtn.addEventListener('click', (e) => {
    let earned = Math.floor(gameData.moneyPerClick * gameData.bonusMultiplier);
    gameData.money += earned;
    gameData.totalEarned += earned;
    
    createFloatingText(e, `+$${earned}`);
    checkAchievements();
    updateDisplay();
});

function createFloatingText(e, text) {
    const floater = document.createElement('div');
    floater.className = 'floating-number';
    floater.innerText = text;

    // Calculate coordinate space relative to action-zone
    const rect = actionZone.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;

    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;

    actionZone.appendChild(floater);

    // Wipe from memory after animation ends
    setTimeout(() => {
        floater.remove();
    }, 800);
}

// Shop Purchasing Logistics
document.getElementById('buy-click-upgrade-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.clickUpgradeCost) {
        gameData.money -= gameData.clickUpgradeCost;
        gameData.moneyPerClick += 1;
        gameData.clickUpgradeCost = Math.floor(gameData.clickUpgradeCost * 1.8);
        updateDisplay();
    }
});

document.getElementById('buy-dev-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.devCost) {
        gameData.money -= gameData.devCost;
        gameData.moneyPerSecond += 1;
        gameData.totalStaff += 1;
        gameData.devCost = Math.floor(gameData.devCost * 1.5);
        checkAchievements();
        updateDisplay();
    }
});

document.getElementById('buy-lead-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.leadCost) {
        gameData.money -= gameData.leadCost;
        gameData.moneyPerSecond += 15;
        gameData.totalStaff += 1;
        gameData.leadCost = Math.floor(gameData.leadCost * 1.5);
        checkAchievements();
        updateDisplay();
    }
});

document.getElementById('buy-server-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.serverCost) {
        gameData.money -= gameData.serverCost;
        gameData.moneyPerSecond += 100;
        gameData.serverCost = Math.floor(gameData.serverCost * 1.6);
        updateDisplay();
    }
});

// ByteCoin Live Crypto Market Mechanics
document.getElementById('buy-coin-btn').addEventListener('click', () => {
    if (gameData.money >= byteCoinPrice) {
        gameData.money -= byteCoinPrice;
        gameData.byteCoinsOwned += 1;
        updateDisplay();
    }
});

document.getElementById('sell-coin-btn').addEventListener('click', () => {
    if (gameData.byteCoinsOwned > 0) {
        let returnCash = gameData.byteCoinsOwned * byteCoinPrice;
        gameData.money += returnCash;
        gameData.totalEarned += returnCash;
        gameData.byteCoinsOwned = 0;
        checkAchievements();
        updateDisplay();
    }
});

function updateMarketPrice() {
    // Generate random swing between -25% and +30%
    let changePercent = (Math.random() * 55 - 25) / 100;
    byteCoinPrice = Math.floor(byteCoinPrice * (1 + changePercent));
    
    // Prevent price crashing to zero
    if (byteCoinPrice < 10) byteCoinPrice = 10;
    
    coinPriceDisplay.innerText = `$${byteCoinPrice}`;
}

// Accomplishments System
function checkAchievements() {
    let unlockedCount = 0;

    if (!gameData.achievements.firstCode && gameData.totalEarned >= 100) {
        gameData.achievements.firstCode = true;
    }
    if (!gameData.achievements.techStartup && gameData.totalStaff >= 5) {
        gameData.achievements.techStartup = true;
    }
    if (!gameData.achievements.cryptoWhale && gameData.totalEarned >= 5000) {
        gameData.achievements.cryptoWhale = true;
    }

    // Process unlocked cards styles and bonuses
    if (gameData.achievements.firstCode) { updateAchCard('ach-1'); unlockedCount++; }
    if (gameData.achievements.techStartup) { updateAchCard('ach-2'); unlockedCount++; }
    if (gameData.achievements.cryptoWhale) { updateAchCard('ach-3'); unlockedCount++; }

    // Every unlocked milestone gives +10% boost stacked
    gameData.bonusMultiplier = 1.0 + (unlockedCount * 0.1);
}

function updateAchCard(id) {
    const card = document.getElementById(id);
    if(card && card.classList.contains('locked')) {
        card.classList.remove('locked');
        card.classList.add('unlocked');
    }
}

// Render values on elements
function updateDisplay() {
    moneyDisplay.innerText = gameData.money;
    mpsDisplay.innerText = Math.floor(gameData.moneyPerSecond * gameData.bonusMultiplier);
    mpcDisplay.innerText = Math.floor(gameData.moneyPerClick * gameData.bonusMultiplier);
    bonusDisplay.innerText = Math.round((gameData.bonusMultiplier - 1) * 100);
    
    clickUpgradeCostDisplay.innerText = gameData.clickUpgradeCost;
    devCostDisplay.innerText = gameData.devCost;
    leadCostDisplay.innerText = gameData.leadCost;
    serverCostDisplay.innerText = gameData.serverCost;

    coinOwnedDisplay.innerText = gameData.byteCoinsOwned;
}

// Core Storage Automation
document.getElementById('save-btn').addEventListener('click', saveGame);
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Reset company matrix? All progress will disappear!")) {
        localStorage.removeItem("siliconEmpireProSave");
        location.reload();
    }
});

function saveGame() {
    localStorage.setItem("siliconEmpireProSave", JSON.stringify(gameData));
}

function loadGame() {
    let saved = localStorage.getItem("siliconEmpireProSave");
    if (saved !== null) {
        gameData = JSON.parse(saved);
        checkAchievements();
        updateDisplay();
    }
}

// Core Clock Loops
setInterval(() => {
    gameData.money += Math.floor((gameData.moneyPerSecond * gameData.bonusMultiplier) / 10);
    updateDisplay();
}, 100); // 10 ticks per second for smooth generation visuals

setInterval(updateMarketPrice, 4000); // Cryptomarket changes value every 4s
setInterval(saveGame, 15000);        // Backup auto-save engine running every 15s

// Initialize State Setup
loadGame();
updateDisplay();

