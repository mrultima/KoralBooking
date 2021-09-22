import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../api.service';
import { SearchBoxService } from '../searchbox/searchbox.service';
import { HotelModel, RoomList } from '../types';
import { AppService } from './app.service';

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
    KvkkAgreement?: string;
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
    LoginInfo?: LoginInfo;
    isPayedPartialPayment?: boolean;
    ExchangeRate?: number;
    ValidUntil?: string;
    DeltaPrice?: Server;
    ItemCount?: number;
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
    CommissonPrice?: number;
}

export interface LoginInfo {
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
    PortalSession?: string;
    BasketTotalCurrency?: string;
    BasketTotalPayment?: string;
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
    Promotion?: number;
}

export interface PromotionCode {
    // Type: 'HOTEL' | 'ALL' | 'TOUR' | 'TICKET';
    Amount: number;
    Code: string;
}


@Injectable({
    providedIn: 'root'
})
export class BasketService {

    hostName = window.location.protocol + '//' + window.location.hostname;

    readonly deleted$ = new Subject<number>();

    readonly basket$ = new BehaviorSubject<Basket>({
        PortalId: 1,
        Domain: this.hostName,
        Items: {
            HotelItems: [],
            ExtraServiceItems: []
        },
        ItemCount: 0,
        Server: {},
        Profile: {},
        PaymentGate: {},
        PaymentType: [],
        Currency: this.appService.currency.getValue() || 'TRY',
        Agreement: '',
        KvkkAgreement: '',
        BeAwareOfPromotions: false,
        AgreementNotShowVoucher: false,
        isPreReservation: false,
        isPayedPartialPayment: false,
        ExchangeRate: 1,
        ValidUntil: moment().toISOString()
    });

    get basket(): Basket {
        return this.basket$.getValue();
    }

    constructor(
        private appService: AppService,
        private apiService: ApiService,
        private searchboxService: SearchBoxService
    ) {
        this.calculateBasketServer();
    }

    sumBasketThings(func): number {
        // tslint:disable-next-line: max-line-length
        return [
            ...this.basket.Items.HotelItems,
            ...this.basket.Items.ExtraServiceItems,
        ].reduce(func, 0);
    }

