import type { Locale } from "./site";

type HomeContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    tours: string;
    domestic: string;
    abroad: string;
    visaFree: string;
    campaigns: string;
    about: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
    searchPlaceholder: string;
    departure: string;
    tourType: string;
    period: string;
    search: string;
    destinationExamples: string;
    departureOptions: string[];
    tourTypeOptions: string[];
    periodOptions: string[];
  };
  trust: {
    preRequest: string;
    jollyPayment: string;
    tursab: string;
    support: string;
  };
  lead: {
    title: string;
    description: string;
    name: string;
    phone: string;
    email: string;
    travelers: string;
    message: string;
    kvkk: string;
    submit: string;
  };
  infoLabels: {
    jolly: string;
    phone: string;
    whatsapp: string;
    tursab: string;
  };
  planning: {
    title: string;
    items: string[];
  };
  footer: {
    notice: string;
  };
};

export const homeContent: Record<Locale, HomeContent> = {
  tr: {
    meta: {
      title: "book to tour | Çok Dilli Tur Satış ve Rezervasyon Platformu",
      description:
        "Yurt içi, yurt dışı, vizesiz ve özel dönem turlarını keşfedin; ön talep bırakın, danışmanlık alın ve ödeme sürecini Jolly altyapısıyla tamamlayın.",
    },
    nav: {
      home: "Ana Sayfa",
      tours: "Turlar",
      domestic: "Yurt İçi",
      abroad: "Yurt Dışı",
      visaFree: "Vizesiz",
      campaigns: "Kampanyalar",
      about: "Hakkımızda",
      contact: "İletişim",
    },
    hero: {
      eyebrow: "book to tour ile güvenli tur planlama",
      title: "Hayalindeki turu bul, ön talebini bırak, satış danışmanı seni arasın.",
      description:
        "Sıcak tatil hissi veren, keskin hatlı ve çok dilli bir tur platformu. Ön talep, danışman desteği ve kesin rezervasyon süreci Jolly altyapısıyla birlikte ilerler.",
      primary: "Turları İncele",
      secondary: "Ön Talep Bırak",
      searchPlaceholder: "Nereye gitmek istiyorsun?",
      departure: "Kalkış şehri",
      tourType: "Tur tipi",
      period: "Tarih / dönem",
      search: "Ara",
      destinationExamples: "Kapadokya, Balkanlar, Karadeniz",
      departureOptions: ["İstanbul", "Ankara", "İzmir"],
      tourTypeOptions: ["Yurt İçi", "Yurt Dışı", "Vizesiz"],
      periodOptions: ["Yaz", "Bayram", "Hafta sonu"],
    },
    trust: {
      preRequest: "Ön talep sonrası danışman dönüşü",
      jollyPayment: "Ödeme ve kesin rezervasyon Jolly üzerinden",
      tursab: "TÜRSAB / acenta alanı hazır",
      support: "WhatsApp ve telefon desteği",
    },
    lead: {
      title: "Ön talep bırak",
      description:
        "Tur tercihinizi iletin; satış danışmanı tarih, kontenjan ve ödeme yönlendirmesi için sizinle iletişime geçsin.",
      name: "Ad soyad",
      phone: "Telefon",
      email: "E-posta",
      travelers: "Kişi sayısı",
      message: "İlgilendiğiniz tur veya notunuz",
      kvkk: "KVKK aydınlatma metnini okudum.",
      submit: "Talep Gönder",
    },
    infoLabels: {
      jolly: "Jolly",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      tursab: "TÜRSAB",
    },
    planning: {
      title: "book to tour satış akışı",
      items: [
        "Turlar tek ekranda karşılaştırılır ve detay sayfalarından talep alınır.",
        "Satış danışmanı uygun tarih, kontenjan ve fiyat bilgisini netleştirir.",
        "Ödeme ve kesin rezervasyon adımı Jolly yönlendirmesiyle tamamlanır.",
        "TÜRSAB / acenta bilgi alanları güven katmanı olarak görünür tutulur.",
        "Ön talep ve rezervasyon talepleri yönetim panelinden takip edilir.",
        "TR, EN, DE ve RU dillerinde aynı satış yapısı korunur.",
      ],
    },
    footer: {
      notice:
        "Talep bırakmak ödeme veya kesin rezervasyon anlamına gelmez. Ödeme ve kesin rezervasyon Jolly altyapısı üzerinden tamamlanır.",
    },
  },
  en: {
    meta: {
      title: "book to tour | Multilingual Tour Sales and Booking Platform",
      description:
        "Discover domestic, international, visa-free and seasonal tours; send a request, speak with a consultant and complete payment through the Jolly infrastructure.",
    },
    nav: {
      home: "Home",
      tours: "Tours",
      domestic: "Domestic",
      abroad: "International",
      visaFree: "Visa-Free",
      campaigns: "Campaigns",
      about: "About",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Trusted tour planning with book to tour",
      title: "Find the right tour, send a request, and let a travel consultant call you.",
      description:
        "A warm, sharp-edged, multilingual tour platform built around request collection, consultant support and Jolly-powered final booking.",
      primary: "Browse Tours",
      secondary: "Send Request",
      searchPlaceholder: "Where would you like to go?",
      departure: "Departure city",
      tourType: "Tour type",
      period: "Date / period",
      search: "Search",
      destinationExamples: "Cappadocia, Balkans, Black Sea",
      departureOptions: ["Istanbul", "Ankara", "Izmir"],
      tourTypeOptions: ["Domestic", "International", "Visa-Free"],
      periodOptions: ["Summer", "Holiday", "Weekend"],
    },
    trust: {
      preRequest: "Consultant follow-up after request",
      jollyPayment: "Payment and final booking via Jolly",
      tursab: "TÜRSAB / agency area ready",
      support: "WhatsApp and phone support",
    },
    lead: {
      title: "Send a request",
      description:
        "Send your tour preference; a consultant will contact you about dates, availability and payment direction.",
      name: "Full name",
      phone: "Phone",
      email: "Email",
      travelers: "Travelers",
      message: "Tour of interest or your note",
      kvkk: "I have read the privacy notice.",
      submit: "Send Request",
    },
    infoLabels: {
      jolly: "Jolly",
      phone: "Phone",
      whatsapp: "WhatsApp",
      tursab: "TÜRSAB",
    },
    planning: {
      title: "book to tour sales flow",
      items: [
        "Tours are compared clearly and requests are collected from detail pages.",
        "A consultant confirms date, availability and current price details.",
        "Payment and final booking are completed through the Jolly redirect.",
        "TÜRSAB / agency information areas remain visible for trust.",
        "Requests and booking leads are tracked from the admin panel.",
        "The same sales structure is supported in TR, EN, DE and RU.",
      ],
    },
    footer: {
      notice:
        "Submitting a request does not mean payment or final reservation. Payment and final reservation are completed through the Jolly infrastructure.",
    },
  },
  de: {
    meta: {
      title: "book to tour | Mehrsprachige Reiseplattform mit Anfragefluss",
      description:
        "Entdecken Sie Inlandsreisen, Auslandsreisen, visafreie Reisen und Saisonangebote; senden Sie eine Anfrage und schließen Sie Zahlung und Buchung über Jolly ab.",
    },
    nav: {
      home: "Start",
      tours: "Reisen",
      domestic: "Inland",
      abroad: "Ausland",
      visaFree: "Visafrei",
      campaigns: "Angebote",
      about: "Über uns",
      contact: "Kontakt",
    },
    hero: {
      eyebrow: "Verlässliche Reiseplanung mit book to tour",
      title: "Finden Sie die passende Reise, senden Sie eine Anfrage und lassen Sie sich beraten.",
      description:
        "Eine warme, klare und mehrsprachige Reiseplattform mit Anfragefluss, Beratung und finaler Buchung über Jolly.",
      primary: "Reisen ansehen",
      secondary: "Anfrage senden",
      searchPlaceholder: "Wohin möchten Sie reisen?",
      departure: "Abfahrtsort",
      tourType: "Reisetyp",
      period: "Datum / Zeitraum",
      search: "Suchen",
      destinationExamples: "Kappadokien, Balkan, Schwarzmeer",
      departureOptions: ["Istanbul", "Ankara", "Izmir"],
      tourTypeOptions: ["Inland", "Ausland", "Visafrei"],
      periodOptions: ["Sommer", "Feiertage", "Wochenende"],
    },
    trust: {
      preRequest: "Beratung nach Anfrage",
      jollyPayment: "Zahlung und finale Buchung über Jolly",
      tursab: "TÜRSAB / Agenturbereich vorbereitet",
      support: "WhatsApp- und Telefonsupport",
    },
    lead: {
      title: "Anfrage senden",
      description:
        "Senden Sie Ihre Reisewünsche; ein Berater meldet sich zu Terminen, Verfügbarkeit und Zahlung.",
      name: "Name",
      phone: "Telefon",
      email: "E-Mail",
      travelers: "Personen",
      message: "Gewünschte Reise oder Nachricht",
      kvkk: "Ich habe die Datenschutzhinweise gelesen.",
      submit: "Anfrage senden",
    },
    infoLabels: {
      jolly: "Jolly",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      tursab: "TÜRSAB",
    },
    planning: {
      title: "book to tour Verkaufsablauf",
      items: [
        "Reisen werden klar verglichen und Anfragen über Detailseiten erfasst.",
        "Ein Berater bestätigt Termin, Verfügbarkeit und aktuellen Preis.",
        "Zahlung und finale Buchung erfolgen über die Jolly-Weiterleitung.",
        "TÜRSAB / Agenturinformationen bleiben sichtbar eingebunden.",
        "Anfragen und Buchungsleads werden im Admin-Panel verfolgt.",
        "Die gleiche Verkaufsstruktur steht in TR, EN, DE und RU bereit.",
      ],
    },
    footer: {
      notice:
        "Eine Anfrage ist keine Zahlung und keine endgültige Reservierung. Zahlung und finale Reservierung erfolgen über die Jolly-Infrastruktur.",
    },
  },
  ru: {
    meta: {
      title: "book to tour | Многоязычная платформа туров и заявок",
      description:
        "Изучайте туры по стране, зарубежные, безвизовые и сезонные предложения; оставляйте заявку и завершайте оплату через инфраструктуру Jolly.",
    },
    nav: {
      home: "Главная",
      tours: "Туры",
      domestic: "По стране",
      abroad: "За рубеж",
      visaFree: "Без визы",
      campaigns: "Акции",
      about: "О нас",
      contact: "Контакты",
    },
    hero: {
      eyebrow: "Надежное планирование туров с book to tour",
      title: "Найдите подходящий тур, оставьте заявку, и консультант свяжется с вами.",
      description:
        "Теплая, четкая и многоязычная платформа туров с заявками, консультацией и дальнейшей оплатой через Jolly.",
      primary: "Смотреть туры",
      secondary: "Оставить заявку",
      searchPlaceholder: "Куда вы хотите поехать?",
      departure: "Город выезда",
      tourType: "Тип тура",
      period: "Дата / период",
      search: "Поиск",
      destinationExamples: "Каппадокия, Балканы, Черное море",
      departureOptions: ["Стамбул", "Анкара", "Измир"],
      tourTypeOptions: ["По стране", "За рубеж", "Без визы"],
      periodOptions: ["Лето", "Праздник", "Выходные"],
    },
    trust: {
      preRequest: "Связь консультанта после заявки",
      jollyPayment: "Оплата и бронь через Jolly",
      tursab: "Место для TÜRSAB / агентства готово",
      support: "Поддержка WhatsApp и телефон",
    },
    lead: {
      title: "Оставить заявку",
      description:
        "Отправьте предпочтения по туру; консультант свяжется с вами по датам, наличию мест и оплате.",
      name: "Имя и фамилия",
      phone: "Телефон",
      email: "Эл. почта",
      travelers: "Кол-во человек",
      message: "Интересующий тур или сообщение",
      kvkk: "Я прочитал уведомление о конфиденциальности.",
      submit: "Отправить заявку",
    },
    infoLabels: {
      jolly: "Jolly",
      phone: "Телефон",
      whatsapp: "WhatsApp",
      tursab: "TÜRSAB",
    },
    planning: {
      title: "Процесс продаж book to tour",
      items: [
        "Туры удобно сравниваются, заявки собираются со страниц деталей.",
        "Консультант уточняет дату, наличие мест и актуальную цену.",
        "Оплата и финальное бронирование выполняются через переход Jolly.",
        "Блоки TÜRSAB / агентства остаются видимыми для доверия.",
        "Заявки и бронирования отслеживаются в админ-панели.",
        "Одинаковая структура продаж поддерживается на TR, EN, DE и RU.",
      ],
    },
    footer: {
      notice:
        "Отправка заявки не означает оплату или окончательную бронь. Оплата и финальная бронь выполняются через инфраструктуру Jolly.",
    },
  },
};
