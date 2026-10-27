export const LEVEL_2 = [
  {
    id: "com-tam",
    title: "Cơm Tấm Sài Gòn",
    titleEn: "Saigon Broken Rice",
    level: 2,
    place: "Tân Bình",
    emoji: "🍚",
    color: "#d35400",
    summary: "The smell of grilled pork wakes up the whole neighbourhood.",
    culture:
      "Cơm tấm (broken rice) was once the cheap leftover grain of rice mills; Saigon turned it into its signature breakfast. The classic plate is sườn bì chả: grilled pork chop, shredded pork skin and steamed egg meatloaf. Southerners eat from a “dĩa” and a “chén”; Northerners say “đĩa” and “bát”.",
    keywords: [["cơm tấm", "🍚"], ["sườn nướng", "🍖"], ["trứng ốp la", "🍳"], ["dĩa", "🍽️"], ["nước mắm", "🫙"], ["chén", "🥣"]],
    pages: [
      {
        scene: { bg: "street", time: "dusk", items: [["🍚", "cơm tấm"], ["🔥", "sườn nướng"], ["👃", "thơm phức"]] },
        sentences: [
          ["Sáu giờ sáng, quán cơm tấm đầu hẻm đã đông nghẹt khách.", "At six in the morning, the broken-rice shop at the mouth of the alley is already packed."],
          ["Mùi sườn nướng thơm phức bay khắp xóm.", "The smell of grilled pork chops drifts through the whole neighbourhood."],
          ["Ai đi ngang qua cũng phải ghé vô.", "Everyone who passes by has to stop in."],
        ],
      },
      {
        scene: { bg: "cafe", items: [["🧑", "duy"], ["🍽️", "dĩa"], ["🍳", "trứng ốp la"]] },
        sentences: [
          ["Duy ngồi xuống cái bàn nhỏ, kêu một dĩa cơm tấm sườn bì chả.", "Duy sits down at a little table and orders a plate of broken rice with pork chop, skin and meatloaf."],
          ["“Thêm một cái trứng ốp la nha anh!”", "“And a fried egg, please!”"],
          ["Anh chủ quán gật đầu: “Có liền!”", "The owner nods: “Coming right up!”"],
        ],
      },
      {
        scene: { bg: "cafe", items: [["🍖", "sườn"], ["🥚", "chả"], ["🫙", "nước mắm"], ["🥕", "đồ chua"]] },
        sentences: [
          ["Dĩa cơm tới: cơm trắng, sườn vàng ươm, bì, chả, trứng, mỡ hành.", "The plate arrives: white rice, golden pork chop, skin, meatloaf, egg and scallion oil."],
          ["Bên cạnh có chén nước mắm chua ngọt và đồ chua.", "On the side there's a little bowl of sweet-and-sour fish sauce and pickles."],
          ["Duy chan nước mắm lên cơm, rồi ăn ngon lành.", "Duy pours the fish sauce over his rice and tucks in happily."],
        ],
      },
      {
        scene: { bg: "cafe", items: [["🍵", "trà đá"], ["🧾", "tính tiền"], ["🐷", "mập"]] },
        sentences: [
          ["Ăn xong, Duy uống một ly trà đá cho mát.", "When he's done, Duy drinks a glass of iced tea to cool off."],
          ["“Tính tiền anh ơi! Bao nhiêu vậy?”", "“The bill, please! How much is it?”"],
          ["“Năm mươi lăm ngàn em.”", "“Fifty-five thousand.”"],
          ["Duy nghĩ: “Ngày nào cũng ăn cơm tấm chắc mập luôn quá!”", "Duy thinks: “If I eat broken rice every day, I'm going to get fat!”"],
        ],
      },
    ],
    vocab: {
      "duy": { en: "Duy (a boy's name)" },
      "cơm tấm sườn bì chả": { en: "broken rice with pork chop, shredded skin and egg meatloaf (the classic combo)" },
    },
    quiz: [
      { q: "Quán cơm tấm ở đâu?", qEn: "Where is the broken-rice shop?", options: ["Đầu hẻm", "Trong chợ", "Ở trường", "Ở nhà Duy"], answer: 0 },
      { q: "Duy kêu thêm gì?", qEn: "What extra does Duy order?", options: ["Trứng ốp la", "Canh", "Bánh mì", "Cà phê"], answer: 0 },
      { tf: "Duy chan nước mắm lên cơm.", tfEn: "Duy pours fish sauce over his rice.", answer: true },
      { q: "Dĩa cơm giá bao nhiêu?", qEn: "How much is the plate?", options: ["Năm mươi lăm ngàn", "Hai mươi lăm ngàn", "Một trăm ngàn", "Mười lăm ngàn"], answer: 0 },
    ],
  },

  {
    id: "hu-tieu",
    title: "Hủ Tiếu Hay Phở?",
    titleEn: "Hủ Tiếu or Phở?",
    level: 2,
    place: "Quận 4",
    emoji: "🍜",
    color: "#c0392b",
    summary: "A friend from Hà Nội gets a late-night lesson in Saigon noodles.",
    culture:
      "Hủ tiếu gõ (“knocking noodles”) are sold from roaming carts; a runner clacks bamboo sticks through the alleys to take orders and brings the bowls to you. Hủ tiếu Nam Vang comes from Phnom Penh's Chinese community. Southern food is famously sweeter than Northern food, a favourite topic of friendly North–South teasing.",
    keywords: [["hủ tiếu", "🍜"], ["ăn khuya", "🌙"], ["tô", "🥣"], ["tôm", "🦐"], ["trứng cút", "🥚"], ["nước lèo", "🍲"]],
    pages: [
      {
        scene: { bg: "street", time: "night", items: [["🧑", "minh"], ["👨", "hùng"], ["🌙", "ăn khuya"]] },
        sentences: [
          ["Tối thứ sáu, Minh rủ Hùng, bạn của anh từ Hà Nội, đi ăn khuya.", "On Friday night, Minh invites Hùng, his friend from Hà Nội, out for a late-night bite."],
          ["Hùng nói: “Đi ăn phở đi!”", "Hùng says: “Let's go for phở!”"],
          ["Minh lắc đầu: “Vô Sài Gòn thì phải ăn hủ tiếu chớ!”", "Minh shakes his head: “You're in Saigon, you've got to have hủ tiếu!”"],
        ],
      },
      {
        scene: { bg: "alley", time: "night", items: [["🛒", "xe hủ tiếu"], ["👦", "cậu bé"], ["🥢", "thanh tre"]] },
        sentences: [
          ["Hai người tới một xe hủ tiếu gõ trong hẻm.", "The two of them come to a hủ tiếu gõ cart in an alley."],
          ["Một cậu bé chạy khắp hẻm, gõ hai thanh tre: cóc, cóc, cóc.", "A young boy runs all around the alley, knocking two bamboo sticks: tock, tock, tock."],
          ["“Đó là tiếng hủ tiếu gõ đó,” Minh giải thích.", "“That's the sound of hủ tiếu gõ,” Minh explains."],
        ],
      },
      {
        scene: { bg: "alley", time: "night", items: [["🍜", "tô"], ["🦐", "tôm"], ["🥚", "trứng cút"], ["🌿", "rau"]] },
        sentences: [
          ["Minh kêu hai tô hủ tiếu Nam Vang.", "Minh orders two bowls of Nam Vang hủ tiếu."],
          ["Trong tô có tôm, thịt bằm, gan và trứng cút.", "In the bowl there's shrimp, minced pork, liver and quail eggs."],
          ["Nước lèo ngọt thanh, rau thì nhiều vô kể.", "The broth is delicately sweet, and there are herbs galore."],
        ],
      },
      {
        scene: { bg: "alley", time: "night", items: [["😋", "ngon"], ["🍬", "ngọt"], ["🏆", "thắng"]] },
        sentences: [
          ["Hùng ăn một miếng, rồi ăn hết luôn cả tô.", "Hùng takes one bite, then finishes the whole bowl."],
          ["“Ngon thiệt! Mà sao ngọt vậy?”", "“That's really good! But why is it so sweet?”"],
          ["Minh cười: “Người Sài Gòn mình ăn ngọt mà. Mai đi ăn phở, coi ai thắng!”", "Minh laughs: “We Saigon folks like it sweet. Tomorrow we'll have phở and see who wins!”"],
        ],
      },
    ],
    vocab: {
      "minh": { en: "Minh (a boy's name)" },
      "hùng": { en: "Hùng (a man's name)" },
      "hủ tiếu nam vang": { en: "Phnom Penh-style hủ tiếu noodle soup" },
      "nam vang": { en: "Nam Vang, the Vietnamese name for Phnom Penh" },
    },
    quiz: [
      { q: "Hùng từ đâu tới?", qEn: "Where is Hùng from?", options: ["Hà Nội", "Đà Nẵng", "Cần Thơ", "Huế"], answer: 0 },
      { q: "Tiếng “cóc, cóc” là gì?", qEn: "What is the “tock, tock” sound?", options: ["Tiếng hủ tiếu gõ", "Tiếng xe máy", "Tiếng mưa", "Tiếng chó"], answer: 0 },
      { tf: "Trong tô hủ tiếu có trứng cút.", tfEn: "There are quail eggs in the bowl.", answer: true },
      { q: "Hùng thấy hủ tiếu như thế nào?", qEn: "What does Hùng think of the hủ tiếu?", options: ["Ngon mà ngọt", "Hổng ngon", "Cay quá", "Mặn quá"], answer: 0 },
    ],
  },

  {
    id: "cong-vien",
    title: "Sáng Ở Công Viên",
    titleEn: "Morning in the Park",
    level: 2,
    place: "Quận 1",
    emoji: "🐦",
    color: "#2e7d32",
    summary: "Songbirds, old friends and a surprising new visitor in Tao Đàn park.",
    culture:
      "Saigon's parks come alive before sunrise, before the heat sets in. Tao Đàn park is famous for its songbird culture: old men bring caged birds like the chào mào (red-whiskered bulbul) to sing while they sip tea. Southerners say “chụp hình” for taking photos, where Northerners often say “chụp ảnh”.",
    keywords: [["công viên", "🌳"], ["tập thể dục", "🤸"], ["chạy bộ", "🏃"], ["lồng chim", "🐦"], ["ghế đá", "🪨"], ["chụp hình", "📷"]],
    pages: [
      {
        scene: { bg: "park", time: "dusk", items: [["🌳", "công viên"], ["🤸", "tập thể dục"], ["🏸", "cầu lông"]] },
        sentences: [
          ["Năm giờ sáng, công viên Tao Đàn đã có nhiều người.", "At five in the morning, Tao Đàn park is already full of people."],
          ["Mấy cô mấy chú tập thể dục, nhảy theo nhạc.", "Aunties and uncles exercise and dance to music."],
          ["Có người chạy bộ, có người đánh cầu lông.", "Some people jog, some play badminton."],
        ],
      },
      {
        scene: { bg: "park", items: [["👴", "ông bảy"], ["🐦", "lồng chim"], ["🍵", "trà"]] },
        sentences: [
          ["Ông Bảy ngồi trên ghế đá, bên cạnh là mấy lồng chim.", "Mr Bảy sits on a stone bench with a few bird cages beside him."],
          ["Sáng nào ông cũng đem chim ra đây cho tụi nó hót.", "Every morning he brings his birds here so they can sing."],
          ["Mấy ông bạn già ngồi uống trà, nghe chim hót, nói chuyện trên trời dưới đất.", "His old friends sit sipping tea, listening to the birds, chatting about everything under the sun."],
        ],
      },
      {
        scene: { bg: "park", items: [["👱‍♀️", "cô gái"], ["📷", "chụp hình"], ["😮", "ngạc nhiên"]] },
        sentences: [
          ["Một cô gái nước ngoài đi tới, chụp hình mấy con chim.", "A young foreign woman comes over and takes photos of the birds."],
          ["“Con chim này tên gì vậy ông?” cô hỏi bằng tiếng Việt.", "“What's this bird called?” she asks in Vietnamese."],
          ["Ông Bảy ngạc nhiên lắm: “Trời, con nói tiếng Việt giỏi quá!”", "Mr Bảy is amazed: “Wow, your Vietnamese is so good!”"],
        ],
      },
      {
        scene: { bg: "park", items: [["🐦", "chim chào mào"], ["🎶", "hót"], ["🤝", "bạn mới"]] },
        sentences: [
          ["Ông chỉ: “Con này là chim chào mào. Nó hót hay nhứt đó.”", "He points: “This one's a bulbul. It sings the best.”"],
          ["Cô gái cười, ngồi xuống uống trà với mấy ông.", "The young woman smiles and sits down to have tea with the old men."],
          ["Vậy là cô có thêm mấy người bạn mới ở Sài Gòn.", "And just like that, she has a few new friends in Saigon."],
        ],
      },
    ],
    vocab: {
      "tao đàn": { en: "Tao Đàn (a large park in District 1)" },
      "công viên tao đàn": { en: "Tao Đàn Park" },
      "ông bảy": { en: "Mr Bảy (birth-order name: the sixth child)" },
    },
    quiz: [
      { q: "Ông Bảy đem gì ra công viên?", qEn: "What does Mr Bảy bring to the park?", options: ["Mấy lồng chim", "Con chó", "Cây đàn", "Bánh mì"], answer: 0 },
      { tf: "Cô gái nước ngoài hổng biết nói tiếng Việt.", tfEn: "The foreign woman can't speak Vietnamese.", answer: false },
      { q: "Con chim nào hót hay nhứt?", qEn: "Which bird sings the best?", options: ["Chim chào mào", "Chim sẻ", "Con gà", "Con vịt"], answer: 0 },
      { q: "Mấy ông ngồi làm gì?", qEn: "What are the old men doing?", options: ["Uống trà, nói chuyện", "Chạy bộ", "Đánh cầu lông", "Bán chim"], answer: 0 },
    ],
  },
];
