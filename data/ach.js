/* ระบบความสำเร็จ (Achievements) — SIXMED : ธีมเส้นทางสู่การเป็นแพทย์ (ตรวจเคส วิชาเฉพาะแพทย์ สนามสอบ อยู่เวร พรีคลินิก เสื้อกาวน์) — คำนวณจากสถิติที่มีอยู่ + เหตุการณ์เล็กน้อย (ดูสไลด์พิสูจน์ ลองซิมูเลเตอร์ ลองธีม)
   เก็บการปลดล็อกใน sx_ach {id: เวลา} และตรวจใหม่ทุกครั้งที่ render */
function achMark(kind, key) { const m = store.get('seen_' + kind, []); if (!m.includes(key)) { m.push(key); store.set('seen_' + kind, m); } }
const achSeen = kind => store.get('seen_' + kind, []).length;

const ACH_DEFS = (() => {
  const L = [];
  const add = (id, icon, name, desc, g, p, group) => L.push({ id, icon, name, desc, g, p, group });
  const okAtt = f => attempts.filter(a => a.ok && f(a)).length;
  const maxRun = () => { let b = 0, c = 0; attempts.forEach(a => { c = a.ok ? c + 1 : 0; b = Math.max(b, c); }); return b; };
  const hour = a => new Date(a.ts).getHours();
  const redo = () => { const bad = new Set(); let n = 0, seen = new Set(); attempts.forEach(a => { if (a.ok && bad.has(a.qid) && !seen.has(a.qid)) { n++; seen.add(a.qid); } if (!a.ok) bad.add(a.qid); }); return n; };
  const dailyDays = () => Object.values(store.get('dlog', {})).filter(x => x.total > 0 && x.done >= x.total).length;
  const bestMock = () => mocks.reduce((m, x) => Math.max(m, x.total ? Math.round(x.score / x.total * 100) : 0), 0);
  const groupsOk = () => ['tpat1', 'alevel'].filter(g => attempts.some(a => a.ok && a.group === g)).length;
  const lvl = () => TITLES.map(t => t[0]).filter(v => xpNow() >= v).length - 1;
  const acc = () => attempts.length >= 50 ? Math.round(attempts.filter(a => a.ok).length / attempts.length * 100) : 0;

  const okTopic = re => okAtt(a => re.test(a.topic || '') || re.test(a.subject || ''));
  const mockT1 = () => mocks.filter(m => /^สอบจำลอง TPAT1/.test(m.set || '')).length;
  const calcUsed = () => Object.values((store.get('medcalc', {}) || {}).v || {}).filter(v => v !== '' && v != null).length;
  const tgUsed = () => Object.values((store.get('medcalc', {}) || {}).tg || {}).filter(v => v !== '' && v != null).length;

  /* ตรวจเคส (ทำโจทย์) */
  add('q1', '🩺', 'ผู้ป่วยรายแรก', 'ทำโจทย์ครบ 1 ข้อ', 1, () => attempts.length, 'ตรวจเคส');
  add('q10', '📋', 'เปิดแฟ้มประวัติ', 'ทำโจทย์ครบ 10 ข้อ', 10, () => attempts.length, 'ตรวจเคส');
  add('q100', '🏥', 'อยู่เวร OPD เต็มวัน', 'ทำโจทย์ครบ 100 ข้อ', 100, () => attempts.length, 'ตรวจเคส');
  add('q300', '🚑', 'รับเคสห้องฉุกเฉิน', 'ทำโจทย์ครบ 300 ข้อ', 300, () => attempts.length, 'ตรวจเคส');
  add('run10', '🎯', 'วินิจฉัยแม่นยำ', 'ตอบถูกติดต่อกัน 10 ข้อ', 10, maxRun, 'ตรวจเคส');
  add('acc80', '🧾', 'แม่นเหมือนผลแล็บ', 'ความแม่นยำรวมถึง 80% (ทำอย่างน้อย 50 ข้อ)', 80, acc, 'ตรวจเคส');
  add('redo10', '🔁', 'ประชุมทบทวนเคสที่พลาด', 'ทำข้อที่เคยผิดให้ถูก 10 ข้อ', 10, redo, 'ตรวจเคส');
  add('num5', '💉', 'คำนวณขนาดยาเป็น', 'ตอบถูกโจทย์แบบกรอกตัวเลข 5 ข้อ', 5, () => okAtt(a => { const q = typeof allQ === 'function' ? allQ().find(x => x.id === a.qid) : null; return q ? q.type === 'num' : /^n-/.test(a.qid); }), 'ตรวจเคส');
  add('allg', '🧭', 'ครบทั้งสองสนาม กสพท', 'ตอบถูกอย่างน้อย 1 ข้อทั้งใน TPAT1 และ A-Level', 2, groupsOk, 'ตรวจเคส');

  /* วิชาเฉพาะแพทย์ */
  add('iq10', '🧠', 'สมองไวแบบหมอ', 'ตอบถูกโจทย์เชาวน์ปัญญา 10 ข้อ', 10, () => okTopic(/เชาวน์ปัญญา/), 'วิชาเฉพาะแพทย์');
  add('eth10', '⚖️', 'จรรยาแพทย์', 'ตอบถูกโจทย์จริยธรรมทางการแพทย์ 10 ข้อ', 10, () => okTopic(/จริยธรรม/), 'วิชาเฉพาะแพทย์');
  add('lnk10', '🔗', 'อ่านงานวิจัยขาด', 'ตอบถูกโจทย์ความคิดเชื่อมโยง 10 ข้อ', 10, () => okTopic(/เชื่อมโยง/), 'วิชาเฉพาะแพทย์');
  add('bio20', '🧬', 'รู้ลึกถึงระดับเซลล์', 'ตอบถูกโจทย์ชีววิทยา 20 ข้อ', 20, () => okTopic(/ชีววิทยา/), 'วิชาเฉพาะแพทย์');
  add('chem20', '⚗️', 'เภสัชเคมีฝึกหัด', 'ตอบถูกโจทย์เคมี 20 ข้อ', 20, () => okTopic(/^เคมี$/), 'วิชาเฉพาะแพทย์');
  add('calc10', '📈', 'หมอสายคำนวณ', 'ตอบถูกโจทย์แคลคูลัส 10 ข้อ', 10, () => okAtt(a => /^(a|n)-k\d/.test(a.qid) || /แคลคูลัส/.test(a.topic || '')), 'วิชาเฉพาะแพทย์');

  /* สนามสอบ */
  add('mock1', '📝', 'ซ้อมสอบครั้งแรก', 'ทำข้อสอบจำลองจับเวลา 1 ชุด', 1, () => mocks.length, 'สนามสอบ');
  add('mockT1', '🩻', 'สนามจริง กสพท', 'ทำสอบจำลอง TPAT1 เต็มรูปแบบ 1 ชุด', 1, mockT1, 'สนามสอบ');
  add('mock5', '🏟️', 'ซ้อมจนชินสนาม', 'ทำข้อสอบจำลองครบ 5 ชุด', 5, () => mocks.length, 'สนามสอบ');
  add('mock80', '🥇', 'ติดหมอแน่', 'ได้คะแนนสอบจำลองตั้งแต่ 80%', 80, bestMock, 'สนามสอบ');
  add('calc', '🧮', 'วางแผนยื่นคณะแพทย์', 'กรอกคะแนนในตัวคำนวณ กสพท ครบ 8 วิชา', 8, calcUsed, 'สนามสอบ');
  add('target', '🎯', 'มีคณะในฝัน', 'ตั้งคะแนนเป้าหมายของมหาวิทยาลัยอย่างน้อย 1 แห่ง', 1, tgUsed, 'สนามสอบ');

  /* อยู่เวร (ความสม่ำเสมอ) */
  add('d1', '🗓️', 'ราวด์วอร์ดวันแรก', 'ทำภารกิจรายวันครบ 1 วัน', 1, dailyDays, 'อยู่เวร');
  add('d5', '📅', 'อยู่เวรครบ 5 วัน', 'ทำภารกิจรายวันครบรวม 5 วัน', 5, dailyDays, 'อยู่เวร');
  add('ds3', '💓', 'ชีพจรสม่ำเสมอ', 'ภารกิจครบติดกัน 3 วัน', 3, () => missionStreak(), 'อยู่เวร');
  add('ds7', '🫀', 'หัวใจแกร่ง', 'ภารกิจครบติดกัน 7 วัน', 7, () => missionStreak(), 'อยู่เวร');
  add('st14', '🩹', 'อินเทิร์นใจสู้', 'อ่านหนังสือต่อเนื่อง 14 วัน', 14, () => streak(), 'อยู่เวร');
  add('hours5', '⏱️', 'ชั่วโมงอยู่เวร', 'เวลาอ่านสะสม 5 ชั่วโมง', 300, () => Math.round(studies.reduce((a, s) => a + s.secs, 0) / 60), 'อยู่เวร');

  /* พรีคลินิก (เรียนรู้) */
  add('read10', '📚', 'ห้องสมุดคณะแพทย์', 'อ่านบทเรียนครบ 10 บท', 10, () => Object.keys(readLog()).length, 'พรีคลินิก');
  add('read30', '🎓', 'ผ่านพรีคลินิก', 'อ่านบทเรียนครบ 30 บท', 30, () => Object.keys(readLog()).length, 'พรีคลินิก');
  add('proof5', '🧪', 'เข้าใจกลไก ไม่ท่องจำ', 'เปิดอ่านสไลด์ที่มาของสูตรหรือแนวคิด 5 หน้า', 5, () => achSeen('proof'), 'พรีคลินิก');
  add('proof20', '🔬', 'นักสรีรวิทยา', 'เปิดอ่านสไลด์ที่มาของสูตรหรือแนวคิด 20 หน้า', 20, () => achSeen('proof'), 'พรีคลินิก');
  add('sim5', '🎛️', 'ห้องแล็บสรีรวิทยา', 'เปิดซิมูเลเตอร์ 5 ตัว', 5, () => achSeen('sim'), 'พรีคลินิก');
  add('sim15', '🧫', 'นักวิจัยรุ่นเยาว์', 'เปิดซิมูเลเตอร์ 15 ตัว', 15, () => achSeen('sim'), 'พรีคลินิก');

  /* เสื้อกาวน์ */
  add('lv2', '🥼', 'ขึ้นปี 2', 'ถึงระดับ ปี 2', 1, () => lvl() >= 1 ? 1 : 0, 'เสื้อกาวน์');
  add('lv4', '🩺', 'ขึ้นวอร์ด', 'ถึงระดับ ปี 4', 1, () => lvl() >= 3 ? 1 : 0, 'เสื้อกาวน์');
  add('lv6', '👩‍⚕️', 'แพทย์ใช้ทุน', 'ถึงระดับสูงสุด', 1, () => lvl() >= 5 ? 1 : 0, 'เสื้อกาวน์');
  add('nick', '🪪', 'ปักชื่อบนกาวน์', 'ตั้งชื่อบนเสื้อกาวน์ของตัวเอง', 1, () => store.get('nick', '') && store.get('nick', '') !== 'น้องหมอ' ? 1 : 0, 'เสื้อกาวน์');
  add('theme5', '🏛️', 'ทัวร์คณะแพทย์', 'ลองธีมมหาวิทยาลัย 5 แบบ', 5, () => achSeen('theme'), 'เสื้อกาวน์');
  add('themeAll', '🌈', 'ครบทุกคณะแพทย์', 'ลองธีมครบทุกแบบ', THEMES.length, () => achSeen('theme'), 'เสื้อกาวน์');

  /* ของสะสม */
  add('shop1', '🛍️', 'ช้อปที่สหกรณ์คณะ', 'แลกของชิ้นแรกจากร้านค้าด้วยเหรียญ', 1, () => Object.keys(store.get('own', {})).length ? 1 : 0, 'ของสะสม');
  add('coll3', '🧰', 'กระเป๋าหมอครบชุด', 'มีของที่แลกมาครบ 3 ชิ้น', 3, () => Object.keys(store.get('own', {})).length, 'ของสะสม');
  add('coin500', '🪙', 'เงินเดือนแรก', 'สะสมเหรียญรวม 500 เหรียญ', 500, () => (store.get('coins', null) || { earned: 0 }).earned, 'ของสะสม');

  /* ลับ */
  add('egg', '🔍', 'ตาไวแบบหมอ', 'หาของลับที่ซ่อนไว้ในแอป', 1, () => store.get('egg', 0) ? 1 : 0, 'ลับ');
  add('owl', '🦉', 'อยู่เวรดึก', 'ทำโจทย์ช่วง 23:00–04:59', 1, () => attempts.some(a => hour(a) >= 23 || hour(a) < 5) ? 1 : 0, 'ลับ');
  add('lark', '🌅', 'ราวด์เช้า', 'ทำโจทย์ช่วง 05:00–06:59', 1, () => attempts.some(a => hour(a) >= 5 && hour(a) < 7) ? 1 : 0, 'ลับ');
  return L;
})();

