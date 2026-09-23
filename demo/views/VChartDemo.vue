<template>
  <div class="vChart-demo">
    <div class="demo-section">
      <h3>基本折线图</h3>
      <v-chart :data="lineData" :prevent-default="true">
        <v-scale :x="true" :tick-count="3" />
        <v-tooltip :show-item-marker="false" :show-x-value="true" />
        <v-line />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>基础面积图</h3>
      <v-chart :data="areaData">
        <v-scale :x="true" :tick-count="0" />
        <v-scale :y="true" :min="0" />
        <v-tooltip :show-crosshairs="true" :show-x-value="true" />
        <v-area />
        <v-line />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>基础柱状图</h3>
      <v-chart :data="barData">
        <v-bar />
        <v-tooltip :show-item-marker="false" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>饼图</h3>
      <v-chart :data="pieData">
        <v-scale :y="true" :options="pieYOptions" />
        <v-tooltip :disabled="true" />
        <v-pie :radius="0.85" series-field="name" />
        <v-legend :options="pieLegendOptions" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>散点图</h3>
      <v-chart :data="pointData">
        <v-scale :x="true" field="height" />
        <v-scale :y="true" field="weight" />
        <v-tooltip :disabled="true" />
        <v-point
          series-field="gender"
          :styles="{
            fillOpacity: 0.65,
          }"
        />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>折线图：显示点</h3>
      <v-chart :data="lineWithDotData">
        <v-scale :y="true" :min="0" />
        <v-point
          :styles="{
            stroke: '#fff',
            lineWidth: 1,
          }"
        />
        <v-tooltip :show-item-marker="false" :on-show="onShowTooltip" />
        <v-line />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>对比折线图</h3>
      <v-chart :data="lineColorData">
        <v-line series-field="type" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>渐变面积图</h3>
      <v-chart :data="areaGradientData">
        <v-scale :x="true" type="timeCat" :tick-count="3" />
        <v-scale :y="true" :min="0" />
        <v-area :colors="areaGradient" shape="smooth" />
        <v-line :colors="areaGradient" shape="smooth" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>层叠面积图</h3>
      <v-chart :data="areaStackData">
        <v-scale :x="true" field="date" type="timeCat" mask="MM-DD" />
        <v-scale :y="true" field="value" :tick-count="4" :max="300" />
        <v-tooltip :show-crosshairs="true" :show-value-in-legend="true" />
        <v-area series-field="city" shape="smooth" adjust="stack" />
        <v-line series-field="city" shape="smooth" adjust="stack" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>层叠柱状图</h3>
      <v-chart :data="barStackData">
        <v-scale :x="true" field="月份" />
        <v-scale :y="true" field="月均降雨量" />
        <v-bar series-field="name" adjust="stack" />
        <v-tooltip :show-value-in-legend="true" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>环形图</h3>
      <v-chart :data="annularData" :padding="[20, 'auto']">
        <v-tooltip :disabled="true" />
        <v-scale :y="true" :options="annularYOptions" />
        <v-pie
          :radius="0.85"
          :inner-radius="0.7"
          series-field="name"
          :colors="['#FE5D4D', '#3BA4FF', '#737DDE']"
        />
        <v-legend :options="annularLegendOptions" />
        <v-guide type="html" :options="annularHtmlOptions" />
      </v-chart>
    </div>

    <div class="demo-section">
      <h3>自定义渲染</h3>
      <v-chart :prevent-render="true" @on-render="renderCustomChart"></v-chart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  VArea,
  VBar,
  VChart,
  VGuide,
  VLegend,
  VLine,
  VPie,
  VPoint,
  VScale,
  VTooltip,
} from "../../src";

