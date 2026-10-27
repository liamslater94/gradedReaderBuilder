export const LEVEL_3 = [
  {
    id: "an-oc",
    title: "Đi Ăn Ốc Quận 4",
    titleEn: "Snail Night in District 4",
    level: 3,
    place: "Quận 4",
    emoji: "🐌",
    color: "#8e44ad",
    summary: "Garlic butter snails, plastic stools and a gang of very full friends.",
    culture:
      "Going out for snails (đi ăn ốc) is Saigon's favourite night out with friends: cheap plates, plastic stools, cold drinks and endless chatter. Vĩnh Khánh street in District 4 is the most famous strip. Friends jokingly call each other “bà” (girl) or “ông” (dude), and the bill is usually split evenly (chia đều).",
    keywords: [["ốc", "🐌"], ["sò điệp", "🦪"], ["nghêu", "🐚"], ["bơ tỏi", "🧄"], ["cụng ly", "🍻"], ["tính tiền", "🧾"]],
    pages: [
      {
        scene: { bg: "street", time: "night", items: [["👩", "thảo"], ["🐌", "ốc"], ["🍻", "cụng ly"]] },
        sentences: [
          ["Tối nay Thảo rủ đám bạn đi ăn ốc ở đường Vĩnh Khánh, Quận 4.", "Tonight Thảo invites the gang out for snails on Vĩnh Khánh street in District 4."],
          ["Con đường nhỏ mà quán nào cũng sáng đèn, khách ngồi tràn ra tới lề.", "It's a small street, but every place is lit up, with customers spilling out to the kerb."],
          ["Tiếng cười, tiếng nói, tiếng cụng ly rộn ràng cả khu.", "Laughter, chatter and clinking glasses fill the whole area."],
        ],
      },
      {
        scene: { bg: "street", time: "night", items: [["📋", "thực đơn"], ["🐌", "ốc hương"], ["🦪", "sò điệp"], ["🐚", "nghêu"]] },
        sentences: [
          ["Chị phục vụ đưa thực đơn: “Mấy em ăn gì nè?”", "The waitress hands them a menu: “What'll you have?”"],
          ["Thảo đọc một hơi: “Cho em một dĩa ốc hương xào bơ tỏi, một dĩa sò điệp nướng mỡ hành, với nghêu hấp sả nha chị.”", "Thảo reels it off in one breath: “One plate of sweet snails in garlic butter, one plate of grilled scallops with scallion oil, and clams steamed with lemongrass, please.”"],
          ["Tuấn la lên: “Gì nhiều dữ vậy bà?”", "Tuấn cries out: “Whoa, why so much, girl?”"],
          ["Thảo cười: “Ăn từ từ, tới khuya lận mà!”", "Thảo laughs: “We'll take it slow, we've got all night!”"],
        ],
      },
      {
        scene: { bg: "street", time: "night", items: [["🧄", "bơ tỏi"], ["🪥", "cây tăm"], ["🧂", "muối ớt"], ["🥖", "bánh mì"]] },
        sentences: [
          ["Đồ ăn ra, cả đám im re, chỉ lo ăn.", "The food arrives and the gang goes dead quiet, busy eating."],
          ["Tuấn lấy cây tăm khều con ốc ra, chấm muối ớt chanh.", "Tuấn picks a snail out with a toothpick and dips it in chilli-lime salt."],
          ["“Trời ơi, ốc hương xào bơ tỏi này đỉnh thiệt!”", "“Oh my god, these garlic butter snails are the best!”"],
          ["Phần nước sốt còn lại, tụi nó chấm bánh mì ăn sạch trơn.", "They mop up every last bit of the sauce with bread."],
        ],
      },
      {
        scene: { bg: "street", time: "night", items: [["🕛", "mười hai giờ"], ["🧾", "tính tiền"], ["🙌", "đồng thanh"]] },
        sentences: [
          ["Gần mười hai giờ, cả đám mới đứng dậy tính tiền.", "It's nearly midnight before the gang finally gets up to pay."],
          ["“Chia đều nha, mỗi đứa hai trăm.”", "“Let's split it evenly, two hundred each.”"],
          ["Tuấn ôm bụng: “No quá! Tuần sau đi nữa hông?”", "Tuấn clutches his belly: “I'm stuffed! Same again next week?”"],
          ["Cả đám đồng thanh: “Đi!”", "The whole gang answers as one: “Let's go!”"],
        ],
      },
    ],
    vocab: {
      "thảo": { en: "Thảo (a girl's name)" },
      "tuấn": { en: "Tuấn (a boy's name)" },
      "vĩnh khánh": { en: "Vĩnh Khánh (District 4 street famous for snail restaurants)" },
      "bà": { en: "girl, you (joking, between friends); grandma; Mrs", note: "Friends call each other “bà” and “ông” as a joke, like “girl” and “dude”." },
    },
    quiz: [
      { q: "Đám bạn đi ăn ở đâu?", qEn: "Where does the gang eat?", options: ["Đường Vĩnh Khánh, Quận 4", "Chợ Bến Thành", "Quận 6", "Nhà Thảo"], answer: 0 },
      { tf: "Thảo kêu ít món.", tfEn: "Thảo orders only a few dishes.", answer: false },
      { q: "Tuấn chấm ốc với gì?", qEn: "What does Tuấn dip the snails in?", options: ["Muối ớt chanh", "Nước tương", "Đường", "Nước mắm"], answer: 0 },
      { q: "Mỗi người trả bao nhiêu?", qEn: "How much does each person pay?", options: ["Hai trăm", "Một trăm", "Năm chục", "Năm trăm"], answer: 0 },
      { tf: "Tụi nó chấm bánh mì với nước sốt.", tfEn: "They dip bread in the sauce.", answer: true },
    ],
  },

  {
    id: "cho-lon",
    title: "Một Ngày Ở Chợ Lớn",
    titleEn: "A Day in Chợ Lớn",
    level: 3,
    place: "Quận 5",
    emoji: "🏮",
    color: "#b71c1c",
    summary: "Incense coils, a wholesale market and duck noodles in Saigon's Chinatown.",
    culture:
      "Chợ Lớn (“big market”) in Districts 5 and 6 has been home to Saigon's Chinese community, mostly Cantonese, Teochew and Hokkien, for over two hundred years. Many Saigon words came in through Chợ Lớn from Chinese dialects: bạc xỉu, xá xíu, lạp xưởng. Bình Tây market is a big wholesale (chợ sỉ) hub.",
    keywords: [["chùa", "🛕"], ["nhang", "🕯️"], ["điều ước", "🌠"], ["chợ sỉ", "📦"], ["bộ chén", "🥣"], ["mì vịt tiềm", "🦆"]],
    pages: [
      {
        scene: { bg: "market", decor: "lanterns", items: [["👩", "ngân"], ["👱‍♀️", "claire"], ["🏮", "lồng đèn"]] },
        sentences: [
          ["Chủ nhật, Ngân dẫn bạn người Pháp tên Claire đi Chợ Lớn.", "On Sunday, Ngân takes her French friend Claire to Chợ Lớn."],
          ["“Chợ Lớn là khu người Hoa của Sài Gòn đó,” Ngân nói.", "“Chợ Lớn is Saigon's Chinese quarter,” Ngân says."],
          ["Đường phố ở đây đầy chữ Hoa, mùi nhang và mùi thuốc bắc.", "The streets here are full of Chinese characters and the smell of incense and herbal medicine."],
        ],
      },
      {
        scene: { bg: "home", decor: "lanterns", items: [["🛕", "chùa"], ["🌀", "vòng nhang"], ["🙏", "khấn"]] },
        sentences: [
          ["Hai người ghé chùa Bà Thiên Hậu, ngước lên thấy mấy vòng nhang lớn treo trên trần.", "They stop at the Thiên Hậu temple and look up to see huge incense coils hanging from the ceiling."],
          ["Người ta nói mỗi vòng nhang cháy cả tuần lận.", "People say each coil burns for a whole week."],
          ["Claire nhắm mắt, khấn một điều ước.", "Claire closes her eyes and makes a wish."],
        ],
      },
      {
        scene: { bg: "market", items: [["📦", "chợ sỉ"], ["🧵", "vải"], ["🍬", "bánh kẹo"], ["🥣", "bộ chén"]] },
        sentences: [
          ["Rồi Ngân dẫn Claire vô chợ Bình Tây, cái chợ sỉ lớn nhứt khu này.", "Then Ngân takes Claire into Bình Tây market, the biggest wholesale market in the area."],
          ["Ở đây cái gì cũng có: vải, đồ khô, bánh kẹo, chén dĩa.", "They have everything here: fabric, dried goods, sweets, crockery."],
          ["Claire muốn mua một bộ chén, mà bà chủ nói: “Ở đây bán sỉ thôi con, mua ít hổng bán.”", "Claire wants to buy a set of bowls, but the owner says: “We only sell wholesale here, dear. We don't sell small amounts.”"],
        ],
      },
      {
        scene: { bg: "street", decor: "lanterns", items: [["🦆", "mì vịt tiềm"], ["👴", "ông chủ tiệm"], ["🌏", "thế giới"]] },
        sentences: [
          ["Buổi trưa, hai người ăn mì vịt tiềm trong một tiệm nhỏ.", "At lunchtime, they eat braised duck noodles in a little shop."],
          ["Ông chủ tiệm nói tiếng Việt pha giọng Quảng Đông.", "The owner speaks Vietnamese with a Cantonese accent."],
          ["Claire nói: “Hôm nay giống như đi du lịch Hồng Kông vậy!”", "Claire says: “Today feels like a trip to Hong Kong!”"],
          ["Ngân cười: “Sài Gòn là vậy đó, đi một ngày mà thấy cả thế giới.”", "Ngân smiles: “That's Saigon for you. Go out for one day and you see the whole world.”"],
        ],
      },
    ],
    vocab: {
      "ngân": { en: "Ngân (a girl's name)" },
      "claire": { en: "Claire (a French name)" },
      "chợ lớn": { en: "Chợ Lớn, Saigon's Chinatown (lit. “big market”)" },
      "bà thiên hậu": { en: "Thiên Hậu, the Chinese sea goddess Mazu" },
      "chùa bà thiên hậu": { en: "Thiên Hậu Temple (built by Cantonese settlers)" },
      "bình tây": { en: "Bình Tây (the big wholesale market in District 6)" },
      "chợ bình tây": { en: "Bình Tây Market" },
      "hồng kông": { en: "Hong Kong" },
      "quảng đông": { en: "Guangdong; Cantonese" },
      "giọng quảng đông": { en: "a Cantonese accent" },
    },
    quiz: [
      { q: "Chợ Lớn là khu gì?", qEn: "What kind of area is Chợ Lớn?", options: ["Khu người Hoa", "Khu người Pháp", "Khu đại học", "Khu chợ nổi"], answer: 0 },
      { tf: "Một vòng nhang cháy được một tiếng.", tfEn: "An incense coil burns for one hour.", answer: false },
      { q: "Tại sao Claire hổng mua được bộ chén?", qEn: "Why can't Claire buy the bowls?", options: ["Chợ chỉ bán sỉ", "Chén mắc quá", "Chợ đóng cửa", "Cô quên tiền"], answer: 0 },
      { q: "Buổi trưa hai người ăn gì?", qEn: "What do they eat for lunch?", options: ["Mì vịt tiềm", "Phở", "Cơm tấm", "Bánh mì"], answer: 0 },
    ],
  },

  {
    id: "ket-xe",
    title: "Kẹt Xe Giờ Cao Điểm",
    titleEn: "Rush Hour",
    level: 3,
    place: "Bình Thạnh",
    emoji: "🚦",
    color: "#455a64",
    summary: "A job interview at eight. Gridlock at seven forty-five.",
    culture:
      "Rush hour (giờ cao điểm) in Saigon means rivers of motorbikes. Hàng Xanh intersection in Bình Thạnh is one of the most notorious bottlenecks. Southerners say “trễ” for late and “lẹ” for quick, where Northerners say “muộn” and “nhanh”.",
    keywords: [["kẹt xe", "🚦"], ["ngã tư", "🔀"], ["trễ", "⏰"], ["phỏng vấn", "💼"], ["mồ hôi", "💦"], ["lẹ", "⚡"]],
    pages: [
      {
        scene: { bg: "street", items: [["👩‍💼", "phương"], ["🔀", "ngã tư"], ["🚦", "kẹt xe"]] },
        sentences: [
          ["Bảy giờ rưỡi sáng, Phương có buổi phỏng vấn xin việc lúc tám giờ.", "It's half past seven, and Phương has a job interview at eight."],
          ["Cô phóng xe ra đường, nhưng vừa ra tới ngã tư thì kẹt cứng.", "She speeds out, but as soon as she reaches the intersection, everything is gridlocked."],
          ["Xe máy chen chúc, hổng nhúc nhích được chút nào.", "Motorbikes are packed in tight and can't move an inch."],
        ],
      },
      {
        scene: { bg: "street", items: [["⏰", "trễ"], ["🛵", "xe máy"], ["🚶", "lề"]] },
        sentences: [
          ["Phương nhìn đồng hồ: bảy giờ bốn mươi lăm.", "Phương looks at her watch: seven forty-five."],
          ["“Chết rồi, trễ mất!”", "“Oh no, I'm going to be late!”"],
          ["Có mấy người leo lên lề để chạy cho lẹ, nhưng Phương hổng dám.", "A few people ride up onto the pavement to go faster, but Phương doesn't dare."],
        ],
      },
      {
        scene: { bg: "street", items: [["📞", "gọi điện"], ["🙏", "xin lỗi"], ["👩‍💼", "trưởng phòng"]] },
        sentences: [
          ["Cô gọi điện cho công ty: “Dạ, em xin lỗi, em bị kẹt xe ở ngã tư Hàng Xanh.”", "She calls the company: “I'm so sorry, I'm stuck in traffic at Hàng Xanh intersection.”"],
          ["Người bên kia cười: “Hông sao em, chị cũng đang kẹt nè!”", "The woman on the other end laughs: “No problem, I'm stuck too!”"],
          ["Hóa ra đó là chị trưởng phòng sẽ phỏng vấn cô.", "It turns out she's the department head who'll be interviewing her."],
        ],
      },
      {
        scene: { bg: "city", items: [["🏢", "công ty"], ["💦", "mồ hôi"], ["😂", "phá lên cười"], ["🤝", "đi làm"]] },
        sentences: [
          ["Tám giờ hai mươi, cả hai tới công ty cùng một lúc.", "At eight twenty, they both arrive at the company at the same moment."],
          ["Hai người nhìn nhau, mồ hôi nhễ nhại, rồi cùng phá lên cười.", "They look at each other, dripping with sweat, and both burst out laughing."],
          ["Buổi phỏng vấn bắt đầu bằng chuyện kẹt xe, và kết thúc bằng một lời mời đi làm.", "The interview begins with traffic talk and ends with a job offer."],
        ],
      },
    ],
    vocab: {
      "phương": { en: "Phương (a woman's name)" },
      "hàng xanh": { en: "Hàng Xanh (a busy intersection in Bình Thạnh)" },
      "ngã tư hàng xanh": { en: "Hàng Xanh intersection" },
    },
    quiz: [
      { q: "Phương đi đâu?", qEn: "Where is Phương going?", options: ["Đi phỏng vấn xin việc", "Đi chợ", "Đi học", "Đi ăn sáng"], answer: 0 },
      { tf: "Phương leo lên lề để chạy cho lẹ.", tfEn: "Phương rides on the pavement to go faster.", answer: false },
      { q: "Ai cũng bị kẹt xe?", qEn: "Who else is stuck in traffic?", options: ["Chị trưởng phòng", "Ba của Phương", "Anh tài xế", "Cô giáo"], answer: 0 },
      { q: "Buổi phỏng vấn kết thúc như thế nào?", qEn: "How does the interview end?", options: ["Phương được mời đi làm", "Phương bị đuổi về", "Buổi phỏng vấn bị hủy", "Phương hổng tới"], answer: 0 },
    ],
  },
];
