const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class PostModel {
    tableName = 'posts';

    find = async (params = {}) => {
        let sql = `select u.avatar_url, u.username, p.title , p.text, p.image_url , p.creation_date, p.author_id, p.id from ${this.tableName} p INNER JOIN users u 
        ON p.author_id = u.id`;
        

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row 
        return result[0];
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