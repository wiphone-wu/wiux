<template>
  <div class="timeline-demo">
    <Timeline>
      <TimelineItem>
        <h4 class="recent">{{ t("【Guangdong】 Guangzhou has been sent") }}</h4>
        <p class="recent">2016-04-17 12:00:00</p>
      </TimelineItem>
      <TimelineItem>
        <h4>{{ t("STO courier Guangzhou xxx has picked up") }}</h4>
        <p>2016-04-16 10:23:00</p>
      </TimelineItem>
      <TimelineItem>
        <h4>{{ t("Merchant is notifying courier for pickup") }}</h4>
        <p>2016-04-15 9:00:00</p>
      </TimelineItem>
    </Timeline>
    <Timeline>
      <TimelineItem v-for="(i, index) in count" :key="index">
        <h4 :class="[i === 0 ? 'recent' : '']">
          {{ t("Timeline Node ") + (i + 1) }}
        </h4>
        <p :class="[i === 0 ? 'recent' : '']">{{ t("index ") + (i + 1) }}</p>
      </TimelineItem>
    </Timeline>
    <XButton type="primary" @click="count = 6">{{
      t("Set to 6 nodes")
    }}</XButton>
    <XButton type="primary" @click="count = 3">{{
      t("Set to 3 nodes")
    }}</XButton>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Timeline, TimelineItem, XButton, useLocale } from "wiux";

export default {
  components: {
    Timeline,
    TimelineItem,
    XButton,
  },
  setup() {
    const { t } = useLocale();
    const count = ref(3);

    return {
      t,
      count,
    };
  },
};
</script>

<style lang="less">
.timeline-demo {
  p {
    color: #888;
    font-size: 0.8rem;
  }
  h4 {
    color: #666;
    font-weight: normal;
  }
  .recent {
    color: rgb(4, 190, 2);
  }
}
</style>
