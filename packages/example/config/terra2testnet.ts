/**
 * remark: This is an example config file for a terra testnet chain and it should be deleted before merging.
 */
import type { Chain, AssetList } from "@chain-registry/types";

export const terra2testnet: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "terra2testnet",
  status: "live",
  network_type: "testnet",
  pretty_name: "Terra Testnet",
  chain_id: "pisco-1",
  bech32_prefix: "terra",
  daemon_name: "terrad",
  node_home: "$HOME/.terrad",
  slip44: 330,
  fees: {
    fee_tokens: [
      {
        denom: "uluna",
        fixed_min_gas_price: 0,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.15,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "uluna",
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/terra-money/core",
    recommended_version: "v2.2.0",
    compatible_versions: ["v2.2.0"],
    cosmos_sdk_version: "0.45.10",
    tendermint_version: "0.34.22",
    cosmwasm_version: "0.27",
    cosmwasm_enabled: true,
  },
  apis: {
    rpc: [
      {
        address: "https://terra-testnet-rpc.polkachu.com/",
      },
    ],
    rest: [
      {
        address: "https://pisco-lcd.terra.dev/",
      },
    ],
    grpc: [],
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/luna.png",
  },
  keywords: ["testnet"],
};

export const terra2testnetAssets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "terra2testnet",
  assets: [
    {
      description: "The native token of Terra",
      denom_units: [
        {
          denom: "uluna",
          exponent: 0,
          aliases: [],
        },
        {
          denom: "luna",
          exponent: 6,
          aliases: [],
        },
      ],
      base: "uluna",
      name: "Luna",
      display: "luna",
      symbol: "LUNA",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/luna.png",
      },
      coingecko_id: "terra",
      keywords: ["staking"],
    },
  ],
};
