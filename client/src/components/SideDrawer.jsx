import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import { useState } from 'react';
import { useToast } from '@chakra-ui/toast';
import { ChatState } from '../context/ChatProvider.jsx';
import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal.jsx';
import { useNavigate } from 'react-router-dom';
import { Input } from '@chakra-ui/input';
import { instance } from '../axios/index.js';
import UserListItem from './UserListItem.jsx';
import ChatLoading from './ChatLoading.jsx';
import { getSender } from '../config/ChatLogics.js';
import './style.css';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    setSelectedChat, user, notification, setNotification, chats, setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await instance.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json', Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await instance.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

  };

  return (<>
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Text d={{ base: 'none', md: 'flex' }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans">
        MERN Chat App
      </Text>
      <div>
        <Menu>
          <MenuButton p={1} className={'notification-badge'}>
            {!!notification.length && <span className={'badge'}>{notification.length}</span>}
            <BellIcon fz={'2xl'} m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && 'No New Messages'}
            {notification.map((notif) => (<MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}
            >
              {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
          <Box style={{ display: 'flex' }} pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (<ChatLoading />) : (searchResult?.map((user) => (<UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />)))}
          {loadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>);
};

export default SideDrawer;