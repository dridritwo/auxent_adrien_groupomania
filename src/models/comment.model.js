const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class CommentModel {
    tableName = 'comments';

    
    findOne = async ({comment_id}) => {

        const sql = `SELECT * FROM ${this.tableName}
        WHERE user_id= ? AND post_id= ?`;

        const result = await query(sql, [user_id, post_id]);

        // return back the first row 
        return result[0];
    }
    
    create = async ({ post_id, author_id, text }) => {
        const sql = `INSERT INTO ${this.tableName}
        (post_id, author_id, text) VALUES (?,?,?)`;

        const result = await query(sql, [post_id, author_id, text]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, post_id, user_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE post_id = ? AND user_id = ?`;

        const result = await query(sql, [...values, post_id, user_id]);

        return result;
    }

    
}

module.exports = new CommentModel;