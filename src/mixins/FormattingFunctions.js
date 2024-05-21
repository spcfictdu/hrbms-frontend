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
