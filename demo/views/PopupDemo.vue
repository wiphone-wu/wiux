<template>
  <div>
    <group>
      <x-switch :title="t('Default popup')" v-model="show"></x-switch>
      <x-switch :title="t('Full popup')" v-model="show1"></x-switch>
      <x-switch :title="t('Multi popup (first)')" v-model="show3"></x-switch>
      <x-switch :title="t('Mask disable')" v-model="show5"></x-switch>
      <x-switch :title="t('Popup address')" v-model="show6"></x-switch>
      <x-switch
        :title="t('default max-height=100%')"
        v-model="show12"
      ></x-switch>
      <x-switch :title="t('set max-height=50%')" v-model="show13"></x-switch>
    </group>

    <group>
      <x-switch
        :title="t('do not force rerender on open')"
        v-model="show15"
      ></x-switch>
      <x-switch
        :title="t('force rerender on open')"
        v-model="show14"
      ></x-switch>
    </group>

    <group>
      <x-switch
        :title="t('scroll top on show')"
        :inline-desc="t('default scrollable div')"
        v-model="show17"
      ></x-switch>
      <x-switch
        :title="t('scroll top on show')"
        :inline-desc="t('custom scrollable div')"
        v-model="show16"
      ></x-switch>
    </group>

    <popup v-model="show" @on-hide="log('hide')" @on-show="log('show')">
      <div class="popup0">
        <group>
          <x-switch :title="t('Another XSwitcher')" v-model="show"></x-switch>
          <x-switch :title="t('Show Toast')" v-model="showToast"></x-switch>
        </group>
      </div>
    </popup>

    <toast v-model="showToast">{{ t("You did it!") }}</toast>

    <popup v-model="show1" height="100%">
      <div class="popup1">
        <group>
          <x-switch :title="t('Another XSwitcher')" v-model="show1"></x-switch>
        </group>
      </div>
    </popup>

    <popup v-model="show3">
      <div class="popup2">
        <group>
          <x-switch
            :title="t('Multi popup (first)')"
            v-model="show3"
          ></x-switch>
          <x-switch
            :title="t('Multi popup (second)')"
            v-model="show4"
          ></x-switch>
        </group>
        {{ t("This is the first popup") }}
      </div>
    </popup>

    <popup v-model="show4">
      <div class="popup2">
        <group>
          <x-switch
            :title="t('Multi popup (second)')"
            v-model="show4"
          ></x-switch>
        </group>
        {{ t("This is the second popup") }}
      </div>
    </popup>

    <popup v-model="show5" :hide-on-blur="false">
      <div class="popup2">
        <group>
          <x-switch :title="t('Mask disable')" v-model="show5"></x-switch>
        </group>
        {{ t("The mask cannot be clicked!") }}
      </div>
    </popup>

    <popup v-model="show6">
      <div class="popup1">
        <group>
          <x-switch :title="t('Popup address')" v-model="show6"></x-switch>
        </group>
        <group>
          <x-address
            :title="title6"
            v-model="value6"
            :list="addressData"
            :placeholder="t('Select address')"
            :inline-desc="t('Can set placeholder')"
            :popup-style="{ zIndex: 502 }"
          />
        </group>
      </div>
    </popup>

    <group>
      <x-switch :title="t('Transparent background')" v-model="show7"></x-switch>
    </group>

    <popup v-model="show7" height="270px" :is-transparent="true">
      <div
        style="
          width: 95%;
          background-color: #fff;
          height: 250px;
          margin: 0 auto;
          border-radius: 5px;
          padding-top: 10px;
        "
      >
        <group>
          <cell :title="t('Product')" value="Donate"></cell>
          <cell :title="t('Total')" value="$10.24"></cell>
        </group>
        <div style="padding: 20px 15px">
          <x-button type="primary">{{ t("Pay") }}</x-button>
          <x-button @click="show7 = false">{{ t("Cancel") }}</x-button>
        </div>
      </div>
    </popup>

    <group :title="t('Set position')">
      <x-switch :title="t('left (100% width)')" v-model="show8"></x-switch>
      <x-switch :title="t('right')" v-model="show9"></x-switch>
      <x-switch :title="t('top (no mask)')" v-model="show10"></x-switch>
      <x-switch :title="t('bottom')" v-model="show11"></x-switch>
    </group>

    <popup v-model="show8" position="left" width="100%">
      <div class="position-horizontal-demo">
        <span class="wiux-close" @click="show8 = false"></span>
      </div>
    </popup>

    <popup v-model="show9" position="right">
      <div style="width: 200px"></div>
    </popup>

    <popup v-model="show10" position="top" :show-mask="false">
      <div class="position-vertical-demo">
        {{ t("I'm on top. Hide in 1s.") }}
      </div>
    </popup>

    <popup v-model="show11" position="bottom">
      <div class="position-vertical-demo">
        {{ t("I'm on bottom.") }}
      </div>
    </popup>

    <popup v-model="show12" position="bottom">
      <group>
        <cell v-for="i in 20" :key="i" :title="String(i)"></cell>
      </group>
      <div style="padding: 15px">
        <x-button @click="show12 = false" plain type="primary">{{
          t("Close me")
        }}</x-button>
      </div>
    </popup>

    <popup v-model="show17" position="bottom" :should-scroll-top-on-show="true">
      <group>
        <cell v-for="i in 20" :key="i" :title="String(i)"></cell>
      </group>
      <div style="padding: 15px">
        <x-button @click="show17 = false" plain type="primary">{{
          t("Close me")
        }}</x-button>
      </div>
    </popup>

    <popup v-model="show14" position="bottom" :should-rerender-on-show="true">
      <toggle-text @click="show14 = false" />
    </popup>

    <popup v-model="show15" position="bottom">
      <toggle-text @click="show15 = false" />
    </popup>

    <popup v-model="show16" position="bottom" :should-scroll-top-on-show="true">
      <toggle-text @click="show16 = false" scrollable class="wiux-scrollable" />
    </popup>

    <popup v-model="show13" position="bottom" max-height="50%">
      <group>
        <cell v-for="i in 20" :key="i" :title="String(i)"></cell>
      </group>
      <div style="padding: 15px">
        <x-button @click="show13 = false" plain type="primary">{{
          t("Close me")
        }}</x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from "vue";
