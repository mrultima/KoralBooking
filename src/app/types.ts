export interface Amenitys {
    PropertName: string;
    CatgoryName: string;
    Icon: string;
    NotFree: boolean
  }

export interface HotelConfig {
    HOTELID: number;
    SEOTITLE: null;
    SEODESCRIPTION: null;
    SEOKEYWORDS: null;
    HOTELSEOURL: string;
    SUBDOMAIN: string;
    HOTELNAME: string;
    DOMAINTYPE: string;
    PORTALID: number;
    PORTALDOMAINID: null;
    LOGOURL: string;
    LOGOURL_FAVICON: null;
    HOTELVOUCHER_LOGOURL: string;
    NAME: string;
    COMPANYNAME: string;
    PHONE: string;
    FAX: null;
    ADDRESS: string;
    WHATSAPP: null;
    EMAIL: string;
    DEFAULTCURRENCY: string;
    DEFAULTLANGUAGE: string;
    USEHTTPS: boolean;
    THEMENO: number;
    DEFAULTCATEGORY: null;
    BANKACCOUNTNUMBER: null;
    FACEBOOKURL: null;
    TWITTERURL: null;
    GOOGLEPLUSURL: null;
    YOUTUBEURL: null;
    LINKEDINURL: null;
    INSTAGRAMURL: string;
    PINTERESTURL: null;
    MAINPAGEURL: null;
    MUST_LOGIN: boolean;
    CURRENCIES: string;
    LANGUAGES: string;
    GOOGLEMAPSAPIKEY: string;
    BANNERIMAGE: string;
    BANNERIMAGEMOBILE: string;
    PRICEWITHBIRTHDATE: boolean;
    RES_OPENBASKET_AUTO: boolean;
    SEARCHBOXMODE: string;
    ISMAPENABLED: boolean;
    SHOWCOMMISSION: boolean;
    POLICYOFFSET: null;
    COMMISSIONTYPE: string;
    COUNTRYCODE: string;
    COLORS: string;
    GAUID: string;
    HOTELGROUPID: null;
    GTMUID: string;
    YMUID: string;
    HOTELLISTPRICETYPE: number;
    ErsId: number;
    Uid: string;
    HotelID: number;
    HotelGiataId: null;
    HotelName: string;
    LogoURL: null;
    Web: string;
    Longitude: number;
    Latitude: number;
    Phone: string;
    Email: string;
    StartOfSeason: null;
    MinDaysToCheckIn: null;
    MinLOS: null;
    MaxAdult: number;
    MaxChild:number;
    MaxPax: null;
    ThemeNo: null;
    UserInterfaceMaxChildAge: number;
    MaxChildAge: null;
    MinChildAge: number;
    ColorSchemes: string;
    PayByCC: boolean;
    PayByCCB2B: boolean;
    PayByWire: boolean;
    PayByWireB2B: boolean;
    PayAtHotel: boolean;
    PayAtHotelB2B: boolean;
    PayByAgency: boolean;
    PayByMailOrder: boolean;
    PayByMailOrderB2B: boolean;
    PayAtHotelWithCCGuarantee: boolean;
    PayAtHotelWithCCGuaranteeB2B: boolean;
    BankInformation: string;
    PayByDownPayment: boolean;
    DownPaymentPercent: number;
    Whatsapp: null;
    SubDomain: string;
    GoogleAnalyticsCode: string;
    HideRoomsMoreThan: number;
    MinLady: number;
    PortalId: number;
    SMSPhone: string;
    YandexMetrika: string;
    PriceWithBirthdate: boolean;
    City: string;
    Country: null;
    Address: string;
    Airports: string;
    PropertyType: number;
    Image: string;
    Rating: string;
    Stars: number;
    Description: string;
    Amenitys: string;
    _Amenitys: Amenitys[];
    Currencies: string;
    Languages: string;
    DefaultLanguage: string;
    SeoUrl: string;
    SeoTitle: string;
    SeoDescription: string;
    SeoKeywords: string;
    ProviderType: string;
    CheckinTime: string;
    CheckoutTime: string;
    ExtraPaymentInformation: string;
    ResCustomTab1Caption: string;
    ResCustomTab2Caption: string;
    ONLINE_OWNERFOLIO: boolean;
    BASKET_ISPOPUP: boolean;
    CALL_BUTTON: boolean;
    PRINT_BUTTON: boolean;
    MAIL_BUTTON: boolean;
    HOMEPAGE_BUTTON: boolean;
    SHOPPINGGO_BUTTON: boolean;
    HOTELPERSON_ALLROW: boolean;
    HOTELPERSON_GENDER: boolean;
    HOTELPERSON_NAME: boolean;
    HOTELPERSON_SURNAME: boolean;
    HOTELPERSON_BIRTHDATE: boolean;
    HOTELPERSON_NATIONALITY: boolean;
    HOTELPERSON_MAIL: boolean;
    HOTELPERSON_PHONE: boolean;
    HOTELPERSON_PASSPORTNO: boolean;
    HOTELPERSON_PASSPORTDATE: boolean;
    HOTELPERSON_IDENTTYNO: boolean;
    CONTACT_NAME: boolean;
    CONTACT_SURNAME: boolean;
    CONTACT_MAIL: boolean;
    CONTACT_PHONE: boolean;
    CONTACT_ADDRESS: boolean;
    CONTACT_CITY: boolean;
    CONTACT_ZIPCODE: boolean;
    CONTACT_COUNTRY: boolean;
    CONTACT_EXTRANOT: boolean;
    BASKET_INVOCE_VISIBLE: boolean;
    BASKET_ADDRESS_VISIBLE: boolean;
    BASKET_CITY_VISIBLE: boolean;
    BASKET_POSTCODE_VISIBLE: boolean;
    BASKET_COUNTRTY_VISIBLE: boolean;
    BASKET_EXTRANOT_VISIBLE: boolean;
    BASKET__VISIBLE: boolean;
    USE3DPAY: boolean;
    IMAGES_INVISIBILITY: boolean;
    HOTEL_INFO_INVISIBILITY: boolean;
    HIDEPAYMENT_IF_WIRETRANSFER: boolean;
    HOTEL_DESCRIPTION_INVISIBILITY: boolean;
    RATECODE_INVISIBILITY: boolean;
    COMMENT_INVISIBILITY: boolean;
    HOTEL_FACILITY_INVISIBILITY: boolean;
    GALERY_INVISIBILITY: boolean;
    CUSTOM_CONT1_INVISIBILITY: boolean;
    CUSTOM_CONT2_INVISIBILITY: boolean;
    CLICKTOCALL_TAB_INVISIBILITY: boolean;
    CLICKTOCALL_INVISIBILITY: boolean;
    HOTELPERSON_BIRTHDATE_REQURIED: boolean;
    HOTELITEM_DESCRIPTION: null;
    EXTRASERVICE: boolean;
    HOTELPERSON_VISA: boolean;
    HOTELPERSON_FLIGHT: boolean;
    CUSTOMVALIDATIONS: null;
    HOTELPERSON_SELECTADD: boolean;
    PROJECTCODE_VISIBLE: boolean;
    PORTALSELLERID: null;
    HOTELPERSON_PASSPORTNO_REQURIED: boolean;
    PROJECT_REQURIED: boolean;
    SENDBASKETMAIL_VISIBLE: boolean;
    CC_PHONE_VISIBLE: boolean;
    CC_PHONE_REQURIED: boolean;
    PHONE_REQURIED: boolean;
    EMAIL_REQURIED: boolean;
    BASKET_INVOICE_REQURIED: boolean;
    BASKET_COUNTRTY_REQURIED: boolean;
    BASKET_CITY_REQURIED: boolean;
    BASKET_POSTCODE_REQURIED: boolean;
    HOTELPERSON_GENDER_REQUIRED: boolean;
    PASSISSUECITY_VISIBLE: boolean;
    PASSISSUEDATE_VISIBLE: boolean;
    BASKET_INSTALLMENT_VISIBLE: boolean;
    PROFILE_TCCITIZEN_VISIBLE: boolean;
    PROFILE_TCCITIZEN_DISCRIPTION: boolean;
    PAYAT_SERVICE_VISIBLE: boolean;
    HOTEL_CHILDBIRTDHDATEREQUIRED: boolean;
    CAMPAINOREXTRASERVICELABEL: string;
    HIDE_AVAILABILITY: boolean;
    INPUTVALUUPPERCASE: boolean;
    HOTELVOUCHER_VISIBLE: boolean;
    DESIREDTOTALPRICE_VISIBLE: boolean;
    CONTACT_TAXNO: string;
    CONTACT_TC: string;
    BUYLATERBUTTON_VISIBLE: boolean;
    HOTELROOMTYPEIMAGE_VISIBLE: boolean;
    HOTELROOMDAILYPRICE_VISIBLE: boolean;
    TICKETPERSON_ALLROW: boolean;
    VOUCHERPRICE_VISIBLE: boolean;
    BASKET_SHOWTROYCARDLOGO: boolean;
    HOTEL_SEARCHBOXPROMOTION_VISIBLE: boolean;
    BASKET_INSTALLMENT_OPEN: boolean;
    BASKET_RESERVATION_INFO: boolean;
    VOUCHER_PAYEDAMOUNT_VISIBLE: boolean;
    VOUCHER_BANKCOMMISSION_VISIBLE: boolean;
    VOUCHER_EXCHANGE_VISIBLE: boolean;
    CLEAR_BUTTON_VISIBLE: boolean;
    BASKET_KDV_SERVICE_MSG_VISIBLE: boolean;
    BASKET_INVOCE_TC_VISIBLE: boolean;
    BASKET_INVOCE_TAXNO_VISIBLE: boolean;
    HOTELITEM_SHOWRESPARAMS: boolean;
    BASKET_INVOCE_TAXPLACENAME_VISIBLE: boolean;
    BASKET_AGREEMENTKVKK_CHECK_VISIBLE: boolean;
    HOTELVOUCHER_ROOM_PRICE_VISIBLE: boolean;
    PHONEVIEWMODE: number;
    HOTEL_ROOMPRICE_DISCOUNT: boolean;
    PAYTYPE: string;
    BASKET_PROMOTION_VISIBLE: boolean;
    GARANTIPAYENABLED: boolean;
    HOSTING3DPAYENABLED: boolean;
    HOTELITEM_HIDECHECKOUT: boolean;
    ENABLEONLINECHECKIN: boolean;
    ENABLEONLINEPAYMENT: boolean;
    ENABLEONLINECHECKOUT: boolean;
    ENABLEONLINEBILL: boolean;
    ENABLEONLINERESTAURANTRES: boolean;
    ENABLEONLINESPARES: boolean;
    ENABLEONLINECATALOGUE: boolean;
    ENABLEINDIVIDUALLOGIN: boolean;
    ENABLECLICKTOCALL: boolean;
    USELARGELOGO: boolean;
    ISCHOOSESELLERACTIVE: boolean;
    ENABLETENNISRESERVATION: boolean;
    ENABLEGOLFRESERVATION: boolean;
    ENABLEBEACHRESERVATION: boolean;
    ENABLEWATERSPORTRESERVATION: boolean;
    ENABLEROOMCLEANINGRESERVATION: boolean;
    ENABLEWAKEUPCALL: boolean;
    ENABLETECHNICALSERVICE: boolean;
    ENABLECOMPLAINT: boolean;
    HOTELITEM_CALLCENTEROPERATIONS: boolean;
    ENABLECALLBELLBOY: boolean;
    ENABLELAUNDRY: boolean;
    ENABLEROOMUPGRADE: boolean;
    ENABLEBYTRANSFER: boolean;
    ENABLEMEDICALASSINTANCE: boolean;
    ENABLEDOORKEY: boolean;
    ENABLEOPENROOMDOOR: boolean;
    ENABLEBUYLATECHECKOUT: boolean;
    ENABLERESTAURANTORDER: boolean;
    HIDEPAYMENTLINK: boolean;
    HOTELITEMS_SHOWRATES: number;
    SHOWCOUNTRYCODE: boolean;
    HOTELITEM_FRONTDESK_OPERATION: null;
    HOTELITEM_HOTELIER_SPECIALPRICE: null;
    HOTELITEM_RATECODEVISIBLE: null;
    ROOMCODESMS: null;
    CONTACTPERM_PHONE: null;
    CONTACTPERM_SMS: null;
    CONTACTPERM_EMAIL: null;
    CONTACTPERM_WHATSAPP: null;
    ENABLEONLINESHUTTLE: boolean;
    ENABLEONLINEKIDSCLUB: boolean;
    BASKET_TIMEOUTDURATION: number;
    CURRENTTIME: Date;
    USELOCALDATA: null;
    ONLINECHECKIN_SKIPIDSCAN: boolean;
    ONLINECHECKIN_SKIPSURNAME2: boolean;
    CNAME_WEB: string;
    ROOMTYPEGROUP: string;
    CONFIRMEREMAIL: string;
    photos: HotelPhoto[];
}

