import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce, isEqual } from 'lodash'
import { ASSET_TYPE } from '../../../../../shared/constants/transaction'
import StakeRowWrapper from '../stake-row-wrapper'
import UserPreferencedCurrencyInput from '../../../../components/app/user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../../components/app/user-preferenced-token-input'
import { isAssetTokenLike } from '../../../send/send.utils'
import AmountMaxButton from './amount-max-button'

export default class StakeAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    balance: PropTypes.string,
    balance2: PropTypes.string,
    conversionRate: PropTypes.number,
    gasTotal: PropTypes.string,
    inError: PropTypes.bool,
    primaryCurrency: PropTypes.string,
    sendAsset: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,
    updateGasFeeError: PropTypes.func,
    updateSendAmount: PropTypes.func,
    updateSendAmountError: PropTypes.func,
    updateGas: PropTypes.func,
    maxModeOn: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentDidUpdate (prevProps) {
    const { maxModeOn: prevMaxModeOn, gasTotal: prevGasTotal } = prevProps
    const { maxModeOn, amount, gasTotal, sendAsset } = this.props

    if (maxModeOn && isAssetTokenLike(sendAsset) && !prevMaxModeOn) {
      this.updateGas(amount)
    }

    if (prevGasTotal !== gasTotal || !isEqual(sendAsset, prevProps.sendAsset)) {
      this.validateAmount(amount)
    }
  }

  updateGas = debounce(this.updateGas.bind(this), 500)

  validateAmount (amount) {
    const {
      balance,
      balance2,
      conversionRate,
      gasTotal,
      primaryCurrency,
      sendAsset,
      tokenBalance,
      updateGasFeeError,
      updateSendAmountError,
    } = this.props

    updateSendAmountError({
      amount,
      balance,
      balance2,
      conversionRate,
      gasTotal,
      primaryCurrency,
      sendAsset,
      tokenBalance,
    })

    if (sendAsset?.address) {
      updateGasFeeError({
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        sendAsset,
        tokenBalance,
      })
    }
  }

  updateAmount (amount) {
    const { updateSendAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSendAmount(amount)
  }

  updateGas (amount) {
    const { sendAsset, updateGas } = this.props

    if (sendAsset?.address) {
      updateGas({ amount })
    }
  }

  handleChange = (newAmount) => {
    this.validateAmount(newAmount)
    this.updateGas(newAmount)
    this.updateAmount(newAmount)
  }

  renderInput () {
    const { amount, inError, sendAsset } = this.props

    return sendAsset.type === ASSET_TYPE.TOKEN ?
      (
        <UserPreferencedTokenInput
          error={inError}
          onChange={this.handleChange}
          token={sendAsset}
          value={amount}
          mode={sendAsset.mode}
          stake={sendAsset.stake}
        />
      )
      : (
        <UserPreferencedCurrencyInput
          error={inError}
          onChange={this.handleChange}
          value={amount}
          assetType={sendAsset.type}
        />
      )
  }

  render () {
    const { gasTotal, inError } = this.props

    return (
      <StakeRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType="amount"
      >
        {gasTotal && <AmountMaxButton inError={inError} />}
        { this.renderInput() }
      </StakeRowWrapper>
    )
  }

}
