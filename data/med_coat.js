// SIXMED: เสื้อกาวน์ของแต่ละมหาวิทยาลัย (วาดเอง ไม่ใช่ภาพหรือตราทางการ) — แทนเสื้อช็อปวิศวะของแอปต้นแบบ (SIXENT)
// ใช้รูปร่างและขนาดเดียวกับเสื้อเดิม (viewBox 120×130) จึงใส่กับตัวละคร การ์ดโปรไฟล์ และหน้ามหาวิทยาลัยได้ทันที
// สีประจำมหาวิทยาลัยอยู่ที่เสื้อสครับด้านใน ตัวปักชื่อ ปากกา และตราคณะ ส่วนตัวเสื้อเป็นสีขาวเหมือนกาวน์จริง
(function () {
  const EN = { sixent: 'SIXMED', mu: 'MAHIDOL UNIVERSITY', chula: 'CHULALONGKORN UNIVERSITY', cmu: 'CHIANG MAI UNIVERSITY', kku: 'KHON KAEN UNIVERSITY', psu: 'PRINCE OF SONGKLA UNIV.', tu: 'THAMMASAT UNIVERSITY' };
  function medCoat(name, uid, opts) {
    opts = opts || {};
    const id = uid || curThemeId(), u = uniOf(id), T = THEMES.find(t => t.id === id) || THEMES[0];
    const gold = !!opts.gold, uc = T.pl || '#0d9488', ac = gold ? '#c99a2e' : uc, sid = ++UEC;
    const nm = esc(String(name || 'น้องหมอ').slice(0, 8));
    const coat = '#fbfcfe', edge = 'rgba(40,52,72,.4)', seam = 'rgba(40,52,72,.24)', ink = '#2f3b52';
    const body = 'M44 8 L16 22 L2 52 L22 62 L30 50 L30 125 L90 125 L90 50 L98 62 L118 52 L104 22 L76 8 L60 44 Z';
    const lapL = 'M44 7 L31 15 L37 33 L43 30 L58 60 L60 46 Z', lapR = 'M76 7 L89 15 L83 33 L77 30 L62 60 L60 46 Z';
    const tx = (x, y, s, fs, fill, w) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${fill}" textLength="${w}" lengthAdjust="spacingAndGlyphs">${esc(s)}</text>`;
    const l2 = EN[id] || (u.shirt && u.shirt.l2) || '';
    const emb = typeof uniEmblem === 'function' ? uniEmblem(id, 12, { at: [33, 50] }) : '';
    const sleeve = typeof uniEmblem === 'function' ? `<g transform="rotate(-24 14 38)"><circle cx="14" cy="38" r="5.200" fill="${ac}" fill-opacity=".14" stroke="${ac}" stroke-width=".6"/>${uniEmblem(id, 8.4, { at: [9.800, 33.800] })}</g>` : '';
    const pocket = (x, y, w, h) => `<path d="M${x} ${y}H${x + w}V${y + h - 1}Q${x + w} ${y + h} ${x + w - 1} ${y + h}H${x + 1}Q${x} ${y + h} ${x} ${y + h - 1}Z" fill="${coat}" stroke="${seam}" stroke-width=".9"/><path d="M${x} ${y + 3}H${x + w}" stroke="${seam}" stroke-width=".5" stroke-dasharray="1.200 .8"/>`;
    const goldTrim = `<g fill="none" stroke="#e6b84a" stroke-linejoin="round"><path d="${lapL}" stroke-width="1.100"/><path d="${lapR}" stroke-width="1.100"/><path d="M30 124H90M2.800 51L22.400 61M117.200 51L97.600 61" stroke-width="1.600"/></g>`;
    return `<svg class="shirt" viewBox="0 0 120 130" role="img" aria-label="เสื้อกาวน์ของ ${nm} (${esc(T.s || T.n)})">
    <defs><linearGradient id="ch${sid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1e293b" stop-opacity=".16"/></linearGradient>
      <linearGradient id="cv${sid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e293b" stop-opacity=".14"/><stop offset=".2" stop-color="#1e293b" stop-opacity="0"/><stop offset=".8" stop-color="#1e293b" stop-opacity="0"/><stop offset="1" stop-color="#1e293b" stop-opacity=".16"/></linearGradient>
      <filter id="cb${sid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.400"/></filter></defs>
    ${opts.paper ? '' : '<ellipse cx="60" cy="127" rx="40" ry="3" fill="rgba(0,0,0,.16)"/>'}
    <path d="M44 7 L76 7 L60 46 Z" fill="${uc}"/><path d="M49 7 L60 27 L71 7 Z" fill="rgba(0,0,0,.28)"/><path d="M49 7 L60 27 L71 7" fill="none" stroke="rgba(255,255,255,.35)" stroke-width=".7"/>
    <path d="${body}" fill="${coat}" stroke="${edge}" stroke-width="1.400" stroke-linejoin="round"/>
    <path d="${body}" fill="url(#cv${sid})"/><path d="${body}" fill="url(#ch${sid})"/>
    <g filter="url(#cb${sid})" fill="none" stroke="rgba(30,41,59,.1)" stroke-width="2.600"><path d="M36 74Q42 96 37 120"/><path d="M84 74Q78 98 83 120"/><path d="M30 50L22 62M90 50L98 62"/></g>
    <path d="M44 7 Q60 14 76 7 L76 10 Q60 18 44 10 Z" fill="${coat}" stroke="${edge}" stroke-width=".8"/>
    <g stroke="${edge}" stroke-width=".9" stroke-linejoin="round"><path d="${lapL}" fill="${coat}"/><path d="${lapR}" fill="${coat}"/></g>
    <path d="M38 33L43 30M82 33L77 30" stroke="${seam}" stroke-width=".7"/>
    <path d="M58 60L60 46L62 60" fill="none" stroke="rgba(30,41,59,.18)" stroke-width="1.600" filter="url(#cb${sid})"/>
    <path d="M61.500 60V125" stroke="${seam}" stroke-width="1"/>${[74, 90, 106].map(y => `<circle cx="64.500" cy="${y}" r="1.900" fill="#f1f5f9" stroke="rgba(40,52,72,.45)" stroke-width=".55"/><circle cx="64" cy="${y - .5}" r=".5" fill="#fff"/>`).join('')}
    <g fill="none" stroke="${seam}" stroke-width=".55" stroke-dasharray="1.500 1.100"><path d="M20 24Q31 34 30 50M100 24Q89 34 90 50"/><path d="M3.800 48.400L23.800 58.400M116.200 48.400L96.200 58.400"/><path d="M31 122H89"/></g>
    <rect x="73" y="50" width="2.400" height="10" rx="1" fill="${ac}"/><path d="M74.200 50.600V56" stroke="#e2e8f0" stroke-width=".5"/><rect x="77" y="51.500" width="2.200" height="9" rx="1" fill="#334155"/>
    ${pocket(70, 56, 18, 15)}${tx(79, 67.200, nm, 4.200, ac, Math.min(16, 3.4 * nm.length + 2))}
    ${pocket(34, 92, 18, 17)}${pocket(68, 92, 18, 17)}
    ${emb}${tx(39, 65.600, 'FACULTY OF MEDICINE', 1.900, ac, 22)}${l2 ? tx(39, 68.400, l2, 1.700, ac, 22) : ''}
    ${sleeve}
    <g fill="none" stroke="${ink}" stroke-width="1.700" stroke-linecap="round"><path d="M50 9Q60 4 70 9"/><path d="M50 9C44 17 44 34 50 50C52 56 52 61 52 65"/><path d="M70 9C76 17 76 31 71 41"/><path d="M71 41L68 46M71 41L74 46"/></g>
    <circle cx="52" cy="68" r="3.400" fill="#cbd5e1" stroke="${ink}" stroke-width="1.100"/><circle cx="52" cy="68" r="1.600" fill="#94a3b8"/><circle cx="68" cy="46.600" r="1" fill="${ink}"/><circle cx="74" cy="46.600" r="1" fill="${ink}"/>
    ${gold ? goldTrim : ''}</svg>`;
  }
  uniShirt = medCoat;   // ทุกที่ที่เรียก uniShirt() (ตัวละคร การ์ดโปรไฟล์ หน้าเลือกธีม) จะได้เสื้อกาวน์แทน
})();