export interface HotelPhoto {
    ID: number;
    EXPEDIAHOTELID: null;
    CAPTION: string;
    URL: string;
    WIDTH: number;
    HEIGHT: number;
    BYTESIZE: number;
    THUMBNAILURL: string;
    DEFAULTIMAGE: boolean | null;
    HOTELID: number;
    PORTALID: number;
    SORTID: number;
}

export interface Day {
    Date: string;
    Price: string;
    NetPrice: string;
    Discount: string;
    Availability: number;
    ShowRoomCount?: number;
  }


export interface Room {
    OfferNo?: number;
    PayNowPercent?: number;
    RoomTypeId?: number;
    RateTypeId?: number;
    BoardTypeId?: number;
    MarketId?: number;
    Market?: string;
    RoomCount?: number;
    Commission?: number;
    Price?: number;
    PosCommissionDelta?: number;
    PromotionAmount?: number;
    TotalDiscountApplied?: number;
    DiscountText?: string;
    UnavailableReason?: string;
    IsAvailable?: number;
    BedOptions?: null;
    RoomMaxBed?: number;
    RoomMaxAdult?: number;
    RoomMaxChild?: null;
    RoomMaxBaby?: null;
    RoomImageURL?: string;
    RoomInfo?: string;
    RoomType?: string;
    RateType?: string;
    BoardType?: string;
    StandartBoardType?: string;
    BoardTypeDescription?: string;
    RateCode?: string;
    CancelPolicy?: string;
    Currency?: string;
    HotelImages?: string;
    RoomArea?: string;
    BedType?: string;
    PrivateBath?: boolean;
    Safe?: boolean;
    Wifi?: boolean;
    Balcony?: boolean;
    HairDryer?: boolean;
    PromotionCode?: string;    
    _Days: Day[];
    Days?: string;
    PaymentInformation?: string;
    PriceContract?: number;
    RoomTypeGroupName?: string;
    RoomTypeGroupPhone?: string;
    RoomTypeGroupEmail?: string;
    RoomTypeGroupId?: string;
    PriceBlock?: string;
    Hash?: string;
};