    calculateBasketServer(): void {

        const basket = this.basket;

        if (!basket.Items.ExtraServiceItems) {
            basket.Items.ExtraServiceItems = [];
        }

        basket.ItemCount = this.sumBasketThings((acc, v) => acc + 1);

        if ((basket.Items.HotelItems && basket.Items.HotelItems.length > 0)
            || (basket.Items.ExtraServiceItems && basket.Items.ExtraServiceItems.length > 0)) {
            if (basket.DeltaPrice) {
                return;
            }
            basket.Server.UsedBonus = 0;
            basket.Server.Price = this.sumBasketThings((acc, value) => acc +
                (value != null && value._PriceBlock != null ? value._PriceBlock.PriceParams.FinalPrice : 0));
            basket.Server.PromotionAmount = 0;
            basket.Server.Commission = 0;
            basket.Server.FinalCommissionDelta = 0;
            basket.Server.CommisionDelta = 0;
            basket.Server.PosCommisionDelta = 0;
            basket.Server.FinalPrice = (basket.Server.Price - basket.Server.Commission) + (basket.Server.FinalCommissionDelta || 0) +
                (basket.Server.BankCommission || 0);
            basket.Server.PayNow = basket.Server.FinalPrice;
            basket.Server.PriceContract = this.sumBasketThings((acc, value) => acc +
                (value != null && value._PriceBlock != null && value._PriceBlock.PriceParams.PriceContract ?
                    value._PriceBlock.PriceParams.PriceContract : (value._PriceBlock.PriceParams.FinalPrice || 0)));
            basket.Server.PayNowPercent = this.sumBasketThings((acc, value) => acc +
                (value != null && value._PriceBlock != null && value._PriceBlock.PriceParams.PayNowPercent ?
                    value._PriceBlock.PriceParams.PayNowPercent : 0));

            basket.Server.PayNowPercentAmount = this.sumBasketThings((acc, value) => acc +
                (value != null && value._PriceBlock != null ?
                    (value._PriceBlock.PriceParams.FinalPrice * value._PriceBlock.PriceParams.PayNowPercent / 100) : 0));
            basket.Items.ExtraServiceItems.forEach(row => {
                const selectedPrice = row.SelectedPrice;
                basket.Server.PayNowPercentAmount += selectedPrice;
                row.Price = selectedPrice * (1 - Math.abs(basket.Server?.CommisionDelta / basket.Server?.Price));
            });

            let extraServicePrice = 0;
            switch (+basket.Server.PayType) {
                case 1: // tamamı
                    basket.Server.PayNow = basket.Server.PayNow;
                    break;
                case 2: // kaporalı
                    basket.Items.ExtraServiceItems.forEach(row => {
                        extraServicePrice += row.SelectedPrice * (1 - Math.abs(basket.Server?.CommisionDelta / basket.Server?.Price));
                    });
                    basket.Server.PayNow = (basket.Server.FinalPrice - extraServicePrice) *
                        basket.Server.PayNowPercent / 100 + extraServicePrice;
                    break;
                case 3: // net tutar yani acenta komisyonu hariç
                    basket.Server.PayNow = basket.Server.FinalPrice - (basket.Server.FinalCommissionDelta);
                    break;
            }

            basket.Items.ExtraServiceItems.forEach(row => {
                extraServicePrice += +(row.SelectedPrice - row.Price);
            });

            basket.Server.ExtraServiceFinalPrice = extraServicePrice;
        } else {
            basket.Server.Price = 0;
            basket.Server.PromotionAmount = 0;
            basket.Server.PayNow = 0;
            basket.Server.Commission = 0;
            basket.Server.CommisionDelta = 0;
            basket.Server.FinalCommissionDelta = 0;
            basket.Server.FinalPrice = 0;
            basket.Server.BankCommission = 0;
            basket.Server.PosCommisionDelta = 0;
            basket.Server.PromotionCodes = [];
            basket.Server.PayedTotalAmount = 0;
            basket.Server.PriceContract = 0;
            basket.Server.PayNowPercent = 0;
            basket.Server.PayNowPercentAmount = 0;
        }
        this.notify();
        console.log('basket', basket);
    }

    async removeBasketHotelItem(hotelItem): Promise<void> {
        const basket = this.basket;

        if (basket.Items.HotelItems.length > 0) {
            const result = basket.Items.HotelItems.findIndex(value => value.ID === hotelItem.ID);
            if (result > -1) {
                basket.Items.HotelItems.splice(result, 1);
                this.deleted$.next(result);
            }
            this.calculateBasketServer();
        }
    }

