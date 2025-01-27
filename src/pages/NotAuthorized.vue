<template>
  <div class="container">
    <q-btn
      flat
      dense
      noCaps
      :label="$t('Volver')"
      class="q-px-md btn"
      icon="arrow_back"
      size="lg"
      @click="goBack"
    />
    <img :src="notAuth" alt="unauthorized" />
  </div>
</template>

<script>
import { useTranslation } from "i18next-vue";
import notAuth from "../assets/images/notAuth.jpg";
import { useRouter } from "vue-router";
export default {
  name: "NotAuthorized",
  data() {
    return {
      notAuth,
      modalDelivery: true,
    };
  },
  setup() {
    const { t } = useTranslation();
    const router = useRouter();
    return { t, router };
  },
  methods: {
    goBack() {
      this.router.go(-2);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
  img {
    height: auto;
    width: 90%;
    max-width: 800px;
  }
  .btn {
    align-self: flex-start;
  }
}
</style>
