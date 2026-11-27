<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />

    <div class="d-flex justify-end mt-10">
      <v-text-field
        v-model="search"
        dense
        rounded
        filled
        hide-details
        clearable
        prepend-inner-icon="mdi-magnify"
        placeholder="Search users..."
        class="search-field"
      />
    </div>

    <DefaultTable
      class="mt-4"
      :headers="headers"
      :items="filteredSessions"
      item-key="userId"
      :loading="loading"
      :footerProps="footerProps"
    >
      <template v-slot:item.status="{ item }">
        {{ item.status || "No cashier session" }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn small text color="primary" @click="handleChangePassword(item)">
          Change Password
        </v-btn>
      </template>
    </DefaultTable>

    <UserPasswordDialog
      :opened="dialog.password"
      :onClose="handleCloseDialog"
      :loading="getLoading('userPassword')"
      :meta="selectedUser"
      @onSubmit="handleSubmitPassword"
    />
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import DefaultTable from "@/components/tables/DefaultTable.vue";
import UserPasswordDialog from "@/components/dialogs/UserPasswordDialog.vue";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "UserManagementView",
  components: { PageHeader, DefaultTable, UserPasswordDialog },
  data: () => ({
    headers: [
      { text: "Cashier ID", value: "cashierId" },
      { text: "Full Name", value: "fullName" },
      { text: "Username", value: "username" },
      // { text: "Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    footerProps: { itemsPerPageOptions: [5, 10, 15] },
    search: "",
    dialog: { password: false },
    selectedUser: null,
  }),
  methods: {
    ...mapActions("cashier", ["fetchSessions", "changeCashierPassword"]),
    ...mapActions("alerts", ["requireAlertFn"]),

    handleChangePassword(user) {
      this.selectedUser = user;
      this.dialog.password = true;
    },

    handleCloseDialog() {
      this.dialog.password = false;
      this.selectedUser = null;
    },

    async handleSubmitPassword(payload) {
      if (!this.selectedUser) return;

      const success = await this.changeCashierPassword({
        userId: this.selectedUser.userId,
        payload,
      });

      if (success) this.handleCloseDialog();
    },
  },
  computed: {
    ...mapState("cashier", ["sessions"]),
    ...mapGetters("cashier", ["getLoading"]),

    loading() {
      return this.getLoading("sessions") && !this.sessions.length;
    },

    filteredSessions() {
      const query = this.search?.trim().toLowerCase();
      if (!query) return this.sessions;

      return this.sessions.filter((user) =>
        [
          user.fullName,
          user.username,
          user.cashierId,
          // user.status || "No cashier session",
        ].some((value) => String(value ?? "").toLowerCase().includes(query))
      );
    },
  },
  created() {
    this.requireAlertFn(2);
    this.fetchSessions();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}

.search-field {
  max-width: 300px;
  width: 100%;
}
</style>
