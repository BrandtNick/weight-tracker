import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  extendTheme,
  useColorModeValue,
} from '@chakra-ui/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import Views from './views';
import {COLORS} from './constants';

const queryClient = new QueryClient()
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        transitionProperty: 'background-color',
        transitionDuration: 'normal',
      },
    },
  },
})

const AppContent = () => {
  const background = useColorModeValue('gray.50', COLORS.blue);

  return (
    <Flex
      justify='center'
      align='flex-start'
      background={background}
      minHeight='100vh'
      width='100%'
    >
      <Views />
    </Flex>
  )
}

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='dark' />
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
