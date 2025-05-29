<template>
  <v-menu
    :offset-y="isSmall"
    :offset-x="isLarge"
    :right="isLarge"
    :max-width="menuWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="text-subtitle-2 font-weight-regular"
        height="70px"
        depressed
        block
        :ripple="false"
        :color="selectedAddOn === addOn.name ? 'primary' : 'lightBg'"
        :class="
          selectedAddOn === addOn.name
            ? 'font-weight-medium'
            : 'font-weight-regular'
        "
        @click="setSelectedAddOn(addOn.name)"
        v-bind="attrs"
        v-on="on"
      >
        <div>
          <div>{{ addOn.name }}</div>
          <div class="font-weight-bold text-body-1">₱{{ addOn.price }}</div>
        </div>
      </v-btn> </template
    ><v-list dense class="pa-0">
      <v-list-item
        v-for="(option, index) in options"
        :key="option.value"
        @click="
          selectOption(
            option.value,
            addOn.referenceNumber,
            addOn.name,
            addOn.price
          )
        "
        :class="{ 'menu-border': index < options.length - 1 }"
      >
        <v-list-item-title
          class="text-subtitle-2 font-weight-regular"
          :class="itemColor(option.text)"
        >
          {{ option.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AddOnItem",
  props: {
    addOn: Object,
  },
  data: () => ({
    // Menu Options
    options: [
      {
        text: "Edit Add-on",
        value: "edit",
      },
      {
        text: "Delete Add-on",
        value: "delete",
      },
    ],

    // Menu Properties
    isSmall: false,
    isLarge: true,
    menuWidth: 150,
  }),
  methods: {
    ...mapActions("addOns", ["setSelectedAddOn"]),
    ...mapActions("dialogs", ["setDialogMessage"]),
    itemColor(item) {
      if (item === "Delete Add-on") {
        return "warning--text";
      }
    },
    selectOption(option, refNum, addOnName, addOnPrice) {
      this.setDialogMessage("Add-on");
      this.$emit("onSelect", option, refNum, addOnName, addOnPrice);
    },
  },
  computed: {
    ...mapState("addOns", ["loading", "selectedAddOn"]),
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.sm) {
          this.isSmall = true;
          this.isLarge = false;
          this.menuWidth = 300;
        } else if (newVal.xs) {
          this.isSmall = true;
          this.isLarge = false;
          this.menuWidth = 500;
        } else {
          this.isSmall = false;
          this.isLarge = true;
          this.menuWidth = 150;
        }
      },
    },
  },
};
</script>
