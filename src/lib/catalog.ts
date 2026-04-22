import type { Locale } from "./site";

export type Localized<T = string> = Record<Locale, T>;

export type TourDate = {
  start: string;
  end: string;
  price: number;
  currency: "TRY" | "EUR" | "USD";
  availability: Localized;
  jollyUrl?: string;
};

export type Tour = {
  id: string;
  slugs: Localized;
  title: Localized;
  summary: Localized;
  description: Localized;
  image: string;
  categoryIds: string[];
  campaignIds: string[];
  destinationIds: string[];
  priceFrom: number;
  currency: "TRY" | "EUR" | "USD";
  durationDays: number;
  durationNights: number;
  departures: Localized<string[]>;
  transport: Localized;
  visa: Localized;
  route: Localized;
  tags: Localized<string[]>;
  featured: boolean;
  jollyUrl: string;
  itinerary: Localized<Array<{ day: string; title: string; text: string }>>;
  included: Localized<string[]>;
  excluded: Localized<string[]>;
  notes: Localized<string[]>;
  faqs: Localized<Array<{ question: string; answer: string }>>;
  dates: TourDate[];
};

export type LandingPage = {
  id: string;
  kind: "category" | "campaign" | "destination" | "info" | "legal" | "lead";
  slugs: Localized;
  title: Localized;
  summary: Localized;
  body: Localized<string[]>;
  image?: string;
  linkedTourIds?: string[];
  seoTitle?: Localized;
  seoDescription?: Localized;
};

export type BlogPost = {
  id: string;
  slugs: Localized;
  title: Localized;
  summary: Localized;
  body: Localized<string[]>;
  image: string;
  tags: Localized<string[]>;
};

