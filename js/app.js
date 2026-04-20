// js/app.js
const elements = {
    productSelector: document.getElementById("productSelector"),
    selectedList: document.getElementById("selectedItemsList"),
    start: document.getElementById("startDate"),
    end: document.getElementById("endDate"),
    name: document.getElementById("customerName"),
    email: document.getElementById("customerEmail"),
    phone: document.getElementById("customerPhone"),
    payment: document.getElementById("paymentMethod"),
    depositMethod: document.getElementById("depositPaymentMethod"), 
    depositGroup: document.getElementById("depositPaymentGroup"), 
    coolingFan: document.getElementById("coolingFanToggle"), 
    comanTripod: document.getElementById("comanTripodToggle"),
    result: document.getElementById("result"),
    quickDates: document.getElementById("quickDates"),
    termsCheck: document.getElementById("termsCheck"),
    btnWhatsapp: document.getElementById("btnWhatsapp"),
    btnCopy: document.getElementById("btnCopy"),
    stickyTotal: document.getElementById("stickyTotal"),
    stickyPrice: document.getElementById("stickyPrice"),
    stickyGuidance: document.getElementById("stickyGuidance"),
    progressBar: document.getElementById("progressBar"),
    termsModal: document.getElementById("termsModal"),
    step4Container: document.getElementById("step4Container"),
    step5Container: document.getElementById("step5Container"),
    actionInquiry: document.getElementById("actionButtonsInquiry"),
    actionBooking: document.getElementById("actionButtonsBooking"),
    btnReadTNC: document.getElementById("btnReadTNC"),
    termsWrapper: document.getElementById("termsWrapper"),
    bookingValidationHint: document.getElementById("bookingValidationHint"),
    btnWhatsappInquiry: document.getElementById("btnWhatsappInquiry"),
    btnCopyInquiry: document.getElementById("btnCopyInquiry"),
    inquiryValidationHint: document.getElementById("inquiryValidationHint"),
    customWishlist: document.getElementById("customWishlist") // 新增許願池輸入框
};

let currentQuoteText = "";
let selectedProducts = []; 
let currentDepositRate = 1;
let currentMode = 'inquiry'; // 'inquiry' or 'booking'

const today = new Date().toISOString().split("T")[0];
elements.start.min = today;
elements.end.min = today;

function populateDropdown() {
    const selector = elements.productSelector;
    const groups = {};
    
    for (const key in pricingData) {
        const item = pricingData[key];
        const cat = item.category || "其他";
        
        if (!groups[cat]) {
            groups[cat] = document.createElement("optgroup");
            groups[cat].label = cat;
            selector.appendChild(groups[cat]);
        }
        
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = item.name;
        groups[cat].appendChild(opt);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    populateDropdown(); 
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('start')) elements.start.value = params.get('start');
    if (params.has('end')) elements.end.value = params.get('end');
    if (params.has('products')) {
        const keys = params.get('products').split(',');
        keys.forEach(k => {
            if(pricingData[k.trim()]) {
                selectedProducts.push({ id: Date.now() + Math.random(), productKey: k.trim(), start: elements.start.value || "", end: elements.end.value || "" });
            }
        });
    }
    setMode('inquiry'); 
    if (elements.start.value) handleGlobalDateChange();
    calculatePrice();
});

