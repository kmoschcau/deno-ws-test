/** @import { ChatEvent, SendMessageChatEvent } from "../types.d.mts"; */

import {
  isBroadcastMessageChatEvent,
  isUpdateUsersChatEvent,
} from "./type-guards.mjs";

/**
 * @param {HTMLElement} userList
 * @param {HTMLTemplateElement} userTemplate
 * @param {string[]} usernames
 */
function updateUserList(userList, userTemplate, usernames) {
  userList.replaceChildren(
    ...usernames.map((username) => {
      const clone = /** @type {HTMLElement} */ (
        userTemplate.content.cloneNode(true)
      );

      const li = clone.querySelector("li");
      if (li) {
        li.textContent = username;
      }

      return clone;
    }),
  );
}

/**
 * @param {HTMLElement} conversation
 * @param {HTMLTemplateElement} messageTemplate
 * @param {string} username
 * @param {string} message
 */
function addMessage(conversation, messageTemplate, username, message) {
  const clone = /** @type {HTMLElement} */ (
    messageTemplate.content.cloneNode(true)
  );

  const userSpan = clone.querySelector("span");
  if (userSpan) {
    userSpan.textContent = username;
  }

  const messageParagraph = clone.querySelector("p");
  if (messageParagraph) {
    messageParagraph.textContent = message;
  }

  conversation.append(clone);
}

const userList = document.getElementById("users");
if (!(userList instanceof HTMLElement)) {
  throw new Error("There was no user list element.");
}

const conversation = document.getElementById("conversation");
if (!(conversation instanceof HTMLElement)) {
  throw new Error("There was no conversation element.");
}

const form = document.getElementById("form");
if (!(form instanceof HTMLFormElement)) {
  throw new Error("There was no form element.");
}

const messageInput = form.querySelector('[name="message"]');
if (!(messageInput instanceof HTMLInputElement)) {
  throw new Error("There was no message input element.");
}

const userTemplate = document.getElementById("user");
if (!(userTemplate instanceof HTMLTemplateElement)) {
  throw new Error("There was no user template element.");
}

const messageTemplate = document.getElementById("message");
if (!(messageTemplate instanceof HTMLTemplateElement)) {
  throw new Error("There was no message template element.");
}

const username = prompt("Please enter your username.") || "Anonymous";

const url = new URL(location.href);
url.protocol = url.protocol.replace("http", "ws");
url.searchParams.set("username", username);
const websocket = new WebSocket(url);

websocket.addEventListener("message", (event) => {
  const parsed = JSON.parse(event.data);

  if (isBroadcastMessageChatEvent(parsed)) {
    addMessage(conversation, messageTemplate, parsed.username, parsed.message);
  } else if (isUpdateUsersChatEvent(parsed)) {
    updateUserList(userList, userTemplate, parsed.usernames);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value;
  messageInput.value = "";

  /**
   * @type {SendMessageChatEvent}
   */
  const wsMessage = { type: "send-message", message };

  websocket.send(JSON.stringify(wsMessage));
});

messageInput.focus();
