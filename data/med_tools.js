// SIXMED: (1) สอบจำลอง TPAT1 เต็มรูปแบบ — 3 ส่วน จับเวลาแยกส่วน ส่งทีละส่วนแล้วย้อนกลับไม่ได้ + สรุปผลรายส่วน
//         (2) ตัวคำนวณคะแนน กสพท (#/score) — คิดคะแนนรวมตามสัดส่วน MED_WEIGHT และเทียบกับเป้าที่ผู้ใช้ตั้งเอง
// ใช้ตัวแปร/ฟังก์ชันของ app.js (E, beginExam, render, store, attempts, allQ …) ตอนทำงานเท่านั้น ไฟล์นี้จึงโหลดก่อน app.js ได้

/* ====================== (1) สอบจำลอง TPAT1 ====================== */
// ปี 2569 : เชาวน์ปัญญา 45 · จริยธรรม 55 · ความคิดเชื่อมโยง 20 = 120 ข้อ ใน 4 ชั่วโมง → เฉลี่ยข้อละ 2 นาที
const TPAT1_PARTS = [['เชาวน์ปัญญา', 45], ['จริยธรรมทางการแพทย์', 55], ['ความคิดเชื่อมโยง', 20]];
const TPAT1_MIN_PER_Q = 2;
const secA = () => E && E.sec ? E.sec.parts[E.sec.cur].a : 0;
const secB = () => E && E.sec ? E.sec.parts[E.sec.cur].b : (E ? E.list.length : 0);
const secLast = () => !E || !E.sec || E.sec.cur === E.sec.parts.length - 1;
function secClose() {
  if (!E || !E.sec) return; const p = E.sec.parts[E.sec.cur];
  if (p.used == null) p.used = Math.round(Math.min(Date.now() - E.sec.start, p.mins * 60000) / 1000);
}
function mockNextSec(auto) {
  if (!E || !E.sec || secLast()) return;
  leave(); if (auto) { E.sec.parts[E.sec.cur].auto = true; E.sec.parts[E.sec.cur].used = E.sec.parts[E.sec.cur].mins * 60; }
  secClose();
  E.sec.cur++; const p = E.sec.parts[E.sec.cur];
  E.sec.start = Date.now(); E.endAt = E.sec.start + p.mins * 60000; E.tq = Date.now();
  E.i = p.a; E.dir = 'next'; E.omr = false;
  if (typeof toast === 'function') toast(auto ? `หมดเวลาส่วนก่อนหน้า — เริ่มส่วนที่ ${E.sec.cur + 1} ${p.name}` : `เริ่มส่วนที่ ${E.sec.cur + 1} ${p.name} · ${p.mins} นาที`);
  render(true);
}
// ชุดสั้น = ส่วนละ 10 ข้อ · ชุดเต็ม = ใช้โจทย์ทั้งหมดที่มี (ไม่เกินจำนวนข้อจริงของแต่ละส่วน)
function tpat1MockCounts(kind) {
  return TPAT1_PARTS.map(([t, real]) => { const have = allQ().filter(q => q.group === 'tpat1' && q.topic === t).length; return [t, Math.min(have, kind === 'short' ? 10 : real)]; });
}
function startTpat1Mock(kind) {
  const seen = new Set(attempts.map(a => a.qid)), list = [], parts = [];
  tpat1MockCounts(kind).forEach(([t, n]) => {
    const all = allQ().filter(q => q.group === 'tpat1' && q.topic === t);
    // ข้อที่ยังไม่เคยทำมาก่อน แล้วค่อยเติมข้อที่เคยทำ — ข้อที่ใช้บทความเดียวกันให้อยู่ติดกัน
    const pick = [...shuffle(all.filter(q => !seen.has(q.id))), ...shuffle(all.filter(q => seen.has(q.id)))].slice(0, n);
    pick.sort((x, y) => String(x.passage || '').localeCompare(String(y.passage || '')));
    parts.push({ name: t, a: list.length, b: list.length + pick.length, mins: pick.length * TPAT1_MIN_PER_Q }); list.push(...pick);
  });
  if (!list.length) return;
  beginExam('mock', list, kind === 'short' ? 'สอบจำลอง TPAT1 (ชุดสั้น)' : 'สอบจำลอง TPAT1 (ชุดเต็ม)');
  E.sec = { parts: parts.filter(p => p.b > p.a), cur: 0, start: Date.now() };
  E.mins = E.sec.parts.reduce((s, p) => s + p.mins, 0); E.endAt = E.sec.start + E.sec.parts[0].mins * 60000;
  render(true);
}
const secTag = () => E && E.sec ? `<span class="tag">ส่วนที่ ${E.sec.cur + 1}/${E.sec.parts.length} · ${esc(E.sec.parts[E.sec.cur].name)}</span>` : '';
function tpat1MockCard() {
  const s = tpat1MockCounts('short'), f = tpat1MockCounts('full'), n = c => c.reduce((a, x) => a + x[1], 0);
  const last = mocks.filter(m => /^สอบจำลอง TPAT1/.test(m.set)).slice(-1)[0];
  return `<div class="card mockcard"><h2>🩺 สอบจำลอง TPAT1 เต็มรูปแบบ</h2>
    <p class="mute" style="margin:0 0 8px">3 ส่วนตามโครงสร้างจริง จับเวลาแยกแต่ละส่วน (ข้อละ ${TPAT1_MIN_PER_Q} นาทีเท่าข้อสอบจริง) ส่งส่วนนี้แล้วย้อนกลับไม่ได้ หมดเวลาจะไปส่วนถัดไปเอง จบแล้วสรุปให้ว่าพลาดส่วนไหนและใช้เวลาเกินตรงไหน</p>
    <div class="presets"><button class="preset" data-a="tpat1Mock" data-v="short"><b>ชุดสั้น</b><small>${n(s)} ข้อ · ${n(s) * TPAT1_MIN_PER_Q} นาที</small></button>
    <button class="preset" data-a="tpat1Mock" data-v="full"><b>ชุดเต็มเท่าที่มีโจทย์</b><small>${n(f)} ข้อ · ${n(f) * TPAT1_MIN_PER_Q} นาที (ข้อสอบจริง 120 ข้อ)</small></button></div>
    ${last ? `<p class="mute" style="margin:8px 0 0">ครั้งล่าสุด ${last.score}/${last.total} ข้อ (${pct(last.score, last.total)}%)</p>` : ''}</div>`;
}
function tpat1MockResult() {
  const rows = E.sec.parts.map(p => {
    let ok = 0, ans = 0; for (let i = p.a; i < p.b; i++) { if (E.ans[i] != null) ans++; if (isRight(E.list[i], E.ans[i])) ok++; }
    const n = p.b - p.a; return { ...p, n, ok, ans, sc: n ? ok / n * 100 : 0 };
  });
  const tot = rows.reduce((s, r) => s + r.sc, 0), weak = rows.slice().sort((x, y) => x.sc - y.sc)[0];
  const rushed = rows.filter(r => r.auto || r.used >= r.mins * 60 * 0.95), slowUnans = rows.filter(r => r.ans < r.n);
  const tips = [`ส่วนที่ควรทบทวนก่อนคือ <b>${esc(weak.name)}</b> (${Math.round(weak.sc)}/100)`];
  if (rushed.length) tips.push(`ใช้เวลาเกือบหมดหรือหมดเวลาในส่วน ${rushed.map(r => esc(r.name)).join(', ')} — ฝึกข้ามข้อที่ติดแล้วกลับมาทีหลัง`);
  if (slowUnans.length) tips.push(`มีข้อที่ไม่ได้ตอบใน ${slowUnans.map(r => `${esc(r.name)} (${r.n - r.ans} ข้อ)`).join(', ')} — ข้อที่เว้นว่างได้ 0 แน่นอน ฝึกเก็บเวลาไว้ตอบให้ครบ`);
  setTimeout(() => store.set('mc_tpat1_last', Math.round(tot)), 0);
  return `<div class="card"><h2>ผลรายส่วน (เทียบคะแนนเต็ม 300)</h2>
    <div class="row" style="align-items:baseline;gap:8px;margin-bottom:6px"><b style="font-size:28px">${Math.round(tot)}</b><span class="mute">/ 300 คะแนน (ประมาณจากสัดส่วนข้อที่ถูก)</span></div>
    <div class="tbl"><table><tr><th>ส่วน</th><th>ถูก</th><th>คะแนน/100</th><th>เวลาใช้ / ที่ให้</th></tr>${rows.map(r => `<tr><td>${esc(r.name)}${r.auto ? ' <span class="tag warn">หมดเวลา</span>' : ''}</td><td>${r.ok}/${r.n}</td><td style="min-width:90px"><div class="bar ${r.sc >= 60 ? 'g' : r.sc >= 40 ? 'y' : 'r'}"><i style="width:${r.sc}%"></i></div><small>${Math.round(r.sc)}</small></td><td>${fmt(r.used || 0)} / ${r.mins}:00</td></tr>`).join('')}</table></div>
    <ul style="margin:10px 0 0;padding-left:18px">${tips.map(t => `<li>${t}</li>`).join('')}</ul>
    <div class="row" style="margin-top:10px"><a class="btn" href="#/score" data-a="mcUseMock" onclick="return false">ใช้คะแนนนี้ในตัวคำนวณ กสพท</a></div></div>`;
}

