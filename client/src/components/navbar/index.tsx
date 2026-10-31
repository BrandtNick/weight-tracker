import React from 'react';
import {useMutation} from '@tanstack/react-query';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import {Plus, User} from 'react-feather';

import {WEIGHT_TRACKER_ROUTES} from '../../constants';
import {authRequests} from '../../api';

interface NavbarProps {
  username: string;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const Navbar = (props: NavbarProps) => {
  const background = 'rgba(11, 30, 46, 0.92)';
  const borderColor = 'whiteAlpha.200';
  const textColor = 'gray.100';
  const controlBorder = 'whiteAlpha.400';
  const controlHover = 'rgba(90, 158, 208, 0.12)';

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
      left='0'
      zIndex='sticky'
      justify='space-between'
      align='center'
      background={background}
      backdropFilter='blur(14px)'
      borderBottom='1px solid'
      borderColor={borderColor}
      color={textColor}
      padding={{base: '0 16px', md: '0 28px'}}
      height='72px'
      width='100%'
    >
      <Button
        variant='ghost'
        padding='1'
        height='auto'
        onClick={() => props.setRoute(WEIGHT_TRACKER_ROUTES.show)}
        _hover={{background: 'transparent'}}
      >
        <Box textAlign='left'>
          <Text fontWeight='bold' fontSize='lg' lineHeight='1.1'>Weight Tracker</Text>
          <Text fontSize='xs' color='gray.500' fontWeight='normal'>Your progress, clearly</Text>
        </Box>
      </Button>
      <HStack spacing={{base: 1, md: 2}}>
        <Button
          display={{base: 'none', sm: 'inline-flex'}}
          size='sm'
          variant='outline'
          borderColor={controlBorder}
          color={textColor}
          borderRadius='4px'
          leftIcon={<Plus size={16} />}
          onClick={() => props.setRoute(WEIGHT_TRACKER_ROUTES.new)}
          _hover={{background: controlHover, borderColor: textColor}}
        >
          Add weight
        </Button>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='User menu'
            variant='ghost'
            borderRadius='4px'
            icon={<User size={20} />}
          />
          <MenuList fontSize='sm' padding='2' borderRadius='4px'>
            <Flex padding='2 3 3' direction='column'>
              <Text color='gray.500' fontSize='xs'>Signed in as</Text>
              <Text fontWeight='semibold'>{props.username}</Text>
            </Flex>
          <MenuItem
            onClick={() => {
              signOut.mutate();
            }}
            borderRadius='2px'
          >
            Sign out
          </MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          display={{base: 'inline-flex', sm: 'none'}}
          aria-label='Add weight'
          variant='outline'
          borderColor={controlBorder}
          color={textColor}
          borderRadius='4px'
          icon={<Plus size={19} />}
          onClick={() => props.setRoute(WEIGHT_TRACKER_ROUTES.new)}
          _hover={{background: controlHover, borderColor: textColor}}
        />
      </HStack>
    </Flex>
  );
};

export default Navbar;
