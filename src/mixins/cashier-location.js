import { generateCashierLocation } from "@/utils/cashierLocationGenerator";

export default {
  methods: {
    cashierLocation(drawerNumber = this.drawerNumber) {
      const drawerNum = parseInt(drawerNumber, 10);
      if (isNaN(drawerNum) || drawerNum < 1) return "First Floor Lobby";

      const generator = generateCashierLocation();
      let location = "";
      for (let i = 0; i < drawerNum; i++) {
        location = generator.next().value;
      }
      return location;
    },
  },
};
