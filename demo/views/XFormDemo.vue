<template>
  <div class="form-demo">
    <group :title="t('common form components')">
      <x-form ref="formRef" :model="formData">
        <x-form-field prop="aa" required :message="t('Input is required')">
          <x-input
            :title="t('Input')"
            v-model="formData.aa"
            :placeholder="t('Press enter after input')"
            text-align="right"
          ></x-input>
        </x-form-field>
        <x-form-field prop="bb" required :message="t('Textarea is required')">
          <x-textarea
            :title="t('Textarea')"
            v-model="formData.bb"
            :max="200"
            autosize
          ></x-textarea>
        </x-form-field>
        <x-form-field
          prop="cc"
          required
          :rules="[
            {
              validator(_rules: any, value: any, cb: (msg?: string) => void) {
                if (value > 0) {
                  cb();
                } else {
                  cb(t('Number must > 0'));
                }
              },
            },
          ]"
        >
          <x-number :title="t('Number')" v-model="formData.cc"></x-number>
        </x-form-field>
        <x-form-field prop="ff" required :message="t('Datetime is required')">
          <datetime :title="t('Datetime')" v-model="formData.ff"></datetime>
        </x-form-field>
        <x-form-field prop="dd" required :message="t('PopupRadio is required')">
          <popup-radio
            :title="t('PopupRadio')"
            v-model="formData.dd"
            :options="options"
          ></popup-radio>
        </x-form-field>
        <x-form-field
          prop="ee"
          required
          :message="t('PopupPicker is required')"
          :rules="pickerRules"
        >
          <popup-picker
            :title="t('PopupPicker')"
            v-model="formData.ee"
            :data="pickerOptions"
          ></popup-picker>
        </x-form-field>
        <div class="btn-group">
          <x-button type="primary" action-type="button" @click="submit">{{
            t("Submit")
          }}</x-button>
          <x-button type="primary" action-type="button" @click="reset">{{
            t("Reset")
          }}</x-button>
          <x-button
            type="primary"
            action-type="button"
            @click="clearValidate"
            >{{ t("clearValidate") }}</x-button
          >
        </div>
      </x-form>
    </group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { XForm, XFormField, useLocale } from "wiux";
import {
  XButton,
  Group,
  XInput,
  XTextarea,
  XNumber,
  Datetime,
  PopupRadio,
  PopupPicker,
  useToast,
} from "wiux";

export default defineComponent({
  name: "XFormDemo",
  components: {
    XForm,
    XFormField,
    XButton,
    Group,
    XInput,
    XTextarea,
    XNumber,
    Datetime,
    PopupRadio,
    PopupPicker,
  },
  setup() {
    const { t } = useLocale();
    const toast = useToast();
    const formRef = ref<any>(null);

    const formData = ref({
      aa: "",
      bb: "Talk is cheap, show me the code. \nTalk is cheap, show me the code. \nTalk is cheap, show me the code. \nTalk is cheap, show me the code. \nTalk is cheap, show me the code. \nTalk is cheap, show me the code. \nTalk is cheap, show me the code. \n",
      cc: 0,
      dd: "",
      ee: ["NBA"],
      ff: "",
    });

    const options = ["A", "B", "C"];
    const pickerOptions = [["NBA", "NFL", "MLB"]];
    const pickerRules = [
      {
        transform(value: any) {
          if (Array.isArray(value)) {
            return value[0];
          }
          return value;
        },
      },
    ];

    function submit() {
      if (formRef.value) {
        formRef.value.validate((valid: boolean, field: Record<string, any>) => {
          if (!valid) {
            console.log(field);
            const errors = Object.values(field).find(
              (arr: any) => Array.isArray(arr) && arr.length > 0,
            );
            const msg = errors?.[0]?.message || t("Validation failed");
            toast.show(msg);
          } else {
            toast.show(t("submit handler: valid success"));
            console.log(
              "formData:",
              JSON.parse(JSON.stringify(formData.value)),
            );
          }
        });
      }
    }

    function reset() {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    }

    function clearValidate() {
      if (formRef.value) {
        formRef.value.clearValidate();
      }
    }

    return {
      t,
      formRef,
      formData,
      options,
      pickerOptions,
      pickerRules,
      submit,
      reset,
      clearValidate,
    };
  },
});
</script>

<style lang="less">
.form-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .btn-group {
    padding: 10px 20px;
  }
}
</style>