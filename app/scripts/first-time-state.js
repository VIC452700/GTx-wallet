import * as Network from '../../shared/constants/network'

/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {},
  PreferencesController: {
    frequentRpcListDetail: [
      /*{
        rpcUrl: Network.THETAMAINNET_RPC_URL,
        chainId: Network.THETAMAINNET_CHAIN_ID,
        ticker: Network.TFUEL_SYMBOL,
        nickname: Network.THETAMAINNET_DISPLAY_NAME,
        rpcPrefs: {blockExplorerUrl: Network.THETAMAINNET_EXPLORER_URL},
      },*/
    ],
/*    provider: {
      chainId: Network.THETAMAINNET_CHAIN_ID,
      nickname: Network.THETAMAINNET_DISPLAY_NAME,
      rpcPrefs: {blockExplorerUrl: Network.THETAMAINNET_EXPLORER_URL},
      ticker: Network.TFUEL_SYMBOL,
      type: Network.NETWORK_TYPE_RPC,
    }
*/    
  },
};
initialState.PreferencesController.assetImages = [];// Network.TOKEN_IMAGES;

export default initialState;


//... may want to delete this and make default EMPTY
// metamask module has a list of tokens that show in the Search tokens list for Ethereum. Will need to add Search tab for Theta and make different list for it.