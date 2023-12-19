import React from 'react';

import '../../styles/components/chat/ChatTitle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const ChatTitle = ({ chatTitle }) => {
  return (
    <div className='chat-title-container'>
        <div className='chat-title'>
            <FontAwesomeIcon icon={faClock} /> { chatTitle }
        </div>
        <div className='chat-title-line'></div>
    </div>
  );
};

export default ChatTitle;