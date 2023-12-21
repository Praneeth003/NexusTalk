import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender } from '../../logic';
import { Avatar, Tooltip } from '@chakra-ui/react';
import {ChatState} from '../../Context/ChatProvider';

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
    return (
        <ScrollableFeed>
        {messages?.map((m, i) => (
            <div style={{display: "flex"}} key = {m._id}>
                {
                    isSameSender(messages, m, i, user._id) ||
                    isLastMessage(messages, i, user._id) && (
                        <Tooltip
                        label={m.sender.name}
                        placement = 'bottom-start'
                        hasArrow>
                            <Avatar
                            size="sm"
                            name={m.sender.name}
                            src={m.sender.profilePic}
                            />
                        </Tooltip>

                )}
                
            </div>       
        ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
