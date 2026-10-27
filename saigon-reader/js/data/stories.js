// Stories from Saigon, written in colloquial Southern Vietnamese.
// Each sentence is [vietnamese, english]. Words are looked up in the story's
// own `vocab` first, then in the shared dictionary (dictionary.js).

export const STORIES = [
  {
    id: "hem-nha-tui",
    title: "Hẻm Nhà Tui",
    titleEn: "My Alley",
    level: 1,
    place: "Quận 3",
    emoji: "🏘️",
    color: "#ff8a3d",
    summary: "Meet Vy and the neighbours in her noisy, lovable alley.",
    culture:
      "Saigon life happens in its hẻm (alleys). Neighbours are called by birth-order names like Ba, Tư, Năm, Sáu. In the South, the eldest child is “Hai”, not “Một”, so Cô Tư is the third-born child.",
    pages: [
      {
        scene: "🛵🏘️🌇",
        sentences: [
          ["Chào mấy bạn! Tui tên là Vy.", "Hi everyone! My name is Vy."],
          ["Tui hai mươi hai tuổi.", "I'm twenty-two years old."],
          ["Tui sống ở Sài Gòn, trong một con hẻm nhỏ ở Quận 3.", "I live in Saigon, in a small alley in District 3."],
          ["Hẻm nhà tui ồn lắm, nhưng vui lắm.", "My alley is really noisy, but really fun."],
        ],
      },
      {
        scene: "🍚👵☀️",
        sentences: [
          ["Sáng nào cũng có cô Tư bán xôi ở đầu hẻm.", "Every morning Auntie Tư sells sticky rice at the mouth of the alley."],
          ["Cô Tư hay cười và hay hỏi: “Ăn gì con?”", "Auntie Tư smiles a lot and always asks: “What'll you have, dear?”"],
          ["Tui nói: “Dạ, cho con một gói xôi nha cô.”", "I say: “One packet of sticky rice please, Auntie.”"],
        ],
      },
      {
        scene: "🐕🏠👨",
        sentences: [
          ["Nhà bên cạnh là nhà chú Sáu.", "The house next door is Uncle Sáu's house."],
          ["Chú Sáu có một con chó tên là Mập.", "Uncle Sáu has a dog called Fatty."],
          ["Con Mập hổng mập đâu, nó ốm nhom!", "Fatty isn't fat at all, it's skinny as a rake!"],
          ["Ổng đặt tên vậy cho vui thôi.", "He just named it that for fun."],
        ],
      },
      {
        scene: "⚽🧒🍵",
        sentences: [
          ["Buổi tối, mấy đứa con nít chơi đá banh trong hẻm.", "In the evening, the kids play football in the alley."],
          ["Người lớn ngồi uống trà đá và nói chuyện.", "The grown-ups sit drinking iced tea and chatting."],
          ["Tui thương hẻm nhà tui lắm.", "I really love my alley."],
        ],
      },
    ],
    vocab: {
      "vy": { en: "Vy (a girl's name)" },
      "cô tư": { en: "Auntie Tư (fourth in Southern birth-order naming, i.e. the third child)" },
      "chú sáu": { en: "Uncle Sáu (birth-order name: the fifth child)" },
      "mập": { en: "fat, chubby; here also the dog's name", north: "béo" },
    },
    quiz: [
      { q: "Vy sống ở đâu?", qEn: "Where does Vy live?", options: ["Quận 3", "Quận 1", "Hà Nội", "Đà Lạt"], answer: 0 },
      { q: "Cô Tư bán gì?", qEn: "What does Auntie Tư sell?", options: ["Xôi", "Bánh mì", "Cà phê", "Phở"], answer: 0 },
      { q: "Con Mập như thế nào?", qEn: "What is Fatty like?", options: ["Ốm nhom", "Mập lắm", "Bự lắm", "Hổng có lông"], answer: 0 },
      { q: "Buổi tối con nít làm gì?", qEn: "What do the kids do in the evening?", options: ["Chơi đá banh", "Đi ngủ", "Uống trà đá", "Bán xôi"], answer: 0 },
    ],
  },

  {
    id: "banh-mi",
    title: "Ổ Bánh Mì Buổi Sáng",
    titleEn: "The Morning Bánh Mì",
    level: 1,
    place: "Phú Nhuận",
    emoji: "🥖",
    color: "#e0a526",
    summary: "Nam orders a bánh mì and badly overestimates his chilli tolerance.",
    culture:
      "Southerners say “ổ bánh mì” (a loaf of bánh mì) and “ngàn” for thousand. Prices are usually given without the word “đồng”: “hai mươi lăm ngàn” = 25,000 đồng.",
    pages: [
      {
        scene: "⏰🛵🥖",
        sentences: [
          ["Bảy giờ sáng, Nam đói bụng quá.", "Seven in the morning, and Nam is starving."],
          ["Anh chạy xe máy ra xe bánh mì của cô Ba.", "He rides his motorbike over to Auntie Ba's bánh mì cart."],
          ["Xe bánh mì của cô Ba lúc nào cũng đông.", "Auntie Ba's cart is always busy."],
        ],
      },
      {
        scene: "👩‍🍳🌶️🙋",
        sentences: [
          ["Cô Ba hỏi: “Con ăn gì?”", "Auntie Ba asks: “What'll you have?”"],
          ["Nam nói: “Dạ, cô bán cho con một ổ bánh mì thịt.”", "Nam says: “One pork bánh mì please, Auntie.”"],
          ["“Có ăn ớt hông con?”", "“Do you want chilli?”"],
          ["“Dạ, cho con nhiều ớt nha cô. Con ăn cay giỏi lắm!”", "“Lots of chilli please, Auntie. I'm great with spicy food!”"],
        ],
      },
      {
        scene: "🥖🥒🌿",
        sentences: [
          ["Cô Ba bỏ pa-tê, thịt, chả lụa, đồ chua, ngò và ớt vô ổ bánh mì.", "Auntie Ba puts pâté, pork, pork roll, pickles, coriander and chilli into the bánh mì."],
          ["“Nhiêu tiền vậy cô?”", "“How much is it, Auntie?”"],
          ["“Hai mươi lăm ngàn con.”", "“Twenty-five thousand, dear.”"],
          ["Nam đưa tiền và nói: “Con cám ơn cô.”", "Nam hands over the money and says: “Thank you, Auntie.”"],
        ],
      },
      {
        scene: "😋🔥😭",
        sentences: [
          ["Nam cắn một miếng.", "Nam takes a bite."],
          ["Trời ơi, cay quá!", "Oh my god, it's so spicy!"],
          ["Nước mắt chảy ra, nhưng anh vẫn cười: “Ngon quá trời!”", "Tears stream down, but he still grins: “Ridiculously good!”"],
        ],
      },
    ],
    vocab: {
      "nam": { en: "Nam (a boy's name; also means “south”)" },
      "cô ba": { en: "Auntie Ba (birth-order name: the second child)" },
      "bán cho con": { en: "sell me… (polite way to order from an older vendor)" },
    },
    quiz: [
      { q: "Nam mua gì?", qEn: "What does Nam buy?", options: ["Bánh mì thịt", "Xôi", "Phở", "Cà phê sữa đá"], answer: 0 },
      { q: "Ổ bánh mì giá bao nhiêu?", qEn: "How much is the bánh mì?", options: ["Hai mươi lăm ngàn", "Mười lăm ngàn", "Năm chục ngàn", "Một trăm ngàn"], answer: 0 },
      { q: "“Ngò” là gì?", qEn: "What is “ngò”?", options: ["Coriander", "Chilli", "Pickles", "Pâté"], answer: 0 },
      { q: "Ăn xong miếng đầu, Nam thấy sao?", qEn: "After the first bite, how is Nam?", options: ["Cay mà ngon", "Hổng cay chút nào", "Hổng ngon", "Còn đói"], answer: 0 },
    ],
  },

  {
    id: "ca-phe-sua-da",
    title: "Cà Phê Sữa Đá",
    titleEn: "Iced Milk Coffee",
    level: 1,
    place: "Bình Thạnh",
    emoji: "☕",
    color: "#8d5b3e",
    summary: "A slow Sunday morning on tiny plastic stools with Linh and her dad.",
    culture:
      "Sidewalk cafés with low plastic stools are a Saigon institution. Free iced tea (trà đá) comes with your coffee. Bạc xỉu, from Cantonese, is the milky version that kids and sweet-tooths love.",
    pages: [
      {
        scene: "👨👧☕",
        sentences: [
          ["Ba của Linh ghiền cà phê lắm.", "Linh's dad is completely hooked on coffee."],
          ["Sáng nào ổng cũng ra quán cà phê vỉa hè ở đầu đường.", "Every morning he heads out to the sidewalk café at the end of the street."],
          ["Hôm nay là chủ nhật, nên Linh đi với ba.", "Today is Sunday, so Linh goes with her dad."],
        ],
      },
      {
        scene: "🪑🥛🧊",
        sentences: [
          ["Quán nhỏ xíu, chỉ có mấy cái ghế nhựa thấp.", "The café is tiny, with just a few low plastic stools."],
          ["Ba kêu: “Cho anh một ly cà phê sữa đá, một ly bạc xỉu nha em.”", "Dad orders: “One iced milk coffee and one bạc xỉu, please.”"],
          ["Bạc xỉu có nhiều sữa, ít cà phê. Linh thích bạc xỉu nhứt.", "Bạc xỉu has lots of milk and a little coffee. It's Linh's favourite."],
        ],
      },
      {
        scene: "💧🛵🛵",
        sentences: [
          ["Cà phê ở đây pha bằng phin, nhỏ từng giọt, từng giọt.", "The coffee here is made with a phin filter, dripping drop by drop."],
          ["Trong lúc chờ, hai ba con ngồi coi xe chạy ngoài đường.", "While they wait, father and daughter watch the traffic go by."],
          ["Xe máy chạy qua chạy lại, ồn ào mà vui.", "Motorbikes zip back and forth: noisy, but fun."],
        ],
      },
      {
        scene: "🍵😌☀️",
        sentences: [
          ["Cô chủ quán đem ra hai ly cà phê và một bình trà đá.", "The owner brings out two coffees and a jug of iced tea."],
          ["Trà đá ở đây miễn phí.", "The iced tea here is free."],
          ["Ba uống một ngụm, rồi nói: “Đã quá!”", "Dad takes a sip and says: “Ahh, that hits the spot!”"],
          ["Linh cười. Chủ nhật nào hai ba con cũng muốn ngồi đây.", "Linh smiles. Every Sunday, the two of them want to sit right here."],
        ],
      },
    ],
    vocab: {
      "linh": { en: "Linh (a girl's name)" },
      "hai ba con": { en: "father and child (lit. “the two, father and child”)", note: "Southern: ba = dad. North says “hai bố con”." },
    },
    quiz: [
      { q: "Ai ghiền cà phê?", qEn: "Who is hooked on coffee?", options: ["Ba của Linh", "Linh", "Cô chủ quán", "Má của Linh"], answer: 0 },
      { q: "Linh thích uống gì nhứt?", qEn: "What does Linh like to drink most?", options: ["Bạc xỉu", "Cà phê đen", "Trà đá", "Nước cam"], answer: 0 },
      { q: "Cà phê pha bằng gì?", qEn: "What is the coffee made with?", options: ["Phin", "Máy", "Ly", "Bình"], answer: 0 },
      { q: "Cái gì miễn phí?", qEn: "What is free?", options: ["Trà đá", "Bạc xỉu", "Cà phê sữa đá", "Ghế nhựa"], answer: 0 },
    ],
  },

  {
    id: "xe-om",
    title: "Chạy Xe Ôm Đi Bến Thành",
    titleEn: "A Motorbike Taxi to Bến Thành",
    level: 2,
    place: "Quận 1",
    emoji: "🛵",
    color: "#16a085",
    summary: "Tom, one week in Saigon, survives his first xe ôm ride.",
    culture:
      "“Xe ôm” means “hug vehicle”: you sit behind the driver. Today most people book one through an app. Southerners turn with “quẹo” (Northerners say “rẽ”) and come “qua” a country rather than “sang”.",
    pages: [
      {
        scene: "🧑‍🦰📱🗺️",
        sentences: [
          ["Tom là người Úc. Anh mới qua Sài Gòn được một tuần.", "Tom is Australian. He's only been in Saigon for a week."],
          ["Hôm nay anh muốn đi chợ Bến Thành, nhưng anh chưa biết chạy xe máy.", "Today he wants to go to Bến Thành market, but he can't ride a motorbike yet."],
          ["Vậy nên anh đặt một chiếc xe ôm trên điện thoại.", "So he books a motorbike taxi on his phone."],
        ],
      },
      {
        scene: "🪖🛵😬",
        sentences: [
          ["Năm phút sau, một anh tài xế tới, đưa cho Tom cái nón bảo hiểm.", "Five minutes later, a driver arrives and hands Tom a helmet."],
          ["“Anh đi chợ Bến Thành hả? Lên xe đi anh!”", "“Bến Thành market, right? Hop on!”"],
          ["Tom ngồi lên xe. Tim ảnh đập thình thịch.", "Tom climbs on. His heart is pounding."],
        ],
      },
      {
        scene: "🚗🛵🚌",
        sentences: [
          ["Đường Sài Gòn đông nghẹt xe.", "Saigon's streets are jam-packed."],
          ["Xe máy, xe hơi, xe buýt chạy tứ phía.", "Motorbikes, cars and buses are coming from every direction."],
          ["Anh tài xế chạy thẳng, rồi quẹo trái, rồi quẹo phải.", "The driver goes straight, then turns left, then turns right."],
          ["“Anh đừng sợ nha, tui chạy kỹ lắm!”", "“Don't be scared, I'm a really careful driver!”"],
        ],
      },
      {
        scene: "🏛️🦵😅",
        sentences: [
          ["Mười lăm phút sau, hai người tới chợ Bến Thành.", "Fifteen minutes later, they arrive at Bến Thành market."],
          ["Tom xuống xe, chân còn run run.", "Tom gets off, his legs still shaking."],
          ["“Cám ơn anh nhiều! Hổng sợ chút nào hết!”", "“Thanks a lot! Not scary at all!”"],
          ["Anh tài xế cười lớn: “Lần sau anh tự chạy nha!”", "The driver laughs out loud: “Next time, you drive yourself!”"],
        ],
      },
    ],
    vocab: {
      "tom": { en: "Tom (name)" },
      "bến thành": { en: "Bến Thành (famous market in District 1)" },
      "chợ bến thành": { en: "Bến Thành Market" },
    },
    quiz: [
      { q: "Tom là người nước nào?", qEn: "Where is Tom from?", options: ["Úc", "Mỹ", "Anh", "Pháp"], answer: 0 },
      { q: "Tại sao Tom đặt xe ôm?", qEn: "Why does Tom book a xe ôm?", options: ["Anh chưa biết chạy xe máy", "Trời mưa", "Anh hổng có tiền", "Anh thích xe hơi"], answer: 0 },
      { q: "“Quẹo trái” nghĩa là gì?", qEn: "What does “quẹo trái” mean?", options: ["Turn left", "Turn right", "Go straight", "Stop"], answer: 0 },
      { q: "Tom tới chợ sau bao lâu?", qEn: "How long until Tom reaches the market?", options: ["Mười lăm phút", "Năm phút", "Một tiếng", "Một tuần"], answer: 0 },
    ],
  },

  {
    id: "mua-sai-gon",
    title: "Mưa Sài Gòn",
    titleEn: "Saigon Rain",
    level: 2,
    place: "Quận 10",
    emoji: "🌧️",
    color: "#3b6fd8",
    summary: "Blazing sun, then a tropical downpour, then a bowl of chè.",
    culture:
      "Saigon has two seasons. In the rainy season (around May to November) the afternoon storm can be set by the clock: short, violent, and over in half an hour. Riders pull over (“tấp vô lề”) to throw on a poncho.",
    pages: [
      {
        scene: "☀️🌴🥵",
        sentences: [
          ["Sài Gòn chỉ có hai mùa: mùa mưa và mùa khô.", "Saigon has only two seasons: the rainy season and the dry season."],
          ["Bây giờ là tháng bảy, đang là mùa mưa.", "It's July now, the middle of the rainy season."],
          ["Ba giờ chiều, trời còn nắng chang chang.", "At three in the afternoon, the sun is still blazing."],
        ],
      },
      {
        scene: "🌩️💨🌧️",
        sentences: [
          ["Bốn giờ, trời tự nhiên tối thui.", "At four, the sky suddenly goes pitch black."],
          ["Gió thổi mạnh, rồi mưa đổ xuống ào ào.", "The wind picks up, then the rain comes pouring down."],
          ["Ai cũng tấp vô lề, lấy áo mưa ra mặc.", "Everyone pulls over to the kerb and gets their raincoat on."],
        ],
      },
      {
        scene: "🏃‍♀️🍧🏠",
        sentences: [
          ["Hà hổng có áo mưa, nên cô chạy vô một quán chè để trú mưa.", "Hà has no raincoat, so she runs into a chè shop to shelter from the rain."],
          ["Cô kêu một ly chè ba màu.", "She orders a glass of three-colour chè."],
          ["Ngồi ăn chè, nghe mưa rơi trên mái tôn, Hà thấy dễ chịu quá trời.", "Eating chè and listening to rain on the tin roof, Hà feels wonderfully content."],
        ],
      },
      {
        scene: "🌊🛵🌈",
        sentences: [
          ["Ngoài đường, nước ngập tới mắt cá chân.", "Out on the street, the water is ankle-deep."],
          ["Mấy anh chạy xe máy vẫn chạy, nước văng tung tóe.", "The guys on motorbikes keep riding, sending water splashing everywhere."],
          ["Bốn giờ rưỡi, mưa tạnh.", "At half past four, the rain stops."],
          ["Trời lại nắng, giống như hổng có chuyện gì xảy ra. Đó là Sài Gòn!", "The sun is back out as if nothing happened. That's Saigon!"],
        ],
      },
    ],
    vocab: {
      "hà": { en: "Hà (a girl's name)" },
    },
    quiz: [
      { q: "Sài Gòn có mấy mùa?", qEn: "How many seasons does Saigon have?", options: ["Hai mùa", "Bốn mùa", "Ba mùa", "Một mùa"], answer: 0 },
      { q: "Mấy giờ thì mưa?", qEn: "What time does it start raining?", options: ["Bốn giờ", "Ba giờ", "Bốn giờ rưỡi", "Bảy giờ"], answer: 0 },
      { q: "Hà trú mưa ở đâu?", qEn: "Where does Hà shelter from the rain?", options: ["Quán chè", "Quán cà phê", "Chợ", "Nhà ngoại"], answer: 0 },
      { q: "Nước ngập tới đâu?", qEn: "How deep is the flooding?", options: ["Mắt cá chân", "Đầu gối", "Bụng", "Hổng ngập"], answer: 0 },
    ],
  },

  {
    id: "tra-gia",
    title: "Trả Giá Ở Chợ",
    titleEn: "Haggling at the Market",
    level: 3,
    place: "Quận 1",
    emoji: "🥭",
    color: "#e2558a",
    summary: "Khoa is proud of his haggling, until Mum hears the price.",
    culture:
      "Fruit names are a classic North–South divide: thơm or khóm (pineapple) vs. dứa, mãng cầu (custard apple) vs. na. Saigon vendors count in “chục” (tens): “tám chục ngàn” = 80,000. The first sale of the day (“mở hàng”) is thought to bring luck.",
    pages: [
      {
        scene: "👩🧺🥭",
        sentences: [
          ["Má của Khoa nhờ anh đi chợ mua trái cây.", "Khoa's mum asks him to go to the market for fruit."],
          ["Má dặn: “Nhớ trả giá nha con, ở chợ người ta hay nói thách lắm.”", "Mum warns him: “Remember to haggle, people at the market always overcharge.”"],
          ["Khoa đi tới một sạp trái cây đầy màu sắc.", "Khoa walks up to a colourful fruit stall."],
        ],
      },
      {
        scene: "🥭🍍🍈",
        sentences: [
          ["Có xoài, thơm, mãng cầu, chôm chôm và sầu riêng.", "There are mangoes, pineapples, custard apples, rambutans and durians."],
          ["“Xoài nhiêu một ký vậy cô?”", "“How much is a kilo of mangoes, Auntie?”"],
          ["“Xoài cát Hòa Lộc ngon nhứt đó con, tám chục ngàn một ký.”", "“Hòa Lộc mangoes are the best there is, dear. Eighty thousand a kilo.”"],
          ["“Trời, mắc quá cô ơi! Bớt chút đi cô.”", "“Whoa, that's way too expensive! Knock a bit off, Auntie.”"],
        ],
      },
      {
        scene: "🤝💸😏",
        sentences: [
          ["“Thôi được, sáu chục ngàn nha.”", "“Alright then, sixty thousand.”"],
          ["“Năm chục đi cô, con mua tới hai ký lận.”", "“Make it fifty, Auntie, I'm buying a whole two kilos.”"],
          ["Cô bán hàng lắc đầu, rồi cười: “Thằng nhỏ này trả giá giỏi ghê! Thôi, bán mở hàng cho con đó.”", "The vendor shakes her head, then laughs: “This kid haggles like a pro! Fine, you're my first sale of the day.”"],
        ],
      },
      {
        scene: "🏠😎🤦‍♀️",
        sentences: [
          ["Khoa mua hai ký xoài và một trái thơm.", "Khoa buys two kilos of mangoes and a pineapple."],
          ["Về tới nhà, anh khoe với má: “Con trả giá được rẻ lắm nè má!”", "Back home, he shows off to Mum: “Look Mum, I got a really cheap price!”"],
          ["Má hỏi: “Bao nhiêu?” Khoa nói: “Dạ, năm chục một ký.”", "Mum asks: “How much?” Khoa says: “Fifty a kilo.”"],
          ["Má cười: “Trời đất, bữa qua má mua có bốn chục hà!”", "Mum laughs: “Good grief, yesterday I paid just forty!”"],
        ],
      },
    ],
    vocab: {
      "khoa": { en: "Khoa (a boy's name)" },
      "hòa lộc": { en: "Hòa Lộc (a Mekong Delta area famous for mangoes)" },
      "xoài cát hòa lộc": { en: "Hòa Lộc sand mango, the most prized mango variety" },
      "hà": { en: "only, just (sentence-final, Southern)", note: "Southern particle like “thôi”: “bốn chục hà” = only forty.", north: "thôi" },
    },
    quiz: [
      { q: "Má nhờ Khoa mua gì?", qEn: "What does Mum ask Khoa to buy?", options: ["Trái cây", "Bánh mì", "Cà phê", "Áo mưa"], answer: 0 },
      { q: "Lúc đầu cô bán xoài giá bao nhiêu?", qEn: "What was the first price for the mangoes?", options: ["Tám chục ngàn", "Sáu chục ngàn", "Năm chục ngàn", "Bốn chục ngàn"], answer: 0 },
      { q: "“Thơm” ở miền Nam là trái gì?", qEn: "In the South, what fruit is “thơm”?", options: ["Pineapple", "Mango", "Durian", "Rambutan"], answer: 0 },
      { q: "Tại sao má cười?", qEn: "Why does Mum laugh?", options: ["Bữa qua má mua rẻ hơn", "Xoài hổng ngon", "Khoa quên mua thơm", "Khoa mua sầu riêng"], answer: 0 },
    ],
  },

  {
    id: "tet-nha-ngoai",
    title: "Tết Ở Nhà Ngoại",
    titleEn: "Tết at Grandma's",
    level: 3,
    place: "Quận 6",
    emoji: "🧧",
    color: "#d63031",
    summary: "Bánh tét, yellow mai blossoms and a pun you can eat.",
    culture:
      "Southern Tết has its own symbols: yellow mai blossoms (the North has pink đào), log-shaped bánh tét (the North has square bánh chưng), and thịt kho hột vịt. Bitter melon soup (canh khổ qua) is a pun: “khổ qua” also means “hardship passes”.",
    pages: [
      {
        scene: "🌼🏠🛣️",
        sentences: [
          ["Tết năm nay, cả nhà Bảo về nhà ngoại ở Quận 6.", "This Tết, Bảo's whole family goes to Grandma's house in District 6."],
          ["Mấy ngày Tết, Sài Gòn vắng hoe, đường xá rộng thênh thang.", "Over Tết, Saigon empties out and the streets are wide open."],
          ["Trước cửa nhà ngoại có một chậu mai vàng nở rực rỡ.", "In front of Grandma's door, a pot of yellow mai blossoms is in brilliant bloom."],
        ],
      },
      {
        scene: "👵🍃🎋",
        sentences: [
          ["Ngoại đang gói bánh tét trong bếp.", "Grandma is wrapping bánh tét in the kitchen."],
          ["“Bảo ơi, lại đây phụ ngoại nè con!”", "“Bảo, come over here and help Grandma!”"],
          ["Bảo ngồi xuống, phụ ngoại cột dây cho mấy đòn bánh.", "Bảo sits down and helps Grandma tie string around the cake logs."],
        ],
      },
      {
        scene: "🍲🥚🥢",
        sentences: [
          ["Buổi tối, cả nhà ăn cơm chung.", "In the evening, the whole family eats together."],
          ["Trên bàn có thịt kho hột vịt, canh khổ qua và dưa giá.", "On the table there's pork braised with duck eggs, bitter melon soup and pickled bean sprouts."],
          ["Má nói: “Ăn canh khổ qua để năm mới mọi cái khổ qua hết.”", "Mum says: “Eat bitter melon soup so that in the new year, all hardship passes.”"],
        ],
      },
      {
        scene: "🧧👕🎉",
        sentences: [
          ["Sáng mùng một, Bảo mặc đồ mới và chúc Tết ngoại.", "On the morning of the first day, Bảo puts on new clothes and wishes Grandma a happy new year."],
          ["“Con chúc ngoại sống lâu trăm tuổi, mạnh giỏi nha ngoại!”", "“I wish you a hundred years of life, Grandma. Stay healthy and strong!”"],
          ["Ngoại cười, lì xì cho Bảo một bao đỏ.", "Grandma smiles and gives Bảo a red envelope."],
          ["Bảo nghĩ: “Tết là lúc vui nhứt trong năm!”", "Bảo thinks: “Tết is the best time of the year!”"],
        ],
      },
    ],
    vocab: {
      "bảo": { en: "Bảo (a boy's name)" },
      "khổ qua": { en: "bitter melon; pun: “hardship passes”", north: "mướp đắng" },
    },
    quiz: [
      { q: "Nhà ngoại của Bảo ở đâu?", qEn: "Where is Grandma's house?", options: ["Quận 6", "Quận 1", "Quận 3", "Hà Nội"], answer: 0 },
      { q: "Ở miền Nam, ngày Tết người ta chưng bông gì?", qEn: "Which blossom do Southerners display at Tết?", options: ["Mai vàng", "Đào", "Hồng", "Sen"], answer: 0 },
      { q: "Ngoại gói bánh gì?", qEn: "What cake is Grandma wrapping?", options: ["Bánh tét", "Bánh chưng", "Bánh mì", "Bánh xèo"], answer: 0 },
      { q: "Tại sao ăn canh khổ qua?", qEn: "Why eat bitter melon soup?", options: ["Để cái khổ qua hết", "Vì nó ngọt", "Vì nó rẻ", "Vì ngoại thích"], answer: 0 },
    ],
  },
];

export const LEVELS = {
  1: { name: "Mới tới", en: "Just arrived", color: "#2ecc71" },
  2: { name: "Quen đường", en: "Know the streets", color: "#f39c12" },
  3: { name: "Dân Sài Gòn", en: "Local", color: "#e74c3c" },
};