export default defineComponent({
  components: {
    VArea,
    VBar,
    VChart,
    VGuide,
    VLegend,
    VLine,
    VPie,
    VPoint,
    VScale,
    VTooltip,
  },
  data() {
    return {
      lineData: [
        { date: "2017-06-05", value: 116 },
        { date: "2017-06-06", value: 129 },
        { date: "2017-06-07", value: 135 },
        { date: "2017-06-08", value: 86 },
        { date: "2017-06-09", value: 73 },
        { date: "2017-06-10", value: 85 },
        { date: "2017-06-11", value: 73 },
        { date: "2017-06-12", value: 68 },
        { date: "2017-06-13", value: 92 },
        { date: "2017-06-14", value: 130 },
        { date: "2017-06-15", value: 245 },
        { date: "2017-06-16", value: 139 },
        { date: "2017-06-17", value: 115 },
        { date: "2017-06-18", value: 111 },
        { date: "2017-06-19", value: 309 },
        { date: "2017-06-20", value: 206 },
        { date: "2017-06-21", value: 137 },
        { date: "2017-06-22", value: 128 },
        { date: "2017-06-23", value: 85 },
        { date: "2017-06-24", value: 94 },
        { date: "2017-06-25", value: 71 },
        { date: "2017-06-26", value: 106 },
        { date: "2017-06-27", value: 84 },
        { date: "2017-06-28", value: 93 },
        { date: "2017-06-29", value: 85 },
        { date: "2017-06-30", value: 73 },
        { date: "2017-07-01", value: 83 },
        { date: "2017-07-02", value: 125 },
        { date: "2017-07-03", value: 107 },
        { date: "2017-07-04", value: 82 },
        { date: "2017-07-05", value: 44 },
        { date: "2017-07-06", value: 72 },
        { date: "2017-07-07", value: 106 },
        { date: "2017-07-08", value: 107 },
        { date: "2017-07-09", value: 66 },
        { date: "2017-07-10", value: 91 },
        { date: "2017-07-11", value: 92 },
        { date: "2017-07-12", value: 113 },
        { date: "2017-07-13", value: 107 },
        { date: "2017-07-14", value: 131 },
        { date: "2017-07-15", value: 111 },
        { date: "2017-07-16", value: 64 },
        { date: "2017-07-17", value: 69 },
        { date: "2017-07-18", value: 88 },
        { date: "2017-07-19", value: 77 },
        { date: "2017-07-20", value: 83 },
        { date: "2017-07-21", value: 111 },
        { date: "2017-07-22", value: 57 },
        { date: "2017-07-23", value: 55 },
        { date: "2017-07-24", value: 60 },
      ],
      areaData: [
        { time: "Jan.", tem: 1000 },
        { time: "Feb.", tem: 2200 },
        { time: "Mar.", tem: 2000 },
        { time: "Apr.", tem: 2600 },
        { time: "May.", tem: 2000 },
        { time: "Jun.", tem: 2600 },
        { time: "Jul.", tem: 2800 },
        { time: "Aug.", tem: 2000 },
      ],
      barData: [
        { year: "1951 年", sales: 38 },
        { year: "1952 年", sales: 52 },
        { year: "1956 年", sales: 61 },
        { year: "1957 年", sales: 145 },
        { year: "1958 年", sales: 48 },
        { year: "1959 年", sales: 38 },
        { year: "1960 年", sales: 38 },
        { year: "1962 年", sales: 38 },
      ],
      pieData: [
        { name: "芳华", percent: 0.4, a: "1" },
        { name: "妖猫传", percent: 0.2, a: "1" },
        { name: "机器之血", percent: 0.18, a: "1" },
        { name: "心理罪", percent: 0.15, a: "1" },
        { name: "寻梦环游记", percent: 0.05, a: "1" },
        { name: "其他", percent: 0.02, a: "1" },
      ],
      pieYOptions: {
        formatter(val: number) {
          return val * 100 + "%";
        },
      },
      pieLegendOptions: {
        position: "right",
        itemFormatter(val: string) {
          const map: Record<string, string> = {
            芳华: "40%",
            妖猫传: "20%",
            机器之血: "18%",
            心理罪: "15%",
            寻梦环游记: "5%",
            其他: "2%",
          };
          return val + "  " + map[val];
        },
      },
      pointData: [
        { gender: "female", height: 161.2, weight: 51.6 },
        { gender: "female", height: 167.5, weight: 59 },
        { gender: "female", height: 159.5, weight: 49.2 },
        { gender: "female", height: 157, weight: 63 },
        { gender: "female", height: 155.8, weight: 53.6 },
        { gender: "female", height: 170, weight: 59 },
        { gender: "female", height: 159.1, weight: 47.6 },
        { gender: "female", height: 166, weight: 69.8 },
        { gender: "female", height: 176.2, weight: 66.8 },
        { gender: "female", height: 160.2, weight: 75.2 },
        { gender: "male", height: 174, weight: 65.6 },
        { gender: "male", height: 175.3, weight: 71.8 },
        { gender: "male", height: 193.5, weight: 80.7 },
        { gender: "male", height: 186.5, weight: 72.6 },
        { gender: "male", height: 187.2, weight: 78.8 },
        { gender: "male", height: 181.5, weight: 74.8 },
        { gender: "male", height: 184, weight: 86.4 },
        { gender: "male", height: 184.5, weight: 78.4 },
        { gender: "male", height: 175, weight: 62 },
        { gender: "male", height: 184, weight: 81.6 },
      ],
      lineWithDotData: [
        { day: "周一", value: 300 },
        { day: "周二", value: 400 },
        { day: "周三", value: 350 },
        { day: "周四", value: 500 },
        { day: "周五", value: 490 },
        { day: "周六", value: 600 },
        { day: "周日", value: 900 },
      ],
      lineColorData: [
        { date: "2010-01-10", type: "能源", value: 99.9 },
        { date: "2010-01-10", type: "金属", value: 96.6 },
        { date: "2010-01-10", type: "农产品", value: 96.2 },
        { date: "2010-01-12", type: "能源", value: 96.3 },
        { date: "2010-01-12", type: "金属", value: 100.3 },
        { date: "2010-01-12", type: "农产品", value: 97.5 },
        { date: "2010-01-14", type: "能源", value: 97.2 },
        { date: "2010-01-14", type: "金属", value: 104.1 },
        { date: "2010-01-14", type: "农产品", value: 95.2 },
        { date: "2010-01-16", type: "能源", value: 97.5 },
        { date: "2010-01-16", type: "金属", value: 97.7 },
        { date: "2010-01-16", type: "农产品", value: 97.1 },
        { date: "2010-01-18", type: "能源", value: 92.9 },
        { date: "2010-01-18", type: "金属", value: 96.1 },
        { date: "2010-01-18", type: "农产品", value: 93.1 },
      ],
      areaGradient: [
        [0, "#FE6384"],
        [1, "#f7f7f7"],
      ],
      areaGradientData: [
        { time: "2016-08-08 00:00:00", tem: 10 },
        { time: "2016-08-08 00:10:00", tem: 22 },
        { time: "2016-08-08 00:30:00", tem: 16 },
        { time: "2016-08-09 00:35:00", tem: 26 },
        { time: "2016-08-09 01:00:00", tem: 12 },
        { time: "2016-08-09 01:20:00", tem: 26 },
        { time: "2016-08-10 01:40:00", tem: 18 },
        { time: "2016-08-10 02:00:00", tem: 26 },
        { time: "2016-08-10 02:20:00", tem: 12 },
      ],
      areaStackData: [
        { value: 63.4, city: "New York", date: "2011-10-01" },
        { value: 62.7, city: "Alaska", date: "2011-10-01" },
        { value: 72.2, city: "Austin", date: "2011-10-01" },
        { value: 58, city: "New York", date: "2011-10-02" },
        { value: 59.9, city: "Alaska", date: "2011-10-02" },
        { value: 67.7, city: "Austin", date: "2011-10-02" },
        { value: 53.3, city: "New York", date: "2011-10-03" },
        { value: 59.1, city: "Alaska", date: "2011-10-03" },
        { value: 69.4, city: "Austin", date: "2011-10-03" },
      ],
      barStackData: [
        { name: "London", 月份: "Jan.", 月均降雨量: 18.9 },
        { name: "London", 月份: "Feb.", 月均降雨量: 28.8 },
        { name: "London", 月份: "Mar.", 月均降雨量: 39.3 },
        { name: "London", 月份: "Apr.", 月均降雨量: 81.4 },
        { name: "London", 月份: "May.", 月均降雨量: 47 },
        { name: "Berlin", 月份: "Jan.", 月均降雨量: 12.4 },
        { name: "Berlin", 月份: "Feb.", 月均降雨量: 23.2 },
        { name: "Berlin", 月份: "Mar.", 月均降雨量: 34.5 },
        { name: "Berlin", 月份: "Apr.", 月均降雨量: 99.7 },
        { name: "Berlin", 月份: "May.", 月均降雨量: 52.6 },
      ],
      annularData: [
        { name: "股票类", percent: 83.59, a: "1" },
        { name: "债券类", percent: 2.17, a: "1" },
        { name: "现金类", percent: 14.24, a: "1" },
      ],
      annularYOptions: {
        formatter(val: number) {
          return val * 100 + "%";
        },
      },
      annularLegendOptions: {
        position: "right",
        itemFormatter(val: string) {
          const map: Record<string, string> = {
            股票类: "83.59%",
            债券类: "2.17%",
            现金类: "14.24%",
          };
          return val + "  " + map[val];
        },
      },
      annularHtmlOptions: {
        position: ["50%", "45%"],
        html: '<div style="width: 250px;height: 40px;text-align: center;"><div style="font-size: 16px">总资产</div><div style="font-size: 24px">133.08 亿</div></div>',
      },
    };
  },
  methods: {
    onShowTooltip(ev: any) {
      if (!ev || !ev.items) return;
      const { items } = ev;
      items[0].name = null;
      items[0].value = "$ " + items[0].value;
    },
    renderCustomChart({ chart }: any) {
      const data = [{ x: "1", y: 85 }];
      chart.source(data, {
        y: {
          max: 100,
          min: 0,
        },
      });
      chart.axis(false);
      chart.tooltip(false);
      chart.coord("polar", {
        transposed: true,
        innerRadius: 0.8,
        radius: 0.85,
      });
      chart.guide().arc({
        start: [0, 0],
        end: [1, 99.98],
        top: false,
        style: {
          lineWidth: 20,
          stroke: "#ccc",
        },
      });
      chart.guide().text({
        position: ["50%", "50%"],
        content: "85%",
        style: {
          fontSize: 24,
          fill: "#1890FF",
        },
      });
      chart
        .interval()
        .position("x*y")
        .size(20)
        .animate({
          appear: {
            duration: 1200,
            easing: "cubicIn",
          },
        });
      chart.render();
    },
  },
});
</script>

<style scoped>
.vChart-demo {
  padding: 10px;
  background: #fff;
}

.demo-section {
  margin-bottom: 20px;
}

.demo-section h3 {
  font-size: 14px;
  color: #666;
  margin: 10px 0 5px;
  padding-left: 5px;
}
</style>
