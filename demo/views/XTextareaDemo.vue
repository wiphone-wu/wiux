<template>
  <div>
    <group>
      <x-textarea
        :max="20"
        :placeholder="t('Hint')"
        @on-focus="onEvent('focus')"
        @on-blur="onEvent('blur')"
      ></x-textarea>
    </group>
    <group :title="t('used with input')">
      <x-input :placeholder="t('Title')"></x-input>
      <x-textarea
        :max="200"
        name="description"
        :placeholder="t('Hint')"
      ></x-textarea>
    </group>
    <group :title="t('Hide counter')">
      <x-textarea
        :max="200"
        name="detail"
        :placeholder="t('Hint')"
        :show-counter="false"
      ></x-textarea>
    </group>
    <group :title="t('Auto height')">
      <x-textarea
        :placeholder="t('Write something')"
        :show-counter="false"
        :rows="1"
        autosize
      ></x-textarea>
      <x-textarea
        :title="t('Title')"
        :placeholder="t('Write something')"
        :show-counter="false"
        :rows="1"
        autosize
      ></x-textarea>
    </group>
    <group :title="t('Set height to 200px')">
      <x-textarea
        :title="t('Title')"
        :max="5000"
        :placeholder="t('Hint')"
        :show-counter="false"
        :height="200"
        :rows="8"
        :cols="30"
      ></x-textarea>
    </group>
  </div>
</template>

<script lang="ts">
import { XTextarea, Group, XInput, useLocale } from "wiux";

export default {
  name: "XTextareaDemo",
  components: {
    XTextarea,
    Group,
    XInput,
  },
  setup() {
    const { t } = useLocale();
    const onEvent = (event: string) => {
      console.log("on", event);
    };

    return {
      t,
      onEvent,
    };
  },
};
</script>
