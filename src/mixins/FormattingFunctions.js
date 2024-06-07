export const formatDate = {
  methods: {
    formatDate: function (date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedDate}`;
    },
  },
};
export const formatTime = {
  methods: {
    formatTime: function (date) {
      const formattedTime = new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedTime}`;
    },
  },
};
export const assignParams = {
  data: () => ({
    queryParams: {}
  }),
  methods: {
    assignParams: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          if (value === null) {
            // if value is null, delete in query_params
            this.$delete(this.queryParams, key);
          } else {
            // if property has data, add to query_params
            this.$set(this.queryParams, key, value);
          }
        }
      }
    },
  }
}
