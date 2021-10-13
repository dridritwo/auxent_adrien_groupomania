const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class LikeModel {
    tableName = 'post_likes';

    
    findOne = async ({post_id, user_id}) => {

        const sql = `SELECT * FROM ${this.tableName}
        WHERE user_id= ? AND post_id= ?`;

        const result = await query(sql, [user_id, post_id]);

        // return back the first row 
        return result[0];
    }

    create = async ({ user_id, post_id, like_status }) => {
        const sql = `INSERT INTO ${this.tableName}
        (user_id, post_id, like_status) VALUES (?,?,?)`;

        const result = await query(sql, [user_id, post_id, like_status]);
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

module.exports = new LikeModel;