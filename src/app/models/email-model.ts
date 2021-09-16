
export interface EmailModel {
    Email: string;
    Subject: string,
    ContentObj?: any,
    Content? : string,
    ContentType: string,
    HotelId: number,
    PortalId: number,
		CcTo?: string | string[],
		BccTo?: string | string[],
    ReplyTo?: string[]
}