function updateProgress() {
    let progress = 0;
    let nextAction = "";
    let isComplete = false;

    const hasDates = elements.start.value !== "" && elements.end.value !== "";
    const hasProducts = selectedProducts.length > 0;

    const hasName = elements.name.value.trim().length > 0;
    const hasPhone = elements.phone.value.trim().length === 8;
    const hasPayment = elements.payment.value !== "";
    const emailVal = elements.email.value.trim();
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const step4Complete = hasName && hasPhone && hasPayment && hasEmail;
    const step5Complete = elements.termsCheck.checked;

    if (currentMode === 'inquiry') {
        if (hasDates) progress += 30;
        if (hasProducts) progress += 50;
        if (hasProducts && step5Complete) progress += 20;

        if (!hasDates) nextAction = "第一步: 請選擇日期";
        else if (!hasProducts) nextAction = "第二步: 請加入器材";
        else if (!step5Complete) nextAction = "第五步: 閱讀及同意條款";
        else { nextAction = "可以發送查詢了！"; isComplete = true; }
        
    } else { // Booking mode
        if (hasDates) progress += 20;
        if (hasProducts) progress += 30;
        
        if (hasProducts) {
            let infoScore = 0;
            if (hasName) infoScore += 7.5;
            if (hasPhone) infoScore += 7.5;
            if (hasEmail) infoScore += 7.5;
            if (hasPayment) infoScore += 7.5;
            progress += infoScore;
        }

        if (hasProducts && step4Complete && step5Complete) progress += 20;

        if (!hasDates) nextAction = "第一步: 請選擇日期";
        else if (!hasProducts) nextAction = "第二步: 請加入器材";
        else if (!step4Complete) nextAction = "第四步: 填寫個人資料";
        else if (!step5Complete) nextAction = "第五步: 閱讀及同意條款";
        else { nextAction = "資料齊全，請發送預約"; isComplete = true; }
    }

    progress = Math.floor(progress);
    
    if (hasDates || hasProducts) elements.stickyTotal.classList.add("visible");
    else elements.stickyTotal.classList.remove("visible");

    elements.progressBar.style.width = `${progress}%`;

    if (isComplete) {
        elements.progressBar.style.backgroundColor = "var(--success-color)";
        elements.stickyGuidance.style.color = "var(--success-color)";
        elements.stickyGuidance.innerHTML = `✅ ${progress}%<br/><span style="font-weight:normal;">${nextAction}</span>`;
    } else {
        elements.progressBar.style.backgroundColor = "var(--primary-color)";
        elements.stickyGuidance.style.color = "var(--text-muted)";
        elements.stickyGuidance.innerHTML = `⏳ ${progress}%<br/><span style="font-weight:normal;">尚欠: ${nextAction}</span>`;
    }
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('btnModeInquiry').classList.toggle('active', mode === 'inquiry');
    document.getElementById('btnModeBooking').classList.toggle('active', mode === 'booking');
    
    if (mode === 'inquiry') {
        elements.step4Container.style.display = 'none';
        elements.step5Container.style.display = 'block';
    } else {
        elements.step4Container.style.display = 'block';
        elements.step5Container.style.display = 'block';
    }
    calculatePrice(); 
    updateProgress(); 
}

function validateBookingForm() {
    const isTermsChecked = elements.termsCheck.checked;

    if (currentMode === 'inquiry') {
        if (isTermsChecked) {
            if (elements.btnWhatsappInquiry) elements.btnWhatsappInquiry.disabled = false;
            if (elements.btnCopyInquiry) elements.btnCopyInquiry.disabled = false;
            if (elements.inquiryValidationHint) elements.inquiryValidationHint.style.display = 'none';
        } else {
            if (elements.btnWhatsappInquiry) elements.btnWhatsappInquiry.disabled = true;
            if (elements.btnCopyInquiry) elements.btnCopyInquiry.disabled = true;
            if (elements.inquiryValidationHint) elements.inquiryValidationHint.style.display = 'block';
        }
        updateProgress();
        return;
    }
    
    let isValid = true;
    
    if(!elements.name.value.trim()) isValid = false;
    if(!elements.phone.value.trim() || elements.phone.value.length !== 8) isValid = false;
    if(!elements.payment.value) isValid = false;
    
    const emailVal = elements.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailVal || !emailPattern.test(emailVal)) isValid = false;
    
    if(!isTermsChecked) isValid = false;

    if(isValid) {
        elements.btnWhatsapp.disabled = false;
        elements.btnCopy.disabled = false;
        elements.bookingValidationHint.style.display = 'none';
    } else {
        elements.btnWhatsapp.disabled = true;
        elements.btnCopy.disabled = true;
        elements.bookingValidationHint.style.display = 'block';
    }
    updateProgress();
}

function addProduct() {
    const val = elements.productSelector.value;
    if (!val) { showToast("請選擇器材", "error"); return; }
    selectedProducts.push({ id: Date.now(), productKey: val, start: elements.start.value || "", end: elements.end.value || "" });
    calculatePrice();
    elements.productSelector.value = ""; 
}

