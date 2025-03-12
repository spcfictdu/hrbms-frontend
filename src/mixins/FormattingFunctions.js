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
    queryParams: {},
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
    assignParamsWithoutDelete: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          this.$set(this.queryParams, key, value);
        }
      }
    },
  },
};

export const assignFormData = {
  methods: {
    assignFormData: function (payload) {
      const formData = new FormData();

      function append(formData, key, value) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            formData.append(key, JSON.stringify([]));
          } else {
            value.forEach((item, index) => {
              append(formData, `${key}[${index}]`, item);
            });
          }
        } else if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof File)
        ) {
          if (Object.keys(value).length === 0) {
            formData.append(key, JSON.stringify({}));
          } else {
            for (const subKey in value) {
              if (value.hasOwnProperty(subKey)) {
                append(formData, `${key}[${subKey}]`, value[subKey]);
              }
            }
          }
        } else {
          formData.append(key, value);
        }
      }

      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          append(formData, key, payload[key]);
        }
      }

      return formData;
    },
  },
};

export const capitalizeString = {
  methods: {
    capitalizeString(str) {
      const lowerCaseString = str.toLowerCase();
      return lowerCaseString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  },
};
