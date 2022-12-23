import { DB } from "../db";

export class CForum {


    //загрузка
    static async Get ( fields ) {
        try {
            let collection = DB.Client.collection('group')

            let Aggregate = [{
                $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo'
                }
            },{
                $lookup: {
                    from: 'topic',
                    localField: '_id',
                    foreignField: 'group_id',
                    as: '_topic',
                    pipeline: [{
                        $lookup: {
                            from: 'user',
                            localField: 'change_user_id',
                            foreignField: '_id',
                            as: '_change_user_id',
                            pipeline: [{
                                $lookup: {
                                    from: 'file',
                                    localField: 'photo',
                                    foreignField: '_id',
                                    as: '_photo'
                                }
                            },{
                                $unwind: {
                                    path: '$_photo',
                                    preserveNullAndEmptyArrays: true
                                }
                            }]
                        }
                    },{
                        $lookup: {
                            from: 'file',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_id'
                        }
                    },{
                        $unwind: {
                            path: '$_file_id',
                            preserveNullAndEmptyArrays: true
                        }
                    },{
                        $unwind: {
                            path: '$_change_user_id',
                            preserveNullAndEmptyArrays: true
                        }
                    }]
                }
            },{
                $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $sort: {
                    _id: -1
                }
            }]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CForum Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let collection = DB.Client.collection('group')

            let Aggregate = [{
                $count: 'count'
            }]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CForum GetCount'})
        }
    }

/*
    static async Count ( fields ) {
        try {
            let collection = DB.Client.collection('topic');

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic Count'})
        }
    }*/


}