function removeProduct(id) {
    selectedProducts = selectedProducts.filter(item => item.id !== id);
    calculatePrice();
}

function updateItemDate(id, field, value) {
    const item = selectedProducts.find(p => p.id === id);
    if (item) {
        item[field] = value;
        if (field === 'start' && item.end && item.end < value) item.end = value;
        calculatePrice();
    }
}

function applyDatesToAll() {
    const s = elements.start.value; const e = elements.end.value;
    if (!s || !e) { showToast("請先設定上方的預設日期", "error"); return; }
    selectedProducts.forEach(item => { item.start = s; item.end = e; });
    calculatePrice();
    showToast("已更新所有項目日期", "success");
}

function renderProductList() {
    elements.selectedList.innerHTML = "";
    if (selectedProducts.length === 0) { elements.selectedList.style.display = "none"; return; }
    elements.selectedList.style.display = "flex";
    
    selectedProducts.forEach((item) => {
        const data = pricingData[item.productKey];
        const name = data?.name || item.productKey;
        
        let priceDisplay = `日租: $${data.perDay} (起)`;
        let rentalDays = 0;
        
        if (item.start && item.end && item.end >= item.start) {
            const s = new Date(item.start); const e = new Date(item.end);
            rentalDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) || 1;
            const itemCalc = calculateItemPrice(item.productKey, item.start, rentalDays);
            priceDisplay = `租金: $${itemCalc.total.toLocaleString()} (${rentalDays}日)`;
        } else { priceDisplay = `請設定日期`; }

        const adjustedDeposit = data.deposit * currentDepositRate;

        const div = document.createElement("div");
        div.className = "selected-item";
        div.innerHTML = `
            <div class="item-header">
                <div class="item-name">${name}</div>
                <button class="btn-remove" onclick="removeProduct(${item.id})" title="移除">×</button>
            </div>
            <div class="item-dates-row">
                <div class="item-date-group">
                    <span class="item-date-label">取機</span>
                    <input type="date" class="item-date-input" value="${item.start}" min="${today}" onchange="updateItemDate(${item.id}, 'start', this.value)">
                </div>
                <div class="item-date-group">
                    <span class="item-date-label">還機</span>
                    <input type="date" class="item-date-input" value="${item.end}" min="${item.start || today}" onchange="updateItemDate(${item.id}, 'end', this.value)">
                </div>
            </div>
            <div class="item-footer">
                <div class="item-price">${priceDisplay}</div>
                <div class="item-deposit">按金: $${adjustedDeposit.toLocaleString()}</div>
            </div>
        `;
        elements.selectedList.appendChild(div);
    });
}

function toggleTheme() {
  const body = document.body;
  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme"); document.getElementById("theme-icon").innerText = "🌙";
  } else {
    body.setAttribute("data-theme", "dark"); document.getElementById("theme-icon").innerText = "☀️";
  }
}

function resetForm() {
    selectedProducts = []; elements.productSelector.value = ""; elements.start.value = ""; elements.end.value = "";
    elements.name.value = ""; elements.email.value = ""; elements.phone.value = ""; elements.payment.value = "";
    elements.depositMethod.value = "Credit Card"; elements.coolingFan.checked = false; elements.comanTripod.checked = false;
    elements.termsCheck.checked = false; elements.termsCheck.disabled = true; 
    
    // 清空許願池
    if (elements.customWishlist) elements.customWishlist.value = "";
    
    currentDepositRate = 1; updateDepositUI(1); calculatePrice();

    elements.btnReadTNC.className = "tnc-read-btn";
    elements.btnReadTNC.innerText = "👉 點擊閱讀《租賃條款》以解鎖提交";
    elements.termsWrapper.style.opacity = "0.6";
    elements.termsWrapper.style.pointerEvents = "none";
    
    const hint = document.getElementById('scrollHint');
    if(hint) { hint.innerText = "請向下捲動以閱讀完整條款 ⬇️"; hint.classList.remove('done'); }
    
    document.getElementById('emailError').style.display = "none";
    document.getElementById('phoneError').style.display = "none";
    elements.quickDates.style.display = "none";
    elements.result.style.display = "none";
    elements.actionInquiry.style.display = "none";
    elements.actionBooking.style.display = "none";
    
    const url = new URL(window.location); url.search = "";
    try { window.history.replaceState({}, '', url); } catch(e) {}
    updateProgress(); 
}

