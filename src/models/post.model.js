const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class PostModel {
    tableName = 'posts';
    postsView = 'posts_view';

    find = async (page, limit, currentUserId) => {
        let offset = limit * page;
        let sql = `select 
        p.id, 
        u.id as author_id,
        count(pl1.post_likes_pk) as likes,
        count(pl2.post_likes_pk) as dislikes,
        pl3.like_status as like_status,
        count(c.id) as comments_count,
        p.title, 
        p.text, 
        p.image_url , 
        p.creation_date,
        u.avatar_url as author_avatar_url, 
        u.username as author_username
            from posts p 
            inner join users u on p.author_id = u.id
            left join comments c on p.id = c.post_id 
            left join post_likes pl3 on user_id = ? and pl3.post_id = p.id
            left join post_likes pl2 on pl2.like_status = -1 and pl2.post_id  = p.id
            left join post_likes pl1 on pl1.like_status = 1 and pl1.post_id  = p.id
            group by p.id 
            order by creation_date desc 
            limit ? 
            offset ?`;
        
        return await query(sql, [currentUserId, limit, offset]);
    }


    findHottest = async (page, limit, currentUserId) => {
        let offset = limit * page;
        let sql = `select 
        p.id, 
        u.id as author_id, 
        (select count(pl.like_status) from post_likes pl where like_status = 1 and pl.post_id = p.id) as likes, 
        (
        (
        (select count(pl.like_status) from post_likes pl where like_status = 1 and pl.post_id = p.id)
        +
        ((select count(pl.like_status) from post_likes pl where like_status = -1 and pl.post_id = p.id) / 2)
        +
        (select count(1) from comments where post_id = p.id)
        )
        /
        (TIMESTAMPDIFF(day, p.creation_date , CURDATE()) + 1)
        )
        as hotness,
        (select count(pl.like_status) from post_likes pl where like_status = -1 and pl.post_id = p.id) as dislikes, 
        (select pl.like_status from post_likes pl where user_id = ? and post_id = p.id) as like_status,
        (select count(1) from comments where post_id = p.id) as comments_count,
        p.title, 
        p.text, 
        p.image_url , 
        p.creation_date,
        u.avatar_url as author_avatar_url, 
        u.username as author_username
            from posts p 
            inner join users u on p.author_id = u.id
            cross join post_likes pl
            group by p.id 
            order by hotness desc 
            limit ? 
            offset ?`;
        
        return await query(sql, [currentUserId, limit, offset]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row 
        return result[0];
    }

    findAllByAuthorId = async (params, page, limit, currentUserId) => {
        let offset = limit * page;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `select 
        p.id, 
        u.id as author_id, 
        (select count(pl.like_status) from post_likes pl where like_status = 1 and pl.post_id = p.id) as likes, 
        (select count(pl.like_status) from post_likes pl where like_status = -1 and pl.post_id = p.id) as dislikes, 
        (select pl.like_status from post_likes pl where user_id = ? and post_id = p.id) as like_status,
        (select count(1) from comments where post_id = p.id) as comments_count,
        p.title, 
        p.text, 
        p.image_url , 
        p.creation_date,
        u.avatar_url as author_avatar_url, 
        u.username as author_username
            from posts p 
            inner join users u on p.author_id = u.id
            cross join post_likes pl
            where ${columnSet}
            group by p.id 
            order by creation_date desc 
            limit ? 
            offset ?`;
        const result = await query(sql, [...values, currentUserId, limit, offset]);

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