export declare class CAuth {
    static LoginByField({ password, ip, device, ...value }: {
        [x: string]: any;
        password: any;
        ip: any;
        device: any;
    }): Promise<{
        tid: any;
        tkey: string;
        _id: any;
        login: any;
    }>;
    static TokenAdd({ user_id, ip, device }: {
        user_id: any;
        ip: any;
        device: any;
    }): Promise<{
        user_id: any;
        key: string;
        ip: any;
        device: any;
    }>;
    static TokenGetByIdKey({ tid, tkey }: {
        tid: any;
        tkey: any;
    }): Promise<any>;
    static AuthVK({ user_id, client_id, client_secret, redirect_uri, code, device, bucket_name }: {
        user_id: any;
        client_id: any;
        client_secret: any;
        redirect_uri: any;
        code: any;
        device: any;
        bucket_name: any;
    }): Promise<{
        tid: any;
        tkey: string;
        _id: any;
        login: any;
    }>;
    static Telegram({ user_id, telegram_token, telegram, bucket_name }: {
        user_id: any;
        telegram_token: any;
        telegram: any;
        bucket_name: any;
    }): Promise<{
        tid: any;
        tkey: string;
        _id: any;
        login: any;
    }>;
}
