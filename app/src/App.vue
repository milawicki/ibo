<template>
  <v-app>
     <v-app-bar app flat color="white">
       <v-app-bar-title>IBO - Initial Bottle Offering</v-app-bar-title>
       <current-user :user="currentUser" @walletConnected="onWalletConnected" />
    </v-app-bar>

    <v-main>
      <v-container class="py-8 px-6">
        <v-row>
          <v-col cols="6">
            <h1>What is IBO?</h1>
            <p>IBO (Initial Bottle Offering) is a way for alcohol producers to tokenize thier production. You as a producer can create token that'll represent bottles you'll provide in the future. Customers can buy tokends with discount and exchange them to real bottles when they'll be ready.</p>
            <p><small>ps. this app is not production ready</small></p>

            <h2 class="mt-7 my-4">Current offers</h2>
            <single-bottle v-if="bottle" 
              :bottle="bottle" :isOwner="isOwner(bottle)" :canBuy="!!currentUser"
              @buy="onBuy" @edit="onBottleEdit" @withdraw="onWithdraw" />

          </v-col>
          <v-col cols="6">
            <balance :value="currentUserBalance" symbol="ETH" />
            <balance v-if="userBalance && userBalance.balance > 0" 
              :value="+userBalance.balance" :symbol="userBalance.token" :hasDecimals="false"
              :isWithdrawable="true" @withdraw="onBottleWithdraw" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <no-wallet v-if="!isWalletDetected" />

    <edit-bottle v-if="bottleToEdit" 
      :bottle="bottleToEdit" 
      @close="closeEditMode"
      @update="onBottleUpdate" />

    <withrawd-details v-if="showWithdrawBottleDetails" @close="closeWithrawdDetails" :address="currentUser" />
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Web3 from 'web3';
  import { Address, Bottle, BuyBottles, TokenBalance, UpdateBottle } from '@/interfaces';
  import CurrentUser from '@/components/CurrentUser.vue';
  import NoWallet from '@/components/NoWallet.vue';
  import Balance from '@/components/Balance.vue';
  import SingleBottle from '@/components/SingleBottle.vue';
  import EditBottle from '@/components/EditBottle.vue';
  import WithrawdDetails from '@/components/WithdrawDetails.vue';

  @Component({ components: { CurrentUser, Balance, EditBottle, NoWallet, SingleBottle, WithrawdDetails } })
  export default class App extends Vue {
    bottleToEdit: Bottle | null = null;

    async mounted(): Promise<void> {      
      this.loadData();
      this.$store.dispatch('BottlesStore/init');

      Web3.givenProvider?.on('accountsChanged', () => {
        this.loadData();
      });
    }

    get currentUser(): Address | null {
      return this.$store.getters['UserStore/currentUser'];
    }

    get currentUserBalance(): Address | null {
      return this.$store.getters['UserStore/currentUserBalance'];
    }

    get isWalletDetected(): boolean {
      return !!Web3.givenProvider;
    }

    get bottle(): Bottle | null {
      return this.$store.getters['BottlesStore/bottle'];
    }

    get userBalance(): TokenBalance | null {
      return this.$store.getters['BottlesStore/userBalance'];
    }

    get showWithdrawBottleDetails(): Bottle | null {
      return this.$store.getters['BottlesStore/showWithdrawBottleDetails'];
    }

    async loadData(): Promise<void> {
      await this.$store.dispatch('UserStore/getCurrentUser');
      if (this.currentUser) {
        this.$store.dispatch('BottlesStore/getUserBalance', this.currentUser);
      }
    }

    onWalletConnected(): void {
      this.$store.dispatch('UserStore/connect');
    }

    onBuy(order: BuyBottles): void {
      this.$store.dispatch('BottlesStore/buyToken', order);
    }

    isOwner(bottle: Bottle): boolean {
      return bottle.owner === this.currentUser;
    }

    onBottleEdit(bottle: Bottle): void {
      this.bottleToEdit = bottle;
    }

    closeEditMode(): void {
      this.bottleToEdit = null;
    }

    onBottleUpdate(newBottle: UpdateBottle, bottle: Bottle): void {
      this.$store.dispatch('BottlesStore/updateBottle', { newBottle, bottle });
    }

    onBottleWithdraw(data: TokenBalance): void {
      this.$store.dispatch('BottlesStore/withdrawBottle', data);
    }

    closeWithrawdDetails(): void {
      this.$store.commit('BottlesStore/setShowWithdrawBottleDetails', false);
    }

    onWithdraw(): void {
      this.$store.dispatch('BottlesStore/withdraw');
    }
  }
</script>
