export declare class CMessage {
    static Add(fields: any): Promise<{
        from_id: any;
        to_id: any;
        text: any;
        video_ids: any;
        img_ids: any;
        doc_ids: any;
        audio_ids: any;
        read: any;
        delete_from: any;
        delete_to: any;
        create_date: any;
        change_date: any;
    }>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static CountNoRead(fields: any): Promise<any>;
    static GetById(ids: any): Promise<any>;
    static Delete(id: any, myUserId: any): Promise<any>;
    static ReadAll(fields: any): Promise<any>;
    static Edit(id: any, fields: any): Promise<any>;
}
