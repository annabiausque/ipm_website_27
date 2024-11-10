<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.8/vue.global.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js" integrity="sha512-Ysw1DcK1P+uYLqprEAzNQJP+J4hTx4t/3X2nbVwszao8wD+9afLjBQYjz7Uk4ADP+Er++mJoScI42ueGtQOzEA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css" integrity="sha512-rd0qOHVMOcez6pLWPVFIv7EfSdGKLt+eafXh4RO/12Fgr41hDQxfGvoi1Vy55QIVcQEujUE1LQrATCLl2Fs+ag==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<template>
    <swiper 
        :pagination="{clickable: true}"
        :effect="'fade'"
        :loop="true"
        :centeredSlides="true"
        :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
        }"
        :modules="modules"
        class="banner-carousel"
    >
      <swiper-slide class="banner-carousel-slide"><img src="../assets/img/banner-carousel/b1.png" alt=""></swiper-slide>
      <swiper-slide class="banner-carousel-slide"><img src="../assets/img/banner-carousel/b2.png" alt=""></swiper-slide>
      <swiper-slide class="banner-carousel-slide"><img src="../assets/img/banner-carousel/b1.png" alt=""></swiper-slide>
      <swiper-slide class="banner-carousel-slide"><img src="../assets/img/banner-carousel/b1.png" alt=""></swiper-slide>
      <swiper-slide class="banner-carousel-slide"><img src="../assets/img/banner-carousel/b1.png" alt=""></swiper-slide>
    </swiper>
</template>

<style lang="scss" scoped>
    .banner-carousel {
        @apply h-[768px] max-w-full;
        &-slide {
            @apply h-full max-w-full;
            img {
                @apply h-full w-full object-cover;
            }
        }
    }
    
    .swiper {
        @apply overflow-visible;
    }
   
</style>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Pagination, EffectFade, Autoplay } from 'swiper/modules';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            modules: [Pagination, EffectFade, Autoplay],
        };
    },
};
</script>