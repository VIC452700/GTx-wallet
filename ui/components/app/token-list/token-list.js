import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { useSelector } from 'react-redux';
import TokenCell from '../token-cell';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { useTokenTracker } from '../../../hooks/useTokenTracker';
import {
  getAssetImages,
  getShouldHideZeroBalanceTokens,
} from '../../../selectors';
import { getTokens } from '../../../ducks/metamask/metamask';

export default function TokenList({ onTokenClick, showNFTs }) {
  const t = useI18nContext();
  const assetImages = useSelector(getAssetImages);
  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  );
  // use `isEqual` comparison function because the token array is serialized
  // from the background so it has a new reference with each background update,
  // even if the tokens haven't changed
  const tokens = useSelector(getTokens, isEqual);
  const { loading, tokensWithBalances } = useTokenTracker(
    tokens,
    true,
    shouldHideZeroBalanceTokens,
  );
  const filteredTokensWithBalances = tokensWithBalances.filter(e => e.isERC721 == showNFTs);
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '250px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        {t('loadingTokens')}
      </div>
    );
  }

  return (
    <div>
      {filteredTokensWithBalances.map((tokenData, index) => {
          tokenData.image = assetImages[tokenData.address];
          return <TokenCell key={index} {...tokenData} onClick={onTokenClick} />;
      })}
    </div>
  );
}

TokenList.propTypes = {
  onTokenClick: PropTypes.func.isRequired,
  showNFTs: PropTypes.bool
};
TokenList.defaultProps = {
  showNFTs: false,
};
