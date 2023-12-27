export declare const Store: {
    GetMinioClient: (config: any) => any;
    SetMinioClient: (config: any, compulsion?: boolean) => Promise<any>;
    GetMongoClient: () => any;
    SetMongoClient: ({ MongoClient, ObjectId }: {
        MongoClient: any;
        ObjectId: any;
    }, { url, dbName }: {
        url: any;
        dbName: any;
    }) => Promise<any>;
    GetMongoObjectId: () => any;
    GetTest: () => any;
    SetTest: (config: any) => void;
};
