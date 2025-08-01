<template>
  <v-app class="bg-color" :class="bgImages[$router.currentRoute.meta.name]">
    <PageLoader :target="hasLoaded">
      <div class="container-height">
        <!-- Navigation -->
        <Navigation v-if="navigation.primary" />
        <PublicNavigation v-if="navigation.secondary" />

        <div
          :class="{
            'flex-grow-1 mt-n10 bg-color main-layout white py-5':
              !notAllowedRoutes.includes($router.currentRoute.name),
          }"
        >
          <v-container class="pa-0 transparent-bg">
            <v-main
              class="mx-3"
              :class="{
                'custom-main': notAllowedRoutes.includes(
                  $router.currentRoute.name
                ),
              }"
            >
              <router-view />
              <CashierDialog
                :persistent="true"
                :onClose="() => SET_DIALOG({ key: 'cashier', value: false })"
                :opened="dialog.cashier && $auth.user()?.role === 'FRONT DESK'"
                :meta="cashierDialogMeta"
                :loading="loading.dialog"
                :balanceData="balanceData"
                @submit="handleAction"
              />
              <AlertComponent />
            </v-main>
          </v-container>
        </div>
        <!-- Footer Component -->
        <footer-component
          v-if="allowedFooterRoutes.includes($router.currentRoute.name)"
        />
      </div>
    </PageLoader>
  </v-app>
</template>

<script>
import Navigation from "./components/navigation/Navigation.vue";
import PublicNavigation from "./components/navigation/PublicNavigation.vue";
import FooterComponent from "./components/public/FooterComponent.vue";
import PageLoader from "./components/loaders/PageLoader.vue";
import AlertComponent from "./components/alerts/AlertComponent.vue";
import CashierDialog from "@/components/dialogs/CashierDialog.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "App",
  components: {
    Navigation,
    PublicNavigation,
    FooterComponent,
    PageLoader,
    AlertComponent,
    CashierDialog,
  },

  data: () => ({
    hasLoaded: false,
    notAllowedRoutes: ["Sign In", "Guest Sign In"],
    allowedFooterRoutes: ["Public Dashboard", "Guest Dashboard"],
    bgImages: {
      "Sign In": "image-bg",
      "Guest Sign In": "image-bg-2",
    },
  }),

  methods: {
    ...mapActions("authentication", ["logout"]),
    ...mapMutations("cashier", [
      "SET_DIALOG",
      "SET_ADJUSTMENT",
      "SET_CURRENT_CASHIER",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("cashier", ["startSession", "closeSession", "fetchSessions"]),

    async handleAction(adjustment) {
      this.requireAlertFn(2);

      const userId = this.$auth.user().userId;

      let payload = {
        ...adjustment,
      };

      if (this.getCashierAction === "Open") {
        await this.startSession({ userId, payload });
        await this.fetchSessions();
      } else {
        try {
          const response = await this.closeSession({
            userId,
            payload,
          });

          if (response.error)
            throw new Error(`Error message: ${response.message}`);

          await this.logout(this.$auth.user().role);
          console.log("logged out");

          this.SET_CURRENT_CASHIER();
        } catch (err) {
          console.error(err);
        }
      }
      // this.SET_FILTERED_SESSIONS();

      this.SET_DIALOG({ key: "cashier", value: false });
      this.SET_ADJUSTMENT("");
      // this.SET_CURRENT_CASHIER();
    },
  },

  computed: {
    ...mapState("cashier", [
      "dialog",
      "loading",
      "currentCashier",
      "adjustment",
    ]),
    ...mapGetters("cashier", [
      "getCashierAction",
      "isCurrentCashierSessionless",
    ]),

    navigation: function () {
      const currentRoute = this.$route.meta;
      return {
        primary:
          (this.$auth.user()?.role === "ADMIN" ||
            this.$auth.user()?.role === "FRONT DESK") &&
          !(currentRoute["isPublic"] || currentRoute["isGuest"]),
        secondary: currentRoute["isPublic"] || currentRoute["isGuest"],
      };
    },

    cashierDialogMeta() {
      if (this.getCashierAction === "Open")
        return {
          action: "Open",
          actionType: "Cashier Drawer",
          submitBtnText: this.getCashierAction,
        };

      return {
        action: "Adjust",
        actionType: "Closing Balance",
        submitBtnText: this.getCashierAction,
      };
    },

    balanceData() {
      const { closingBalance, closingAdjustment } =
        this.currentCashier.session ?? {};
      const newOpeningBalance = this.isCurrentCashierSessionless
        ? 0
        : Number(closingBalance) + Number(closingAdjustment);
      const effectiveAdjustment = this.adjustment === "" ? 0 : this.adjustment;

      if (!this.currentCashier?.session) {
        return [
          {
            name: "Opening Balance",
            totalAmount: newOpeningBalance,
          },
          {
            name: "Beginning Balance",
            totalAmount: newOpeningBalance + effectiveAdjustment,
          },
        ];
      }

      if (this.getCashierAction === "Open")
        return [
          {
            name: "Opening Balance",
            totalAmount: newOpeningBalance,
          },
          {
            name: "Beginning Balance",
            totalAmount: newOpeningBalance + effectiveAdjustment,
          },
        ];

      return [
        {
          name: "Total",
          totalAmount: this.closingBalance,
        },
      ];
    },

    closingBalance() {
      if (!this.currentCashier?.session || this.isCurrentCashierSessionless)
        return 0;

      const { beginningBalance, payments } = this.currentCashier.session;

      let paymentTotal = 0;
      if (payments?.length) {
        paymentTotal = payments.reduce(
          (total, payment) => total + Number(payment.totalAmount),
          0
        );
      }

      const closingBalance = Number(beginningBalance) + paymentTotal;
      return closingBalance;
    },
  },
  mounted() {
    // if (
    //   !this.$auth.user() &&
    //   !this.notAllowedRoutes.includes(this.$router.currentRoute.name)
    // ) {
    //   // this.logout();
    // }
    setTimeout(() => {
      this.hasLoaded = true;
    }, 1000);
  },
};
</script>

<style scoped>
.main-layout {
  border-radius: 40px 40px 0 0;
}

.bg-color {
  background-color: #f9f6ff !important;
}

.container-height {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.transparent-bg {
  background-color: transparent !important;
}

.image-bg {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url(./assets/bgImage.jpg) no-repeat center center/cover;
}

.image-bg-2 {
  background: url(./assets/bgImage-2.jpg) no-repeat center/cover;
}

.custom-main {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.custom-main-2 {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
}
</style>
