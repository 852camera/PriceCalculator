// js/data.js

const WHATSAPP_PHONE = "85257409553"; 

const publicHolidays = [ 
    "2024-12-25", "2024-12-26", "2025-01-01", 
    "2025-01-29", "2025-01-30", "2025-01-31" 
];

// Add 'category' and 'name' to each item so index.html builds itself automatically
const pricingData = {
    // Samsung 手機
    "S24U (256GB)": { category: "Samsung 手機", name: "Samsung S24U", deposit: 4000, perDay: 180, weekday1: 160, weekend: { 2: 110, 3: 50, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    "S25U (512GB)": { category: "Samsung 手機", name: "Samsung S25U", deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    
    // Vivo 手機
    "X200 Ultra (512GB) 攝影套裝": { category: "Vivo 手機", name: "Vivo X200 Ultra 512GB 攝影套裝", deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    "X300 Pro (512GB) 攝影套裝": { category: "Vivo 手機", name: "Vivo X300 Pro 512GB 攝影套裝", deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    "X300 Ultra (1TB) 雙鏡頭攝影套裝": { category: "Vivo 手機", name: "Vivo X300 Ultra 1TB 雙鏡頭攝影套裝", deposit: 14000, perDay: 360, weekday1: 330, weekend: { 2: 220, 3: 110, more: 90 }, weekday: { 2: 200, 3: 100, more: 80 } },
    
    // Canon 相機
    "R5": { category: "Canon 相機", name: "Canon R5", deposit: 16000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    "R5ii": { category: "Canon 相機", name: "Canon R5ii", deposit: 20000, perDay: 500, weekday1: 450, weekend: { 2: 300, 3: 150, more: 130 }, weekday: { 2: 270, 3: 140, more: 120 } },
    "R6ii": { category: "Canon 相機", name: "Canon R6ii", deposit: 12000, perDay: 300, weekday1: 270, weekend: { 2: 180, 3: 90, more: 80 }, weekday: { 2: 160, 3: 80, more: 70 } },
    "R6iii": { category: "Canon 相機", name: "Canon R6iii", deposit: 18000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    
    // Canon 鏡頭
    "EF 70-200 F2.8 ii": { category: "Canon 鏡頭", name: "EF 70-200 F2.8 ii", deposit: 8000, perDay: 190, weekday1: 170, weekend: { 2: 110, 3: 60, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    "RF 70-200 F2.8": { category: "Canon 鏡頭", name: "RF 70-200 F2.8", deposit: 14000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "RF 100-500": { category: "Canon 鏡頭", name: "RF 100-500", deposit: 15000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "RF 100-400": { category: "Canon 鏡頭", name: "RF 100-400", deposit: 3000, perDay: 120, weekday1: 110, weekend: { 2: 70, 3: 40, more: 30 }, weekday: { 2: 60, 3: 40, more: 30 } },
    "RF 50mm F1.8": { category: "Canon 鏡頭", name: "RF 50mm F1.8", deposit: 1000, perDay: 50, weekday1: 50, weekend: { 2: 30, 3: 20, more: 10 }, weekday: { 2: 30, 3: 20, more: 10 } },
    "RF 28-70 F2.8": { category: "Canon 鏡頭", name: "RF 28-70mm F2.8", deposit: 6000, perDay: 180, weekday1: 160, weekend: { 2: 110, 3: 50, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    
    // Sony 相機
    "A7R5": { category: "Sony 相機", name: "Sony A7R5", deposit: 18000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "A7C2": { category: "Sony 相機", name: "Sony A7C2", deposit: 12000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    
    // Sony 鏡頭/配件
    "FE 50-150": { category: "Sony 鏡頭/配件", name: "FE 50-150 F2 GM", deposit: 24000, perDay: 500, weekday1: 450, weekend: { 2: 300, 3: 150, more: 130 }, weekday: { 2: 270, 3: 140, more: 120 } },
    "FE 100-400": { category: "Sony 鏡頭/配件", name: "FE 100-400 GM", deposit: 12000, perDay: 290, weekday1: 260, weekend: { 2: 170, 3: 90, more: 70 }, weekday: { 2: 150, 3: 80, more: 60 } },
    "FE 70-200 F2.8 ii": { category: "Sony 鏡頭/配件", name: "FE 70-200 F2.8 GM II", deposit: 13000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "FE 200-600": { category: "Sony 鏡頭/配件", name: "FE 200-600", deposit: 8000, perDay: 230, weekday1: 210, weekend: { 2: 140, 3: 70, more: 60 }, weekday: { 2: 130, 3: 60, more: 50 } },
    "1.4x Extender": { category: "Sony 鏡頭/配件", name: "1.4x 遠攝增距鏡", deposit: 2000, perDay: 80, weekday1: 70, weekend: { 2: 50, 3: 20, more: 20 }, weekday: { 2: 50, 3: 20, more: 20 } },
    
    // Fujifilm 相機
    "X100VI": { category: "Fujifilm / Leica", name: "Fujifilm X100VI", deposit: 14000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    
    // Monopod
    "COMAN M1 Pro 輕量碳纖單腳架+V5液壓雲台": { category: "Monopod", name: "COMAN M1 Pro 輕量碳纖單腳架+V5液壓雲台", deposit: 2000, perDay: 100, weekday1: 90, weekend: { 2: 60, 3: 30, more: 30 }, weekday: { 2: 50, 3: 30, more: 30 } }
};