/* ====================== (2) ตัวคำนวณคะแนน กสพท ====================== */
// สัดส่วนรวม 100 : TPAT1 30 · วิทย์ 28 (ฟิสิกส์ เคมี ชีวะ วิชาละเท่ากัน) · คณิต 1 14 · อังกฤษ 14 · ไทย 7 · สังคม 7 (ตาม MED_WEIGHT ใน med_site.js)
const MC_SUBJ = [
  { k: 'tp', n: 'TPAT1', full: 300, w: 30, q: q => q.group === 'tpat1' },
  { k: 'ph', n: 'ฟิสิกส์', full: 100, w: 28 / 3, al: 1, q: q => q.subject === 'ฟิสิกส์' },
  { k: 'ch', n: 'เคมี', full: 100, w: 28 / 3, al: 1, q: q => q.subject === 'เคมี' },
  { k: 'bi', n: 'ชีววิทยา', full: 100, w: 28 / 3, al: 1, q: q => q.subject === 'ชีววิทยา' },
  { k: 'ma', n: 'คณิตศาสตร์ประยุกต์ 1', full: 100, w: 14, al: 1, q: q => q.subject === 'คณิต' },
  { k: 'en', n: 'ภาษาอังกฤษ', full: 100, w: 14, al: 1, q: q => q.subject === 'ภาษาอังกฤษ' },
  { k: 'th', n: 'ภาษาไทย', full: 100, w: 7, al: 1, q: q => q.subject === 'ภาษาไทย' },
  { k: 'so', n: 'สังคมศึกษา', full: 100, w: 7, al: 1, q: q => q.subject === 'สังคมศึกษา' },
];
const MC_MIN = 30;   // A-Level ทุกวิชาต้องได้อย่างน้อย 30%
const mcGet = () => Object.assign({ v: {}, tg: {} }, store.get('medcalc', {}));
const mcNum = (x, full) => { const n = parseFloat(x); return isFinite(n) ? Math.max(0, Math.min(full, n)) : null; };
function mcCompute(st) {
  let total = 0, filled = 0; const rows = MC_SUBJ.map(s => { const raw = mcNum(st.v[s.k], s.full), pts = raw == null ? 0 : raw / s.full * s.w; if (raw != null) filled++; total += pts; return { ...s, raw, pts, low: s.al && raw != null && raw < MC_MIN }; });
  return { rows, total, filled, low: rows.filter(r => r.low) };
}
const mcUnis = () => THEMES.filter(t => t.id !== 'sixent');
function mcResultHtml() {
  const st = mcGet(), r = mcCompute(st), f2 = x => x.toFixed(2);
  const miss = MC_SUBJ.length - r.filled;
  return `<div class="row" style="align-items:baseline;gap:8px"><b style="font-size:34px">${f2(r.total)}</b><span class="mute">/ 100 คะแนนรวม${miss ? ` · ยังไม่กรอก ${miss} วิชา (คิดเป็น 0)` : ''}</span></div>
    ${r.low.length ? `<div class="warnbox" style="margin:8px 0">⚠ ${r.low.map(x => esc(x.n)).join(', ')} ต่ำกว่า ${MC_MIN} คะแนน — ไม่ผ่านเกณฑ์ขั้นต่ำของ กสพท แม้คะแนนรวมจะสูงก็ยื่นไม่ได้</div>` : ''}
    <div class="tbl" style="margin-top:8px"><table><tr><th>วิชา</th><th>คะแนนดิบ</th><th>น้ำหนัก</th><th>ได้</th></tr>${r.rows.map(x => `<tr><td>${esc(x.n)}</td><td>${x.raw == null ? '<span class="mute">-</span>' : x.raw + '/' + x.full}${x.low ? ' <span class="tag bad">&lt;30</span>' : ''}</td><td>${f2(x.w)}%</td><td><b>${f2(x.pts)}</b></td></tr>`).join('')}</table></div>
    <h2 style="margin-top:14px">เทียบกับเป้าของแต่ละมหาวิทยาลัย</h2>
    ${mcUnis().map(u => { const t = mcNum(st.tg[u.id], 100), gap = t == null ? null : t - r.total; return `<div class="row between mcuni" style="padding:6px 0;border-bottom:1px solid var(--line)"><span><i class="mcdot" style="background:${u.pl}"></i>${esc(u.s || u.n)}</span>
      <span class="row" style="gap:6px"><input type="number" inputmode="decimal" min="0" max="100" step="0.01" placeholder="เป้า" value="${t == null ? '' : t}" data-mct="${u.id}" style="width:84px" aria-label="คะแนนเป้าหมาย ${esc(u.s || u.n)}">
      ${gap == null ? '<span class="mute" style="min-width:92px">ยังไม่ตั้งเป้า</span>' : gap <= 0 && !r.low.length ? '<span class="tag ok" style="min-width:92px">ถึงเป้าแล้ว</span>' : `<span class="tag ${gap <= 0 ? 'warn' : 'bad'}" style="min-width:92px">${gap <= 0 ? 'ติดเกณฑ์ 30%' : 'ขาด ' + f2(gap)}</span>`}</span></div>`; }).join('')}`;
}
function viewScore() {
  const st = mcGet();
  return `${hubTabs('progress', 'score')}<h1>คำนวณคะแนน กสพท</h1>
  <div class="card"><h2>กรอกคะแนนดิบ</h2><p class="mute" style="margin:0 0 8px">TPAT1 เต็ม 300 · A-Level วิชาละ 100 — คะแนนที่กรอกเก็บไว้ในเครื่องนี้</p>
    <div class="mcgrid">${MC_SUBJ.map(s => `<label><span>${esc(s.n)} <small class="mute">/${s.full}</small></span><input type="number" inputmode="decimal" min="0" max="${s.full}" step="0.01" value="${st.v[s.k] ?? ''}" data-mc="${s.k}"></label>`).join('')}</div>
    <div class="row" style="margin-top:10px;flex-wrap:wrap"><button data-a="mcFromApp">ประมาณจากความแม่นยำในแอป</button>${store.get('mc_tpat1_last', null) != null ? `<button data-a="mcUseMock">ใช้ผลสอบจำลอง TPAT1 ล่าสุด (${store.get('mc_tpat1_last')})</button>` : ''}<button data-a="mcClear">ล้างคะแนน</button></div></div>
  <div class="card" id="mcres">${mcResultHtml()}</div>
  <div class="card"><h2>คะแนนดิบเพิ่ม 10 คะแนน ได้คะแนนรวมเพิ่มเท่าไร</h2><div class="tbl"><table>${MC_SUBJ.filter((s, i) => i < 2 || i > 3).map(s => `<tr><td>${s.k === 'ph' ? 'ฟิสิกส์ / เคมี / ชีวะ (วิชาใดวิชาหนึ่ง)' : esc(s.n)}</td><td><b>+${(10 / s.full * s.w).toFixed(2)}</b></td></tr>`).join('')}</table></div>
    <p class="mute" style="margin:8px 0 0">คณิต 1 กับอังกฤษให้คะแนนรวมต่อคะแนนดิบมากที่สุด ส่วน TPAT1 เต็ม 300 จึงได้ +1.00 ต่อ 10 คะแนนดิบ</p></div>
  <div class="warnbox">สัดส่วนอ้างอิงเกณฑ์ กสพท TCAS70 (TPAT1 30% + A-Level 70%) ตรวจเมื่อ ${esc(TCAS70.checked)} · วิทย์ 3 วิชาคิดน้ำหนักเท่ากัน · คะแนนต่ำสุดของแต่ละคณะเปลี่ยนทุกปี ให้กรอกเป้าเองจากประกาศของ กสพท หรือ mytcas · ผลนี้เป็นการประมาณ ไม่ใช่คะแนนทางการ — <a href="${SOURCES.cotmes.u}" target="_blank" rel="noopener">cotmesadmission.com</a></div>`;
}
// พิมพ์คะแนนแล้วคำนวณใหม่ทันที โดยไม่วาดหน้าใหม่ทั้งหน้า (ช่องกรอกจะไม่หลุดโฟกัส)
document.addEventListener('input', e => {
  const k = e.target.dataset.mc, u = e.target.dataset.mct; if (!k && !u) return;
  const st = mcGet(); if (k) st.v[k] = e.target.value; else st.tg[u] = e.target.value; store.set('medcalc', st);
  const box = document.getElementById('mcres'); if (!box) return;
  const f = document.activeElement && document.activeElement.dataset.mct, pos = f ? document.activeElement.selectionStart : null;
  box.innerHTML = mcResultHtml();
  if (f) { const el = box.querySelector(`[data-mct="${f}"]`); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch { } } }
});

