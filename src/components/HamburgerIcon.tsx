import { Box, Image } from "@chakra-ui/react";

function HamburgerIcon() {
  return (
    <>
      <Box>
        <Image boxSize="2rem" src={"/public/menu.png"} alt="Menu" />
      </Box>
    </>
  );
}

export default HamburgerIcon;
