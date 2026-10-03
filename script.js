// Master Game State Object
let gameData = {
    money: 0,
    moneyPerSecond: 0,
    gameMps: 0,
    moneyPerClick: 1,
    totalEarned: 0,
    totalStaff: 0,
    bonusMultiplier: 1.0,

    clickUpgradeCost: 50,
    devCost: 15,
    leadCost: 200,
    serverCost: 1500,

    // Stocks/Crypto Engine
    btcOwned: 0,
    nvdaOwned: 0,
    memeOwned: 0,

    // Prestige Module
    prestigeChips: 0,

    achievements: {
        firstCode: false,
        techStartup: false,
        cryptoWhale: false
    },
    
    // Time Tracking stamp
    lastSavedTime: Date.now()
};

// Asset Tracker Prices
let stockPrices = { btc: 100, nvda: 350, meme: 10 };

// Gather DOM nodes
const moneyDisplay = document.getElementById('money-display');
const mpsDisplay = document.getElementById('mps-display');
const mpcDisplay = document.getElementById('mpc-display');
const bonusDisplay = document.getElementById('bonus-display');

const clickUpgradeCostDisplay = document.getElementById('click-upgrade-cost');
const devCostDisplay = document.getElementById('dev-cost');
const leadCostDisplay = document.getElementById('lead-cost');
const serverCostDisplay = document.getElementById('server-cost');

const actionZone = document.getElementById('action-zone');
const clickBtn = document.getElementById('click-btn');

// Prestige Elements
const chipsOwnedDisplay = document.getElementById('chips-owned');
const chipsPendingDisplay = document.getElementById('chips-pending');
const prestigeBtn = document.getElementById('prestige-btn');

// Manual Action Handler
clickBtn.addEventListener('click', (e) => {
    let prestigeBonus = 1.0 + (gameData.prestigeChips * 0.20);
    let earned = Math.floor(gameData.moneyPerClick * gameData.bonusMultiplier * prestigeBonus);
    gameData.money += earned;
    gameData.totalEarned += earned;
    
    createFloatingText(e, `+$${earned}`);
    checkAchievements();
    calculatePendingChips();
    updateDisplay();
});

function createFloatingText(e, text) {
    const floater = document.createElement('div');
    floater.className = 'floating-number';
    floater.innerText = text;

    const rect = actionZone.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;

    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;

    actionZone.appendChild(floater);
    setTimeout(() => floater.remove(), 800);
}

// Store Purchases Upgrades Logistics
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

// Advanced Trading Portfolio Action Hooks
function setupMarketTrade(asset, buyId, sellId) {
    document.getElementById(buyId).addEventListener('click', () => {
        if (gameData.money >= stockPrices[asset]) {
            gameData.money -= stockPrices[asset];
            gameData[`${asset}Owned`]++;
            updateDisplay();
        }
    });
    document.getElementById(sellId).addEventListener('click', () => {
        if (gameData[`${asset}Owned`] > 0) {
            let payout = gameData[`${asset}Owned`] * stockPrices[asset];
            gameData.money += payout;
            gameData.totalEarned += payout;
            gameData[`${asset}Owned`] = 0;
            checkAchievements();
            calculatePendingChips();
            updateDisplay();
        }
    });
}
setupMarketTrade('btc', 'buy-btc-btn', 'sell-btc-btn');
setupMarketTrade('nvda', 'buy-nvda-btn', 'sell-nvda-btn');
setupMarketTrade('meme', 'buy-meme-btn', 'sell-meme-btn');

function updateMarketPrices() {
    // Generate distinct random swings for variety
    stockPrices.btc = Math.max(10, Math.floor(stockPrices.btc * (1 + (Math.random() * 40 - 20) / 100)));
    stockPrices.nvda = Math.max(50, Math.floor(stockPrices.nvda * (1 + (Math.random() * 26 - 12) / 100)));
    stockPrices.meme = Math.max(1, Math.floor(stockPrices.meme * (1 + (Math.random() * 120 - 55) / 100)));

    document.getElementById('btc-price').innerText = `$${stockPrices.btc}`;
    document.getElementById('nvda-price').innerText = `$${stockPrices.nvda}`;
    document.getElementById('meme-price').innerText = `$${stockPrices.meme}`;
}

// Prestige Logic Engine
function calculatePendingChips() {
    if (gameData.totalEarned < 10000) {
        return 0;
    }
    // Math logic calculation formula: Based on total overall cash accumulated 
    let totalChipsCapable = Math.floor(Math.sqrt(gameData.totalEarned / 10000));
    let pending = Math.max(0, totalChipsCapable - gameData.prestigeChips);
    
    if (pending > 0) {
        prestigeBtn.classList.remove('locked');
        prestigeBtn.classList.add('ready');
        prestigeBtn.innerText = `Prestige Now! (+${pending} Chips)`;
    } else {
        prestigeBtn.classList.remove('ready');
        prestigeBtn.classList.add('locked');
        prestigeBtn.innerText = "Sell Company (Req. $10k)";
    }
    return pending;
}

