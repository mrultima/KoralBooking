
export declare module PostResponse {

  export interface PostResult {
    Result: number;
    Message?: any;
    ErrorMessages: any[];
    Status: any[];
    ReasonCode?: any;
    ApprCode?: any;
    AuthCode?: any;
    ProcReturnCode?: any;
    RefNo?: any;
    Form: string;
    Eci?: any;
    XId?: any;
    Cavv?: any;
    PayerAuthenticationCode?: any;
    PayerTxnId?: any;
    CampaignLink?: any;
  }

  export interface Result {
    TransactionId: string;
    postViewName?: any;
    CardType: string;
    CardNo: string;
    ExpYear: string;
    ExpMonth: string;
    CVV2: string;
    CardHolderName: string;
    CardPhoneNumber?: any;
    Amount: number;
    Currency: number;
    Installment: string;
    InstallmentMerge: boolean;
    InstallmentCom: number;
    Random?: any;
    PostResult: PostResult;
    Hash?: any;
    Lang: string;
    StoreType: string;
    ProfileUID: string;
    BasketUID: string;
    BasketID: string;
    BasketItemsName: string;
    OrderType?: any;
    OrderId?: any;
    OrderUID: string;
    TransStatus: number;
    billingAddress?: any;
    billingCountry?: any;
    billingCity?: any;
    billingZipCode?: any;
    customEmail?: any;
    billingNo?: any;
    sellerID?: any;
    transactionStartDate?: any;
    transactionEndDate?: any;
    callBackUrl: string;
    hotelId: number;
    eMail?: any;
    phone?: any;
    description?: any;
    transType: number;
    isTest?: any;
    PostBack3dPay?: any;
    PostBack3d?: any;
    use3D: boolean;
    isDebit: boolean;
  }

  export interface RootObject {
    Result: Result;
  }

}
