import { useSwiper } from 'swiper/react';

export const SliderButtons = () => {
  const swiper = useSwiper();

  return (
    <>
      <button onClick={() => swiper?.slidePrev()} className={`custom-slider-arrow custom-slider-arrow-left`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="65" fill="none" viewBox="0 0 84 65">
          <path
            fill="#0ADFDB"
            d="M66.386 1.828L82.461 12.78v47.845l-2.548 2.548h-62.71L1.539 52.217V4.372l2.548-2.544h62.3zM9.95 0L7.122 1.37H3.898l-2.82 2.813v1.134L0 6.397v5.146l1.077 1.13v31.345L0 45.098v5.146l1.077 1.127v1.086L17 63.587l.062.043h4.581L24.426 65h49.93l2.824-1.37h2.922l2.817-2.817v-1.152L84 58.58v-5.146l-1.08-1.127V20.964l1.08-1.08v-5.146l-1.08-1.13v-1.069L66.585 1.41l-.058-.04h-3.865L59.876 0H9.95z"
          ></path>
          <path
            fill="#0ADFDB"
            d="M66.485 3.34l15.17 10.264v46.291l-1.777 1.762H18.114L3.346 51.404V5.1L5.122 3.34h61.363zM3 51.583l14.961 10.383.044.033H80.02L82 60.036V13.423L66.635 3.029 66.59 3H4.981L3 4.96v46.624z"
          ></path>
          <path
            fill="#023340"
            fillOpacity="0.8"
            d="M81 13.384v46.834L79.23 62H17.71L3 51.627V4.782L4.77 3h61.12L81 13.384z"
          ></path>
          <path
            fill="#0ADFDB"
            d="M82 13.404V60.13L80.117 62H17.951L3 51.607V4.87L4.883 3h61.764L82 13.404zM3.172 51.516l14.834 10.313h62.038l1.784-1.772V13.495L66.592 3.17H4.956L3.172 4.943v46.573z"
          ></path>
          <path
            stroke="#0ADFDB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.35"
            d="M48 47.7L33.5 33.2 48 18.7"
          ></path>
        </svg>
      </button>

      <button
        onClick={() => swiper.slideNext()}
        className={`absolute top-1/2 right-0 custom-slider-arrow custom-slider-arrow-right`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="65" fill="none" viewBox="0 0 84 65">
          <path
            fill="#0ADFDB"
            d="M17.614 1.828L1.539 12.78v47.845l2.548 2.548h62.71l15.664-10.955V4.372l-2.548-2.544h-62.3zM74.05 0l2.828 1.37h3.224l2.82 2.813v1.134L84 6.397v5.146l-1.077 1.13v31.345L84 45.098v5.146l-1.077 1.127v1.086L67 63.587l-.062.043h-4.581L59.574 65H9.644L6.82 63.63H3.898L1.08 60.813v-1.152L0 58.58v-5.146l1.08-1.127V20.964L0 19.884v-5.146l1.08-1.13v-1.069L17.415 1.41l.058-.04h3.865L24.124 0H74.05z"
          ></path>
          <path
            fill="#0ADFDB"
            d="M17.515 3.34L2.345 13.603v46.291l1.777 1.762h61.764l14.768-10.253V5.1L78.878 3.34H17.515zM81 51.583L66.039 61.967l-.044.033H3.98L2 60.036V13.423L17.365 3.029 17.41 3h61.61L81 4.96v46.624z"
          ></path>
          <path
            fill="#023340"
            fillOpacity="0.8"
            d="M3 13.384v46.834L4.77 62h61.52L81 51.627V4.782L79.23 3H18.11L3 13.384z"
          ></path>
          <path
            fill="#0ADFDB"
            d="M2 13.404V60.13L3.883 62h62.166L81 51.607V4.87L79.117 3H17.353L2 13.404zm78.828 38.112L65.994 61.829H3.956l-1.784-1.772V13.495L17.408 3.17h61.636l1.784 1.772v46.573z"
          ></path>
          <path
            stroke="#0ADFDB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.35"
            d="M36 47.7l14.5-14.5L36 18.7"
          ></path>
        </svg>
      </button>
    </>
  );
};
