/*
 * Data taken from @osmosis-labs/osmosis-frontend with minor alterations.
 * https://github.com/osmosis-labs/osmosis-frontend/blob/11bfa1f07f0dda8c8aab1048bd04270a23641783/packages/web/config/chain-infos.ts
 */

import { Bech32Address } from "@keplr-wallet/cosmos"
import { AppCurrency, ChainInfo } from "@keplr-wallet/types"

import { ChainInfoOverrides } from "../types"

export enum ChainInfoID {
  Osmosis1 = "osmosis-1",
  Cosmoshub4 = "cosmoshub-4",
  Columbus5 = "columbus-5",
  Secret4 = "secret-4",
  Akashnet2 = "akashnet-2",
  Regen1 = "regen-1",
  Sentinelhub2 = "sentinelhub-2",
  Core1 = "core-1",
  Irishub1 = "irishub-1",
  CryptoOrgChainMainnet1 = "crypto-org-chain-mainnet-1",
  IovMainnetIbc = "iov-mainnet-ibc",
  Emoney3 = "emoney-3",
  Juno1 = "juno-1",
  Uni3 = "uni-3",
  Microtick1 = "microtick-1",
  LikecoinMainnet2 = "likecoin-mainnet-2",
  Impacthub3 = "impacthub-3",
  Bitcanna1 = "bitcanna-1",
  Bitsong2b = "bitsong-2b",
  Kichain2 = "kichain-2",
  Panacea3 = "panacea-3",
  Bostrom = "bostrom",
  Comdex1 = "comdex-1",
  CheqdMainnet1 = "cheqd-mainnet-1",
  Stargaze1 = "stargaze-1",
  Chihuahua1 = "chihuahua-1",
  LumNetwork1 = "lum-network-1",
  Vidulum1 = "vidulum-1",
  DesmosMainnet = "desmos-mainnet",
  Dig1 = "dig-1",
  Sommelier3 = "sommelier-3",
  Sifchain1 = "sifchain-1",
  LaoziMainnet = "laozi-mainnet",
  Darchub = "darchub",
  Umee1 = "umee-1",
  GravityBridge3 = "gravity-bridge-3",
  Mainnet3 = "mainnet-3",
  Shentu22 = "shentu-2.2",
  Carbon1 = "carbon-1",
  Injective1 = "injective-1",
  CerberusChain1 = "cerberus-chain-1",
  Fetchhub4 = "fetchhub-4",
  Mantle1 = "mantle-1",
  PioMainnet1 = "pio-mainnet-1",
  Galaxy1 = "galaxy-1",
  Meme1 = "meme-1",
  Evmos_9001_2 = "evmos_9001-2",
  Phoenix1 = "phoenix-1",
  Titan1 = "titan-1",
  Kava_2222_10 = "kava_2222-10",
  Genesis_29_2 = "genesis_29-2",
}

/** All currency attributes (stake and fee) are defined once in the `currencies` list.
 *  Maintains the option to skip this conversion and keep the verbose `ChainInfo` type.
 */
export type SimplifiedChainInfo = Omit<
  ChainInfo,
  "stakeCurrency" | "feeCurrencies"
> & {
  currencies: Array<
    AppCurrency & {
      isStakeCurrency?: boolean
      isFeeCurrency?: boolean
    }
  >
}

/** Convert a less redundant chain info schema into one that is accepted by Keplr's suggestChain: `ChainInfo`. */
export function createKeplrChainInfos(
  chainInfo: SimplifiedChainInfo
): ChainInfo {
  const feeCurrencies: AppCurrency[] = []
  let stakeCurrency: AppCurrency | undefined

  for (const currency of chainInfo.currencies) {
    if (currency.isFeeCurrency) {
      feeCurrencies.push(currency)
    }

    if (currency.isStakeCurrency && stakeCurrency === undefined) {
      stakeCurrency = currency
    } else if (currency.isStakeCurrency) {
      throw new Error(
        `There cannot be more than one stake currency for ${chainInfo.chainName}`
      )
    }
  }

  if (stakeCurrency === undefined) {
    throw new Error(
      `Did not specify a stake currency for ${chainInfo.chainName}`
    )
  }

  if (feeCurrencies.length === 0) {
    throw new Error(
      `Did not specify any fee currencies for ${chainInfo.chainName}`
    )
  }

  return {
    ...chainInfo,
    stakeCurrency,
    feeCurrencies,
  }
}