    async selectRoom(room: RoomList, roomCount: number, isPreReservation = false, sendBasket = false): Promise<void> {
        let isBasketItem = false;
        let addItemCount = 0;
        const searchValue = this.searchboxService.searchFormGroup.getRawValue();
        this.basket.Items.HotelItems.map(val => {
            const basketItemP = {
                BoardTypeId: val._PriceBlock.ResParams.BoardTypeId,
                Checkin: val._PriceBlock.ResParams.Checkin,
                Checkout: val._PriceBlock.ResParams.Checkout,
                HotelId: val._PriceBlock.ResParams.HotelId,
                MarketId: val._PriceBlock.ResParams.MarketId,
                RateTypeId: val._PriceBlock.ResParams.RateTypeId,
                RoomTypeId: val._PriceBlock.ResParams.RoomTypeId
            };
            const roomP = {
                BoardTypeId: room._PriceBlock.ResParams.BoardTypeId,
                Checkin: room._PriceBlock.ResParams.Checkin,
                Checkout: room._PriceBlock.ResParams.Checkout,
                HotelId: room._PriceBlock.ResParams.HotelId,
                MarketId: room._PriceBlock.ResParams.MarketId,
                RateTypeId: room._PriceBlock.ResParams.RateTypeId,
                RoomTypeId: room._PriceBlock.ResParams.RoomTypeId
            };
            // XMl lerde aynı odadan ikincisini ekletmeme için oda sayısına bakıp ekletiyoruz..
            if (JSON.stringify(basketItemP) === JSON.stringify(roomP)) {
                addItemCount += room.AddedRoom;
            }
        });

        if (addItemCount !== 0 && room.RoomCount < (roomCount + addItemCount)) {
            isBasketItem = true;
        }

        const hotel = this.apiService.hotelConfig;
        let personArray = [];

        const personAdult = Array.from({ length: +searchValue.ADULT }, () => ({ Type: 'ADULT', Age: null, RoomNo: 1 }));
        const personBaby: Person[] = [];
        const personChild: Person[] = [];
        searchValue.Children = Array.isArray(searchValue.Children) ? searchValue.Children.join(' ') : searchValue.Children;
        Array.from({ length: searchValue.CHILDAGES || 0 }, () => {
            personChild.push({ Type: 'CHILD', Age: hotel.MaxChildAge, RoomNo: 1 });
        });
        personArray = [...personAdult, ...personChild, ...personBaby];
        const roomPerson = [];
        if (roomCount > 1) {
            for (let i = 1; i < roomCount; i++) {
                personArray.forEach(x => {
                    roomPerson.push({ Type: x.Type, Age: x.Age, RoomNo: x.RoomNo + i });
                });
            }
        }
        if (roomPerson.length > 0) {
            personArray = [...personArray, ...roomPerson];
        }
        const hotelModel = {
            ID: 2,
            ErsId: hotel.ErsId,
            HotelId: this.appService.hotelID || hotel.ErsId || +hotel?.HOTELID || 0,
            HotelBedsId: null,
            Address: hotel.Address,
            BoardType: room.BoardType,
            CheckInTime: hotel.CheckinTime || '14:00',  // hotelConfig
            CheckOutTime: hotel.CheckoutTime || '12:00', // hotelConfig
            NightCount: searchValue.DAYS,
            PriceBlock: room.PriceBlock,
            _PriceBlock: room._PriceBlock,
            HotelName: hotel.HotelName,
            HotelStar: hotel.Stars,
            LanguageCode: '', // main service
            Latitude: hotel.Latitude,
            Longitude: hotel.Longitude,
            Person: personArray,
            RateType: room.RateType,
            RoomType: room.RoomType,
            Uid: hotel.Uid,
            HotelImageUrl: room.RoomImageURL,
            Hash: room.Hash,
            RoomCount: roomCount,
            PayAtHotel: hotel.PayAtHotel || false,
            PayAtHotelWithCCGuarantee: hotel.PayAtHotelWithCCGuarantee || false,
            PayAtHotelWithCCGuaranteeB2B: hotel.PayAtHotelWithCCGuaranteeB2B || false,
            PayByCC: hotel.PayByCC || false,
            PayByDownPayment: hotel.PayByDownPayment || false,
            PayByWire: hotel.PayByWire || false,
            PayByAgency: hotel.PayByAgency || false,
            PayByMailOrder: hotel.PayByMailOrder || false,
            PayByMailOrderB2B: hotel.PayByMailOrderB2B || false,
            PayAtHotelB2B: hotel.PayAtHotelB2B || false,
            PayByCCB2B: hotel.PayByCCB2B || false,
            PayByWireB2B: hotel.PayByWireB2B || false,
            BankInformation: hotel.BankInformation,
            IsPreReservation: room.IsPreReservation ? room.IsPreReservation : isPreReservation,
            PaymentInformation: room.PaymentInformation,
            HotelCity: hotel.City,
            HotelCountry: hotel.Country,
            HotelPhone: hotel.Phone,
            HotelEmail: hotel.Email,
            paidPrice: 0,
            ExtraPaymentInformation: hotel.ExtraPaymentInformation,
            RoomCode: room.RoomCode,
            SearchKey: room.SearchKey,
            RoomInfo: room.RoomInfo,
            RoomTypeGroupName: room.RoomTypeGroupName,
            RoomTypeGroupEmail: room.RoomTypeGroupEmail,
            RoomTypeGroupPhone: room.RoomTypeGroupPhone,
            RoomTypeId: room.RoomTypeId
        };
        let hm: any = hotelModel;
        if (roomCount > 1) {
            hm = await this.changeHotelModelForRoomCount(hotelModel, roomCount);
        }
        await this.addToHotelItems(hm, sendBasket);
    }