function handleGlobalDateChange() {
  if (!elements.start.value) { elements.quickDates.style.display = "none"; }
  else {
      elements.quickDates.style.display = "flex";
      elements.end.min = elements.start.value;
      if (elements.end.value && elements.end.value < elements.start.value) elements.end.value = elements.start.value;
  }
  calculatePrice();
  updateProgress();
}

function setQuickDate(daysToAdd) {
  if (!elements.start.value) return;
  const date = new Date(elements.start.value);
  date.setDate(date.getDate() + daysToAdd);
  const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0');
  elements.end.value = `${year}-${month}-${day}`;
  calculatePrice();
}

function setDepositRate(rate, element) {
    currentDepositRate = rate; updateDepositUI(rate); calculatePrice();
}

function updateDepositUI(rate) {
    elements.depositGroup.style.display = (rate === 0) ? "none" : "block";
    document.querySelectorAll('.deposit-card').forEach(card => {
        card.classList.remove('active');
        if(parseFloat(card.getAttribute('data-rate')) === rate) card.classList.add('active');
    });
}

function updateURL() {
    const url = new URL(window.location);
    if (selectedProducts.length > 0) url.searchParams.set('products', selectedProducts.map(p => p.productKey).join(','));
    else { url.searchParams.delete('products'); url.searchParams.delete('product'); }
    if (elements.start.value) url.searchParams.set('start', elements.start.value);
    else url.searchParams.delete('start');
    if (elements.end.value) url.searchParams.set('end', elements.end.value);
    else url.searchParams.delete('end');
    try { window.history.replaceState({}, '', url); } catch(e) { }
}

function openTermsModal(e) {
    if(e) e.preventDefault();
    elements.termsModal.classList.add('show');
    document.body.style.overflow = 'hidden'; 
    setTimeout(checkTermsScroll, 100);
}