import {
  Group,
  Cell,
  XButton,
  XSwitch,
  Toast,
  Popup,
  XAddress,
  useLocale,
} from "wiux";
import addressData from "../../src/data/china_address_v4.json";
import ToggleText from "./ToggleText.vue";

export default defineComponent({
  components: {
    Group,
    Cell,
    XButton,
    XSwitch,
    Toast,
    Popup,
    XAddress,
    ToggleText,
  },
  setup() {
    const { t } = useLocale();
    const show = ref(false);
    const show1 = ref(false);
    const show3 = ref(false);
    const show4 = ref(false);
    const show5 = ref(false);
    const show6 = ref(false);
    const value6 = ref([]);
    const title6 = computed(() => t("Select address"));
    const show7 = ref(false);
    const showToast = ref(false);
    const show8 = ref(false);
    const show9 = ref(false);
    const show10 = ref(false);
    const show11 = ref(false);
    const show12 = ref(false);
    const show13 = ref(false);
    const show14 = ref(false);
    const show15 = ref(false);
    const show16 = ref(false);
    const show17 = ref(false);

    const log = (str) => {
      console.log(str);
    };

    watch(show10, (val) => {
      if (val) {
        setTimeout(() => {
          show10.value = false;
        }, 1000);
      }
    });

    watch(show, (val) => {
      console.log("[PopupDemo] show changed:", val);
    });

    return {
      t,
      show,
      show1,
      show3,
      show4,
      show5,
      show6,
      value6,
      title6,
      addressData,
      show7,
      showToast,
      show8,
      show9,
      show10,
      show11,
      show12,
      show13,
      show14,
      show15,
      show16,
      show17,
      log,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../../src/styles/close.less";

.popup0 {
  padding-bottom: 15px;
  height: 200px;
}
.popup1 {
  width: 100%;
  height: 100%;
}
.popup2 {
  padding-bottom: 15px;
  height: 400px;
}
.position-vertical-demo {
  background-color: #ffe26d;
  color: #000;
  text-align: center;
  padding: 15px;
}
.position-horizontal-demo {
  position: relative;
  height: 100%;
}
.position-horizontal-demo .wiux-close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(4);
  color: #000;
}
</style>