prestigeBtn.addEventListener('click', () => {
    let pending = calculatePendingChips();
    if (pending > 0) {
        if (confirm(`Are you ready to liquidate your tech empire? You will claim ${pending} Golden Microchips, resetting your cash and workers, but speeding up future progress permanently!`)) {
            gameData.prestigeChips += pending;
            
            // Clean Wipe Base Stats Except Prestige and Achievements Counters
            gameData.money = 0;
            gameData.moneyPerSecond = 0;
            gameData.moneyPerClick = 1;
            gameData.totalStaff = 0;
            gameData.clickUpgradeCost = 50;
            gameData.devCost = 15;
            gameData.leadCost = 200;
            gameData.serverCost = 1500;
            gameData.btcOwned = 0;
            gameData.nvdaOwned = 0;
            gameData.memeOwned = 0;

            calculatePendingChips();
            checkAchievements();
            saveGame();
            updateDisplay();
        }
    }
});

// Accomplishments Checks
function checkAchievements() {
    let unlocked = 0;
    if (!gameData.achievements.firstCode && gameData.totalEarned >= 100) gameData.achievements.firstCode = true;
    if (!gameData.achievements.techStartup && gameData.totalStaff >= 5) gameData.achievements.techStartup = true;
    if (!gameData.achievements.cryptoWhale && gameData.totalEarned >= 5000) gameData.achievements.cryptoWhale = true;

    if (gameData.achievements.firstCode) { toggleAchVisual('ach-1'); unlocked++; }
    if (gameData.achievements.techStartup) { toggleAchVisual('ach-2'); unlocked++; }
    if (gameData.achievements.cryptoWhale) { toggleAchVisual('ach-3'); unlocked++; }

    gameData.bonusMultiplier = 1.0 + (unlocked * 0.1);
}

function toggleAchVisual(id) {
    const card = document.getElementById(id);
    if(card && card.classList.contains('locked')) {
        card.classList.remove('locked');
        card.classList.add('unlocked');
    }
}

// Master Render Value Engine
function updateDisplay() {
    let prestigeBonus = 1.0 + (gameData.prestigeChips * 0.20);
    gameData.gameMps = Math.floor(gameData.moneyPerSecond * gameData.bonusMultiplier * prestigeBonus);

    moneyDisplay.innerText = gameData.money;
    mpsDisplay.innerText = gameData.gameMps;
    mpcDisplay.innerText = Math.floor(gameData.moneyPerClick * gameData.bonusMultiplier * prestigeBonus);
    bonusDisplay.innerText = Math.round(((gameData.bonusMultiplier * prestigeBonus) - 1) * 100);
    
    clickUpgradeCostDisplay.innerText = gameData.clickUpgradeCost;
    devCostDisplay.innerText = gameData.devCost;
    leadCostDisplay.innerText = gameData.leadCost;
    serverCostDisplay.innerText = gameData.serverCost;

    document.getElementById('btc-owned').innerText = gameData.btcOwned;
    document.getElementById('nvda-owned').innerText = gameData.nvdaOwned;
    document.getElementById('meme-owned').innerText = gameData.memeOwned;

    chipsOwnedDisplay.innerText = gameData.prestigeChips;
    chipsPendingDisplay.innerText = calculatePendingChips();
}

// Data Serialization Storage Hook Mechanisms
document.getElementById('save-btn').addEventListener('click', saveGame);
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Reset everything completely?")) {
        localStorage.removeItem("siliconEmpireUltraSave");
        location.reload();
    }
});

function saveGame() {
    gameData.lastSavedTime = Date.now();
    localStorage.setItem("siliconEmpireUltraSave", JSON.stringify(gameData));
}

function loadGame() {
    let saved = localStorage.getItem("siliconEmpireUltraSave");
    if (saved !== null) {
        gameData = JSON.parse(saved);
        
        // Calculate Offline Time Generation Engine
let timeAwayMs = Date.now() - gameData.lastSavedTime;
let timeAwaySec = Math.floor(timeAwayMs / 1000);
checkAchievements();
let prestigeBonus = 1.0 + (gameData.prestigeChips * 0.20);
let calculatedMps = Math.floor(gameData.moneyPerSecond * gameData.bonusMultiplier * prestigeBonus);
if (timeAwaySec > 10 && calculatedMps > 0) {
let passiveOfflineEarnings = timeAwaySec * calculatedMps;
gameData.money += passiveOfflineEarnings;
gameData.totalEarned += passiveOfflineEarnings;
// Pop open welcoming modal overlay module window
document.getElementById('offline-cash-amount').innerText = passiveOfflineEarnings;
document.getElementById('offline-modal').classList.remove('hidden');
}
calculatePendingChips();
updateDisplay();
}
}
document.getElementById('close-modal-btn').addEventListener('click', () => {
document.getElementById('offline-modal').classList.add('hidden');
});
// Setup Operational Routine loops
setInterval(() => {
gameData.money += Math.floor(gameData.gameMps / 10);
updateDisplay();
}, 100);
setInterval(updateMarketPrices, 3500); // Ticks markets every 3.5 seconds
setInterval(saveGame, 10000);         // Auto backups save profile states every 10s
loadGame();
updateDisplay();