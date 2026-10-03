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

    // Stocks Portfolio Tracker
    btcOwned: 0,
    nvdaOwned: 0,
    memeOwned: 0,

    // Prestige Variables
    prestigeChips: 0,

    // Runes & Glyphs Booster Levels Data Block
    runeLevel: 0,
    runeCost: 500,
    glyphLevel: 0,
    glyphCost: 1000,

    achievements: {
        firstCode: false,
        techStartup: false,
        cryptoWhale: false
    },
    
    lastSavedTime: Date.now()
};

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

const chipsOwnedDisplay = document.getElementById('chips-owned');
const chipsPendingDisplay = document.getElementById('chips-pending');
const prestigeBtn = document.getElementById('prestige-btn');

// Runes & Glyphs Display Targets
const runeLvlDisplay = document.getElementById('rune-lvl');
const runePowerDisplay = document.getElementById('rune-power');
const runeCostDisplay = document.getElementById('rune-cost');
const glyphLvlDisplay = document.getElementById('glyph-lvl');
const glyphPowerDisplay = document.getElementById('glyph-power');
const glyphCostDisplay = document.getElementById('glyph-cost');

// --- TAB SWITCH LOGIC COUPLING ---
const tabBtnShop = document.getElementById('tab-btn-shop');
const tabBtnRunes = document.getElementById('tab-btn-runes');
const tabContentShop = document.getElementById('tab-content-shop');
const tabContentRunes = document.getElementById('tab-content-runes');

tabBtnShop.addEventListener('click', () => {
    tabBtnShop.classList.add('active-tab');
    tabBtnRunes.classList.remove('active-tab');
    tabContentShop.classList.remove('hidden');
    tabContentRunes.classList.add('hidden');
});

tabBtnRunes.addEventListener('click', () => {
    tabBtnRunes.classList.add('active-tab');
    tabBtnShop.classList.remove('active-tab');
    tabContentRunes.classList.remove('hidden');
    tabContentShop.classList.add('hidden');
});

// Core Mathematical Amplification Hooks
function getClickMultiplier() {
    // Each rune level awards +25% click power stacked
    return 1.0 + (gameData.runeLevel * 0.25);
}

function getPassiveMultiplier() {
    // Each glyph level awards +15% passive MPS production stacked
    return 1.0 + (gameData.glyphLevel * 0.15);
}

function getPrestigeMultiplier() {
    return 1.0 + (gameData.prestigeChips * 0.20);
}

// Manual Click Trigger
clickBtn.addEventListener('click', (e) => {
    let earned = Math.floor(gameData.moneyPerClick * gameData.bonusMultiplier * getPrestigeMultiplier() * getClickMultiplier());
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

// Shop Upgrades Purchasing
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

// Runes & Glyphs Forging Mechanics Hooks
document.getElementById('forge-rune-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.runeCost) {
        gameData.money -= gameData.runeCost;
        gameData.runeLevel++;
        gameData.runeCost = Math.floor(gameData.runeCost * 2.2);
        updateDisplay();
    }
});

document.getElementById('forge-glyph-btn').addEventListener('click', () => {
    if (gameData.money >= gameData.glyphCost) {
        gameData.money -= gameData.glyphCost;
        gameData.glyphLevel++;
        gameData.glyphCost = Math.floor(gameData.glyphCost * 2.5);
        updateDisplay();
    }
});

// Markets Trading Action Controllers
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
    stockPrices.btc = Math.max(10, Math.floor(stockPrices.btc * (1 + (Math.random() * 40 - 20) / 100)));
    stockPrices.nvda = Math.max(50, Math.floor(stockPrices.nvda * (1 + (Math.random() * 26 - 12) / 100)));
    stockPrices.meme = Math.max(1, Math.floor(stockPrices.meme * (1 + (Math.random() * 120 - 55) / 100)));

    document.getElementById('btc-price').innerText = `$${stockPrices.btc}`;
    document.getElementById('nvda-price').innerText = `$${stockPrices.nvda}`;
    document.getElementById('meme-price').innerText = `$${stockPrices.meme}`;
}

