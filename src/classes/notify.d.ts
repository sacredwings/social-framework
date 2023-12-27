export declare class CNotify {
    static Add(fields: any): Promise<false | {
        from_id: any;
        to_id: any;
        action: any;
        viewed: any;
        create_date: any;
    }>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static NoViewedCount(fields: any): Promise<any>;
}
