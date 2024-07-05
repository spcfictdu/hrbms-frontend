<template>
  <div class="mt-8">
    <account-header />

    <v-divider />

    <accomodation-component />
  </div>
</template>

<script>
import AccountHeader from '@/components/account/AccountHeader.vue';
import AccomodationComponent from '@/components/account/AccomodationComponent.vue';
  export default {
    name: "AccountView",
    components: { AccountHeader, AccomodationComponent },
    data: () => ({

    })
  }
</script>

<style scoped>

</style>