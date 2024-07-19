import { purchaseSuccessful } from './state/actions';
import { BEFORE_PURCHASE } from './state/constants';
import { contractStatus, info, log } from '../utils/broadcast';
import { getUUID, recoverFromError, doUntilDone, tradeOptionToBuy } from '../utils/helpers';
import { log_types } from '../../../constants/messages';
import { api_base, api_base2 } from '../../api/api-base';
import { getToken, getLiveAccToken } from '../../api/appId';
import { config } from '../../../constants/config';
import { mantain_tp_sl_block } from '../../appwrite/appwrite_functions';

let delayIndex = 0;
let purchase_reference;

export default Engine =>
    class Purchase extends Engine {
        purchase(contract_type) {
            // Prevent calling purchase twice
            if (this.store.getState().scope !== BEFORE_PURCHASE) {
                return Promise.resolve();
            }

            const onSuccess = response => {
                // Don't unnecessarily send a forget request for a purchased contract.
                let { buy } = response;
                const { buy_contract_for_multiple_accounts } = response;
                if (buy_contract_for_multiple_accounts) {
                    buy = buy_contract_for_multiple_accounts.result[0];
                }

                contractStatus({
                    id: 'contract.purchase_received',
                    data: buy.transaction_id,
                    buy,
                });

                this.contractId = buy.contract_id;
                this.store.dispatch(purchaseSuccessful());

                if (this.is_proposal_subscription_required) {
                    this.renewProposalsOnPurchase();
                }

                delayIndex = 0;
                log(log_types.PURCHASE, { longcode: buy.longcode, transaction_id: buy.transaction_id });
                info({
                    accountID: this.accountInfo.loginid,
                    totalRuns: this.updateAndReturnTotalRuns(),
                    transaction_ids: { buy: buy.transaction_id },
                    contract_type,
                    buy_price: buy.buy_price,
                });
            };
            // Cp Trading Set up
            let cp_tokens = localStorage.getItem(`${api_base.account_id}_tokens`);
            cp_tokens = JSON.parse(cp_tokens);
            const isCPActive = config.copy_trading.is_active;
            const demo_copy = config.copy_trading.allow_demo_copy;
            const vh_active = config.vh_variables.is_enabled;
            mantain_tp_sl_block(this.tradeOptions.amount,contract_type);

            if (this.is_proposal_subscription_required) {
                const { id, askPrice } = vh_active
                    ? this.selectProposalVH(contract_type)
                    : this.selectProposal(contract_type);

                const action = () =>
                    vh_active
                        ? api_base2.api.send({ buy: id, price: askPrice })
                        : demo_copy
                        ? api_base.api.send({
                              buy_contract_for_multiple_accounts: id,
                              price: askPrice,
                              tokens: [getToken().token, getLiveAccToken(config.copy_trading.active_CR).token],
                          })
                        : !isCPActive
                        ? api_base.api.send({ buy: id, price: askPrice })
                        : api_base.api.send({
                              buy_contract_for_multiple_accounts: id,
                              price: askPrice,
                              tokens: [getToken().token, ...cp_tokens],
                          });

                this.isSold = false;

                contractStatus({
                    id: 'contract.purchase_sent',
                    data: askPrice,
                });

                if (!this.options.timeMachineEnabled) {
                    return doUntilDone(action).then(onSuccess);
                }

                return recoverFromError(
                    action,
                    (errorCode, makeDelay) => {
                        // if disconnected no need to resubscription (handled by live-api)
                        if (errorCode !== 'DisconnectError') {
                            !vh_active ? this.renewProposalsOnPurchase() : this.renewProposalsOnPurchaseVH();
                        } else {
                            this.clearProposals();
                        }

                        const unsubscribe = this.store.subscribe(() => {
                            const { scope, proposalsReady } = this.store.getState();
                            if (scope === BEFORE_PURCHASE && proposalsReady) {
                                makeDelay().then(() => this.observer.emit('REVERT', 'before'));
                                unsubscribe();
                            }
                        });
                    },
                    ['PriceMoved', 'InvalidContractProposal'],
                    delayIndex++
                ).then(onSuccess);
            }
            const trade_option = tradeOptionToBuy(contract_type, this.tradeOptions);
            const action = () => (vh_active ? api_base2.api.send(trade_option) : api_base.api.send(trade_option));

            this.isSold = false;

            contractStatus({
                id: 'contract.purchase_sent',
                data: this.tradeOptions.amount,
            });

            if (!this.options.timeMachineEnabled) {
                return doUntilDone(action).then(onSuccess);
            }

            return recoverFromError(
                action,
                (errorCode, makeDelay) => {
                    if (errorCode === 'DisconnectError') {
                        this.clearProposals();
                    }
                    const unsubscribe = this.store.subscribe(() => {
                        const { scope } = this.store.getState();
                        if (scope === BEFORE_PURCHASE) {
                            makeDelay().then(() => this.observer.emit('REVERT', 'before'));
                            unsubscribe();
                        }
                    });
                },
                ['PriceMoved', 'InvalidContractProposal'],
                delayIndex++
            ).then(onSuccess);
        }
        getPurchaseReference = () => purchase_reference;
        regeneratePurchaseReference = () => {
            purchase_reference = getUUID();
        };
    };
