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
                darkText: "#BABABA",
                titleText: "#111111",
                line: "#E0E0E0"
            },
        },
    },
});