export type Rooms = Room[];



export interface BOOKINGPARAMSRESETDATE {
        BOOKINGPARAMSRESETDATE?: Date;
    HOTELID?: number;
    IPCOUNTRY?: string;
    IPADDRESS?: string;
}

// buradan sonrasını tekrar degerlendireceğiz

export interface Basket {
    PortalId: number;
    Domain: string;
    Items: Items;
    Server: Server;
    Profile: Profile;
    PaymentGate: null;
    PaymentType: PaymentType[];
    Currency: string;
    Agreement: string;
    KvkkAgreement: string;
    BeAwareOfPromotions: boolean;
    AgreementNotShowVoucher: boolean;
    isPreReservation: boolean;
    isPayedPartialPayment: boolean;
    ExchangeRate: number;
    ValidUntil: Date;
    BuyLater: BuyLater;
    Bonus: null;
}

export interface BuyLater {
    Id: string;
    Date: string;
}

export interface Items {
    HotelItems: HotelItem[];
    TicketItems: any[];
    FlightItems: any[];
    TransferItems: any[];
    TourItems: any[];
    ExtraServiceItems: any[];
    MedicalItems: any[];
}

export interface HotelItem {
    ID: number;
    ErsId: number;
    HotelId: number;
    Address: string;
    BoardType: string;
    CheckInTime: string;
    CheckOutTime: string;
    NightCount: number;
    PriceBlock: string;
    _PriceBlock: PriceBlock;
    HotelName: string;
    HotelStar: number;
    LanguageCode: string;
    Latitude: string;
    Longitude: string;
    Person: Person[];
    RateType: string;
    RoomType: string;
    Uid: string;
    HotelImageUrl: string;
    Hash: string;
    RoomCount: number;
    PayAtHotel: boolean;
    PayAtHotelWithCCGuarantee: boolean;
    PayAtHotelWithCCGuaranteeB2B: boolean;
    PayByCC: boolean;
    PayByDownPayment: boolean;
    PayByWire: boolean;
    PayByAgency: boolean;
    PayByMailOrder: boolean;
    PayByMailOrderB2B: boolean;
    PayAtHotelB2B: boolean;
    PayByCCB2B: boolean;
    PayByWireB2B: boolean;
    BankInformation: string;
    IsPreReservation: boolean;
    PaymentInformation: null;
    HotelCity: string;
    HotelCountry: null;
    HotelPhone: string;
    HotelEmail: string;
    paidPrice: number;
    ExtraPaymentInformation: string;
    RoomInfo: string;
    RoomTypeGroupName: null;
    RoomTypeGroupEmail: null;
    RoomTypeGroupPhone: null;
    RoomTypeId: number;
}

