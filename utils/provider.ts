/* eslint-disable */
// @ts-ignore
// @ts-nocheck

import { Dispatch } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';

import { ALCHEMY_API_KEY } from '@config/config';
import { StoreActions, StoreActionTypes, StoreState } from '@type/store';

export const configMetamask = async (
  dispatch: Dispatch<StoreActions>
): Promise<StoreState> => {
  const metamaskProvider = await detectEthereumProvider();
  let provider: providers.AlchemyProvider | providers.Web3Provider;

  if (metamaskProvider && window.ethereum) {
    provider = new providers.Web3Provider(window.ethereum);
    console.log(provider)
  } else {
    provider = new providers.AlchemyProvider('ropsten', ALCHEMY_API_KEY);
  }

  dispatch({
    type: StoreActionTypes.SET_PROVIDER,
    payload: { provider: provider },
  });

  const accounts = await provider.send('eth_requestAccounts', []);
  console.log(accounts)

  //eslint-disable-next-line
  window.ethereum.on('accountsChanged', async (accounts: any) => {
    accounts = await provider.send('eth_requestAccounts', []);
    dispatch({
      type: StoreActionTypes.SET_ACCOUNT,
      payload: { account: accounts[0] },
    });
  })

  dispatch({
    type: StoreActionTypes.SET_ACCOUNT,
    payload: { account: accounts[0] },
  });

  // eslint-disable-next-line
  provider.on('disconnect', (error: any) => {
    dispatch({ type: StoreActionTypes.CLEAR_STATE });
    console.log(error);
  });

  return { provider, account: accounts[0] };
};

export const configWalletConnect = async (
  dispatch: Dispatch<StoreActions>
): Promise<StoreState> => {
  const wcProvider = new WalletConnectProvider({
    rpc: { 3: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}` },
  });

  // Enable session (triggers QR Code modal)
  await wcProvider.enable();

  const provider = new providers.Web3Provider(wcProvider);

  dispatch({
    type: StoreActionTypes.SET_PROVIDER,
    payload: { provider: provider },
  });

  const accounts = await provider.listAccounts();

  dispatch({
    type: StoreActionTypes.SET_ACCOUNT,
    payload: { account: accounts[0] },
  });

  provider.on('disconnect', (code: number, reason: string) => {
    dispatch({ type: StoreActionTypes.CLEAR_STATE });
    console.log(code, reason);
  });

  return { provider, account: accounts[0] };
};
