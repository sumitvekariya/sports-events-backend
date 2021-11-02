import { Inject, Injectable } from "@nestjs/common";
import { AcceptDeclineInvitationInput, AddPlayerEventInput, InviteUninvitePlayersInput, JoinEventInput, UpdatePositionInput } from './dto/event-player.dto';

@Injectable()
export class EventPlayerService {
  private rethinkService;

  constructor(@Inject('RethinkService') service) {
    this.rethinkService = service;
  }

  async create(userId: string, JoinEventInput: JoinEventInput) {

    const allPlayers = await this.rethinkService.getDataWithFilter('eventPlayers', { eventId: JoinEventInput.eventId });

    const checkExistingData = allPlayers.find(ap => ap.playerId === userId);

    // get event Detail
    const eventData = await this.rethinkService.getByID('events', JoinEventInput.eventId);

    if (eventData && eventData.playerLimit > allPlayers.length) {
      if (!checkExistingData) {
        const uuid = await this.rethinkService.generateUID();
        const eventPlayerObj = {
          ...JoinEventInput,
          id: uuid,
          playerId: userId,
          status: true,
          addedBy: userId
        };
    
        const { inserted, changes } = await this.rethinkService.saveDB(
          'eventPlayers',
          eventPlayerObj,
        );
        if (inserted) {
          // add notification object
          const notificationObj = {
            userId,
            notification_type: "join_event",
            isRead: 0, // unread - 0, read - 1,
            eventId: JoinEventInput.eventId,
            ownerId: eventData.owner,
            actionTaken: 0
          };
          await this.rethinkService.saveDB('notifications', notificationObj);

          return {...changes[0].new_val, message: "You have joined the event successfully"};
        } else {
          throw Error('Error in join event');
        }
      } else {
        return {...checkExistingData, message: "You have joined the event successfully"};
      }
    } else {
      return { message: "Event is full. You can't join right now."}
    }
  }  

  async remove(playerId: string, eventId: string) {
    const [existingEventPlayer] = await this.rethinkService.getDataWithFilter('eventPlayers', { playerId , eventId });

    if (existingEventPlayer && existingEventPlayer.playerId === playerId) {
      const { deleted } = await this.rethinkService.removeDB('eventPlayers', existingEventPlayer.id);
      if (deleted) {
        const eventData = await this.rethinkService.getByID('events', eventId);
        // add notification object
        const notificationObj = {
          userId: playerId,
          notification_type: "leave_event",
          isRead: 0, // unread - 0, read - 1,
          eventId: eventId,
          ownerId: eventData.owner,
          actionTaken: 0
        };
        await this.rethinkService.saveDB('notifications', notificationObj);

        return true;
      } else {
        throw Error('Error while deleting a eventPlayers');
      }
    } else {
      return false;
    }
  }

  async getPlayerDetail(eventId: String) {
    const result = await this.rethinkService.getPlayerList({ eventId });
    return result
  }

  async update(userId: string, updatePositionInput: UpdatePositionInput) {
      const { replaced, changes } = await this.rethinkService.updateDB(
        'users',
        userId,
        { positions: updatePositionInput.positions },
      );
      if (replaced) {
      return changes[0].new_val;
      } else {
        throw Error('Error while updating a Positions');
      }
  }

  async subscribe(subAction: string) {
    const data = await this.rethinkService.getSubscription(subAction, 'eventPlayers');
    return data
  }

  async addRemovePlayer(userId: string, addPlayerEventInput: AddPlayerEventInput) {

    const allPlayers = await this.rethinkService.getDataWithFilter('eventPlayers', { eventId: addPlayerEventInput.eventId });

    const checkExistingData = allPlayers.find(ap => ap.playerId === addPlayerEventInput.playerId);

    // get event Detail
    const eventData = await this.rethinkService.getByID('events', addPlayerEventInput.eventId);
    
    // if user name comes then create user in db and assign it to player
    if (addPlayerEventInput.userName) {
      // check user exists with the same name
      const firstName = addPlayerEventInput.userName.split(' ')[0] || "";
      const lastName = addPlayerEventInput.userName.split(' ')[1] || "";
      const nickName = "";

      const existingUser = await this.rethinkService.getDataWithFilter('users', { firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase(), nickName });

      if (existingUser?.length) {
        addPlayerEventInput.playerId = existingUser[0].id;
      } else {
        // save user object
        const userObj = {
          id: await this.rethinkService.generateUID(),
          firstName,
          lastName,
          nickName: addPlayerEventInput.userName.replace(' ', '') || "",
          role: "",
          isCustomUser: 1,
          positions: [],
          photoUrl: ""
        }
        const { inserted, changes } = await this.rethinkService.saveDB('users', userObj);
        if (inserted) {
          addPlayerEventInput.playerId = changes[0].new_val.id;
        }
      }
    }

    const userObj = await this.rethinkService.getByID('users', addPlayerEventInput.playerId);
    if (addPlayerEventInput.isAdd) {
      // fetch positions

      if (eventData && eventData.playerLimit > allPlayers.length && addPlayerEventInput.isAdd) {
        if (!checkExistingData) {
          const uuid = await this.rethinkService.generateUID();
          const eventPlayerObj = {
            ...addPlayerEventInput,
            id: uuid,
            playerId: addPlayerEventInput.playerId,
            status: true,
            addedBy: userId
          };
      
          const { inserted, changes } = await this.rethinkService.saveDB(
            'eventPlayers',
            eventPlayerObj,
          );
          if (inserted) {
            // add notification object
            const notificationObj = {
              userId,
              notification_type: "add_player_event",
              isRead: 0, // unread - 0, read - 1,
              eventId: addPlayerEventInput.eventId,
              ownerId: addPlayerEventInput.playerId,
              actionTaken: 0
            };
            await this.rethinkService.saveDB('notifications', notificationObj);
  
            return {...userObj, message: "You have joined the event successfully"};
          } else {
            throw Error('Error in join event');
          }
        } else {
          return {...userObj, message: "This user is already added in the event"};
        }
      } else {
        return {...userObj, message: "Event is full. You can't join right now."}
      }
    } else {
      if (!addPlayerEventInput.isAdd && checkExistingData) {
        // remove player from event
        const { deleted } = await this.rethinkService.removeDB('eventPlayers', checkExistingData.id);
        if (deleted) {
          // add notification object
          const notificationObj = {
            userId,
            notification_type: "remove_player_event",
            isRead: 0, // unread - 0, read - 1,
            eventId: addPlayerEventInput.eventId,
            ownerId: addPlayerEventInput.playerId,
            actionTaken: 0
          };
          await this.rethinkService.saveDB('notifications', notificationObj);

          // delete old intiviation
          await this.rethinkService.removeDataWithFilter('notifications', { ownerId: addPlayerEventInput.playerId, userId, eventId: addPlayerEventInput.eventId, notification_type: "invite_event" });

          return { message: "Player removed successfully from event." }
        }
      } else {
        return { message: "Please add player first." }
      }
    }
  }