    async changeHotelModelForRoomCount(hotelModel: HotelModel, roomCount: number): Promise<HotelModel> {
        const resp = await this.apiService.apiReq({
            Action: 'Execute',
            Object: 'SP_PORTALV4_HOTELDETAILPRICE',
            Parameters: {
                HOTELID: hotelModel._PriceBlock.ResParams.HotelId || null,
                CHECKIN: hotelModel._PriceBlock.ResParams.Checkin || null,
                CHECKOUT: hotelModel._PriceBlock.ResParams.Checkout || null,
                ADULT: hotelModel._PriceBlock.PriceParams.Adult || null,
                CHILDAGES: hotelModel._PriceBlock.PriceParams.ChildAges || null,
                CURRENCY: hotelModel._PriceBlock.PriceParams.CurrencyCode || null,
                LANGUAGE: this.appService.language.getValue() || null,
                PROMOCODE: hotelModel._PriceBlock.PriceParams.PromotionCode || null,
                SESSION: null,
                COUNTRYCODE: hotelModel._PriceBlock.ResParams.CountryCode || null,
                IPADDRESS: null,
                PORTALSELLERID: null,
                POSID: hotelModel._PriceBlock.PriceParams.PosId || null,
                INSTALLMENT: hotelModel._PriceBlock.PriceParams.InstallmentCount || null,
                ROOMTYPEID: hotelModel._PriceBlock.ResParams.RoomTypeId || null,
                RATETYPEID: hotelModel._PriceBlock.ResParams.RateTypeId || null,
                BOARDTYPEID: hotelModel._PriceBlock.ResParams.BoardTypeId || null,
                ROOMCOUNT: roomCount
            }
        }).toPromise();
        if (!resp[0][0]) {
            alert('Error! Please try again later');
            return null;
        }
        hotelModel._PriceBlock = JSON.parse(resp[0][0].PriceBlock);
        hotelModel.PriceBlock = resp[0][0].PriceBlock;
        hotelModel.Hash = resp[0][0].Hash;
        return hotelModel;
    }

    async addToHotelItems(item: HotelModel, sendBasket = false): Promise<void> {

        const basket = this.basket;
        basket.Currency = this.appService.currency.getValue();
        if (basket.Items.HotelItems.length > 0) {
            item.ID = basket.Items.HotelItems[basket.Items.HotelItems.length - 1].ID + 1;
        } else {
            item.ID = 0;
        }
        basket.Items.HotelItems.push(item);
        basket.isPreReservation = item.IsPreReservation;

        this.calculateBasketServer();
    }

    notify(): void {
        this.basket$.next(this.basket);
    }

    async completeRes(): Promise<any> {
        const items = this.basket.Items.HotelItems;
        const reqList = [];
        // tslint:disable-next-line: forin
        for (const index in items) {
            reqList.push(
                this.apiService.apiReq({
                    Action: 'Execute',
                    Object: 'SP_PORTALV4_HOTELCOMPLETERES',
                    Parameters: {
                        BASKET: JSON.stringify(this.basket),
                        BASKETITEMINDEX: index,
                        DRYRUN: 0
                    }
                }).toPromise()
            );
        }
        return await Promise.all(reqList);
    }

    async contactInsert(row: { [key: string]: any }): Promise<void> {
        const result = {};
        for (const rowKey of Object.keys(row)) {
            result[rowKey.toUpperCase()] = row[rowKey];
        }

        const basket = this.basket;

        try {
            const resp = await this.apiService.apiReq({
                Action: 'Execute',
                Object: 'SP_PORTALV4_SAVECONTACTREQUEST',
                Parameters: {
                    ...result, ...{
                        RESERVATIONREQUEST: JSON.stringify(this.basket),
                        SESSION: null,
                        HOTELID: this.appService.hotelID,
                        CALLID: this.appService.getCookie('callid'),
                        HCRID: basket.Profile.HCRID,
                    }
                }
            }).toPromise();
            basket.BuyLater = {
                Id: resp[0][0].UID,
                Date: this.appService.getDate(moment())
            };
        } catch (e) {
            console.error(e);
        }
    }
}
