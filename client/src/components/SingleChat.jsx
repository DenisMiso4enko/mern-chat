import './style.css';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider.jsx';
import { Box, IconButton, Text, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import UpdateGroupChatModal from './UpdateGroupChatModal.jsx';
import { getSender, getSenderFull } from '../config/ChatLogics.js';
import ProfileModal from './ProfileModal.jsx';
import ScrollableChat from './ScrollableChat.jsx';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { instance } from '../axios/index.js';

const ENDPOINT = 'http://localhost:5000';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();


  const { user, selectedChat, setSelectedChat } = ChatState();

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      // socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json', Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        const { data } = await instance.post('/api/message', {
          content: newMessage, chatId: selectedChat,
        }, config);
        // socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await instance.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    // selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);


  return (<>
    {selectedChat ? (<>
      <Text
        ontSize={{ base: '28px', md: '30px' }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: 'space-between' }}
        alignItems="center"
      >
        <IconButton
          d={{ base: 'flex', md: 'none' }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat('')}
        />
        {!selectedChat.isGroupChat ? (<>
          {getSender(user, selectedChat.users)}
          <ProfileModal user={getSenderFull(user, selectedChat.users)} />
        </>) : (<>
          {selectedChat.chatName.toUpperCase()}
          <UpdateGroupChatModal
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
          />
        </>)}
      </Text>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'flex-end'}
        p={3}
        bg={'#E8E8E8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflowY={'hidden'}
      >
        {loading ? (<Spinner
          size="xl"
          w={20}
          h={20}
          alignSelf="center"
          margin="auto"
        />) : (
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}
        <FormControl onKeyDown={sendMessage} isRequired={true} mt={3}>
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler} />
        </FormControl>
      </Box>
    </>) : (<Box d="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
      </Text>
    </Box>)}
  </>);
};

export default SingleChat;