export const categories: LandingPage[] = [
  {
    id: "domestic",
    kind: "category",
    slugs: {
      tr: "yurt-ici-turlari",
      en: "domestic-tours",
      de: "inlandsreisen",
      ru: "tury-po-strane",
    },
    title: {
      tr: "Yurt İçi Turları",
      en: "Domestic Tours",
      de: "Inlandsreisen",
      ru: "Туры по стране",
    },
    summary: {
      tr: "Karadeniz, Kapadokya, Ege ve kültür rotalarını danışman destekli keşfedin.",
      en: "Discover Black Sea, Cappadocia, Aegean and culture routes with consultant support.",
      de: "Entdecken Sie Schwarzmeer, Kappadokien, Ägäis und Kulturreisen mit Beratung.",
      ru: "Откройте Черное море, Каппадокию, Эгейские маршруты и культурные туры с поддержкой консультанта.",
    },
    body: {
      tr: [
        "Yurt içi turları, kısa tatillerden uzun kültür rotalarına kadar geniş bir karar alanı sunar.",
        "Bu sayfada kalkış şehri, süre, rota ve dönem bilgilerine göre hızlı seçim yapılabilir.",
      ],
      en: [
        "Domestic tours cover weekend breaks, cultural routes and longer regional programs.",
        "Use departure city, duration, route and season details to compare options quickly.",
      ],
      de: [
        "Inlandsreisen reichen von Wochenendtrips bis zu längeren Kulturprogrammen.",
        "Abfahrtsort, Dauer, Route und Saison helfen beim schnellen Vergleich.",
      ],
      ru: [
        "Туры по стране подходят для коротких поездок и насыщенных культурных маршрутов.",
        "Сравнивайте варианты по городу выезда, длительности, маршруту и сезону.",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "international",
    kind: "category",
    slugs: {
      tr: "yurt-disi-turlari",
      en: "international-tours",
      de: "auslandsreisen",
      ru: "zarubezhnye-tury",
    },
    title: {
      tr: "Yurt Dışı Turları",
      en: "International Tours",
      de: "Auslandsreisen",
      ru: "Зарубежные туры",
    },
    summary: {
      tr: "Avrupa, Balkanlar, Dubai ve uzak rotalar için planlı tur seçenekleri.",
      en: "Planned tour options for Europe, the Balkans, Dubai and further routes.",
      de: "Geplante Reiseoptionen für Europa, Balkan, Dubai und weitere Routen.",
      ru: "Организованные туры по Европе, Балканам, Дубаю и дальним направлениям.",
    },
    body: {
      tr: [
        "Yurt dışı turlarında vize, uçuş, konaklama ve rehberlik detaylarının açık görünmesi güveni artırır.",
        "Ön talep sonrası danışmanınız tarih ve müsaitlik için sizinle iletişime geçer.",
      ],
      en: [
        "International tours need clear visa, flight, accommodation and guide information.",
        "After your request, a consultant contacts you about dates and availability.",
      ],
      de: [
        "Bei Auslandsreisen sind Visum, Flug, Unterkunft und Reiseleitung besonders wichtig.",
        "Nach der Anfrage meldet sich ein Berater zu Terminen und Verfügbarkeit.",
      ],
      ru: [
        "Для зарубежных туров важны понятные условия визы, перелета, проживания и гида.",
        "После заявки консультант свяжется с вами по датам и наличию мест.",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "visa-free",
    kind: "category",
    slugs: {
      tr: "vizesiz-turlar",
      en: "visa-free-tours",
      de: "visafreie-reisen",
      ru: "bezvizovye-tury",
    },
    title: {
      tr: "Vizesiz Turlar",
      en: "Visa-Free Tours",
      de: "Visafreie Reisen",
      ru: "Безвизовые туры",
    },
    summary: {
      tr: "Vize süreciyle uğraşmadan hızlı karar verilebilecek popüler rotalar.",
      en: "Popular routes for faster decisions without a visa process.",
      de: "Beliebte Routen für schnelle Entscheidungen ohne Visaverfahren.",
      ru: "Популярные маршруты для быстрого выбора без визовой процедуры.",
    },
    body: {
      tr: [
        "Vizesiz turlar özellikle bayram ve kısa tatil dönemlerinde güçlü talep alır.",
        "Pasaport geçerliliği ve ülke giriş koşulları tur detayında ayrıca belirtilir.",
      ],
      en: [
        "Visa-free tours are especially popular during public holidays and short breaks.",
        "Passport validity and entry rules are shown in tour details.",
      ],
      de: [
        "Visafreie Reisen sind besonders an Feiertagen und Kurzurlauben beliebt.",
        "Passgültigkeit und Einreiseregeln stehen in den Reisedetails.",
      ],
      ru: [
        "Безвизовые туры особенно популярны на праздники и короткие каникулы.",
        "Срок действия паспорта и правила въезда указаны в деталях тура.",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "culture",
    kind: "category",
    slugs: {
      tr: "kultur-turlari",
      en: "culture-tours",
      de: "kulturreisen",
      ru: "kulturnye-tury",
    },
    title: {
      tr: "Kültür Turları",
      en: "Culture Tours",
      de: "Kulturreisen",
      ru: "Культурные туры",
    },
    summary: {
      tr: "Rehberli programlarla tarih, doğa ve şehir keşiflerini birleştiren rotalar.",
      en: "Guided routes combining history, nature and city discovery.",
      de: "Geführte Routen mit Geschichte, Natur und Stadterlebnis.",
      ru: "Маршруты с гидом, объединяющие историю, природу и города.",
    },
    body: {
      tr: ["Kültür turları rota anlatımı, gün gün program ve dahil/hariç detaylarıyla satışı güçlendirir."],
      en: ["Culture tours sell better with clear routing, daily programs and included/excluded details."],
      de: ["Kulturreisen überzeugen mit klarer Route, Tagesprogramm und Leistungsdetails."],
      ru: ["Культурные туры лучше продаются с понятным маршрутом, программой по дням и условиями."],
    },
  },
  {
    id: "cruise",
    kind: "category",
    slugs: {
      tr: "gemi-turlari",
      en: "cruise-tours",
      de: "kreuzfahrten",
      ru: "kruiznye-tury",
    },
    title: {
      tr: "Gemi Turları",
      en: "Cruise Tours",
      de: "Kreuzfahrten",
      ru: "Круизы",
    },
    summary: {
      tr: "Gemi, liman ve kabin detaylarıyla yönetilecek özel tur kategorisi.",
      en: "A dedicated category for ship, port and cabin-based tour offers.",
      de: "Eigene Kategorie für Schiff, Hafen und Kabinenangebote.",
      ru: "Отдельная категория для предложений по лайнерам, портам и каютам.",
    },
    body: {
      tr: ["Gemi turları için kabin tipi, liman programı ve ekstra ücretlerin net görünmesi gerekir."],
      en: ["Cruise tours need clear cabin type, port program and extra fee information."],
      de: ["Kreuzfahrten benötigen klare Angaben zu Kabine, Häfen und Zusatzkosten."],
      ru: ["Для круизов важны тип каюты, программа портов и дополнительные расходы."],
    },
  },
];

export const campaigns: LandingPage[] = [
  {
    id: "eid-adha",
    kind: "campaign",
    slugs: {
      tr: "kurban-bayrami-turlari",
      en: "eid-al-adha-tours",
      de: "opferfest-reisen",
      ru: "tury-na-kurban-bayram",
    },
    title: {
      tr: "Kurban Bayramı Turları",
      en: "Eid al-Adha Tours",
      de: "Reisen zum Opferfest",
      ru: "Туры на Курбан-байрам",
    },
    summary: {
      tr: "Bayram döneminde yüksek talep alan yurt içi, vizesiz ve yurt dışı rotaları.",
      en: "Domestic, visa-free and international routes with strong holiday demand.",
      de: "Inlands-, visafreie und Auslandsreisen mit hoher Feiertagsnachfrage.",
      ru: "Популярные внутренние, безвизовые и зарубежные маршруты на праздники.",
    },
    body: {
      tr: ["Bayram turlarında erken talep, kontenjan ve fiyat takibi satış başarısı için kritiktir."],
      en: ["Early requests, capacity and price tracking are critical for holiday tours."],
      de: ["Frühe Anfrage, Kontingent und Preisüberwachung sind für Feiertagsreisen wichtig."],
      ru: ["Ранние заявки, места и контроль цены критичны для праздничных туров."],
    },
  },
  {
    id: "early-booking",
    kind: "campaign",
    slugs: {
      tr: "erken-rezervasyon-turlari",
      en: "early-booking-tours",
      de: "fruehbucher-reisen",
      ru: "rannie-bronirovanie-turov",
    },
    title: {
      tr: "Erken Rezervasyon Turları",
      en: "Early Booking Tours",
      de: "Frühbucher-Reisen",
      ru: "Туры раннего бронирования",
    },
    summary: {
      tr: "Avantajlı dönemleri ve başlangıç fiyatlarını öne çıkaran kampanya sayfası.",
      en: "A campaign page highlighting early prices and favorable travel windows.",
      de: "Kampagnenseite mit Frühpreisen und passenden Reisezeiträumen.",
      ru: "Страница акции с выгодными периодами и стартовыми ценами.",
    },
    body: {
      tr: ["Erken rezervasyon sayfaları SEO ve reklam trafiği için yüksek değer taşır."],
      en: ["Early booking pages are valuable for SEO and paid traffic."],
      de: ["Frühbucherseiten sind wertvoll für SEO und Anzeigenverkehr."],
      ru: ["Страницы раннего бронирования важны для SEO и рекламы."],
    },
  },
  {
    id: "summer",
    kind: "campaign",
    slugs: {
      tr: "yaz-turlari",
      en: "summer-tours",
      de: "sommerreisen",
      ru: "letnie-tury",
    },
    title: {
      tr: "Yaz Turları",
      en: "Summer Tours",
      de: "Sommerreisen",
      ru: "Летние туры",
    },
    summary: {
      tr: "Deniz, şehir, kültür ve vizesiz yaz rotaları.",
      en: "Beach, city, culture and visa-free summer routes.",
      de: "Strand-, Stadt-, Kultur- und visafreie Sommerrouten.",
      ru: "Пляжные, городские, культурные и безвизовые летние маршруты.",
    },
    body: {
      tr: ["Yaz turları için görsel, dönem ve aile uygunluğu bilgileri öne çıkarılmalıdır."],
      en: ["Summer tours should highlight visuals, period and family suitability."],
      de: ["Sommerreisen sollten Bilder, Saison und Familientauglichkeit zeigen."],
      ru: ["Летние туры должны показывать визуал, сезон и удобство для семей."],
    },
  },
  {
    id: "semester",
    kind: "campaign",
    slugs: {
      tr: "somestir-turlari",
      en: "semester-break-tours",
      de: "semesterferien-reisen",
      ru: "tury-na-kanikuly",
    },
    title: {
      tr: "Sömestir Turları",
      en: "Semester Break Tours",
      de: "Semesterferien-Reisen",
      ru: "Туры на каникулы",
    },
    summary: {
      tr: "Ailelere, kısa tatillere ve kış rotalarına uygun dönem turları.",
      en: "Seasonal tours for families, short breaks and winter routes.",
      de: "Saisonreisen für Familien, Kurzurlaub und Winterrouten.",
      ru: "Сезонные туры для семей, короткого отдыха и зимних маршрутов.",
    },
    body: {
      tr: ["Sömestir turları aile ve çocuk uygunluğu bilgileriyle daha net karar aldırır."],
      en: ["Semester tours need family and child suitability details."],
      de: ["Semesterreisen brauchen Familien- und Kinderhinweise."],
      ru: ["Для туров на каникулы важна информация для семей и детей."],
    },
  },
  {
    id: "weekend",
    kind: "campaign",
    slugs: {
      tr: "hafta-sonu-turlari",
      en: "weekend-tours",
      de: "wochenendreisen",
      ru: "tury-na-vyhodnye",
    },
    title: {
      tr: "Hafta Sonu Turları",
      en: "Weekend Tours",
      de: "Wochenendreisen",
      ru: "Туры на выходные",
    },
    summary: {
      tr: "Kısa süreli, hızlı karar verilebilen kaçamak rotaları.",
      en: "Short, easy-to-decide getaway routes.",
      de: "Kurze Routen für schnelle Wochenendentscheidungen.",
      ru: "Короткие маршруты для быстрых решений на выходные.",
    },
    body: {
      tr: ["Hafta sonu turlarında kalkış noktası, saat ve dönüş bilgisi ilk ekranda görünmelidir."],
      en: ["Weekend tours should show departure point, time and return info upfront."],
      de: ["Wochenendreisen sollten Abfahrt, Uhrzeit und Rückkehr früh zeigen."],
      ru: ["Для туров выходного дня важны место выезда, время и возвращение."],
    },
  },
];

export const destinations: LandingPage[] = [
  {
    id: "black-sea",
    kind: "destination",
    slugs: {
      tr: "karadeniz-turlari",
      en: "black-sea-tours",
      de: "schwarzmeer-reisen",
      ru: "tury-po-chernomu-moryu",
    },
    title: {
      tr: "Karadeniz Turları",
      en: "Black Sea Tours",
      de: "Schwarzmeer-Reisen",
      ru: "Туры по Черному морю",
    },
    summary: {
      tr: "Yaylalar, doğa, yöresel lezzetler ve uzun rotalı kültür programları.",
      en: "Plateaus, nature, local tastes and long culture routes.",
      de: "Hochebenen, Natur, regionale Küche und längere Kulturrouten.",
      ru: "Плато, природа, местная кухня и длинные культурные маршруты.",
    },
    body: {
      tr: ["Karadeniz turları için yayla geçişleri, konaklama bölgeleri ve mevsim bilgisi önemlidir."],
      en: ["Black Sea tours rely on plateau access, accommodation areas and season information."],
      de: ["Schwarzmeerreisen brauchen Hinweise zu Hochebenen, Unterkunft und Saison."],
      ru: ["Для Черного моря важны плато, районы проживания и сезон."],
    },
  },
  {
    id: "cappadocia",
    kind: "destination",
    slugs: {
      tr: "kapadokya-turlari",
      en: "cappadocia-tours",
      de: "kappadokien-reisen",
      ru: "tury-v-kappadokiyu",
    },
    title: {
      tr: "Kapadokya Turları",
      en: "Cappadocia Tours",
      de: "Kappadokien-Reisen",
      ru: "Туры в Каппадокию",
    },
    summary: {
      tr: "Balon manzaraları, vadiler ve kültür duraklarıyla güçlü hafta sonu rotası.",
      en: "A strong weekend route with balloon views, valleys and cultural stops.",
      de: "Starke Wochenendroute mit Ballonblick, Tälern und Kulturstopps.",
      ru: "Сильный маршрут выходного дня с шарами, долинами и культурными точками.",
    },
    body: {
      tr: ["Kapadokya turlarında balon opsiyonu, otel tipi ve hareket saati kararı etkiler."],
      en: ["Balloon options, hotel type and departure time influence Cappadocia decisions."],
      de: ["Ballonoption, Hoteltyp und Abfahrtszeit beeinflussen die Entscheidung."],
      ru: ["Опция шара, тип отеля и время выезда влияют на выбор Каппадокии."],
    },
  },
  {
    id: "balkans",
    kind: "destination",
    slugs: {
      tr: "balkan-turlari",
      en: "balkan-tours",
      de: "balkan-reisen",
      ru: "balkanskie-tury",
    },
    title: {
      tr: "Balkan Turları",
      en: "Balkan Tours",
      de: "Balkan-Reisen",
      ru: "Балканские туры",
    },
    summary: {
      tr: "Vizesiz ülke geçişleri, şehirler ve kültür programlarıyla popüler rota.",
      en: "Popular route with visa-free border crossings, cities and culture programs.",
      de: "Beliebte Route mit visafreien Grenzübertritten, Städten und Kultur.",
      ru: "Популярный маршрут с безвизовыми переездами, городами и культурой.",
    },
    body: {
      tr: ["Balkan turlarında ülke sırası, sınır geçişleri ve pasaport koşulları net gösterilmelidir."],
      en: ["Balkan tours should clearly show country order, border crossings and passport rules."],
      de: ["Balkanreisen sollten Länderfolge, Grenzen und Passregeln klar zeigen."],
      ru: ["Балканские туры должны ясно показывать страны, границы и паспортные правила."],
    },
  },
  {
    id: "italy",
    kind: "destination",
    slugs: {
      tr: "italya-turlari",
      en: "italy-tours",
      de: "italien-reisen",
      ru: "tury-v-italiyu",
    },
    title: {
      tr: "İtalya Turları",
      en: "Italy Tours",
      de: "Italien-Reisen",
      ru: "Туры в Италию",
    },
    summary: {
      tr: "Roma, Floransa, Venedik ve klasik Avrupa kültür rotaları.",
      en: "Rome, Florence, Venice and classic European culture routes.",
      de: "Rom, Florenz, Venedig und klassische europäische Kulturrouten.",
      ru: "Рим, Флоренция, Венеция и классические европейские маршруты.",
    },
    body: {
      tr: ["İtalya turlarında vize, uçuş ve otel lokasyonu karar sürecinde kritik rol oynar."],
      en: ["Visa, flight and hotel location are key decision factors for Italy tours."],
      de: ["Visum, Flug und Hotellage sind zentrale Faktoren für Italienreisen."],
      ru: ["Виза, перелет и расположение отеля важны для туров в Италию."],
    },
  },
  {
    id: "dubai",
    kind: "destination",
    slugs: {
      tr: "dubai-turlari",
      en: "dubai-tours",
      de: "dubai-reisen",
      ru: "tury-v-dubai",
    },
    title: {
      tr: "Dubai Turları",
      en: "Dubai Tours",
      de: "Dubai-Reisen",
      ru: "Туры в Дубай",
    },
    summary: {
      tr: "Şehir, alışveriş, çöl safarisi ve modern deneyim odaklı programlar.",
      en: "City, shopping, desert safari and modern experience-focused programs.",
      de: "Programme mit Stadt, Shopping, Wüstensafari und modernen Erlebnissen.",
      ru: "Программы с городом, шопингом, сафари и современными впечатлениями.",
    },
    body: {
      tr: ["Dubai turlarında otel bölgesi, uçuş saati ve opsiyonel aktiviteler öne çıkar."],
      en: ["Hotel area, flight time and optional activities stand out for Dubai tours."],
      de: ["Hotelregion, Flugzeit und optionale Aktivitäten sind bei Dubai wichtig."],
      ru: ["Для Дубая важны район отеля, время рейса и дополнительные активности."],
    },
  },
];

export const tours: Tour[] = [
  {
    id: "black-sea-dream",
    slugs: {
      tr: "karadeniz-ruyasi-turu",
      en: "black-sea-dream-tour",
      de: "schwarzmeer-traumreise",
      ru: "tur-mechta-chernogo-morya",
    },
    title: {
      tr: "Karadeniz Rüyası Turu",
      en: "Black Sea Dream Tour",
      de: "Schwarzmeer-Traumreise",
      ru: "Тур Мечта Черного моря",
    },
    summary: {
      tr: "Yaylalar, şehir durakları ve yöresel lezzetlerle kapsamlı Karadeniz programı.",
      en: "A complete Black Sea program with plateaus, cities and local tastes.",
      de: "Komplettes Schwarzmeerprogramm mit Hochebenen, Städten und regionaler Küche.",
      ru: "Полная программа Черного моря с плато, городами и местной кухней.",
    },
    description: {
      tr: "Karadeniz'in doğa, kültür ve lezzet duraklarını planlı bir programla keşfetmek isteyenler için tasarlandı.",
      en: "Designed for travelers who want to explore Black Sea nature, culture and flavors in a planned program.",
      de: "Für Reisende, die Natur, Kultur und Küche des Schwarzmeers geplant erleben möchten.",
      ru: "Для тех, кто хочет увидеть природу, культуру и вкусы Черного моря в организованной программе.",
    },
    image:
      "https://images.unsplash.com/photo-1590103514966-8f7a4ee32937?auto=format&fit=crop&w=1400&q=80",
    categoryIds: ["domestic", "culture"],
    campaignIds: ["summer", "eid-adha"],
    destinationIds: ["black-sea"],
    priceFrom: 18990,
    currency: "TRY",
    durationDays: 6,
    durationNights: 5,
    departures: {
      tr: ["İstanbul", "Ankara"],
      en: ["Istanbul", "Ankara"],
      de: ["Istanbul", "Ankara"],
      ru: ["Стамбул", "Анкара"],
    },
    transport: { tr: "Otobüs", en: "Coach", de: "Bus", ru: "Автобус" },
    visa: { tr: "Vize yok", en: "No visa", de: "Kein Visum", ru: "Без визы" },
    route: {
      tr: "Trabzon, Rize, Ayder, Uzungöl",
      en: "Trabzon, Rize, Ayder, Uzungol",
      de: "Trabzon, Rize, Ayder, Uzungöl",
      ru: "Трабзон, Ризе, Айдер, Узунгель",
    },
    tags: {
      tr: ["Popüler", "Yaz", "Kültür"],
      en: ["Popular", "Summer", "Culture"],
      de: ["Beliebt", "Sommer", "Kultur"],
      ru: ["Популярно", "Лето", "Культура"],
    },
    featured: true,
    jollyUrl: "https://www.jollytur.com/",
    itinerary: {
      tr: [
        { day: "1. Gün", title: "Trabzon", text: "Şehir turu, Atatürk Köşkü ve sahil molaları." },
        { day: "2. Gün", title: "Uzungöl", text: "Doğa yürüyüşleri ve göl çevresi keşfi." },
        { day: "3. Gün", title: "Ayder Yaylası", text: "Yayla atmosferi, yöresel lezzetler ve serbest zaman." },
      ],
      en: [
        { day: "Day 1", title: "Trabzon", text: "City tour, Ataturk Mansion and coastal stops." },
        { day: "Day 2", title: "Uzungol", text: "Nature walks and lakeside discovery." },
        { day: "Day 3", title: "Ayder Plateau", text: "Plateau atmosphere, local tastes and free time." },
      ],
      de: [
        { day: "Tag 1", title: "Trabzon", text: "Stadtrundfahrt, Atatürk-Haus und Küstenstopps." },
        { day: "Tag 2", title: "Uzungöl", text: "Naturspaziergänge und Entdeckung am See." },
        { day: "Tag 3", title: "Ayder-Hochebene", text: "Hochebenenflair, regionale Küche und Freizeit." },
      ],
      ru: [
        { day: "День 1", title: "Трабзон", text: "Обзор города, особняк Ататюрка и остановки у моря." },
        { day: "День 2", title: "Узунгель", text: "Прогулки на природе и озеро." },
        { day: "День 3", title: "Плато Айдер", text: "Атмосфера плато, местная кухня и свободное время." },
      ],
    },
    included: {
      tr: ["Ulaşım", "Konaklama", "Rehberlik", "Programdaki çevre gezileri"],
      en: ["Transport", "Accommodation", "Guiding", "Listed excursions"],
      de: ["Transport", "Unterkunft", "Reiseleitung", "Ausflüge laut Programm"],
      ru: ["Транспорт", "Проживание", "Гид", "Экскурсии по программе"],
    },
    excluded: {
      tr: ["Kişisel harcamalar", "Müze girişleri", "Ekstra turlar"],
      en: ["Personal expenses", "Museum entrances", "Optional tours"],
      de: ["Persönliche Ausgaben", "Museumseintritte", "Optionale Touren"],
      ru: ["Личные расходы", "Входы в музеи", "Дополнительные туры"],
    },
    notes: {
      tr: ["Yayla geçişleri hava koşullarına göre değişebilir.", "Nihai fiyat ve müsaitlik Jolly tarafında güncellenebilir."],
      en: ["Plateau access may change depending on weather.", "Final price and availability may be updated on Jolly."],
      de: ["Hochebenen-Zugänge können wetterbedingt geändert werden.", "Endpreis und Verfügbarkeit können bei Jolly aktualisiert werden."],
      ru: ["Доступ к плато может меняться по погоде.", "Финальная цена и наличие мест могут обновляться на Jolly."],
    },
    faqs: {
      tr: [{ question: "Kimler için uygun?", answer: "Doğa, kültür ve yöresel lezzetleri birlikte görmek isteyenler için uygundur." }],
      en: [{ question: "Who is it suitable for?", answer: "For travelers seeking nature, culture and local tastes together." }],
      de: [{ question: "Für wen geeignet?", answer: "Für Reisende, die Natur, Kultur und regionale Küche verbinden möchten." }],
      ru: [{ question: "Кому подходит?", answer: "Тем, кто хочет совместить природу, культуру и местные вкусы." }],
    },
    dates: [
      { start: "2026-06-12", end: "2026-06-17", price: 18990, currency: "TRY", availability: { tr: "Müsait", en: "Available", de: "Verfügbar", ru: "Есть места" } },
      { start: "2026-07-03", end: "2026-07-08", price: 20990, currency: "TRY", availability: { tr: "Son kontenjan", en: "Limited", de: "Wenige Plätze", ru: "Мало мест" } },
    ],
  },
  {
    id: "cappadocia-culture",
    slugs: {
      tr: "kapadokya-kultur-turu",
      en: "cappadocia-culture-tour",
      de: "kappadokien-kulturreise",
      ru: "kulturnyy-tur-v-kappadokiyu",
    },
    title: { tr: "Kapadokya Kültür Turu", en: "Cappadocia Culture Tour", de: "Kappadokien-Kulturreise", ru: "Культурный тур в Каппадокию" },
    summary: { tr: "Vadiler, peri bacaları ve opsiyonel balon deneyimiyle kısa kültür rotası.", en: "A short culture route with valleys, fairy chimneys and optional balloon experience.", de: "Kurze Kulturroute mit Tälern, Feenkaminen und optionalem Ballon.", ru: "Короткий культурный маршрут с долинами, скалами и опцией шара." },
    description: { tr: "Hafta sonu kaçamağı ve ilk kez Kapadokya görecek misafirler için uygun yoğun program.", en: "A compact program for weekend travelers and first-time Cappadocia visitors.", de: "Kompaktes Programm für Wochenendgäste und Erstbesucher.", ru: "Компактная программа для выходных и первого знакомства с Каппадокией." },
    image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=80",
    categoryIds: ["domestic", "culture"],
    campaignIds: ["weekend", "semester"],
    destinationIds: ["cappadocia"],
    priceFrom: 9990,
    currency: "TRY",
    durationDays: 3,
    durationNights: 2,
    departures: { tr: ["İstanbul", "Ankara"], en: ["Istanbul", "Ankara"], de: ["Istanbul", "Ankara"], ru: ["Стамбул", "Анкара"] },
    transport: { tr: "Otobüs / Uçak", en: "Coach / Flight", de: "Bus / Flug", ru: "Автобус / рейс" },
    visa: { tr: "Vize yok", en: "No visa", de: "Kein Visum", ru: "Без визы" },
    route: { tr: "Göreme, Avanos, Ürgüp", en: "Goreme, Avanos, Urgup", de: "Göreme, Avanos, Ürgüp", ru: "Гёреме, Аванос, Ургюп" },
    tags: { tr: ["Hafta Sonu", "Kültür"], en: ["Weekend", "Culture"], de: ["Wochenende", "Kultur"], ru: ["Выходные", "Культура"] },
    featured: true,
    jollyUrl: "https://www.jollytur.com/",
    itinerary: {
      tr: [{ day: "1. Gün", title: "Göreme", text: "Açık hava müzesi ve vadiler." }, { day: "2. Gün", title: "Avanos", text: "Çömlek atölyesi ve şehir keşfi." }],
      en: [{ day: "Day 1", title: "Goreme", text: "Open-air museum and valleys." }, { day: "Day 2", title: "Avanos", text: "Pottery workshop and town discovery." }],
      de: [{ day: "Tag 1", title: "Göreme", text: "Freilichtmuseum und Täler." }, { day: "Tag 2", title: "Avanos", text: "Töpferei und Stadterkundung." }],
      ru: [{ day: "День 1", title: "Гёреме", text: "Музей под открытым небом и долины." }, { day: "День 2", title: "Аванос", text: "Гончарная мастерская и город." }],
    },
    included: { tr: ["Konaklama", "Rehberlik", "Program gezileri"], en: ["Accommodation", "Guiding", "Program tours"], de: ["Unterkunft", "Reiseleitung", "Programmausflüge"], ru: ["Проживание", "Гид", "Экскурсии"] },
    excluded: { tr: ["Balon turu", "Kişisel harcamalar"], en: ["Balloon ride", "Personal expenses"], de: ["Ballonfahrt", "Persönliche Ausgaben"], ru: ["Полет на шаре", "Личные расходы"] },
    notes: { tr: ["Balon uçuşu hava koşullarına bağlıdır."], en: ["Balloon flights depend on weather."], de: ["Ballonflüge sind wetterabhängig."], ru: ["Полет на шаре зависит от погоды."] },
    faqs: { tr: [{ question: "Balon dahil mi?", answer: "Hayır, opsiyonel olarak talep edilir." }], en: [{ question: "Is balloon included?", answer: "No, it is optional." }], de: [{ question: "Ist der Ballon inklusive?", answer: "Nein, optional." }], ru: [{ question: "Шар включен?", answer: "Нет, это опция." }] },
    dates: [{ start: "2026-05-16", end: "2026-05-18", price: 9990, currency: "TRY", availability: { tr: "Müsait", en: "Available", de: "Verfügbar", ru: "Есть места" } }],
  },
  {
    id: "balkan-visa-free",
    slugs: { tr: "vizesiz-balkan-turu", en: "visa-free-balkan-tour", de: "visafreie-balkanreise", ru: "bezvizovyy-balkanskiy-tur" },
    title: { tr: "Vizesiz Balkan Turu", en: "Visa-Free Balkan Tour", de: "Visafreie Balkanreise", ru: "Безвизовый балканский тур" },
    summary: { tr: "Ülke geçişli, kültür yoğun ve vizesiz Balkan rotası.", en: "A visa-free Balkan route with country crossings and culture stops.", de: "Visafreie Balkanroute mit Länderwechseln und Kulturstopps.", ru: "Безвизовый балканский маршрут с переездами и культурой." },
    description: { tr: "Balkanların popüler şehirlerini tek programda görmek isteyenler için planlandı.", en: "Planned for travelers who want to see the Balkans' popular cities in one program.", de: "Für Reisende, die beliebte Balkanstädte in einem Programm sehen möchten.", ru: "Для тех, кто хочет увидеть популярные города Балкан за одну поездку." },
    image: "https://images.unsplash.com/photo-1523592121529-f6dde35f079e?auto=format&fit=crop&w=1400&q=80",
    categoryIds: ["international", "visa-free", "culture"],
    campaignIds: ["eid-adha", "early-booking"],
    destinationIds: ["balkans"],
    priceFrom: 699,
    currency: "EUR",
    durationDays: 7,
    durationNights: 6,
    departures: { tr: ["İstanbul"], en: ["Istanbul"], de: ["Istanbul"], ru: ["Стамбул"] },
    transport: { tr: "Uçak + Otobüs", en: "Flight + Coach", de: "Flug + Bus", ru: "Рейс + автобус" },
    visa: { tr: "Vizesiz", en: "Visa-free", de: "Visafrei", ru: "Без визы" },
    route: { tr: "Üsküp, Ohrid, Tiran, Budva", en: "Skopje, Ohrid, Tirana, Budva", de: "Skopje, Ohrid, Tirana, Budva", ru: "Скопье, Охрид, Тирана, Будва" },
    tags: { tr: ["Vizesiz", "Bayram Özel"], en: ["Visa-Free", "Holiday"], de: ["Visafrei", "Feiertag"], ru: ["Без визы", "Праздник"] },
    featured: true,
    jollyUrl: "https://www.jollytur.com/",
    itinerary: {
      tr: [{ day: "1. Gün", title: "Üsküp", text: "Şehir merkezi ve tarihi çarşı." }, { day: "2. Gün", title: "Ohrid", text: "Göl kıyısı, kiliseler ve serbest zaman." }],
      en: [{ day: "Day 1", title: "Skopje", text: "City center and old bazaar." }, { day: "Day 2", title: "Ohrid", text: "Lake shore, churches and free time." }],
      de: [{ day: "Tag 1", title: "Skopje", text: "Stadtzentrum und alter Basar." }, { day: "Tag 2", title: "Ohrid", text: "Seeufer, Kirchen und Freizeit." }],
      ru: [{ day: "День 1", title: "Скопье", text: "Центр города и старый рынок." }, { day: "День 2", title: "Охрид", text: "Озеро, церкви и свободное время." }],
    },
    included: { tr: ["Uçak bileti", "Konaklama", "Rehberlik"], en: ["Flights", "Accommodation", "Guiding"], de: ["Flüge", "Unterkunft", "Reiseleitung"], ru: ["Авиабилеты", "Проживание", "Гид"] },
    excluded: { tr: ["Yurt dışı çıkış harcı", "Ekstra turlar"], en: ["International departure fee", "Optional tours"], de: ["Ausreisegebühr", "Optionale Touren"], ru: ["Сбор за выезд", "Дополнительные туры"] },
    notes: { tr: ["Pasaport geçerliliği kontrol edilmelidir."], en: ["Passport validity should be checked."], de: ["Passgültigkeit sollte geprüft werden."], ru: ["Проверьте срок действия паспорта."] },
    faqs: { tr: [{ question: "Vize gerekiyor mu?", answer: "Program vizesiz ülke geçişleriyle hazırlanmıştır." }], en: [{ question: "Is a visa required?", answer: "The program is built around visa-free crossings." }], de: [{ question: "Ist ein Visum nötig?", answer: "Das Programm nutzt visafreie Übergänge." }], ru: [{ question: "Нужна ли виза?", answer: "Программа построена на безвизовых переходах." }] },
    dates: [{ start: "2026-06-22", end: "2026-06-28", price: 699, currency: "EUR", availability: { tr: "Müsait", en: "Available", de: "Verfügbar", ru: "Есть места" } }],
  },
  {
    id: "italy-classics",
    slugs: { tr: "italya-klasikleri-turu", en: "italy-classics-tour", de: "italien-klassiker-reise", ru: "klassicheskaya-italiya" },
    title: { tr: "İtalya Klasikleri Turu", en: "Italy Classics Tour", de: "Italien Klassiker-Reise", ru: "Классическая Италия" },
    summary: { tr: "Roma, Floransa ve Venedik hattında klasik Avrupa deneyimi.", en: "A classic European experience across Rome, Florence and Venice.", de: "Klassisches Europa-Erlebnis in Rom, Florenz und Venedig.", ru: "Классическая Европа: Рим, Флоренция и Венеция." },
    description: { tr: "İlk kez İtalya görecek misafirler için dengeli şehir ve kültür programı.", en: "A balanced city and culture program for first-time Italy travelers.", de: "Ausgewogenes Stadt- und Kulturprogramm für Italien-Neulinge.", ru: "Сбалансированная городская и культурная программа для первой Италии." },
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80",
    categoryIds: ["international", "culture"],
    campaignIds: ["early-booking", "summer"],
    destinationIds: ["italy"],
    priceFrom: 899,
    currency: "EUR",
    durationDays: 6,
    durationNights: 5,
    departures: { tr: ["İstanbul", "İzmir"], en: ["Istanbul", "Izmir"], de: ["Istanbul", "Izmir"], ru: ["Стамбул", "Измир"] },
    transport: { tr: "Uçak", en: "Flight", de: "Flug", ru: "Рейс" },
    visa: { tr: "Schengen", en: "Schengen", de: "Schengen", ru: "Шенген" },
    route: { tr: "Roma, Floransa, Venedik", en: "Rome, Florence, Venice", de: "Rom, Florenz, Venedig", ru: "Рим, Флоренция, Венеция" },
    tags: { tr: ["Erken Rezervasyon", "Avrupa"], en: ["Early Booking", "Europe"], de: ["Frühbucher", "Europa"], ru: ["Раннее бронирование", "Европа"] },
    featured: true,
    jollyUrl: "https://www.jollytur.com/",
    itinerary: {
      tr: [{ day: "1. Gün", title: "Roma", text: "Antik şehir turu ve serbest zaman." }, { day: "3. Gün", title: "Floransa", text: "Rönesans durakları ve şehir merkezi." }],
      en: [{ day: "Day 1", title: "Rome", text: "Ancient city tour and free time." }, { day: "Day 3", title: "Florence", text: "Renaissance stops and city center." }],
      de: [{ day: "Tag 1", title: "Rom", text: "Antike Stadt und Freizeit." }, { day: "Tag 3", title: "Florenz", text: "Renaissance-Stopps und Zentrum." }],
      ru: [{ day: "День 1", title: "Рим", text: "Античный город и свободное время." }, { day: "День 3", title: "Флоренция", text: "Ренессанс и центр города." }],
    },
    included: { tr: ["Uçak bileti", "Konaklama", "Rehberlik"], en: ["Flights", "Accommodation", "Guiding"], de: ["Flüge", "Unterkunft", "Reiseleitung"], ru: ["Авиабилеты", "Проживание", "Гид"] },
    excluded: { tr: ["Vize ücreti", "Şehir vergileri", "Ekstra turlar"], en: ["Visa fee", "City taxes", "Optional tours"], de: ["Visagebühr", "City Tax", "Optionale Touren"], ru: ["Виза", "Городские налоги", "Доп. туры"] },
    notes: { tr: ["Schengen vize süreci danışman tarafından ayrıca anlatılır."], en: ["Schengen visa process is explained separately by the consultant."], de: ["Der Schengen-Prozess wird separat erklärt."], ru: ["Процесс Шенгена объяснит консультант."] },
    faqs: { tr: [{ question: "Vize desteği var mı?", answer: "Danışmanlık sürecinde evrak listesi paylaşılır." }], en: [{ question: "Is visa support available?", answer: "Document lists are shared during consultation." }], de: [{ question: "Gibt es Visa-Hilfe?", answer: "Dokumentenlisten werden in der Beratung geteilt." }], ru: [{ question: "Есть помощь по визе?", answer: "Список документов передается при консультации." }] },
    dates: [{ start: "2026-09-10", end: "2026-09-15", price: 899, currency: "EUR", availability: { tr: "Müsait", en: "Available", de: "Verfügbar", ru: "Есть места" } }],
  },
  {
    id: "dubai-abu-dhabi",
    slugs: { tr: "dubai-abu-dabi-turu", en: "dubai-abu-dhabi-tour", de: "dubai-abu-dhabi-reise", ru: "tur-dubai-abu-dabi" },
    title: { tr: "Dubai & Abu Dabi Turu", en: "Dubai & Abu Dhabi Tour", de: "Dubai & Abu Dhabi Reise", ru: "Тур Дубай и Абу-Даби" },
    summary: { tr: "Modern şehir, çöl safarisi ve Abu Dabi gezi programı.", en: "Modern city, desert safari and Abu Dhabi sightseeing program.", de: "Moderne Stadt, Wüstensafari und Abu Dhabi Programm.", ru: "Современный город, сафари и программа Абу-Даби." },
    description: { tr: "Şehir deneyimi, alışveriş ve modern mimariyi birlikte isteyen misafirler için.", en: "For guests seeking city experience, shopping and modern architecture together.", de: "Für Gäste, die Stadt, Shopping und moderne Architektur möchten.", ru: "Для тех, кто хочет город, шопинг и современную архитектуру." },
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    categoryIds: ["international"],
    campaignIds: ["early-booking", "summer"],
    destinationIds: ["dubai"],
    priceFrom: 799,
    currency: "USD",
    durationDays: 5,
    durationNights: 4,
    departures: { tr: ["İstanbul"], en: ["Istanbul"], de: ["Istanbul"], ru: ["Стамбул"] },
    transport: { tr: "Uçak", en: "Flight", de: "Flug", ru: "Рейс" },
    visa: { tr: "Koşula bağlı", en: "Conditional", de: "Bedingt", ru: "По условиям" },
    route: { tr: "Dubai, Abu Dabi", en: "Dubai, Abu Dhabi", de: "Dubai, Abu Dhabi", ru: "Дубай, Абу-Даби" },
    tags: { tr: ["Popüler", "Şehir"], en: ["Popular", "City"], de: ["Beliebt", "Stadt"], ru: ["Популярно", "Город"] },
    featured: false,
    jollyUrl: "https://www.jollytur.com/",
    itinerary: {
      tr: [{ day: "1. Gün", title: "Dubai", text: "Varış ve şehir panoraması." }, { day: "2. Gün", title: "Çöl Safarisi", text: "Opsiyonel çöl deneyimi." }],
      en: [{ day: "Day 1", title: "Dubai", text: "Arrival and city panorama." }, { day: "Day 2", title: "Desert Safari", text: "Optional desert experience." }],
      de: [{ day: "Tag 1", title: "Dubai", text: "Ankunft und Stadtpanorama." }, { day: "Tag 2", title: "Wüstensafari", text: "Optionales Wüstenerlebnis." }],
      ru: [{ day: "День 1", title: "Дубай", text: "Прибытие и панорама города." }, { day: "День 2", title: "Сафари", text: "Опциональное сафари." }],
    },
    included: { tr: ["Uçak bileti", "Konaklama", "Transfer"], en: ["Flights", "Accommodation", "Transfers"], de: ["Flüge", "Unterkunft", "Transfers"], ru: ["Авиабилеты", "Проживание", "Трансферы"] },
    excluded: { tr: ["Ekstra turlar", "Kişisel harcamalar"], en: ["Optional tours", "Personal expenses"], de: ["Optionale Touren", "Persönliche Ausgaben"], ru: ["Доп. туры", "Личные расходы"] },
    notes: { tr: ["Pasaport ve giriş koşulları danışmanla kontrol edilmelidir."], en: ["Passport and entry rules should be checked with the consultant."], de: ["Pass und Einreisebedingungen mit Berater prüfen."], ru: ["Паспорт и правила въезда проверьте с консультантом."] },
    faqs: { tr: [{ question: "Çöl safarisi dahil mi?", answer: "Opsiyonel olarak sunulur." }], en: [{ question: "Is desert safari included?", answer: "It is offered as optional." }], de: [{ question: "Ist Wüstensafari inklusive?", answer: "Optional erhältlich." }], ru: [{ question: "Сафари включено?", answer: "Предлагается как опция." }] },
    dates: [{ start: "2026-08-20", end: "2026-08-24", price: 799, currency: "USD", availability: { tr: "Müsait", en: "Available", de: "Verfügbar", ru: "Есть места" } }],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "visa-free-countries",
    slugs: { tr: "vizesiz-gidilebilecek-ulkeler", en: "visa-free-countries", de: "visafreie-laender", ru: "bezvizovye-strany" },
    title: { tr: "Vizesiz Gidilebilecek Ülkeler", en: "Visa-Free Countries", de: "Visafreie Länder", ru: "Безвизовые страны" },
    summary: { tr: "Vizesiz tur seçerken pasaport, süre ve giriş koşullarına dikkat edin.", en: "Check passport, duration and entry rules when choosing visa-free tours.", de: "Achten Sie auf Pass, Dauer und Einreiseregeln.", ru: "Проверяйте паспорт, срок и правила въезда." },
    body: {
      tr: ["Vizesiz rotalar hızlı karar için avantajlıdır ancak pasaport geçerliliği ve ülke giriş koşulları mutlaka kontrol edilmelidir.", "Ön talep bıraktığınızda danışmanınız güncel koşulları sizinle paylaşır."],
      en: ["Visa-free routes are easier to decide on, but passport validity and entry rules must be checked.", "When you submit a request, your consultant shares current conditions."],
      de: ["Visafreie Routen erleichtern Entscheidungen, aber Passgültigkeit und Einreiseregeln müssen geprüft werden.", "Nach Ihrer Anfrage teilt der Berater aktuelle Bedingungen."],
      ru: ["Безвизовые маршруты удобны для быстрого решения, но паспорт и правила въезда нужно проверять.", "После заявки консультант поделится актуальными условиями."],
    },
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
    tags: { tr: ["Vizesiz", "Rehber"], en: ["Visa-Free", "Guide"], de: ["Visafrei", "Ratgeber"], ru: ["Без визы", "Гид"] },
  },
  {
    id: "holiday-where",
    slugs: { tr: "bayram-tatilinde-nereye-gidilir", en: "where-to-go-on-public-holidays", de: "wohin-an-feiertagen-reisen", ru: "kuda-poehat-na-prazdniki" },
    title: { tr: "Bayram Tatilinde Nereye Gidilir?", en: "Where to Go on Public Holidays?", de: "Wohin an Feiertagen reisen?", ru: "Куда поехать на праздники?" },
    summary: { tr: "Bayram döneminde kontenjan, rota yoğunluğu ve ulaşım türü karar verir.", en: "Capacity, route density and transport type shape holiday decisions.", de: "Kontingent, Routendichte und Transport prägen Feiertagsreisen.", ru: "Места, насыщенность маршрута и транспорт влияют на выбор." },
    body: {
      tr: ["Bayram tatillerinde erken karar almak fiyat ve kontenjan açısından önemlidir.", "Kısa tatil için hafta sonu rotaları, uzun tatil için yurt dışı ve kültür turları öne çıkar."],
      en: ["Early decisions matter for price and capacity during holidays.", "Weekend routes suit short breaks, while international and culture tours suit longer holidays."],
      de: ["Frühe Entscheidungen sind an Feiertagen für Preis und Plätze wichtig.", "Kurzreisen passen zu Wochenenden, Auslands- und Kulturreisen zu längeren Ferien."],
      ru: ["На праздники раннее решение важно для цены и мест.", "Коротким каникулам подходят выходные маршруты, длинным - зарубежные и культурные туры."],
    },
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    tags: { tr: ["Bayram", "Planlama"], en: ["Holiday", "Planning"], de: ["Feiertag", "Planung"], ru: ["Праздник", "Планирование"] },
  },
  {
    id: "black-sea-season",
    slugs: { tr: "karadeniz-turu-icin-en-iyi-donem", en: "best-time-for-black-sea-tour", de: "beste-zeit-fuer-schwarzmeerreise", ru: "luchshee-vremya-dlya-chernogo-morya" },
    title: { tr: "Karadeniz Turu İçin En İyi Dönem", en: "Best Time for a Black Sea Tour", de: "Beste Zeit für eine Schwarzmeerreise", ru: "Лучшее время для Черного моря" },
    summary: { tr: "Yaylalar ve hava koşulları Karadeniz seçimini doğrudan etkiler.", en: "Plateaus and weather directly shape Black Sea tour decisions.", de: "Hochebenen und Wetter bestimmen Schwarzmeerreisen.", ru: "Плато и погода напрямую влияют на выбор." },
    body: {
      tr: ["Karadeniz rotalarında yaz ayları yayla deneyimi için daha güçlüdür.", "İlkbahar ve sonbahar daha sakin program isteyenler için değerlendirilebilir."],
      en: ["Summer months are stronger for plateau experiences.", "Spring and autumn may suit travelers seeking calmer programs."],
      de: ["Sommermonate eignen sich besonders für Hochebenen.", "Frühling und Herbst passen für ruhigere Programme."],
      ru: ["Лето лучше для плато.", "Весна и осень подходят для более спокойных программ."],
    },
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    tags: { tr: ["Karadeniz", "Mevsim"], en: ["Black Sea", "Season"], de: ["Schwarzmeer", "Saison"], ru: ["Черное море", "Сезон"] },
  },
];

export const infoPages: LandingPage[] = [
  {
    id: "about",
    kind: "info",
    slugs: { tr: "hakkimizda", en: "about", de: "ueber-uns", ru: "o-nas" },
    title: { tr: "Hakkımızda", en: "About Us", de: "Über uns", ru: "О нас" },
    summary: { tr: "Tur seçimini kolaylaştıran, ön talep toplayan ve satış danışmanlığı sağlayan yapı.", en: "A structure that simplifies tour selection, collects requests and supports sales consultation.", de: "Eine Struktur für Reiseauswahl, Anfragen und Beratung.", ru: "Система для выбора туров, заявок и консультаций." },
    body: {
      tr: ["Bu platform, kullanıcıların turları detaylı incelemesi, ön talep bırakması ve satış danışmanı ile ilerlemesi için tasarlanmıştır.", "Site adı, logo, acenta ve belge bilgileri gerçek veriler geldikçe admin panelinden güncellenecektir."],
      en: ["This platform is designed for users to explore tours, send requests and continue with a travel consultant.", "Brand, logo, agency and certificate details will be updated from the admin panel when ready."],
      de: ["Diese Plattform dient zur Reiseauswahl, Anfrage und Beratung.", "Marke, Logo, Agentur- und Zertifikatsdaten werden später im Admin aktualisiert."],
      ru: ["Платформа создана для просмотра туров, заявок и работы с консультантом.", "Бренд, логотип, агентские и документальные данные позже обновляются в админ-панели."],
    },
  },
  {
    id: "contact",
    kind: "info",
    slugs: { tr: "iletisim", en: "contact", de: "kontakt", ru: "kontakty" },
    title: { tr: "İletişim", en: "Contact", de: "Kontakt", ru: "Контакты" },
    summary: { tr: "Telefon, WhatsApp, e-posta ve genel iletişim talebi alanı.", en: "Phone, WhatsApp, email and general contact request area.", de: "Telefon, WhatsApp, E-Mail und Kontaktformular.", ru: "Телефон, WhatsApp, почта и форма контакта." },
    body: {
      tr: ["Gerçek iletişim bilgileri geldiğinde bu alanlar admin panelinden güncellenecektir.", "Ön talep veya genel iletişim formu üzerinden satış danışmanı dönüşü planlanır."],
      en: ["When real contact information is ready, these fields will be updated from the admin panel.", "Consultant follow-up is planned through request or contact forms."],
      de: ["Echte Kontaktdaten werden später im Admin aktualisiert.", "Beraterkontakt erfolgt über Anfrage- oder Kontaktformular."],
      ru: ["Реальные контакты позже обновляются через админ-панель.", "Консультант связывается через заявку или контактную форму."],
    },
  },
  {
    id: "lead",
    kind: "lead",
    slugs: { tr: "on-talep", en: "request", de: "anfrage", ru: "zayavka" },
    title: { tr: "Ön Talep Bırak", en: "Send a Request", de: "Anfrage senden", ru: "Оставить заявку" },
    summary: { tr: "İlgilendiğiniz tur için bilgilerinizi bırakın, danışman sizinle iletişime geçsin.", en: "Leave your details for the tour you are interested in and a consultant will contact you.", de: "Hinterlassen Sie Ihre Daten und ein Berater meldet sich.", ru: "Оставьте данные, и консультант свяжется с вами." },
    body: {
      tr: ["Talep bırakmak ödeme veya kesin rezervasyon değildir.", "Satış görüşmesi sonrası ödeme Jolly altyapısı üzerinden tamamlanır."],
      en: ["Submitting a request is not a payment or final booking.", "After consultation, payment is completed through Jolly."],
      de: ["Eine Anfrage ist keine Zahlung oder finale Buchung.", "Nach Beratung erfolgt die Zahlung über Jolly."],
      ru: ["Заявка не является оплатой или финальной бронью.", "После консультации оплата проходит через Jolly."],
    },
  },
  {
    id: "launch-checklist",
    kind: "info",
    slugs: {
      tr: "yayina-hazirlik",
      en: "launch-checklist",
      de: "launch-checkliste",
      ru: "chek-list-zapuska",
    },
    title: {
      tr: "Yayına Hazırlık Kontrol Listesi",
      en: "Launch Checklist",
      de: "Launch-Checkliste",
      ru: "Чек-лист запуска",
    },
    summary: {
      tr: "Canlıya çıkmadan önce teknik, form, yönlendirme, SEO, performans, güvenlik, yasal, içerik ve analitik kontrolleri.",
      en: "Technical, form, redirect, SEO, performance, security, legal, content and analytics checks before launch.",
      de: "Technik-, Formular-, Weiterleitungs-, SEO-, Performance-, Sicherheits-, Rechts-, Inhalts- und Analyseprüfungen vor Launch.",
      ru: "Технические, формовые, SEO, безопасность, юридические, контентные и аналитические проверки перед запуском.",
    },
    body: {
      tr: [
        "Teknik kontroller: build, sayfa açılışları, mobil/tablet/masaüstü, 404, dil geçişleri, menü ve footer linkleri.",
        "Form kontrolleri: ön talep, iletişim, KVKK zorunlulukları, pazarlama izni, başarı ve hata mesajları.",
        "Yönlendirme kontrolleri: Jolly, WhatsApp, telefon, e-posta, UTM ve outbound click izleme.",
        "SEO kontrolleri: title, meta description, canonical, hreflang, sitemap, robots, Open Graph, schema, breadcrumb ve temiz URL.",
        "Performans ve güvenlik: görsel optimizasyonu, lazy loading, admin erişimi, spam koruması, ortam değişkenleri ve dosya yükleme kontrolleri.",
        "Yasal ve içerik kontrolleri: KVKK, gizlilik, çerez, kullanım şartları, Jolly bilgilendirmesi, TÜRSAB alanı, geçici logo ve iletişim bilgileri.",
        "Yayın sonrası ilk 24-48 saat: erişim, formlar, admin panel, mobil görünüm, tıklama takibi, analytics ve hata logları kontrol edilir.",
      ],
      en: [
        "Technical checks: build, page availability, mobile/tablet/desktop, 404, language switching, menu and footer links.",
        "Form checks: request form, contact form, privacy requirements, marketing permission, success and error states.",
        "Redirect checks: Jolly, WhatsApp, phone, email, UTM and outbound click tracking.",
        "SEO checks: title, meta description, canonical, hreflang, sitemap, robots, Open Graph, schema, breadcrumb and clean URLs.",
        "Performance and security: image optimization, lazy loading, admin access, spam protection, environment variables and upload controls.",
        "Legal and content checks: privacy, cookies, terms, Jolly notice, TÜRSAB area, temporary logo and contact information.",
        "First 24-48 hours after launch: availability, forms, admin panel, mobile view, click tracking, analytics and error logs.",
      ],
      de: [
        "Technik: Build, Seiten, mobile/tablet/desktop, 404, Sprachwechsel, Menü- und Footer-Links.",
        "Formulare: Anfrage, Kontakt, Datenschutzpflichten, Marketing-Erlaubnis, Erfolgs- und Fehlerzustände.",
        "Weiterleitungen: Jolly, WhatsApp, Telefon, E-Mail, UTM und Outbound-Tracking.",
        "SEO: Title, Meta Description, Canonical, Hreflang, Sitemap, Robots, Open Graph, Schema, Breadcrumb und saubere URLs.",
        "Performance und Sicherheit: Bildoptimierung, Lazy Loading, Admin-Zugriff, Spam-Schutz, Umgebungsvariablen und Upload-Kontrollen.",
        "Recht und Inhalt: Datenschutz, Cookies, Bedingungen, Jolly-Hinweis, TÜRSAB-Bereich, temporäres Logo und Kontakte.",
        "Erste 24-48 Stunden: Erreichbarkeit, Formulare, Admin, Mobile, Klicktracking, Analytics und Fehlerlogs.",
      ],
      ru: [
        "Техника: build, страницы, мобильный/планшет/desktop, 404, языки, меню и footer.",
        "Формы: заявка, контакт, обязательные согласия, маркетинг, успешные и ошибочные состояния.",
        "Переходы: Jolly, WhatsApp, телефон, email, UTM и отслеживание внешних кликов.",
        "SEO: title, meta description, canonical, hreflang, sitemap, robots, Open Graph, schema, breadcrumb и чистые URL.",
        "Производительность и безопасность: изображения, lazy loading, доступ admin, антиспам, переменные среды и загрузки.",
        "Право и контент: конфиденциальность, cookies, условия, Jolly, TÜRSAB, временный логотип и контакты.",
        "Первые 24-48 часов: доступность, формы, admin, мобильный вид, клики, analytics и логи ошибок.",
      ],
    },
  },
];

export const legalPages: LandingPage[] = [
  {
    id: "kvkk",
    kind: "legal",
    slugs: { tr: "kvkk", en: "privacy-notice", de: "datenschutzhinweis", ru: "uvedomlenie-o-konfidentsialnosti" },
    title: { tr: "KVKK Aydınlatma Metni", en: "Privacy Notice", de: "Datenschutzhinweis", ru: "Уведомление о конфиденциальности" },
    summary: { tr: "Ön talep ve iletişim formlarında işlenen kişisel veriler hakkında bilgilendirme.", en: "Information about personal data processed in request and contact forms.", de: "Informationen zu personenbezogenen Daten in Anfrage- und Kontaktformularen.", ru: "Информация о персональных данных в формах заявки и контакта." },
    body: {
      tr: ["Bu metin taslak bilgilendirme alanıdır; gerçek hukuki metin marka ve şirket bilgileri netleşince düzenlenmelidir.", "Form verileri talep takibi ve satış danışmanlığı amacıyla işlenecek şekilde planlanmıştır."],
      en: ["This is a draft information area; the final legal text should be updated when company details are ready.", "Form data is planned for request tracking and sales consultation."],
      de: ["Dies ist ein Entwurfsbereich; der finale Rechtstext sollte mit Firmendaten aktualisiert werden.", "Formulardaten dienen Anfrageverfolgung und Beratung."],
      ru: ["Это черновой информационный блок; финальный текст обновляется после данных компании.", "Данные форм используются для отслеживания заявки и консультации."],
    },
  },
  {
    id: "privacy",
    kind: "legal",
    slugs: { tr: "gizlilik-politikasi", en: "privacy-policy", de: "datenschutzrichtlinie", ru: "politika-konfidentsialnosti" },
    title: { tr: "Gizlilik Politikası", en: "Privacy Policy", de: "Datenschutzrichtlinie", ru: "Политика конфиденциальности" },
    summary: { tr: "Site kullanımı, formlar, çerezler ve analitik araçlara ilişkin genel politika.", en: "General policy for site usage, forms, cookies and analytics.", de: "Allgemeine Richtlinie für Nutzung, Formulare, Cookies und Analytik.", ru: "Общая политика сайта, форм, cookies и аналитики." },
    body: { tr: ["Gizlilik politikası admin panelden düzenlenebilir içerik olarak hazırlanmıştır."], en: ["The privacy policy is prepared as editable admin content."], de: ["Die Datenschutzrichtlinie ist im Admin editierbar vorbereitet."], ru: ["Политика конфиденциальности подготовлена как редактируемый контент."] },
  },
  {
    id: "cookies",
    kind: "legal",
    slugs: { tr: "cerez-politikasi", en: "cookie-policy", de: "cookie-richtlinie", ru: "politika-cookie" },
    title: { tr: "Çerez Politikası", en: "Cookie Policy", de: "Cookie-Richtlinie", ru: "Политика cookie" },
    summary: { tr: "Zorunlu, analitik ve pazarlama çerezleri için bilgilendirme.", en: "Information about required, analytics and marketing cookies.", de: "Informationen zu notwendigen, analytischen und Marketing-Cookies.", ru: "Информация об обязательных, аналитических и маркетинговых cookie." },
    body: { tr: ["Çerez tercihleri takip altyapısıyla uyumlu olacak şekilde planlanmıştır."], en: ["Cookie preferences are planned to work with tracking infrastructure."], de: ["Cookie-Präferenzen sind mit Tracking geplant."], ru: ["Настройки cookie планируются совместно с аналитикой."] },
  },
  {
    id: "terms",
    kind: "legal",
    slugs: { tr: "kullanim-sartlari", en: "terms-of-use", de: "nutzungsbedingungen", ru: "usloviya-ispolzovaniya" },
    title: { tr: "Kullanım Şartları", en: "Terms of Use", de: "Nutzungsbedingungen", ru: "Условия использования" },
    summary: { tr: "Site kullanımı ve bilgilendirme sınırlarına ilişkin taslak metin.", en: "Draft text on site usage and information boundaries.", de: "Entwurf zu Nutzung und Informationsgrenzen.", ru: "Черновой текст об использовании сайта." },
    body: { tr: ["Site içeriği tur tanıtımı ve ön talep toplama amacıyla sunulur."], en: ["Site content is provided for tour promotion and request collection."], de: ["Website-Inhalte dienen Reiseinformation und Anfrageerfassung."], ru: ["Контент сайта предназначен для информации о турах и заявок."] },
  },
  {
    id: "jolly",
    kind: "legal",
    slugs: { tr: "jolly-yonlendirme-bilgilendirmesi", en: "jolly-redirect-information", de: "jolly-weiterleitung", ru: "informatsiya-o-perehode-jolly" },
    title: { tr: "Jolly Yönlendirme Bilgilendirmesi", en: "Jolly Redirect Information", de: "Jolly-Weiterleitung", ru: "Информация о переходе Jolly" },
    summary: { tr: "Ödeme ve kesin rezervasyonun Jolly altyapısı üzerinden ilerleyeceğini açıklar.", en: "Explains that payment and final booking proceed through Jolly.", de: "Erklärt Zahlung und finale Buchung über Jolly.", ru: "Объясняет оплату и финальную бронь через Jolly." },
    body: { tr: ["Jolly butonları kullanıcıyı ödeme ve kesin rezervasyon süreci için Jolly altyapısına yönlendirir.", "Nihai fiyat, müsaitlik ve tur koşulları Jolly tarafında güncellenebilir."], en: ["Jolly buttons direct users to Jolly for payment and final booking.", "Final price, availability and conditions may be updated on Jolly."], de: ["Jolly-Buttons leiten zur Zahlung und finalen Buchung zu Jolly.", "Endpreis, Verfügbarkeit und Bedingungen können bei Jolly aktualisiert werden."], ru: ["Кнопки Jolly направляют к оплате и финальной брони.", "Финальная цена, наличие и условия могут обновляться на Jolly."] },
  },
  {
    id: "package-tour",
    kind: "legal",
    slugs: { tr: "mesafeli-satis-paket-tur-bilgilendirme", en: "distance-sales-package-tour-information", de: "fernabsatz-pauschalreise-information", ru: "distantsionnaya-prodazha-paketnyy-tur" },
    title: { tr: "Mesafeli Satış / Paket Tur Bilgilendirme", en: "Distance Sales / Package Tour Information", de: "Fernabsatz / Pauschalreise Information", ru: "Дистанционная продажа / пакетный тур" },
    summary: { tr: "Paket tur ve mesafeli satış süreçleri için bilgilendirme alanı.", en: "Information area for package tour and distance sales processes.", de: "Informationen zu Pauschalreise und Fernabsatz.", ru: "Информация о пакетных турах и дистанционной продаже." },
    body: { tr: ["Bu sayfa hukuki danışmanlıkla nihai hale getirilmelidir.", "Ön talep ödeme veya sözleşme kurulması anlamına gelmez."], en: ["This page should be finalized with legal counsel.", "A request does not mean payment or contract formation."], de: ["Diese Seite sollte rechtlich finalisiert werden.", "Eine Anfrage ist keine Zahlung oder Vertragsbildung."], ru: ["Страница должна быть финализирована юристом.", "Заявка не означает оплату или договор."] },
  },
  {
    id: "tursab",
    kind: "legal",
    slugs: { tr: "tursab-acenta-bilgileri", en: "tursab-agency-information", de: "tursab-agenturinformationen", ru: "informatsiya-tursab-agentstvo" },
    title: { tr: "TÜRSAB / Acenta Bilgileri", en: "TÜRSAB / Agency Information", de: "TÜRSAB / Agenturinformationen", ru: "TÜRSAB / информация агентства" },
    summary: { tr: "Acenta unvanı, belge numarası ve dijital doğrulama alanları.", en: "Agency title, certificate number and digital verification areas.", de: "Agenturname, Zertifikatnummer und digitale Prüfung.", ru: "Название агентства, номер документа и проверка." },
    body: { tr: ["Gerçek TÜRSAB ve acenta bilgileri sonradan admin panelden eklenecektir."], en: ["Real TÜRSAB and agency information will be added later from the admin panel."], de: ["Echte TÜRSAB- und Agenturdaten werden später im Admin ergänzt."], ru: ["Реальные данные TÜRSAB и агентства будут добавлены позже."] },
  },
  {
    id: "cancellation",
    kind: "legal",
    slugs: { tr: "iptal-degisiklik-bilgilendirme", en: "cancellation-change-information", de: "storno-aenderung-information", ru: "otmena-izmenenie-informatsiya" },
    title: { tr: "İptal ve Değişiklik Bilgilendirme", en: "Cancellation and Change Information", de: "Storno- und Änderungsinformation", ru: "Информация об отмене и изменениях" },
    summary: { tr: "Tur koşulları, iptal ve değişiklik süreçleri için açıklama alanı.", en: "Explanation area for tour conditions, cancellations and changes.", de: "Hinweise zu Bedingungen, Storno und Änderungen.", ru: "Информация об условиях, отмене и изменениях." },
    body: { tr: ["İptal ve değişiklik koşulları tur detayına, döneme ve Jolly tarafındaki güncel koşullara göre değişebilir."], en: ["Cancellation and change conditions may vary by tour, period and Jolly's current terms."], de: ["Storno- und Änderungsbedingungen können je nach Reise, Zeitraum und Jolly variieren."], ru: ["Условия отмены и изменений зависят от тура, периода и условий Jolly."] },
  },
];

export const allLandingPages = [
  ...categories,
  ...campaigns,
  ...destinations,
  ...infoPages,
  ...legalPages,
];

export function getTourBySlug(locale: Locale, slug: string) {
  return tours.find((tour) => tour.slugs[locale] === slug);
}

export function getLandingBySlug(locale: Locale, slug: string) {
  return allLandingPages.find((page) => page.slugs[locale] === slug);
}

export function getBlogBySlug(locale: Locale, slug: string) {
  return blogPosts.find((post) => post.slugs[locale] === slug);
}

export function getToursForLanding(page: LandingPage) {
  if (page.linkedTourIds?.length) {
    return tours.filter((tour) => page.linkedTourIds?.includes(tour.id));
  }

  if (page.kind === "category") {
    return tours.filter((tour) => tour.categoryIds.includes(page.id));
  }

  if (page.kind === "campaign") {
    return tours.filter((tour) => tour.campaignIds.includes(page.id));
  }

  if (page.kind === "destination") {
    return tours.filter((tour) => tour.destinationIds.includes(page.id));
  }

  return [];
}

export function formatPrice(price: number, currency: Tour["currency"]) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
