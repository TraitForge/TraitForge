import { Button } from '@/components';

export const TraidingHeader = ({ handleStep, step }) => {
  return (
    <>
      <div className="relative max-md:flex max-md:flex-col max-md:items-center ">
        {step !== 'one' && (
          <button
            className="absolute left-0  top-1/2 -translate-y-1/2 max-md:w-[40px] max-md:h-auto"
            onClick={() => handleStep(step === 'three' ? 'two' : 'one')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="59"
              height="78"
              fill="none"
              viewBox="0 0 84 65"
              className="w-full h-full"
            >
              <path
                fill="#0EEB81"
                d="M66.386 1.828L82.461 12.78v47.845l-2.548 2.548h-62.71L1.539 52.217V4.372l2.548-2.544h62.3zM9.95 0L7.122 1.37H3.898l-2.82 2.813v1.134L0 6.397v5.146l1.077 1.13v31.345L0 45.098v5.146l1.077 1.127v1.086L17 63.587l.062.043h4.581L24.426 65h49.93l2.824-1.37h2.922l2.817-2.817v-1.152L84 58.58v-5.146l-1.08-1.127V20.964l1.08-1.08v-5.146l-1.08-1.13v-1.069L66.585 1.41l-.058-.04h-3.865L59.876 0H9.95z"
              ></path>
              <path
                fill="#0EEB81"
                d="M66.485 3.34l15.17 10.264v46.291l-1.777 1.762H18.114L3.346 51.404V5.1L5.122 3.34h61.363zM3 51.583l14.961 10.383.044.033H80.02L82 60.036V13.423L66.635 3.029 66.59 3H4.981L3 4.96v46.624z"
              ></path>
              <path
                fill="#081E0E"
                fillOpacity="0.8"
                d="M81 13.384v46.834L79.23 62H17.71L3 51.627V4.782L4.77 3h61.12L81 13.384z"
              ></path>
              <path
                fill="#0EEB81"
                d="M82 13.404V60.13L80.117 62H17.951L3 51.607V4.87L4.883 3h61.764L82 13.404zM3.172 51.516l14.834 10.313h62.038l1.784-1.772V13.495L66.592 3.17H4.956L3.172 4.943v46.573z"
              ></path>
              <path
                stroke="#0EEB81"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4.35"
                d="M48 47.7L33.5 33.2 48 18.7"
              ></path>
            </svg>
          </button>
        )}
        <h1 className="text-[36px] md:text-extra-large">
          {step === 'one'
            ? 'Marketplace'
            : step === 'four'
              ? 'Buy Entity'
              : 'Sell Your Entity'}
        </h1>
        {step === 'one' && (
          <div className="md:absolute right-0 top-1/2 md:translate-y-[-50%] w-[265px]">
            <Button
              borderColor="#0EEB81"
              bg="rba(8, 30, 14,0.8)"
              text="Sell Your Entity"
              onClick={() => handleStep('two')}
            />
          </div>
        )}
      </div>
    </>
  );
};
