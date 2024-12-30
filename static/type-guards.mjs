/**
 * @import {
 *   type AbstractChatEvent,
 *   type BroadcastMessageChatEvent,
 *   type SendMessageChatEvent,
 *   type UpdateUsersChatEvent,
 * } from "../types.d.mts"
 */

/**
 * Test of the given thing is an {@link AbstractChatEvent}.
 * @param {unknown} thing
 * @returns {thing is AbstractChatEvent}
 */
export function isAbstractChatEvent(thing) {
  if (typeof thing !== "object" || thing === null) {
    return false;
  }

  return "type" in thing && typeof thing.type === "string";
}

/**
 * Test of the given thing is a {@link BroadcastMessageChatEvent}.
 * @param {unknown} thing
 * @returns {thing is BroadcastMessageChatEvent}
 */
export function isBroadcastMessageChatEvent(thing) {
  if (!isAbstractChatEvent(thing)) {
    return false;
  }

  return (
    thing.type === "broadcast-message" &&
    "message" in thing &&
    typeof thing.message === "string" &&
    "username" in thing &&
    typeof thing.username === "string"
  );
}

/**
 * Test of the given thing is a {@link SendMessageChatEvent}.
 * @param {unknown} thing
 * @returns {thing is SendMessageChatEvent}
 */
export function isSendMessageChatEvent(thing) {
  if (!isAbstractChatEvent(thing)) {
    return false;
  }

  return (
    thing.type === "send-message" &&
    "message" in thing &&
    typeof thing.message === "string"
  );
}

/**
 * Test of the given thing is a {@link UpdateUsersChatEvent}.
 * @param {unknown} thing
 * @returns {thing is UpdateUsersChatEvent}
 */
export function isUpdateUsersChatEvent(thing) {
  if (!isAbstractChatEvent(thing)) {
    return false;
  }

  return (
    thing.type === "update-users" &&
    "usernames" in thing &&
    typeof thing.usernames === "object" &&
    Array.isArray(thing.usernames) &&
    !thing.usernames.some((e) => typeof e !== "string")
  );
}
