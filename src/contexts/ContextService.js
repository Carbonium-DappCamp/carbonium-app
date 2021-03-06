import { getAccount, getContract } from '../utils/common';
import contractAddresses from '../abis/contract-address.json';
import ParcelContractABI from '../abis/ParcelContract.json';
import CarboniumTokenABI from '../abis/CarboniumToken.json';
import CarboniumDistributionABI from '../abis/CarboniumDistribution.json';
import { create } from 'ipfs-http-client';

// Actions
const ContextActions = Object.freeze({
  SET_PARCELS: 'SET_PARCELS',
  SET_CONTRACTS: 'SET_CONTRACTS'
});

export default class ContextService {

  static reduce(action) {
    const { type, payload } = action;
    switch (type) {
      case ContextActions.SET_PARCELS:
        return {
          parcels: payload
        };
      case ContextActions.SET_CONTRACTS:
        return payload;
      default:
        return {};
    }
  }

  static canReduce(action) {
    return action.type in ContextActions;
  }

  setStateDispatch(state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
  }

  async setWeb3(web3) {
    if (web3) {
      const parcel = getContract(contractAddresses.ParcelContract, ParcelContractABI);
      const carboniumToken = getContract(contractAddresses.CarboniumToken, CarboniumTokenABI);
      const carboniumDistribution = getContract(contractAddresses.CarboniumDistribution, CarboniumDistributionABI);
      this.dispatch({
        type: ContextActions.SET_CONTRACTS,
        payload: {
          parcel: parcel,
          carboniumToken: carboniumToken,
          carboniumDistribution: carboniumDistribution,
        }
      });
    } else {
      this.dispatch({
        type: ContextActions.SET_CONTRACTS,
        payload: {
          parcel: null,
          carboniumToken: null,
          carboniumDistribution: null,
          account: null
        }
      });
    }
  }

  async useOpenseaGateway(tokenUris) {
    const parcels = tokenUris.map((t) => fetch(`https://opensea.mypinata.cloud/ipfs/${t}`).then((r) =>r.json()))
    Promise.all(parcels).then((p) => {
      this.dispatch({
        type: ContextActions.SET_PARCELS,
        payload: p
      })
    });
  }

  async useLocalNode(tokenUris) {
    const client = create('http://127.0.0.1:45005/'); // Put any gateway here, using local node
    const localCalls = tokenUris.map(client.cat);
    Promise.all(localCalls).then((tokenId) => {
      tokenId.forEach(async (d) => {
        for await (const buf of d) {
          const jsonString = Buffer.from(buf).toString('utf8');
          const parsedData = JSON.parse(jsonString);
          const { parcels } = this.state;
          const newParcels = parcels ? parcels : [];
          this.dispatch({
            type: ContextActions.SET_PARCELS,
            payload: [...newParcels, parsedData]
          })
        }
      })
    });
  }

  async updateParcels() {
    // Reset parcels
    this.dispatch({
      type: ContextActions.SET_PARCELS,
      payload: []
    });

    const { parcel } = this.state;
    // Get new account
    const account = await getAccount();
    if (account && parcel) {
      const transferEvent = parcel.filters.Transfer(null, account);
      const events = await parcel.queryFilter(transferEvent);

      const parcelTokenIds = events.map(async (e) => {
        const tokenId = e.args[2].toNumber();
        const tokenIdUri = await parcel.tokenURI(tokenId);
        const ipfsSplit = tokenIdUri.split('/');
        return `${ipfsSplit[2]}/${ipfsSplit[3]}`;
      });
      Promise.all(parcelTokenIds).then(this.useOpenseaGateway.bind(this));
    }
  }
}
