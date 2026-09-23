<template>
  <div>
    <Msg
      :title="title"
      :description="description"
      :buttons="buttons"
      :icon="icon"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Msg, useLocale } from "wiux";

export default {
  components: {
    Msg,
  },
  setup() {
    const { t } = useLocale();
    const router = useRouter();
    const icon = ref("");
    const title = computed(() => t("Operation successful"));
    const description = computed(() =>
      t(
        'Content details can be arranged as needed. If it needs to be split onto multiple lines, each line should not exceed the specified length and should be centered. <a href="javascript:void(0);">Text link</a>',
      ),
    );

    const changeIcon = () => {
      if (!icon.value || icon.value === "success") {
        icon.value = "warn";
      } else if (icon.value === "warn") {
        icon.value = "info";
      } else if (icon.value === "info") {
        icon.value = "waiting";
      } else if (icon.value === "waiting") {
        icon.value = "success";
      }
    };

    const goHome = () => {
      router.push("/");
    };

    const buttons = computed(() => [
      {
        type: "primary",
        text: t("Recommended action"),
        onClick: changeIcon,
      },
      {
        type: "default",
        text: t("Secondary action"),
        link: "/",
      },
    ]);

    return {
      icon,
      title,
      description,
      buttons,
    };
  },
};
</script>