const MED_ACT = {
  tpat1Mock(v) { startTpat1Mock(v === 'full' ? 'full' : 'short'); },
  secNext() {
    if (!E || !E.sec) return; const p = E.sec.parts[E.sec.cur]; let left = 0; for (let i = p.a; i < p.b; i++) if (E.ans[i] == null) left++;
    if (!confirm(`ส่งส่วน "${p.name}" แล้วไปส่วนถัดไป?${left ? `\nยังไม่ได้ตอบ ${left} ข้อ` : ''}\nส่งแล้วกลับมาแก้ส่วนนี้ไม่ได้`)) return;
    mockNextSec(false);
  },
  mcFromApp() {
    const st = mcGet(); let n = 0;
    MC_SUBJ.forEach(s => { const a = attempts.filter(x => s.q(x)); if (a.length >= 5) { st.v[s.k] = String(Math.round(a.filter(x => x.ok).length / a.length * s.full)); n++; } });
    store.set('medcalc', st); render(true); toast(n ? `เติมคะแนนจากความแม่นยำในแอป ${n} วิชา (วิชาที่ทำน้อยกว่า 5 ข้อไม่ได้เติม)` : 'ยังทำโจทย์ไม่พอ — ต้องทำอย่างน้อยวิชาละ 5 ข้อ');
  },
  mcUseMock() { const v = store.get('mc_tpat1_last', null); if (v == null) return; const st = mcGet(); st.v.tp = String(v); store.set('medcalc', st); E = null; if (location.hash === '#/score') render(true); else location.hash = '#/score'; },
  mcClear() { if (!confirm('ล้างคะแนนที่กรอกทั้งหมด? (เป้าของแต่ละมหาวิทยาลัยยังอยู่)')) return; const st = mcGet(); st.v = {}; store.set('medcalc', st); render(true); },
};
