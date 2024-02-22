import { useChain } from "@cosmos-kit/react";
import { MouseEventHandler } from "react";
import { Box, useColorModeValue } from "@interchain-ui/react";
import {
  Astronaut,
  Error,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from ".";

export const WalletCardSection = ({ chainName }: { chainName: string }) => {
  const { connect, openView, status, username, address, message, wallet } =
    useChain(chainName);

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn
          intent="warning"
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          intent="error"
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  );

  const userInfo = username && (
    <ConnectedUserInfo username={username} icon={<Astronaut />} />
  );

  const addressBtn = (
    <CopyAddressBtn
      walletStatus={status}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="$8"
        alignItems="center"
        borderRadius="$lg"
        bg={useColorModeValue("$white", "$cardBg")}
        boxShadow={useColorModeValue(
          "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
          "0 0 2px #363636, 0 0 8px -2px #4f4f4f"
        )}
        px="$8"
        py="$12"
      >
        {userInfo}
        {addressBtn}

        <Box width="$full" textAlign="center" maxWidth="$30">
          {connectWalletButton}
        </Box>
      </Box>

      {connectWalletWarn && <Box>{connectWalletWarn}</Box>}
    </>
  );
};