const achState = () => store.get('ach', {});
function achProgress(d) { const p = Math.max(0, Math.min(d.g, d.p())); return { p, done: p >= d.g }; }
let achBusy = false;
function achCheck(silent) {
  if (achBusy) return; achBusy = true;
  try {
    const st = achState(), fresh = [];
    ACH_DEFS.forEach(d => { if (!st[d.id] && achProgress(d).done) { st[d.id] = Date.now(); fresh.push(d); } });
    if (fresh.length || store.get('ach', null) === null) {
      store.set('ach', st);
      if (!silent) { toast('🏆 ปลดล็อก: ' + fresh.map(d => d.name).join(' · ')); if (typeof confetti === 'function') confetti(); }
    }
  } finally { achBusy = false; }
}
function achCard() {
  const st = achState(), done = ACH_DEFS.filter(d => st[d.id]), recent = done.sort((a, b) => st[b.id] - st[a.id]).slice(0, 5);
  return `<button class="card achcard" data-a="achOpen"><div class="row between"><h2 style="margin:0">🏆 ความสำเร็จ</h2><span class="tag">${done.length}/${ACH_DEFS.length}</span></div>
    <div class="bar" style="margin:10px 0 6px"><i style="width:${pct(done.length, ACH_DEFS.length)}%"></i></div>
    <div class="achrow">${recent.length ? recent.map(d => `<span title="${esc(d.name)}">${d.icon}</span>`).join('') : '<span class="mute" style="font-size:13px">ยังไม่มี — ทำโจทย์ข้อแรกเพื่อปลดล็อกอันแรก</span>'}</div></button>`;
}
function achSheet(open) {
  let el = $('#achsheet'); if (el) el.remove(); if (!open) return;
  const st = achState(), groups = [...new Set(ACH_DEFS.map(d => d.group))], done = ACH_DEFS.filter(d => st[d.id]).length;
  const item = d => { const pr = achProgress(d), on = !!st[d.id]; return `<div class="ach ${on ? 'on' : ''}"><i>${on ? d.icon : '🔒'}</i><div><b>${esc(d.name)}</b><small>${esc(d.desc)}</small>${on ? `<small class="when">ปลดล็อก ${new Date(st[d.id]).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</small>` : `<div class="bar"><i style="width:${pct(pr.p, d.g)}%"></i></div><small>${pr.p}/${d.g}</small>`}</div></div>`; };
  el = document.createElement('div'); el.id = 'achsheet'; el.className = 'omr'; el.setAttribute('data-a', 'achClose');
  el.innerHTML = `<div><div class="row between"><h2 style="margin:0">🏆 ความสำเร็จ <span class="tag">${done}/${ACH_DEFS.length}</span></h2><button data-a="achClose">ปิด</button></div>
    ${groups.map(g => `<p class="mute" style="margin:14px 0 6px">${g}</p><div class="achgrid">${ACH_DEFS.filter(d => d.group === g).map(item).join('')}</div>`).join('')}</div>`;
  document.body.appendChild(el);
}
const ACH_ACT = {
  achOpen() { achCheck(true); achSheet(true); },
  achClose() { achSheet(false); },
  adminAchAll() { const st = {}; ACH_DEFS.forEach(d => st[d.id] = Date.now()); store.set('ach', st); render(true); achSheet(true); },
  adminAchReset() { store.set('ach', {}); store.set('seen_proof', []); store.set('seen_sim', []); store.set('seen_theme', []); store.set('egg', 0); render(true); achSheet(true); },
};