// Prestige Calculations
function calculatePendingChips() {
    if (gameData.totalEarned < 10000) return 0;
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
    if (pending > 0 && confirm(`Liquidate company for ${pending} Golden Microchips?`)) {
        gameData.prestigeChips += pending;
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
        
        // Note: Runes and Glyphs survive standard Prestige resets for deep layer builds!
        calculatePendingChips();
        checkAchievements();
        saveGame();
        updateDisplay();
    }
});

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
// Master Render Value Engine Update Screen
function updateDisplay() {
let structuralMultiplier = gameData.bonusMultiplier * getPrestigeMultiplier();
gameData.gameMps = Math.floor(gameData.moneyPerSecond * structuralMultiplier * getPassiveMultiplier());
moneyDisplay.innerText = gameData.money;
mpsDisplay.innerText = gameData.gameMps;
mpcDisplay.innerText = Math.floor(gameData.moneyPerClick * structuralMultiplier * getClickMultiplier());
bonusDisplay.innerText = Math.round(((structuralMultiplier * getPassiveMultiplier() * getClickMultiplier()) - 1) * 100);
clickUpgradeCostDisplay.innerText = gameData.clickUpgradeCost;
devCostDisplay.innerText = gameData.devCost;
leadCostDisplay.innerText = gameData.leadCost;
serverCostDisplay.innerText = gameData.serverCost;
document.getElementById('btc-owned').innerText = gameData.btcOwned;
document.getElementById('nvda-owned').innerText = gameData.nvdaOwned;
document.getElementById('meme-owned').innerText = gameData.memeOwned;
chipsOwnedDisplay.innerText = gameData.prestigeChips;
chipsPendingDisplay.innerText = calculatePendingChips();
// Sync Runes Pane Displays
runeLvlDisplay.innerText = gameData.runeLevel;
runePowerDisplay.innerText = gameData.runeLevel * 25;
runeCostDisplay.innerText = gameData.runeCost;
glyphLvlDisplay.innerText = gameData.glyphLevel;
glyphPowerDisplay.innerText = gameData.glyphLevel * 15;
glyphCostDisplay.innerText = gameData.glyphCost;
}
// IO Save Engines
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
// Fill missing values in older save states gracefully
if(gameData.runeLevel === undefined) { gameData.runeLevel = 0; gameData.runeCost = 500; }
if(gameData.glyphLevel === undefined) { gameData.glyphLevel = 0; gameData.glyphCost = 1000; }
let timeAwayMs = Date.now() - gameData.lastSavedTime;
let timeAwaySec = Math.floor(timeAwayMs / 1000);
checkAchievements();
let calculatedMps = Math.floor(gameData.moneyPerSecond * gameData.bonusMultiplier * getPrestigeMultiplier() * getPassiveMultiplier());
if (timeAwaySec > 10 && calculatedMps > 0) {
let passiveOfflineEarnings = timeAwaySec * calculatedMps;
gameData.money += passiveOfflineEarnings;
gameData.totalEarned += passiveOfflineEarnings;
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
// Precise Decimal Accumulator Clock Fix Loop Engine
let decimalAccumulator = 0;
setInterval(() => {
let exactEarningsPerTick = gameData.gameMps / 10;
decimalAccumulator += exactEarningsPerTick;
let wholeDollarsToGive = Math.floor(decimalAccumulator);
if (wholeDollarsToGive > 0) {
gameData.money += wholeDollarsToGive;
gameData.totalEarned += wholeDollarsToGive;
decimalAccumulator -= wholeDollarsToGive;
}
calculatePendingChips();
updateDisplay();
}, 100);
setInterval(updateMarketPrices, 3500);
setInterval(saveGame, 10000);
loadGame();
updateDisplay();