  async getFriendsEnrolledInEvent(userId: string, eventId: string) {
    const data = await this.rethinkService.getUsersEnrolledInEvent('friends', { userId }, { eventId, status: true }, 'friendId');
    return data;
  }

  async inviteUninvitePlayers(userId: string, inviteUninvitePlayersInput: InviteUninvitePlayersInput) {
      if (inviteUninvitePlayersInput.users && inviteUninvitePlayersInput.users.length) {
        for (let user of inviteUninvitePlayersInput.users) {
          if (user.isInvite) {
            // check existing invitation
            const existingNotification = await this.rethinkService.getDataWithFilter('notifications', { eventId: inviteUninvitePlayersInput.eventId, notification_type: "invite_event", ownerId: user.userId });
            if (existingNotification && existingNotification.length === 0) {
              // Add notifications
              const notificationObj = {
                userId,
                notification_type: "invite_event",
                isRead: 0, // unread - 0, read - 1,
                eventId: inviteUninvitePlayersInput.eventId,
                ownerId: user.userId,
                actionTaken: 0
              };
              await this.rethinkService.saveDB('notifications', notificationObj);
            }
          } else {
            await this.rethinkService.removeDataWithFilter('notifications', { ownerId: user.userId, userId, eventId: inviteUninvitePlayersInput.eventId, notification_type: "invite_event" });
          }
        }
      }
    return 'Invitation updated succesfully.'
  }

  async acceptDeclineInvitation(userId: string, acceptDeclineInvitationInput: AcceptDeclineInvitationInput) {
    try {
      // check already accepted
      const allPlayers = await this.rethinkService.getDataWithFilter('eventPlayers', { eventId: acceptDeclineInvitationInput.eventId });
  
      const checkExistingData = allPlayers.find(ap => ap.playerId === userId);
  
      const eventData = await this.rethinkService.getByID('events', acceptDeclineInvitationInput.eventId);
  
      if (eventData && eventData.playerLimit > allPlayers.length) {
        if (!checkExistingData) {
          if (acceptDeclineInvitationInput.isAccept) {
            // Entry in event player table
            const uuid = await this.rethinkService.generateUID();
            const eventPlayerObj = {
              id: uuid,
              playerId: userId,
              eventId: acceptDeclineInvitationInput.eventId,
              status: true,
              addedBy: userId
            };

            const { inserted, changes } = await this.rethinkService.saveDB(
              'eventPlayers',
              eventPlayerObj,
            );
            
            // Update action taken of the notification obj
            const where = {
              notification_type: 'invite_event',
              ownerId: userId,
              eventId: acceptDeclineInvitationInput.eventId
            };
            await this.rethinkService.updateWithFilter('notifications', where, { actionTaken: 1 });
            
             if (inserted) {
              const notificationObj = {
                userId,
                notification_type: "accept_invitation",
                isRead: 0, // unread - 0, read - 1,
                eventId: acceptDeclineInvitationInput.eventId,
                ownerId: eventData.owner,
                actionTaken: 0
              };
              await this.rethinkService.saveDB('notifications', notificationObj);
            } else {
              throw Error('Error in join event');
            }
           } else {
             // delete notification object
             await this.rethinkService.removeDataWithFilter('notifications', { ownerId: userId, eventId: acceptDeclineInvitationInput.eventId, notification_type: "invite_event" });
             
              // Update action taken of the notification obj
              const where = {
                notification_type: 'invite_event',
                ownerId: userId,
                eventId: acceptDeclineInvitationInput.eventId
              };
              await this.rethinkService.updateWithFilter('notifications', where, { actionTaken: 1 });

             const notificationObj = {
              userId,
              notification_type: "decline_invitation",
              isRead: 0, // unread - 0, read - 1,
              eventId: acceptDeclineInvitationInput.eventId,
              ownerId: eventData.owner,
              actionTaken: 0
            };
            await this.rethinkService.saveDB('notifications', notificationObj);
           }
        } else {
          throw new Error('You have alredy accepted invitation')
        }

        return 'Invitation updated successfully.';

      } else {
        throw new Error('Event is full. You can\'t join right now.');
      }
    } catch (err) {
      throw err
    }
  }
}