import { EndpointOptions } from '@cosmos-kit/core';

export const preferredEndpoints: EndpointOptions['endpoints'] = {
  osmosis: {
    rpc: ['https://rpc-osmosis.keplr.app/'],
    rest: ['https://lcd-osmosis.keplr.app/'],
  },
  osmosistestnet: {
    rpc: ['https://rpc-test.osmosis.zone/'],
    rest: ['https://lcd-test.osmosis.zone/'],
  },
  cosmoshub: {
    rpc: ['https://rpc-cosmoshub.keplr.app'],
    rest: ['https://lcd-cosmoshub.keplr.app'],
  },
  terra: {
    rpc: ['https://rpc-columbus.keplr.app'],
    rest: ['https://lcd-columbus.keplr.app'],
  },
  secretnetwork: {
    rpc: ['https://rpc-secret.keplr.app'],
    rest: ['https://lcd-secret.keplr.app'],
  },
  akash: {
    rpc: ['https://rpc-akash.keplr.app'],
    rest: ['https://lcd-akash.keplr.app'],
  },
  regen: {
    rpc: ['https://rpc-regen.keplr.app'],
    rest: ['https://lcd-regen.keplr.app'],
  },
  sentinel: {
    rpc: ['https://rpc-sentinel.keplr.app'],
    rest: ['https://lcd-sentinel.keplr.app'],
  },
  persistence: {
    rpc: ['https://rpc-persistence.keplr.app'],
    rest: ['https://lcd-persistence.keplr.app'],
  },
  irisnet: {
    rpc: ['https://rpc-iris.keplr.app'],
    rest: ['https://lcd-iris.keplr.app'],
  },
  cryptoorgchain: {
    rpc: ['https://rpc-crypto-org.keplr.app/'],
    rest: ['https://lcd-crypto-org.keplr.app/'],
  },
  starname: {
    rpc: ['https://rpc-iov.keplr.app'],
    rest: ['https://lcd-iov.keplr.app'],
  },
  emoney: {
    rpc: ['https://rpc-emoney.keplr.app'],
    rest: ['https://lcd-emoney.keplr.app'],
  },
  juno: {
    rpc: ['https://rpc-juno.itastakers.com'],
    rest: ['https://lcd-juno.itastakers.com'],
  },
  microtick: {
    rpc: ['https://rpc-microtick.keplr.app'],
    rest: ['https://lcd-microtick.keplr.app'],
  },
  likecoin: {
    rpc: ['https://mainnet-node.like.co/rpc'],
    rest: ['https://mainnet-node.like.co'],
  },
  impacthub: {
    rpc: ['https://rpc-impacthub.keplr.app'],
    rest: ['https://lcd-impacthub.keplr.app'],
  },
  bitcanna: {
    rpc: ['https://rpc.bitcanna.io'],
    rest: ['https://lcd.bitcanna.io'],
  },
  bitsong: {
    rpc: ['https://rpc.explorebitsong.com'],
    rest: ['https://lcd.explorebitsong.com'],
  },
  kichain: {
    rpc: ['https://rpc-mainnet.blockchain.ki'],
    rest: ['https://api-mainnet.blockchain.ki'],
  },
  panacea: {
    rpc: ['https://rpc.gopanacea.org'],
    rest: ['https://api.gopanacea.org'],
  },
  bostrom: {
    rpc: ['https://rpc.bostrom.cybernode.ai'],
    rest: ['https://lcd.bostrom.cybernode.ai'],
  },
  comdex: {
    rpc: ['https://rpc.comdex.one'],
    rest: ['https://rest.comdex.one'],
  },
  cheqd: {
    rpc: ['https://rpc.cheqd.net'],
    rest: ['https://api.cheqd.net'],
  },
  stargaze: {
    rpc: ['https://rpc.stargaze-apis.com'],
    rest: ['https://rest.stargaze-apis.com'],
  },
  chihuahua: {
    rpc: ['https://rpc.chihuahua.wtf'],
    rest: ['https://api.chihuahua.wtf'],
  },
  lumnetwork: {
    rpc: ['https://node0.mainnet.lum.network/rpc'],
    rest: ['https://node0.mainnet.lum.network/rest'],
  },
  vidulum: {
    rpc: ['https://mainnet-rpc.vidulum.app'],
    rest: ['https://mainnet-lcd.vidulum.app'],
  },
  desmos: {
    rpc: ['https://rpc.mainnet.desmos.network'],
    rest: ['https://api.mainnet.desmos.network'],
  },
  dig: {
    rpc: ['https://rpc-1-dig.notional.ventures'],
    rest: ['https://api-1-dig.notional.ventures'],
  },
  sommelier: {
    rpc: ['https://rpc-sommelier.keplr.app'],
    rest: ['https://lcd-sommelier.keplr.app'],
  },
  sifchain: {
    rpc: ['https://rpc.sifchain.finance'],
    rest: ['https://api-int.sifchain.finance'],
  },
  bandchain: {
    rpc: ['https://rpc.laozi3.bandchain.org'],
    rest: ['https://laozi1.bandchain.org/api'],
  },
  konstellation: {
    rpc: ['https://node1.konstellation.tech:26657'],
    rest: ['https://node1.konstellation.tech:1318'],
  },
  umee: {
    rpc: ['https://rpc.aphrodite.main.network.umee.cc'],
    rest: ['https://api.aphrodite.main.network.umee.cc'],
  },
  gravitybridge: {
    rpc: ['https://gravitychain.io:26657'],
    rest: ['https://gravitychain.io:1317'],
  },
  decentr: {
    rpc: ['https://poseidon.mainnet.decentr.xyz'],
    rest: ['https://rest.mainnet.decentr.xyz'],
  },
  shentu: {
    rpc: ['https://shenturpc.certikpowered.info'],
    rest: ['https://azuredragon.noopsbycertik.com'],
  },
  carbon: {
    rpc: ['https://tm-api.carbon.network'],
    rest: ['https://api.carbon.network'],
  },
  injective: {
    rpc: ['https://public.api.injective.network'],
    rest: ['https://public.lcd.injective.network'],
  },
  cerberus: {
    rpc: ['https://rpc.cerberus.zone:26657'],
    rest: ['https://api.cerberus.zone:1317'],
  },
  fetchhub: {
    rpc: ['https://rpc-fetchhub.fetch.ai:443'],
    rest: ['https://rest-fetchhub.fetch.ai'],
  },
  assetmantle: {
    rpc: ['https://rpc.assetmantle.one/'],
    rest: ['https://rest.assetmantle.one/'],
  },
  provenance: {
    rpc: ['https://rpc.provenance.io/'],
    rest: ['https://api.provenance.io'],
  },
  galaxy: {
    rpc: ['https://rpc.galaxychain.zone'],
    rest: ['https://rest.galaxychain.zone'],
  },
  meme: {
    rpc: ['https://rpc-meme-1.meme.sx:443'],
    rest: ['https://api-meme-1.meme.sx:443'],
  },
  evmos: {
    rpc: ['https://rpc-evmos.keplr.app/'],
    rest: ['https://lcd-evmos.keplr.app/'],
  },
  terra2: {
    rpc: ['https://rpc.terrav2.ccvalidators.com/'],
    rest: ['https://phoenix-lcd.terra.dev/'],
  },
  rizon: {
    rpc: ['https://rpcapi.rizon.world/'],
    rest: ['https://restapi.rizon.world/'],
  },
  kava: {
    rpc: ['https://rpc-kava.keplr.app'],
    rest: ['https://lcd-kava.keplr.app'],
  },
  genesisl1: {
    rpc: ['https://26657.genesisl1.org'],
    rest: ['https://api.genesisl1.org'],
  },
};