export const ChainInfoList: ChainInfo[] = (
  [
    {
      rpc: "https://rpc-osmosis.keplr.app/", // test: "http://rpc-test.osmosis.zone/"
      rest: "https://lcd-osmosis.keplr.app/", // test: "http://lcd-test.osmosis.zone/"
      chainId: ChainInfoID.Osmosis1, // test: "osmo-test-4"
      chainName: "Osmosis",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("osmo"),
      currencies: [
        {
          coinDenom: "OSMO",
          coinMinimalDenom: "uosmo",
          coinDecimals: 6,
          coinGeckoId: "osmosis",
          coinImageUrl: "/tokens/osmo.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "ION",
          coinMinimalDenom: "uion",
          coinDecimals: 6,
          coinGeckoId: "ion",
          coinImageUrl: "/tokens/ion.png",
        },
      ],
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0.025,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-cosmoshub.keplr.app",
      rest: "https://lcd-cosmoshub.keplr.app",
      chainId: ChainInfoID.Cosmoshub4,
      chainName: "Cosmos Hub",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("cosmos"),
      currencies: [
        {
          coinDenom: "ATOM",
          coinMinimalDenom: "uatom",
          coinDecimals: 6,
          coinGeckoId: "cosmos",
          coinImageUrl: "/tokens/atom.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-columbus.keplr.app",
      rest: "https://lcd-columbus.keplr.app",
      chainId: ChainInfoID.Columbus5,
      chainName: "Terra Classic",
      bip44: {
        coinType: 330,
      },
      bech32Config: Bech32Address.defaultBech32Config("terra"),
      currencies: [
        {
          coinDenom: "LUNC",
          coinMinimalDenom: "uluna",
          coinDecimals: 6,
          coinGeckoId: "terra-luna",
          coinImageUrl: "/tokens/lunc.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "USTC",
          coinMinimalDenom: "uusd",
          coinDecimals: 6,
          coinGeckoId: "terrausd",
          coinImageUrl: "/tokens/ustc.png",
          isFeeCurrency: true,
          pegMechanism: "algorithmic",
        },
        {
          coinDenom: "KRTC",
          coinMinimalDenom: "ukrw",
          coinDecimals: 6,
          coinGeckoId: "terra-krw",
          coinImageUrl: "/tokens/krtc.png",
          pegMechanism: "algorithmic",
        },
      ],
      gasPriceStep: {
        low: 5.665,
        average: 5.665,
        high: 10,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-secret.keplr.app",
      rest: "https://lcd-secret.keplr.app",
      chainId: ChainInfoID.Secret4,
      chainName: "Secret Network",
      bip44: {
        coinType: 529,
      },
      bech32Config: Bech32Address.defaultBech32Config("secret"),
      currencies: [
        {
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
          coinDecimals: 6,
          coinGeckoId: "secret",
          coinImageUrl: "/tokens/scrt.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-akash.keplr.app",
      rest: "https://lcd-akash.keplr.app",
      chainId: ChainInfoID.Akashnet2,
      chainName: "Akash",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("akash"),
      currencies: [
        {
          coinDenom: "AKT",
          coinMinimalDenom: "uakt",
          coinDecimals: 6,
          coinGeckoId: "akash-network",
          coinImageUrl: "/tokens/akt.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "ibc-go", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-regen.keplr.app",
      rest: "https://lcd-regen.keplr.app",
      chainId: ChainInfoID.Regen1,
      chainName: "Regen Network",
      bip44: { coinType: 118 },
      bech32Config: Bech32Address.defaultBech32Config("regen"),
      currencies: [
        {
          coinDenom: "REGEN",
          coinMinimalDenom: "uregen",
          coinDecimals: 6,
          coinImageUrl: "/tokens/regen.png",
          coinGeckoId: "regen",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-sentinel.keplr.app",
      rest: "https://lcd-sentinel.keplr.app",
      chainId: ChainInfoID.Sentinelhub2,
      chainName: "Sentinel",
      bip44: { coinType: 118 },
      bech32Config: Bech32Address.defaultBech32Config("sent"),
      currencies: [
        {
          coinDenom: "DVPN",
          coinMinimalDenom: "udvpn",
          coinDecimals: 6,
          coinGeckoId: "sentinel",
          coinImageUrl: "/tokens/dvpn.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-persistence.keplr.app",
      rest: "https://lcd-persistence.keplr.app",
      chainId: ChainInfoID.Core1,
      chainName: "Persistence",
      bip44: {
        coinType: 750,
      },
      bech32Config: Bech32Address.defaultBech32Config("persistence"),
      currencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence",
          coinImageUrl: "/tokens/xprt.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "PSTAKE",
          coinMinimalDenom:
            "ibc/A6E3AF63B3C906416A9AF7A556C59EA4BD50E617EFFE6299B99700CCB780E444",
          coinDecimals: 18,
          coinGeckoId: "pstake-finance",
          coinImageUrl: "/tokens/pstake.png",
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-iris.keplr.app",
      rest: "https://lcd-iris.keplr.app",
      chainId: ChainInfoID.Irishub1,
      chainName: "IRISnet",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("iaa"),
      currencies: [
        {
          coinDenom: "IRIS",
          coinMinimalDenom: "uiris",
          coinDecimals: 6,
          coinGeckoId: "iris-network",
          coinImageUrl: "/tokens/iris.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-crypto-org.keplr.app/",
      rest: "https://lcd-crypto-org.keplr.app/",
      chainId: ChainInfoID.CryptoOrgChainMainnet1,
      chainName: "Crypto.org",
      bip44: {
        coinType: 394,
      },
      bech32Config: Bech32Address.defaultBech32Config("cro"),
      currencies: [
        {
          coinDenom: "CRO",
          coinMinimalDenom: "basecro",
          coinDecimals: 8,
          coinGeckoId: "crypto-com-chain",
          coinImageUrl: "/tokens/cro.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc-iov.keplr.app",
      rest: "https://lcd-iov.keplr.app",
      chainId: ChainInfoID.IovMainnetIbc,
      chainName: "Starname",
      bip44: {
        coinType: 234,
      },
      bech32Config: Bech32Address.defaultBech32Config("star"),
      currencies: [
        {
          coinDenom: "IOV",
          coinMinimalDenom: "uiov",
          coinDecimals: 6,
          coinGeckoId: "starname",
          coinImageUrl: "/tokens/iov.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc-emoney.keplr.app",
      rest: "https://lcd-emoney.keplr.app",
      chainId: ChainInfoID.Emoney3,
      chainName: "e-Money",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("emoney"),
      currencies: [
        {
          coinDenom: "NGM",
          coinMinimalDenom: "ungm",
          coinDecimals: 6,
          coinGeckoId: "e-money",
          coinImageUrl: "/tokens/ngm.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "EEUR",
          coinMinimalDenom: "eeur",
          coinDecimals: 6,
          coinGeckoId: "e-money-eur",
          coinImageUrl: "/tokens/eeur.png",
        },
      ],
      gasPriceStep: {
        low: 1,
        average: 1,
        high: 1,
      },
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc-juno.itastakers.com",
      rest: "https://lcd-juno.itastakers.com",
      chainId: ChainInfoID.Juno1,
      chainName: "Juno",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("juno"),
      currencies: [
        {
          coinDenom: "JUNO",
          coinMinimalDenom: "ujuno",
          coinDecimals: 6,
          coinGeckoId: "juno-network",
          coinImageUrl: "/tokens/juno.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.03,
        average: 0.04,
        high: 0.05,
      },
      features: [
        "stargate",
        "ibc-transfer",
        "ibc-go",
        "no-legacy-stdTx",
        "wasmd_0.24+",
        "cosmwasm",
      ],
    },
    {
      rpc: "https://rpc.uni.juno.deuslabs.fi",
      rest: "https://lcd.uni.juno.deuslabs.fi",
      chainId: ChainInfoID.Uni3,
      chainName: "Juno Testnet",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("juno"),
      currencies: [
        {
          coinDenom: "junox",
          coinMinimalDenom: "ujunox",
          coinDecimals: 6,
          coinImageUrl: "/tokens/juno.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.03,
        average: 0.04,
        high: 0.05,
      },
      features: ["ibc-transfer", "ibc-go"],
    },
    {
      rpc: "https://rpc-microtick.keplr.app",
      rest: "https://lcd-microtick.keplr.app",
      chainId: ChainInfoID.Microtick1,
      chainName: "Microtick",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("micro"),
      currencies: [
        {
          coinDenom: "TICK",
          coinMinimalDenom: "utick",
          coinDecimals: 6,
          coinGeckoId: "pool:utick",
          coinImageUrl: "/tokens/tick.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://mainnet-node.like.co/rpc",
      rest: "https://mainnet-node.like.co",
      chainId: ChainInfoID.LikecoinMainnet2,
      chainName: "LikeCoin",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("like"),
      currencies: [
        {
          coinDenom: "LIKE",
          coinMinimalDenom: "nanolike",
          coinDecimals: 9,
          coinGeckoId: "likecoin",
          coinImageUrl: "/tokens/like.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-impacthub.keplr.app",
      rest: "https://lcd-impacthub.keplr.app",
      chainId: ChainInfoID.Impacthub3,
      chainName: "IXO",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("ixo"),
      currencies: [
        {
          coinDenom: "IXO",
          coinMinimalDenom: "uixo",
          coinDecimals: 6,
          coinGeckoId: "pool:uixo",
          coinImageUrl: "/tokens/ixo.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc.bitcanna.io",
      rest: "https://lcd.bitcanna.io",
      chainId: ChainInfoID.Bitcanna1,
      chainName: "BitCanna",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("bcna"),
      currencies: [
        {
          coinDenom: "BCNA",
          coinMinimalDenom: "ubcna",
          coinDecimals: 6,
          coinGeckoId: "bitcanna",
          coinImageUrl: "/tokens/bcna.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.explorebitsong.com",
      rest: "https://lcd.explorebitsong.com",
      chainId: ChainInfoID.Bitsong2b,
      chainName: "BitSong",
      bip44: {
        coinType: 639,
      },
      bech32Config: Bech32Address.defaultBech32Config("bitsong"),
      currencies: [
        {
          coinDenom: "BTSG",
          coinMinimalDenom: "ubtsg",
          coinDecimals: 6,
          coinGeckoId: "pool:ubtsg",
          coinImageUrl: "/tokens/btsg.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-mainnet.blockchain.ki",
      rest: "https://api-mainnet.blockchain.ki",
      chainId: ChainInfoID.Kichain2,
      chainName: "Ki",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("ki"),
      currencies: [
        {
          coinDenom: "XKI",
          coinMinimalDenom: "uxki",
          coinDecimals: 6,
          coinGeckoId: "pool:uxki",
          coinImageUrl: "/tokens/xki.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc.gopanacea.org",
      rest: "https://api.gopanacea.org",
      chainId: ChainInfoID.Panacea3,
      chainName: "MediBloc",
      bip44: {
        coinType: 371,
      },
      bech32Config: Bech32Address.defaultBech32Config("panacea"),
      currencies: [
        {
          coinDenom: "MED",
          coinMinimalDenom: "umed",
          coinDecimals: 6,
          coinGeckoId: "medibloc",
          coinImageUrl: "/tokens/med.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 5,
        average: 7,
        high: 9,
      },
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc.bostrom.cybernode.ai",
      rest: "https://lcd.bostrom.cybernode.ai",
      chainId: ChainInfoID.Bostrom,
      chainName: "Bostrom",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("bostrom"),
      currencies: [
        {
          coinDenom: "BOOT",
          coinMinimalDenom: "boot",
          coinDecimals: 0,
          coinGeckoId: "bostrom",
          coinImageUrl: "/tokens/boot.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.comdex.one",
      rest: "https://rest.comdex.one",
      chainId: ChainInfoID.Comdex1,
      chainName: "Comdex",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("comdex"),
      currencies: [
        {
          coinDenom: "CMDX",
          coinMinimalDenom: "ucmdx",
          coinDecimals: 6,
          coinGeckoId: "comdex",
          coinImageUrl: "/tokens/cmdx.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.cheqd.net",
      rest: "https://api.cheqd.net",
      chainId: ChainInfoID.CheqdMainnet1,
      chainName: "cheqd",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("cheqd"),
      currencies: [
        {
          coinDenom: "CHEQ",
          coinMinimalDenom: "ncheq",
          coinDecimals: 9,
          coinGeckoId: "cheqd-network",
          coinImageUrl: "/tokens/cheq.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 25,
        average: 50,
        high: 100,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.stargaze-apis.com",
      rest: "https://rest.stargaze-apis.com",
      chainId: ChainInfoID.Stargaze1,
      chainName: "Stargaze",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("stars"),
      currencies: [
        {
          coinDenom: "STARS",
          coinMinimalDenom: "ustars",
          coinDecimals: 6,
          coinGeckoId: "pool:ustars",
          coinImageUrl: "/tokens/stars.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.chihuahua.wtf",
      rest: "https://api.chihuahua.wtf",
      chainId: ChainInfoID.Chihuahua1,
      chainName: "Chihuahua",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("chihuahua"),
      currencies: [
        {
          coinDenom: "HUAHUA",
          coinMinimalDenom: "uhuahua",
          coinDecimals: 6,
          coinGeckoId: "pool:uhuahua",
          coinImageUrl: "/tokens/huahua.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.03,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://node0.mainnet.lum.network/rpc",
      rest: "https://node0.mainnet.lum.network/rest",
      chainId: ChainInfoID.LumNetwork1,
      chainName: "Lum Network",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("lum"),
      currencies: [
        {
          coinDenom: "LUM",
          coinMinimalDenom: "ulum",
          coinDecimals: 6,
          coinGeckoId: "pool:ulum",
          coinImageUrl: "/tokens/lum.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://mainnet-rpc.vidulum.app",
      rest: "https://mainnet-lcd.vidulum.app",
      chainId: ChainInfoID.Vidulum1,
      chainName: "Vidulum",
      bip44: {
        coinType: 370,
      },
      bech32Config: Bech32Address.defaultBech32Config("vdl"),
      currencies: [
        {
          coinDenom: "VDL",
          coinMinimalDenom: "uvdl",
          coinDecimals: 6,
          coinGeckoId: "vidulum",
          coinImageUrl: "/tokens/vdl.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.mainnet.desmos.network",
      rest: "https://api.mainnet.desmos.network",
      chainId: ChainInfoID.DesmosMainnet,
      chainName: "Desmos",
      bip44: {
        coinType: 852,
      },
      bech32Config: Bech32Address.defaultBech32Config("desmos"),
      currencies: [
        {
          coinDenom: "DSM",
          coinMinimalDenom: "udsm",
          coinDecimals: 6,
          coinGeckoId: "pool:udsm",
          coinImageUrl: "/tokens/dsm.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-1-dig.notional.ventures",
      rest: "https://api-1-dig.notional.ventures",
      chainId: ChainInfoID.Dig1,
      chainName: "Dig",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("dig"),
      currencies: [
        {
          coinDenom: "DIG",
          coinMinimalDenom: "udig",
          coinDecimals: 6,
          coinGeckoId: "pool:udig",
          coinImageUrl: "/tokens/dig.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.03,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-sommelier.keplr.app",
      rest: "https://lcd-sommelier.keplr.app",
      chainId: ChainInfoID.Sommelier3,
      chainName: "Sommelier",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("somm"),
      currencies: [
        {
          coinDenom: "SOMM",
          coinMinimalDenom: "usomm",
          coinDecimals: 6,
          coinGeckoId: "pool:usomm",
          coinImageUrl: "/tokens/somm.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.sifchain.finance",
      rest: "https://api-int.sifchain.finance",
      chainId: ChainInfoID.Sifchain1,
      chainName: "Sifchain",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("sif"),
      currencies: [
        {
          coinDenom: "ROWAN",
          coinMinimalDenom: "rowan",
          coinDecimals: 18,
          coinGeckoId: "sifchain",
          coinImageUrl: "/tokens/rowan.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer"],
    },
    {
      rpc: "https://rpc.laozi3.bandchain.org",
      rest: "https://laozi1.bandchain.org/api",
      chainId: ChainInfoID.LaoziMainnet,
      chainName: "BandChain",
      bip44: {
        coinType: 494,
      },
      bech32Config: Bech32Address.defaultBech32Config("band"),
      currencies: [
        {
          coinDenom: "BAND",
          coinMinimalDenom: "uband",
          coinDecimals: 6,
          coinGeckoId: "band-protocol",
          coinImageUrl: "/tokens/band.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://node1.konstellation.tech:26657",
      rest: "https://node1.konstellation.tech:1318",
      chainId: ChainInfoID.Darchub,
      chainName: "Konstellation",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("darc"),
      currencies: [
        {
          coinDenom: "DARC",
          coinMinimalDenom: "udarc",
          coinDecimals: 6,
          coinGeckoId: "pool:udarc",
          coinImageUrl: "/tokens/darc.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpc.aphrodite.main.network.umee.cc",
      rest: "https://api.aphrodite.main.network.umee.cc",
      chainId: ChainInfoID.Umee1,
      chainName: "Umee",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("umee"),
      currencies: [
        {
          coinDenom: "UMEE",
          coinMinimalDenom: "uumee",
          coinDecimals: 6,
          coinGeckoId: "pool:uumee",
          coinImageUrl: "/tokens/umee.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://gravitychain.io:26657",
      rest: "https://gravitychain.io:1317",
      chainId: ChainInfoID.GravityBridge3,
      chainName: "Gravity Bridge",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("gravity"),
      currencies: [
        {
          coinDenom: "GRAV",
          coinMinimalDenom: "ugraviton",
          coinDecimals: 6,
          coinGeckoId: "pool:ugraviton",
          coinImageUrl: "/tokens/grav.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "PSTAKE",
          coinMinimalDenom: "gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006",
          coinDecimals: 18,
          coinGeckoId: "pstake-finance",
          coinImageUrl: "/tokens/pstake.png",
        },
        {
          coinDenom: "WBTC.grv",
          coinMinimalDenom: "gravity0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          coinDecimals: 8,
          coinGeckoId: "wrapped-bitcoin",
          coinImageUrl: "/tokens/gwbtc.png",
        },
        {
          coinDenom: "WETH.grv",
          coinMinimalDenom: "gravity0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          coinDecimals: 18,
          coinGeckoId: "ethereum",
          coinImageUrl: "/tokens/gweth.png",
        },
        {
          coinDenom: "USDC.grv",
          coinMinimalDenom: "gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          coinDecimals: 6,
          coinGeckoId: "usd-coin",
          coinImageUrl: "/tokens/gusdc.png",
          pegMechanism: "collateralized",
        },
        {
          coinDenom: "DAI.grv",
          coinMinimalDenom: "gravity0x6B175474E89094C44Da98b954EedeAC495271d0F",
          coinDecimals: 18,
          coinGeckoId: "dai",
          coinImageUrl: "/tokens/gdai.png",
          pegMechanism: "collateralized",
        },
        {
          coinDenom: "USDT.grv",
          coinMinimalDenom: "gravity0xdAC17F958D2ee523a2206206994597C13D831ec7",
          coinDecimals: 6,
          coinGeckoId: "tether",
          coinImageUrl: "/tokens/gusdt.png",
          pegMechanism: "collateralized",
        },
      ],
      gasPriceStep: {
        low: 0,
        average: 0,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://poseidon.mainnet.decentr.xyz",
      rest: "https://rest.mainnet.decentr.xyz",
      chainId: ChainInfoID.Mainnet3,
      chainName: "Decentr",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("decentr"),
      currencies: [
        {
          coinDenom: "DEC",
          coinMinimalDenom: "udec",
          coinDecimals: 6,
          coinGeckoId: "decentr",
          coinImageUrl: "/tokens/dec.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://shenturpc.certikpowered.info",
      rest: "https://azuredragon.noopsbycertik.com",
      chainId: ChainInfoID.Shentu22,
      chainName: "Certik",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("certik"),
      currencies: [
        {
          coinDenom: "CTK",
          coinMinimalDenom: "uctk",
          coinDecimals: 6,
          coinGeckoId: "certik",
          coinImageUrl: "/tokens/ctk.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://tm-api.carbon.network",
      rest: "https://api.carbon.network",
      chainId: ChainInfoID.Carbon1,
      chainName: "Carbon",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("swth"),
      currencies: [
        {
          coinDenom: "SWTH",
          coinMinimalDenom: "swth",
          coinDecimals: 8,
          coinGeckoId: "switcheo",
          coinImageUrl: "/tokens/swth.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 769.23077,
        average: 769.23077,
        high: 769.23077,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://public.api.injective.network",
      rest: "https://public.lcd.injective.network",
      chainId: ChainInfoID.Injective1,
      chainName: "Injective",
      bip44: {
        coinType: 60,
      },
      bech32Config: Bech32Address.defaultBech32Config("inj"),
      currencies: [
        {
          coinDenom: "INJ",
          coinMinimalDenom: "inj",
          coinDecimals: 18,
          coinGeckoId: "injective-protocol",
          coinImageUrl: "/tokens/inj.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.0005,
        average: 0.0007,
        high: 0.0009,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.cerberus.zone:26657",
      rest: "https://api.cerberus.zone:1317",
      chainId: ChainInfoID.CerberusChain1,
      chainName: "Cerberus",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("cerberus"),
      currencies: [
        {
          coinDenom: "CRBRUS",
          coinMinimalDenom: "ucrbrus",
          coinDecimals: 6,
          coinGeckoId: "cerberus-2",
          coinImageUrl: "/tokens/crbrus.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-fetchhub.fetch.ai:443",
      rest: "https://rest-fetchhub.fetch.ai",
      chainId: ChainInfoID.Fetchhub4,
      chainName: "Fetch.ai",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("fetch"),
      currencies: [
        {
          coinDenom: "FET",
          coinMinimalDenom: "afet",
          coinDecimals: 18,
          coinGeckoId: "fetch-ai",
          coinImageUrl: "/tokens/fet.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.025,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.assetmantle.one/",
      rest: "https://rest.assetmantle.one/",
      chainId: ChainInfoID.Mantle1,
      chainName: "AssetMantle",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("mantle"),
      currencies: [
        {
          coinDenom: "MNTL",
          coinMinimalDenom: "umntl",
          coinDecimals: 6,
          coinGeckoId: "pool:umntl",
          coinImageUrl: "/tokens/mntl.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.provenance.io/",
      rest: "https://api.provenance.io",
      chainId: ChainInfoID.PioMainnet1,
      chainName: "Provenance",
      bip44: {
        coinType: 505,
      },
      bech32Config: Bech32Address.defaultBech32Config("pb"),
      currencies: [
        {
          coinDenom: "HASH",
          coinMinimalDenom: "nhash",
          coinGeckoId: "provenance-blockchain",
          coinDecimals: 9,
          coinImageUrl: "/tokens/hash.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 1905,
        average: 2100,
        high: 2500,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.galaxychain.zone",
      rest: "https://rest.galaxychain.zone",
      chainId: ChainInfoID.Galaxy1,
      chainName: "Galaxy",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("galaxy"),
      currencies: [
        {
          coinDenom: "GLX",
          coinMinimalDenom: "uglx",
          coinDecimals: 6,
          coinGeckoId: "pool:uglx",
          coinImageUrl: "/tokens/glx.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.025,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-meme-1.meme.sx:443",
      rest: "https://api-meme-1.meme.sx:443",
      chainId: ChainInfoID.Meme1,
      chainName: "Meme",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("meme"),
      currencies: [
        {
          coinDenom: "MEME",
          coinMinimalDenom: "umeme",
          coinDecimals: 6,
          coinGeckoId: "pool:umeme",
          coinImageUrl: "/tokens/meme.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.025,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-evmos.keplr.app/",
      rest: "https://lcd-evmos.keplr.app/",
      chainId: ChainInfoID.Evmos_9001_2,
      chainName: "Evmos",
      bip44: {
        coinType: 60,
      },
      bech32Config: Bech32Address.defaultBech32Config("evmos"),
      currencies: [
        {
          coinDenom: "EVMOS",
          coinMinimalDenom: "aevmos",
          coinDecimals: 18,
          coinGeckoId: "evmos",
          coinImageUrl: "/tokens/evmos.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 10000000000,
        average: 25000000000,
        high: 40000000000,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc.terrav2.ccvalidators.com/",
      rest: "https://phoenix-lcd.terra.dev/",
      chainId: ChainInfoID.Phoenix1,
      chainName: "Terra 2.0",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("terra"),
      currencies: [
        {
          coinDenom: "LUNA",
          coinMinimalDenom: "uluna",
          coinDecimals: 6,
          coinGeckoId: "terra-luna-2",
          coinImageUrl: "/tokens/luna.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.15,
        average: 0.2,
        high: 0.25,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
    },
    {
      rpc: "https://rpcapi.rizon.world/",
      rest: "https://restapi.rizon.world/",
      chainId: ChainInfoID.Titan1,
      chainName: "Rizon",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("rizon"),
      currencies: [
        {
          coinDenom: "ATOLO",
          coinMinimalDenom: "uatolo",
          coinDecimals: 6,
          coinGeckoId: "rizon",
          coinImageUrl: "/tokens/atolo.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 0.025,
        average: 0.025,
        high: 0.035,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://rpc-kava.keplr.app",
      rest: "https://lcd-kava.keplr.app",
      chainId: ChainInfoID.Kava_2222_10,
      chainName: "Kava",
      bip44: {
        coinType: 459,
      },
      bech32Config: Bech32Address.defaultBech32Config("kava"),
      currencies: [
        {
          coinDenom: "KAVA",
          coinMinimalDenom: "ukava",
          coinDecimals: 6,
          coinGeckoId: "kava",
          coinImageUrl: "/tokens/kava.png",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
        {
          coinDenom: "HARD",
          coinMinimalDenom: "hard",
          coinDecimals: 6,
          coinGeckoId: "kava-lend",
          coinImageUrl: "/tokens/hard.svg",
        },
        {
          coinDenom: "SWP",
          coinMinimalDenom: "swp",
          coinDecimals: 6,
          coinGeckoId: "kava-swap",
          coinImageUrl: "/tokens/swp.svg",
        },
      ],
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
    {
      rpc: "https://26657.genesisl1.org",
      rest: "https://api.genesisl1.org",
      chainId: ChainInfoID.Genesis_29_2,
      chainName: "GenesisL1",
      bip44: {
        coinType: 118,
      },
      bech32Config: Bech32Address.defaultBech32Config("genesis"),
      currencies: [
        {
          coinDenom: "L1",
          coinMinimalDenom: "el1",
          coinDecimals: 18,
          //coinGeckoId: "pool:el1",
          coinImageUrl: "/tokens/l1.svg",
          isStakeCurrency: true,
          isFeeCurrency: true,
        },
      ],
      gasPriceStep: {
        low: 999999999,
        average: 1000000000,
        high: 1000000001,
      },
      features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    },
  ] as SimplifiedChainInfo[]
).map(createKeplrChainInfos)

export const getChainInfo = async (
  chainId: ChainInfo["chainId"],
  chainInfoOverrides?: ChainInfoOverrides
) => {
  const overrides =
    typeof chainInfoOverrides === "function"
      ? await chainInfoOverrides()
      : chainInfoOverrides

  const availableChainIds = overrides
    ? [
        // Don't include built-in ChainInfo objects if an override with a
        // matching chain ID exists.
        ...ChainInfoList.filter(({ chainId }) =>
          overrides.some((override) => override.chainId === chainId)
        ),
        ...overrides,
      ]
    : ChainInfoList

  const chainInfo = availableChainIds.find((info) => info.chainId === chainId)
  if (!chainInfo) {
    throw new Error(
      `Chain ID "${chainId}" does not exist among provided ChainInfo objects. Available Chain IDs: ${availableChainIds
        .map(({ chainId }) => chainId)
        .join(",")}`
    )
  }
  return chainInfo
}
