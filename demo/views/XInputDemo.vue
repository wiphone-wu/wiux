<template>
  <div>
    <group :title="t('Disable built-in validation')">
      <x-input
        :title="t('noValidate')"
        :placeholder="t('placeholder')"
        noValidate
        :icon-type="iconType"
        :show-clear="false"
        @on-blur="onBlur"
        placeholder-align="right"
      ></x-input>
    </group>
    <div style="padding: 15px">
      <x-button @click="iconType = 'success'" type="primary">{{
        t("set success")
      }}</x-button>
      <x-button @click="iconType = 'error'" type="primary">{{
        t("set error")
      }}</x-button>
      <x-button @click="iconType = ''" type="primary">{{
        t("set empty")
      }}</x-button>
    </div>

    <group :title="t('is-type with function')">
      <x-input
        :title="t('Must input 2333')"
        :is-type="be2333"
        :placeholder="t('placeholder')"
      ></x-input>
    </group>

    <group :title="t('prop:mask')">
      <x-input
        :title="t('Phone format')"
        mask="999 9999 9999"
        v-model="maskValue"
        :max="13"
        is-type="china-mobile"
      ></x-input>
      <cell :title="t('value')" :value="maskValue"></cell>
      <x-input
        title="(99) 9-99"
        mask="(99) 9-99"
        v-model="maskValue2"
        :max="9"
      ></x-input>
    </group>

    <group :title="t('Use icon instead of title')">
      <x-input
        :title="t('Must input 2333')"
        :is-type="be2333"
        :placeholder="t('placeholder')"
      >
        <template #label>
          <img
            style="padding-right: 10px; display: block"
            src="../assets/cat2.jpg"
            width="24"
            height="24"
          />
        </template>
      </x-input>
    </group>

    <group :title="t('max is alias of maxlength')">
      <x-input
        :title="t('max=5')"
        :max="5"
        @on-change="change"
        v-model="maxValue"
      ></x-input>
    </group>

    <group :title="t('debounce = 500')">
      <x-input
        :title="t('debounce')"
        :debounce="500"
        @on-change="change"
        v-model="debounceValue"
      ></x-input>
    </group>

    <group :title="t('disabled')">
      <x-input
        :title="t('value')"
        text-align="right"
        disabled
        v-model="disabledValue"
      ></x-input>
    </group>

    <group :title="t('set type = tel')">
      <x-input :title="t('value')" type="tel"></x-input>
    </group>

    <group :title="t('html title')">
      <x-input
        label-width="4em"
        :title="`<span style=&quot;${style}&quot;>hello</span>`"
        :placeholder="t('placeholder')"
      ></x-input>
    </group>
    <div style="padding: 15px">
      <x-button @click="style = 'color:red;'" type="primary">{{
        t("set red")
      }}</x-button>
      <x-button @click="style = 'color:green'" type="primary">{{
        t("set green")
      }}</x-button>
      <x-button @click="style = 'color:#000'" type="primary">{{
        t("set default")
      }}</x-button>
    </div>

    <group :title="t('Default')">
      <x-input :title="t('Title')" :placeholder="t('placeholder')"></x-input>
    </group>

    <group :title="t('Hide clear button')">
      <x-input
        :title="t('Title')"
        required
        :placeholder="t('placeholder')"
        :show-clear="false"
        autocapitalize="characters"
      ></x-input>
    </group>

    <group :title="t('focus event')">
      <x-input
        :title="t('focus event')"
        :placeholder="t('Click me')"
        :show-clear="true"
        @on-focus="onFocus"
      ></x-input>
    </group>

    <group :title="t('Set is-type=china-name')">
      <x-input
        :title="t('Name')"
        name="username"
        :placeholder="t('Please enter name')"
        is-type="china-name"
      ></x-input>
    </group>

    <group :title="t('Set keyboard=number and is-type=china-mobile')">
      <x-input
        :title="t('Phone number')"
        name="mobile"
        :placeholder="t('Please enter phone number')"
        keyboard="number"
        is-type="china-mobile"
      ></x-input>
    </group>

    <group :title="t('Set is-type=email')">
      <x-input
        :title="t('Email')"
        name="email"
        :placeholder="t('Please enter email')"
        is-type="email"
      ></x-input>
    </group>

    <group :title="t('Set min=2 and max=5')">
      <x-input
        :title="t('2-5 characters')"
        placeholder=""
        :min="2"
        :max="5"
      ></x-input>
    </group>

    <group :title="t('Confirm input')">
      <x-input
        :title="t('Please enter 6 digits')"
        type="text"
        placeholder=""
        v-model="password"
        :min="6"
        :max="6"
        @on-change="change"
      ></x-input>
      <x-input
        :title="t('Please confirm 6 digits')"
        v-model="password2"
        type="text"
        placeholder=""
        :equal-with="password"
      ></x-input>
    </group>

    <group :title="t('enter event')">
      <x-input
        :title="t('Press enter after input')"
        type="text"
        placeholder=""
        v-model="enterText"
        @on-enter="onEnter"
      ></x-input>
    </group>

    <group :title="t('Verification code')">
      <x-input :title="t('Verification code')">
        <template #right-full-height>
          <img src="../assets/cat1.jpg" />
        </template>
      </x-input>
      <x-input :title="t('Send verification code')" class="weui-vcode">
        <template #right>
          <x-button type="primary" mini>{{
            t("Send verification code")
          }}</x-button>
        </template>
      </x-input>
    </group>

    <group :title="t('required===true')">
      <x-input
        :title="t('Title')"
        :placeholder="t('placeholder')"
        ref="input01"
        required
      ></x-input>
      <cell
        :title="t('click to get valid value')"
        :value="t('$valid value:') + valid1"
        @click="getValid1"
      ></cell>
    </group>

    <group :title="t('Not required===false')">
      <x-input
        :title="t('Title')"
        :placeholder="t('placeholder')"
        :required="false"
        ref="input02"
        @click="getValid2"
      ></x-input>
      <cell
        :title="t('click to get valid value')"
        :value="t('$valid value:') + valid2"
        @click="getValid2"
      ></cell>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { XInput, Group, XButton, Cell, useToast, useLocale } from "wiux";

