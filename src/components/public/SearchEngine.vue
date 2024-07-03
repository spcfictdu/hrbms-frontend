<template>
  <div>
    <v-card
      flat
      class="card-container py-6 px-6 py-md-8 px-md-12"
      :class="{ 'xl-padding': $vuetify.breakpoint.lgAndUp }"
    >
      <div class="mb-4">
        <div class="text-h5 text-sm-h4 font-weight-bold white--text">
          BOOK YOUR STAY WITH US
        </div>
      </div>
      <v-form ref="form" lazy-validation>
        <div>
          <v-card
            class="search-container py-4 px-4 px-md-0 py-md-2 pr-md-2 d-flex flex-column flex-md-row justify-start align-start align-md-center"
            :class="{ 'gap-spacing': $vuetify.breakpoint.smAndDown }"
          >
            <div
              class="ml-0 pr-0 ml-md-6 pr-md-2 d-flex flex-grow-0 flex-md-grow-1 overflow-y-hidden"
              :class="{ 'primary--text': isActive(menu) }"
            >
              <i class="fi fi-sr-calendar-day calendar-icon align-self-end"></i>
              <div class="d-flex flex-column flex-grow-1 flex-md-grow-0">
                <div
                  class="d-none d-lg-flex mx-3 text-overline font-weight-bold"
                >
                  Check-In Date
                </div>
                <div class="d-flex d-lg-none">
                  <p class="mx-3 mb-0 text-caption">Check-In Date</p>
                </div>
                <v-menu
                  :close-on-content-click="false"
                  offset-y
                  bottom
                  transition="scale-transition"
                  v-model="menu"
                  min-width="auto"
                  max-width="290"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-on="on"
                      v-bind="attrs"
                      :outlined="$vuetify.breakpoint.smAndDown"
                      :flat="!$vuetify.breakpoint.smAndDown"
                      :solo="!$vuetify.breakpoint.smAndDown"
                      dense
                      readonly
                      hide-details="auto"
                      :value="formattedDate(queryParams.checkInDate)"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="queryParams.checkInDate"
                    :min="minDate"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>

            <v-divider class="d-none d-md-flex hr-opacity" vertical />

            <div
              class="ml-0 pr-0 ml-md-6 pr-md-2 d-flex flex-grow-0 flex-md-grow-1 overflow-y-hidden"
              :class="{ 'primary--text': isActive(menu_2) }"
            >
              <i class="fi fi-sr-calendar-day calendar-icon"></i>

              <div class="d-flex flex-column flex-grow-1 flex-md-grow-0">
                <div
                  class="d-none d-lg-flex ml-3 text-overline font-weight-bold"
                >
                  Check-Out Date
                </div>
                <div class="d-flex d-lg-none">
                  <p class="mx-3 mb-0 text-caption">Check-Out Date</p>
                </div>
                <v-menu
                  :close-on-content-click="false"
                  offset-y
                  bottom
                  transition="scale-transition"
                  v-model="menu_2"
                  min-width="auto"
                  max-width="290"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-on="on"
                      v-bind="attrs"
                      :outlined="$vuetify.breakpoint.smAndDown"
                      :flat="!$vuetify.breakpoint.smAndDown"
                      :solo="!$vuetify.breakpoint.smAndDown"
                      dense
                      readonly
                      hide-details="auto"
                      :value="formattedDate(queryParams.checkOutDate)"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="queryParams.checkOutDate"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>

            <v-divider class="d-none d-md-flex hr-opacity" vertical />

            <div
              class="ml-0 pr-0 ml-md-6 pr-md-2 d-flex flex-grow-0 flex-md-grow-1 overflow-y-hidden"
              :class="{
                'primary--text': isActive(guestInputState),
                'warning--text': isActive(guestInputWarning),
              }"
            >
              <i class="fi fi-sr-user calendar-icon"></i>
              <div class="d-flex flex-column flex-grow-1 flex-md-grow-0">
                <div
                  class="d-none d-lg-flex ml-3 text-overline font-weight-bold"
                >
                  Number of Guests
                </div>
                <div class="d-flex d-lg-none">
                  <p class="mx-3 mb-0 text-caption">Number of Guests</p>
                </div>
                <v-text-field
                  @focus="guestInputState = true"
                  @blur="guestInputState = false"
                  @input="validateGuests"
                  :outlined="$vuetify.breakpoint.smAndDown"
                  :flat="!$vuetify.breakpoint.smAndDown"
                  :solo="!$vuetify.breakpoint.smAndDown"
                  :rules="rules.numberOfGuests"
                  type="number"
                  hide-details="auto"
                  dense
                  v-model.number="queryParams.numberOfGuests"
                  oninput="if(this.value < 1) this.value = 0;"
                ></v-text-field>
              </div>
            </div>

            <v-divider class="d-none d-md-flex hr-opacity" vertical />

            <v-btn
              @click="submitQuery"
              :block="$vuetify.breakpoint.smAndDown"
              depressed
              color="primary"
              class="mt-2 mt-md-0 ml-0 mr-0 ml-md-6 mr-md-4 overflow-hidden"
              style="font-size: 1rem"
            >
              <i class="fi fi-rr-search search-icon"></i>
              <div
                class="ml-1 text-capitalize font-weight-regular"
                style="font-size: 1.1rem"
              >
                Search
              </div>
            </v-btn>
          </v-card>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { parseISO, format } from "date-fns";
