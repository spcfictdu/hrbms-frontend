export default {
  data: () => ({
    searchTimeout: null,
    options: {},
    query_params: {},
  }),
  methods: {
    handleSearch: function (value) {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        if (value === "") {
          this.$delete(this.query_params, "search");
        } else {
          this.$set(this.query_params, "search", value);
          this.$delete(this.query_params, "page");
        }
      }, 300);
    },
    handleOptions: function (value) {
      const formattedItems = this.includedItems.reduce((params, key) => {
        if (key === "page") {
          params.page = value.page;
        } else if (key === "itemsPerPage" && value.itemsPerPage) {
          params.perPage = value.itemsPerPage;
        } else if (key === "sortBy" && value.sortBy.length === 1) {
          params.sort_by = value.sortBy[0];
        } else if (
          value.sortBy.length === 1 &&
          key === "sortDesc" &&
          value.sortDesc.length === 1
        ) {
          params.sort_order = value.sortDesc[0] ? "desc" : "asc";
        }
        return params;
      }, {});

      this.query_params = Object.assign(
        {},
        this.query_params.search && { search: this.query_params.search },
        formattedItems
      );
    },
    handleResetPage: function () {
      this.options.page = 1;
    },
  },
  watch: {
    search: {
      handler: function (value) {
        this.handleSearch(value);
      },
    },
    options: {
      deep: true,
      handler: function (value) {
        this.handleOptions(value);
      },
    },
    query_params: {
      deep: true,
      handler: function (value) {
        this.$emit("onQuery", value);
      },
    },
  },
};
