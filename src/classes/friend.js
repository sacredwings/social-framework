import { DB } from "./db";
import { CFile } from "./file";
import { CUser } from "./user";

export class CFriend {

    static async Add ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.friend_id = new DB().ObjectID(fields.friend_id)
            let collection = DB.Client.collection('friend')

            let arFields = {
                user_id: fields.user_id,
                friend_id: fields.friend_id
            }
            let selectFriend = await this.GetByUser(arFields)
            //нет, создаем
            if (!selectFriend) {
                //обработка полей
                fields.create_date = new Date()

                arFields = {
                    user_id: fields.user_id,
                    friend_id: fields.friend_id,
                    viewed: null,
                    allowed: null,
                    create_date: new Date()
                }
                await collection.insertOne(arFields)

                return true
            }

            //заявка входящая
            if (selectFriend.friend_id.toString() === fields.user_id.toString()) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: true
                }

                console.log(selectFriend.friend_id)
                await collection.updateOne({_id: selectFriend._id}, {$set: newField})

                return true
            }

            return false

            /*
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id}))
                            AND allowed is null`

            console.log(sql)
            let resultFriend = await DB.Init.Query(sql)*/

            //console.log(resultFriend)

            /*
                        if (!resultFriend.length) {
                let resultAdd = await DB.Init.Insert(`${DB.Init.TablePrefix}friend`, fields, `ID`)
                return resultAdd[0]
            }
             */
/*


            //заявка входящая
            if (Number (resultFriend[0].friend_id) === Number(fields.user_id)) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: true
                }

                let resultEdit = await DB.Init.Update (`${DB.Init.TablePrefix}friend`, newField, {id: resultFriend[0].id},`id`)
                return resultEdit[0]
            }

            return false*/
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Add'})
        }
    }

    static async Delete ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.friend_id = new DB().ObjectID(fields.friend_id)
            let collection = DB.Client.collection('friend')

            let arFields = {
                user_id: fields.user_id,
                friend_id: fields.friend_id
            }
            let selectFriend = await this.GetByUser(arFields)

            //нечего удалять
            if (!selectFriend) return false

            //заявка входящая
            if (selectFriend.friend_id.toString() === fields.user_id.toString()) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: null
                }

                await collection.updateOne({_id: selectFriend._id}, {$set: newField})

                return true
            }

            collection.deleteOne({_id: selectFriend._id})
            return true

            /*
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id}))`

            console.log(sql)
            let resultFriend = await DB.Init.Query(sql)

            console.log(resultFriend)

            //нечего удалять
            if (!resultFriend.length)
                return false

            resultFriend = resultFriend[0]

            //заявка входящая / in
            if (Number (resultFriend.friend_id) === Number(fields.user_id)) {
                let newField = {
                    viewed: true,
                    allowed: null
                }
                await DB.Init.Update (`${DB.Init.TablePrefix}friend`, newField, {id: resultFriend.id},`id`)

                return true
            }

            //заявка исходящая / out
            if (Number (resultFriend.user_id) === Number(fields.user_id)) {
                let sql = `DELETE FROM ${DB.Init.TablePrefix}friend WHERE user_id=${fields.user_id} AND friend_id=${fields.friend_id}`
                await DB.Init.Query(sql)

                return true
            }

            return false*/


        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Add'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.friend_id = new DB().ObjectID(fields.friend_id)
            let collection = DB.Client.collection('friend')

            let Aggregate = [{
                $match: {
                    $or: [{
                        user_id: fields.user_id,
                        friend_id: fields.friend_id,
                    },{
                        user_id: fields.friend_id,
                        friend_id: fields.user_id,
                    }],
                }
            }]

            let result = await collection.aggregate(Aggregate).toArray()
            if (result.length)
                return result[0]

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend GetByUser'})
        }
    }

    static async Status ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.friend_id = new DB().ObjectID(fields.friend_id)
            let selectFriend = await this.GetByUser(fields)

            //нет заявки
            if (!selectFriend)
                return 'none'

            //друг
            if (selectFriend.allowed === true)
                return 'friend'

            selectFriend.user_id = selectFriend.user_id.toString()
            selectFriend.friend_id = selectFriend.friend_id.toString()

            //заявка входящая
            if ((selectFriend.friend_id.toString() === fields.user_id.toString()) && (selectFriend.viewed === true))
                return 'viewed'

            //заявка входящая
            if (selectFriend.friend_id.toString() === fields.user_id.toString())
                return 'in'

            //заявка исходящая
            if (selectFriend.user_id.toString() === fields.user_id.toString())
                return 'out'

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Status'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE (user_id=${fields.user_id} OR friend_id=${fields.user_id}) AND allowed=true ORDER BY id DESC`
            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            //друзей нет, выходим
            if (!result.length)
                return []

            let arUsers = []
            //вытаскиваем id пользователей из массива / кроме своего
            result = await Promise.all(result.map(async (item, i) => {

                //сохраняем из одного поля в общий массив
                if (Number (item.user_id) !== Number (fields.user_id))
                    arUsers.push(item.user_id)

                //сохраняем из другого поля в общий массив
                if (Number (item.friend_id) !== Number (fields.user_id))
                    arUsers.push(item.friend_id)

                return item;
            }));


            arUsers = await CUser.GetById ( arUsers );

            //фильтр
            arUsers = await Promise.all(arUsers.map(async (item, i) => {

                let newField = {
                    id:             item.id,
                    timestamp_x:    item.timestamp_x,
                    login:          item.login,
                    active:         item.active,

                    first_name:     item.first_name,
                    last_name:      item.last_name,
                    second_name:    item.second_name,
                    photo:          item.photo,
                }
                return newField;
            }));

            return arUsers
        } catch (err) {
            console.log(err)
            throw ({code: 6003000, msg: 'CFriend Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}friend WHERE (user_id=${fields.user_id} OR friend_id=${fields.user_id}) AND allowed=true`
            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}post WHERE owner_id=${fields.owner_id}`

            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({code: 6004000, msg: 'CFriend GetCount'})
        }
    }

    static async Accept ( fields, where ) {
        try {
            //просмотренно
            fields.viewed = true
            fields.allowed = true

            //запись
            let result = await DB.Init.Update(`${DB.Init.TablePrefix}friend`, fields, where,`ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Accept'})
        }
    }
}