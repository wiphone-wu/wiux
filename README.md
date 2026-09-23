<p align="center">
  <a href="https://github.com/wiphone-wu/wiux">
    <img src="./src/assets/f182c332-c926-4b93-a945-3ade5cad73dd.png" width="175">
  </a>
</p>

<p align="center"><b>wiux</b> — Mobile web UI Components based on Vue 3 and WeUI.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wiphone/wiux">
    <img src="https://img.shields.io/npm/v/@wiphone/wiux.svg?style=flat-square" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/@wiphone/wiux">
    <img src="https://img.shields.io/npm/l/@wiphone/wiux.svg?style=flat-square" alt="license">
  </a>
  <br>
  <a href="https://github.com/wiphone-wu/wiux">
    <img src="https://img.shields.io/github/stars/wiphone-wu/wiux.svg?style=social&label=Star" alt="">
  </a>
  <a href="https://github.com/wiphone-wu/wiux">
    <img src="https://img.shields.io/github/forks/wiphone-wu/wiux.svg?style=social&label=Fork" alt="">
  </a>
</p>

---

## 关于这个项目

[VUX](https://github.com/airyland/vux) 曾经风靡一时，几乎可以说是 Vue 移动端组件库的唯一选择。

后来原作者停止了维护，我一直深感遗憾 —————— 毕竟还有项目在依赖它 😂。

维护的念头不是没有过，但原项目体量庞大，加上自己能力有限、精力也有限，始终没能迈出那一步。

感谢 AI 的出现，本项目在 AI 的协助下，完成了 VUX 从 Vue 2 到 Vue 3 的全量升级，现在它叫 [WIUX](https://github.com/wiphone-wu/wiux)。

当然了，wiux和vux2是两个不同的项目，只是看上去基本一样而已 —————— 毕竟vue3也没办法兼容vue2。

请注意：本项目没有进行严格的测试，不要将本项目用于生产环境，仅用于学习和开发。

---

## Requirements

- `vue` `^3.4.0`
- `node` `^20.19.0 || >=22.12.0`

## Quick Start

### Installation

```bash
npm install wiux
```

### Usage

```js
import { createApp } from 'vue'
import App from './App.vue'

import Wiux from 'wiux'
import 'wiux/dist/style.css'

const app = createApp(App)
app.use(Wiux)
app.mount('#app')
```

Or import components on demand:

```js
import { XButton, Toast, Group, Cell } from 'wiux'
```

## Components

### Layout / 布局

| Component | Description |
|-----------|-------------|
| Group | 分组容器 |
| Cell | 单元格 |
| FlexBox / FlexBoxItem | 弹性布局 |
| Grid / GridItem | 网格布局 |
| ViewBox | 视口容器 |
| Divider | 分隔线 |

### Typography / 排版

| Component | Description |
|-----------|-------------|
| XHeader | 页头 |
| InlineDesc | 行内描述 |

### Icon / 图标

| Component | Description |
|-----------|-------------|
| XIcon | 图标 |
| Badge | 徽章 |
| Spinner | 加载旋转器 |

### Button / 按钮

| Component | Description |
|-----------|-------------|
| XButton | 按钮 |
| ButtonTab / ButtonTabItem | 按钮选项卡 |

### Form / 表单

| Component | Description |
|-----------|-------------|
| XInput | 输入框 |
| XTextarea | 多行输入 |
| XNumber | 数字输入 |
| XSwitch | 开关 |
| Radio | 单选 |
| Checker / CheckerItem | 多选 |
| Checklist | 勾选列表 |
| Selector | 选择器 |
| Range | 滑块 |
| Rater | 评分 |
| Search | 搜索栏 |
| Datetime | 日期时间选择 |
| DatetimeView | 日期时间视图 |
| DatetimeRange | 日期区间 |
| Calendar | 日历 |
| InlineCalendar | 内联日历 |
| Picker | 选择器 |
| PopupPicker | 弹出选择器 |
| PopupRadio | 弹出单选 |
| XAddress | 地址选择 |
| Uploader | 图片上传 |
| ColorPicker | 颜色选择器 |
| XForm / XFormField | 表单校验 |

### Feedback / 反馈

| Component | Description |
|-----------|-------------|
| XDialog | 对话框 |
| Alert | 警告框 |
| Confirm | 确认框 |
| Toast | 轻提示 |
| Msg | 消息页 |
| Loading | 加载中 |
| LoadMore | 加载更多 |
| Masker | 遮罩 |

### Navigation / 导航

| Component | Description |
|-----------|-------------|
| Tab / TabItem | 选项卡 |
| tabbar / tabbarItem | 底部导航 |

### Other / 其他

| Component | Description |
|-----------|-------------|
| Swiper / SwiperItem | 轮播图 |
| Scroller | 滚动容器 |
| Actionsheet | 动作面板 |
| Popup | 弹出层 |
| PopupHeader | 弹出层头部 |
| Popover | 弹出菜单 |
| Drawer | 抽屉 |
| Previewer | 图片预览 |
| Sticky | 粘性布局 |
| Blur | 模糊效果 |
| Clocker | 计时器 |
| Countdown | 倒计时 |
| Countup | 数字滚动 |
| Card | 卡片 |
| Panel | 面板 |
| Qrcode | 二维码 |
| Flow / FlowLine / FlowState | 流程步骤 |
| Step / StepItem | 步骤条 |
| Timeline / TimelineItem | 时间线 |
| FormPreview | 表单预览 |
| CellFormPreview | 单元格表单预览 |
| XImg | 图片 |
| XTable | 表格 |
| WechatEmotion | 微信表情 |
| Marquee / MarqueeItem | 跑马灯 |
| XProgress | 进度条 |
| XCircle | 环形进度 |
| Swipeout / SwipeoutItem / SwipeoutButton | 滑动操作 |

### Chart / 图表

| Component | Description |
|-----------|-------------|
| VChart | 图表容器 |
| VLine | 折线图 |
| VArea | 面积图 |
| VBar | 柱状图 |
| VPie | 饼图 |
| VPoint | 散点图 |
| VScale | 度量 |
| VAxis | 坐标轴 |
| VGuide | 辅助元素 |
| VTooltip | 提示信息 |
| VLegend | 图例 |

## Internationalization / 国际化

wiux 内置中英文双语支持，基于 `vue-i18n`。

```js
import { createLocale } from 'wiux'

// 设置为英文
createLocale('en')

// 自定义语言包
createLocale({
  'Done': '完成',
  'Uploader.title': '上传图片'
})
```

所有语言包键值见 [src/locales](src/locales)。

## Plugin APIs / 插件式调用

除组件形式外，也支持函数式调用：

```js
import { toast, alert, confirm, loading, datetime } from 'wiux'

// Toast
toast({ text: '操作成功', type: 'success' })

// Alert
await alert({ title: '提示', content: '确定要删除吗？' })

// Confirm
const ok = await confirm({ title: '确认', content: '确定要执行此操作？' })
if (ok) { /* ... */ }

// Loading
loading.show({ text: '加载中...' })
loading.hide()

// Datetime
const date = await datetime({ value: '2024-01-01', format: 'YYYY-MM-DD' })
```

> 插件式调用使用前需 `app.use(Plugin)` 注册，详见 `app.use(Wiux)` 后自动包含。

## Development / 开发

```bash
# 安装依赖
npm install

# 启动 Demo 开发服务
npm run demo

# 构建 Demo
npm run demo:build

# 构建组件库
npm run build
```

## Wiux is Inspired or Powered By

- [Vux](https://github.com/airyland/vux)
- [Vue](https://github.com/vuejs/vue)
- [WeUI](https://github.com/weui/weui)
- [Ant Design Mobile](https://github.com/ant-design/ant-design-mobile)
- [PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe)
- [F2](https://github.com/antvis/f2)（图表）

## License

[MIT](LICENSE)