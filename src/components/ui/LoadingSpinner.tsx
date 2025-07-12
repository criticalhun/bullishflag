// src/components/ui/LoadingSpinner.tsx
'use client';

const LoadingSpinner = () => {
  return (
    <svg
      width="58"
      height="20"
      viewBox="0 0 58 20"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-current text-blue-500" // A szülőtől örökli a színt
    >
      <circle cx="10" cy="10" r="5">
        <animate
          attributeName="r"
          values="5;3;5"
          begin="0s"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          begin="0s"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="30" cy="10" r="3">
        <animate
          attributeName="r"
          values="5;3;5"
          begin="0.2s"
          dur="1.2s"
          repeatCount="indefinite"
        />
         <animate
          attributeName="opacity"
          values="1;0.5;1"
          begin="0.2s"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="10" r="5">
        <animate
          attributeName="r"
          values="5;3;5"
          begin="0.4s"
          dur="1.2s"
          repeatCount="indefinite"
        />
         <animate
          attributeName="opacity"
          values="1;0.5;1"
          begin="0.4s"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default LoadingSpinner;