import { Inject } from "@nestjs/common";
// Async iterator to access the RethinkDB change feed
const { $$asyncIterator } = require("iterall");

export class RethinkIterator {
  public actionName;
  public rethink;
  public connection;

  constructor(subAction, query, conn, r?) {
    this.rethink = r;
    this.connection = conn;

    (this as any).cursor = query.changes().run(conn);
    this.actionName = subAction;
  }

  async next() {
    const val = await (await (this as any).cursor).next();
    if (this.actionName === 'eventPlayerChanges') {
      if (val?.new_val?.playerId) {
        const data = await this.rethink.table('users')
        .get(val.new_val.playerId)
        .run(this.connection);
        
        const addedBy = await this.rethink.table('users')
        .get(val.new_val.addedBy)
        .run(this.connection);

        if (addedBy) {
          data.addedByUser = addedBy.nickName;
          data.addedBy = val.new_val.addedBy;
        }
        return { value: { [this.actionName]: { type: 'add_player', eventId: val?.new_val?.eventId, user: data } }, done: false };
      } else {
        if (val?.old_val?.playerId) {
          const data = await this.rethink.table('users')
            .get(val.old_val.playerId)
            .run(this.connection);

            return { value: { [this.actionName]: { type: 'remove_player', eventId: val?.old_val?.eventId, user: data } }, done: false };
        }
      }
    }

    if (this.actionName === 'notificationChanges') {
      if (val?.new_val) {
        let result;
        await this.rethink
            .table('notifications')
            .filter({ id: val?.new_val?.id })
            .outerJoin(this.rethink.table("users"), (leftRow, userRow) => {
                return leftRow("userId").eq(userRow('id'))
            }).withFields({"left": { "id": true, "userId": true, "isRead": true, "ownerId": true, "notification_type": true, "eventId": true, "actionTaken": true }},{"right": { "firstName": true, "lastName": true }})
            .zip()
            .outerJoin(this.rethink.table('events'), function(notRow, eventRow) {
                return notRow('eventId').eq(eventRow('id'))
            })
            .zip()
            .run(this.connection)
            .then(cursor => {
              cursor.toArray(function(err, res) {
                  if (err) throw err;
                  result = res[0];
              })
            });
        switch(result.notification_type) {
          case 'add_friend':
            result.message = `${result.firstName} ${result.lastName} has sent a friend request`;
            result.title = `Friend Request`;
            break;
          case 'follow_user':
            result.message = `${result.firstName} ${result.lastName} has started following you`;
            result.title = `User is Following`;
            break;
          case 'join_event':
            result.message = `${result.firstName} ${result.lastName} joined the event: ${result?.description}`;
            result.title = `Join Event`;
            break;
          case 'leave_event':
            result.message = `${result.firstName} ${result.lastName} left the event: ${result?.description}`;
            result.title = `Left Event`;
            break;
          case 'add_player_event':
            result.message = `you are added into the event: ${result.description}`;
            result.title = `Player added in the event`;
            break;
          case 'remove_player_event':
            result.message = `you are removed from the event: ${result.description}`;
            result.title = `Player removed in the event`;
            break;
          case 'remove_friend':
              result.message = `${result.firstName} ${result.lastName} removed you as a friend`;
              result.title = `Remove friend request`;
              break;
          case 'unfollow_user':
            result.message = `${result.firstName} ${result.lastName} started unfollowing you`;
            result.title = `User unfollowed`;
            break;
          case 'friend_request_accept':
            result.message = `${result.firstName} ${result.lastName} has accepted your friend request`;
            result.title = `Friend Request accepted`;
            break;
          case 'friend_request_decline':
            result.message = `${result.firstName} ${result.lastName} has declined your friend request`;
            result.title = `Friend Request declined`;
            break;
          case 'invite_event':
            result.message = `${result.firstName} ${result.lastName} has invited you to the event`;
            result.title = `Invite to Event`;
            break;
          case 'accept_invitation':
            result.message = `${result.firstName} ${result.lastName} has accepted invitation`;
            result.title = `Invitation accepted`;
            break;
          case 'decline_invitation':
            result.message = `${result.firstName} ${result.lastName} has declined invitation`;
            result.title = `Invitation declined`;
            break;
          default:
            result.message = ``;
            break;
        }
        return { value: { [this.actionName]: { type: 'add_notification', notification: result } }, done: false };
      }
    }
    return { value: { [this.actionName]: val.new_val }, done: false };
  }

  async return() {
    await (await (this as any).cursor).close();
    return { value: undefined, done: true };
  }

  async throw(error) {
    return Promise.reject(error);
  }

  [$$asyncIterator]() {
    return this;
  }
}