function closeTermsModal(e) {
    if(e.target === elements.termsModal || e.target.classList.contains('close-modal')) {
        elements.termsModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function checkTermsScroll() {
const el = document.getElementById('modalTermsBody');
const hint = document.getElementById('scrollHint');

if (!el || el.clientHeight === 0) return;

if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) {
    if (elements.termsCheck.disabled) {
        elements.termsCheck.disabled = false;
        elements.termsCheck.checked = true;
        
        elements.btnReadTNC.className = "tnc-read-btn done";
        elements.btnReadTNC.innerHTML = "✅ 條款已閱讀並同意 (點擊可重溫)";
        
        elements.termsWrapper.style.opacity = "1";
        elements.termsWrapper.style.pointerEvents = "auto";
        
        hint.innerText = "✅ 已經解鎖下方提交按鈕！";
        hint.classList.add('done');
        
        validateBookingForm(); 
        }
    }
}

function calculateItemPrice(productKey, startDate, days) {
    const data = pricingData[productKey];
    if (!data) return { total: 0, deposit: 0 };

    let total = 0;
    let currentCalcDate = new Date(startDate);
    const parts = startDate.split('-');
    const pickupDow = new Date(parts[0], parts[1]-1, parts[2]).getDay();

    for (let i = 1; i <= days; i++) {
        currentCalcDate.setDate(currentCalcDate.getDate() + 1);
        const dow = currentCalcDate.getDay(); 
        const dateStrISO = currentCalcDate.toISOString().split('T')[0];
        const isHoliday = publicHolidays.includes(dateStrISO);
        
        let dailyPrice = 0;
        if (i === 1) {
            const isDay1Weekday = (pickupDow >= 1 && pickupDow <= 3 && !isHoliday); 
            dailyPrice = isDay1Weekday ? data.weekday1 : data.perDay;
        } else {
            const isWeekend = (dow === 0 || dow >= 4 || isHoliday);
            const tier = isWeekend ? data.weekend : data.weekday;
            if (i === 2) dailyPrice = tier[2];
            else if (i === 3) dailyPrice = tier[3];
            else dailyPrice = tier.more;
        }
        total += dailyPrice;
    }
    return { total: total, deposit: data.deposit };
}

function calculatePrice() {
  renderProductList();
  updateURL(); 
  
  const emailVal = elements.email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.getElementById('emailError').style.display = (emailVal && !emailPattern.test(emailVal)) ? 'block' : 'none';

  const phoneVal = elements.phone.value.trim();
  document.getElementById('phoneError').style.display = (phoneVal && phoneVal.length !== 8) ? 'block' : 'none';
  
  if (selectedProducts.length === 0) {
    elements.result.style.display = "none";
    elements.actionInquiry.style.display = "none";
    elements.actionBooking.style.display = "none";
    elements.stickyPrice.innerText = `$0`;
    updateProgress();
    return;
  }

  let grandTotal = 0;
  let grandDeposit = 0;
  let minStart = null; let maxEnd = null;
  let itemDetails = [];
  let dailyBreakdownMap = {};
  
  const addToBreakdown = (dateStr, amount, note, type) => {
      if (!dailyBreakdownMap[dateStr]) dailyBreakdownMap[dateStr] = { amount: 0, items: [], type: type };
      dailyBreakdownMap[dateStr].amount += amount;
      if (note) dailyBreakdownMap[dateStr].items.push(note);
      if (type === 'holiday' || type === 'weekend') dailyBreakdownMap[dateStr].type = type;
  };

  selectedProducts.forEach(item => {
       if (!item.start || !item.end || item.end < item.start) return;
       const sDate = new Date(item.start); const eDate = new Date(item.end);
       if(!minStart || sDate < minStart) minStart = sDate;
       if(!maxEnd || eDate > maxEnd) maxEnd = eDate;

       const days = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24)) || 1;
       const data = pricingData[item.productKey];
       grandDeposit += data.deposit;
       
       let currentCalcDate = new Date(item.start);
       let thisItemTotal = 0;
       const parts = item.start.split('-');
       const pickupDow = new Date(parts[0], parts[1]-1, parts[2]).getDay();

       for(let i=1; i<=days; i++) {
            currentCalcDate.setDate(currentCalcDate.getDate() + 1);
            const dow = currentCalcDate.getDay(); 
            const dateStrISO = currentCalcDate.toISOString().split('T')[0];
            const isHoliday = publicHolidays.includes(dateStrISO);
            
            let price = 0;
            if (i === 1) {
                const isDay1Weekday = (pickupDow >= 1 && pickupDow <= 3 && !isHoliday);
                price = isDay1Weekday ? data.weekday1 : data.perDay;
            } else {
                const isWeekend = (dow === 0 || dow >= 4 || isHoliday);
                const tier = isWeekend ? data.weekend : data.weekday;
                if (i === 2) price = tier[2];
                else if (i === 3) price = tier[3];
                else price = tier.more;
            }
            thisItemTotal += price; grandTotal += price;
            const dayType = isHoliday ? "holiday" : ((dow === 0 || dow >= 4) ? "weekend" : "weekday");
            addToBreakdown(dateStrISO, price, null, dayType); 
       }
       itemDetails.push({ ...item, total: thisItemTotal });
  });
  
  grandDeposit = grandDeposit * currentDepositRate;

  let serviceDays = 0;
  if (minStart && maxEnd) serviceDays = Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24)) || 1;
  let coolingFanCost = 0; let comanTripodCost = 0; let hasExtras = false;

  if (elements.coolingFan.checked && serviceDays > 0) { coolingFanCost = 20 * serviceDays; grandTotal += coolingFanCost; hasExtras = true; }
  if (elements.comanTripod.checked && serviceDays > 0) { comanTripodCost = 80 * serviceDays; grandTotal += comanTripodCost; hasExtras = true; }

  let breakdownHtml = "";
  Object.keys(dailyBreakdownMap).sort().forEach(dateKey => {
      const d = new Date(dateKey); const dateStr = `${d.getMonth()+1}/${d.getDate()}`; const entry = dailyBreakdownMap[dateKey];
      let dayLabel = "平日"; let typeClass = "badge";
      if(entry.type === 'holiday') { dayLabel = "假期"; typeClass = "badge holiday"; } else if(entry.type === 'weekend') { dayLabel = "假日"; }
      breakdownHtml += `<div class="breakdown-item"><div><span class="breakdown-date">${dateStr}</span><span class="${typeClass}">${dayLabel}</span></div><span class="breakdown-price">$${entry.amount}</span></div>`;
  });
  
  if (hasExtras) {
       breakdownHtml += `<div style="border-top:1px dashed var(--border-color); margin:8px 0;"></div>`;
       if (elements.coolingFan.checked) breakdownHtml += `<div class="breakdown-item"><div style="color:var(--text-main); font-size:13px;">❄️ 散熱風扇 (覆蓋期 ${serviceDays}日)</div><span class="breakdown-price">+$${coolingFanCost}</span></div>`;
       if (elements.comanTripod.checked) breakdownHtml += `<div class="breakdown-item"><div style="color:var(--text-main); font-size:13px;">📸 COMAN單腳架套裝 (覆蓋期 ${serviceDays}日)</div><span class="breakdown-price">+$${comanTripodCost}</span></div>`;
  }

  const depMethod = elements.depositMethod.value;
  const refundText = depMethod === 'FPS' ? "歸還並通知後即日/翌日退回" : "信用卡預授權 T+7 自動解除";

  currentQuoteText = `📷 租借${currentMode === 'booking' ? '預約' : '查詢'}\n------------------\n`;
  currentQuoteText += `{{PERSONAL_INFO}}`;
  currentQuoteText += `📦 器材清單:\n`;
  
  itemDetails.forEach(item => {
      const name = pricingData[item.productKey]?.name || item.productKey;
      currentQuoteText += `   • ${name} (${item.start} - ${item.end}) : $${item.total}\n`;
  });
  
  if(elements.coolingFan.checked) currentQuoteText += `❄️ 加配: 散熱風扇 (+$${coolingFanCost})\n`;
  if(elements.comanTripod.checked) currentQuoteText += `📸 加配: COMAN單腳架套裝 (+$${comanTripodCost})\n`;
  
  let depositSchemeText = "標準按金"; let depositDocs = "無需文件";
  if (currentDepositRate === 0.75) { depositSchemeText = "75% 按金"; depositDocs = "身份證+住址證明+活動門票"; }
  else if (currentDepositRate === 0) { depositSchemeText = "0% 學生按金"; depositDocs = "身份證+學生證+活動門票"; }
  
  currentQuoteText += `------------------\n`;
  currentQuoteText += `🔒 按金方案: ${depositSchemeText}\n`;
  if (currentDepositRate !== 0) currentQuoteText += `💳 按金支付: ${depMethod}\n`;
  currentQuoteText += `📄 所需文件: ${depositDocs}\n`;
  currentQuoteText += `------------------\n`;
  currentQuoteText += `💰 總價: $${grandTotal.toLocaleString()}\n🔒 總按金: $${grandDeposit.toLocaleString()}`;
  currentQuoteText += `\n\n✅ 本人已閱讀並同意租賃條款及細則，並確認以上資料正確無誤。`;

  let depositInfoHtml = currentDepositRate !== 0 ? `<div class="info-desc"><strong>${depMethod}:</strong> ${refundText}</div>` : "";

  elements.result.innerHTML = `
    <div class="result-header">
      <div class="result-days">📅 共 ${selectedProducts.length} 項器材</div>
      <div class="price-tag">$${grandTotal.toLocaleString()}</div>
    </div>
    <div class="info-card">
      <div class="info-icon">🔒</div>
      <div class="info-content">
        <div class="info-title">總按金: $${grandDeposit.toLocaleString()} (${currentDepositRate * 100}%)</div>
        ${depositInfoHtml}
        <div class="info-desc" style="margin-top:4px;">所需文件：${depositDocs}</div>
      </div>
    </div>
    <div class="breakdown-section">
       <div class="breakdown-toggle" onclick="toggleBreakdown()"><span>📋 查看每日總價詳情</span><span>▼</span></div>
       <div class="breakdown-list" id="breakdownList">${breakdownHtml}</div>
    </div>
  `;
  
  elements.result.style.display = "block";
  elements.stickyPrice.innerText = `$${grandTotal.toLocaleString()}`;
  
  if(currentMode === 'inquiry') {
      elements.actionInquiry.style.display = "grid";
      elements.actionBooking.style.display = "none";
  } else {
      elements.actionInquiry.style.display = "none";
      elements.actionBooking.style.display = "grid";
  }
  validateBookingForm(); 
  
  updateProgress();
}

