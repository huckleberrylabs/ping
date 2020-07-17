import React from "react";
import moment from "moment";
import { ContactList } from "../../components/contact-list";
import { MessageList } from "../../components/message-list";
import "./style.css";

const convo = {
  id: "123",
  messages: ["123", "234", "23434", "344", "344"],
  created: "2020-07-17T05:00:29+00:00",
  lastActive: "2020-07-17T05:00:29+00:00",
};
const contacts = [
  {
    id: "123",
    name: "Dragos Rotaru",
    phone: "+16472951647",
    createdAt: "2020-07-17T05:00:29+00:00",
  },
];
const messages = [
  {
    id: "123",
    timestamp: "2020-07-17T05:00:29+00:00",
    from: "Dragos Rotaru",
    channel: "SMS",
    content: `Hey, I am looking to move into a new apartment around september.
      I'm looking for 3 beds, 2 baths, somewhere central with tall ceilings and a full sized kitchen.
      would you be able to help me out?`,
    meta: "",
  },
];

export const ConversationDetail = () => {
  return (
    <>
      <h1>Conversation</h1>
      <h2>Details</h2>
      <div className="conversation-detail-summary">
        <div>
          <div>ID</div>
          <div>{convo.id}</div>
        </div>
        <div>
          <div>Messages</div>
          <div>{convo.messages.length}</div>
        </div>
        <div>
          <div>Created</div>
          <div>{moment(convo.created).format("ddd, MMMM Do YYYY, h:mm a")}</div>
        </div>
        <div>
          <div>Last Active</div>
          <div>{moment(convo.lastActive).fromNow()}</div>
        </div>
      </div>
      <h2>Contacts</h2>
      <ContactList contacts={contacts} />
      <h2>Messages</h2>
      <MessageList messages={messages} />
    </>
  );
};
