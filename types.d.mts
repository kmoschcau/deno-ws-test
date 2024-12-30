/**
 * This is an abstract parent for all chat events.
 */
export interface AbstractChatEvent {
  /**
   * The type of the chat event.
   */
  type: string;
}

/**
 * This is an event sent by the server to clients to broadcast a chat message.
 */
export interface BroadcastMessageChatEvent extends AbstractChatEvent {
  /**
   * The message text of the message.
   */
  message: string;

  type: "broadcast-message";

  /**
   * The user name of the sending user.
   */
  username: string;
}

/**
 * This is an event sent by a client to the server to send a message.
 */
export interface SendMessageChatEvent extends AbstractChatEvent {
  /**
   * The message text to send.
   */
  message: string;

  type: "send-message";
}

/**
 * This is an event sent by the server to clients to update the listed users.
 */
export interface UpdateUsersChatEvent extends AbstractChatEvent {
  type: "update-users";

  /**
   * The updated list of user names.
   */
  usernames: string[];
}

/**
 * The different types of chat events.
 */
export type ChatEvent =
  | BroadcastMessageChatEvent
  | SendMessageChatEvent
  | UpdateUsersChatEvent;
