# @cosmos-kit/leap-capsule-social-login

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/wallets/leap-extension/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-kit/leap-extension"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=wallets%2Fleap-extension%2Fpackage.json"></a>
</p>

CosmosKit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

`@cosmos-kit/leap-capsule-social-login` is the social login integration for CosmosKit using `@leapwallet/cosmos-social-login-capsule-provider`

> You need install [@leapwallet/cosmos-social-login-capsule-provider-ui](https://www.npmjs.com/package/@leapwallet/cosmos-social-login-capsule-provider-ui) package for UI.

> This plugin uses [Capsule](https://usecapsule.com/) for MPC based key management. In order to make this work, you'll need an API key which you can request [here](https://usecapsule.com/api) 

> Once you have an API Key, include it in `CAPSULE_API_KEY`. `CAPSULE_ENV` will be `BETA` for Development and Testing, and `PROD` for Production. Once you are ready to release to Production, ping the Capsule team to get a separate API Key for Production.

## NextJS

For nextjs we recommend to load the module dynamic or async as it is not yet supporting SSR.

> When you build it, please include environment variables `NEXT_PUBLIC_CAPSULE_API_KEY` and  `NEXT_PUBLIC_CAPSULE_ENV` as mentioned above. For further reference on Capsule, please reference the [Capsule Developer Documentation](https://docs.usecapsule.com/)

### In next.config.js

transpilePackages: ["@cosmos-kit/leap-social-login", "@leapwallet/capsule-web-sdk-lite", "@leapwallet/cosmos-social-login-capsule-provider"],

### For example

```jsx

function MyApp({ Component, pageProps }: AppProps) {
  const defaultWallets: MainWalletBase[] = [...keplrWallets, ...leapWallets];
  const [wallets, setWallets] = useState<MainWalletBase[]>(defaultWallets)
  const [loadingWallets, setLoadingWallet] = useState<boolean>(false);
    
  useEffect(() => {
      setLoadingWallet(true)
      import("@cosmos-kit/leap-capsule-social-login").then(
        (CapsuleModule) => {
          return CapsuleModule.wallets;
        },
      ).then((leapSocialLogin) => {
        setWallets([...keplrWallets, ...leapWallets, ...leapSocialLogin])
        setLoadingWallet(false);
      })
    }, [])


    if (loadingWallets) {
      return <>Loading...</>
    }


    return (
      <RootLayout>
        <ChainProvider
          chains={chains}
          assetLists={[...assets]}
          wallets={wallets}
          throwErrors={false}
          subscribeConnectEvents={false}
          defaultNameService={"stargaze"}
          logLevel={"DEBUG"}
          endpointOptions={{
            isLazy: true,
            endpoints: {
              cosmoshub: {
                rpc: [
                  {
                    url: "https://rpc.cosmos.directory/cosmoshub",
                    headers: {},
                  },
                ],
              },
            },
          }}
          >
          <Component {...pageProps} />
        </ChainProvider>
        <CustomCapsuleModalViewX />
      </RootLayout>
    );
}

export default MyApp;


const LeapSocialLogin = dynamic(
  () =>
    import("@leapwallet/cosmos-social-login-capsule-provider-ui").then(
      (m) => m.CustomCapsuleModalView,
    ),
  { ssr: false },
);

export function CustomCapsuleModalViewX() {
  const [showCapsuleModal, setShowCapsuleModal] = useState(false);

  useEffect(() => {
    window.openCapsuleModal = () => {
      setShowCapsuleModal(true);
    }
  }, [])

  return (
    <>
      <LeapSocialLogin
        showCapsuleModal={showCapsuleModal}
        setShowCapsuleModal={setShowCapsuleModal}
        theme={'dark'}
        onAfterLoginSuccessful={() => {
          window.successFromCapsuleModal();
        }}
        onLoginFailure={
          () => {
            window.failureFromCapsuleModal();
          }
        }
      />
    </>
  );
}
```

## Related

Checkout these related projects:

* [@cosmwasm/ts-codegen](https://github.com/CosmWasm/ts-codegen) for generated CosmWasm contract Typescript classes
* [@cosmology/telescope](https://github.com/cosmology-tech/telescope) a "babel for the Cosmos", Telescope is a TypeScript Transpiler for Cosmos Protobufs.
* [chain-registry](https://github.com/cosmology-tech/chain-registry) an npm module for the official Cosmos chain-registry.
* [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) A wallet connector for the Cosmos ⚛️
* [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) set up a modern Cosmos app by running one command.
* [starship](https://github.com/cosmology-tech/starship) a k8s-based unified development environment for Cosmos Ecosystem

## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.tech/validator)


## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code or CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
