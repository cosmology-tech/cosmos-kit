import SignClient from "@walletconnect/sign-client";
import { useEffect, useState } from "react";

import { Web3Modal } from "../wc/client";

const projectId = "a8510432ebb71e6948cfd6cde54b70f7";

// 2. Configure web3modal
const web3modal = new Web3Modal({ projectId: projectId });

export default function HomePage() {
  const [signClient, setSignClient] = useState<SignClient | undefined>(
    undefined
  );
  const [qrcode, setQrcode] = useState(<></>);

  // 3. Initialize sign client
  async function onInitializeSignClient() {
    const client = await SignClient.init({
      projectId: projectId,
      relayUrl: "wss://relay.walletconnect.org",
    });
    setSignClient(client);
  }

  // 4. Initiate connection and pass pairing uri to the modal
  async function onOpenModal() {
    if (signClient) {
      const namespaces = {
        cosmos: {
          methods: [
            "cosmos_getAccounts",
            "cosmos_signAmino",
            "cosmos_signDirect",
          ],
          chains: [`cosmos:cosmoshub-4`],
          events: [],
        },
      };
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: namespaces,
      });
      if (uri) {
        // setQrcode(
        //   <QRCodeSVG
        //     value={uri}
        //     size={300}
        //     bgColor={"#ffffff"}
        //     fgColor={"#000000"}
        //     level={"L"}
        //     includeMargin={false}
        //   />
        // );
        // web3modal.openModal({
        //   uri,
        //   standaloneChains: namespaces.cosmos.chains,
        // });
        // await approval();
        // web3modal.closeModal();
      }
    }
  }

  useEffect(() => {
    onInitializeSignClient();
  }, []);

  return signClient ? (
    <div>
      <button onClick={onOpenModal}>Connect Wallet</button>
      {qrcode}
    </div>
  ) : (
    "Initializing..."
  );
}
