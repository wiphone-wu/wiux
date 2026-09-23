<template>
  <form ref="formRef" class="wiux-form">
    <slot></slot>
  </form>
</template>
<script lang="ts">
import { defineComponent, provide, ref } from "vue";

interface Field {
  prop: string;
  validate: (cb: (message: string, field: Record<string, any>) => void) => void;
  resetField: () => void;
  clearValidate: () => void;
}

export default defineComponent({
  name: "WiuxForm",
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const formRef = ref<HTMLFormElement | null>(null);
    const formFields = ref<Field[]>([]);

    function addField(field: Field) {
      formFields.value.push(field);
    }

    function removeField(field: Field) {
      if (field.prop) {
        const index = formFields.value.indexOf(field);
        if (index > -1) {
          formFields.value.splice(index, 1);
        }
      }
    }

    function resetFields() {
      if (!props.model) {
        console.warn(
          "[wiux-form warn]model is required for resetFields to work.",
        );
      }
      formFields.value.forEach((field) => {
        field.resetField();
      });
    }

    function clearValidate(propsArr: string | string[] = []) {
      const fields = propsArr.length
        ? typeof propsArr === "string"
          ? formFields.value.filter((field) => propsArr === field.prop)
          : formFields.value.filter(
              (field) => propsArr.indexOf(field.prop) > -1,
            )
        : formFields.value;
      fields.forEach((field) => {
        field.clearValidate();
      });
    }

    function validate(
      cb?: (valid: boolean, invalidFields: Record<string, any>) => void,
    ): Promise<boolean> | undefined {
      let promise: Promise<boolean> | undefined;
      let callback = cb;

      if (typeof cb !== "function" && typeof Promise !== "undefined") {
        promise = new Promise<boolean>((resolve, reject) => {
          callback = function (valid: boolean) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      let valid = true;
      let count = 0;
      let invalidFields: Record<string, any> = {};

      const fields = formFields.value;
      if (fields.length === 0) {
        if (typeof callback === "function") {
          callback(true, {});
        }
        return promise;
      }

      fields.forEach((field) => {
        field.validate((message: string, f: Record<string, any>) => {
          if (message) valid = false;
          invalidFields = Object.assign({}, invalidFields, f);
          if (typeof callback === "function" && ++count === fields.length) {
            callback(valid, invalidFields);
          }
        });
      });

      if (promise) {
        return promise;
      }
    }

    provide("form", {
      model: props.model,
      formFields,
      formRef,
      addField,
      removeField,
    });

    return {
      formRef,
      validate,
      resetFields,
      clearValidate,
    };
  },
});
</script>
