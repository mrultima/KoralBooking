export interface Field {
  visibility: boolean;
  validators: Array<string | { name: string }>;
}


export interface Basket {
  Items?: Items;
  Server?: Server;
  Profile?: Profile;
  Bonus?: Bonus;
  PayType?: string;
  PaymentType?: PaymentType[];
  PaymentGate?: PaymentGate;
  PortalId?: number;
  Domain?: string;
  Session?: string;
  Currency?: string;
  CurrencyRate?: number;
  BuyLater?: { Id: string, Date: string };
  Agreement: string;
  KvkkAgreement: string;
  AgreementNotShowVoucher: boolean;
  Completeds?: Array<any>;
  ReferenceId?: string;
  Language?: string;
  SalesChannelId?: number;
  BeAwareOfPromotions?: boolean;
  /**
   * isPreReservation
   * prereservation => satın almasız rezervasyon oluşacaksa
   * sorsat mekanizması varsa kullanılacak property
   */
  isPreReservation?: boolean;
  PortalSellerId?: number;
  LoginInfo?: loginInfo;
  isPayedPartialPayment?: boolean;
  ExchangeRate: number;
  ValidUntil: string;
  DeltaPrice?: Server;
}

export interface PaymentType {
  Id: number;
  Name: string;
  PayableAmount: number;
  Currency: string;
  isCompleted?: boolean;
  paymentId?: number;
}

export interface Items {
  HotelItems?: any[];
  ExtraServiceItems?: any[];
  // TimeRemaining should be in each item not here
  // TimeRemaining?: string;
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


export interface PriceBlock {
  ResParams: any;
  PriceParams: PriceParams;
  ProviderCode: string;
}

export interface PriceParams {
  Adult: number;
  ChildAges: string;
  PayNowPercent: number;
  Price: number;
  PromotionCode: string;
  PromotionAmount: number;
  CommissionDelta: number;
  PosCommissionDelta: number;
  FinalPrice: number;
  PayNow: number;
  CalculationTime: Date | string;
  InstallmentCount: number;
  PosId: number;
  CurrencyCode: string;
  CountryCode: string;
}

export interface Person {
  Gender?: string;
  Name?: string;
  Surname?: string;
  Email?: string;
  Phone?: string;
  Age?: string;
  IdNo?: string;
  PassportNo?: string;
  BirthDate?: string;
  Nationalty?: string;
  PassCard?: boolean;
  PassDue?: string;
  PassNo?: string;
  Type: 'ADULT' | 'CHILD' | 'BABY' | 'STUDENT' | 'INFANT';
  Ffp?: string;
  FfpType?: string;
  RoomNo?: number;
  HesCode?: string;
}

export interface PaymentSettings {
  'ID': number;
  'PORTALID': number;
  'HOTELID': number;
  'NAME': string;
  'PAYTYPE': number;
  'CC_GUARANTEE': boolean;
  'ISDEFAULT': boolean;
  'APPLY_HOTEL': boolean;
  'PAYMENTTYPE_DESCRIPTION': string;
  'ISGARANTIPAY': boolean;
  'hidenCCForm': boolean;
}

export interface PaymentGate {
  PosId?: number;
  InstallmentCount?: number;
  InstallmentCommission?: number;
  PaymentPrice?: number;
  CommissionPrice?: number;
  CardHolderName?: string;
  CardNumber?: string;
  CardValidMonth?: string;
  CardValidYear?: string;
  CardCvv?: string;
  Currency?: string;
  HotelId?: number;
  IsDebit?: boolean;
  TestMode?: boolean;
  ApiSequenceUrl?: string;
  Email?: string;
  OwnerAddress?: string;
  OwnerCity?: string;
  OwnerCountry?: string;
  OwnerZipCode?: string;
  OwnerPhone?: string;
  Brand?: string;
}

export interface loginInfo {
  CompanyName: string;
  Logo: string;
  Phone: string;
  Email: string;
  Address: string;
  SalesRepresentative: string;
}

export interface Profile {
  Name?: string;
  Surname?: string;
  Email?: string;
  Address?: string;
  Note?: string;
  BasketCookieId?: string;
  City?: any;
  Country?: string;
  Id?: string;
  Tc?: string;
  TaxEmail?: string;
  Language?: string;
  Phone?: string;
  TaxAddress?: any;
  TaxName?: string;
  TaxNo?: any;
  TaxPlaceName?: any;
  TaxType?: string;
  TaxPhone?: string;
  TaxNotTc?: boolean;
  TcCitizen?: boolean;
  Use3d?: boolean;
  ZipCode?: any;
  IAgree?: boolean;
  ProjectCode?: any;
  CitySub?: string;
  VoucherNo?: string;
  HCRID?: string;
}

export interface Bonus {
  Total: number;
  Email: string;
  UpdateDate: string;
  CompleteDate: string;
}

export interface Server {
  InstallmentCount?: number;
  PosId?: number;
  PayNow?: number;
  PayNowPercent?: number;
  Commission?: number;
  CommisionDelta?: number;
  FinalCommissionDelta?: number;
  PosCommisionDelta?: number;
  BankCommission?: number;
  Price?: number;
  FinalPrice?: number;
  ExtraServiceFinalPrice?: number;
  PromotionCodes?: PromotionCode[];
  PromotionAmount?: number;
  PayedTotalAmount?: number;
  PriceContract?: number;
  PayNowPercentAmount?: number;
  PayType?: number;
  Bonus?: number;
  UsedBonus?: number;
  BonusPin?: string;
  BonusGuestID?: number;
  TempCC?: number;
}

export interface PromotionCode {
  // Type: 'HOTEL' | 'ALL' | 'TOUR' | 'TICKET';
  Amount: number;
  Code: string;
}
