export declare class CAlbum {
    static Add({ module, ...fields }: {
        [x: string]: any;
        module: any;
    }): Promise<{
        [x: string]: any;
    }>;
    static GetById(ids: any, module: any): Promise<any>;
    static Edit(id: any, fields: any): Promise<any>;
    static Get(fields: any): Promise<any>;
    static GetCount(fields: any): Promise<any>;
    static Count(module: any): Promise<any>;
}
