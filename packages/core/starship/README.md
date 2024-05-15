## TLDR

Deploy

```sh
# setup helm/starship
yarn starship setup

# sanity check
yarn starship get-pods

# deploy starship
yarn starship deploy

# wait til STATUS=Running
yarn starship get-pods

# port forwarding
yarn starship start-ports

# check pids
yarn starship port-pids
```
Run Tests

```sh
# test
yarn starship:test

# watch 
yarn starship:watch
```

Teardown

```sh
# stop port forwarding (done by clean() too)
# yarn starship stop-ports

# stop ports and delete & remove helm chart
yarn starship clean
```

## 1. Installation
Inorder to get started with starship, one needs to install the following
* `kubectl`: https://kubernetes.io/docs/tasks/tools/
* `kind`: https://kind.sigs.k8s.io/docs/user/quick-start/#installation
* `helm`: https://helm.sh/docs/intro/install/

Note: To make the process easy we have a simple command that will try and install dependencies
so that you dont have to.

```bash
yarn starship setup
```
This command will 
* check (and install) if your system has all the dependencies needed to run the e2e tests wtih Starship
* fetch the helm charts for Starship

## 2. Connect to a kubernetes cluster
Inorder to set up the infrastructure, for Starship, we need access to a kubernetes cluster.
One can either perform connect to a 
* remote cluster in a managed kubernetes service
* use kubernetes desktop to spin up a cluster
* use kind to create a local cluster on local machine

To make this easier we have a handy command which will create a local kind cluster and give you access
to a kubernetes cluster locally.

NOTE: Resources constraint on local machine will affect the performance of Starship spinup time

```bash
yarn starship setup-kind
```

Run the following command to check connection to a k8s cluster
```bash
kubectl get pods
```

## 3. Start Starship
Now with the dependencies and a kubernetes cluster in handy, we can proceed with creating the mini-cosmos ecosystem

Run
```bash
yarn starship deploy
```

We use the config file `configs/config.yaml` as the genesis file to define the topology of the e2e test infra. Change it as required

Note: Spinup will take some time, while you wait for the system, can check the progress in another tab with `kubectl get pods`

## 4. Run the tests
We have everything we need, our desired infrastructure is now running as intended, now we can run
our end-to-end tests.

Run
```bash
npm run starship:test
```

## 5. Stop the infra
The tests should be ideompotent, so the tests can be run multiple times (which is recommeded), since the time to spinup is still high (around 5 to 10 mins).

Once the state of the mini-cosmos is corrupted, you can stop the deployments with
```bash
npm run starship clean
```
Which will
* Stop port-forwarding the traffic to your local
* Delete all the helm charts deployed

## 6. Cleanup kind (optional)
If you are using kind for your kubernetes cluster, you can delete it with
```bash
yarn starship clean-kind
```

## Related

Checkout these related projects:

* [@cosmology/telescope](https://github.com/cosmology-tech/telescope) Your Frontend Companion for Building with TypeScript with Cosmos SDK Modules.
* [@cosmwasm/ts-codegen](https://github.com/CosmWasm/ts-codegen) Convert your CosmWasm smart contracts into dev-friendly TypeScript classes.
* [chain-registry](https://github.com/cosmology-tech/chain-registry) Everything from token symbols, logos, and IBC denominations for all assets you want to support in your application.
* [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) Experience the convenience of connecting with a variety of web3 wallets through a single, streamlined interface.
* [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) Set up a modern Cosmos app by running one command.
* [interchain-ui](https://github.com/cosmology-tech/interchain-ui) The Interchain Design System, empowering developers with a flexible, easy-to-use UI kit.
* [starship](https://github.com/cosmology-tech/starship) Unified Testing and Development for the Interchain.

## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.zone/validator)


## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
