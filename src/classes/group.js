import {DB} from "./db";
import CFile from './file'

export default class {

    //добавить новую группу
    static async Add ( fields ) {
        try {
            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}group`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CGroup Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('group');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let aggregate = [
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]
            let result = await collection.aggregate(aggregate).toArray();

            return result

            /*
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}group WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {

                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }

                if (item.photo_big) {
                    item.photo_big = await CFile.GetById([item.photo_big]);
                    item.photo_big = item.photo_big[0]
                }

                item.create_id = Number (item.create_id)

                return item;
            }));

            return result
*/
        } catch (err) {
            console.log(err)
            throw ({err: 4002000, msg: 'CGroup GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)

            let collection = DB.Client.collection('group');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            create_id: fields.user_id
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                }

            ]).limit(fields.count).skip(fields.offset).toArray();

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 4003000, msg: 'CGroup Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = DB.Client.collection('group');

            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.count(
                {
                    create_id: fields.user_id
                }
            )

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 4004000, msg: 'CGroup GetCount'})
        }
    }

    //количество всех видео
    static async Count ( fields ) {
        try {
            let collection = DB.Client.collection('group');
            let result = await collection.count()

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CGroup Count'})
        }
    }

    //пользователи
    static async GetUsers ( items ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            /* выгрузка индентификаторов из объектов / пользователей */
            let arUsersId = items.map((item, i) => {
                return item.create_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let collection = DB.Client.collection('user');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: arUsersId}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            /*
            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))*/

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 4005000, msg: 'CGroup GetUsers'})
        }
    }

    static async Update ( id, fields ) {
        try {
            let result = await DB.Init.Update (`${DB.Init.TablePrefix}group`, fields, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4006000, msg: 'CGroup Update'})
        }
    }

    //удаление группы
    static async Delete ( id ) {
        try {
            let result = await DB.Init.Update (`groups`, {delete: true}, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4007000, msg: 'CGroup Delete'})
        }
    }

    //поиск по группам
    static async Search ( fields ) {
        try {
            let collection = DB.Client.collection('group');

            let arAggregate = []

            if (fields.q) arAggregate.push(
                {
                    $match:
                        {
                            $text: {
                                $search: fields.q
                            }
                        },
                }
            )

            arAggregate.push(
                {
                    $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                }
                            ]
                        },
                },
                {
                    $lookup:
                        {
                            from: 'user',
                            localField: 'create_id',
                            foreignField: '_id',
                            as: '_create_id',
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                },
                {
                    $unwind:
                        {
                            path: '$_create_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            )

            let result = await collection.aggregate(arAggregate).limit(fields.count).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CGroup Search'})
        }
    }

    //количество / поиск
    static async SearchCount ( fields ) {
        try {
            let collection = DB.Client.collection('group');

            let arSearch = {}
            if (fields.q) arSearch = {$text: {$search: fields.q}}

            let result = await collection.count(arSearch)
            return result
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CGroup SearchCount'})
        }
    }

    //добавить новую группу
    static async PayAdd ( fields ) {
        try {
            let collection = DB.Client.collection('pay_group');

            let result = await collection.count(arSearch)

            //запись
            //let result = await DB.Init.Insert(`${DB.Init.TablePrefix}group`, fields, `ID`)
            //return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CGroup Add'})
        }
    }

    //добавить новую группу
    static async PayGet ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = DB.Client.collection('pay_group');
            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id,
            }

            let result = await collection.findOne(arFields)
            return result
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CGroup PayGet'})
        }
    }

    //добавить новую группу
    static async PayStatus ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let group = await this.GetById ( [fields.group_id] );
            if (group.length)
                group = group[0]

            //группа бесплатная
            if (!group.price) return true

            //группа платная, а пользователя нет
            if ((group.price) && (!fields.user_id)) return false

            //получаем запись об оплате
            let result = await this.PayGet(fields)

            //платы нет
            if (!result) return false

            //оплата закончилась
            let dateSystem = new Date();
            let datePay = new Date(result.pay_date);
            if (dateSystem > datePay) return false

            return true
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CGroup PayStatus'})
        }
    }
/*
    static async GetByField ( items, fieldName ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arGroupId = []

            items.forEach((item, i) => {
                if (item[fieldName] < 0)
                    arGroupId.push(-item[fieldName])
            })

            if (!arGroupId.length) return []

            //удаление одинаковых id из массива
            arGroupId = Array.from(new Set(arGroupId))

            let sql = `SELECT id,title FROM ${DB.Init.TablePrefix}group WHERE id in (${arGroupId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return users

        } catch (err) {
            console.log(err)
            throw ({err: 6005000, msg: 'CGroup GetByField'})
        }
    }*/
}