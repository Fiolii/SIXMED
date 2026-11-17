// ซิมูเลเตอร์ชีววิทยา ส่วนที่ 2 — ร่างกายมนุษย์ พืช และนิเวศวิทยา
(function () {
  const { f, txt, line, rect, circ, arrow } = SU, { axes, plot, bar } = SIMK;
  const reg = (name, cfg) => { SIMS[name] = { mount: host => SU.sim(host, cfg) }; };

  /* ---------- 3.1 ทางเดินอาหาร ---------- */
  const SEG = [
    { n: 'ปาก', pH: 7, e: 'อะไมเลสในน้ำลาย', st: 20, pr: 0, fa: 0 },
    { n: 'หลอดอาหาร', pH: 7, e: '— (บีบตัวเป็นคลื่น)', st: 25, pr: 0, fa: 0 },
    { n: 'กระเพาะอาหาร', pH: 2, e: 'เพปซิน + HCl', st: 25, pr: 25, fa: 0 },
    { n: 'ลำไส้เล็กส่วนต้น', pH: 8, e: 'อะไมเลส ทริปซิน ไลเพส (ตับอ่อน) + น้ำดี', st: 85, pr: 80, fa: 75 },
    { n: 'ลำไส้เล็กส่วนปลาย', pH: 7.5, e: 'มอลเทส ซูเครส เพปทิเดส — ดูดซึม', st: 100, pr: 100, fa: 100 },
    { n: 'ลำไส้ใหญ่', pH: 7, e: '— ดูดน้ำกลับ แบคทีเรียสร้างวิตามิน K', st: 100, pr: 100, fa: 100 }];
  reg('digest', {
    label: 'เดินทางผ่านทางเดินอาหาร', h: 230,
    goal: 'เลื่อนจากปากถึงลำไส้ใหญ่ ดูว่าแป้ง โปรตีน และไขมันเริ่มถูกย่อยที่ใด และ pH เปลี่ยนอย่างไร',
    controls: [{ id: 'k', label: 'ตำแหน่ง', min: 0, max: 5, step: 1, v: 2, opts: SEG.map(s => s.n) }],
    draw(g, W, H, S, t, C) {
      const n = SEG.length, sw = (W - 20) / n;
      SEG.forEach((s, i) => { const x = 10 + i * sw, on = i === S.k; rect(g, x + 2, 20, sw - 4, 30, on ? C.pri : C.pri2, C.pri); txt(g, s.n.replace('ลำไส้เล็ก', 'ล.เล็ก').replace('ลำไส้ใหญ่', 'ล.ใหญ่'), x + sw / 2, 40, on ? '#fff' : C.ink, 10, 'center'); });
      const s = SEG[S.k], hue = s.pH / 14 * 240; rect(g, 14, 64, 74, 34, `hsl(${hue},75%,55%)`); txt(g, 'pH ≈ ' + s.pH, 51, 86, '#fff', 13, 'center');
      [['แป้ง', s.st, C.warn], ['โปรตีน', s.pr, C.bad], ['ไขมัน', s.fa, C.ok]].forEach(([l, v, c], i) => { const x = 110 + i * ((W - 120) / 3); bar(g, x, H - 22, (W - 120) / 3 - 16, v / 100 * (H - 130), c, l, v + '%', C); });
      txt(g, 'ร้อยละที่ถูกย่อยแล้ว', 110, 116, C.mute, 10);
    },
    out: S => { const s = SEG[S.k]; return `<b>${s.n}</b> · pH ≈ ${s.pH} · สิ่งที่ทำงาน : ${s.e}${S.k === 2 ? '<br>อะไมเลสจากน้ำลายหยุดทำงานในกรด แป้งจึงแทบไม่ถูกย่อยเพิ่มในกระเพาะ' : S.k === 3 ? '<br>NaHCO₃ จากตับอ่อนสะเทินกรด เอนไซม์ของตับอ่อนทำงานได้ดีที่ pH ราว 8 · น้ำดีทำให้ไขมันเป็นหยดเล็ก' : ''}`; },
  });

  /* ---------- 3.2 หัวใจ และกราฟการจับ O₂ ---------- */
  reg('cardiac', {
    label: 'หัวใจสูบฉีดเลือด', h: 220, animate: true, duration: 6, loop: true,
    goal: 'เพิ่มอัตราการเต้นและปริมาตรต่อครั้งแบบตอนออกกำลังกาย แล้วดูปริมาตรเลือดที่สูบฉีดต่อนาที (ปกติขณะพักราว 5 L/นาที)',
    controls: [{ id: 'hr', label: 'อัตราการเต้น', min: 40, max: 190, step: 5, v: 70, unit: 'ครั้ง/นาที' }, { id: 'sv', label: 'ปริมาตรต่อครั้ง', min: 40, max: 160, step: 5, v: 70, unit: 'mL' }],
    draw(g, W, H, S, t, C) {
      const per = 60 / S.hr, ph = (t % per) / per, beat = ph < .3 ? Math.sin(ph / .3 * Math.PI) : 0, cx = 70, cy = 100, s = 1 + .12 * beat;
      g.save(); g.translate(cx, cy); g.scale(s, s); g.fillStyle = C.bad; g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-50, -5, -30, -45, 0, -20); g.bezierCurveTo(30, -45, 50, -5, 0, 30); g.fill(); g.restore();
      const x0 = 140, w = W - x0 - 10, y0 = 110; line(g, x0, y0, x0 + w, y0, C.line, 1);
      g.strokeStyle = C.ok; g.lineWidth = 2; g.beginPath();
      for (let i = 0; i <= w; i++) { const tt = t - (w - i) / w * 3, q = ((tt % per) + per) % per / per; const y = q > .1 && q < .13 ? -45 : q > .13 && q < .16 ? 15 : q > .3 && q < .4 ? -10 * Math.sin((q - .3) / .1 * Math.PI) : 0; i ? g.lineTo(x0 + i, y0 + y) : g.moveTo(x0, y0 + y); }
      g.stroke(); txt(g, 'คลื่นไฟฟ้าหัวใจ (จำลอง)', x0, 30, C.mute, 10);
      txt(g, f(S.hr * S.sv / 1000, 1) + ' L/นาที', x0, H - 24, C.pri, 22);
    },
    out: S => { const co = S.hr * S.sv / 1000; return `ปริมาตรเลือดที่สูบฉีดต่อนาที = ${S.hr} × ${S.sv} mL = <b>${f(co, 2)} L/นาที</b> (${f(co / 5, 1)} เท่าของค่าพักปกติ)${S.hr > 160 ? '<br>หัวใจเต้นเร็วมาก เวลาให้เลือดไหลกลับเข้าห้องหัวใจสั้นลง ปริมาตรต่อครั้งจึงเพิ่มต่อไม่ได้ไม่จำกัด' : ''}`; },
  });
  const sat = (P, pH, T) => { const p50 = 26.8 * Math.pow(10, .48 * (7.4 - pH)) * Math.exp(.024 * (T - 37)); return 100 * Math.pow(P, 2.7) / (Math.pow(p50, 2.7) + Math.pow(P, 2.7)); };
  reg('o2curve', {
    label: 'กราฟการจับ O₂ ของฮีโมโกลบิน', h: 240,
    goal: 'ลด pH เป็น 7.2 หรือเพิ่มอุณหภูมิแบบกล้ามเนื้อที่ทำงานหนัก — กราฟเลื่อนไปทางขวา ฮีโมโกลบินปล่อย O₂ ให้เนื้อเยื่อได้มากขึ้น (Bohr effect)',
    controls: [{ id: 'pH', label: 'pH ของเลือด', min: 7, max: 7.8, step: .05, v: 7.4, dec: 2 }, { id: 'T', label: 'อุณหภูมิ', min: 35, max: 41, step: .5, v: 37, unit: '°C', dec: 1 }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 36, H - 24, W - 50, H - 50, 0, 110, 0, 100, 'P_O₂ (mmHg)', 'อิ่มตัว %');
      plot(g, P, x => sat(x, 7.4, 37), 0, 110, C.mute, 1.5, [5, 4]); plot(g, P, x => sat(x, S.pH, S.T), 0, 110, C.bad, 3);
      [[40, 'เนื้อเยื่อ'], [100, 'ปอด']].forEach(([x, l]) => { line(g, P.X(x), P.Y(0), P.X(x), P.Y(100), C.line, 1, [3, 3]); txt(g, l, P.X(x), P.Y(100) + 12, C.mute, 10, 'center'); circ(g, P.X(x), P.Y(sat(x, S.pH, S.T)), 4.5, C.bad); });
    },
    out: S => { const a = sat(100, S.pH, S.T), b = sat(40, S.pH, S.T), a0 = sat(100, 7.4, 37), b0 = sat(40, 7.4, 37); return `ที่ปอด อิ่มตัว ${f(a, 0)}% · ที่เนื้อเยื่อ ${f(b, 0)}% → ปล่อย O₂ ให้เนื้อเยื่อ <b>${f(a - b, 0)}%</b> ของความจุ (ภาวะปกติ ${f(a0 - b0, 0)}%)`; },
  });

  /* ---------- 3.3 การตอบสนองทางภูมิคุ้มกัน ---------- */
  const resp = (d, start, peak, h) => d < start ? 0 : h * Math.pow((d - start) / peak, 2) * Math.exp(2 * (1 - (d - start) / peak));
  reg('immune', {
    label: 'การตอบสนองครั้งแรกและครั้งที่สอง', h: 230,
    goal: 'เลื่อนวันที่ได้รับแอนติเจนครั้งที่สอง (เช่น วัคซีนเข็มกระตุ้น) แล้วเทียบความสูงและความเร็วของกราฟสองครั้ง',
    controls: [{ id: 'd2', label: 'ได้รับแอนติเจนครั้งที่สองวันที่', min: 20, max: 60, step: 1, v: 35 }, { id: 'd', label: 'วันที่ดู', min: 0, max: 90, step: 1, v: 45 }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 34, H - 24, W - 48, H - 50, 0, 90, 0, 110, 'วัน', 'แอนติบอดี'), ab = d => resp(d, 3, 11, 18) + resp(d, S.d2 + 1, 6, 95);
      plot(g, P, ab, 0, 90, C.pri, 3, null, 180);
      [[0, 'ครั้งที่ 1'], [S.d2, 'ครั้งที่ 2']].forEach(([d, l]) => { arrow(g, P.X(d), P.Y(105), P.X(d), P.Y(88), C.bad, 2); txt(g, l, P.X(d) + 4, P.Y(105), C.bad, 10); });
      line(g, P.X(S.d), P.Y(0), P.X(S.d), P.Y(100), C.mute, 1, [3, 3]); circ(g, P.X(S.d), P.Y(ab(S.d)), 5, C.bad);
    },
    out: S => { const p1 = resp(14, 3, 11, 18), p2 = resp(S.d2 + 7, S.d2 + 1, 6, 95); return `ครั้งแรก : ใช้เวลาราว 2 สัปดาห์ แอนติบอดีสูงสุดราว ${f(p1, 0)} หน่วย · ครั้งที่สอง : สูงสุดภายในราว 1 สัปดาห์ ราว ${f(p2, 0)} หน่วย (<b>${f(p2 / p1, 0)} เท่า</b>) เพราะมีเซลล์ความจำ`; },
  });

  /* ---------- 3.4 ไต ---------- */
  reg('kidney', {
    label: 'กลูโคสในหน่วยไต และผลของ ADH', h: 240,
    goal: 'เพิ่มกลูโคสในพลาสมาเกิน 300 mg/dL ดูว่าเริ่มมีกลูโคสในปัสสาวะ · แล้วเลื่อนระดับ ADH ดูปริมาณปัสสาวะต่อวัน',
    controls: [{ id: 'G', label: 'กลูโคสในพลาสมา', min: 50, max: 600, step: 10, v: 100, unit: 'mg/dL' }, { id: 'adh', label: 'ระดับ ADH', min: 0, max: 100, step: 5, v: 50, unit: '%' }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 40, H - 24, W - 56, H - 56, 0, 600, 0, 800, 'กลูโคสในพลาสมา', 'mg/นาที'), Tm = 375;
      plot(g, P, x => x / 100 * 125, 0, 600, C.pri, 2.5); plot(g, P, x => Math.min(x / 100 * 125, Tm), 0, 600, C.ok, 2.5); plot(g, P, x => Math.max(0, x / 100 * 125 - Tm), 0, 600, C.bad, 2.5);
      txt(g, 'กรอง', P.X(560), P.Y(700) - 4, C.pri, 10, 'right'); txt(g, 'ดูดกลับ', P.X(580), P.Y(Tm) - 6, C.ok, 10, 'right'); txt(g, 'ขับออก', P.X(580), P.Y(Math.max(0, 725 - Tm)) - 6, C.bad, 10, 'right');
      line(g, P.X(S.G), P.Y(0), P.X(S.G), P.Y(800), C.mute, 1, [3, 3]);
    },
    out: S => { const fl = S.G / 100 * 125, ex = Math.max(0, fl - 375), uv = Math.pow(10, Math.log10(18) - S.adh / 100 * Math.log10(18 / .6)); return `กรองกลูโคส ${f(fl, 0)} mg/นาที · ดูดกลับได้สูงสุด 375 → ${ex > 0 ? `<b>มีกลูโคสในปัสสาวะ ${f(ex, 0)} mg/นาที</b>` : '<b>ไม่มีกลูโคสในปัสสาวะ</b>'}<br>ADH ${S.adh}% → ปัสสาวะราว <b>${f(uv, 1)} ลิตร/วัน</b> ${S.adh > 70 ? '(เข้มข้น)' : S.adh < 30 ? '(เจือจาง)' : ''} · ไตกรองของเหลววันละราว 180 ลิตร`; },
  });

  /* ---------- 3.5 ศักย์งาน ---------- */
  const Vm = (tt, st) => { if (st < 15) return -70 + st * Math.exp(-Math.pow((tt - 1) / .6, 2)); if (tt < .8) return -70 + st * tt / .8; if (tt < 1.3) return -55 + 85 * (tt - .8) / .5; if (tt < 2.6) return 30 - 110 * (tt - 1.3) / 1.3; if (tt < 5) return -80 + 10 * (tt - 2.6) / 2.4; return -70; };
  reg('ap', {
    label: 'ศักย์งานของเซลล์ประสาท', h: 250, animate: true, duration: 6, loop: true,
    goal: 'ตั้งสิ่งเร้าต่ำกว่า 15 mV (ไม่ถึงขีดเริ่ม) แล้วค่อยเพิ่ม — ศักย์งานเกิดแบบทั้งหมดหรือไม่มีเลย · เปิดเยื่อไมอีลินดูกระแสประสาทวิ่งเร็วขึ้น',
    controls: [{ id: 'st', label: 'ความแรงสิ่งเร้า', min: 0, max: 30, step: 1, v: 20, unit: 'mV' }, { id: 'my', label: 'แอกซอน', min: 0, max: 1, step: 1, v: 0, opts: ['ไม่มีไมอีลิน', 'มีไมอีลิน'] }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 40, 150, W - 56, 120, 0, 6, -90, 40, 'ms', 'mV');
      [[-70, 'พัก'], [-55, 'ขีดเริ่ม']].forEach(([v, l]) => { line(g, P.X(0), P.Y(v), P.X(6), P.Y(v), C.line, 1, [3, 3]); txt(g, l, P.X(6), P.Y(v) - 3, C.mute, 9, 'right'); });
      plot(g, { X: x => P.X(x), Y: P.Y }, x => Vm(x, S.st), 0, Math.min(6, t), C.pri, 2.5, null, 200);
      const tt = t, v = Vm(tt, S.st), phase = S.st < 15 ? 'ไม่ถึงขีดเริ่ม' : tt < .8 ? 'ถูกกระตุ้น' : tt < 1.3 ? 'Na⁺ ไหลเข้า (ดีโพลาไรเซชัน)' : tt < 2.6 ? 'K⁺ ไหลออก (รีโพลาไรเซชัน)' : tt < 5 ? 'ไฮเพอร์โพลาไรเซชัน' : 'กลับสู่ระยะพัก';
      txt(g, phase, 46, 22, C.ink, 12);
      const ay = H - 40; rect(g, 20, ay - 8, W - 40, 16, C.pri2, C.pri); if (S.my) for (let x = 30; x < W - 30; x += 34) rect(g, x, ay - 11, 26, 22, C.card, C.mute);
      if (S.st >= 15) { const sp = S.my ? 1 : .2, px = 20 + ((t * sp * (W - 40) / 2) % (W - 40)); circ(g, px, ay, 7, C.bad); }
      txt(g, S.my ? 'กระโดดข้ามโนดออฟแรนเวียร์' : 'เดินทางต่อเนื่องทีละจุด', W / 2, H - 12, C.mute, 10, 'center');
    },
    out: (S, t) => S.st < 15 ? `สิ่งเร้า ${S.st} mV ทำให้ศักย์ขึ้นไปไม่ถึงขีดเริ่ม (−55 mV) <b>จึงไม่เกิดศักย์งาน</b>` : `เกิดศักย์งาน ยอดสูงราว +30 mV เท่าเดิมไม่ว่าสิ่งเร้าจะแรงเท่าใด (ทั้งหมดหรือไม่มีเลย) · ศักย์ตอนนี้ <b>${f(Vm(t, S.st), 0)} mV</b><br>${S.my ? 'มีไมอีลิน : นำกระแสได้เร็วถึงราว 100 m/s' : 'ไม่มีไมอีลิน : นำกระแสราว 1 m/s'}`,
  });

  /* ---------- 3.6 รอบประจำเดือน ---------- */
  const gs = (d, m, s, h) => h * Math.exp(-Math.pow((d - m) / s, 2));
  const HOR = [['FSH', '#3e63dd', d => gs(d, 3, 4, .45) + gs(d, 14, 1.2, .5)], ['LH', '#e5484d', d => .15 + gs(d, 14, 1, 1)], ['เอสโทรเจน', '#30a46c', d => .15 + gs(d, 12.5, 2.2, .75) + gs(d, 21, 3, .4)], ['โพรเจสเทอโรน', '#f5a524', d => .05 + gs(d, 21, 3.5, .9)]];
  reg('cycle', {
    label: 'ฮอร์โมนในรอบประจำเดือน', h: 260,
    goal: 'เลื่อนวันไปที่วันที่ 13–14 ดู LH พุ่งสูงก่อนตกไข่ แล้วเลื่อนไปวันที่ 21 ดูโพรเจสเทอโรนจากคอร์พัสลูเทียม',
    controls: [{ id: 'd', label: 'วันที่ของรอบ', min: 1, max: 28, step: 1, v: 14 }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 30, H - 70, W - 44, H - 110, 1, 28, 0, 1.15, 'วัน', 'ระดับ');
      HOR.forEach(([n, col, fn], i) => { plot(g, P, fn, 1, 28, col, 2.5); txt(g, n, 36 + i * ((W - 50) / 4), 16, col, 10); });
      line(g, P.X(S.d), P.Y(0), P.X(S.d), P.Y(1.1), C.ink, 1, [3, 3]);
      const lin = d => d <= 5 ? .2 : d <= 14 ? .2 + (d - 5) / 9 * .5 : d <= 26 ? .7 + (d - 14) / 12 * .3 : .4, y0 = H - 18;
      for (let d = 1; d <= 28; d++) rect(g, P.X(d) - (W - 44) / 56, y0 - lin(d) * 36, (W - 44) / 28 - 1, lin(d) * 36, d <= 5 ? C.bad : 'rgba(229,72,77,.35)');
      txt(g, 'ความหนาผนังมดลูก', 34, y0 + 12, C.mute, 9);
    },
    out: S => { const d = S.d; return `วันที่ ${d} : ${d <= 5 ? '<b>มีประจำเดือน</b> ผนังมดลูกหลุดลอก ฮอร์โมนรังไข่ต่ำ' : d < 13 ? '<b>ระยะฟอลลิเคิล</b> FSH กระตุ้นฟอลลิเคิล เอสโทรเจนเพิ่ม ผนังมดลูกหนาขึ้น' : d <= 15 ? '<b>ตกไข่</b> LH พุ่งสูง (LH surge) กระตุ้นให้ฟอลลิเคิลแตก' : '<b>ระยะลูเทียล</b> คอร์พัสลูเทียมหลั่งโพรเจสเทอโรน ผนังมดลูกพร้อมรับการฝังตัว'}${d >= 25 ? ' · ถ้าไม่ปฏิสนธิ คอร์พัสลูเทียมสลาย โพรเจสเทอโรนลด' : ''}`; },
  });

  /* ---------- 4.1 ศักย์ของน้ำ ---------- */
  reg('wpot', {
    label: 'ศักย์ของน้ำในเซลล์พืช', h: 220,
    goal: 'ตั้ง ψs ของเซลล์ = −0.8 , ψp = +0.3 และสารละลายภายนอก −0.7 MPa — น้ำออกจากเซลล์ทั้งที่เซลล์เข้มข้นกว่า เพราะต้องดู ψ รวม',
    controls: [{ id: 's', label: 'ψs ของเซลล์', min: -2, max: 0, step: .1, v: -.8, unit: 'MPa', dec: 1 }, { id: 'p', label: 'ψp ของเซลล์ (แรงดันเต่ง)', min: 0, max: 1, step: .1, v: .3, unit: 'MPa', dec: 1 }, { id: 'o', label: 'ψ ของสารละลายภายนอก', min: -2, max: 0, step: .1, v: -.7, unit: 'MPa', dec: 1 }],
    draw(g, W, H, S, t, C) {
      const pc = S.s + S.p, d = pc - S.o, cx = W / 2, cy = H / 2, sc = 1 + Math.max(-.25, Math.min(.15, -d * .2));
      rect(g, 10, 10, W - 20, H - 20, `rgba(80,150,255,${.1 + Math.min(.4, -S.o * .2)})`, C.line);
      g.strokeStyle = C.ok; g.lineWidth = 3; g.strokeRect(cx - 60, cy - 45, 120, 90);
      rect(g, cx - 56 * sc, cy - 41 * sc, 112 * sc, 82 * sc, 'rgba(48,164,108,.3)', C.ok);
      txt(g, 'ψ เซลล์ = ' + f(pc, 1), cx, cy + 5, C.ink, 13, 'center'); txt(g, 'ψ ภายนอก = ' + f(S.o, 1), 20, 30, C.ink, 12);
      if (Math.abs(d) > .05) { const out = d > 0; [-1, 1].forEach(k => arrow(g, cx + k * (out ? 70 : 115), cy, cx + k * (out ? 115 : 70), cy, C.pri, 3)); }
    },
    out: S => { const pc = S.s + S.p, d = pc - S.o; return `ψ เซลล์ = ψs + ψp = ${f(S.s, 1)} + ${f(S.p, 1)} = <b>${f(pc, 1)} MPa</b> เทียบกับภายนอก ${f(S.o, 1)} MPa → ${Math.abs(d) <= .05 ? '<b>สมดุล ไม่มีการเคลื่อนที่สุทธิ</b>' : d > 0 ? '<b>น้ำออกจากเซลล์</b> (จาก ψ สูงไปต่ำ)' : '<b>น้ำเข้าเซลล์</b> (จาก ψ สูงไปต่ำ)'}`; },
  });

  /* ---------- 4.2 ปัจจัยจำกัดการสังเคราะห์ด้วยแสง ---------- */
  const pRate = (L, c, T) => { const tf = Math.max(0, Math.exp(-Math.pow((T - 30) / 12, 2))); return Math.min(L * 1.1, c * 520) * tf; };
  reg('photo', {
    label: 'ปัจจัยจำกัดการสังเคราะห์ด้วยแสง', h: 240,
    goal: 'เพิ่มแสงจนกราฟแบน แล้วเพิ่ม CO₂ — กราฟสูงขึ้นอีก แปลว่าตอนที่แบน CO₂ คือปัจจัยจำกัด · ลองอุณหภูมิ 45 °C',
    controls: [{ id: 'L', label: 'ความเข้มแสง', min: 0, max: 100, step: 1, v: 60, unit: '%' }, { id: 'c', label: 'CO₂', min: .01, max: .15, step: .01, v: .04, unit: '%', dec: 2 }, { id: 'T', label: 'อุณหภูมิ', min: 5, max: 45, step: 1, v: 25, unit: '°C' }],
    draw(g, W, H, S, t, C) {
      const P = axes(g, C, 34, H - 24, W - 48, H - 50, 0, 100, 0, 110, 'ความเข้มแสง', 'อัตรา');
      plot(g, P, L => pRate(L, .03, 25), 0, 100, C.mute, 1.5, [5, 4]); plot(g, P, L => pRate(L, S.c, S.T), 0, 100, C.ok, 3);
      circ(g, P.X(S.L), P.Y(pRate(S.L, S.c, S.T)), 6, C.bad, C.ink); txt(g, 'เส้นประ = CO₂ 0.03% , 25 °C', W - 14, 18, C.mute, 10, 'right');
    },
    out: S => { const lim = S.L * 1.1 < S.c * 520 ? 'แสง' : 'CO₂', r = pRate(S.L, S.c, S.T); return `อัตราตอนนี้ <b>${f(r, 0)}</b> หน่วย · ปัจจัยจำกัดหลัก : <b>${lim}</b>${S.T > 38 || S.T < 12 ? ' (และอุณหภูมิซึ่งมีผลต่อเอนไซม์ในวัฏจักรคัลวิน)' : ''}`; },
  });

  /* ---------- 4.3 การตอบสนองต่อแสงและช่วงแสง ---------- */
  reg('tropism', {
    label: 'ลำต้นโค้งเข้าหาแสง', h: 230,
    goal: 'เปลี่ยนทิศแสง ดูออกซิน (จุดสีส้ม) ย้ายไปด้านเงา · ลองตัดหรือครอบปลายยอดเหมือนการทดลองของดาร์วิน ลำต้นจะไม่โค้ง',
    controls: [{ id: 'a', label: 'ทิศแสง', min: -80, max: 80, step: 5, v: 50, unit: '°' }, { id: 'tr', label: 'ปลายยอด', min: 0, max: 2, step: 1, v: 0, opts: ['ปกติ', 'ตัดปลายยอดออก', 'ครอบปลายยอดด้วยฝาทึบแสง'] }],
    draw(g, W, H, S, t, C) {
      const cx = W / 2, base = H - 20, len = 140, bend = S.tr ? 0 : S.a / 80 * .9;
      rect(g, cx - 50, base, 100, 12, '#8b5a2b');
      const pts = []; for (let i = 0; i <= 20; i++) { const s = i / 20, ang = bend * s * s; pts.push([cx + Math.sin(ang) * len * s * .6 + bend * len * s * s * .4, base - len * s]); }
      g.strokeStyle = C.ok; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
      const tip = pts[S.tr === 1 ? 17 : 20]; if (S.tr === 2) rect(g, tip[0] - 9, tip[1] - 10, 18, 16, C.ink);
      if (!S.tr) for (let i = 4; i < 18; i += 2) { const p = pts[i]; circ(g, p[0] - Math.sign(S.a || 1) * 6, p[1], 3.5, C.warn); }
      const lx = cx + Math.sin(S.a * Math.PI / 180) * 120, ly = 40 - Math.cos(S.a * Math.PI / 180) * 10; circ(g, lx, ly, 13, '#ffd43b'); arrow(g, lx, ly, lx + (cx - lx) * .35, ly + 40, '#f5a524', 2);
    },
    out: S => S.tr ? `${S.tr === 1 ? 'ไม่มีปลายยอด' : 'ปลายยอดไม่ได้รับแสง'} → ไม่มีการกระจายออกซินใหม่ ลำต้น<b>ไม่โค้ง</b> แสดงว่าปลายยอดเป็นส่วนรับแสงและสร้างสารสัญญาณ` : `ออกซินย้ายไปด้าน<b>เงา</b> เซลล์ด้านเงายืดยาวกว่า ลำต้นจึงโค้ง<b>เข้าหาแสง</b>`,
  });
  reg('photoperiod', {
    label: 'ช่วงแสงกับการออกดอก', h: 200,
    goal: 'ตั้งพืชวันสั้น ช่วงมืด 12 ชั่วโมง (ออกดอก) แล้วเปิดไฟกลางคืนสั้น ๆ — ไม่ออกดอก แสดงว่าพืชวัดความยาวช่วงมืดต่อเนื่อง',
    controls: [{ id: 'ty', label: 'ชนิดพืช', min: 0, max: 1, step: 1, v: 0, opts: ['พืชวันสั้น', 'พืชวันยาว'] }, { id: 'n', label: 'ช่วงมืดต่อวัน', min: 4, max: 20, step: 1, v: 12, unit: 'ชม.' }, { id: 'c', label: 'ช่วงมืดวิกฤต', min: 8, max: 14, step: 1, v: 11, unit: 'ชม.' }, { id: 'b', label: 'เปิดไฟกลางช่วงมืด', min: 0, max: 1, step: 1, v: 0, opts: ['ไม่เปิด', 'เปิด 15 นาที'] }],
    draw(g, W, H, S, t, C) {
      const x0 = 20, w = W - 40, y = 30, day = 24 - S.n; rect(g, x0, y, w * day / 24, 26, '#ffe066'); rect(g, x0 + w * day / 24, y, w * S.n / 24, 26, '#2b2d42');
      if (S.b) rect(g, x0 + w * (day + S.n / 2) / 24 - 3, y, 6, 26, '#ffe066');
      txt(g, 'สว่าง ' + day + ' ชม.', x0 + 4, y + 42, C.ink, 11); txt(g, 'มืด ' + S.n + ' ชม.', x0 + w, y + 42, C.ink, 11, 'right');
      const cont = S.b ? S.n / 2 : S.n, fl = S.ty ? cont < S.c : cont > S.c, cx = W / 2, by = H - 16;
      line(g, cx, by, cx, by - 70, C.ok, 5); [[-1, by - 40], [1, by - 55]].forEach(([k, yy]) => { g.fillStyle = C.ok; g.beginPath(); g.ellipse(cx + k * 16, yy, 16, 7, k * .4, 0, 7); g.fill(); });
      if (fl) for (let i = 0; i < 6; i++) circ(g, cx + Math.cos(i) * 10, by - 80 + Math.sin(i) * 10, 6, '#e64980'); circ(g, cx, by - 80, 5, fl ? '#ffd43b' : C.ok);
    },
    out: S => { const cont = S.b ? S.n / 2 : S.n, fl = S.ty ? cont < S.c : cont > S.c; return `ช่วงมืดต่อเนื่องยาวที่สุด <b>${f(cont, 1)} ชม.</b> ${S.ty ? 'พืชวันยาวออกดอกเมื่อมืดสั้นกว่าค่าวิกฤต' : 'พืชวันสั้นออกดอกเมื่อมืดยาวกว่าค่าวิกฤต'} (${S.c} ชม.) → <b>${fl ? 'ออกดอก' : 'ไม่ออกดอก'}</b>`; },
  });

  /* ---------- 5.1 ประชากรและพีระมิดพลังงาน ---------- */
  reg('popgrow', {
    label: 'การเพิ่มของประชากร', h: 230,
    goal: 'เทียบกราฟรูป J (ทรัพยากรไม่จำกัด) กับรูป S (มีขีดจำกัด K) และหาว่าประชากรเพิ่มเร็วที่สุดตอนมีกี่ตัว',
    controls: [{ id: 'r', label: 'อัตราการเพิ่ม r', min: .1, max: 1, step: .05, v: .4, dec: 2 }, { id: 'K', label: 'ขีดความสามารถในการรองรับ K', min: 200, max: 1000, step: 50, v: 600 }, { id: 't', label: 'เวลา', min: 0, max: 40, step: 1, v: 15 }],
    draw(g, W, H, S, t, C) {
      const N0 = 10, ex = x => N0 * Math.exp(S.r * x), lg = x => S.K / (1 + (S.K / N0 - 1) * Math.exp(-S.r * x)), P = axes(g, C, 40, H - 24, W - 56, H - 50, 0, 40, 0, 1100, 'เวลา', 'N');
      line(g, P.X(0), P.Y(S.K), P.X(40), P.Y(S.K), C.mute, 1, [4, 4]); txt(g, 'K', P.X(40), P.Y(S.K) - 4, C.mute, 10, 'right');
      plot(g, P, x => Math.min(1100, ex(x)), 0, 40, C.bad, 2, [6, 4]); plot(g, P, lg, 0, 40, C.ok, 3); circ(g, P.X(S.t), P.Y(lg(S.t)), 5.5, C.ok, C.ink);
    },
    out: S => { const N = S.K / (1 + (S.K / 10 - 1) * Math.exp(-S.r * S.t)), rate = S.r * N * (1 - N / S.K); return `เวลา ${S.t} : N ≈ <b>${f(N, 0)}</b> ตัว · อัตราเพิ่มขณะนี้ ≈ ${f(rate, 1)} ตัว/หน่วยเวลา<br>เพิ่มเร็วที่สุดเมื่อ N = K/2 = ${S.K / 2} ตัว (สูงสุด ${f(S.r * S.K / 4, 0)} ตัว/หน่วยเวลา) · เส้นประสีแดง = แบบเอกซ์โพเนนเชียล`; },
  });
  reg('pyramid', {
    label: 'พีระมิดพลังงานและการสะสมสารพิษ', h: 240,
    goal: 'ลดประสิทธิภาพการส่งต่อพลังงานจาก 10% เป็น 5% ดูว่าผู้บริโภคลำดับสูงได้พลังงานน้อยลงเท่าใด ขณะที่สารพิษกลับสูงขึ้นทุกลำดับขั้น',
    controls: [{ id: 'E', label: 'พลังงานที่ผู้ผลิตตรึงได้', min: 10000, max: 100000, step: 10000, v: 50000, unit: 'kJ' }, { id: 'e', label: 'ประสิทธิภาพการส่งต่อ', min: 5, max: 20, step: 1, v: 10, unit: '%' }, { id: 'm', label: 'สารพิษเพิ่มต่อลำดับขั้น', min: 2, max: 10, step: 1, v: 10, unit: 'เท่า' }],
    draw(g, W, H, S, t, C) {
      const L = ['ผู้ผลิต', 'ผู้บริโภคลำดับ 1', 'ผู้บริโภคลำดับ 2', 'ผู้บริโภคลำดับ 3'], hh = (H - 30) / 4;
      L.forEach((l, i) => { const en = S.E * Math.pow(S.e / 100, i), w = Math.max(14, (W * .62) * Math.pow(en / S.E, .25)), y = H - 12 - (i + 1) * hh; rect(g, (W * .62 - w) / 2 + 6, y, w, hh - 4, `hsl(${120 - i * 30},55%,${55 - i * 5}%)`); txt(g, l + ' ' + f(en, en < 10 ? 1 : 0) + ' kJ', W * .31 + 6, y + hh / 2 + 2, '#fff', 10, 'center'); txt(g, f(.04 * Math.pow(S.m, i), 2) + ' ppm', W - 10, y + hh / 2 + 2, C.bad, 11, 'right'); });
      txt(g, 'สารพิษ', W - 10, 14, C.bad, 10, 'right');
    },
    out: S => `ผู้บริโภคลำดับ 3 ได้พลังงาน <b>${f(S.E * Math.pow(S.e / 100, 3), 1)} kJ</b> (${f(Math.pow(S.e / 100, 3) * 100, 3)}% ของผู้ผลิต) แต่สารพิษสูงเป็น <b>${Math.pow(S.m, 3)} เท่า</b> ของในผู้ผลิต<br>พลังงานไหลทางเดียวและลดลงทุกขั้น ส่วนสารที่ย่อยสลายยากสะสมเพิ่มขึ้น`,
  });
})();