function toggleBreakdown() { document.getElementById("breakdownList").classList.toggle("open"); }

function getFinalQuoteText() {
    let personalInfo = "";
    if(currentMode === 'booking') {
        if(elements.name.value) personalInfo += `👤 姓名: ${elements.name.value}\n`;
        if(elements.email.value) personalInfo += `📧 電郵: ${elements.email.value}\n`;
        if(elements.phone.value) personalInfo += `📞 電話: ${elements.phone.value}\n`;
        if(elements.payment.value) personalInfo += `💳 租金付款: ${elements.payment.value}\n`;
        personalInfo += `------------------\n`;
    }
    return currentQuoteText.replace('{{PERSONAL_INFO}}', personalInfo);
}

function sendWhatsapp() { window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(getFinalQuoteText())}`, '_blank'); }

function copyQuote(btn) { copyToClipboard(btn || elements.btnCopy, getFinalQuoteText()); }

function showToast(message, type = 'normal') {
    const toast = document.getElementById("toast");
    toast.className = "toast show"; 
    toast.innerText = message;
    if (type === 'success') toast.classList.add("success");
    if (type === 'error') toast.classList.add("error");
    setTimeout(() => { toast.className = "toast"; }, 3000);
}

async function copyToClipboard(btn, text) {
  const handleSuccess = () => {
    showToast("✅ 已複製內容", "success");
    if(btn) {
        const originalTitle = btn.querySelector('.btn-title').innerText;
        const originalSub = btn.querySelector('.btn-subtitle').innerText;
        btn.querySelector('.btn-title').innerText = "✅ 已複製";
        btn.querySelector('.btn-subtitle').innerText = "請前往貼上";
        const originalBackground = btn.style.background;
        btn.style.background = "var(--success-color)";
        setTimeout(() => { 
            btn.querySelector('.btn-title').innerText = originalTitle;
            btn.querySelector('.btn-subtitle').innerText = originalSub;
            btn.style.background = originalBackground; 
        }, 3000);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(text); handleSuccess(); return; } catch (err) {}
  }
  try {
    const textArea = document.createElement("textarea"); textArea.value = text;
    textArea.style.position = "fixed"; textArea.style.left = "-9999px"; textArea.style.top = "0";
    textArea.setAttribute("readonly", ""); document.body.appendChild(textArea);
    textArea.focus(); textArea.select(); textArea.setSelectionRange(0, 99999); 
    if (document.execCommand('copy')) handleSuccess();
    document.body.removeChild(textArea);
  } catch (err) { showToast("❌ 複製失敗", "error"); }
}

// 提交許願池到 Web3Forms
async function submitWishlist() {
    const input = elements.customWishlist;
    const feedback = document.getElementById('wishlistFeedback');
    const text = input.value.trim();
    
    if (!text) {
        showToast("請先輸入您想要的器材喔！", "error");
        return;
    }

    // 暫時禁用輸入框防止重複提交
    input.disabled = true;

    try {
        // 使用 Web3Forms 於背景默默發送
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: 'ef28fedd-e6b9-4fbd-b64e-530f6abb9455',
                subject: '【852CAMERA】新的器材建議！',
                message: `客人想要的新器材: ${text}`
            })
        });
        
        if (response.status === 200) {
            // 成功：清空輸入框並顯示感謝訊息
            input.value = '';
            feedback.style.display = 'block';
            showToast("✅ 願望已送出！", "success");
            
            // 5秒後隱藏感謝訊息
            setTimeout(() => { 
                feedback.style.display = 'none'; 
            }, 5000);
        } else {
            showToast("❌ 傳送失敗，請稍後再試", "error");
        }
    } catch (error) {
        showToast("❌ 網絡錯誤，請稍後再試", "error");
    } finally {
        input.disabled = false;
    }
}
