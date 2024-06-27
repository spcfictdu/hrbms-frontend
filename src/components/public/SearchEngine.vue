<template>
  <div>
    <v-card flat class="card-container">
      <div class="mb-4">
        <h1 class="white--text">BOOK YOUR STAY WITH US</h1>
      </div>
      <div>
        <v-card class="search-container d-flex justify-start align-center">
          <div class="ml-6 pa-2 d-flex flex-column">
            <div class="text-overline align-self-center">Check-In Date</div>
            <div class="d-flex align-center overflow-hidden">
              <i class="fi fi-sr-calendar-day calendar-icon"></i>
              <v-text-field type="tel" v-model="queryParams.checkInDate" v-mask="'##/##/####'" solo
                            hide-details="auto"
                            flat
                            class="ml-2 text-body-1 font-weight-bold"></v-text-field>
            </div>
          </div>

          <v-divider vertical/>

          <div class="ml-8 d-flex flex-column">
            <div class="text-overline align-self-center">Check-Out Date</div>
            <div>
              <i class="fi fi-sr-calendar-day calendar-icon"></i>
            </div>
          </div>

          <v-divider vertical/>

          <div class="ml-8 d-flex flex-column">
            <div class="text-overline align-self-center">Number of Guests</div>
            <div>
              <i class="fi fi-sr-calendar-day calendar-icon"></i>
            </div>
          </div>

          <v-divider vertical/>


          <div class="ml-8 d-flex flex-column">
            <v-btn large color="primary" class="text-capitalize font-weight-regular" style="font-size: 1rem">
              <i class="fi fi-rr-search"></i>
              Search
            </v-btn>
          </div>


        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask';
import { parseISO, format } from "date-fns";

export default {
  name: "SearchEngine",
  directives: { mask },
  data: () => ({
    queryParams: {
      checkInDate: format(parseISO(new Date().toISOString().slice(0, 10)), "MM/dd/yyyy"),
      checkOutDate: null,
      numberOfGuests: null,
    },
  }),
  methods: {
    validateDate(date) {
      // Regex pattern to match the date format
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;

      if (!datePattern.test(date)) {
        console.error('Invalid date format or range');
        // handle invalid date input
      } else {
        console.log('Valid date format');
        // handle valid date input
      }
    }
  },
  computed: {},
  watch: {
    "queryParams.checkInDate": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        console.log(newVal)
        this.validateDate(newVal);
      }
    }
  }
}
</script>

<style scoped>
@import "~@flaticon/flaticon-uicons/css/all/all.css";

.card-container {
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
  url(../../assets/bgImage-4.png) no-repeat center/cover;
  padding: 32px 128px;
  border-radius: 10px;
}

.search-container {
  border-radius: 10px;
  padding: 16px 16px 16px 0;
}

.fi.calendar-icon {
  font-size: 25px;
  color: #333;
  margin-top: 16px;
}
</style>