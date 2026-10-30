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
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import {Moon, Plus, Sun, User} from 'react-feather';

import {WEIGHT_TRACKER_ROUTES} from '../../constants';
import {authRequests} from '../../api';

interface NavbarProps {
  username: string;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const Navbar = (props: NavbarProps) => {
  const {colorMode, toggleColorMode} = useColorMode();
  const background = useColorModeValue('whiteAlpha.900', 'rgba(11, 30, 46, 0.92)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const controlBorder = useColorModeValue('gray.300', 'whiteAlpha.400');
  const controlHover = useColorModeValue('gray.100', 'whiteAlpha.100');

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
        <Tooltip label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton
            aria-label='Toggle color mode'
            variant='ghost'
            borderRadius='4px'
            icon={colorMode === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            onClick={toggleColorMode}
          />
        </Tooltip>
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
