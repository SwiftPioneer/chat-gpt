import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faLink, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import Tooltip from '@mui/material/Tooltip';

import '../../styles/components/chat/ChatInput.css';

const ChatInput = ({textareaRef, chatText, canEdit, handleChatInputKeyDown, handleChatTextChange, sendClicked, learnClicked, newChatClicked, isSendBtnActive, isLearnActive}) => {
    return (
        <div className='chat-input'>
            <div className='chat-input-rounded-rect'>
                <textarea className="chat-input-textarea-field" placeholder="Type your message here..." ref={textareaRef} value={chatText} onKeyDown={handleChatInputKeyDown} onChange={handleChatTextChange} />

                <div className='chat-input-button-send-group'>
                    <Tooltip title="Mark prompt as scenario.">
                        <button className='chat-input-button-send' onClick={sendClicked} disabled={!isSendBtnActive}>
                            <FontAwesomeIcon icon={faPaperPlane} size='xl'/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Send prompt.">
                        <button className={isLearnActive ? 'chat-input-button-learn' : 'chat-input-button-learn-inactive'} onClick={learnClicked}>
                            <FontAwesomeIcon icon={faLink} />
                        </button>
                    </Tooltip>
                </div>
            </div>
            
            <Tooltip title="Start new conversation.">
                <button className='chat-input-new-chat-button' onClick={newChatClicked}>
                    <FontAwesomeIcon icon={faPlus} className="circle-plus" size='xs'/>
                    <FontAwesomeIcon icon={faComment} className="comment" size='2xl'/>
                </button>
            </Tooltip>
        </div>
    );
};

export default ChatInput;