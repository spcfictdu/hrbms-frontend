import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#2F45B7",
        secondary: "#4B68FF",
        accentOne: "#DB8300",
        accentTwo: "#D3DAFF",
        lightBg: "#ECEFFF",
        longText: "#555555",
        titleText: "#111111",
        line: "#E0E0E0",
        housekeeping: "#ff3838",
        checkedin: "#00ac30",
        checkedout: "#e9a700",
        confirmed: "#2f45b7",
        reserved: "#df18ff",
        warning: "#ff3838",

        // Room List Card
        // Confirmed and Reserved already included..
        occupied: "#DB8300",
        unclean: "#db1a00",
        available: "#00ac30",
      },
    },

    options: { customProperties: true },
  },
});
