<template>
  <div class="wiux-uploader">
    <div class="wiux-uploader_hd">
      <p class="wiux-uploader_title">{{ computedTitle }}</p>
      <div class="wiux-uploader_info">{{ fileList.length }} / {{ limit }}</div>
    </div>
    <div class="wiux-uploader_bd">
      <ul class="wiux-uploader_files">
        <li
          :class="{
            'wiux-uploader_file': true,
            'wiux-uploader_file-status':
              !!item.fetchStatus && item.fetchStatus !== 'success',
          }"
          v-for="(item, index) in fileList"
          :key="item.url"
          :style="{
            backgroundImage: `url(${item.url})`,
          }"
          @click="handleFileClick($event, item, index)"
        >
          <span
            v-if="!readonly"
            class="wiux-uploader_file-del"
            @click.stop="handleThumbDelete($event, index)"
          ></span>
          <div
            v-if="!!item.fetchStatus && item.fetchStatus !== 'success'"
            class="wiux-uploader_file-content"
          >
            {{ item.fetchStatus === "progress" ? item.progress + "%" : "" }}
            <i v-if="item.fetchStatus === 'fail'" class="upload-error"></i>
          </div>
        </li>
      </ul>
      <div
        class="wiux-uploader_input-box"
        v-show="fileList.length < Number(limit) && !readonly"
      >
        <input
          class="wiux-uploader_input"
          ref="inputRef"
          type="file"
          name="uploadInput"
          accept="image/*"
          :capture="(capture as boolean | 'user' | 'environment')"
          :multiple="(multiple as any)"
          @change="change"
        />
      </div>
    </div>
    <Previewer ref="previewerRef" :list="filteredList">
      <template #wrap-after>
        <div class="wiux-uploader_del" v-if="!readonly" @click="deleteImg"></div>
      </template>
    </Previewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useToast } from "../../plugins/toast";
import { useLocale } from "../../composables/useLocale";
import Previewer from "../previewer/index.vue";
import { handleFile } from "./utils";

const toast = useToast();

const URLCompat =
  (window as any).URL && (window as any).URL.createObjectURL
    ? (window as any).URL
    : (window as any).webkitURL && (window as any).webkitURL.createObjectURL
      ? (window as any).webkitURL
      : null;

interface FileItem {
  url: string;
  blob?: Blob;
  fetchStatus?: string;
  progress?: number;
  [key: string]: any;
}

