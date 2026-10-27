export const LEVEL_1 = [
  {
    id: "nuoc-mia",
    title: "Ly Nước Mía",
    titleEn: "A Glass of Sugarcane Juice",
    level: 1,
    place: "Quận 10",
    emoji: "🥤",
    color: "#7cb342",
    summary: "A scorching afternoon, a thirsty boy and a whirring juice machine.",
    culture:
      "Nước mía carts press fresh sugarcane through a roller machine right on the pavement. Southerners squeeze in tắc (kumquat/calamansi), which Northerners call quất. On a hot Saigon afternoon it's the cheapest way to cool down.",
    keywords: [["nước mía", "🥤"], ["nóng", "🥵"], ["khát", "😮‍💨"], ["tắc", "🍋"], ["cây mía", "🎋"], ["ngọt", "🍬"]],
    pages: [
      {
        scene: { bg: "street", items: [["☀️", "nắng"], ["👦", "an"], ["🥵", "nóng"]] },
        sentences: [
          ["Hôm nay trời nóng quá.", "It's so hot today."],
          ["An khát nước lắm.", "An is really thirsty."],
          ["Ở góc đường có một xe nước mía.", "On the street corner there's a sugarcane juice cart."],
        ],
      },
      {
        scene: { bg: "street", items: [["👨", "chú"], ["🥤", "nước mía"], ["🍋", "tắc"]] },
        sentences: [
          ["Chú bán nước mía cười: “Uống nước mía hông con?”", "The juice man smiles: “Want some sugarcane juice?”"],
          ["“Dạ, cho con một ly lớn nha chú.”", "“Yes, one large glass please, Uncle.”"],
          ["“Có bỏ tắc hông?”", "“With kumquat?”"],
          ["“Dạ, bỏ tắc nhiều nha chú.”", "“Yes, lots of kumquat please.”"],
        ],
      },
      {
        scene: { bg: "street", items: [["🎋", "cây mía"], ["⚙️", "máy"], ["🧊", "đá"]] },
        sentences: [
          ["Chú bỏ mấy cây mía vô máy.", "He feeds a few sugarcane stalks into the machine."],
          ["Máy chạy rè rè. Nước mía chảy ra, màu xanh xanh.", "The machine whirs. The juice runs out, a pale green."],
          ["Chú bỏ đá, bỏ tắc vô ly.", "He adds ice and kumquat to the glass."],
        ],
      },
      {
        scene: { bg: "street", items: [["😋", "ngọt"], ["🥤", "ly"], ["💵", "mười ngàn"]] },
        sentences: [
          ["An uống một hơi hết nửa ly.", "An gulps down half the glass in one go."],
          ["“Ngọt quá! Mát quá!”", "“So sweet! So refreshing!”"],
          ["Một ly chỉ có mười ngàn. Rẻ mà ngon!", "A glass is only ten thousand. Cheap and delicious!"],
        ],
      },
    ],
    vocab: {
      "an": { en: "An (a boy's name; also means “peace”)" },
    },
    quiz: [
      { q: "An uống gì?", qEn: "What does An drink?", options: ["Nước mía", "Cà phê", "Trà đá", "Nước cam"], answer: 0 },
      { tf: "An bỏ tắc vô nước mía.", tfEn: "An has kumquat in his juice.", answer: true },
      { q: "Một ly nước mía giá bao nhiêu?", qEn: "How much is a glass?", options: ["Mười ngàn", "Hai mươi ngàn", "Năm ngàn", "Một trăm ngàn"], answer: 0 },
      { tf: "Hôm nay trời lạnh.", tfEn: "It's cold today.", answer: false },
    ],
  },

  {
    id: "be-na-di-hoc",
    title: "Bé Na Đi Học",
    titleEn: "Little Na Goes to School",
    level: 1,
    place: "Gò Vấp",
    emoji: "🎒",
    color: "#ec407a",
    summary: "A pink helmet, a singing ride with Dad, and a promise to be picked up.",
    culture:
      "Millions of Saigon kids ride to school on the front of a parent's motorbike. Southerners “rước” (pick up) their kids, where Northerners say “đón”. Children greet teachers with folded arms (khoanh tay) and a polite “Dạ, con chào cô!”.",
    keywords: [["đi học", "🎒"], ["trường", "🏫"], ["cô giáo", "👩‍🏫"], ["chở", "🛵"], ["rước", "🤗"], ["vẫy tay", "👋"]],
    pages: [
      {
        scene: { bg: "home", items: [["👧", "bé"], ["🎒", "đi học"], ["👨", "ba"]] },
        sentences: [
          ["Bé Na sáu tuổi.", "Little Na is six years old."],
          ["Năm nay, Na học lớp một.", "This year, Na is in first grade."],
          ["Mỗi sáng, ba chở Na đi học bằng xe máy.", "Every morning, Dad takes Na to school on his motorbike."],
        ],
      },
      {
        scene: { bg: "street", items: [["⛑️", "nón bảo hiểm"], ["🛵", "xe máy"], ["🎵", "hát"]] },
        sentences: [
          ["Na đội nón bảo hiểm màu hồng.", "Na wears a pink helmet."],
          ["Na ngồi phía trước, ba ngồi phía sau.", "Na sits in front and Dad sits behind."],
          ["Hai ba con vừa chạy xe vừa hát.", "Father and daughter sing as they ride."],
        ],
      },
      {
        scene: { bg: "school", items: [["🏫", "trường"], ["👩‍🏫", "cô giáo"], ["🙇", "khoanh tay"]] },
        sentences: [
          ["Tới trường, Na thấy cô giáo đứng ở cổng.", "At school, Na sees her teacher standing at the gate."],
          ["Na khoanh tay: “Dạ, con chào cô!”", "Na folds her arms: “Good morning, teacher!”"],
          ["Cô giáo cười: “Chào Na! Hôm nay con dễ thương quá!”", "The teacher smiles: “Hi Na! You look so cute today!”"],
        ],
      },
      {
        scene: { bg: "school", items: [["👋", "vẫy tay"], ["🕓", "bốn giờ"], ["🤗", "rước"]] },
        sentences: [
          ["Na chạy vô lớp, quay lại vẫy tay.", "Na runs into class, then turns and waves."],
          ["“Ba ơi, chiều nhớ rước con nha!”", "“Dad, remember to pick me up this afternoon!”"],
          ["Ba cười: “Ừ, bốn giờ ba rước con.”", "Dad laughs: “Okay, I'll pick you up at four.”"],
        ],
      },
    ],
    vocab: {
      "na": { en: "Na (a girl's name)" },
      "bé na": { en: "little Na (bé = little one, used before a child's name)" },
      "hai ba con": { en: "father and child (lit. “the two, father and child”)" },
    },
    quiz: [
      { q: "Na mấy tuổi?", qEn: "How old is Na?", options: ["Sáu tuổi", "Năm tuổi", "Bảy tuổi", "Mười tuổi"], answer: 0 },
      { tf: "Má chở Na đi học.", tfEn: "Mum takes Na to school.", answer: false },
      { q: "Na đội nón màu gì?", qEn: "What colour is Na's helmet?", options: ["Màu hồng", "Màu đỏ", "Màu xanh", "Màu vàng"], answer: 0 },
      { q: "Mấy giờ ba rước Na?", qEn: "What time will Dad pick Na up?", options: ["Bốn giờ", "Ba giờ", "Năm giờ", "Bảy giờ"], answer: 0 },
    ],
  },
];
