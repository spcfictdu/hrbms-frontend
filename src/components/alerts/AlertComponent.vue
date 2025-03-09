<template>
  <div class="alert-position">
    <v-alert
      :value="alert"
      elevation="1"
      transition="slide-x-transition"
      dense
      width="400"
      dismissible
    >
      <div class="d-flex align-center" style="gap: 16px">
        <v-avatar :color="alerts[status].color" size="36"
          ><v-icon color="white">{{ alerts[status].icon }}</v-icon></v-avatar
        >
        <div class="text-body-2">
          <div class="font-weight-bold grey--text text--darken-4">
            {{ alerts[status].title }}
          </div>
          <div class="grey--text text--darken-1">
            {{ message }}
          </div>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AlertComponent",
  data: () => ({
    isShowAlert: true,
    alerts: {
      success: {
        title: "All good!",
        icon: "mdi-check",
        color: "success",
      },
      error: {
        title: "Bummer!",
        icon: "mdi-close",
        color: "error",
      },
      warning: {
        title: "Warning!",
        icon: "mdi-alert",
        color: "warning",
      },
    },
  }),
  methods: {},
  computed: {
    ...mapState("alerts", ["alert", "alertMeta"]),
    status: function () {
      return this.alertMeta.status || "success";
    },
    message: function () {
      return this.alertMeta.message;
    },
  },
};
</script>

<style scoped>
.alert-position {
  position: fixed;
  bottom: 0;
  left: 50px;
  z-index: 100;
}
</style>
