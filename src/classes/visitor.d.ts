export declare class CVisitor {
    static Add({ from_id, to_id, minutes }: {
        from_id: any;
        to_id: any;
        minutes?: number;
    }): Promise<boolean>;
    static GetByUser({ from_id, to_id, minutes }: {
        from_id: any;
        to_id: any;
        minutes?: number;
    }): Promise<any>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
}
