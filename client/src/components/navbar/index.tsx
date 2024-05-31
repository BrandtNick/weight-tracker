import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {User, Plus} from 'react-feather';

import {COLORS, WEIGHT_TRACKER_ROUTES} from '../../constants';
import {authRequests} from '../../api';

interface NavbarProps {
  username: string;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const Navbar = (props: NavbarProps) => {
  // API hooks
  const signOut = useMutation({
    mutationFn: authRequests.signOut,
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <Flex
      position='fixed'
      top='0'
      justify='space-between'
      align='center'
      bgGradient={`linear(to-b, ${COLORS.blue5}, ${COLORS.blue5}, ${COLORS.blue})`}
      color={COLORS.blue4}
      p='0 20px 35px'
      h='90px'
      w='100vw'
    >
      <Button
        _focus={{
          outline: 'none',
          bg: COLORS.blue5,
        }}
        _hover={{
          bg: COLORS.blue5,
          color: COLORS.blue4,
        }}
        w='42px'
        h='42px'
        p='8px'
        color={COLORS.blue4}
        bg={COLORS.blue5}
        onClick={() => {
          props.setRoute(WEIGHT_TRACKER_ROUTES.new);
        }}
      >
        <Plus />
      </Button>
      <Menu>
        <MenuButton
          bg={COLORS.blue5}
          _focus={{outline: 'none'}}
          p='8px'
        >
          <User />
        </MenuButton>
        <MenuList
          bg={COLORS.blue5}
          p='0'
          borderRadius='0'
          border={`1px solid ${COLORS.blue2}`}
          fontSize='.8em'
        >
          <Flex
            h='40px'
            p='10px'
            borderBottom={`1px solid ${COLORS.blue2}`}
          >
            <h3>Logged in as: <b>{props.username}</b></h3>
          </Flex>
          <MenuItem
            onClick={() => {
              signOut.mutate();
            }}
            border='none'
            bg={COLORS.blue5}
            _focus={{outline: 'none'}}
            _hover={{bg: COLORS.blue2, color: COLORS.blue4, border: 'none'}}
            borderRadius={0}
          >
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Navbar;