export default defineComponent({
  name: "Uploader",
  components: {
    Previewer,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    files: {
      type: Array as () => FileItem[],
      default: () => [],
    },
    limit: {
      type: [Number, String],
      default: 5,
    },
    limitPrompt: {
      type: Function,
      default: undefined,
    },
    capture: {
      type: [Boolean, String],
      default: false,
    },
    enableCompress: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      type: [String, Number],
      default: 1024,
    },
    quality: {
      type: [String, Number],
      default: 0.92,
    },
    url: {
      type: String,
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
    withCredentials: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
    },
    name: {
      type: String,
      default: "file",
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: [String, Boolean],
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:files",
    "on-fileList-change",
    "before-upload",
    "after-upload",
    "on-change",
    "on-cancel",
    "on-success",
    "on-error",
    "on-delete",
  ],
  setup(props, { emit }) {
    const { t } = useLocale();
    const fileList = ref<FileItem[]>([...props.files]);
    const previewerRef = ref<any>(null);
    const inputRef = ref<HTMLInputElement | null>(null);

    const computedTitle = computed(() => {
      return props.title || t("Uploader.title", "图片上传");
    });

    const computedLimitPrompt = computed(() => {
      return (
        props.limitPrompt ||
        ((limit: number) => {
          return t("Uploader.limitPrompt", "不能上传超过{limit}张图片").replace(
            "{limit}",
            String(limit),
          );
        })
      );
    });

    const filteredList = computed(() => {
      return fileList.value.map((item) => {
        const { url } = item;
        return {
          src: url,
          msrc: url,
          w: 0,
          h: 0,
        };
      });
    });

    watch(
      () => props.files,
      (files) => {
        const current = fileList.value;
        if (files === current) return;
        if (files.length === current.length) {
          let same = true;
          for (let i = 0; i < files.length; i++) {
            if (files[i] !== current[i]) {
              same = false;
              break;
            }
          }
          if (same) return;
        }
        fileList.value = [...files];
      },
      { deep: true },
    );

    watch(
      fileList,
      (newFileList) => {
        emit("update:files", newFileList);
        emit("on-fileList-change", newFileList);
      },
      { deep: true },
    );

    function uploadFile(blob: Blob, fileItem: FileItem): Promise<any> {
      return new Promise((resolve, reject) => {
        const { url, params, name, headers, withCredentials } = props;
        fileItem.fetchStatus = "progress";
        fileItem.progress = 0;
        const formData = new FormData();
        const xhr = new XMLHttpRequest();
        formData.append(name, blob);
        if (params) {
          for (const key in params) {
            formData.append(key, params[key]);
          }
        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const result = JSON.parse(xhr.responseText);
              emit("on-success", result, fileItem);
              fileItem.fetchStatus = "success";
              resolve(result);
            } else {
              emit("on-error", xhr);
              fileItem.fetchStatus = "fail";
              reject(xhr);
            }
          }
        };
        xhr.upload.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              const percent = Math.ceil((evt.loaded / evt.total) * 100);
              fileItem.progress = percent;
            }
          },
          false,
        );

        xhr.open("POST", url as string, true);

        for (const key in headers) {
          if (
            Object.prototype.hasOwnProperty.call(headers, key) &&
            headers[key] !== null
          ) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }

        if (withCredentials && "withCredentials" in xhr) {
          xhr.withCredentials = true;
        }

        xhr.send(formData);
      });
    }

    async function change(e: Event) {
      const { enableCompress, maxWidth, quality, limit, autoUpload } = props;
      const target = e.target as HTMLInputElement;
      const inputChangeFiles = target.files;
      if (inputChangeFiles && inputChangeFiles.length > 0) {
        if (fileList.value.length + inputChangeFiles.length > Number(limit)) {
          toast.text(computedLimitPrompt.value(Number(limit)));
          return;
        }
        Promise.all(
          Array.prototype.map.call(inputChangeFiles, (file: File) => {
            const doSquash = file.type === "image/jpeg";
            return handleFile(
              file,
              {
                maxWidth: Number(maxWidth),
                quality: Number(quality),
                enableCompress,
              },
              doSquash,
            ).then((blob) => {
              const blobURL = URLCompat.createObjectURL(blob);
              const fileItem: FileItem = {
                url: blobURL,
                blob,
              };
              for (const key in file) {
                if (["slice", "webkitRelativePath"].indexOf(key) === -1) {
                  (fileItem as any)[key] = (file as any)[key];
                }
              }
              if (autoUpload) {
                emit("before-upload");
                uploadFile(blob, fileItem)
                  .then(() => {
                    const successAction = () => {
                      fileList.value.push(fileItem);
                      emit("on-change", fileItem, fileList.value);
                    };
                    emit("after-upload", successAction);
                  })
                  .catch(() => {
                    const errorAction = () => fileList.value.push(fileItem);
                    emit("after-upload", errorAction);
                  });
              } else {
                fileList.value.push(fileItem);
                emit("on-change", fileItem, fileList.value);
              }
            });
          }),
        ).then(() => {
          if (inputRef.value) {
            inputRef.value.value = "";
          }
        });
      } else {
        emit("on-cancel");
      }
    }

    function handleFileClick(e: Event, item: FileItem, index: number) {
      if (previewerRef.value) {
        previewerRef.value.show(index);
      }
    }

    function handleThumbDelete(e: Event, index: number) {
      e.stopPropagation();
      const delAction = () => {
        const deleteItem = fileList.value[index];
        fileList.value.splice(index, 1);
        setTimeout(() => {
          emit("on-change", deleteItem, fileList.value);
        }, 0);
      };
      emit("on-delete", fileList.value[index], delAction);
    }

    function deleteImg() {
      if (!previewerRef.value) return;
      const index = previewerRef.value.getCurrentIndex();
      const delAction = () => {
        const deleteItem = fileList.value[index];
        fileList.value.splice(index, 1);
        setTimeout(() => {
          emit("on-change", deleteItem, fileList.value);
          if (previewerRef.value) {
            previewerRef.value.close();
          }
        }, 0);
      };
      emit("on-delete", fileList.value[index], delAction);
    }

    return {
      fileList,
      previewerRef,
      inputRef,
      filteredList,
      computedTitle,
      change,
      handleFileClick,
      handleThumbDelete,
      deleteImg,
    };
  },
});
</script>

<style lang="less">
@font-face {
  font-weight: normal;
  font-style: normal;
  font-family: "weui";
  src: url("data:application/octet-stream;base64,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")
    format("truetype");
}

.wiux-uploader {
  position: relative;
  background-color: #fff;
  padding: 10px 15px;
  font-size: 17px;
  overflow: hidden;
  .wiux-uploader_hd {
    display: flex;
    padding-bottom: 10px;
    .wiux-uploader_title {
      flex: 1;
    }
    .wiux-uploader_info {
      color: #b2b2b2;
    }
  }
  .wiux-uploader_bd {
    overflow: hidden;
    margin-left: -9px;
    .wiux-uploader_files {
      list-style: none;
      .wiux-uploader_file {
        float: left;
        margin-left: 9px;
        margin-bottom: 9px;
        width: 79px;
        height: 79px;
        background: no-repeat center center;
        background-size: cover;
        position: relative;
      }
      .wiux-uploader_file-del {
        position: absolute;
        top: 1px;
        right: 1px;
        width: 18px;
        height: 18px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        z-index: 1;
        &:before,
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 2px;
          background: #fff;
          border-radius: 1px;
        }
        &:before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        &:after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
      .wiux-uploader_file-status {
        position: relative;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.4);
        }
      }
      .wiux-uploader_file-content {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        color: #fff;
        .upload-error {
          display: inline-block;
          font-size: 23px;
          color: #f43530;
          font-family: "weui";
          font-style: normal;
          &:before {
            content: "\EA0B";
          }
        }
      }
    }
    .wiux-uploader_input-box {
      float: left;
      position: relative;
      margin-left: 9px;
      margin-bottom: 9px;
      width: 77px;
      height: 77px;
      border: 1px solid #d9d9d9;
      &:before,
      &:after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: #d9d9d9;
      }
      &:before {
        width: 2px;
        height: 39.5px;
      }
      &:after {
        width: 39.5px;
        height: 2px;
      }
      .wiux-uploader_input {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
  }
  .wiux-uploader_del {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #0d0d0d;
    color: #ffffff;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-family: "weui";
    &:after {
      color: #ffffff;
      font-size: 22px;
      content: "\EA11";
    }
  }
}
</style>