import { useChain } from "@cosmos-kit/react";
import { chains } from "chain-registry";
import Link from "next/link";

export const chainNames = ["cosmoshub", "osmosis", "stargaze", "chihuahua"];

export const chainsInfo = chainNames.map((name) => {
  const chain = chains.find((chain) => chain.chain_name === name);
  return {
    name,
    prettyName: chain?.pretty_name,
  };
});

export function ChainLayout({
  openModal,
  activeChain,
  linkFormat,
  children,
}: {
  openModal: () => void;
  activeChain: string;
  linkFormat: string;
  children: JSX.Element;
}) {
  return (
    <div className="d-flex flex-row">
      <div
        className="p-4 bg-body-tertiary rounded"
        style={{ minHeight: "90vh" }}
      >
        <div>
          <button className="btn btn-primary" onClick={openModal}>
            Open Modal
          </button>
        </div>
        <ul className="nav flex-column mt-4">
          {chainsInfo.map(({ name, prettyName }) => {
            return (
              <li className="nav-item my-1" key={name}>
                <Link
                  className={`bd-links-link d-inline-block rounded ${
                    activeChain === name ? "active" : ""
                  }`}
                  href={`${linkFormat}${name}`}
                >
                  {prettyName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4" style={{ minWidth: "600px" }}>
        {children}
      </div>
    </div>
  );
}

export function ChainTable({
  chainName,
  username,
  address,
}: {
  chainName: string;
  username?: string;
  address?: string;
}) {
  return (
    <div className="border border-secondary-subtle rounded-1 px-4 py-3">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Chain</th>
            <th scope="col">Username</th>
            <th scope="col">Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{chainName}</td>
            <td>{username}</td>
            <td>
              {address &&
                `${address?.slice(0, 7)}...${address?.slice(
                  address.length - 4,
                  address.length
                )}`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ChainPage(props: { name: string; prettyName: string }) {
  const { username, openView, address } = useChain(props.name);

  return (
    <ChainLayout
      openModal={openView}
      activeChain={props.name}
      linkFormat={"/chain/"}
    >
      <ChainTable
        chainName={props.prettyName}
        username={username}
        address={address}
      ></ChainTable>
    </ChainLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: chainNames.map((chainName) => ({
      params: {
        name: chainName,
      },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: { params: { name: string } }) {
  const chainInfo = chainsInfo.find((chain) => chain.name === params.name);
  return {
    props: {
      ...chainInfo,
    },
  };
}
