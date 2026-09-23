<template>
  <div>
    <divider>{{ t("Horizontal") }}</divider>
    <FlexBox>
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox>
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">3</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox>
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">3</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">4</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox>
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">3</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">4</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">5</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox>
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">3</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">4</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">5</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">6</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("Horizontal with no gutter") }}</divider>
    <FlexBox :gutter="0">
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">3</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">4</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("Vertical") }}</divider>
    <FlexBox orient="vertical">
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("Vertical with no gutter") }}</divider>
    <FlexBox orient="vertical" :gutter="0">
      <FlexBoxItem><div class="flex-demo">1</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("Grid support (12 columns)") }}</divider>
    <FlexBox>
      <FlexBoxItem :span="4"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">2/3</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox>
      <FlexBoxItem :span="6"><div class="flex-demo">6/12</div></FlexBoxItem>
      <FlexBoxItem :span="2"><div class="flex-demo">2/12</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">rest</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("Flexible grid") }}</divider>
    <FlexBox>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 6"><div class="flex-demo">1/6</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 8"><div class="flex-demo">1/8</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 8"><div class="flex-demo">1/8</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">rest</div></FlexBoxItem>
    </FlexBox>
    <br />
    <FlexBox :gutter="0">
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 6"><div class="flex-demo">1/6</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 8"><div class="flex-demo">1/8</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 8"><div class="flex-demo">1/8</div></FlexBoxItem>
      <FlexBoxItem><div class="flex-demo">rest</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("order prop:") }} order</divider>
    <FlexBox :gutter="0">
      <FlexBoxItem :span="1 / 3" :order="4"
        ><div class="flex-demo">1</div></FlexBoxItem
      >
      <FlexBoxItem :span="1 / 6" :order="3"
        ><div class="flex-demo">2</div></FlexBoxItem
      >
      <FlexBoxItem :span="1 / 8" :order="2"
        ><div class="flex-demo">3</div></FlexBoxItem
      >
      <FlexBoxItem :span="1 / 8" :order="1"
        ><div class="flex-demo">4</div></FlexBoxItem
      >
      <FlexBoxItem :order="-99"><div class="flex-demo">5</div></FlexBoxItem>
    </FlexBox>
    <br />

    <divider>{{ t("wrap prop:") }} wrap</divider>
    <FlexBox :gutter="0" wrap="wrap">
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
      <FlexBoxItem :span="1 / 3"><div class="flex-demo">1/3</div></FlexBoxItem>
    </FlexBox>
  </div>
</template>

<script lang="ts">
import { Divider, FlexBox, FlexBoxItem, useLocale } from "wiux";

export default {
  name: "FlexBoxDemo",
  components: {
    Divider,
    FlexBox,
    FlexBoxItem,
  },
  setup() {
    const { t } = useLocale();
    return { t };
  },
};
</script>

<style lang="less">
.flex-demo {
  text-align: center;
  color: #fff;
  background-color: #20b907;
  border-radius: 4px;
  background-clip: padding-box;
}
</style>
