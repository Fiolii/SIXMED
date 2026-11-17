// ซิมูเลเตอร์เคมี (SIXMED) — ใช้กับบทเคมีที่ยังไม่มีซิม
(function () {
  const { f, txt, line, rect, circ, arrow } = SU, { axes, plot, bar, rng } = SIMK;
  const reg = (name, cfg) => { SIMS[name] = { mount: host => SU.sim(host, cfg) }; };

  /* ---------- 1.1 การจัดเรียงอิเล็กตรอน ---------- */
  const SUB = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
  const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
  const fill = Z => { const o = {}; let e = Z; SUB.forEach(([s, c]) => { const k = Math.min(c, e); o[s] = k; e -= k; }); if (Z === 24) { o['4s'] = 1; o['3d'] = 5; } if (Z === 29) { o['4s'] = 1; o['3d'] = 10; } return o; };
  reg('econfig', {
    label: 'การจัดเรียงอิเล็กตรอน', h: 250,
    goal: 'เลื่อน Z ทีละตัวแล้วดูลำดับการเติม 4s ก่อน 3d · ดู Cr (24) และ Cu (29) ซึ่งเป็นข้อยกเว้น',
    controls: [{ id: 'Z', label: 'เลขอะตอม Z', min: 1, max: 36, step: 1, v: 26, fmt: v => v + ' (' + SYM[v - 1] + ')' }],
    draw(g, W, H, S, t, C) {
      const o = fill(S.Z), rows = [['1s'], ['2s', '2p'], ['3s', '3p', '3d'], ['4s', '3d_', '4p']], bw = Math.min(20, (W - 90) / 12);
      SUB.forEach(([s, c], i) => { const n = c / 2, y = H - 24 - i * 27, x0 = 54; txt(g, s, 14, y + 14, C.ink, 12); for (let b = 0; b < n; b++) { const x = x0 + b * (bw + 3); rect(g, x, y, bw, 20, null, C.mute); const e = o[s], up = b < Math.min(e, n), dn = e > n ? b < e - n : false; if (s === '3d' && (S.Z === 24)) { } if (up) txt(g, '↑', x + bw / 2 - 3, y + 15, C.pri, 13, 'center'); if (dn) txt(g, '↓', x + bw / 2 + 3, y + 15, C.bad, 13, 'center'); } });
      txt(g, 'พลังงานสูงขึ้น ↑', W - 12, 18, C.mute, 10, 'right');
    },
    out: S => { const o = fill(S.Z), cfg = SUB.filter(([s]) => o[s]).map(([s]) => s + '<sup>' + o[s] + '</sup>').join(' '), n = o['4s'] || o['4p'] || o['3d'] ? 4 : o['3s'] || o['3p'] ? 3 : o['2s'] ? 2 : 1, ns = o[n + 's'] || 0, np = o[n + 'p'] || 0, d = n === 4 ? o['3d'] : 0;
      const grp = S.Z === 2 ? 18 : np ? 12 + ns + np : d ? ns + d : ns; return `${SYM[S.Z - 1]} (Z = ${S.Z}) : ${cfg}<br>คาบที่ <b>${n}</b> · หมู่ที่ <b>${grp}</b>${d ? ' (ธาตุแทรนซิชัน บล็อก d)' : ''} · เวเลนซ์อิเล็กตรอน ${ns + np}${S.Z === 24 || S.Z === 29 ? '<br>ข้อยกเว้น : ย้าย e⁻ จาก 4s ไป 3d เพราะ 3d ครึ่งเต็มหรือเต็มเสถียรกว่า' : ''}`; },
  });

  /* ---------- 1.2 รูปร่างโมเลกุล VSEPR ---------- */
  const VS = { '2,0': ['เส้นตรง', '180°', 'CO₂'], '3,0': ['สามเหลี่ยมแบนราบ', '120°', 'BF₃'], '3,1': ['มุมงอ', '< 120°', 'SO₂'], '4,0': ['ทรงสี่หน้า', '109.5°', 'CH₄'], '4,1': ['พีระมิดฐานสามเหลี่ยม', '≈ 107°', 'NH₃'], '4,2': ['มุมงอ', '≈ 104.5°', 'H₂O'], '5,0': ['พีระมิดคู่ฐานสามเหลี่ยม', '90°, 120°', 'PCl₅'], '5,1': ['ไม้กระดก', '< 90°, < 120°', 'SF₄'], '5,2': ['รูปตัว T', '< 90°', 'ClF₃'], '5,3': ['เส้นตรง', '180°', 'XeF₂'], '6,0': ['ทรงแปดหน้า', '90°', 'SF₆'], '6,1': ['พีระมิดฐานสี่เหลี่ยม', '< 90°', 'BrF₅'], '6,2': ['สี่เหลี่ยมแบนราบ', '90°', 'XeF₄'] };
  reg('vsepr', {
    label: 'รูปร่างโมเลกุลตามทฤษฎี VSEPR', h: 230,
    goal: 'ตั้งกลุ่มอิเล็กตรอน 4 กลุ่ม แล้วเพิ่มคู่โดดเดี่ยวทีละคู่ : CH₄ → NH₃ → H₂O มุมพันธะเล็กลง เพราะคู่โดดเดี่ยวผลักแรงกว่า',
    controls: [{ id: 'd', label: 'กลุ่มอิเล็กตรอนรอบอะตอมกลาง', min: 2, max: 6, step: 1, v: 4 }, { id: 'l', label: 'คู่อิเล็กตรอนโดดเดี่ยว', min: 0, max: 3, step: 1, v: 0 }],
    draw(g, W, H, S, t, C) {
      const l = Math.min(S.l, S.d === 2 ? 0 : S.d === 3 ? 1 : S.d === 4 ? 2 : S.d === 5 ? 3 : 2), cx = W / 2, cy = H / 2 + 6, R = 70;
      const angs = { 2: [0, 180], 3: [90, 210, 330], 4: [90, 200, 270, 340], 5: [90, 270, 0, 140, 220], 6: [0, 60, 120, 180, 240, 300] }[S.d], lpIdx = { 3: [0], 4: [0, 2], 5: [2, 3, 4], 6: [0, 3] }[S.d] || [];
      angs.forEach((a, i) => { const r = a * Math.PI / 180, x = cx + Math.cos(r) * R, y = cy - Math.sin(r) * R, lp = lpIdx.slice(0, l).includes(i);
        if (lp) { g.fillStyle = 'rgba(229,72,77,.25)'; g.beginPath(); g.ellipse(cx + Math.cos(r) * R * .55, cy - Math.sin(r) * R * .55, 22, 12, -r, 0, 7); g.fill(); txt(g, '••', cx + Math.cos(r) * R * .55, cy - Math.sin(r) * R * .55 + 4, C.bad, 14, 'center'); }
        else { line(g, cx, cy, x, y, C.ink, 4); circ(g, x, y, 13, C.pri2, C.pri); } });
      circ(g, cx, cy, 17, C.pri, C.ink); txt(g, 'A', cx, cy + 5, '#fff', 14, 'center');
    },
    out: S => { const l = Math.min(S.l, S.d === 2 ? 0 : S.d === 3 ? 1 : S.d === 4 ? 2 : S.d === 5 ? 3 : 2), v = VS[S.d + ',' + l]; return `กลุ่มอิเล็กตรอน ${S.d} · คู่โดดเดี่ยว ${l}${l !== S.l ? ' (ปรับให้เป็นไปได้)' : ''} → รูปร่าง <b>${v[0]}</b> · มุมพันธะ ${v[1]} · ตัวอย่าง ${v[2]}<br>รูปร่างโมเลกุลดูจากตำแหน่งอะตอมเท่านั้น คู่โดดเดี่ยวไม่นับเป็น "แขน" แต่ผลักให้มุมแคบลง`; },
  });

  /* ---------- 1.3 แก๊สอุดมคติ ---------- */
  reg('idealgas', {
    label: 'แก๊สอุดมคติ PV = nRT', h: 220, animate: true, duration: 600, loop: true,
    goal: 'เพิ่มอุณหภูมิ (อนุภาควิ่งเร็วขึ้น) หรือลดปริมาตร (กล่องแคบลง) ดูความดันเพิ่ม · คง T แล้วลด V ครึ่งหนึ่ง ความดันเพิ่มสองเท่า (กฎของบอยล์)',
    controls: [{ id: 'n', label: 'จำนวนโมล n', min: .5, max: 3, step: .5, v: 1, dec: 1, unit: 'mol' }, { id: 'T', label: 'อุณหภูมิ', min: 100, max: 600, step: 10, v: 300, unit: 'K' }, { id: 'V', label: 'ปริมาตร', min: 10, max: 50, step: 1, v: 25, unit: 'L' }],
    draw(g, W, H, S, t, C) {
      const bw = 60 + (W - 140) * (S.V - 10) / 40, x0 = 14, y0 = 14, bh = H - 28, R = rng(5), N = Math.round(S.n * 18), sp = Math.sqrt(S.T / 300) * 60;
      rect(g, x0, y0, bw, bh, 'rgba(80,150,255,.08)', C.ink);
      for (let i = 0; i < N; i++) { const a = R() * 6.28, vx = Math.cos(a) * sp * (.6 + R() * .8), vy = Math.sin(a) * sp * (.6 + R() * .8), px = R() * bw, py = R() * bh;
        const m = (p, v, L) => { let q = (p + v * t) % (2 * L); if (q < 0) q += 2 * L; return q > L ? 2 * L - q : q; };
        circ(g, x0 + 4 + m(px, vx, bw - 8), y0 + 4 + m(py, vy, bh - 8), 3.5, `hsl(${Math.max(0, 240 - S.T / 3)},80%,55%)`); }
      const P = S.n * .0821 * S.T / S.V; txt(g, 'P = ' + f(P, 2) + ' atm', W - 12, 30, C.pri, 18, 'right');
    },
    out: S => { const P = S.n * .0821 * S.T / S.V; return `P = nRT/V = ${S.n} × 0.0821 × ${S.T} / ${S.V} = <b>${f(P, 2)} atm</b><br>อนุภาคเร็วขึ้นตาม √T และชนผนังถี่ขึ้นเมื่อกล่องเล็กลง ความดันจึงเพิ่ม`; },
  });

  /* ---------- 2.1 สารกำหนดปริมาณ ---------- */
  reg('stoich', {
    label: 'สารกำหนดปริมาณ : 2H₂ + O₂ → 2H₂O', h: 220,
    goal: 'ตั้ง H₂ 4 mol กับ O₂ 3 mol แล้วหาว่าสารใดหมดก่อน และเหลือสารใดกี่โมล',
    controls: [{ id: 'h', label: 'H₂ เริ่มต้น', min: 0, max: 8, step: .5, v: 4, unit: 'mol', dec: 1 }, { id: 'o', label: 'O₂ เริ่มต้น', min: 0, max: 5, step: .5, v: 3, unit: 'mol', dec: 1 }],
    draw(g, W, H, S, t, C) {
      const x = Math.min(S.h / 2, S.o), after = { H2: S.h - 2 * x, O2: S.o - x, H2O: 2 * x }, before = { H2: S.h, O2: S.o, H2O: 0 }, mx = 10, cw = (W - 30) / 6;
      ['H2', 'O2', 'H2O'].forEach((k, i) => { const lab = { H2: 'H₂', O2: 'O₂', H2O: 'H₂O' }[k]; bar(g, 16 + i * 2 * cw, H - 30, cw - 8, before[k] / mx * (H - 80), C.mute, lab + ' ก่อน', f(before[k], 1), C); bar(g, 16 + i * 2 * cw + cw, H - 30, cw - 8, after[k] / mx * (H - 80), [C.pri, C.bad, C.ok][i], 'หลัง', f(after[k], 1), C); });
    },
    out: S => { const x = Math.min(S.h / 2, S.o), lim = S.h / 2 < S.o ? 'H₂' : S.h / 2 > S.o ? 'O₂' : 'ทั้งคู่ (พอดี)'; return `อัตราส่วนในสมการ H₂ : O₂ = 2 : 1 · H₂ ${S.h} mol ใช้ O₂ ได้ ${f(S.h / 2, 2)} mol<br>สารกำหนดปริมาณ : <b>${lim}</b> · ได้ H₂O <b>${f(2 * x, 2)} mol</b> · เหลือ H₂ ${f(S.h - 2 * x, 2)} , O₂ ${f(S.o - x, 2)} mol`; },
  });

  /* ---------- 2.2 อัตราการเกิดปฏิกิริยา : การกระจายพลังงาน ---------- */
  const mb = (E, T) => Math.sqrt(E) * Math.exp(-E * 1000 / (8.314 * T)) / Math.pow(T, 1.5);
  reg('rate', {
    label: 'อุณหภูมิ พลังงานก่อกัมมันต์ และอัตราการเกิดปฏิกิริยา', h: 240,
    goal: 'เพิ่มอุณหภูมิเพียง 10 K แล้วดูสัดส่วนโมเลกุลที่มีพลังงานเกิน Ea (พื้นที่สีแดง) เพิ่มขึ้นเกือบเท่าตัว · เปิดตัวเร่งปฏิกิริยาเพื่อลด Ea',
    controls: [{ id: 'T', label: 'อุณหภูมิ', min: 280, max: 400, step: 5, v: 300, unit: 'K' }, { id: 'Ea', label: 'Ea', min: 20, max: 80, step: 1, v: 50, unit: 'kJ/mol' }, { id: 'c', label: 'ตัวเร่งปฏิกิริยา', min: 0, max: 1, step: 1, v: 0, opts: ['ไม่ใส่', 'ใส่ (Ea ลด 30%)'] }],
    draw(g, W, H, S, t, C) {
      const Ea = S.Ea * (S.c ? .7 : 1), mxE = 25, ref = mb(1.2, 280), P = axes(g, C, 30, H - 24, W - 44, H - 50, 0, mxE, 0, 1.15, 'พลังงานโมเลกุล (kJ/mol, ย่อสเกล ×0.25)', 'จำนวน');
      const sc = E => mb(E, S.T) / ref, Es = Ea / 4; plot(g, P, E => mb(E, 300) / ref, 0, mxE, C.mute, 1.5, [5, 4]);
      g.fillStyle = 'rgba(229,72,77,.35)'; g.beginPath(); g.moveTo(P.X(Es), P.Y(0)); for (let E = Es; E <= mxE; E += .2) g.lineTo(P.X(E), P.Y(sc(E))); g.lineTo(P.X(mxE), P.Y(0)); g.fill();
      plot(g, P, sc, 0, mxE, C.pri, 2.5); line(g, P.X(Es), P.Y(0), P.X(Es), P.Y(1.1), C.bad, 2); txt(g, 'Ea', P.X(Es) + 4, P.Y(1.05), C.bad, 11);
    },
    out: S => { const R = 8.314, E0 = S.Ea * 1000, E1 = E0 * (S.c ? .7 : 1), kT = Math.exp(-E0 / R * (1 / S.T - 1 / 300)), kc = Math.exp((E0 - E1) / (R * S.T)); return `อุณหภูมิ ${S.T} K เทียบกับ 300 K : อัตราเปลี่ยนไปราว <b>${f(kT, kT < 10 ? 2 : 0)} เท่า</b> (จาก k ∝ e<sup>−Ea/RT</sup>)${S.c ? `<br>ตัวเร่งปฏิกิริยาลด Ea จาก ${S.Ea} เป็น ${f(E1 / 1000, 0)} kJ/mol ทำให้เร็วขึ้นอีกราว <b>${kc.toExponential(1)} เท่า</b>` : ''}<br>ตัวเร่งปฏิกิริยาลด Ea แต่ไม่เปลี่ยน ΔH และไม่ถูกใช้หมดไป`; },
  });

  /* ---------- 2.3 สมดุลเคมี ---------- */
  reg('equil', {
    label: 'สมดุล H₂ + I₂ ⇌ 2HI', h: 230,
    goal: 'ตั้ง K = 50 แล้วเพิ่ม H₂ เริ่มต้นเป็นสองเท่า — HI ที่สมดุลเพิ่มขึ้น และ I₂ เหลือน้อยลง (หลักของเลอชาเตอลิเอ)',
    controls: [{ id: 'a', label: '[H₂] เริ่มต้น', min: .1, max: 2, step: .1, v: 1, unit: 'M', dec: 1 }, { id: 'b', label: '[I₂] เริ่มต้น', min: .1, max: 2, step: .1, v: 1, unit: 'M', dec: 1 }, { id: 'K', label: 'K', min: 1, max: 100, step: 1, v: 50 }],
    draw(g, W, H, S, t, C) {
      const { a, b, K } = S, A = K - 4, B = -K * (a + b), Cc = K * a * b; let x = Math.abs(A) < 1e-9 ? Cc / -B : (-B - Math.sqrt(B * B - 4 * A * Cc)) / (2 * A); if (x < 0 || x > Math.min(a, b)) x = (-B + Math.sqrt(B * B - 4 * A * Cc)) / (2 * A);
      const eq = [a - x, b - x, 2 * x], ini = [a, b, 0], lab = ['H₂', 'I₂', 'HI'], cw = (W - 30) / 6, mx = 4;
      lab.forEach((l, i) => { bar(g, 16 + i * 2 * cw, H - 30, cw - 8, ini[i] / mx * (H - 70), C.mute, l + ' เริ่ม', f(ini[i], 2), C); bar(g, 16 + i * 2 * cw + cw, H - 30, cw - 8, eq[i] / mx * (H - 70), [C.pri, '#8e4ec6', C.ok][i], 'สมดุล', f(eq[i], 2), C); });
      S._x = x;
    },
    out: S => { const x = S._x || 0, a = S.a - x, b = S.b - x, c = 2 * x; return `ตาราง ICE : เปลี่ยนไป −x , −x , +2x → x = <b>${f(x, 3)}</b> M<br>ที่สมดุล [H₂] = ${f(a, 3)} , [I₂] = ${f(b, 3)} , [HI] = ${f(c, 3)} M · ตรวจ : [HI]²/([H₂][I₂]) = ${f(c * c / (a * b), 1)} ≈ K`; },
  });

  /* ---------- 2.5 เซลล์กัลวานิก ---------- */
  const EM = [['Mg', -2.37], ['Al', -1.66], ['Zn', -.76], ['Fe', -.44], ['Ni', -.25], ['Pb', -.13], ['Cu', .34], ['Ag', .80], ['Au', 1.50]];
  reg('galvanic', {
    label: 'เซลล์กัลวานิกจากศักย์ไฟฟ้ามาตรฐาน', h: 220,
    goal: 'เลือก Zn กับ Cu (เซลล์แดเนียล) ได้ 1.10 V แล้วลองคู่อื่น — ธาตุที่ E° ต่ำกว่าเป็นแอโนด (ถูกออกซิไดซ์) อิเล็กตรอนไหลจากแอโนดไปแคโทด',
    controls: [{ id: 'x', label: 'โลหะขั้วที่ 1', min: 0, max: 8, step: 1, v: 2, opts: EM.map(m => m[0] + ' (' + m[1] + ' V)') }, { id: 'y', label: 'โลหะขั้วที่ 2', min: 0, max: 8, step: 1, v: 6, opts: EM.map(m => m[0] + ' (' + m[1] + ' V)') }],
    draw(g, W, H, S, t, C) {
      const A = EM[S.x], B = EM[S.y], an = A[1] <= B[1] ? A : B, ca = an === A ? B : A, bw = (W - 80) / 2;
      [[an, 16, 'แอโนด (−)'], [ca, W - 16 - bw, 'แคโทด (+)']].forEach(([m, x, l]) => { rect(g, x, 90, bw, 100, 'rgba(80,150,255,.15)', C.ink); rect(g, x + bw / 2 - 8, 60, 16, 100, '#9aa3ae', C.ink); txt(g, m[0], x + bw / 2, 56, C.ink, 14, 'center'); txt(g, l, x + bw / 2, 205, C.mute, 11, 'center'); });
      line(g, 16 + bw, 120, W - 16 - bw, 120, C.mute, 6); txt(g, 'สะพานเกลือ', W / 2, 140, C.mute, 10, 'center');
      line(g, 16 + bw / 2, 60, 16 + bw / 2, 30, C.ink, 2); line(g, W - 16 - bw / 2, 60, W - 16 - bw / 2, 30, C.ink, 2); line(g, 16 + bw / 2, 30, W - 16 - bw / 2, 30, C.ink, 2);
      if (an !== ca) arrow(g, W / 2 - 30, 22, W / 2 + 30, 22, C.pri, 2.5); txt(g, 'e⁻', W / 2, 14, C.pri, 12, 'center');
    },
    out: S => { const A = EM[S.x], B = EM[S.y]; if (S.x === S.y) return 'เลือกโลหะต่างชนิดกัน'; const an = A[1] <= B[1] ? A : B, ca = an === A ? B : A, E = ca[1] - an[1]; return `แอโนด : <b>${an[0]}</b> ถูกออกซิไดซ์ (E° ต่ำกว่า) · แคโทด : <b>${ca[0]}</b> ไอออนถูกรีดิวซ์<br>E°cell = E°แคโทด − E°แอโนด = ${ca[1]} − (${an[1]}) = <b>${f(E, 2)} V</b>`; },
  });

  /* ---------- 1.6 ครึ่งชีวิต ---------- */
  reg('halflife', {
    label: 'การสลายตัวและครึ่งชีวิต', h: 240,
    goal: 'เลื่อนเวลาไปทีละครึ่งชีวิต อะตอมที่เหลือลดลงครึ่งหนึ่งทุกครั้ง แต่บอกไม่ได้ว่าอะตอมตัวไหนจะสลายก่อน',
    controls: [{ id: 'T', label: 'ครึ่งชีวิต', min: 1, max: 12, step: 1, v: 6, unit: 'ชม.' }, { id: 't', label: 'เวลาที่ผ่านไป', min: 0, max: 48, step: 1, v: 12, unit: 'ชม.' }],
    draw(g, W, H, S, t, C) {
      const R = rng(11), frac = Math.pow(.5, S.t / S.T), gw = Math.min(150, W * .45), n = 10, cs = gw / n;
      for (let i = 0; i < 100; i++) { const u = R(), alive = u < frac, x = 12 + (i % n) * cs + cs / 2, y = 24 + Math.floor(i / n) * cs + cs / 2; circ(g, x, y, cs * .36, alive ? C.ok : 'rgba(150,150,150,.35)'); }
      const P = axes(g, C, gw + 44, H - 24, W - gw - 60, H - 50, 0, 48, 0, 100, 'ชม.', 'เหลือ %'); plot(g, P, x => 100 * Math.pow(.5, x / S.T), 0, 48, C.pri, 2.5);
      for (let k = 1; k * S.T <= 48; k++) line(g, P.X(k * S.T), P.Y(0), P.X(k * S.T), P.Y(100 / Math.pow(2, k)), C.line, 1, [2, 3]);
      circ(g, P.X(S.t), P.Y(frac * 100), 5, C.bad);
    },
    out: S => { const k = S.t / S.T, fr = Math.pow(.5, k); return `ผ่านไป ${f(k, 2)} ครึ่งชีวิต → เหลือ (1/2)<sup>${f(k, 2)}</sup> = <b>${f(fr * 100, 1)}%</b> · ถ้าเริ่ม 80 mCi จะเหลือ ${f(80 * fr, 1)} mCi`; },
  });

  /* ---------- 1.7 ความดันไอและจุดเดือด ---------- */
  const LQ = [['น้ำ', 40.7, 373.15, C => C.pri], ['เอทานอล', 38.6, 351.4, C => C.ok], ['ไดเอทิลอีเทอร์', 26.5, 307.8, C => C.bad]];
  const vp = (T, dH, Tb) => Math.exp(-dH * 1000 / 8.314 * (1 / T - 1 / Tb));
  reg('vapor', {
    label: 'ความดันไอและจุดเดือด', h: 240,
    goal: 'ลดความดันภายนอกเป็น 0.7 atm (ยอดเขาสูง) ดูจุดเดือดของน้ำลดลง · เพิ่มเป็น 2 atm (หม้อความดัน) จุดเดือดสูงขึ้น',
    controls: [{ id: 's', label: 'สาร', min: 0, max: 2, step: 1, v: 0, opts: LQ.map(l => l[0]) }, { id: 'P', label: 'ความดันภายนอก', min: .2, max: 2, step: .05, v: 1, unit: 'atm', dec: 2 }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 34, H - 24, W - 48, H - 50, 0, 130, 0, 2.2, '°C', 'atm');
      LQ.forEach((l, i) => plot(g, P, Tc => vp(Tc + 273.15, l[1], l[2]), 0, 130, l[3](C), i === S.s ? 3 : 1.2, i === S.s ? null : [4, 4]));
      line(g, P.X(0), P.Y(S.P), P.X(130), P.Y(S.P), C.ink, 1.2, [3, 3]);
      const l = LQ[S.s], Tb = 1 / (1 / l[2] - 8.314 * Math.log(S.P) / (l[1] * 1000)) - 273.15; circ(g, P.X(Tb), P.Y(S.P), 6, C.warn, C.ink);
      LQ.forEach((q, i) => txt(g, q[0], 40 + i * ((W - 50) / 3), 16, q[3](C), 10));
    },
    out: S => { const l = LQ[S.s], Tb = 1 / (1 / l[2] - 8.314 * Math.log(S.P) / (l[1] * 1000)) - 273.15; return `${l[0]} เดือดเมื่อความดันไอ = ความดันภายนอก ${f(S.P, 2)} atm → จุดเดือดราว <b>${f(Tb, 0)} °C</b> (ที่ 1 atm : ${f(l[2] - 273.15, 0)} °C)<br>ไดเอทิลอีเทอร์มีแรงระหว่างโมเลกุลอ่อนที่สุด จึงมีความดันไอสูงและเดือดต่ำที่สุด`; },
  });

  /* ---------- 2.6 แผนภาพพลังงาน ---------- */
  reg('energydiag', {
    label: 'แผนภาพพลังงานของปฏิกิริยา', h: 240,
    goal: 'สลับ ΔH เป็นลบ (คายความร้อน) และบวก (ดูดความร้อน) แล้วเปิดตัวเร่งปฏิกิริยา — ยอดเขาต่ำลงแต่ ΔH เท่าเดิม',
    controls: [{ id: 'h', label: 'ΔH', min: -250, max: 150, step: 10, v: -100, unit: 'kJ' }, { id: 'ea', label: 'Ea (ไปข้างหน้า)', min: 20, max: 250, step: 10, v: 120, unit: 'kJ' }, { id: 'c', label: 'ตัวเร่งปฏิกิริยา', min: 0, max: 1, step: 1, v: 0, opts: ['ไม่ใส่', 'ใส่'] }],
    draw(g, W, H, S, t, C) {
      const ea = Math.max(S.ea, S.h + 10), P = axes(g, C, 34, H - 20, W - 48, H - 44, 0, 10, -300, 300, 'ทางเดินปฏิกิริยา', 'พลังงาน');
      const prof = (E) => x => x < 2 ? 0 : x > 8 ? S.h : (() => { const u = (x - 2) / 6, base = S.h * (3 * u * u - 2 * u * u * u); return base + (E - S.h * .5) * Math.sin(Math.PI * u) * (1 - Math.abs(S.h) / 1000); })();
      plot(g, P, prof(ea), 0, 10, C.pri, 3, null, 200); if (S.c) plot(g, P, prof(ea * .55), 0, 10, C.ok, 2.5, [6, 4], 200);
      line(g, P.X(0), P.Y(0), P.X(10), P.Y(0), C.line, 1, [2, 3]); txt(g, 'สารตั้งต้น', P.X(.2), P.Y(0) - 5, C.ink, 10); txt(g, 'ผลิตภัณฑ์', P.X(9.8), P.Y(S.h) - 5, C.ink, 10, 'right');
      arrow(g, P.X(9), P.Y(0), P.X(9), P.Y(S.h), S.h < 0 ? C.bad : C.warn, 2); txt(g, 'ΔH', P.X(9) - 6, P.Y(S.h / 2), S.h < 0 ? C.bad : C.warn, 11, 'right');
    },
    out: S => `ΔH = <b>${S.h} kJ</b> → ${S.h < 0 ? 'คายความร้อน (ผลิตภัณฑ์พลังงานต่ำกว่า)' : S.h > 0 ? 'ดูดความร้อน (ผลิตภัณฑ์พลังงานสูงกว่า)' : 'ไม่เปลี่ยนพลังงาน'} · Ea ไปข้างหน้า ${Math.max(S.ea, S.h + 10)} kJ · Ea ย้อนกลับ = Ea − ΔH = ${Math.max(S.ea, S.h + 10) - S.h} kJ${S.c ? '<br>ตัวเร่งปฏิกิริยา (เส้นประ) ลด Ea ทั้งสองทิศ แต่ ΔH เท่าเดิม' : ''}`,
  });

  /* ---------- 3.3 pH ของเลือด ---------- */
  reg('bloodph', {
    label: 'บัฟเฟอร์ไฮโดรเจนคาร์บอเนตในเลือด', h: 210,
    goal: 'เพิ่ม P_CO₂ เป็น 60 mmHg (หายใจไม่พอ) ดู pH ลด → ภาวะเลือดเป็นกรดจากการหายใจ · แล้วลด HCO₃⁻ ดูภาวะเลือดเป็นกรดจากเมแทบอลิซึม',
    controls: [{ id: 'c', label: 'P_CO₂', min: 20, max: 80, step: 1, v: 40, unit: 'mmHg' }, { id: 'b', label: '[HCO₃⁻]', min: 10, max: 40, step: 1, v: 24, unit: 'mmol/L' }],
    draw(g, W, H, S, t, C) {
      const pH = 6.1 + Math.log10(S.b / (.03 * S.c)), x0 = 20, w = W - 40, X = v => x0 + (v - 6.9) / .8 * w;
      for (let i = 0; i < w; i++) { g.fillStyle = `hsl(${(i / w) * 240},70%,55%)`; g.fillRect(x0 + i, 60, 1.5, 28); }
      rect(g, X(7.35), 56, X(7.45) - X(7.35), 36, null, C.ink); txt(g, 'ปกติ 7.35–7.45', (X(7.35) + X(7.45)) / 2, 50, C.ink, 10, 'center');
      [6.9, 7.1, 7.3, 7.5, 7.7].forEach(v => txt(g, v + '', X(v), 104, C.mute, 10, 'center'));
      const mx = X(Math.max(6.9, Math.min(7.7, pH))); g.fillStyle = C.ink; g.beginPath(); g.moveTo(mx, 92); g.lineTo(mx - 7, 112); g.lineTo(mx + 7, 112); g.fill();
      txt(g, 'pH = ' + f(pH, 2), W / 2, 150, C.pri, 22, 'center'); txt(g, 'อัตราส่วน HCO₃⁻ : CO₂ = ' + f(S.b / (.03 * S.c), 1) + ' : 1 (ปกติ 20 : 1)', W / 2, 176, C.mute, 11, 'center');
    },
    out: S => { const pH = 6.1 + Math.log10(S.b / (.03 * S.c)); let d = 'ปกติ'; if (pH < 7.35) d = S.c > 45 ? 'ภาวะเลือดเป็นกรดจากการหายใจ (CO₂ คั่ง)' : 'ภาวะเลือดเป็นกรดจากเมแทบอลิซึม (HCO₃⁻ ต่ำ)'; else if (pH > 7.45) d = S.c < 35 ? 'ภาวะเลือดเป็นเบสจากการหายใจ (หายใจเร็วเกิน)' : 'ภาวะเลือดเป็นเบสจากเมแทบอลิซึม (HCO₃⁻ สูง)'; return `pH = 6.1 + log(${S.b} / (0.03 × ${S.c})) = <b>${f(pH, 2)}</b> → <b>${d}</b>`; },
  });
})();
