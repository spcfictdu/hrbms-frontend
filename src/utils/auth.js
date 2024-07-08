import store from "@/store";

export const auth = {
  user: function () {
    let user = store.getters["authentication/getCurrentUser"];
    return user;
  },

  token: function () {
    let user = store.getters["authentication/getCurrentUser"];
    return user && user.token ? user.token : null;
  },

  handleTabTermination: function (event) {
    // Check if the session is terminated
    // navType === 1 is equals to tab refresh.
    const navType = event.currentTarget.performance.navigation.type;
    const TYPE_RELOAD = 1;
    
    if (!navType === TYPE_RELOAD) {
      store.dispatch("authentication/clearUserData");
    } else {
      sessionStorage.setItem("isRefresh", "true");
    }
  },

  handleTabRefresh: function () {
    // Check if the page was refreshed
    const isRefresh = sessionStorage.getItem("isRefresh") === "true";

    if (isRefresh) {
      sessionStorage.removeItem("isRefresh");
    } else {
      // If it's not a refresh, clear the token and other data on initial load
      store.dispatch("authentication/clearUserData");
    }
  },
};
