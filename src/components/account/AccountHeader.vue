<template>
  <div class="d-flex pb-4">
    <div class="d-flex flex-column flex-grow-1">
      <div class="text-body-1 text-sm-h6 text-uppercase font-weight-bold mb-2">
        {{ headerData.fullName }}
      </div>
      <div
          class="d-flex flex-column flex-sm-row justify-start text-caption text-md-subtitle-1 address--text"
      >
        <div class="mr-5" v-if="headerData.province && headerData.city">
          <span class="span-style">Address:</span> {{ headerData.city }}, {{ headerData.province }}
        </div>
        <div class="mr-5"><span class="span-style">Email:</span> {{ headerData.email }}</div>
        <div class="mr-5"><span class="span-style">Phone:</span> {{ headerData.phone }}</div>
      </div>
    </div>
    <div class="d-flex justify-end flex-grow-1">
      <v-menu left offset-x>
        <template #activator="{ on, attrs }">
          <v-btn icon outlined color="primary" v-on="on" v-bind="attrs">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="py-0" dense>
          <v-list-item
              :class="{
                'menu-border': index < menuItems.length - 1,
                'warning--text': iter.text === 'Log Out',
              }"
              v-for="(iter, index) in menuItems"
              :key="index"
              @click="iter.action()"
          >
            <v-list-item-title class="text-body-2 font-weight-regular">{{
                iter.text
              }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </div>
  </div>
</template>

<script>
export default {
  name: "AccountHeader",
  props: { headerData: Object },
  data: () => ({}),
  computed: {
    menuItems: function () {
      let menu = [
        {
          text: "Change Password",
          action: () => {
            // Action
          },
        },
        {
          text: "Edit Details",
          action: () => {
            this.$router.push({ name: "Guest Edit Details" });
          },
        },
        {
          text: "Log Out",
          action: () => {
            // Action
          },
        },
      ];
      return menu;
    }
  },
};
</script>

<style scoped>
.address--text {
  color: #555555;
}

.span-style {
  text-transform: uppercase;
  font-weight: bold;
}

.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
