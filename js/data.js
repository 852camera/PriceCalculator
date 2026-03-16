const WHATSAPP_PHONE = "85257409553"; 

const publicHolidays = [ 
    "2024-12-25", "2024-12-26", "2025-01-01", 
    "2025-01-29", "2025-01-30", "2025-01-31" 
];

const pricingData = {
    "S24U": { deposit: 4000, perDay: 180, weekday1: 160, weekend: { 2: 110, 3: 50, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    "S25U": { deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    "X200 Ultra": { deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    "X300 Pro": { deposit: 8000, perDay: 280, weekday1: 250, weekend: { 2: 170, 3: 80, more: 70 }, weekday: { 2: 150, 3: 70, more: 60 } },
    "R5": { deposit: 16000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    "R5ii": { deposit: 20000, perDay: 500, weekday1: 450, weekend: { 2: 300, 3: 150, more: 130 }, weekday: { 2: 270, 3: 140, more: 120 } },
    "R6ii": { deposit: 12000, perDay: 300, weekday1: 270, weekend: { 2: 180, 3: 90, more: 80 }, weekday: { 2: 160, 3: 80, more: 70 } },
    "R6iii": { deposit: 18000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "EF 70-200 F2.8 ii": { deposit: 8000, perDay: 190, weekday1: 170, weekend: { 2: 110, 3: 60, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    "RF 70-200 F2.8": { deposit: 14000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "RF 100-500": { deposit: 15000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "RF 100-400": { deposit: 3000, perDay: 120, weekday1: 110, weekend: { 2: 70, 3: 40, more: 30 }, weekday: { 2: 60, 3: 40, more: 30 } },
    "RF 50mm F1.8": { deposit: 1000, perDay: 50, weekday1: 50, weekend: { 2: 30, 3: 20, more: 10 }, weekday: { 2: 30, 3: 20, more: 10 } },
    "RF 28-70 F2.8": { deposit: 6000, perDay: 180, weekday1: 160, weekend: { 2: 110, 3: 50, more: 50 }, weekday: { 2: 100, 3: 50, more: 50 } },
    "A7R5": { deposit: 18000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "A7C2": { deposit: 12000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    "FE 50-150": { deposit: 24000, perDay: 500, weekday1: 450, weekend: { 2: 300, 3: 150, more: 130 }, weekday: { 2: 270, 3: 140, more: 120 } },
    "FE 100-400": { deposit: 12000, perDay: 290, weekday1: 260, weekend: { 2: 170, 3: 90, more: 70 }, weekday: { 2: 150, 3: 80, more: 60 } },
    "FE 70-200 F2.8 ii": { deposit: 13000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } },
    "FE 200-600": { deposit: 8000, perDay: 230, weekday1: 210, weekend: { 2: 140, 3: 70, more: 60 }, weekday: { 2: 130, 3: 60, more: 50 } },
    "1.4x Extender": { deposit: 2000, perDay: 80, weekday1: 70, weekend: { 2: 50, 3: 20, more: 20 }, weekday: { 2: 50, 3: 20, more: 20 } },
    "X100VI": { deposit: 14000, perDay: 350, weekday1: 320, weekend: { 2: 210, 3: 110, more: 90 }, weekday: { 2: 190, 3: 100, more: 80 } },
    "Leica Q2": { deposit: 18000, perDay: 400, weekday1: 360, weekend: { 2: 240, 3: 120, more: 100 }, weekday: { 2: 220, 3: 110, more: 90 } }
};
