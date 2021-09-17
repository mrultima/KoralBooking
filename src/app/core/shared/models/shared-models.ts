export interface BasketConfig {
  'ID': number;
  'PORTALID': number;
  'HOTELID': number;
  'BASKET_ISPOPUP': boolean;
  'CALL_BUTTON': boolean;
  'PRINT_BUTTON': boolean;
  'MAIL_BUTTON': boolean;
  'HOMEPAGE_BUTTON': boolean;
  'SHOPPINGGO_BUTTON': boolean;
  // Bütün hotel misafir bilgilerini kapat
  'HOTELPERSON_ALLROW': boolean;
  'HOTELPERSON_GENDER': boolean;
  'HOTELPERSON_NAME': boolean;
  'HOTELPERSON_SURNAME': boolean;
  'HOTELPERSON_BIRTHDATE': boolean;
  'HOTELPERSON_NATIONALITY': boolean;
  'HOTELPERSON_MAIL': boolean;
  'HOTEL_SEARCHBOXPROMOTION_VISIBLE': boolean;
  'HOTELPERSON_PHONE': boolean;
  'HOTELPERSON_PASSPORTNO': boolean;
  'HOTELPERSON_PASSPORTDATE': boolean;
  'HOTELPERSON_IDENTTYNO': boolean;
  'HOTELPERSON_HESKODU': boolean;
  'HOTELPERSON_HESKODU_REQURIED': boolean;
  'FLIGHTPERSON_ALLROW': boolean;
  'FLIGHTPERSON_GENDER': boolean;
  'FLIGHTPERSON_NAME': boolean;
  'FLIGHTPERSON_SURNAME': boolean;
  'FLIGHTPERSON_BIRTHDATE': boolean;
  'FLIGHTPERSON_NATIONALITY': boolean;
  'FLIGHTPERSON_PASSPORTNO': boolean;
  'FLIGHTPERSON_PASSPORTDATE': boolean;
  'FLIGHTPERSON_MAIL': boolean;
  'FLIGHTPERSON_PHONE': boolean;
  'FLIGHTPERSON_IDENTTYNO': boolean;
  'FLIGHTPERSON_FFP': boolean;
  'FLIGHTPERSON_FFPTYPE': boolean;
  'TRANSFERPERSON_ALLROW': boolean;
  'TRANSFERPERSON_GENDER': boolean;
  'TRANSFERPERSON_NAME': boolean;
  'TRANSFERPERSON_SURNAME': boolean;
  'TRANSFERPERSON_BIRTHDATE': boolean;
  'TRANSFERPERSON_NATIONALITY': boolean;
  'TRANSFERPERSON_MAIL': boolean;
  'TRANSFERPERSON_PHONE': boolean;
  'TRANSFERPERSON_PASSPORTNO': boolean;
  'TRANSFERPERSON_PASSPORTDATE': boolean;
  'TRANSFERPERSON_IDENTTYNO': boolean;
  'TOURPERSON_ALLROW': boolean;
  'TOURPERSON_GENDER': boolean;
  'TOURPERSON_NAME': boolean;
  'TOURPERSON_SURNAME': boolean;
  'TOURPERSON_BIRTHDATE': boolean;
  'TOURPERSON_NATIONALITY': boolean;
  'TOURPERSON_MAIL': boolean;
  'TOURPERSON_PHONE': boolean;
  'TOURPERSON_PASSPORTNO': boolean;
  'TOURPERSON_PASSPORTDATE': boolean;
  'TOURPERSON_IDENTTYNO': boolean;
  'CONTACT_NAME': boolean;
  'CONTACT_SURNAME': boolean;
  'CONTACT_MAIL': boolean;
  'CONTACT_PHONE': boolean;
  'CONTACT_ADDRESS': boolean;
  'CONTACT_CITY': boolean;
  'CONTACT_ZIPCODE': boolean;
  'CONTACT_COUNTRY': boolean;
  'CONTACT_EXTRANOT': boolean;
  'CONTACT_TC': boolean;
  'BASKET_INVOCE_VISIBLE': boolean;
  'BASKET_ADDRESS_VISIBLE': boolean;
  'BASKET_CITY_VISIBLE': boolean;
  'BASKET_POSTCODE_VISIBLE': boolean;
  'BASKET_COUNTRTY_VISIBLE': boolean;
  'BASKET_EXTRANOT_VISIBLE': boolean;
  'BASKET_BONUSCARD_VISIBLE': boolean;
  'BASKET_CARDFINANS_VISIBLE': boolean;
  'BASKET_AXESSCARD_VISIBLE': boolean;
  'BASKET_MAXIMUMCARD_VISIBLE': boolean;
  'BASKET_PARAFCARD_VISIBLE': boolean;
  'BASKET_WORDCARD_VISIBLE': boolean;
  'USE3DPAY': boolean;
  'IMAGES_INVISIBILITY': boolean;
  'HOTEL_INFO_INVISIBILITY': boolean;
  'HOTEL_DESCRIPTION_INVISIBILITY': boolean;
  'RATECODE_INVISIBILITY': boolean;
  'COMMENT_INVISIBILITY': boolean;
  'HOTEL_FACILITY_INVISIBILITY': boolean;
  'GALERY_INVISIBILITY': boolean;
  'CUSTOM_CONT1_INVISIBILITY': boolean;
  'CUSTOM_CONT2_INVISIBILITY': boolean;
  'CLICKTOCALL_TAB_INVISIBILITY': boolean;
  'CLICKTOCALL_INVISIBILITY': boolean;
  'HOTEL_MAP_INVISIBILITY': boolean;
  'TRANSFERPERSON_BIRTHDATE_REQURIED': boolean;
  'TRANSFERPERSON_GENDER_REQUIRED': boolean;
  'HOTELPERSON_BIRTHDATE_REQURIED': boolean;
  'TOURPERSON_BIRTHDATE_REQURIED': boolean;
  'FLIGHTPERSON_BIRTHDATE_REQURIED': boolean;
  'TOURITEM_DESCRIPTION': string;
  'HOTELITEM_DESCRIPTION': string;
  'TRANSFERITEM_DESCRIPTION': string;
  'FLIGHTITEM_DESCRIPTION': string;
  'EXTRASERVICE': boolean;
  'HOTELPERSON_VISA': boolean;
  'HOTELPERSON_FLIGHT': boolean;
  'TOURPERSON_VISA': boolean;
  'TOURPERSON_FLIGHT': boolean;
  'CUSTOMVALIDATIONS': string;
  'HOTELPERSON_SELECTADD': boolean;
  'PROJECTCODE_VISIBLE': boolean;
  'PORTALSELLERID': number;
  'HOTELPERSON_PASSPORTNO_REQURIED': boolean;
  'TOURPERSON_PASSPORTNO_REQURIED': boolean;
  'TRANSFERPERSON_PASSPORTNO_REQURIED': boolean;
  'FLIGHTPERSON_PASSPORTNO_REQURIED': boolean;
  'PROJECT_REQURIED': boolean;
  'MULTICREDITCARDPAYMENT_VISIBLE': boolean;
  'SENDBASKETMAIL_VISIBLE': boolean;
  'SUBDOMAIN': string;
  'CC_PHONE_VISIBLE': boolean;
  'CC_PHONE_REQURIED': boolean;
  'PHONE_REQURIED': boolean;
  'EMAIL_REQURIED': boolean;
  'BASKET_INVOICE_REQURIED': boolean;
  'BASKET_COUNTRTY_REQURIED': boolean;
  'BASKET_CITY_REQURIED': boolean;
  'BASKET_POSTCODE_REQURIED': boolean;
  'HOTELPERSON_GENDER_REQUIRED': boolean;
  'FLIGHTPERSON_GENDER_REQUIRED': boolean;
  'PASSISSUECITY_VISIBLE': boolean;
  'PASSISSUEDATE_VISIBLE': boolean;
  'BASKET_INSTALLMENT_VISIBLE': boolean;
  'TOURPERSON_PASSCARD': boolean;
  'PROFILE_TCCITIZEN_VISIBLE': boolean;
  'PROFILE_TCCITIZEN_DISCRIPTION': string;
  'TOUR_EXTRANOTE_VISIBLE': boolean;
  'TRANSFER_FLIGHTNO_VISIBLE': boolean;
  'PAYAT_SERVICE_VISIBLE': boolean;
  'HOTEL_CHILDBIRTDHDATEREQUIRED': boolean;
  'SAVECREDITCARD': boolean;
  'BUYLATERBUTTON_VISIBLE': boolean;
  'HOTELROOMTYPEIMAGE_VISIBLE': boolean;
  'HOTELROOMDAILYPRICE_VISIBLE': boolean;
  'TICKETPERSON_ALLROW': boolean;
  'VOUCHERPRICE_VISIBLE': boolean;
  'BASKET_INSTALLMENT_OPEN': boolean;
  'BASKET_RESERVATION_INFO': boolean;
  'HOTELVOUCHER_VISIBLE': boolean;
  'VOUCHER_BANKCOMMISSION_VISIBLE': boolean;
  'VOUCHER_EXCHANGE_VISIBLE': boolean;
  'VOUCHER_CARDDETAIL_VISIBLE': boolean;
  'VOUCHER_PAYEDAMOUNT_VISIBLE': boolean;
  'BASKET_KDV_SERVICE_MSG_VISIBLE': boolean;
  'BASKET_INVOCE_TC_VISIBLE': boolean;
  'BASKET_INVOCE_TAXNO_VISIBLE': boolean;
  'BASKET_INVOCE_TAXPLACENAME_VISIBLE': boolean;
  'BASKET_AGREEMENTKVKK_CHECK_VISIBLE': boolean;
  'PAYTYPE': string;
  'BASKET_PROMOTION_VISIBLE': boolean;
  'HIDEPAYMENT_IF_WIRETRANSFER': boolean;
  'ROOMCODESMS': boolean;
  'CONTACTPERM_SMS': boolean;
  'CONTACTPERM_PHONE': boolean;
  'CONTACTPERM_EMAIL': boolean;
  'CONTACTPERM_WHATSAPP': boolean;
}


