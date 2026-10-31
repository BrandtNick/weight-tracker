import {
  ChakraProvider,
  Flex,
  extendTheme,
} from '@chakra-ui/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import Views from './views';
import {COLORS} from './constants';

const queryClient = new QueryClient()
const darkModeManager = {
  type: 'localStorage' as const,
  get: () => 'dark' as const,
  set: () => undefined,
}
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
  return (
    <Flex
      justify='center'
      align='flex-start'
      background={COLORS.blue}
      minHeight='100vh'
      width='100%'
    >
      <Views />
    </Flex>
  )
}

const App = () => {
  return (
    <ChakraProvider theme={theme} colorModeManager={darkModeManager}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
