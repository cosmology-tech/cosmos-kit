import { useRouter } from "next/router";
import { ChainLayout, ChainTable, chainsInfo } from "./[name]";
import { useChain } from "@cosmos-kit/react";

export default function () {
  const router = useRouter();
  const name = router.query.name as string;

  if (!name) {
    return <>Name undefined.</>;
  }

  const { username, openView, address } = useChain(name);
  const chainInfo = chainsInfo.find((chain) => chain.name === name);

  if (!chainInfo) {
    return <>Undefined chain.</>;
  }

  return (
    <ChainLayout
      openModal={openView}
      activeChain={name}
      linkFormat={"/chain/query?name="}
    >
      <ChainTable
        chainName={chainInfo.prettyName!}
        username={username}
        address={address}
      />
    </ChainLayout>
  );
}
