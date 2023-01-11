import { Button, Flex, Icon, useColorMode } from "@chakra-ui/react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import Bowser from "bowser";

import { WalletSection } from "../components";
import { useEffect, useState } from "react";
import { DeviceType, OS } from "@cosmos-kit/core";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  const [userAgent, setuserAgent] = useState("");
  const [p, setp] = useState("");

  useEffect(() => {
    setuserAgent(window.navigator.userAgent);
    const parser = Bowser.getParser(window.navigator.userAgent);
    const browser = parser.getBrowserName(true);
    const device = (parser.getPlatform().type || "desktop") as DeviceType;
    const os = parser.getOSName(true) as OS;
    setp(`${browser}, ${device}, ${os}`);
  }, []);

  return (
    <>
      <div>{userAgent}</div>
      <div>{p}</div>
      <Flex justifyContent="end" mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === "light" ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <WalletSection />
    </>
  );
}
