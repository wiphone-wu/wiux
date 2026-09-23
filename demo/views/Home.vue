<template>
  <div>
    <div class="center">
      <svg
        style="width: 60px; height: 60px"
        version="1.1"
        id="logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="190 310 640 400"
        xml:space="preserve"
      >
        <path class="svgPath" data-index="path_0" fill="#35495e" d="M 769 416 L 734 424 L 716 430 L 616 456 L 602 463 L 591 473 L 557 535 L 486 658 L 485 662 L 487 667 L 510 706 L 512 707 L 516 702 L 587 581 L 596 570 L 608 567 L 662 561 L 675 557 L 693 547 L 706 532 L 719 504 L 710 504 L 630 515 L 627 513 L 635 507 L 677 495 L 701 490 L 721 483 L 733 476 L 753 456 L 760 443 Z" />
        <path class="svgPath" data-index="path_1" fill="#35495e" d="M 200 316 L 200 320 L 205 335 L 218 362 L 228 375 L 245 390 L 268 401 L 395 445 L 409 451 L 414 455 L 410 456 L 382 449 L 371 445 L 363 444 L 259 416 L 255 416 L 255 419 L 264 444 L 271 456 L 284 471 L 298 481 L 311 487 L 366 501 L 392 510 L 393 514 L 387 514 L 331 506 L 304 504 L 315 529 L 328 545 L 344 556 L 353 559 L 418 567 L 428 570 L 436 580 L 476 649 L 479 651 L 505 608 L 547 532 L 567 499 L 577 479 L 585 467 L 592 460 L 599 455 L 612 449 L 755 401 L 772 393 L 788 382 L 799 370 L 813 347 L 823 320 L 823 316 L 815 318 L 807 322 L 781 330 L 723 352 L 588 400 L 576 407 L 560 422 L 498 530 L 489 545 L 485 549 L 481 544 L 481 539 L 501 506 L 505 496 L 462 421 L 449 408 L 431 398 L 337 365 L 209 318 Z" />
      </svg>
      <p class="wiux-notice">v{{ version }}</p>
    </div>
    <group>
      <cell :title="t('Live Demo')" link="/demo" is-link>
        <template #icon>
          <span class="demo-icon" style="color: #09bb07">&#xe633;</span>
        </template>
      </cell>
      <cell
        :title="t('Github')"
        link="http://github.com/wiphone-wu/wiux"
        :value="t('Git Url')"
        is-link
      >
        <template #icon>
          <span class="demo-icon" style="color: #35495e">&#xe62f;</span>
        </template>
      </cell>
    </group>
    <br />
    <p class="vue-version">current vue version: {{ vueVersion }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Cell, Group, useLocale } from "wiux";


export default defineComponent({
  components: {
    Cell,
    Group,
  },
  setup() {
    const { t } = useLocale();

    const version = "0.0.1";
    const vueVersion = "3.5.42";

    return {
      t,
      version,
      vueVersion,
    };
  },
});
</script>

<style scoped>
.vue-version {
  text-align: center;
  font-size: 12px;
  color: #ccc;
}
.center {
  margin-top: 15px;
  text-align: center;
}
.wiux-notice {
  color: #666;
  line-height: 40px;
}
.demo-icon {
  margin-right: 15px;
}
</style>
