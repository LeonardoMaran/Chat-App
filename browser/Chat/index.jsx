import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { postNewMessageToServer, addNewMessageForChatroom, addNewMessage, ADD_NEW_MESSAGE, addNewImageForChatroom } from './ChatActionCreators';
import { getAllMessages, getMessagesChatroomName } from './ChatReducer';
import { getUserId, getUsername } from '../Login/LoginReducer';

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' }
  }

  handleChange = (evt) => {
    this.setState({ message: evt.target.value });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const { userId, chatroomId, addNewMessageForChatroom, username } = this.props;
    const content = evt.target.message.value;
    if (content.trim().length > 0) {
      addNewMessageForChatroom({ content, userId, chatroomId });
      this.setState({ message: '' });
    }
  }

  onAddFile = (evt) => {
    const { userId, chatroomId, addNewMessageForChatroom, username } = this.props;
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      this.props.addNewImageForChatroom({
        content: reader.result,
        user: {
          userId,
          username,
        },
        chatroomId,
      });
    }, false);

    reader.readAsDataURL(file);
    evt.target.value = null;
    this.setState({ message: '' });
  }

  render() {
    const { messages, chatroomId, userId, chatroomName } = this.props
    return (
      <div className="container-chatbox">
        <div>
          <h2 className="chatroom-title">{`#${chatroomName}`}</h2>
          <hr />
        </div>
        <div className="container-chat-history">
          {messages.map((message, idx) => (
            <div key={`${message.user.userId}-${chatroomId}-${idx}`}>
              <div className="message-content-header">
                {message.user.username}
              </div>
              {message.type === 'img' && <img src={message.content}/>}
              {message.type === 'message' && <div className="chat-message">{message.content}</div>}
            </div>
          ))}
        </div>
        <div className="container-message-form">
          <input type="file" ref="upload" name="file" onChange={this.onAddFile} />
          <form className="message-form" onSubmit={this.onSubmit}>
            <input className="message-text-area" onChange={this.handleChange} value={this.state.message} name="message" placeholder={`Message #${chatroomName}`}/>
           </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  messages: getAllMessages(state),
  chatroomName: getMessagesChatroomName(state),
  chatroomId: params.chatroomId,
  userId: getUserId(state),
  username: getUsername(state),
});

const mapDispatchToProps = { addNewMessageForChatroom, addNewImageForChatroom };

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