export interface Person {
    Gender: string;
    Name: string;
    Surname: string;
    BirthDate: string;
    Phone: string;
    PassNo: string;
    PassDue: string;
    PassCard: string;
    Type: string;
    Age: string;
    RoomNo: number;
}

export interface PriceBlock {
    PriceParams: PriceParams;
    ResParams: ResParams;
    OfferXml: string;
    ProviderCode: string;
}

export interface PriceParams {
    CurrencyCode: string;
    PosId: null;
    InstallmentCount: null;
    PayNowPercent: number;
    Price: number;
    PriceContract: number;
    PromotionCode: string;
    PromotionAmount: number;
    Commission: number;
    CommissionDelta: number;
    PosCommissionDelta: number;
    FinalPrice: number;
    Adult: number;
    ChildAges: string;
    CalculationTime: string;
}

export interface ResParams {
    CancellationInformation: string;
    RoomTypeId: number;
    BoardTypeId: number;
    RateTypeId: number;
    MarketId: null;
    Market: null;
    HotelId: number;
    Checkin: Date;
    Checkout: Date;
    RoomCount: number;
    CountryCode: string;
    _CancellationInformation: string;
    CheckinNote: null;
    CheckoutNote: null;
    RoomNo: null;
}

export interface PaymentType {
    PayableAmount: number;
    Currency: string;
    Name: string;
    Id: number;
}

