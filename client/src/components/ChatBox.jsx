import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider.jsx';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      d={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: '100%', md: '68%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/*<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />*/}
      Selected chat
    </Box>
  );
};

export default ChatBox;