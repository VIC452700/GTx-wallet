import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import TransactionList from '../../../components/app/transaction-list'
import { EthOverview } from '../../../components/app/wallet-overview'
import { getSelectedIdentity } from '../../../selectors/selectors'
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes'
import { THETA_SYMBOL } from '../../../../app/scripts/controllers/network/enums'
import WrappableAssetNavigation from './wrappable-asset-navigation'

export default function NativeAsset ({ nativeCurrency }) {
  const selectedAccountName = useSelector((state) => getSelectedIdentity(state).name)
  const history = useHistory()

  return (
    <>
      <WrappableAssetNavigation
        accountName={selectedAccountName}
        assetName={nativeCurrency}
        onBack={() => history.push(DEFAULT_ROUTE)}
      />
      <EthOverview className="asset__overview" assetName={nativeCurrency} />
      <TransactionList hideTokenTransactions showNative2={nativeCurrency === THETA_SYMBOL} />
    </>
  )
}

NativeAsset.propTypes = {
  nativeCurrency: PropTypes.string.isRequired,
}
