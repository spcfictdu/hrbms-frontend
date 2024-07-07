<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-form ref="form" lazy-validation>
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
            class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
        >Change Password
        </v-card-title>

        <div class="mt-4 pb-4">
          <label-slot>
            <template #label>Old Password</template>
          </label-slot>
          <v-text-field type="password" dense outlined hide-details="auto"></v-text-field>
        </div>

        <div class="pb-4">
          <label-slot>
            <template #label>New Password</template>
          </label-slot>
          <v-text-field type="password" dense outlined hide-details="auto"></v-text-field>
        </div>

        <div class="pb-4">
          <label-slot>
            <template #label>Confirm Password</template>
          </label-slot>
          <v-text-field type="password" dense outlined hide-details="auto"></v-text-field>
        </div>

        <v-card-actions class="pa-0 mt-4">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first">
              <v-btn text block color="warning"
              >Cancel
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                  text
                  block
                  color="primary"
                  class="lightBg"
              >Save Changes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";

export default {
  name: "PasswordDialog",
  components: { LabelSlot },
  data: () => ({
    dialog: false,
  })
}
</script>

<style scoped>

</style>