const toast = useToast();

export default defineComponent({
  name: "XInputDemo",
  components: {
    XInput,
    XButton,
    Group,
    Cell,
  },
  setup() {
    const { t } = useLocale();
    const password = ref("123465");
    const password2 = ref("");
    const enterText = ref("");
    const valid1 = ref(false);
    const valid2 = ref(false);
    const iconType = ref("");
    const style = ref("");
    const disabledValue = ref("hello");
    const debounceValue = ref("");
    const maxValue = ref("");
    const maskValue = ref("13545678910");
    const maskValue2 = ref("");
    const input01 = ref<any>(null);
    const input02 = ref<any>(null);

    const be2333 = (value: string) => {
      return {
        valid: value === "2333",
        msg: "Must be 2333",
      };
    };

    const getValid1 = () => {
      valid1.value = input01.value?.valid ?? false;
    };

    const getValid2 = () => {
      valid2.value = input02.value?.valid ?? false;
    };

    const change = (val: string) => {
      toast.text("on change: " + val, "medium");
    };

    const onBlur = (val: string) => {
      toast.text("on blur: " + val, "medium");
    };

    const onFocus = (val: string, $event: any) => {
      toast.text("on focus: " + val, "medium");
    };

    const onEnter = (val: string) => {
      toast.text("click enter: " + val, "medium");
    };

    return {
      t,
      password,
      password2,
      enterText,
      valid1,
      valid2,
      iconType,
      style,
      disabledValue,
      debounceValue,
      maxValue,
      maskValue,
      maskValue2,
      input01,
      input02,
      be2333,
      getValid1,
      getValid2,
      change,
      onBlur,
      onFocus,
      onEnter,
    };
  },
});
</script>

<style scoped>
.red {
  color: red;
}
.green {
  color: green;
}
</style>
