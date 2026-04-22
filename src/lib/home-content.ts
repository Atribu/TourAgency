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
      title: "TourAgency | Çok Dilli Tur Satış ve Ön Talep Platformu",
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
      eyebrow: "Geçici marka yapısı hazır",
      title: "Hayalindeki turu bul, ön talebini bırak, satış danışmanı seni arasın.",
      description:
        "Sıcak tatil hissi veren, keskin hatlı ve çok dilli bir tur platformu. Ödeme ve kesin rezervasyon süreci Jolly altyapısı üzerinden ilerleyecek şekilde planlandı.",
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
        "Gerçek form akışı sonraki adımlarda admin paneline bağlanacak. Şimdilik satış modelinin yeri ve dili hazır.",
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
      title: "1. madde kapsamı",
      items: [
        "Site adı ve logo sonradan değişecek şekilde merkezi ayarlandı.",
        "Sıcak tatil renkleri ve daha keskin tasarım dili tanımlandı.",
        "Genel Jolly yönlendirmesi ve geçici iletişim bilgileri eklendi.",
        "TÜRSAB / acenta bilgileri için görünür alan bırakıldı.",
        "Ön talep satış modeli ana akışa yerleştirildi.",
        "TR, EN, DE ve RU dil temeli baştan kuruldu.",
      ],
    },
    footer: {
      notice:
        "Talep bırakmak ödeme veya kesin rezervasyon anlamına gelmez. Ödeme ve kesin rezervasyon Jolly altyapısı üzerinden tamamlanır.",
    },
  },
  en: {
    meta: {
      title: "TourAgency | Multilingual Tour Sales and Lead Platform",
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
      eyebrow: "Temporary brand structure ready",
      title: "Find the right tour, send a request, and let a travel consultant call you.",
      description:
        "A warm, sharp-edged, multilingual tour platform planned around lead collection and Jolly-powered payment and final reservation flow.",
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
        "The real form flow will be connected to the admin panel in the next steps. For now, the sales model has its place and wording.",
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
      title: "Scope of step 1",
      items: [
        "Site name and logo are centralized for later replacement.",
        "Warm travel colors and a sharper visual language are defined.",
        "General Jolly redirect and temporary contact details are added.",
        "Visible TÜRSAB / agency information placeholders are included.",
        "The lead-based sales model is placed into the core flow.",
        "TR, EN, DE and RU language foundations are in place.",
      ],
    },
    footer: {
      notice:
        "Submitting a request does not mean payment or final reservation. Payment and final reservation are completed through the Jolly infrastructure.",
    },
  },
  de: {
    meta: {
      title: "TourAgency | Mehrsprachige Reiseplattform mit Anfragefluss",
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
      eyebrow: "Temporäre Markenstruktur bereit",
      title: "Finden Sie die passende Reise, senden Sie eine Anfrage und lassen Sie sich beraten.",
      description:
        "Eine warme, klare und mehrsprachige Reiseplattform mit Anfragefluss und geplanter Zahlung sowie finaler Reservierung über Jolly.",
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
        "Der echte Formularfluss wird in den nächsten Schritten mit dem Admin-Panel verbunden. Der Verkaufsablauf ist vorerst sichtbar vorbereitet.",
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
      title: "Umfang von Schritt 1",
      items: [
        "Name und Logo sind zentral für spätere Änderungen vorbereitet.",
        "Warme Reisefarben und eine klare Formsprache sind definiert.",
        "Allgemeine Jolly-Weiterleitung und temporäre Kontaktdaten sind ergänzt.",
        "Platzhalter für TÜRSAB / Agenturdaten sind sichtbar angelegt.",
        "Das Anfrage- und Vertriebsmodell ist im Hauptfluss platziert.",
        "TR, EN, DE und RU Sprachgrundlagen sind eingerichtet.",
      ],
    },
    footer: {
      notice:
        "Eine Anfrage ist keine Zahlung und keine endgültige Reservierung. Zahlung und finale Reservierung erfolgen über die Jolly-Infrastruktur.",
    },
  },
  ru: {
    meta: {
      title: "TourAgency | Многоязычная платформа туров и заявок",
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
      eyebrow: "Временная структура бренда готова",
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
        "Реальная форма будет подключена к админ-панели на следующих этапах. Сейчас подготовлены место и тексты для модели продаж.",
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
      title: "Объем шага 1",
      items: [
        "Название сайта и логотип централизованы для будущей замены.",
        "Определены теплые туристические цвета и более четкий стиль.",
        "Добавлены общий переход на Jolly и временные контакты.",
        "Подготовлены видимые поля для TÜRSAB / данных агентства.",
        "Модель заявок встроена в основной путь продаж.",
        "Основа языков TR, EN, DE и RU создана с самого начала.",
      ],
    },
    footer: {
      notice:
        "Отправка заявки не означает оплату или окончательную бронь. Оплата и финальная бронь выполняются через инфраструктуру Jolly.",
    },
  },
};
