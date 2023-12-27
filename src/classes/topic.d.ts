export declare class CTopic {
    static Add(fields: any): Promise<{
        image_id: any;
        title: any;
        from_id: any;
        to_group_id: any;
        to_user_id: any;
        change_user_id: any;
        change_date: Date;
        create_date: Date;
        count_view: number;
        count_comment: number;
        count_like: number;
        count_dislike: number;
        count_repeat: number;
    }>;
    static GetById(ids: any): Promise<any>;
    static Edit(id: any, fields: any): Promise<any>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static Count(): Promise<any>;
}
