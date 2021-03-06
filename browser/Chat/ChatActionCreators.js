import axios from 'axios';
import { socket } from '../store';

export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const LOAD_CHAT_MESSAGES = 'LOAD_CHAT_MESSAGES';

export const addNewMessage = (message) => ({
  type: ADD_NEW_MESSAGE,
  message,
});

export const loadChatMessages = (messages) => ({
  type: LOAD_CHAT_MESSAGES,
  messages,
});

export const fetchAllMessagesForChatroom = (chatroomId) => (dispatch) => (
  axios.get(`/api/chatrooms/${chatroomId}/messages`)
  .then(res => res.data)
  .then(receivedMessages => {
    receivedMessages.forEach((message) => message.type = 'message');
    dispatch(loadChatMessages(receivedMessages));
  })
);

export const addNewMessageForChatroom = (newMessage) => (dispatch) => (
  axios.post(`/api/chatrooms/${newMessage.chatroomId}/messages`, newMessage)
  .then(res => res.data)
  .then((createdMessage) => {
    createdMessage.type = 'message';
    dispatch(addNewMessage(createdMessage));
    socket.emit('newMessage', createdMessage);
  })
);

export const addNewImageForChatroom = (newMessage) => (dispatch) => {
  newMessage.type = 'img';
  dispatch(addNewMessage(newMessage));
}
