<template>
  <div
    class="wiux-form-field"
    :class="{
      'is-required': isRequired,
      'is-success': validateState === 'success',
      'is-error': validateState === 'error',
    }"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import AsyncValidator from "async-validator";

interface FormContext {
  model: Record<string, any>;
  formFields: { value: any[] };
  formRef: { value: HTMLFormElement | null };
  addField: (field: any) => void;
  removeField: (field: any) => void;
}

export default defineComponent({
  name: "WiuxFormField",
  props: {
    prop: String,
    rules: [Object, Array],
    required: Boolean,
    message: String,
  },
  emits: ["on-change"],
  setup(props, { emit }) {
    const form = inject<FormContext>("form") as FormContext;

    const isRequired = computed(() => {
      const { rules, required } = props;
      if (rules && (rules as any[]).length) {
        const rulesRequired = (rules as any[]).every(
          (rule: any) => rule.required,
        );
        return rulesRequired || required;
      }
      return required;
    });

    const modelValue = computed(() => {
      return form.model[props.prop as string];
    });

    const fieldValue = ref(form.model[props.prop as string]);
    const validateState = ref("");
    const validateMessage = ref(props.message);
    const initialValue = ref<any>(undefined);

    watch(
      () => props.message,
      (val) => {
        validateMessage.value = val;
      },
    );

    watch(fieldValue, (val) => {
      validate();
      emit("on-change", val);
      form.model[props.prop as string] = val;
    });

    watch(modelValue, (val) => {
      fieldValue.value = val;
    });

    onMounted(() => {
      const val = fieldValue.value;
      if (Array.isArray(val)) {
        initialValue.value = [...val];
      } else {
        initialValue.value = val;
      }
    });

    function getRules() {
      const selfRules = props.rules || [];
      const requiredRule =
        isRequired.value !== undefined ? { required: !!isRequired.value } : [];
      if (props.message && isRequired.value) {
        (requiredRule as any).message = props.message;
      }
      return (selfRules as any[]).some((rule: any) => rule.required)
        ? [...(selfRules as any[])]
        : [...(selfRules as any[]), requiredRule];
    }

    function validate(
      cb?: (message: string | undefined, field: Record<string, any>) => void,
    ) {
      const rules = getRules();
      const descriptor: Record<string, any> = {};
      descriptor[props.prop as string] = rules;
      const validator = new AsyncValidator(descriptor);
      const model: Record<string, any> = {};
      model[props.prop as string] = fieldValue.value;
      validator.validate(
        model,
        { firstFields: true },
        (errors: any, invalidFields: any) => {
          validateState.value = errors ? "error" : "success";
          validateMessage.value = errors ? errors[0].message : "";
          if (cb) {
            cb(validateMessage.value, invalidFields);
          }
        },
      );
    }

    function clearValidate() {
      validateState.value = "";
      validateMessage.value = "";
    }

    function resetField() {
      const val = initialValue.value;
      if (Array.isArray(val)) {
        fieldValue.value = [...val];
      } else {
        fieldValue.value = val;
      }
      setTimeout(() => {
        clearValidate();
      }, 0);
    }

    const fieldInstance = {
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
    };

    form.addField(fieldInstance);

    onBeforeUnmount(() => {
      form.removeField(fieldInstance);
    });

    return {
      isRequired,
      validateState,
      validateMessage,
      fieldValue,
      validate,
      clearValidate,
      resetField,
    };
  },
});
</script>
<style lang="less">
.wiux-form-field {
  position: relative;
  &:after {
    position: absolute;
    top: 0;
    right: 0;
    height: 1px;
    color: #d9d9d9;
    border-top: 1px solid #d9d9d9;
    left: 15px;
    content: "";
    transform: scaleY(0.5);
    transform-origin: 0 0;
  }
  &.is-required {
    display: flex;
    align-items: flex-start;
    &::before {
      content: "*";
      display: inline-block;
      vertical-align: middle;
      padding-left: 15px;
      padding-top: 12px;
      color: red;
    }
    .weui-cell,
    .wiux-cell-box,
    .wiux-uploader {
      flex: 1;
    }
  }
  &.is-error {
    color: red;
    input::placeholder,
    textarea::placeholder {
      color: red;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: red;
    }
    input::-moz-placeholder,
    textarea::-moz-placeholder {
      color: red;
    }
    input:-ms-input-placeholder,
    textarea:-ms-input-placeholder {
      color: red;
    }
  }
}
</style>
