const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class PostModel {
    tableName = 'posts';
    postsView = 'posts_view';

    find = async (page, limit) => {
        let offset = limit * page;
        let sql = `select u.avatar_url, u.username, p.title , p.text, p.image_url , p.creation_date, p.author_id, p.id from ${this.tableName} p INNER JOIN users u 
        ON p.author_id = u.id order by creation_date desc limit ${limit} offset ${offset}`;
        
        return await query(sql);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row 
        return result[0];
    }

    findAllByAuthorId = async (params, page, limit) => {
        let offset = limit * page;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `select u.avatar_url, u.username, p.title , p.text, p.image_url , p.creation_date, p.author_id, p.id from ${this.tableName} p INNER JOIN users u 
        ON p.author_id = u.id
        WHERE ${columnSet} order by creation_date desc limit ${limit} offset ${offset}`;

        const result = await query(sql, [...values]);

        // return back the first row 
        return result;
    }

    create = async ({ title, text, image_url, author_id }) => {
        const sql = `INSERT INTO ${this.tableName}
        (title, text, image_url, author_id) VALUES (?,?,?,?)`;

        const result = await query(sql, [title, text, image_url, author_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new PostModel;