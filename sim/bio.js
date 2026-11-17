// ซิมูเลเตอร์ชีววิทยา (SIXMED) — เซลล์ พันธุศาสตร์ ร่างกายมนุษย์ พืช และนิเวศวิทยา
// ใช้เฟรมเวิร์ก SU.sim ใน sim/ui.js : ทุกตัวปรับค่าด้วยแถบเลื่อน แล้วเห็นกราฟ/ภาพเปลี่ยนทันที
const SIMK = (function () {
  const { f, txt, line, rect, circ } = SU;
  // แกนกราฟ : คืนตัวแปลงพิกัดข้อมูล → พิกเซล
  function axes(g, C, x0, y0, w, h, xmin, xmax, ymin, ymax, xl, yl) {
    line(g, x0, y0, x0, y0 - h, C.mute, 1.2); line(g, x0, y0, x0 + w, y0, C.mute, 1.2);
    if (xl) txt(g, xl, x0 + w, y0 + 14, C.mute, 10, 'right'); if (yl) txt(g, yl, x0 + 2, y0 - h - 4, C.mute, 10);
    return { X: x => x0 + (x - xmin) / (xmax - xmin) * w, Y: y => y0 - (y - ymin) / (ymax - ymin) * h };
  }
  function plot(g, P, fn, xmin, xmax, col, wd, dash, n) {
    n = n || 120; g.strokeStyle = col; g.lineWidth = wd || 2; g.setLineDash(dash || []); g.beginPath();
    for (let i = 0; i <= n; i++) { const x = xmin + (xmax - xmin) * i / n, y = fn(x); if (!isFinite(y)) continue; i ? g.lineTo(P.X(x), P.Y(y)) : g.moveTo(P.X(x), P.Y(y)); }
    g.stroke(); g.setLineDash([]);
  }
  const bar = (g, x, y0, w, h, col, label, val, C) => { rect(g, x, y0 - h, w, h, col); txt(g, label, x + w / 2, y0 + 13, C.ink, 10, 'center'); if (val != null) txt(g, val, x + w / 2, y0 - h - 4, C.ink, 10, 'center'); };
  const rng = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return { axes, plot, bar, rng };
})();

