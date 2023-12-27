export declare class CFile {
    static Upload({ module, file_form, file_url, object_id, from_id, to_user_id, to_group_id, bucket_name }: {
        module: any;
        file_form: any;
        file_url: any;
        object_id?: any;
        from_id: any;
        to_user_id: any;
        to_group_id: any;
        bucket_name: any;
    }): Promise<any>;
    static GetById(ids: any, collectionName: any): Promise<any>;
    static GetByHash(hash: any, collectionName: any): Promise<any>;
}
