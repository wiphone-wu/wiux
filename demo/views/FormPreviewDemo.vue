<template>
  <div>
    <form-preview
      :header-label="t('Payment amount')"
      header-value="¥2400.00"
      :body-items="list"
      :footer-buttons="buttons1"
    ></form-preview>
    <br />
    <form-preview
      :header-label="t('Payment amount')"
      header-value="¥2400.00"
      :body-items="list"
      :footer-buttons="buttons2"
      name="demo"
    ></form-preview>
    <br />
    <form-preview
      :header-label="t('Payment amount')"
      header-value="¥2400.00"
      :body-items="list"
    ></form-preview>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { FormPreview, useToast, useLocale } from "wiux";

const toast = useToast();

export default defineComponent({
  components: {
    FormPreview,
  },
  setup() {
    const { t } = useLocale();

    const list = computed(() => [
      {
        label: t("Products"),
        value: t("Articles"),
      },
      {
        label: t("Item Title"),
        value: t("Item Name"),
      },
      {
        label: t("Item Title"),
        value: t(
          "Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Content",
        ),
      },
    ]);

    const buttons1 = computed(() => [
      {
        style: "default",
        text: t("Secondary button"),
      },
      {
        style: "primary",
        text: t("Go to Homepage"),
        link: "/",
      },
    ]);

    const buttons2 = computed(() => [
      {
        style: "primary",
        text: t("Click Event"),
        onButtonClick: (name: string) => {
          toast.text(`clicking ${name}`);
        },
      },
    ]);

    return {
      t,
      list,
      buttons1,
      buttons2,
    };
  },
});
</script>
