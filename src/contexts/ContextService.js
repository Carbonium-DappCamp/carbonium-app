import parcels from '../data/parcel.json';
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
      const account = await getAccount();
      this.dispatch({
        type: ContextActions.SET_CONTRACTS,
        payload: {
          parcel: parcel,
          carboniumToken: carboniumToken,
          carboniumDistribution: carboniumDistribution,
          account: account
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

  async updateParcels() {
    const { account, parcel, parcels } = this.state;
    if (account && parcel) {
      const transferEvent = parcel.filters.Transfer(null, account);
      const events = await parcel.queryFilter(transferEvent);

      const newParcels = parcels ? parcels : [];

      const client = create('http://127.0.0.1:45005/'); // Put any gateway here, using local node
      // const client = create('https://opensea.mypinata.cloud/ipfs'); // Put any gateway here, using local node

      const parcelTokenIds = events.splice(0, 5).map(async (e) => {
        const tokenId = e.args[2].toNumber();
        const tokenIdUri = await parcel.tokenURI(tokenId);
        const ipfsSplit = tokenIdUri.split('/');
        return client.cat(`${ipfsSplit[2]}/${ipfsSplit[3]}`);
      });

      Promise.all(parcelTokenIds).then((tokenId) => {
        tokenId.forEach(async (d) => {
          for await (const buf of d) {
            const jsonString = Buffer.from(buf).toString('utf8');
            const parsedData = JSON.parse(jsonString);
            this.dispatch({
              type: ContextActions.SET_PARCELS,
              payload: [...newParcels, parsedData]
            })
          }
        })
      });
      // const myParcels = parcels.slice(0, 5);
      // this.dispatch({
      //   type: ContextActions.SET_PARCELS,
      //   payload: myParcels // get first 5 parcels
      // });
    } else {
      this.dispatch({
        type: ContextActions.SET_PARCELS,
        payload: null
      });
    }
  }
}
