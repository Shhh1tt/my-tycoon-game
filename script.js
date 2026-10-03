// GAME DATA LOGIC ENGINE
let money = 0;

// Individual tracking indicators for un-crashable execution
let aL = 1, aP = 2, aC = 4, aH = false;
let iL = 0, iP = 20, iC = 50, iH = false;
let qL = 0, qP = 150, qC = 500, qH = false;
let sL = 0, sP = 900, sC = 4000, sH = false;
let cL = 0, cP = 4500, cC = 25000, cH = false;
let bL = 0, bP = 22000, bC = 150000, bH = false;

// 1. MANUAL CAPITALS INVOICING 
function mClk() {
    money = money + 1;
    rUI();
}

// 2. THE MULTIPLIER MATH: DOUBLES REVENUE ON MULTIPLES OF 20
function gP(lv, base) {
    let multiplier = Math.pow(2, Math.floor(lv / 20));
    return lv * base * multiplier;
}

// 3. MANUAL COMPONENT TRIGGER INTERFACES
function clA() { if (aL > 0) { money += aP; rUI(); } }
function clI() { if (iL > 0) { money += iP; rUI(); } }
function clQ() { if (qL > 0) { money += qP; rUI(); } }
function clS() { if (sL > 0) { money += sP; rUI(); } }
function clC() { if (cL > 0) { money += cP; rUI(); } }
function clB() { if (bL > 0) { money += bP; rUI(); } }

// 4. LEVEL SECTOR UPGRADE SCHEDULERS
function upA() {
    if (money >= aC) {
        money -= aC; aL++;
        aP = gP(aL, 2); aC = aL * 4;
        rUI();
    }
}
function upI() {
    if (money >= iC) {
        money -= iC; iL++;
        iP = gP(iL, 20); iC = iL * 50;
        document.getElementById("ail").innerHTML = (iL == 1 ? "Upgrade" : "Upgrade") + " <br><span id='ic'>$" + iC + "</span>";
        rUI();
    }
}
function upQ() {
    if (money >= qC) {
        money -= qC; qL++;
        qP = gP(qL, 150); qC = qL * 500;
        document.getElementById("ql").innerHTML = (qL == 1 ? "Upgrade" : "Upgrade") + " <br><span id='qc'>$" + qC + "</span>";
        rUI();
    }
}
function upS() {
    if (money >= sC) {
        money -= sC; sL++;
        sP = gP(sL, 900); sC = sL * 4000;
        document.getElementById("sl").innerHTML = (sL == 1 ? "Upgrade" : "Upgrade") + " <br><span id='sc'>$" + sC + "</span>";
        rUI();
    }
}
function upC() {
    if (money >= cC) {
        money -= cC; cL++;
        cP = gP(cL, 4500); cC = cL * 25000;
        document.getElementById("cl").innerHTML = (cL == 1 ? "Upgrade" : "Upgrade") + " <br><span id='cc'>$" + cC + "</span>";
        rUI();
    }
}
function upB() {
    if (money >= bC) {
        money -= bC; bL++;
        bP = gP(bL, 22000); bC = bL * 150000;
        document.getElementById("bln").innerHTML = (bL == 1 ? "Upgrade" : "Upgrade") + " <br><span id='bc'>$" + bC + "</span>";
        rUI();
    }
}

// 5. MANAGERS DELEGATION SYSTEMS
function hiA() { if (money >= 30 && !aH) { money -= 30; aH = true; rUI(); } }
function hiI() { if (money >= 250 && !iH && iL > 0) { money -= 250; iH = true; rUI(); } }
function hiQ() { if (money >= 1200 && !qH && qL > 0) { money -= 1200; qH = true; rUI(); } }
function hiS() { if (money >= 9500 && !sH && sL > 0) { money -= 9500; sH = true; rUI(); } }
function hiC() { if (money >= 45000 && !cH && cL > 0) { money -= 45000; cH = true; rUI(); } }
function hiB() { if (money >= 300000 && !bH && bL > 0) { money -= 300000; bH = true; rUI(); } }

// 6. CONTINUOUS RENDER DYNAMIC TICK LOOPS
function rUI() {
    document.getElementById("bal").innerText = money;
    
    // Updates node labels values text strings
    document.getElementById("alv").innerText = "Lv." + aL; document.getElementById("ap").innerText = aP; document.getElementById("ac").innerText = "$" + aC;
    document.getElementById("ilv").innerText = "Lv." + iL; document.getElementById("ip").innerText = iP; document.getElementById("ic").innerText = "$" + iC;
    document.getElementById("qlv").innerText = "Lv." + qL; document.getElementById("qp").innerText = qP; document.getElementById("qc").innerText = "$" + qC;
    document.getElementById("slv").innerText = "Lv." + sL; document.getElementById("sp").innerText = sP; document.getElementById("sc").innerText = "$" + sC;
    document.getElementById("clv").innerText = "Lv." + cL; document.getElementById("cp").innerText = cP; document.getElementById("cc").innerText = "$" + cC;
    document.getElementById("blv").innerText = "Lv." + bL; document.getElementById("bp").innerText = bP; document.getElementById("bc").innerText = "$" + bC;
    
    // Updates automated status badges text values
    document.getElementById("amg").innerText = aH ? "Auto ✔" : "Manager ($30)"; document.getElementById("amg").style.background = aH ? "#34495e" : "#8e44ad";
    document.getElementById("img").innerText = iH ? "Auto ✔" : "Manager ($250)"; document.getElementById("img").style.background = iH ? "#34495e" : "#8e44ad";
    document.getElementById("qmg").innerText = qH ? "Auto ✔" : "Manager ($1200)"; document.getElementById("qmg").style.background = qH ? "#34495e" : "#8e44ad";
    document.getElementById("smg").innerText = sH ? "Auto ✔" : "Manager ($9500)"; document.getElementById("smg").style.background = sH ? "#34495e" : "#8e44ad";
    document.getElementById("cmg").innerText = cH ? "Auto ✔" : "Manager ($45000)"; document.getElementById("cmg").style.background = cH ? "#34495e" : "#8e44ad";
    document.getElementById("bmg").innerText = bH ? "Auto ✔" : "Manager ($300000)"; document.getElementById("bmg").style.background = bH ? "#34495e" : "#8e44ad";

    // Dynamic button color highlights loops
    document.getElementById("u0").style.backgroundColor = money >= aC ? "#27ae60" : "#2c3e50";
    document.getElementById("ail").style.backgroundColor = money >= iC ? "#27ae60" : "#2c3e50";
    document.getElementById("ql").style.backgroundColor = money >= qC ? "#27ae60" : "#2c3e50";
    document.getElementById("sl").style.backgroundColor = money >= sC ? "#27ae60" : "#2c3e50";
    document.getElementById("cl").style.backgroundColor = money >= cC ? "#27ae60" : "#2c3e50";
    document.getElementById("bln").style.backgroundColor = money >= bC ? "#27ae60" : "#2c3e50";
}

// 7. CHRONOMETRIC TIMEOUT DELIVERIES
setInterval(() => {
    if (aH) money += aP; if (iH) money += iP; if (qH) money += qP;
    if (sH) money += sP; if (cH) money += cP; if (bH) money += bP;
    rUI();
}, 1000);

// Initialize setup state mapping
rUI();
