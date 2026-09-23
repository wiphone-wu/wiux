<template>
  <div class="weui-panel weui-panel_access">
    <div
      class="weui-panel__hd"
      v-if="header || $slots.header"
      @click="onClickHeader"
    >
      <slot name="header">
        <span v-html="header"></span>
      </slot>
    </div>
    <div class="weui-panel__bd">
      <slot name="body">
        <template v-if="type === '1'">
          <a
            :href="getUrl(item.url)"
            v-for="(item, index) in list"
            :key="index"
            @click.prevent="onItemClick(item)"
            class="weui-media-box weui-media-box_appmsg"
          >
            <div class="weui-media-box__hd" v-if="item.src">
              <img
                class="weui-media-box__thumb"
                :src="item.src"
                @error="onImgError(item, $event)"
                alt=""
              />
            </div>
            <div class="weui-media-box__bd">
              <h4 class="weui-media-box__title" v-html="item.title"></h4>
              <p class="weui-media-box__desc" v-html="item.desc"></p>
            </div>
          </a>
        </template>
        <template v-if="type === '2'">
          <div
            class="weui-media-box weui-media-box_text"
            v-for="(item, index) in list"
            :key="index"
            @click.prevent="onItemClick(item)"
          >
            <h4 class="weui-media-box__title" v-html="item.title"></h4>
            <p class="weui-media-box__desc" v-html="item.desc"></p>
          </div>
        </template>
        <template v-if="type === '3'">
          <div class="weui-media-box weui-media-box_small-appmsg">
            <div class="weui-cells">
              <a
                class="weui-cell weui-cell_access"
                :href="getUrl(item.url)"
                v-for="(item, index) in list"
                :key="index"
                @click.prevent="onItemClick(item)"
              >
                <div class="weui-cell__hd">
                  <img
                    :src="item.src"
                    alt=""
                    @error="onImgError(item, $event)"
                    style="width: 20px; margin-right: 5px; display: block"
                  />
                </div>
                <div class="weui-cell__bd">
                  <p v-html="item.title"></p>
                </div>
                <span class="weui-cell__ft"></span>
              </a>
            </div>
          </div>
        </template>
        <template v-if="type === '4'">
          <div
            class="weui-media-box weui-media-box_text"
            v-for="(item, index) in list"
            :key="index"
            @click.prevent="onItemClick(item)"
          >
            <h4 class="weui-media-box__title" v-html="item.title"></h4>
            <p class="weui-media-box__desc" v-html="item.desc"></p>
            <ul class="weui-media-box__info" v-if="item.meta">
              <li
                class="weui-media-box__info__meta"
                v-html="item.meta.source"
              ></li>
              <li
                class="weui-media-box__info__meta"
                v-html="item.meta.date"
              ></li>
              <li
                class="weui-media-box__info__meta weui-media-box__info__meta_extra"
                v-html="item.meta.other"
              ></li>
            </ul>
          </div>
        </template>
        <template v-if="type === '5'">
          <div
            class="weui-media-box weui-media-box_text"
            v-for="(item, index) in list"
            :key="index"
            @click.prevent="onItemClick(item)"
          >
            <div class="weui-media-box_appmsg">
              <div class="weui-media-box__hd" v-if="item.src">
                <img
                  class="weui-media-box__thumb"
                  @error="onImgError(item, $event)"
                  :src="item.src"
                  alt=""
                />
              </div>
              <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title" v-html="item.title"></h4>
                <p class="weui-media-box__desc" v-html="item.desc"></p>
              </div>
            </div>
            <ul class="weui-media-box__info" v-if="item.meta">
              <li
                class="weui-media-box__info__meta"
                v-html="item.meta.source"
              ></li>
              <li
                class="weui-media-box__info__meta"
                v-html="item.meta.date"
              ></li>
              <li
                class="weui-media-box__info__meta weui-media-box__info__meta_extra"
                v-html="item.meta.other"
              ></li>
            </ul>
          </div>
        </template>
      </slot>
    </div>
    <div class="weui-panel__ft">
      <a
        class="weui-cell weui-cell_access weui-cell_link"
        :href="getUrl(footer && footer.url)"
        v-if="footer && footer.title && type !== '3'"
        @click.prevent="onClickFooter"
      >
        <div class="weui-cell__bd" v-html="footer.title"></div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, getCurrentInstance } from "vue";
import { go, getUrl } from "../../libs/router";

interface PanelFooter {
  url?: string;
  title?: string;
}

interface PanelMeta {
  source?: string;
  date?: string;
  other?: string;
}

interface PanelItem {
  title?: string;
  desc?: string;
  src?: string;
  url?: string | Record<string, unknown>;
  fallbackSrc?: string;
  meta?: PanelMeta;
}

export default defineComponent({
  name: "Panel",
  props: {
    header: {
      type: String,
    },
    footer: {
      type: Object as PropType<PanelFooter>,
    },
    list: {
      type: Array as PropType<PanelItem[]>,
    },
    type: {
      type: String,
      default: "1",
    },
  },
  emits: [
    "on-click-header",
    "on-click-item",
    "on-click-footer",
    "on-img-error",
  ],
  setup(props, { emit }) {
    const instance = getCurrentInstance();

    function onImgError(item: PanelItem, $event: Event) {
      emit("on-img-error", JSON.parse(JSON.stringify(item)), $event);
      if (item.fallbackSrc) {
        ($event.target as HTMLImageElement).src = item.fallbackSrc;
      }
    }

    function getUrlFn(url: string | Record<string, unknown> | undefined) {
      return getUrl(url, (instance?.proxy as any)?.$router);
    }

    function onClickFooter() {
      emit("on-click-footer");
      if (props.footer && props.footer.url) {
        go(props.footer.url, (instance?.proxy as any)?.$router);
      }
    }

    function onClickHeader() {
      emit("on-click-header");
    }

    function onItemClick(item: PanelItem) {
      emit("on-click-item", item);
      if (item.url) {
        go(item.url, (instance?.proxy as any)?.$router);
      }
    }

    return {
      onImgError,
      getUrl: getUrlFn,
      onClickFooter,
      onClickHeader,
      onItemClick,
    };
  },
});
</script>

<style lang="less"></style>
