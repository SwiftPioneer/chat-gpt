import React from 'react';

import '../../../styles/components/chat/Content.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faAlignLeft, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const AnswerMessage = ({ answerMsg }) => {
  return (
    <>
        <div className='chat-content-answer-header'>
            <FontAwesomeIcon icon={faList} size='lg'/>
            &nbsp;&nbsp;&nbsp;Sources
        </div>

        <div className='chat-content-source-container'>
            <a href='https://www.w3schools.com/' target='_blank' className='chat-content-source'>
                w3schools.com &nbsp;
                <FontAwesomeIcon icon={faUpRightFromSquare} className='chat-content-source-link-icon'/>
            </a>
            <a href='https://www.python.org/' target='_blank' className='chat-content-source'>
                python.org &nbsp;
                <FontAwesomeIcon icon={faUpRightFromSquare} className='chat-content-source-link-icon' />
            </a>
            <a href='https://nodejs.org/en/about' target='_blank' className='chat-content-source'>
                nodejs.org about &nbsp;
                <FontAwesomeIcon icon={faUpRightFromSquare} className='chat-content-source-link-icon' />
            </a>
        </div>

        <div className='chat-content-answer-header'>
            <FontAwesomeIcon icon={faAlignLeft} size='lg'/>
            &nbsp;&nbsp;&nbsp;Answer
        </div>

        <div className='chat-content-ai'>
            {answerMsg}
            <br/>
            <br/>
            <button className='chat-content-feedback-button'>Give Feedback</button>
        </div>
    </>    
  );
};

export default AnswerMessage;