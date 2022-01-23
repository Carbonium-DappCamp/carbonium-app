# Carbonium Dapp

## Set up

1. Run  ```yarn install```
2. Switching to test network (RINKEBY) (Optional)

   - Please skip this step if you want to use local network
   - Change line - `const NETWORK = LOCAL_NETWORK` to `const NETWORK = TEST_NETWORK` in `hardhat.config.js`
   - Replace `YOUR_ALCHEMY_API_KEY` with your api key from alchemy in `.env` file
   - Replace `YOUR_WALLET_PRIVATE_KEY` with your wallet's private key from metamask wallet in `.env` file
## Running your app locally

1. Start your react frontend

   ```bash
   yarn start
   ```

2. Start a hardhat node

   ```bash
   npx hardhat node
   ```

3. Connect hardhat node to Metamask

   Open Metamask > Select the network dropdown from the top left > Select `Custom RPC` and enter the following details:

   - Network Name: `<Enter a name for the network>`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`

   Click save. You can use this network to connect to the local hardhat node.

4. Connect your local hardhat account to Metamask for making transactions
   - After running `npx hardhat node` you will see a list of 20 addresses logged in the terminal
   - To configure an account copy its private key from the terminal (i.e the text after `Private Key:`)
   - Open Metamask > Click the account icon on top right > Import Account > Paste the private key you just copied > click Import
   - You should now have the account connected with 10000 ETH

5. Running test for sample contract

   ```bash
   npx hardhat test
   ```

## Generating images and metadata

The generation of the parcel map images and metadata takes place in `parcel_data`.
Inside that directory:

1. Create a virtual environment, activate it and install dependencies:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. The image generator uses the [mapbox API](https://account.mapbox.com).
   So once you have created your API key, export it:

   ```bash
   export MAPBOX_ACCESS_TOKEN=pk...
   ```

3. Generate the images by running `python images.py` and upload the folder to [IPFS](https://app.pinata.cloud/pinmanager). Note the generated Hash of the directory.

4. Set the `ipfsBaseURL` inside `metadata.py` to the hash generated in the previous step and run `python metadata.py`.
  Upload the metadata directory to IPFS as well and note the generated hash. This will be your `baseURI` in the smartcontract.

## What’s Included?

Your environment will have following set up:

- A sample frontend: Sample application which uses [Create React App](https://github.com/facebook/create-react-app) along with its test.
- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.

## Trouble Shooting

- `Error HH8: There's one or more errors in your config file` error: If you get this error try setting up your `YOUR_ALCHEMY_API_KEY` and `YOUR_WALLET_PRIVATE_KEY` in .env file
