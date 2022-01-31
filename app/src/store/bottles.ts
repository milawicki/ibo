import { ActionContext, Module } from 'vuex';
import { BottlesService, BottlesServiceEvents } from '@/services';
import { Address, Approval, Bottle, BuyBottles, Transaction, TokenBalance, Withdraw } from '@/interfaces';
import { UpdateBottlePayload } from './interfaces';

interface State {
  bottle: Bottle | null;
  userBalance: TokenBalance | null;
  showWithdrawBottleDetails: boolean;
}

function subscribeForTransferEvents(context: ActionContext<State, null>): void {
  BottlesService.subscribeForEvent(BottlesServiceEvents.Transfer, ({ returnValues }: { returnValues: Transaction }) => {
    returnValues = {
      ...returnValues,
      value: +returnValues.value
    };

    if (returnValues.from === '0x0000000000000000000000000000000000000000') {
      context.commit('updateBottleData', returnValues)
      context.dispatch('UserStore/getCurrentUserBalance', null, { root: true });
    } else {
      const userAddress = context.rootGetters['UserStore/currentUser'];
      const qua = returnValues.value;

      const tokensToAdd = returnValues.from === userAddress
        ? qua * -1
        : returnValues.to === userAddress
          ? qua
          : 0;

      context.commit('updateUserBalance', tokensToAdd);
    }
  });
}

function subscribeForAproval(context: ActionContext<State, null>): void {
  BottlesService.subscribeForEvent(BottlesServiceEvents.Approval, ({ returnValues }: { returnValues: Approval }) => {
    const currentUser = context.rootGetters['UserStore/currentUser'];

    if (currentUser === returnValues.owner) {
      context.commit('setShowWithdrawBottleDetails', true);
    }
  });
}

function subscribeForWithdraw(context: ActionContext<State, null>): void {
  BottlesService.subscribeForEvent(BottlesServiceEvents.Withdraw, ({ returnValues }: { returnValues: Withdraw }) => {
    const currentUser = context.rootGetters['UserStore/currentUser'];

    if (currentUser === returnValues.to) {
      context.dispatch('UserStore/getCurrentUserBalance', null, { root: true });
    }
  });
}

export const BottlesStore: Module<State, null> = {
  namespaced: true,

  state: {
    bottle: null,
    userBalance: null,
    showWithdrawBottleDetails: false
  },

  getters: {
    bottle: (state: State) => state.bottle,
    userBalance: (state: State) => state.userBalance,
    showWithdrawBottleDetails: (state: State) => state.showWithdrawBottleDetails,
  },

  mutations: {
    setBottle(state: State, bottle: Bottle): void {
      bottle = {
        ...bottle,
        bottles: +bottle.bottles,
        totalSupply: +bottle.totalSupply
      };

      state.bottle = bottle;
    },

    setUserBalance(state: State, userBalance: TokenBalance): void {
      userBalance = {
        ...userBalance,
        balance: +userBalance.balance
      };

      state.userBalance = userBalance;
    },

    updateBottleData(state: State, Transaction: Transaction): void {
      if (state.userBalance) {
        state.userBalance.balance += Transaction.value;
      }

      if (state.bottle) {
        state.bottle = {
          ...state.bottle,
          totalSupply: +state.bottle.totalSupply + Transaction.value
        }
      }
    },

    updateUserBalance(state: State, value: number): void {
      if (state.userBalance) {
        state.userBalance.balance += value;
      }
    },

    setShowWithdrawBottleDetails(state: State, value: boolean): void {
      state.showWithdrawBottleDetails = value;
    }
  },

  actions: {
    init(context: ActionContext<State, null>): void {
      context.dispatch('getBottleDetails');

      subscribeForTransferEvents(context);
      subscribeForAproval(context);
      subscribeForWithdraw(context);
    },

    async getBottleDetails(context: ActionContext<State, null>): Promise<void> {
      const bottle = await BottlesService.getDetails();
      bottle && context.commit('setBottle', bottle);
    },

    async getUserBalance(context: ActionContext<State, null>, userAddress: Address): Promise<void> {
      const balance = await BottlesService.getUserBalance(userAddress);
      balance && context.commit('setUserBalance', balance);
    },

    buyToken(context: ActionContext<State, null>, order: BuyBottles): void {
      BottlesService.buyToken(order);
    },

    updateBottle(context: ActionContext<State, null>, { newBottle, bottle }: UpdateBottlePayload): void {
      BottlesService.updateBottleData(newBottle, bottle);
    },

    withdrawBottle(context: ActionContext<State, null>, data: TokenBalance): void {
      BottlesService.startWithdrawingProcess(context.getters.bottle.owner, data);
    },

    withdraw(): void {
      BottlesService.withdraw();
    }
  }
}
