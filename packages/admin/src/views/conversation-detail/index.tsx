import React from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router";
import { useObservable } from "../../observable";
import {
  conversationService,
  contactService,
  messageService,
} from "../../services";
import { Routes } from "../../config";
import { UUID, Errors } from "@huckleberrylabs/ping-core";

// UI
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { ContactList } from "../../components/contact-list";
import { MessageList } from "../../components/message-list";
import "./style.css";

export const ConversationDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const convoState = useObservable(conversationService.state);
  const conversations = useObservable(conversationService.map);
  const contacts = useObservable(contactService.map);
  const contactState = useObservable(contactService.state);
  const messages = useObservable(messageService.map);
  const messageState = useObservable(messageService.state);
  const convo = conversations.get(id);
  if (!UUID.Is(id)) history.push(Routes.widgets);
  if (convo) {
    const convoContacts = Array.from(contacts.entries())
      .filter(([id]) => convo.contacts.includes(id))
      .map(([id, contact]) => contact);
    if (convoContacts.length === convo.contacts.length) {
      const convoMessages = Array.from(messages.entries())
        .filter(([id]) => convo.messages.includes(id))
        .map(([id, message]) => message)
        .sort((a, b) => moment(a.timestamp).diff(b.timestamp));
      if (convoMessages.length === convo.messages.length) {
        return (
          <div className="container">
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
                <div>
                  {moment(convo.created).format("ddd, MMMM Do YYYY, h:mm a")}
                </div>
              </div>
              <div>
                <div>Last Active</div>
                <div>{moment(convo.lastActive).fromNow()}</div>
              </div>
            </div>
            <h2>Contacts</h2>
            <ContactList contacts={convoContacts} />
            <h2>Messages</h2>
            <MessageList messages={convoMessages} />
          </div>
        );
      } else {
        messageService.getByAccount();
      }
    } else {
      contactService.getByAccount();
    }
  } else {
    conversationService.getByAccount();
  }
  if (Errors.Is(convoState)) {
    toast.error(convoState.userMessage);
    return <ErrorButton />;
  }
  if (Errors.Is(contactState)) {
    toast.error(contactState.userMessage);
    return <ErrorButton />;
  }
  if (Errors.Is(messageState)) {
    toast.error(messageState.userMessage);
    return <ErrorButton />;
  }
  // ConversationStates.LOADING ContactStates.LOADING MessageStates.LOADING
  return <Loading />;
};
