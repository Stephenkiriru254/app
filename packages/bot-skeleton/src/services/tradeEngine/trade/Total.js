import { getRoundedNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { info, log } from '../utils/broadcast';
import { createError } from '../../../utils/error';
import { observer as globalObserver } from '../../../utils/observer';
import { log_types } from '../../../constants/messages';
import { config } from '../../../constants/config';
import { api_base, api_base2 } from '../../api/api-base';
import { calculateLostStatus, calculateWonStatus, handleLostLiveStep, handleWonLiveStep } from '../../binary_functions';
const skeleton = {
    totalProfit: 0,
    totalWins: 0,
    totalLosses: 0,
    totalStake: 0,
    totalPayout: 0,
    totalRuns: 0,
};

const globalStat = {};

export default Engine =>
    class Total extends Engine {
        constructor() {
            super();
            this.sessionRuns = 0;
            this.sessionProfit = 0;

            globalObserver.register('statistics.clear', this.clearStatistics.bind(this));
        }

        clearStatistics() {
            this.sessionRuns = 0;
            this.sessionProfit = 0;
            if (!this.accountInfo) return;
            const { loginid: accountID } = this.accountInfo;
            globalStat[accountID] = { ...skeleton };
        }

        updateTotals(contract) {
            const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;

            if (config.vh_variables.is_enabled) return;

            const profit = getRoundedNumber(Number(sellPrice) - Number(buyPrice), currency);

            const win = profit > 0;

            const accountStat = this.getAccountStat();

            accountStat.totalWins += win ? 1 : 0;

            accountStat.totalLosses += !win ? 1 : 0;

            this.sessionProfit = getRoundedNumber(Number(this.sessionProfit) + Number(profit), currency);

            accountStat.totalProfit = getRoundedNumber(Number(accountStat.totalProfit) + Number(profit), currency);

            accountStat.totalStake = getRoundedNumber(Number(accountStat.totalStake) + Number(buyPrice), currency);

            accountStat.totalPayout = getRoundedNumber(Number(accountStat.totalPayout) + Number(sellPrice), currency);

            if (config.vh_variables.vh_official) {
                if (win) {
                    if (config.vh_variables.is_enabled) {
                        handleWonLiveStep(parseFloat(accountStat.totalProfit));
                    } else {
                        calculateWonStatus(parseFloat(accountStat.totalProfit));
                    }
                } else {
                    if (config.vh_variables.is_enabled) {
                        handleLostLiveStep(parseFloat(accountStat.totalProfit));
                    } else {
                        const isRunning = api_base.is_running;
                        const isRunning1 = api_base2.is_running;
                        if (isRunning || isRunning1) {
                            calculateLostStatus(profit, parseFloat(accountStat.totalProfit));
                        }
                    }
                }
            }

            info({
                profit,
                contract,
                accountID: this.accountInfo.loginid,
                totalProfit: accountStat.totalProfit,
                totalWins: accountStat.totalWins,
                totalLosses: accountStat.totalLosses,
                totalStake: accountStat.totalStake,
                totalPayout: accountStat.totalPayout,
            });

            log(win ? log_types.PROFIT : log_types.LOST, { currency, profit });
        }

        updateAndReturnTotalRuns() {
            this.sessionRuns++;
            const accountStat = this.getAccountStat();

            return ++accountStat.totalRuns;
        }

        /* eslint-disable class-methods-use-this */
        getTotalRuns() {
            const accountStat = this.getAccountStat();
            return accountStat.totalRuns;
        }

        getTotalWins() {
            const accountStat = this.getAccountStat();
            return accountStat.totalWins;
        }

        getTotalLosts() {
            const accountStat = this.getAccountStat();
            return accountStat.totalLosses;
        }

        getTotalProfit(toString, currency) {
            const accountStat = this.getAccountStat();

            return toString && accountStat.totalProfit !== 0
                ? getRoundedNumber(+accountStat.totalProfit, currency)
                : +accountStat.totalProfit;
        }

        /* eslint-enable */
        checkLimits(tradeOption) {
            if (!tradeOption.limitations) {
                return;
            }

            const {
                limitations: { maxLoss, maxTrades },
            } = tradeOption;

            if (maxLoss && maxTrades) {
                if (this.sessionRuns >= maxTrades) {
                    throw createError('CustomLimitsReached', localize('Maximum number of trades reached'));
                }
                if (this.sessionProfit <= -maxLoss) {
                    throw createError('CustomLimitsReached', localize('Maximum loss amount reached'));
                }
            }
        }

        /* eslint-disable class-methods-use-this */
        validateTradeOptions(tradeOptions) {
            const take_profit = tradeOptions.take_profit;
            const stop_loss = tradeOptions.stop_loss;

            if (take_profit) {
                tradeOptions.limit_order.take_profit = take_profit;
            }
            if (stop_loss) {
                tradeOptions.limit_order.stop_loss = stop_loss;
            }

            return tradeOptions;
        }

        getAccountStat() {
            this.accountInfo = api_base.account_info;
            const { loginid: accountID } = this.accountInfo;

            if (!(accountID in globalStat)) {
                globalStat[accountID] = { ...skeleton };
            }

            return globalStat[accountID];
        }
    };