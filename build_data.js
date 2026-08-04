// smok95/lotto 전체회차 JSON → 생성기용 data.json 변환 (GitHub Action에서 실행)
const https = require("https");
const fs = require("fs");
const SRC = "https://smok95.github.io/lotto/results/all.json";

https.get(SRC, res => {
  let buf = "";
  res.on("data", c => buf += c);
  res.on("end", () => {
    const raw = JSON.parse(buf);
    const arr = Array.isArray(raw) ? raw : (raw.results || Object.values(raw));
    const out = {};
    for (const d of arr) {
      const no = d.draw_no ?? d.drwNo;
      if (!no || !Array.isArray(d.numbers)) continue;
      out[no] = {
        drwNo: no,
        date: (d.date || "").slice(0, 10),
        nums: [...d.numbers].sort((a, b) => a - b),
        bonus: d.bonus_no ?? d.bnusNo
      };
    }
    fs.writeFileSync("data.json", JSON.stringify(out));
    console.log("draws:", Object.keys(out).length);
  });
}).on("error", e => { console.error(e); process.exit(1); });