export interface LoginResponseModel {
  'LOGINTYPE': string;
  'ID': number;
  'SESSION': string;
  'NAME': string;
  'FLIGHT_COMISSION_RATIO': number;
  'USERID': number;
  'PORTALSELLERID': number;
  'MARKETID': number;
  'ADMINLEVEL': number;
  'ROLENAME': string;
  'AGENCYTAXINFO': AgencyTaxInfo;
  'SELLEREMAIL': string;
  'HOTELID': number;
  'AGENTID': string;
  'APIKEY': string;
  'APIURL': string;
  'USERCODE': string;
}

export interface AgencyTaxInfo {
  'AGENCYTRADENAME': string;
  'COMPANYNAME': string;
  'TAXADDRESS': string;
  'TAXBUILDINGNUMBER': string;
  'TAXCITY': string;
  'TAXCITYSUB': string;
  'TAXCODE': string;
  'TAXCOMPANYNAME': string;
  'TAXCOUNTRY': string;
  'TAXNO': string;
  'TAXPLACENAME': string;
  'TAXROOM': string;
  'TAXZIPCODE': string;
}


export interface SendFrom {
  Description: string;
  isSend: boolean;
  Icon: string;
}

export interface CompleteResResult {
  resp: { MESSAGE: string, PNR: string, RESID: number };
  item: { type: types, value: any };
}

export interface Completeds {
  resId: number;
  pnr: string;
  CreateDate: string;
  item: { type: types, value: any };
}

export interface CompleteItems {
  completeItem: any;
  resId: any;
  arrInfo: any;
}

export type types = 'hotel' | 'extraService';

export interface YandexMapData {
  coordinates: Array<number>;
  Name: string;
  HotelBedsId?: number;
  ErsId?: number;
  Stars?: number;
  PhotoUrl: string;
  SeoUrl?: string;
  [k: string]: any;
}
