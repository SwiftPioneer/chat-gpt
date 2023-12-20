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
            <a href='https://taxfoundation.org/' target='_blank' className='chat-content-source'>
                <p className='chat-content-source-text'>taxfoundation.org</p>
                <FontAwesomeIcon icon={faUpRightFromSquare} className='chat-content-source-link-icon'/>
            </a>
            <a href='https://ifs.org.uk/taxlab' target='_blank' className='chat-content-source'>
                ifs.org.uk
                <FontAwesomeIcon icon={faUpRightFromSquare} className='chat-content-source-link-icon' />
            </a>
            <a href='https://jamesmadison.org/' target='_blank' className='chat-content-source'>
                jamesmadison.org
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