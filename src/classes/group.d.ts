export declare class CGroup {
    static Add(fields: any): Promise<any>;
    static GetById(ids: any): Promise<any>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static Count(fields: any): Promise<any>;
    static Edit(id: any, fields: any): Promise<any>;
    static Delete(id: any, user_id: any): Promise<any>;
    static StatusAccess(fields: any): Promise<boolean>;
}
