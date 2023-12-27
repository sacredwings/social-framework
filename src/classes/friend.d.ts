export declare class CFriend {
    static Add(fields: any): Promise<boolean>;
    static Delete(fields: any): Promise<boolean>;
    static GetByUser(fields: any): Promise<any>;
    static StatusByUser(fields: any): Promise<false | "none" | "friend" | "viewed" | "in" | "out">;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static CountNotViewed(fields: any): Promise<any>;
}
