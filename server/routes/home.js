var db = require('../models/database.js');
const bcrypt = require('bcrypt');
const config = require('../../config.json'); // Load configuration
const helper = require('./route_helper.js');

// GET /getPosts
var getPosts = async function (req, res) {
    if (!helper.isLoggedIn(req, req.session.user_id)) {
        return res.status(403).json({ error: 'Not logged in.' });
    }

    try {
        var results = await db.send_sql(`
            SELECT p.* 
            FROM posts_rank pr
            JOIN posts p ON pr.post_id = p.post_id
            LEFT JOIN friends f ON p.user_id = f.followed
            WHERE f.follower = ${req.session.user_id} OR p.user_id = ${req.session.user_id}
            ORDER BY pr.post_rank ASC
            LIMIT 10;
        `);

        console.log(results);

        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error querying database.' });
    }
};

// GET /getNotifications
var getNotifications = async function (req, res) {
    if (!helper.isLoggedIn(req, req.session.user_id)) {
        return res.status(403).json({ error: 'Not logged in.' });
    }

    try {
        var friendRequestsResults = await db.send_sql(`
            SELECT *
            FROM friend_requests
            WHERE receiver_id = ${req.session.user_id} AND status = 'pending'
            LIMIT 5
        `);

        var chatInvitesResults = await db.send_sql(`
            SELECT *
            FROM chat_invites
            WHERE reciever_id = ${req.session.user_id}
            LIMIT 5
        `);

        var response = {
            friendRequests: friendRequestsResults.map((request) => (
                {
                    request_id: request.request_id,
                    sender_id: request.sender_id,
                    receiver_id: request.receiver_id,
                    timestamp: request.timestamp,
                    status: request.status
                }
            )),
            chatInvites: chatInvitesResults.map((invite) => (
                {
                    sender_id: invite.sender_id,
                    receiver_id: invite.receiver_id,
                    chat_id: invite.chat_id,
                    timestamp: invite.timestamp
                }
            ))
        };

        console.log(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error querying database.' });
    }
};

const routes = {
    get_posts: getPosts,
    get_notifications: getNotifications
};

module.exports = routes;