import LabelSlot from "../slots/LabelSlot.vue";
export default {
  name: "SearchEngine",
  components: { LabelSlot },
  data: () => ({
    queryParams: {
      checkInDate: null,
      checkOutDate: null,
      numberOfGuests: 0,
    },
    menu: false,
    menu_2: false,
    guestInputState: false,
    guestInputWarning: false,
    minDate: new Date().toISOString().slice(0, 10),
  }),
  methods: {
    formattedDate: function (value) {
      return value ? format(parseISO(value), "MM/dd/yyyy") : `Preferred Date?`;
    },
    isActive: function (state) {
      return !!state;
    },
    submitQuery: function () {
      this.validateGuests();
      if (this.$refs.form.validate()) {
        let queryPayload = { ...this.queryParams };

        if (queryPayload.numberOfGuests === 0) {
          queryPayload.numberOfGuests = null;
        }

        this.$emit("queryParams", queryPayload);
      }
    },
    validateGuests: function () {
      if (this.queryParams.numberOfGuests <= 0) {
        this.guestInputWarning = true;
      } else {
        this.guestInputWarning = false;
      }
    },
    resetQuery: function () {
      for (const key in this.queryParams) {
        if (Object.hasOwnProperty.call(this.queryParams, key)) {
          if (key === "numberOfGuests") {
            this.$set(this.queryParams, key, 0);
          } else {
            this.$set(this.queryParams, key, null);
          }

        }
      }
    }
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.numberOfGuests = [(v) => v > 0 || ""];
      return errors;
    },
  },
  watch: {},
};
</script>

<style scoped>
@import "~@flaticon/flaticon-uicons/css/all/all.css";

.card-container {
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(../../assets/bgImage-4.png) no-repeat center/cover;
  border-radius: 10px;
}

.xl-padding {
  padding: 32px 128px;
}

.gap-spacing {
  gap: 10px;
}

.search-container {
  border-radius: 5px;
  color: rgba(51, 51, 51, 0.7);
}

.search-container > div {
  width: 100%;
}

.fi.calendar-icon {
  font-size: 25px;
  margin-top: auto;
  margin-right: 8px;
  transform: translateY(5px);
}

.fi.search-icon {
  margin-top: 4px;
}

.hr-opacity {
  opacity: 0.8;
  margin: 5px 0 5px 0;
}
</style>
