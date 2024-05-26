import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import {User, ChevronDown} from 'react-feather';

import {COLORS} from '../../constants';

interface NavbarProps {
  username: string;
}

const CustomButton = () => (
  <Button
    h='28px'
    w='100px'
    m='10px'
    variant='outline'
    colorScheme='blue'
    color={COLORS.blue3}
  />
);

const Navbar = (props: NavbarProps) => {
  return (
    <Flex
      position='fixed'
      top='0'
      justify='space-between'
      align='center'
      bgGradient={`linear(to-b, ${COLORS.blue5}, ${COLORS.blue5}, ${COLORS.blue})`}
      color={COLORS.blue3}
      p='0 20px 35px'
      h='90px'
      w='100vw'
    >
      <h3>WT</h3>
      <Menu>
        <MenuButton
          bg={COLORS.blue5}
          _focus={{outline: 'none'}}
          p='5px'
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
              // Logout
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
