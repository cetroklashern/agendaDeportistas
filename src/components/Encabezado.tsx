import HamburgerIcon from "./HamburgerIcon";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Flex,
  Box,
  Image,
  Spacer,
  Badge,
} from "@chakra-ui/react";

type Props = {
  data: { id: number; name: string; page: string }[];
  onClick: (element: { id: number; name: string; page: string }) => void;
};

// Íconos por sección para hacer el menú más visual
const menuIcons: Record<string, string> = {
  Inicio: "🏠",
  "Gestión de Cursos": "📚",
  "Gestión de Profesores": "👨‍🏫",
  "Gestión de Ubicaciones": "📍",
  "Gestión Deportista": "🤸",
  "Agendamiento de Deportistas": "📅",
};

function Encabezado(props: Props) {
  const data = props.data;

  const handleClick = (event: { id: number; name: string; page: string }) => {
    props.onClick(event);
  };

  return (
    <Flex
      align="center"
      px={4}
      py={2}
      bgGradient="linear(to-r, #E91E8C, #C2185B, #1565C0, #29B6F6)"
      boxShadow="0 4px 16px rgba(233,30,140,0.4)"
      position="sticky"
      top={0}
      zIndex={100}
      minH="72px"
    >
      {/* Menú hamburguesa */}
      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Menú"
            icon={<HamburgerIcon />}
            variant="solid"
            bg="white"
            color="#E91E8C"
            _hover={{ bg: "#FCE4EC", transform: "scale(1.05)" }}
            _active={{ bg: "#F8BBD0" }}
            borderRadius="full"
            boxShadow="0 2px 8px rgba(0,0,0,0.3)"
          />
          <MenuList
            bg="white"
            borderColor="#F8BBD0"
            borderRadius="xl"
            boxShadow="0 8px 24px rgba(0,0,0,0.15)"
            overflow="hidden"
            p={1}
          >
            {data.map((item) => (
              <MenuItem
                onClick={() => handleClick(item)}
                key={item.id}
                borderRadius="lg"
                _hover={{ bg: "#FCE4EC", color: "#E91E8C" }}
                fontWeight="700"
                py={3}
                px={4}
                gap={3}
              >
                <Text fontSize="18px">{menuIcons[item.name] ?? "▪️"}</Text>
                <Text>{item.name}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>

      <Spacer />

      {/* Título central */}
      <Box textAlign="center">
        <Text
          fontSize={{ base: "16px", md: "22px", lg: "26px" }}
          fontWeight="900"
          color="white"
          letterSpacing="0.5px"
          textShadow="1px 2px 6px rgba(0,0,0,0.35)"
          fontFamily="'Fredoka One', cursive"
        >
          Exploradores Gimnasio Infantil
        </Text>
        <Text
          fontSize="12px"
          color="#FCE4EC"
          fontWeight="600"
          letterSpacing="1.5px"
          textTransform="uppercase"
        >
          Sistema de Agendamiento
        </Text>
      </Box>

      <Spacer />

      {/* Logo */}
      <Box position="relative">
        <Image
          width={{ base: "60px", md: "80px" }}
          height={{ base: "60px", md: "80px" }}
          src="/logoExploradores.png"
          alt="Logo Exploradores"
          borderRadius="full"
          bg="white"
          p="4px"
          boxShadow="0 2px 10px rgba(0,0,0,0.3)"
          objectFit="contain"
        />
      </Box>
    </Flex>
  );
}

export default Encabezado;