export interface Profile {
    Name: string;
    Surname: string;
    Email: string;
    Address: string;
    Note: null;
    BasketCookieId: string;
    City: string;
    Country: string;
    Id: string;
    Language: string;
    Phone: string;
    PortalSession: string;
    TaxAddress: string;
    TaxName: string;
    TaxNo: string;
    TaxPlaceName: string;
    TaxType: string;
    TaxPhone: string;
    TaxNotTc: boolean;
    TcCitizen: boolean;
    Use3d: boolean;
    ZipCode: string;
    IAgree: boolean;
    BasketTotalCurrency: string;
    BasketTotalPayment: string;
    ProjectCode: string;
    VoucherNo: string;
}

export interface Server {
    Price: number;
    PromotionAmount: number;
    PayNow: number;
    Commission: number;
    CommisionDelta: number;
    FinalCommissionDelta: number;
    FinalPrice: number;
    BankCommission: number;
    PosCommisionDelta: number;
    PromotionCodes: any[];
    PayedTotalAmount: number;
    PriceContract: number;
    PayNowPercent: number;
    PayNowPercentAmount: number;
}

export interface SearchParams {
    ADULT: number;
    CHECKIN: string;
    CHECKOUT: string;
    CHILDAGES: string;
    COUNTRYCODE: string;
    CURRENCY: string;
    HOTELID: number;
    IPADDRESS: string;
    LANGUAGE: string;
    PORTALID: number;
    PORTALSELLERID: number;
    PROMOCODE: string;
    SESSION: string;
}
