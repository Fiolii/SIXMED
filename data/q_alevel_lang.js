// SIXMED: โจทย์ตั้งต้น A-Level ภาษาไทย · สังคมศึกษา · ภาษาอังกฤษ (กสพท ใช้ทั้ง 3 วิชา) — เขียนใหม่ทั้งหมด ไม่ใช่ข้อสอบจริงของ สทศ.
// โจทย์เพิ่มเติมรายวันมาจาก data/dq/ (งานประจำวัน 16:30) โดยใช้ชื่อหัวข้อเดียวกับไฟล์นี้
(function () {
  const G = 'alevel';
  const mk = subj => (id, lvl, q, c, a, exp, why, x) => QUESTIONS.push(Q(id, G, subj, subj, lvl, q, c, a, exp, Object.assign({ why }, x || {})));
  const TH = mk('ภาษาไทย'), SO = mk('สังคมศึกษา'), EN = mk('ภาษาอังกฤษ');

  /* ---------- ภาษาไทย ---------- */
  TH('a-th01', 3, 'ข้อใดเขียนสะกดถูกต้องทุกคำ', ['กะเพรา ลายเซ็นต์ ไอศกรีม', 'ผาสุก เกษียณ ผูกพัน', 'บิณฑบาตร ศีรษะ สัญญาณ', 'โอกาศ อานิสงส์ ประณีต', 'กระเพรา สัมภาษณ์ คำนวณ'], 1,
    'ผาสุก เกษียณ ผูกพัน สะกดถูกทุกคำ\nคำที่ผิดในข้ออื่น : ลายเซ็นต์ → ลายเซ็น · บิณฑบาตร → บิณฑบาต · โอกาศ → โอกาส · กระเพรา → กะเพรา',
    ['ลายเซ็น ไม่มี ต์ การันต์', '', 'บิณฑบาต ไม่มี ร สะกด', 'โอกาส สะกดด้วย ส', 'กะเพรา ใช้ ก ไม่มี ร ควบ']);
  TH('a-th02', 1, 'ข้อใดใช้ภาษาระดับทางการ', ['เดี๋ยวพวกเราจะไปกินข้าวที่โรงอาหารกันนะ', 'ที่ประชุมมีมติให้เลื่อนการสอบออกไปหนึ่งสัปดาห์', 'ป่านนี้เขาคงยังไม่ตื่นหรอกมั้ง ไปปลุกดีกว่า', 'แกจะไปไหนก็ไปเลย ไม่ต้องมาบอกฉันหรอก', 'วันนี้อากาศร้อนชะมัด อยากกินน้ำแข็งใสจัง'], 1,
    'ภาษาทางการใช้ถ้อยคำสุภาพ กระชับ ไม่มีคำลงท้ายหรือคำแสลง เช่น "ที่ประชุมมีมติ" ส่วนข้ออื่นเป็นภาษาปาก (กินข้าว นะ หรอก มั้ง แก ชะมัด จัง)',
    ['มีคำลงท้าย "นะ" และคำว่า "กิน" เป็นภาษาปาก', '', 'มีคำว่า "หรอก" "มั้ง" ซึ่งเป็นภาษาปาก', 'ใช้สรรพนาม "แก" และ "หรอก" เป็นภาษาปาก', '"ชะมัด" เป็นคำแสลง และ "จัง" เป็นภาษาปาก']);
  TH('a-th03', 2, 'ประโยคใดกำกวม ตีความได้มากกว่าหนึ่งความหมาย', ['เขาชอบฉันมากกว่าเธอ', 'นักเรียนทุกคนต้องมาถึงโรงเรียนก่อนแปดโมง', 'คุณหมอแนะนำให้คุณยายพักผ่อนให้เพียงพอ', 'ฝนตกหนักจนน้ำท่วมถนนหน้าบ้านของฉัน', 'น้องชายช่วยพ่อล้างรถในวันอาทิตย์นี้'], 0,
    '"เขาชอบฉันมากกว่าเธอ" ตีความได้ 2 แบบ : เขาชอบฉันมากกว่าที่เขาชอบเธอ หรือ เขาชอบฉันมากกว่าที่เธอชอบฉัน',
    ['', 'ความหมายชัดเจนเพียงแบบเดียว', 'ความหมายชัดเจนเพียงแบบเดียว', 'บอกเหตุและผลชัดเจน', 'บอกผู้ทำ สิ่งที่ทำ และเวลาชัดเจน']);
  const PTH = 'ยาปฏิชีวนะไม่ใช่ยาแก้อักเสบทุกชนิด และไม่ได้ช่วยให้หายจากไข้หวัดที่เกิดจากไวรัส การกินยาปฏิชีวนะโดยไม่จำเป็น หรือกินไม่ครบตามที่แพทย์สั่ง ทำให้เชื้อแบคทีเรียบางส่วนรอดชีวิตและพัฒนาเป็นเชื้อดื้อยา ซึ่งวันหนึ่งอาจทำให้การติดเชื้อธรรมดากลายเป็นโรคที่รักษายาก ก่อนใช้ยาจึงควรปรึกษาแพทย์หรือเภสัชกรทุกครั้ง';
  TH('a-th04', 3, 'จุดประสงค์สำคัญของผู้เขียนข้อความนี้คือข้อใด', ['อธิบายกลไกการออกฤทธิ์ของยาปฏิชีวนะแต่ละชนิดอย่างละเอียด', 'โน้มน้าวให้ใช้ยาปฏิชีวนะอย่างถูกต้องเพื่อป้องกันเชื้อดื้อยา', 'เล่าประวัติการค้นพบยาปฏิชีวนะและผลต่อวงการแพทย์ในอดีต', 'เปรียบเทียบข้อดีข้อเสียของการรักษาไข้หวัดด้วยยาชนิดต่าง ๆ', 'แนะนำให้หยุดใช้ยาทุกชนิดทันทีเมื่อรู้สึกว่าอาการดีขึ้นแล้ว'], 1,
    'ผู้เขียนชี้โทษของการใช้ยาปฏิชีวนะผิดวิธี (เชื้อดื้อยา) แล้วจบด้วยข้อแนะนำ "ควรปรึกษาแพทย์หรือเภสัชกร" จึงเป็นการโน้มน้าวให้ใช้ยาอย่างถูกต้อง',
    ['ข้อความไม่ได้อธิบายกลไกของยาแต่ละชนิด', '', 'ไม่มีเนื้อหาด้านประวัติการค้นพบ', 'ไม่ได้เปรียบเทียบยาหลายชนิด', 'ขัดกับข้อความที่เตือนว่ากินยาไม่ครบทำให้ดื้อยา'], { passage: PTH });
  TH('a-th05', 2, 'ข้อใดไม่ใช่ข้อมูลที่ได้จากข้อความนี้', ['ยาปฏิชีวนะไม่ได้ช่วยรักษาไข้หวัดที่เกิดจากไวรัส', 'การกินยาไม่ครบอาจทำให้เกิดเชื้อแบคทีเรียดื้อยา', 'ควรปรึกษาแพทย์หรือเภสัชกรก่อนใช้ยาปฏิชีวนะ', 'ยาปฏิชีวนะมีราคาแพงจึงควรใช้อย่างประหยัดที่สุด', 'เชื้อดื้อยาอาจทำให้การติดเชื้อธรรมดารักษายากขึ้น'], 3,
    'ข้อความไม่ได้กล่าวถึงราคาของยาเลย ส่วนข้ออื่นมีอยู่ในข้อความทั้งหมด',
    ['ข้อความกล่าวไว้ในประโยคแรก', 'ข้อความกล่าวถึงการกินไม่ครบตามที่แพทย์สั่ง', 'ข้อความกล่าวไว้ในประโยคสุดท้าย', '', 'ข้อความกล่าวว่าอาจกลายเป็นโรคที่รักษายาก'], { passage: PTH });
  TH('a-th06', 1, 'สำนวนใดมีความหมายว่า ทำงานไปวัน ๆ ไม่ตั้งใจและไม่รับผิดชอบ', ['ขี่ช้างจับตั๊กแตน', 'เช้าชามเย็นชาม', 'น้ำซึมบ่อทราย', 'ปิดทองหลังพระ', 'ช้า ๆ ได้พร้าเล่มงาม'], 1,
    '"เช้าชามเย็นชาม" หมายถึงทำงานไปวัน ๆ พอให้ได้ค่าตอบแทน ไม่ทุ่มเท',
    ['หมายถึงลงทุนมากแต่ได้ผลน้อย', '', 'หมายถึงได้มาทีละน้อยแต่สม่ำเสมอ', 'หมายถึงทำความดีโดยไม่มีใครเห็น', 'หมายถึงทำอย่างประณีตจะได้ผลดี']);
  TH('a-th07', 2, 'ข้อความใดใช้ภาพพจน์แบบบุคคลวัต (บุคคลาธิษฐาน)', ['ใจของเธอดำเหมือนถ่านไม่มีผิด', 'สายลมกระซิบบอกความลับแก่ใบไม้', 'เขาเป็นสิงห์สนามของโรงเรียน', 'คิดถึงเธอจนน้ำตาท่วมห้อง', 'เสียงน้ำไหลซู่ซ่าอยู่ในลำธาร'], 1,
    'บุคคลวัตคือการให้สิ่งที่ไม่ใช่มนุษย์ทำกิริยาอย่างมนุษย์ สายลม "กระซิบบอกความลับ" จึงเป็นบุคคลวัต',
    ['ใช้คำว่า "เหมือน" เปรียบเทียบ เป็นอุปมา', '', 'กล่าวว่าเขา "เป็น" สิงห์สนาม เป็นอุปลักษณ์', 'กล่าวเกินจริง เป็นอติพจน์', 'เลียนเสียงธรรมชาติ เป็นสัทพจน์']);
  TH('a-th08', 1, 'เรียงลำดับข้อความต่อไปนี้ให้ได้ใจความ  ก) จากนั้นจึงล้างแผลด้วยน้ำเกลือหรือน้ำสะอาด  ข) เมื่อเกิดแผลถลอก ควรล้างมือให้สะอาดก่อนสัมผัสแผล  ค) สุดท้ายปิดแผลด้วยผ้าก๊อซสะอาดถ้าแผลมีโอกาสสกปรก  ง) แล้วซับให้แห้งและทายาฆ่าเชื้อรอบ ๆ แผล', ['ข ก ง ค', 'ข ง ก ค', 'ก ข ง ค', 'ข ก ค ง', 'ง ข ก ค'], 0,
    'ดูคำเชื่อมบอกลำดับ : ข (เริ่มเรื่อง "เมื่อเกิดแผล") → ก ("จากนั้น") → ง ("แล้ว") → ค ("สุดท้าย")',
    ['', 'ซับแผลให้แห้งก่อนล้างแผลไม่ได้', '"จากนั้น" ขึ้นต้นเรื่องไม่ได้', '"สุดท้าย" ต้องอยู่ท้ายสุด', 'ซับแผลก่อนล้างมือไม่ได้']);

  /* ---------- สังคมศึกษา ---------- */
  SO('a-so01', 1, 'ในอริยสัจ 4 ข้อใดหมายถึง "เหตุแห่งทุกข์"', ['ทุกข์', 'สมุทัย', 'นิโรธ', 'มรรค', 'ไตรลักษณ์'], 1,
    'อริยสัจ 4 : ทุกข์ (ปัญหา) · สมุทัย (เหตุแห่งทุกข์ คือ ตัณหา) · นิโรธ (ความดับทุกข์) · มรรค (ทางดับทุกข์)',
    ['ทุกข์ คือตัวปัญหา ไม่ใช่สาเหตุ', '', 'นิโรธ คือความดับทุกข์', 'มรรค คือหนทางดับทุกข์', 'ไตรลักษณ์ ไม่ใช่องค์ประกอบของอริยสัจ 4']);
  SO('a-so02', 3, 'ข้อใดอธิบายความหมายของ "อนัตตา" ได้ถูกต้อง', ['สรรพสิ่งไม่เที่ยง มีการเกิดขึ้น ตั้งอยู่ และดับไปเสมอ', 'สรรพสิ่งไม่มีตัวตนแท้จริง เป็นเพียงองค์ประกอบที่มารวมกัน', 'สรรพสิ่งทนอยู่ในสภาพเดิมไม่ได้ ต้องเปลี่ยนแปลงไปตลอด', 'ภาวะที่ทุกข์ดับไปอย่างสิ้นเชิงเมื่อละตัณหาได้หมดแล้ว', 'ทางสายกลางที่นำไปสู่ความดับทุกข์อย่างแท้จริงในชีวิต'], 1,
    'ไตรลักษณ์ : อนิจจัง (ไม่เที่ยง) · ทุกขัง (ทนอยู่ในสภาพเดิมไม่ได้) · อนัตตา (ไม่มีตัวตนที่แท้จริง เกิดจากขันธ์ 5 มารวมกัน)',
    ['เป็นความหมายของอนิจจัง', '', 'เป็นความหมายของทุกขัง', 'เป็นความหมายของนิโรธ', 'เป็นความหมายของมรรค (มัชฌิมาปฏิปทา)']);
  SO('a-so03', 2, 'รัฐกำหนดราคาขั้นสูงของหน้ากากอนามัยไว้ต่ำกว่าราคาดุลยภาพ ผลที่น่าจะเกิดขึ้นคือข้อใด', ['สินค้าขาดตลาด เพราะปริมาณเสนอซื้อมากกว่าปริมาณเสนอขาย', 'สินค้าล้นตลาด เพราะปริมาณเสนอขายมากกว่าปริมาณเสนอซื้อ', 'ราคาตลาดสูงขึ้นทันทีจนเท่ากับราคาดุลยภาพเดิมโดยไม่มีผลอื่น', 'ปริมาณเสนอขายเพิ่มขึ้น เพราะผู้ผลิตได้กำไรต่อชิ้นมากขึ้น', 'ตลาดไม่เปลี่ยนแปลง เพราะราคาขั้นสูงไม่มีผลต่อการซื้อขาย'], 0,
    'ราคาที่ต่ำกว่าดุลยภาพทำให้ผู้ซื้ออยากซื้อมากขึ้น แต่ผู้ขายอยากขายน้อยลง เกิดอุปสงค์ส่วนเกิน สินค้าจึงขาดตลาด',
    ['', 'ล้นตลาดเกิดจากราคาขั้นต่ำที่สูงกว่าดุลยภาพ', 'ราคาขั้นสูงห้ามขายเกินราคาที่กำหนด', 'ราคาต่ำลงทำให้ผู้ขายอยากขายน้อยลง', 'ราคาขั้นสูงที่ต่ำกว่าดุลยภาพมีผลต่อตลาดแน่นอน']);
  SO('a-so04', 2, 'ธนาคารแห่งประเทศไทยลดอัตราดอกเบี้ยนโยบาย โดยทั่วไปมีเป้าหมายเพื่อข้อใด', ['ลดปริมาณเงินในระบบเพื่อชะลอภาวะเงินเฟ้อที่รุนแรง', 'กระตุ้นการกู้ยืม การลงทุน และการใช้จ่ายในประเทศ', 'เพิ่มรายได้ของรัฐบาลจากการเก็บภาษีเงินได้บุคคล', 'จูงใจให้ประชาชนฝากเงินในธนาคารมากขึ้นกว่าเดิม', 'ทำให้ค่าเงินบาทแข็งค่าขึ้นเมื่อเทียบกับเงินตราต่างประเทศ'], 1,
    'ดอกเบี้ยต่ำลง ต้นทุนการกู้ยืมลดลง ธุรกิจและครัวเรือนจึงกู้ไปลงทุนและใช้จ่ายมากขึ้น เป็นนโยบายการเงินแบบผ่อนคลายเพื่อกระตุ้นเศรษฐกิจ',
    ['เป็นผลของการขึ้นดอกเบี้ย ไม่ใช่ลด', '', 'การเก็บภาษีเป็นนโยบายการคลังของรัฐบาล', 'ดอกเบี้ยเงินฝากต่ำลงทำให้คนอยากฝากน้อยลง', 'ดอกเบี้ยต่ำมักทำให้เงินทุนไหลออก ค่าเงินมีแนวโน้มอ่อนลง']);
  SO('a-so05', 2, 'ตามรัฐธรรมนูญไทย อำนาจตุลาการใช้ผ่านองค์กรใด', ['รัฐสภา', 'คณะรัฐมนตรี', 'ศาล', 'คณะกรรมการการเลือกตั้ง', 'ผู้ตรวจการแผ่นดิน'], 2,
    'อำนาจอธิปไตย 3 ทาง : นิติบัญญัติใช้ผ่านรัฐสภา · บริหารใช้ผ่านคณะรัฐมนตรี · ตุลาการใช้ผ่านศาล',
    ['รัฐสภาใช้อำนาจนิติบัญญัติ', 'คณะรัฐมนตรีใช้อำนาจบริหาร', '', 'เป็นองค์กรอิสระที่ดูแลการเลือกตั้ง', 'เป็นองค์กรอิสระที่ตรวจสอบการใช้อำนาจรัฐ']);
  SO('a-so06', 1, 'ประเทศไทยตั้งอยู่ในซีกโลกใด', ['ซีกโลกเหนือและซีกโลกตะวันออก', 'ซีกโลกใต้และซีกโลกตะวันออก', 'ซีกโลกเหนือและซีกโลกตะวันตก', 'ซีกโลกใต้และซีกโลกตะวันตก', 'อยู่บนเส้นศูนย์สูตรพอดี'], 0,
    'ประเทศไทยอยู่ราวละติจูด 5°–20° เหนือ และลองจิจูด 97°–105° ตะวันออก จึงอยู่ในซีกโลกเหนือและซีกโลกตะวันออก',
    ['', 'ละติจูดของไทยเป็นทิศเหนือ', 'ลองจิจูดของไทยเป็นทิศตะวันออก', 'ผิดทั้งสองทิศ', 'เส้นศูนย์สูตรอยู่ใต้ประเทศไทยลงไป']);
  SO('a-so07', 3, 'ประเทศไทยใช้เวลา UTC+7 ส่วนกรุงลอนดอนในช่วงฤดูหนาวใช้เวลา UTC+0 ถ้าที่กรุงเทพฯ เป็นเวลา 15:00 น. ที่ลอนดอนจะเป็นเวลาใดของวันเดียวกัน', ['07:00 น.', '08:00 น.', '09:00 น.', '15:00 น.', '22:00 น.'], 1,
    'กรุงเทพฯ เร็วกว่าลอนดอน 7 ชั่วโมง → 15:00 − 7 = 08:00 น.',
    ['ลบ 8 ชั่วโมง เกินไป 1 ชั่วโมง', '', 'ลบ 6 ชั่วโมง ขาดไป 1 ชั่วโมง', 'ลืมคิดความต่างของเขตเวลา', 'บวก 7 ชั่วโมงแทนการลบ']);
  SO('a-so08', 2, 'พระองค์ใดได้รับการยกย่องเป็น "พระบิดาแห่งการแพทย์แผนปัจจุบันของไทย"', ['สมเด็จพระมหิตลาธิเบศร อดุลยเดชวิกรม พระบรมราชชนก', 'สมเด็จพระเจ้าบรมวงศ์เธอ กรมพระยาดำรงราชานุภาพ', 'พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 5)', 'พระบาทสมเด็จพระมงกุฎเกล้าเจ้าอยู่หัว (รัชกาลที่ 6)', 'สมเด็จพระเจ้าบรมวงศ์เธอ กรมพระยาวชิรญาณวโรรส'], 0,
    'สมเด็จพระมหิตลาธิเบศรฯ (สมเด็จพระบรมราชชนก) ทรงพัฒนาการแพทย์และการสาธารณสุขของไทย ทั้งทุนการศึกษา การปรับปรุงหลักสูตรแพทย์ และโรงพยาบาลศิริราช จึงได้รับการยกย่องเป็นพระบิดาแห่งการแพทย์แผนปัจจุบันของไทย',
    ['', 'ทรงได้รับการยกย่องเป็นพระบิดาแห่งประวัติศาสตร์ไทย', 'ทรงก่อตั้งโรงพยาบาลศิริราช แต่ไม่ใช่พระสมัญญานี้', 'ทรงตั้งโรงพยาบาลหลายแห่ง แต่ไม่ใช่พระสมัญญานี้', 'ทรงมีบทบาทด้านการศึกษาและการพระศาสนา']);

  /* ---------- ภาษาอังกฤษ ---------- */
  EN('a-en01', 1, 'Patient: "I\'ve had this cough for nearly two weeks now."\nDoctor: "______"', ['Then you must have caught it at least a month ago.', 'I see. Have you noticed any fever or chest pain?', 'Good, so you will not need any medicine at all.', 'A cough for two weeks is what everyone gets in winter.', 'Please come back when it has lasted for two years.'], 1,
    'The doctor should respond by asking about related symptoms to assess the illness. The other replies are illogical or dismissive.',
    ['The time does not match what the patient said.', '', 'A long cough is a reason to check, not to say "good".', 'This dismisses the patient without any assessment.', 'Waiting two years is unreasonable and unsafe.']);
  EN('a-en02', 2, 'The new drug was withdrawn from the market after reports of serious side effects.\nThe word "withdrawn" is closest in meaning to ______.', ['removed', 'advertised', 'approved', 'exported', 'reduced'], 0,
    '"Withdraw" from the market means to take a product off sale — removed. Serious side effects are a reason to stop selling a drug.',
    ['', 'Advertising would sell more, not stop sales.', 'Side effects would not lead to approval.', 'Exporting still sells the drug.', '"Reduced" means less, not taken off the market.']);
  EN('a-en03', 2, 'If the ambulance ______ earlier, the patient would have survived.', ['arrives', 'arrived', 'had arrived', 'would arrive', 'has arrived'], 2,
    'This is a third conditional about the past: If + past perfect (had arrived), ... would have + V3 (would have survived).',
    ['Present simple is for real future conditions.', 'Past simple is for the second conditional (would + V1).', '', '"would" does not go in the if-clause.', 'Present perfect does not fit an unreal past condition.']);
  EN('a-en04', 2, 'Neither the nurses nor the doctor ______ aware of the change in the schedule.', ['were', 'was', 'are', 'have been', 'being'], 1,
    'With "neither ... nor", the verb agrees with the nearer subject. "The doctor" is singular and the sentence is about the past, so "was" is correct.',
    ['"were" agrees with "the nurses", which is not the nearer subject.', '', '"are" is plural and present tense.', '"have been" is plural.', '"being" is not a finite verb.']);
  const PEN = 'For many years, sleep was viewed as a passive state in which the brain simply rested. Recent studies, however, suggest that the sleeping brain is remarkably active. During deep sleep, neurons replay patterns of activity recorded during the day, a process thought to strengthen new memories. Students who slept after learning a list of words recalled more of them the next morning than students who stayed awake for the same period. These findings have led some researchers to argue that a good night\'s sleep may be as valuable as an extra hour of study before an exam.';
  EN('a-en05', 3, 'Which of the following best states the main idea of the passage?', ['Students should always study for one extra hour before an exam.', 'Sleep plays an active role in strengthening newly learned memories.', 'The brain rests completely during deep sleep, as scientists believe.', 'Students who stay awake remember more words than those who sleep.', 'Neurons are active only during the day while people are learning.'], 1,
    'The passage explains that the sleeping brain is active and that deep sleep helps strengthen new memories, supported by the word-list study.',
    ['This is a detail compared with sleep, not the main idea.', '', 'The passage says this older view is wrong.', 'The study found the opposite.', 'The passage says neurons are active during sleep too.'], { passage: PEN });
  EN('a-en06', 3, 'The word "replay" in the passage is closest in meaning to ______.', ['repeat', 'erase', 'ignore', 'invent', 'reverse'], 0,
    'Neurons "replay" the day\'s activity patterns — they repeat them, which helps strengthen memories.',
    ['', 'Erasing would weaken memories, not strengthen them.', 'Ignoring the patterns would not strengthen anything.', 'The patterns were recorded during the day, not invented.', 'Nothing in the passage says the order is reversed.'], { passage: PEN });
  EN('a-en07', 2, 'According to the passage, which statement is TRUE?', ['Earlier researchers already knew that the sleeping brain is very active.', 'Students who slept after learning recalled more words the next morning.', 'Deep sleep weakens the memories that were formed during the day before.', 'The researchers proved that sleep is more valuable than any study time.', 'Students in the study learned the word list right after waking up.'], 1,
    'The passage states that students who slept after learning a list of words recalled more of them the next morning.',
    ['Sleep was once viewed as passive.', '', 'Deep sleep is thought to strengthen memories.', 'The passage says "may be as valuable as an extra hour", not more valuable than any study.', 'They learned the words before sleeping.'], { passage: PEN });
  EN('a-en08', 1, 'Regular hand washing is one of the most effective ways to ______ the spread of infection.', ['prevent', 'promote', 'predict', 'present', 'produce'], 0,
    'Hand washing stops germs from passing between people, so it prevents the spread of infection.',
    ['', '"promote" means to encourage, the opposite meaning.', 'Washing hands does not forecast anything.', '"present" does not fit the meaning.', 'Hand washing does not create infection.']);
})();