(function () {
  const { f, txt, line, rect, circ, arrow } = SU, { axes, plot, bar, rng } = SIMK;
  const reg = (name, cfg) => { SIMS[name] = { mount: host => SU.sim(host, cfg) }; };

  /* ---------- 1.1 เอนไซม์ ---------- */
  const ENZ = [{ n: 'อะไมเลสในน้ำลาย', pH: 7, T: 37 }, { n: 'เพปซิน', pH: 2, T: 37 }, { n: 'เอนไซม์แบคทีเรียบ่อน้ำร้อน', pH: 7, T: 72 }];
  const fT = (T, To) => T <= To ? Math.exp(-Math.pow((T - To) / 22, 2)) : Math.max(0, 1 - Math.pow((T - To) / 12, 2));
  const fP = (p, po) => Math.exp(-Math.pow((p - po) / 1.6, 2));
  reg('enzyme', {
    label: 'อัตราการทำงานของเอนไซม์', h: 240,
    goal: 'ตั้งซับสเตรตให้สูง แล้วเลือกตัวยับยั้งสองแบบ — แบบแข่งขัน อัตรากลับมาเกือบเท่าเดิม แบบไม่แข่งขัน อัตราสูงสุดลดลง · ลองเพิ่มอุณหภูมิเกิน 45 °C ดูเอนไซม์เสียสภาพ',
    controls: [{ id: 'e', label: 'เอนไซม์', min: 0, max: 2, step: 1, v: 0, opts: ENZ.map(x => x.n) }, { id: 'T', label: 'อุณหภูมิ', min: 0, max: 90, step: 1, v: 37, unit: '°C' }, { id: 'p', label: 'pH', min: 1, max: 12, step: .5, v: 7, dec: 1 }, { id: 'S', label: 'ความเข้มข้นซับสเตรต', min: 0, max: 10, step: .5, v: 6, dec: 1 }, { id: 'i', label: 'ตัวยับยั้ง', min: 0, max: 2, step: 1, v: 0, opts: ['ไม่มี', 'แบบแข่งขัน', 'แบบไม่แข่งขัน'] }],
    draw(g, W, H, S, t, C) {
      const E = ENZ[S.e], act = fT(S.T, E.T) * fP(S.p, E.pH), Km = S.i === 1 ? 4.5 : 1.5, Vm = S.i === 2 ? .5 : 1;
      const v = s => 100 * act * Vm * s / (Km + s), v0 = s => 100 * act * s / (1.5 + s);
      const P = axes(g, C, 40, H - 26, W - 60, H - 50, 0, 10, 0, 100, 'ซับสเตรต', 'อัตรา');
      if (S.i) plot(g, P, v0, 0, 10, C.mute, 1.5, [5, 4]); plot(g, P, v, 0, 10, C.pri, 3);
      circ(g, P.X(S.S), P.Y(v(S.S)), 6, C.bad, C.ink);
      txt(g, 'ความว่องไว ' + f(act * 100, 0) + '%', W - 16, 24, act < .3 ? C.bad : C.ok, 13, 'right');
      if (S.i) txt(g, 'เส้นประ = ไม่มีตัวยับยั้ง', W - 16, 42, C.mute, 10, 'right');
    },
    out: S => { const E = ENZ[S.e], aT = fT(S.T, E.T), aP = fP(S.p, E.pH), Km = S.i === 1 ? 4.5 : 1.5, Vm = S.i === 2 ? .5 : 1, r = 100 * aT * aP * Vm * S.S / (Km + S.S);
      return `${E.n} : อุณหภูมิเหมาะสมราว ${E.T} °C · pH เหมาะสมราว ${E.pH}<br>ผลของอุณหภูมิ ${f(aT * 100, 0)}% · ผลของ pH ${f(aP * 100, 0)}% → อัตราตอนนี้ <b>${f(r, 0)}</b> หน่วย${S.T > E.T + 8 ? '<br>⚠ เกินอุณหภูมิเหมาะสมมาก เอนไซม์เริ่มเสียสภาพ' : ''}${S.i === 1 ? '<br>แบบแข่งขัน : เพิ่มซับสเตรตมาก ๆ แล้วอัตราเข้าใกล้ค่าสูงสุดเดิม' : S.i === 2 ? '<br>แบบไม่แข่งขัน : อัตราสูงสุดเหลือครึ่งเดียวไม่ว่าซับสเตรตมากแค่ไหน' : ''}`; },
  });

  /* ---------- 1.3 การหายใจระดับเซลล์ ---------- */
  reg('resp', {
    label: 'ผลผลิตจากการสลายกลูโคส', h: 230,
    goal: 'สลับระหว่าง "มี O₂" กับ "ไม่มี O₂" แล้วเทียบจำนวน ATP · สังเกตว่าเมื่อไม่มี O₂ ไม่มี CO₂ จากไมโทคอนเดรีย และเกิดกรดแล็กติกแทน',
    controls: [{ id: 'o', label: 'ออกซิเจน', min: 0, max: 1, step: 1, v: 1, opts: ['ไม่มี O₂ (หมักกรดแล็กติก)', 'มี O₂'] }, { id: 'n', label: 'จำนวนกลูโคส', min: 1, max: 5, step: 1, v: 1, unit: 'โมเลกุล' }],
    draw(g, W, H, S, t, C) {
      const st = S.o ? [['ไกลโคลิซิส', 'ไซโทซอล'], ['แอซิทิลโคเอ', 'เมทริกซ์'], ['เครบส์', 'เมทริกซ์'], ['ถ่ายทอด e⁻', 'เยื่อชั้นใน']] : [['ไกลโคลิซิส', 'ไซโทซอล'], ['หมัก → แล็กเทต', 'ไซโทซอล']];
      const bw = (W - 20) / 4 - 6; st.forEach((s, i) => { const x = 10 + i * (bw + 6); rect(g, x, 12, bw, 42, i ? C.pri2 : C.card, C.pri); txt(g, s[0], x + bw / 2, 30, C.ink, 11, 'center'); txt(g, s[1], x + bw / 2, 46, C.mute, 9, 'center'); if (i) arrow(g, x - 6, 33, x - 1, 33, C.mute, 1.5); });
      const n = S.n, d = S.o ? { ATP: 32 * n, CO2: 6 * n, NADH: 10 * n, 'แล็กเทต': 0 } : { ATP: 2 * n, CO2: 0, NADH: 0, 'แล็กเทต': 2 * n }, mx = 32 * 5;
      const keys = Object.keys(d), cw = (W - 40) / keys.length; keys.forEach((k, i) => bar(g, 24 + i * cw, H - 22, cw - 18, d[k] / mx * (H - 100), [C.ok, C.mute, C.pri, C.bad][i], k, d[k], C));
    },
    out: S => S.o ? `กลูโคส ${S.n} โมเลกุล → ATP ราว <b>${32 * S.n}</b> (ต่อกลูโคส : ไกลโคลิซิส 2 + เครบส์ 2 + ห่วงโซ่ราว 28) · CO₂ ${6 * S.n} · ใช้ O₂ ${6 * S.n}` : `กลูโคส ${S.n} โมเลกุล → ATP สุทธิเพียง <b>${2 * S.n}</b> จากไกลโคลิซิส · การหมักไม่ให้ ATP เพิ่ม แค่คืน NAD⁺ ให้ไกลโคลิซิสเดินต่อ · ได้กรดแล็กติก ${2 * S.n}`,
  });

  /* ---------- 1.4 การแบ่งเซลล์ ---------- */
  const MIT = ['G1', 'S', 'G2', 'โพรเฟส', 'เมทาเฟส', 'แอนาเฟส', 'เทโลเฟส/ไซโทไคนีซิส'];
  const MEI = ['G1', 'S', 'G2', 'โพรเฟส I', 'เมทาเฟส I', 'แอนาเฟส I', 'เทโลเฟส I', 'เมทาเฟส II', 'แอนาเฟส II', 'เทโลเฟส II'];
  reg('celldiv', {
    label: 'จำนวนโครโมโซมและ DNA ในการแบ่งเซลล์', h: 250,
    goal: 'เลื่อนทีละระยะ ดูว่า DNA เพิ่มเท่าตัวที่ระยะ S แต่จำนวนโครโมโซมยังเท่าเดิม · ในไมโอซิส ดูว่าลดจำนวนโครโมโซมตอนไหน (2n = 4)',
    controls: [{ id: 'm', label: 'ชนิด', min: 0, max: 1, step: 1, v: 1, opts: ['ไมโทซิส', 'ไมโอซิส'], reset: true }, { id: 'k', label: 'ระยะ', min: 0, max: 9, step: 1, v: 4, fmt: v => v + 1 }],
    draw(g, W, H, S, t, C) {
      const L = S.m ? MEI : MIT, k = Math.min(S.k, L.length - 1), st = L[k];
      // กราฟ DNA ต่อเซลล์
      const dna = i => S.m ? [2, 3, 4, 4, 4, 4, 2, 2, 2, 1][i] : [2, 3, 4, 4, 4, 4, 2][i];
      const P = axes(g, C, 30, H - 22, W - 46, 70, 0, L.length - 1, 0, 4.4, '', 'DNA');
      g.strokeStyle = C.pri; g.lineWidth = 2.5; g.beginPath(); L.forEach((_, i) => { const y = P.Y(dna(i)); i ? g.lineTo(P.X(i), y) : g.moveTo(P.X(i), y); }); g.stroke();
      circ(g, P.X(k), P.Y(dna(k)), 5, C.bad);
      // ภาพเซลล์
      const cy = 78, cols = [C.bad, C.pri], twoCells = (!S.m && k === 6) || (S.m && k >= 6 && k <= 8), four = S.m && k === 9;
      const chrom = (x, y, c, dbl, ang) => { g.save(); g.translate(x, y); g.rotate(ang || 0); g.strokeStyle = c; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(dbl ? -3 : 0, -10); g.lineTo(dbl ? -3 : 0, 10); if (dbl) { g.moveTo(3, -10); g.lineTo(3, 10); } g.stroke(); g.restore(); };
      const cell = (x, r) => circ(g, x, cy, r, null, C.ink, 2);
      const doubled = k >= 2 && !(st.includes('แอนาเฟส') && !st.includes(' I')) && !(S.m && k >= 9) && !(!S.m && k >= 5) && !(S.m && k === 8);
      if (four) { [W * .2, W * .4, W * .6, W * .8].forEach((x, j) => { cell(x, 24); chrom(x - 6, cy, cols[0], false); chrom(x + 6, cy, cols[j % 2], false); }); }
      else if (twoCells) { [W * .32, W * .68].forEach((x, j) => { cell(x, 38); if (S.m) { chrom(x - 8, cy, cols[j], k < 8); chrom(x + 8, cy, cols[1 - j], k < 8); if (k === 8) { chrom(x - 20, cy, cols[j], false); chrom(x + 20, cy, cols[1 - j], false); } } else { [-18, -6, 6, 18].forEach((d, q) => chrom(x + d, cy, cols[q % 2], false)); } }); }
      else { const x = W / 2; cell(x, 52); const pos = st.includes('เมทาเฟส') ? [[-8, -22], [8, -22], [-8, 22], [8, 22]] : [[-26, -14], [-6, 16], [14, -16], [28, 14]];
        if (st === 'เมทาเฟส I' || st === 'โพรเฟส I') [[-8, -12], [8, -12], [-8, 14], [8, 14]].forEach((p, q) => chrom(x + p[0], cy + p[1], cols[q % 2], true, Math.PI / 2));
        else if (st.includes('แอนาเฟส')) [-34, -24, 24, 34].forEach((d, q) => chrom(x + d, cy + (q % 2 ? 12 : -12), cols[q % 2], st === 'แอนาเฟส I'));
        else pos.forEach((p, q) => chrom(x + p[0], cy + p[1], cols[q % 2], doubled || k === 1 || k === 2)); }
      txt(g, st, 10, 22, C.ink, 14);
    },
    out: S => { const L = S.m ? MEI : MIT, k = Math.min(S.k, L.length - 1);
      const ch = S.m ? [4, 4, 4, 4, 4, 4, 2, 2, 4, 2][k] : [4, 4, 4, 4, 4, 8, 4][k], cd = S.m ? [0, 8, 8, 8, 8, 8, 4, 4, 0, 0][k] : [0, 8, 8, 8, 8, 0, 0][k], dna = S.m ? [2, 4, 4, 4, 4, 4, 2, 2, 2, 1][k] : [2, 4, 4, 4, 4, 4, 2][k];
      return `ระยะ <b>${L[k]}</b> · โครโมโซมต่อเซลล์ <b>${ch}</b> · โครมาทิด <b>${cd || '—'}</b> · DNA (เทียบ G1 = 2) <b>${dna}</b>${S.m && k === 6 ? '<br>ไมโอซิส I แยกฮอมอโลกัส → จำนวนโครโมโซมลดเหลือครึ่ง (2n → n)' : ''}${(S.m && k === 8) || (!S.m && k === 5) ? '<br>เซนโทรเมียร์แยก โครมาทิดกลายเป็นโครโมโซมแท่งใหม่ (นับเพิ่มชั่วคราวในเซลล์เดิม)' : ''}`; },
  });

  /* ---------- 2.1 ตารางพันเนตต์ ---------- */
  const GT = ['AA', 'Aa', 'aa'], gam1 = s => s === 'AA' ? ['A', 'A'] : s === 'Aa' ? ['A', 'a'] : ['a', 'a'];
  reg('punnett', {
    label: 'ตารางพันเนตต์', h: 280,
    goal: 'ตั้งพ่อแม่ Aa × Aa ดูอัตราส่วน 3 : 1 แล้วเปิดยีนที่สอง (Bb × Bb) ดู 9 : 3 : 3 : 1 · ลองผสมทดสอบ Aa × aa',
    controls: [{ id: 'n', label: 'จำนวนยีน', min: 1, max: 2, step: 1, v: 1, opts: { 1: '1 ยีน (A)', 2: '2 ยีน (A, B)' } }, { id: 'a1', label: 'พ่อ ยีน A', min: 0, max: 2, step: 1, v: 1, opts: GT }, { id: 'a2', label: 'แม่ ยีน A', min: 0, max: 2, step: 1, v: 1, opts: GT }, { id: 'b1', label: 'พ่อ ยีน B', min: 0, max: 2, step: 1, v: 1, opts: GT.map(s => s.replace(/A/g, 'B').replace(/a/g, 'b')) }, { id: 'b2', label: 'แม่ ยีน B', min: 0, max: 2, step: 1, v: 1, opts: GT.map(s => s.replace(/A/g, 'B').replace(/a/g, 'b')) }],
    draw(g, W, H, S, t, C) {
      const two = S.n === 2, gm = (a, b) => { const A = gam1(GT[a]); if (!two) return A; const B = gam1(GT[b]).map(x => x === 'A' ? 'B' : 'b'); return [A[0] + B[0], A[0] + B[1], A[1] + B[0], A[1] + B[1]]; };
      const P1 = gm(S.a1, S.b1), P2 = gm(S.a2, S.b2), n = P1.length, sz = Math.min((W - 60) / n, (H - 40) / n), x0 = (W - sz * n) / 2 + 14, y0 = 30;
      P1.forEach((p, i) => txt(g, p, x0 + i * sz + sz / 2, y0 - 8, C.pri, 12, 'center')); P2.forEach((p, j) => txt(g, p, x0 - 16, y0 + j * sz + sz / 2 + 4, C.bad, 12, 'center'));
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const s = (P1[i] + P2[j]).split(''), A = s.filter(c => c === 'A' || c === 'a').sort().join(''), B = s.filter(c => c === 'B' || c === 'b').sort().join(''), dA = A.includes('A'), dB = !two || B.includes('B');
        const col = dA && dB ? 'rgba(48,164,108,.35)' : dA ? 'rgba(62,99,221,.3)' : dB ? 'rgba(245,165,36,.35)' : 'rgba(229,72,77,.3)';
        rect(g, x0 + i * sz, y0 + j * sz, sz - 2, sz - 2, col, C.line); txt(g, A + (two ? B : ''), x0 + i * sz + sz / 2 - 1, y0 + j * sz + sz / 2 + 4, C.ink, two ? 10 : 14, 'center');
      }
    },
    out: S => { const two = S.n === 2, pd = i => ({ 0: 1, 1: .75, 2: 0 }[i]); const pA = (a, b) => { const x = gam1(GT[a]).filter(c => c === 'A').length / 2, y = gam1(GT[b]).filter(c => c === 'A').length / 2; return 1 - (1 - x) * (1 - y); };
      const A = pA(S.a1, S.a2), B = two ? pA(S.b1, S.b2) : 1, r = x => f(x * 100, 1) + '%';
      return two ? `ฟีโนไทป์ : เด่นทั้งคู่ <b>${r(A * B)}</b> · เด่น A ด้อย b <b>${r(A * (1 - B))}</b> · ด้อย a เด่น B <b>${r((1 - A) * B)}</b> · ด้อยทั้งคู่ <b>${r((1 - A) * (1 - B))}</b><br>แยกคิดทีละยีนแล้วคูณ : P(เด่น A) = ${f(A, 2)} , P(เด่น B) = ${f(B, 2)}` : `ฟีโนไทป์เด่น <b>${r(A)}</b> · ด้อย <b>${r(1 - A)}</b> (ช่องสีน้ำเงิน = เด่น · สีแดง = ด้อย)`; },
  });

  /* ---------- 2.3 PCR ---------- */
  reg('pcr', {
    label: 'การเพิ่มจำนวน DNA ด้วย PCR', h: 230, animate: true, duration: 30, loop: false,
    goal: 'กดเล่นแล้วดูจำนวน DNA เพิ่มทีละรอบ — ลองลดประสิทธิภาพเหลือ 80% ดูว่า 30 รอบได้น้อยลงกี่เท่า',
    controls: [{ id: 'n0', label: 'DNA เป้าหมายเริ่มต้น', min: 1, max: 100, step: 1, v: 10, unit: 'ชุด' }, { id: 'e', label: 'ประสิทธิภาพต่อรอบ', min: 50, max: 100, step: 5, v: 100, unit: '%' }],
    draw(g, W, H, S, t, C) {
      const c = Math.floor(t), r = 1 + S.e / 100, N = k => S.n0 * Math.pow(r, k), P = axes(g, C, 44, H - 24, W - 60, H - 60, 0, 30, 0, 12, 'รอบ', 'log₁₀(จำนวน)');
      for (let y = 0; y <= 12; y += 3) txt(g, '10' + ['⁰', '³', '⁶', '⁹', '¹²'][y / 3], 38, P.Y(y) + 4, C.mute, 9, 'right');
      for (let k = 0; k <= c; k++) { const x = P.X(k), y = P.Y(Math.log10(N(k))); rect(g, x - 3, y, 6, P.Y(0) - y, k === c ? C.bad : C.pri); }
      const ph = t - c, lbl = ph < .33 ? 'แยกสาย 95 °C' : ph < .66 ? 'ไพรเมอร์เกาะ ~55 °C' : 'ต่อสาย 72 °C';
      txt(g, 'รอบที่ ' + c + ' · ' + lbl, W - 14, 22, C.ink, 12, 'right');
    },
    out: (S, t) => { const c = Math.floor(t), r = 1 + S.e / 100, N = S.n0 * Math.pow(r, c); return `หลัง ${c} รอบ : ${S.n0} × ${f(r, 2)}<sup>${c}</sup> ≈ <b>${N.toExponential(2)}</b> ชุด${S.e < 100 ? ` · ถ้าประสิทธิภาพ 100% จะได้ ${(S.n0 * Math.pow(2, c)).toExponential(2)} ชุด` : ''}`; },
  });

  /* ---------- 2.4 การเปลี่ยนแปลงความถี่ยีนแบบสุ่ม ---------- */
  reg('drift', {
    label: 'ความถี่แอลลีลในประชากรเล็กและใหญ่', h: 250,
    goal: 'ตั้งประชากรเล็ก (N = 10) แล้วกดสุ่มใหม่หลายครั้ง แอลลีลมักหายไปหรือตรึงอยู่ภายในไม่กี่รุ่น · ตั้ง N = 1,000 เส้นแทบไม่ขยับ (ใกล้สมดุลฮาร์ดี–ไวน์เบิร์ก) · ลองเพิ่มการคัดเลือกต่อแอลลีล a',
    controls: [{ id: 'N', label: 'ขนาดประชากร N', min: 0, max: 3, step: 1, v: 0, opts: ['10', '50', '200', '1,000'] }, { id: 'p', label: 'ความถี่ p เริ่มต้น', min: .1, max: .9, step: .05, v: .5, dec: 2 }, { id: 's', label: 'การคัดเลือกต่อ aa', min: 0, max: .5, step: .05, v: 0, dec: 2 }, { id: 'seed', label: 'สุ่มชุดใหม่', min: 1, max: 20, step: 1, v: 1 }],
    draw(g, W, H, S, t, C) {
      const N = [10, 50, 200, 1000][S.N], G = 60, P = axes(g, C, 34, H - 22, W - 50, H - 50, 0, G, 0, 1, 'รุ่น', 'p'), R = rng(S.seed * 97 + S.N * 13), cols = [C.pri, C.bad, C.ok, C.warn, '#8e4ec6'];
      line(g, P.X(0), P.Y(.5), P.X(G), P.Y(.5), C.line, 1, [3, 4]);
      cols.forEach(col => { let p = S.p; g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(P.X(0), P.Y(p));
        for (let k = 1; k <= G; k++) { const q = 1 - p, wbar = 1 - S.s * q * q, pe = (p * p + p * q) / wbar; let a = 0; const n2 = 2 * N; if (n2 <= 400) { for (let i = 0; i < n2; i++) if (R() < pe) a++; p = a / n2; } else { const sd = Math.sqrt(pe * (1 - pe) / n2), z = Math.sqrt(-2 * Math.log(R() + 1e-9)) * Math.cos(2 * Math.PI * R()); p = Math.min(1, Math.max(0, pe + sd * z)); } g.lineTo(P.X(k), P.Y(p)); }
        g.stroke(); });
      txt(g, 'ประชากรจำลอง 5 กลุ่ม (N = ' + N + ')', W - 14, 20, C.ink, 11, 'right');
    },
    out: S => `แต่ละเส้นคือประชากรแยกกัน 1 กลุ่ม เริ่มที่ p = ${f(S.p, 2)}<br>${S.N === 0 ? 'ประชากรเล็ก : การสุ่มทำให้ p เหวี่ยงแรง แอลลีลหายหรือตรึงได้เร็ว (genetic drift)' : S.N === 3 ? 'ประชากรใหญ่ : p แทบคงที่ ถ้าไม่มีการคัดเลือก' : 'ขนาดปานกลาง : drift ช้าลงตามขนาดประชากร'}${S.s > 0 ? `<br>การคัดเลือกต่อ aa = ${f(S.s, 2)} → p มีแนวโน้มเพิ่มขึ้น (แอลลีล a ลดลง)` : ''}`,
  });
})();
