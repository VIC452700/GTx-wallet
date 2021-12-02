import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTokenTrackerLink } from '@metamask/etherscan-link';
import TransactionList from '../../../components/app/transaction-list';
import { TokenOverview } from '../../../components/app/wallet-overview';
import {
  getCurrentChainId,
  getSelectedIdentity,
  getRpcPrefsForCurrentProvider,
} from '../../../selectors/selectors';
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes';
import { showModal } from '../../../store/actions';
import { useNewMetricEvent } from '../../../hooks/useMetricEvent';

import AssetNavigation from './asset-navigation';
import AssetOptions from './asset-options';
import * as Network from '../../../../shared/constants/network';

export default function TokenAsset({ token }) {
  const dispatch = useDispatch();
  const chainId = useSelector(getCurrentChainId);
  const isThetaNetwork = chainId==Network.THETAMAINNET_CHAIN_ID;
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const selectedAccountName = selectedIdentity.name;
  const selectedAddress = selectedIdentity.address;
  const history = useHistory();
  const tokenTrackerLink =  isThetaNetwork 
    ? 'https://explorer.thetatoken.org/account/'+token.address
    : getTokenTrackerLink(
        token.address,
        chainId,
        null,
        selectedAddress,
        rpcPrefs,
    );
  const thetascanTrackerLink = token.isERC721 
    ? 'http://www.thetascan.io/tokens/721/contracts/?data='+token.address
    : 'http://www.thetascan.io/contracts/?data='+token.address;

  const blockExplorerLinkClickedEvent = useNewMetricEvent({
    category: 'Navigation',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Token Tracker',
      action: 'Token Options',
      block_explorer_domain: tokenTrackerLink
        ? new URL(tokenTrackerLink)?.hostname
        : '',
    },
  });

  return (
    <>
      <AssetNavigation
        accountName={selectedAccountName}
        assetName={token.symbol}
        onBack={() => history.push(DEFAULT_ROUTE)}
        optionsButton={
          <AssetOptions
            onRemove={() =>
              dispatch(showModal({ name: 'HIDE_TOKEN_CONFIRMATION', token }))
            }
            isEthNetwork={!rpcPrefs.blockExplorerUrl}
            isThetaNetwork={isThetaNetwork}
            onClickBlockExplorer={() => {
              blockExplorerLinkClickedEvent();
              global.platform.openTab({ url: tokenTrackerLink });
            }}
            onClickThetaScan={() => {
              global.platform.openTab({ url: thetascanTrackerLink });
            }}
            onViewAccountDetails={() => {
              dispatch(showModal({ name: 'ACCOUNT_DETAILS' }));
            }}
            tokenSymbol={token.symbol}
          />
        }
      />
      <TokenOverview className="asset__overview" token={token} />
      <TransactionList tokenAddress={token.address} />
    </>
  );
}

TokenAsset.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
};
