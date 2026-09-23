<template>
  <div style="padding: 15px 0">
    <divider>{{ $t("Auto upload") }}</divider>
    <uploader
      v-model:files="fileList"
      url="http://localhost:9090/upload"
      name="upload"
      :title="$t('Auto upload')"
      :params="{
        token: '13579',
        linkId: '2323',
        modelName: 'modelName',
      }"
      :headers="{
        'custom-header': 'custom-info',
      }"
      :limit="6"
      :limitPrompt="(limit: number) => `已经上传${limit}张图片嘞！`"
      :withCredentials="true"
      @before-upload="beforeUpload"
      @after-upload="afterUpload"
      @on-change="onChange"
      @on-cancel="onCancel"
      @on-success="onSuccess"
      @on-error="onError"
      @on-delete="onDelete"
    />

    <divider>{{ $t("Manual upload") }}</divider>
    <uploader
      :title="$t('Manual upload')"
      :autoUpload="false"
      v-model:files="fileList2"
      @on-delete="onDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Uploader, Divider, useToast, useLocale } from "wiux";

export default defineComponent({
  name: "UploaderDemo",
  components: {
    Uploader,
    Divider,
  },
  setup() {
    const { t } = useLocale();
    const toast = useToast();

    const fileList = ref([
      {
        url: "../../assets/cat1.jpg",
      },
    ]);
    const fileList2 = ref<any[]>([]);

    function beforeUpload() {
      console.log("before upload");
      toast.text(t("Loading"));
    }

    function afterUpload(action: () => void) {
      setTimeout(() => {
        action && action();
      }, 1000);
    }

    function onChange(fileItem: any, fileListVal: any[]) {
      console.log("on-change: ", fileItem, fileListVal);
    }

    function onCancel() {
      console.log("on-cancel: Success");
    }

    function onSuccess(res: any, fileItem: any) {
      console.log("on-success: ", res);
      fileItem.fileid = res.data;
    }

    function onError(res: any) {
      console.log("on-error: ", res);
    }

    function onDelete(deleteItem: any, cb: () => void) {
      console.log("on-delete: ", deleteItem);
      toast.text(t("Delete success"));
      cb && cb();
    }

    return {
      fileList,
      fileList2,
      beforeUpload,
      afterUpload,
      onChange,
      onCancel,
      onSuccess,
      onError,
      onDelete,
    };
  },
});
</script>
