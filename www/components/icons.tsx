import { cn } from "@/lib/utils";
export const BotIcon = () => {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        clipRule="evenodd"
        d="M8.75 2.79933C9.19835 2.53997 9.5 2.05521 9.5 1.5C9.5 0.671573 8.82843 0 8 0C7.17157 0 6.5 0.671573 6.5 1.5C6.5 2.05521 6.80165 2.53997 7.25 2.79933V5H7C4.027 5 1.55904 7.16229 1.08296 10H0V13H1V14.5V16H2.5H13.5H15V14.5V13H16V10H14.917C14.441 7.16229 11.973 5 9 5H8.75V2.79933ZM7 6.5C4.51472 6.5 2.5 8.51472 2.5 11V14.5H13.5V11C13.5 8.51472 11.4853 6.5 9 6.5H7ZM7.25 11.25C7.25 12.2165 6.4665 13 5.5 13C4.5335 13 3.75 12.2165 3.75 11.25C3.75 10.2835 4.5335 9.5 5.5 9.5C6.4665 9.5 7.25 10.2835 7.25 11.25ZM10.5 13C11.4665 13 12.25 12.2165 12.25 11.25C12.25 10.2835 11.4665 9.5 10.5 9.5C9.5335 9.5 8.75 10.2835 8.75 11.25C8.75 12.2165 9.5335 13 10.5 13Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const UserIcon = () => {
  return (
    <svg
      data-testid="geist-icon"
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        clipRule="evenodd"
        d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25V3.75C4.5 5.54493 5.95507 7 7.75 7H8.25C10.0449 7 11.5 5.54493 11.5 3.75V3.25C11.5 1.45507 10.0449 0 8.25 0H7.75ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5H8.25C9.2165 1.5 10 2.2835 10 3.25V3.75C10 4.7165 9.2165 5.5 8.25 5.5H7.75C6.7835 5.5 6 4.7165 6 3.75V3.25ZM2.5 14.5V13.1709C3.31958 11.5377 4.99308 10.5 6.82945 10.5H9.17055C11.0069 10.5 12.6804 11.5377 13.5 13.1709V14.5H2.5ZM6.82945 9C4.35483 9 2.10604 10.4388 1.06903 12.6857L1 12.8353V13V15.25V16H1.75H14.25H15V15.25V13V12.8353L14.931 12.6857C13.894 10.4388 11.6452 9 9.17055 9H6.82945Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const AttachmentIcon = () => {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        clipRule="evenodd"
        d="M14.5 6.5V13.5C14.5 14.8807 13.3807 16 12 16H4C2.61929 16 1.5 14.8807 1.5 13.5V1.5V0H3H8H9.08579C9.351 0 9.60536 0.105357 9.79289 0.292893L14.2071 4.70711C14.3946 4.89464 14.5 5.149 14.5 5.41421V6.5ZM13 6.5V13.5C13 14.0523 12.5523 14.5 12 14.5H4C3.44772 14.5 3 14.0523 3 13.5V1.5H8V5V6.5H9.5H13ZM9.5 2.12132V5H12.3787L9.5 2.12132Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const VercelIcon = ({ size = 17 }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M8 1L16 15H0L8 1Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const GitIcon = () => {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
    >
      <g clipPath="url(#clip0_872_3147)">
        <path
          clipRule="evenodd"
          d="M8 0C3.58 0 0 3.57879 0 7.99729C0 11.5361 2.29 14.5251 5.47 15.5847C5.87 15.6547 6.02 15.4148 6.02 15.2049C6.02 15.0149 6.01 14.3851 6.01 13.7154C4 14.0852 3.48 13.2255 3.32 12.7757C3.23 12.5458 2.84 11.836 2.5 11.6461C2.22 11.4961 1.82 11.1262 2.49 11.1162C3.12 11.1062 3.57 11.696 3.72 11.936C4.44 13.1455 5.59 12.8057 6.05 12.5957C6.12 12.0759 6.33 11.726 6.56 11.5261C4.78 11.3262 2.92 10.6364 2.92 7.57743C2.92 6.70773 3.23 5.98797 3.74 5.42816C3.66 5.22823 3.38 4.40851 3.82 3.30888C3.82 3.30888 4.49 3.09895 6.02 4.1286C6.66 3.94866 7.34 3.85869 8.02 3.85869C8.7 3.85869 9.38 3.94866 10.02 4.1286C11.55 3.08895 12.22 3.30888 12.22 3.30888C12.66 4.40851 12.38 5.22823 12.3 5.42816C12.81 5.98797 13.12 6.69773 13.12 7.57743C13.12 10.6464 11.25 11.3262 9.47 11.5261C9.76 11.776 10.01 12.2558 10.01 13.0056C10.01 14.0752 10 14.9349 10 15.2049C10 15.4148 10.15 15.6647 10.55 15.5847C12.1381 15.0488 13.5182 14.0284 14.4958 12.6673C15.4735 11.3062 15.9996 9.67293 16 7.99729C16 3.57879 12.42 0 8 0Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_872_3147">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const BoxIcon = ({ size = 16 }: { size: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M8 0.154663L8.34601 0.334591L14.596 3.58459L15 3.79466V4.25V11.75V12.2053L14.596 12.4154L8.34601 15.6654L8 15.8453L7.65399 15.6654L1.40399 12.4154L1 12.2053V11.75V4.25V3.79466L1.40399 3.58459L7.65399 0.334591L8 0.154663ZM2.5 11.2947V5.44058L7.25 7.81559V13.7647L2.5 11.2947ZM8.75 13.7647L13.5 11.2947V5.44056L8.75 7.81556V13.7647ZM8 1.84534L12.5766 4.22519L7.99998 6.51352L3.42335 4.2252L8 1.84534Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const HomeIcon = ({ size = 16 }: { size: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M12.5 6.56062L8.00001 2.06062L3.50001 6.56062V13.5L6.00001 13.5V11C6.00001 9.89539 6.89544 8.99996 8.00001 8.99996C9.10458 8.99996 10 9.89539 10 11V13.5L12.5 13.5V6.56062ZM13.78 5.71933L8.70711 0.646409C8.31659 0.255886 7.68342 0.255883 7.2929 0.646409L2.21987 5.71944C2.21974 5.71957 2.21961 5.7197 2.21949 5.71982L0.469676 7.46963L-0.0606537 7.99996L1.00001 9.06062L1.53034 8.53029L2.00001 8.06062V14.25V15H2.75001L6.00001 15H7.50001H8.50001H10L13.25 15H14V14.25V8.06062L14.4697 8.53029L15 9.06062L16.0607 7.99996L15.5303 7.46963L13.7806 5.71993C13.7804 5.71973 13.7802 5.71953 13.78 5.71933ZM8.50001 11V13.5H7.50001V11C7.50001 10.7238 7.72386 10.5 8.00001 10.5C8.27615 10.5 8.50001 10.7238 8.50001 11Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const GPSIcon = ({ size = 16 }: { size: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        d="M1 6L15 1L10 15L7.65955 8.91482C7.55797 8.65073 7.34927 8.44203 7.08518 8.34045L1 6Z"
        fill="transparent"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const InvoiceIcon = ({ size = 16 }: { size: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M13 15.1L12 14.5L10.1524 15.8857C10.0621 15.9534 9.93791 15.9534 9.8476 15.8857L8 14.5L6.14377 15.8922C6.05761 15.9568 5.94008 15.9601 5.85047 15.9003L3.75 14.5L3 15L2.83257 15.1116L1.83633 15.7758L1.68656 15.8756C1.60682 15.9288 1.5 15.8716 1.5 15.7758V15.5958V14.3985V14.1972V1.5V0H3H8H9.08579C9.351 0 9.60536 0.105357 9.79289 0.292893L14.2071 4.70711C14.3946 4.89464 14.5 5.149 14.5 5.41421V6.5V14.2507V14.411V15.5881V15.7881C14.5 15.8813 14.3982 15.9389 14.3183 15.891L14.1468 15.7881L13.1375 15.1825L13 15.1ZM12.3787 5L9.5 2.12132V5H12.3787ZM8 1.5V5V6.5H9.5H13V13.3507L12.7717 13.2138L11.9069 12.6948L11.1 13.3L10 14.125L8.9 13.3L8 12.625L7.1 13.3L5.94902 14.1632L4.58205 13.2519L3.75 12.6972L3 13.1972V1.5H8Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const LogoOpenAI = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        d="M14.9449 6.54871C15.3128 5.45919 15.1861 4.26567 14.5978 3.27464C13.7131 1.75461 11.9345 0.972595 10.1974 1.3406C9.42464 0.481584 8.3144 -0.00692594 7.15045 7.42132e-05C5.37487 -0.00392587 3.79946 1.1241 3.2532 2.79113C2.11256 3.02164 1.12799 3.72615 0.551837 4.72468C-0.339497 6.24071 -0.1363 8.15175 1.05451 9.45178C0.686626 10.5413 0.813308 11.7348 1.40162 12.7258C2.28637 14.2459 4.06498 15.0279 5.80204 14.6599C6.5743 15.5189 7.68504 16.0074 8.849 15.9999C10.6256 16.0044 12.2015 14.8754 12.7478 13.2069C13.8884 12.9764 14.873 12.2718 15.4491 11.2733C16.3394 9.75728 16.1357 7.84774 14.9454 6.54771L14.9449 6.54871ZM8.85001 14.9544C8.13907 14.9554 7.45043 14.7099 6.90468 14.2604C6.92951 14.2474 6.97259 14.2239 7.00046 14.2069L10.2293 12.3668C10.3945 12.2743 10.4959 12.1008 10.4949 11.9133V7.42173L11.8595 8.19925C11.8742 8.20625 11.8838 8.22025 11.8858 8.23625V11.9558C11.8838 13.6099 10.5263 14.9509 8.85001 14.9544ZM2.32133 12.2028C1.9651 11.5958 1.8369 10.8843 1.95902 10.1938C1.98284 10.2078 2.02489 10.2333 2.05479 10.2503L5.28366 12.0903C5.44733 12.1848 5.65003 12.1848 5.81421 12.0903L9.75604 9.84429V11.3993C9.75705 11.4153 9.74945 11.4308 9.73678 11.4408L6.47295 13.3004C5.01915 14.1264 3.1625 13.6354 2.32184 12.2028H2.32133ZM1.47155 5.24819C1.82626 4.64017 2.38619 4.17516 3.05305 3.93366C3.05305 3.96116 3.05152 4.00966 3.05152 4.04366V7.72424C3.05051 7.91124 3.15186 8.08475 3.31654 8.17725L7.25838 10.4228L5.89376 11.2003C5.88008 11.2093 5.86285 11.2108 5.84765 11.2043L2.58331 9.34327C1.13255 8.51426 0.63494 6.68272 1.47104 5.24869L1.47155 5.24819ZM12.6834 7.82274L8.74157 5.57669L10.1062 4.79968C10.1199 4.79068 10.1371 4.78918 10.1523 4.79568L13.4166 6.65522C14.8699 7.48373 15.3681 9.31827 14.5284 10.7523C14.1732 11.3593 13.6138 11.8243 12.9474 12.0663V8.27575C12.9489 8.08875 12.8481 7.91574 12.6839 7.82274H12.6834ZM14.0414 5.8057C14.0176 5.7912 13.9756 5.7662 13.9457 5.7492L10.7168 3.90916C10.5531 3.81466 10.3504 3.81466 10.1863 3.90916L6.24442 6.15521V4.60017C6.2434 4.58417 6.251 4.56867 6.26367 4.55867L9.52751 2.70063C10.9813 1.87311 12.84 2.36563 13.6781 3.80066C14.0323 4.40667 14.1605 5.11618 14.0404 5.8057H14.0414ZM5.50257 8.57726L4.13744 7.79974C4.12275 7.79274 4.11312 7.77874 4.11109 7.76274V4.04316C4.11211 2.38713 5.47368 1.0451 7.15197 1.0461C7.86189 1.0461 8.54902 1.2921 9.09476 1.74011C9.06993 1.75311 9.02737 1.77661 8.99899 1.79361L5.77012 3.63365C5.60493 3.72615 5.50358 3.89916 5.50459 4.08666L5.50257 8.57626V8.57726ZM6.24391 7.00022L7.99972 5.9997L9.75553 6.99972V9.00027L7.99972 10.0003L6.24391 9.00027V7.00022Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const LogoGoogle = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      data-testid="geist-icon"
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        d="M8.15991 6.54543V9.64362H12.4654C12.2763 10.64 11.709 11.4837 10.8581 12.0509L13.4544 14.0655C14.9671 12.6692 15.8399 10.6182 15.8399 8.18188C15.8399 7.61461 15.789 7.06911 15.6944 6.54552L8.15991 6.54543Z"
        fill="#4285F4"
      />
      <path
        d="M3.6764 9.52268L3.09083 9.97093L1.01807 11.5855C2.33443 14.1963 5.03241 16 8.15966 16C10.3196 16 12.1305 15.2873 13.4542 14.0655L10.8578 12.0509C10.1451 12.5309 9.23598 12.8219 8.15966 12.8219C6.07967 12.8219 4.31245 11.4182 3.67967 9.5273L3.6764 9.52268Z"
        fill="#34A853"
      />
      <path
        d="M1.01803 4.41455C0.472607 5.49087 0.159912 6.70543 0.159912 7.99995C0.159912 9.29447 0.472607 10.509 1.01803 11.5854C1.01803 11.5926 3.6799 9.51991 3.6799 9.51991C3.5199 9.03991 3.42532 8.53085 3.42532 7.99987C3.42532 7.46889 3.5199 6.95983 3.6799 6.47983L1.01803 4.41455Z"
        fill="#FBBC05"
      />
      <path
        d="M8.15982 3.18545C9.33802 3.18545 10.3853 3.59271 11.2216 4.37818L13.5125 2.0873C12.1234 0.792777 10.3199 0 8.15982 0C5.03257 0 2.33443 1.79636 1.01807 4.41455L3.67985 6.48001C4.31254 4.58908 6.07983 3.18545 8.15982 3.18545Z"
        fill="#EA4335"
      />
    </svg>
  );
};

export const LogoAnthropic = () => {
  return (
    <svg
      height="18px"
      style={{ color: "currentcolor", fill: "currentcolor" }}
      viewBox="0 0 92.2 65"
      width="18px"
      x="0px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      y="0px"
    >
      <path
        d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z
		M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"
      />
    </svg>
  );
};

export const RouteIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M7.53033 0.719661L7 0.189331L5.93934 1.24999L6.46967 1.78032L6.68934 1.99999H3.375C1.51104 1.99999 0 3.51103 0 5.37499C0 7.23895 1.51104 8.74999 3.375 8.74999H12.625C13.6605 8.74999 14.5 9.58946 14.5 10.625C14.5 11.6605 13.6605 12.5 12.625 12.5H4.88555C4.56698 11.4857 3.61941 10.75 2.5 10.75C1.11929 10.75 0 11.8693 0 13.25C0 14.6307 1.11929 15.75 2.5 15.75C3.61941 15.75 4.56698 15.0143 4.88555 14H12.625C14.489 14 16 12.489 16 10.625C16 8.76103 14.489 7.24999 12.625 7.24999H3.375C2.33947 7.24999 1.5 6.41052 1.5 5.37499C1.5 4.33946 2.33947 3.49999 3.375 3.49999H6.68934L6.46967 3.71966L5.93934 4.24999L7 5.31065L7.53033 4.78032L8.85355 3.4571C9.24408 3.06657 9.24408 2.43341 8.85355 2.04288L7.53033 0.719661ZM2.5 14.25C3.05228 14.25 3.5 13.8023 3.5 13.25C3.5 12.6977 3.05228 12.25 2.5 12.25C1.94772 12.25 1.5 12.6977 1.5 13.25C1.5 13.8023 1.94772 14.25 2.5 14.25ZM14.5 2.74999C14.5 3.30228 14.0523 3.74999 13.5 3.74999C12.9477 3.74999 12.5 3.30228 12.5 2.74999C12.5 2.19771 12.9477 1.74999 13.5 1.74999C14.0523 1.74999 14.5 2.19771 14.5 2.74999ZM16 2.74999C16 4.1307 14.8807 5.24999 13.5 5.24999C12.1193 5.24999 11 4.1307 11 2.74999C11 1.36928 12.1193 0.249991 13.5 0.249991C14.8807 0.249991 16 1.36928 16 2.74999Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const FileIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M14.5 13.5V6.5V5.41421C14.5 5.149 14.3946 4.89464 14.2071 4.70711L9.79289 0.292893C9.60536 0.105357 9.351 0 9.08579 0H8H3H1.5V1.5V13.5C1.5 14.8807 2.61929 16 4 16H12C13.3807 16 14.5 14.8807 14.5 13.5ZM13 13.5V6.5H9.5H8V5V1.5H3V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5ZM9.5 5V2.12132L12.3787 5H9.5ZM5.13 5.00062H4.505V6.25062H5.13H6H6.625V5.00062H6H5.13ZM4.505 8H5.13H11H11.625V9.25H11H5.13H4.505V8ZM5.13 11H4.505V12.25H5.13H11H11.625V11H11H5.13Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const LoaderIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <g clipPath="url(#clip0_2393_1490)">
        <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 16V12"
          opacity="0.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.29773 1.52783L5.64887 4.7639"
          opacity="0.9"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.7023 1.52783L10.3511 4.7639"
          opacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.7023 14.472L10.3511 11.236"
          opacity="0.4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.29773 14.472L5.64887 11.236"
          opacity="0.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15.6085 5.52783L11.8043 6.7639"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M0.391602 10.472L4.19583 9.23598"
          opacity="0.7"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15.6085 10.4722L11.8043 9.2361"
          opacity="0.3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M0.391602 5.52783L4.19583 6.7639"
          opacity="0.8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_2393_1490">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const UploadIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      data-testid="geist-icon"
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M1.5 4.875C1.5 3.01104 3.01104 1.5 4.875 1.5C6.20018 1.5 7.34838 2.26364 7.901 3.37829C8.1902 3.96162 8.79547 4.5 9.60112 4.5H12.25C13.4926 4.5 14.5 5.50736 14.5 6.75C14.5 7.42688 14.202 8.03329 13.7276 8.44689L13.1622 8.93972L14.1479 10.0704L14.7133 9.57758C15.5006 8.89123 16 7.8785 16 6.75C16 4.67893 14.3211 3 12.25 3H9.60112C9.51183 3 9.35322 2.93049 9.2449 2.71201C8.44888 1.1064 6.79184 0 4.875 0C2.18261 0 0 2.18261 0 4.875V6.40385C0 7.69502 0.598275 8.84699 1.52982 9.59656L2.11415 10.0667L3.0545 8.89808L2.47018 8.42791C1.87727 7.95083 1.5 7.22166 1.5 6.40385V4.875ZM7.29289 7.39645C7.68342 7.00592 8.31658 7.00592 8.70711 7.39645L11.7803 10.4697L12.3107 11L11.25 12.0607L10.7197 11.5303L8.75 9.56066V15.25V16H7.25V15.25V9.56066L5.28033 11.5303L4.75 12.0607L3.68934 11L4.21967 10.4697L7.29289 7.39645Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MenuIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M1 2H1.75H14.25H15V3.5H14.25H1.75H1V2ZM1 12.5H1.75H14.25H15V14H14.25H1.75H1V12.5ZM1.75 7.25H1V8.75H1.75H14.25H15V7.25H14.25H1.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const PencilEditIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M11.75 0.189331L12.2803 0.719661L15.2803 3.71966L15.8107 4.24999L15.2803 4.78032L5.15901 14.9016C4.45575 15.6049 3.50192 16 2.50736 16H0.75H0V15.25V13.4926C0 12.4981 0.395088 11.5442 1.09835 10.841L11.2197 0.719661L11.75 0.189331ZM11.75 2.31065L9.81066 4.24999L11.75 6.18933L13.6893 4.24999L11.75 2.31065ZM2.15901 11.9016L8.75 5.31065L10.6893 7.24999L4.09835 13.841C3.67639 14.2629 3.1041 14.5 2.50736 14.5H1.5V13.4926C1.5 12.8959 1.73705 12.3236 2.15901 11.9016ZM9 16H16V14.5H9V16Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const CheckedSquare = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M15 16H1C0.447715 16 0 15.5523 0 15V1C0 0.447715 0.447716 0 1 0L15 8.17435e-06C15.5523 8.47532e-06 16 0.447724 16 1.00001V15C16 15.5523 15.5523 16 15 16ZM11.7803 6.28033L12.3107 5.75L11.25 4.68934L10.7197 5.21967L6.5 9.43935L5.28033 8.21967L4.75001 7.68934L3.68934 8.74999L4.21967 9.28033L5.96967 11.0303C6.11032 11.171 6.30109 11.25 6.5 11.25C6.69891 11.25 6.88968 11.171 7.03033 11.0303L11.7803 6.28033Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const UncheckedSquare = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <rect
        fill="none"
        height="14"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="1"
        y="1"
      />
    </svg>
  );
};

export const MoreIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M8 4C7.17157 4 6.5 3.32843 6.5 2.5C6.5 1.67157 7.17157 1 8 1C8.82843 1 9.5 1.67157 9.5 2.5C9.5 3.32843 8.82843 4 8 4ZM8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8C9.5 8.82843 8.82843 9.5 8 9.5ZM6.5 13.5C6.5 14.3284 7.17157 15 8 15C8.82843 15 9.5 14.3284 9.5 13.5C9.5 12.6716 8.82843 12 8 12C7.17157 12 6.5 12.6716 6.5 13.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const TrashIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.9201H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.07988H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const InfoIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM6.25002 7H7.00002H7.75C8.30229 7 8.75 7.44772 8.75 8V11.5V12.25H7.25V11.5V8.5H7.00002H6.25002V7ZM8 6C8.55229 6 9 5.55228 9 5C9 4.44772 8.55229 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const ArrowUpIcon = ({
  size = 16,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor", ...props.style }}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const StopIcon = ({
  size = 16,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height={size}
      style={{ color: "currentcolor", ...props.style }}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const PaperclipIcon = ({
  size = 16,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="-rotate-45"
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor", ...props.style }}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M10.8591 1.70735C10.3257 1.70735 9.81417 1.91925 9.437 2.29643L3.19455 8.53886C2.56246 9.17095 2.20735 10.0282 2.20735 10.9222C2.20735 11.8161 2.56246 12.6734 3.19455 13.3055C3.82665 13.9376 4.68395 14.2927 5.57786 14.2927C6.47178 14.2927 7.32908 13.9376 7.96117 13.3055L14.2036 7.06304L14.7038 6.56287L15.7041 7.56321L15.204 8.06337L8.96151 14.3058C8.06411 15.2032 6.84698 15.7074 5.57786 15.7074C4.30875 15.7074 3.09162 15.2032 2.19422 14.3058C1.29682 13.4084 0.792664 12.1913 0.792664 10.9222C0.792664 9.65305 1.29682 8.43592 2.19422 7.53852L8.43666 1.29609C9.07914 0.653606 9.95054 0.292664 10.8591 0.292664C11.7678 0.292664 12.6392 0.653606 13.2816 1.29609C13.9241 1.93857 14.2851 2.80997 14.2851 3.71857C14.2851 4.62718 13.9241 5.49858 13.2816 6.14106L13.2814 6.14133L7.0324 12.3835C7.03231 12.3836 7.03222 12.3837 7.03213 12.3838C6.64459 12.7712 6.11905 12.9888 5.57107 12.9888C5.02297 12.9888 4.49731 12.7711 4.10974 12.3835C3.72217 11.9959 3.50444 11.4703 3.50444 10.9222C3.50444 10.3741 3.72217 9.8484 4.10974 9.46084L4.11004 9.46054L9.877 3.70039L10.3775 3.20051L11.3772 4.20144L10.8767 4.70131L5.11008 10.4612C5.11005 10.4612 5.11003 10.4612 5.11 10.4613C4.98779 10.5835 4.91913 10.7493 4.91913 10.9222C4.91913 11.0951 4.98782 11.2609 5.11008 11.3832C5.23234 11.5054 5.39817 11.5741 5.57107 11.5741C5.74398 11.5741 5.9098 11.5054 6.03206 11.3832L6.03233 11.3829L12.2813 5.14072C12.2814 5.14063 12.2815 5.14054 12.2816 5.14045C12.6586 4.7633 12.8704 4.25185 12.8704 3.71857C12.8704 3.18516 12.6585 2.6736 12.2813 2.29643C11.9041 1.91925 11.3926 1.70735 10.8591 1.70735Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoreHorizontalIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M4 8C4 8.82843 3.32843 9.5 2.5 9.5C1.67157 9.5 1 8.82843 1 8C1 7.17157 1.67157 6.5 2.5 6.5C3.32843 6.5 4 7.17157 4 8ZM9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8ZM13.5 9.5C14.3284 9.5 15 8.82843 15 8C15 7.17157 14.3284 6.5 13.5 6.5C12.6716 6.5 12 7.17157 12 8C12 8.82843 12.6716 9.5 13.5 9.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MessageIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M2.8914 10.4028L2.98327 10.6318C3.22909 11.2445 3.5 12.1045 3.5 13C3.5 13.3588 3.4564 13.7131 3.38773 14.0495C3.69637 13.9446 4.01409 13.8159 4.32918 13.6584C4.87888 13.3835 5.33961 13.0611 5.70994 12.7521L6.22471 12.3226L6.88809 12.4196C7.24851 12.4724 7.61994 12.5 8 12.5C11.7843 12.5 14.5 9.85569 14.5 7C14.5 4.14431 11.7843 1.5 8 1.5C4.21574 1.5 1.5 4.14431 1.5 7C1.5 8.18175 1.94229 9.29322 2.73103 10.2153L2.8914 10.4028ZM2.8135 15.7653C1.76096 16 1 16 1 16C1 16 1.43322 15.3097 1.72937 14.4367C1.88317 13.9834 2 13.4808 2 13C2 12.3826 1.80733 11.7292 1.59114 11.1903C0.591845 10.0221 0 8.57152 0 7C0 3.13401 3.58172 0 8 0C12.4183 0 16 3.13401 16 7C16 10.866 12.4183 14 8 14C7.54721 14 7.10321 13.9671 6.67094 13.9038C6.22579 14.2753 5.66881 14.6656 5 15C4.23366 15.3832 3.46733 15.6195 2.8135 15.7653Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const CrossIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const CrossSmallIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M9.96966 11.0303L10.5 11.5607L11.5607 10.5L11.0303 9.96966L9.06065 7.99999L11.0303 6.03032L11.5607 5.49999L10.5 4.43933L9.96966 4.96966L7.99999 6.93933L6.03032 4.96966L5.49999 4.43933L4.43933 5.49999L4.96966 6.03032L6.93933 7.99999L4.96966 9.96966L4.43933 10.5L5.49999 11.5607L6.03032 11.0303L7.99999 9.06065L9.96966 11.0303Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const UndoIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M13.5 8C13.5 4.96643 11.0257 2.5 7.96452 2.5C5.42843 2.5 3.29365 4.19393 2.63724 6.5H5.25H6V8H5.25H0.75C0.335787 8 0 7.66421 0 7.25V2.75V2H1.5V2.75V5.23347C2.57851 2.74164 5.06835 1 7.96452 1C11.8461 1 15 4.13001 15 8C15 11.87 11.8461 15 7.96452 15C5.62368 15 3.54872 13.8617 2.27046 12.1122L1.828 11.5066L3.03915 10.6217L3.48161 11.2273C4.48831 12.6051 6.12055 13.5 7.96452 13.5C11.0257 13.5 13.5 11.0336 13.5 8Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const RedoIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M2.5 8C2.5 4.96643 4.97431 2.5 8.03548 2.5C10.5716 2.5 12.7064 4.19393 13.3628 6.5H10.75H10V8H10.75H15.25C15.6642 8 16 7.66421 16 7.25V2.75V2H14.5V2.75V5.23347C13.4215 2.74164 10.9316 1 8.03548 1C4.1539 1 1 4.13001 1 8C1 11.87 4.1539 15 8.03548 15C10.3763 15 12.4513 13.8617 13.7295 12.1122L14.172 11.5066L12.9609 10.6217L12.5184 11.2273C11.5117 12.6051 9.87945 13.5 8.03548 13.5C4.97431 13.5 2.5 11.0336 2.5 8Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const DeltaIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M2.67705 15H1L1.75 13.5L6.16147 4.67705L6.15836 4.67082L6.16667 4.66667L7.16147 2.67705L8 1L8.83853 2.67705L14.25 13.5L15 15H13.3229H2.67705ZM7 6.3541L10.5729 13.5H3.42705L7 6.3541Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const CpuIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    style={{ color: "currentcolor" }}
    viewBox="0 0 24 24"
    width={size}
  >
    <path
      d="M4 12C4 8.22876 4 6.34315 5.17157 5.17157C6.34315 4 8.22876 4 12 4C15.7712 4 17.6569 4 18.8284 5.17157C20 6.34315 20 8.22876 20 12C20 15.7712 20 17.6569 18.8284 18.8284C17.6569 20 15.7712 20 12 20C8.22876 20 6.34315 20 5.17157 18.8284C4 17.6569 4 15.7712 4 12Z"
      strokeLinejoin="round"
    />
    <path d="M9.5 2V4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 2V4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 20V22" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 20V22" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 9L9 13" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 13L13 15" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 14.5L20 14.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 9.5L2 9.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14.5L2 14.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 9.5L20 9.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PenIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M8.75 0.189331L9.28033 0.719661L15.2803 6.71966L15.8107 7.24999L15.2803 7.78032L13.7374 9.32322C13.1911 9.8696 12.3733 9.97916 11.718 9.65188L9.54863 13.5568C8.71088 15.0648 7.12143 16 5.39639 16H0.75H0V15.25V10.6036C0 8.87856 0.935237 7.28911 2.4432 6.45136L6.34811 4.28196C6.02084 3.62674 6.13039 2.80894 6.67678 2.26255L8.21967 0.719661L8.75 0.189331ZM7.3697 5.43035L10.5696 8.63029L8.2374 12.8283C7.6642 13.8601 6.57668 14.5 5.39639 14.5H2.56066L5.53033 11.5303L4.46967 10.4697L1.5 13.4393V10.6036C1.5 9.42331 2.1399 8.33579 3.17166 7.76259L7.3697 5.43035ZM12.6768 8.26256C12.5791 8.36019 12.4209 8.36019 12.3232 8.26255L12.0303 7.96966L8.03033 3.96966L7.73744 3.67677C7.63981 3.57914 7.63981 3.42085 7.73744 3.32321L8.75 2.31065L13.6893 7.24999L12.6768 8.26256Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const SummarizeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M1.75 12H1V10.5H1.75H5.25H6V12H5.25H1.75ZM1.75 7.75H1V6.25H1.75H4.25H5V7.75H4.25H1.75ZM1.75 3.5H1V2H1.75H7.25H8V3.5H7.25H1.75ZM12.5303 14.7803C12.2374 15.0732 11.7626 15.0732 11.4697 14.7803L9.21967 12.5303L8.68934 12L9.75 10.9393L10.2803 11.4697L11.25 12.4393V2.75V2H12.75V2.75V12.4393L13.7197 11.4697L14.25 10.9393L15.3107 12L14.7803 12.5303L12.5303 14.7803Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const SidebarLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M6.245 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H6.245V2.5ZM4.995 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H4.995V2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M 8.75,1 H7.25 V7.25 H1.5 V8.75 H7.25 V15 H8.75 V8.75 H14.5 V7.25 H8.75 V1.75 Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const CopyIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const ThumbUpIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M6.89531 2.23972C6.72984 2.12153 6.5 2.23981 6.5 2.44315V5.25001C6.5 6.21651 5.7165 7.00001 4.75 7.00001H2.5V13.5H12.1884C12.762 13.5 13.262 13.1096 13.4011 12.5532L14.4011 8.55318C14.5984 7.76425 14.0017 7.00001 13.1884 7.00001H9.25H8.5V6.25001V3.51458C8.5 3.43384 8.46101 3.35807 8.39531 3.31114L6.89531 2.23972ZM5 2.44315C5 1.01975 6.6089 0.191779 7.76717 1.01912L9.26717 2.09054C9.72706 2.41904 10 2.94941 10 3.51458V5.50001H13.1884C14.9775 5.50001 16.2903 7.18133 15.8563 8.91698L14.8563 12.917C14.5503 14.1412 13.4503 15 12.1884 15H1.75H1V14.25V6.25001V5.50001H1.75H4.75C4.88807 5.50001 5 5.38808 5 5.25001V2.44315Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const ThumbDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M6.89531 13.7603C6.72984 13.8785 6.5 13.7602 6.5 13.5569V10.75C6.5 9.7835 5.7165 9 4.75 9H2.5V2.5H12.1884C12.762 2.5 13.262 2.89037 13.4011 3.44683L14.4011 7.44683C14.5984 8.23576 14.0017 9 13.1884 9H9.25H8.5V9.75V12.4854C8.5 12.5662 8.46101 12.6419 8.39531 12.6889L6.89531 13.7603ZM5 13.5569C5 14.9803 6.6089 15.8082 7.76717 14.9809L9.26717 13.9095C9.72706 13.581 10 13.0506 10 12.4854V10.5H13.1884C14.9775 10.5 16.2903 8.81868 15.8563 7.08303L14.8563 3.08303C14.5503 1.85882 13.4503 1 12.1884 1H1.75H1V1.75V9.75V10.5H1.75H4.75C4.88807 10.5 5 10.6119 5 10.75V13.5569Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const SparklesIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
      fill="currentColor"
    />
    <path
      d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
      fill="currentColor"
    />
    <path
      d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
      fill="currentColor"
    />
  </svg>
);

export const CheckCircleFillIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const GlobeIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M10.268 14.0934C11.9051 13.4838 13.2303 12.2333 13.9384 10.6469C13.1192 10.7941 12.2138 10.9111 11.2469 10.9925C11.0336 12.2005 10.695 13.2621 10.268 14.0934ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8.48347 14.4823C8.32384 14.494 8.16262 14.5 8 14.5C7.83738 14.5 7.67616 14.494 7.51654 14.4823C7.5132 14.4791 7.50984 14.4759 7.50647 14.4726C7.2415 14.2165 6.94578 13.7854 6.67032 13.1558C6.41594 12.5744 6.19979 11.8714 6.04101 11.0778C6.67605 11.1088 7.33104 11.125 8 11.125C8.66896 11.125 9.32395 11.1088 9.95899 11.0778C9.80021 11.8714 9.58406 12.5744 9.32968 13.1558C9.05422 13.7854 8.7585 14.2165 8.49353 14.4726C8.49016 14.4759 8.4868 14.4791 8.48347 14.4823ZM11.4187 9.72246C12.5137 9.62096 13.5116 9.47245 14.3724 9.28806C14.4561 8.87172 14.5 8.44099 14.5 8C14.5 7.55901 14.4561 7.12828 14.3724 6.71194C13.5116 6.52755 12.5137 6.37904 11.4187 6.27753C11.4719 6.83232 11.5 7.40867 11.5 8C11.5 8.59133 11.4719 9.16768 11.4187 9.72246ZM10.1525 6.18401C10.2157 6.75982 10.25 7.36805 10.25 8C10.25 8.63195 10.2157 9.24018 10.1525 9.81598C9.46123 9.85455 8.7409 9.875 8 9.875C7.25909 9.875 6.53877 9.85455 5.84749 9.81598C5.7843 9.24018 5.75 8.63195 5.75 8C5.75 7.36805 5.7843 6.75982 5.84749 6.18401C6.53877 6.14545 7.25909 6.125 8 6.125C8.74091 6.125 9.46123 6.14545 10.1525 6.18401ZM11.2469 5.00748C12.2138 5.08891 13.1191 5.20593 13.9384 5.35306C13.2303 3.7667 11.9051 2.51622 10.268 1.90662C10.695 2.73788 11.0336 3.79953 11.2469 5.00748ZM8.48347 1.51771C8.4868 1.52089 8.49016 1.52411 8.49353 1.52737C8.7585 1.78353 9.05422 2.21456 9.32968 2.84417C9.58406 3.42562 9.80021 4.12856 9.95899 4.92219C9.32395 4.89118 8.66896 4.875 8 4.875C7.33104 4.875 6.67605 4.89118 6.04101 4.92219C6.19978 4.12856 6.41594 3.42562 6.67032 2.84417C6.94578 2.21456 7.2415 1.78353 7.50647 1.52737C7.50984 1.52411 7.51319 1.52089 7.51653 1.51771C7.67615 1.50597 7.83738 1.5 8 1.5C8.16262 1.5 8.32384 1.50597 8.48347 1.51771ZM5.73202 1.90663C4.0949 2.51622 2.76975 3.7667 2.06159 5.35306C2.88085 5.20593 3.78617 5.08891 4.75309 5.00748C4.96639 3.79953 5.30497 2.73788 5.73202 1.90663ZM4.58133 6.27753C3.48633 6.37904 2.48837 6.52755 1.62761 6.71194C1.54392 7.12828 1.5 7.55901 1.5 8C1.5 8.44099 1.54392 8.87172 1.62761 9.28806C2.48837 9.47245 3.48633 9.62096 4.58133 9.72246C4.52807 9.16768 4.5 8.59133 4.5 8C4.5 7.40867 4.52807 6.83232 4.58133 6.27753ZM4.75309 10.9925C3.78617 10.9111 2.88085 10.7941 2.06159 10.6469C2.76975 12.2333 4.0949 13.4838 5.73202 14.0934C5.30497 13.2621 4.96639 12.2005 4.75309 10.9925Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const LockIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M10 4.5V6H6V4.5C6 3.39543 6.89543 2.5 8 2.5C9.10457 2.5 10 3.39543 10 4.5ZM4.5 6V4.5C4.5 2.567 6.067 1 8 1C9.933 1 11.5 2.567 11.5 4.5V6H12.5H14V7.5V12.5C14 13.8807 12.8807 15 11.5 15H4.5C3.11929 15 2 13.8807 2 12.5V7.5V6H3.5H4.5ZM11.5 7.5H10H6H4.5H3.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V7.5H11.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const EyeIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const ShareIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M15 11.25V10.5H13.5V11.25V12.75C13.5 13.1642 13.1642 13.5 12.75 13.5H3.25C2.83579 13.5 2.5 13.1642 2.5 12.75L2.5 3.25C2.5 2.83579 2.83579 2.5 3.25 2.5H5.75H6.5V1H5.75H3.25C2.00736 1 1 2.00736 1 3.25V12.75C1 13.9926 2.00736 15 3.25 15H12.75C13.9926 15 15 13.9926 15 12.75V11.25ZM15 5.5L10.5 1V4C7.46243 4 5 6.46243 5 9.5V10L5.05855 9.91218C6.27146 8.09281 8.31339 7 10.5 7V10L15 5.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const CodeIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M4.21969 12.5303L4.75002 13.0607L5.81068 12L5.28035 11.4697L1.81068 7.99999L5.28035 4.53032L5.81068 3.99999L4.75002 2.93933L4.21969 3.46966L0.39647 7.29289C0.00594562 7.68341 0.00594562 8.31658 0.39647 8.7071L4.21969 12.5303ZM11.7804 12.5303L11.25 13.0607L10.1894 12L10.7197 11.4697L14.1894 7.99999L10.7197 4.53032L10.1894 3.99999L11.25 2.93933L11.7804 3.46966L15.6036 7.29289C15.9941 7.68341 15.9941 8.31658 15.6036 8.7071L11.7804 12.5303Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const PlayIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M13.4549 7.22745L13.3229 7.16146L2.5 1.74999L2.4583 1.72914L1.80902 1.4045L1.3618 1.18089C1.19558 1.09778 1 1.21865 1 1.4045L1 1.9045L1 2.63041L1 2.67704L1 13.3229L1 13.3696L1 14.0955L1 14.5955C1 14.7813 1.19558 14.9022 1.3618 14.8191L1.80902 14.5955L2.4583 14.2708L2.5 14.25L13.3229 8.83852L13.4549 8.77253L14.2546 8.37267L14.5528 8.2236C14.737 8.13147 14.737 7.86851 14.5528 7.77638L14.2546 7.62731L13.4549 7.22745ZM11.6459 7.99999L2.5 3.42704L2.5 12.5729L11.6459 7.99999Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const PythonIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        d="M7.90474 0.00013087C7.24499 0.00316291 6.61494 0.0588153 6.06057 0.15584C4.42745 0.441207 4.13094 1.0385 4.13094 2.14002V3.59479H7.9902V4.07971H4.13094H2.68259C1.56099 4.07971 0.578874 4.7465 0.271682 6.01496C-0.0826597 7.4689 -0.0983767 8.37619 0.271682 9.89434C0.546012 11.0244 1.20115 11.8296 2.32276 11.8296H3.64966V10.0856C3.64966 8.82574 4.75179 7.71441 6.06057 7.71441H9.91533C10.9884 7.71441 11.845 6.84056 11.845 5.77472V2.14002C11.845 1.10556 10.9626 0.328487 9.91533 0.15584C9.25237 0.046687 8.56448 -0.00290121 7.90474 0.00013087ZM5.81768 1.17017C6.21631 1.17017 6.54185 1.49742 6.54185 1.89978C6.54185 2.30072 6.21631 2.62494 5.81768 2.62494C5.41761 2.62494 5.09351 2.30072 5.09351 1.89978C5.09351 1.49742 5.41761 1.17017 5.81768 1.17017Z"
        fill="currentColor"
      />
      <path
        d="M12.3262 4.07971V5.77472C12.3262 7.08883 11.1997 8.19488 9.91525 8.19488H6.06049C5.0046 8.19488 4.13086 9.0887 4.13086 10.1346V13.7693C4.13086 14.8037 5.04033 15.4122 6.06049 15.709C7.28211 16.0642 8.45359 16.1285 9.91525 15.709C10.8868 15.4307 11.8449 14.8708 11.8449 13.7693V12.3145H7.99012V11.8296H11.8449H13.7745C14.8961 11.8296 15.3141 11.0558 15.7041 9.89434C16.1071 8.69865 16.0899 7.5488 15.7041 6.01495C15.4269 4.91058 14.8975 4.07971 13.7745 4.07971H12.3262ZM10.1581 13.2843C10.5582 13.2843 10.8823 13.6086 10.8823 14.0095C10.8823 14.4119 10.5582 14.7391 10.1581 14.7391C9.7595 14.7391 9.43397 14.4119 9.43397 14.0095C9.43397 13.6086 9.7595 13.2843 10.1581 13.2843Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TerminalWindowIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M1.5 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1ZM4 11.1339L4.44194 10.6919L6.51516 8.61872C6.85687 8.27701 6.85687 7.72299 6.51517 7.38128L4.44194 5.30806L4 4.86612L3.11612 5.75L3.55806 6.19194L5.36612 8L3.55806 9.80806L3.11612 10.25L4 11.1339ZM8 9.75494H8.6225H11.75H12.3725V10.9999H11.75H8.6225H8V9.75494Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const TerminalIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M1.53035 12.7804L1.00002 13.3108L-0.0606384 12.2501L0.469692 11.7198L4.18936 8.00011L0.469692 4.28044L-0.0606384 3.75011L1.00002 2.68945L1.53035 3.21978L5.60358 7.29301C5.9941 7.68353 5.9941 8.3167 5.60357 8.70722L1.53035 12.7804ZM8.75002 12.5001H8.00002V14.0001H8.75002H15.25H16V12.5001H15.25H8.75002Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const ClockRewind = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M7.96452 2.5C11.0257 2.5 13.5 4.96643 13.5 8C13.5 11.0336 11.0257 13.5 7.96452 13.5C6.12055 13.5 4.48831 12.6051 3.48161 11.2273L3.03915 10.6217L1.828 11.5066L2.27046 12.1122C3.54872 13.8617 5.62368 15 7.96452 15C11.8461 15 15 11.87 15 8C15 4.13001 11.8461 1 7.96452 1C5.06835 1 2.57851 2.74164 1.5 5.23347V3.75V3H0V3.75V7.25C0 7.66421 0.335786 8 0.75 8H3.75H4.5V6.5H3.75H2.63724C3.29365 4.19393 5.42843 2.5 7.96452 2.5ZM8.75 5.25V4.5H7.25V5.25V7.8662C7.25 8.20056 7.4171 8.51279 7.6953 8.69825L9.08397 9.62404L9.70801 10.0401L10.5401 8.79199L9.91603 8.37596L8.75 7.59861V5.25Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const LogsIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M9 2H9.75H14.25H15V3.5H14.25H9.75H9V2ZM9 12.5H9.75H14.25H15V14H14.25H9.75H9V12.5ZM9.75 7.25H9V8.75H9.75H14.25H15V7.25H14.25H9.75ZM1 12.5H1.75H2.25H3V14H2.25H1.75H1V12.5ZM1.75 2H1V3.5H1.75H2.25H3V2H2.25H1.75ZM1 7.25H1.75H2.25H3V8.75H2.25H1.75H1V7.25ZM5.75 12.5H5V14H5.75H6.25H7V12.5H6.25H5.75ZM5 2H5.75H6.25H7V3.5H6.25H5.75H5V2ZM5.75 7.25H5V8.75H5.75H6.25H7V7.25H6.25H5.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const ImageIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M14.5 2.5H1.5V9.18933L2.96966 7.71967L3.18933 7.5H3.49999H6.63001H6.93933L6.96966 7.46967L10.4697 3.96967L11.5303 3.96967L14.5 6.93934V2.5ZM8.00066 8.55999L9.53034 10.0897L10.0607 10.62L9.00001 11.6807L8.46968 11.1503L6.31935 9H3.81065L1.53032 11.2803L1.5 11.3106V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H13.5C14.0523 13.5 14.5 13.0523 14.5 12.5V9.06066L11 5.56066L8.03032 8.53033L8.00066 8.55999ZM4.05312e-06 10.8107V12.5C4.05312e-06 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V9.56066L16.5607 9L16.0303 8.46967L16 8.43934V2.5V1H14.5H1.5H4.05312e-06V2.5V10.6893L-0.0606689 10.75L4.05312e-06 10.8107Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const FullscreenIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M1 5.25V6H2.5V5.25V2.5H5.25H6V1H5.25H2C1.44772 1 1 1.44772 1 2V5.25ZM5.25 14.9994H6V13.4994H5.25H2.5V10.7494V9.99939H1V10.7494V13.9994C1 14.5517 1.44772 14.9994 2 14.9994H5.25ZM15 10V10.75V14C15 14.5523 14.5523 15 14 15H10.75H10V13.5H10.75H13.5V10.75V10H15ZM10.75 1H10V2.5H10.75H13.5V5.25V6H15V5.25V2C15 1.44772 14.5523 1 14 1H10.75Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const DownloadIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const LineChartIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M1 1v11.75A2.25 2.25 0 0 0 3.25 15H15v-1.5H3.25a.75.75 0 0 1-.75-.75V1H1Zm13.297 5.013.513-.547-1.094-1.026-.513.547-3.22 3.434-2.276-2.275a1 1 0 0 0-1.414 0L4.22 8.22l-.53.53 1.06 1.06.53-.53L7 7.56l2.287 2.287a1 1 0 0 0 1.437-.023l3.573-3.811Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const MeridianLogo = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      height={size}
      viewBox="0 0 256 256"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 128 128 C 198.692 128 256 185.308 256 256 L 200 256 C 200 216.235 167.765 184 128 184 C 88.236 184 56 216.235 56 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const WarningIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        clipRule="evenodd"
        d="M8.55846 0.5C9.13413 0.5 9.65902 0.829456 9.90929 1.34788L15.8073 13.5653C16.1279 14.2293 15.6441 15 14.9068 15H1.09316C0.355835 15 -0.127943 14.2293 0.192608 13.5653L6.09065 1.34787C6.34092 0.829454 6.86581 0.5 7.44148 0.5H8.55846ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};


export const Icons = {
  logo: ({ className }: { className?: string }) => (
    <svg
      width="42"
      height="24"
      viewBox="0 0 42 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 fill-[var(--secondary)]", className)}
    >
      <g clipPath="url(#clip0_322_9172)">
        <path
          d="M22.3546 0.96832C22.9097 0.390834 23.6636 0.0664062 24.4487 0.0664062C27.9806 0.0664062 31.3091 0.066408 34.587 0.0664146C41.1797 0.0664284 44.481 8.35854 39.8193 13.2082L29.6649 23.7718C29.1987 24.2568 28.4016 23.9133 28.4016 23.2274V13.9234L29.5751 12.7025C30.5075 11.7326 29.8472 10.0742 28.5286 10.0742H13.6016L22.3546 0.96832Z"
          fill="current"
        />
        <path
          d="M19.6469 23.0305C19.0919 23.608 18.338 23.9324 17.5529 23.9324C14.021 23.9324 10.6925 23.9324 7.41462 23.9324C0.821896 23.9324 -2.47942 15.6403 2.18232 10.7906L12.3367 0.227022C12.8029 -0.257945 13.6 0.0855283 13.6 0.771372L13.6 10.0754L12.4265 11.2963C11.4941 12.2662 12.1544 13.9246 13.473 13.9246L28.4001 13.9246L19.6469 23.0305Z"
          fill="current"
        />
      </g>
      <defs>
        <clipPath id="clip0_322_9172">
          <rect width="42" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  soc2: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_4900)"
        />
        <g>
          <rect
            x="6.15784"
            y="4.021"
            width="33.6842"
            height="33.6842"
            rx="16.8421"
            fill="url(#paint1_linear_1_4900)"
          />
          <path
            d="M15.0475 29.6233C13.7506 29.6233 12.9548 28.8938 12.8738 27.8033L13.8464 27.7443C13.9348 28.4222 14.3401 28.798 15.0622 28.798C15.6812 28.798 16.0348 28.5696 16.0348 28.1201C16.0348 27.7148 15.8285 27.4717 14.7601 27.2212C13.4633 26.9264 12.977 26.558 12.977 25.7033C12.977 24.7896 13.6917 24.1559 14.8633 24.1559C16.1159 24.1559 16.8012 24.8854 16.9191 25.8948L15.9538 25.9391C15.8875 25.3717 15.5117 24.9812 14.8485 24.9812C14.2959 24.9812 13.957 25.2612 13.957 25.6664C13.957 26.0938 14.2001 26.2559 15.1359 26.4696C16.5433 26.7717 17.0148 27.2875 17.0148 28.0685C17.0148 29.0264 16.2338 29.6233 15.0475 29.6233ZM19.9915 29.6233C18.4367 29.6233 17.5009 28.5843 17.5009 26.897C17.5009 25.2096 18.4367 24.1559 19.9915 24.1559C21.5536 24.1559 22.4894 25.2096 22.4894 26.897C22.4894 28.5843 21.5536 29.6233 19.9915 29.6233ZM19.9915 28.7906C20.942 28.7906 21.502 28.0906 21.502 26.897C21.502 25.7033 20.942 24.9885 19.9915 24.9885C19.0557 24.9885 18.4883 25.7033 18.4883 26.897C18.4883 28.0906 19.0557 28.7906 19.9915 28.7906ZM25.324 29.6233C23.8945 29.6233 22.8997 28.6064 22.8997 26.897C22.8997 25.2169 23.865 24.1559 25.3313 24.1559C26.665 24.1559 27.3797 24.8559 27.6082 26.0422L26.6061 26.0938C26.4734 25.4085 26.0534 24.9885 25.3313 24.9885C24.4397 24.9885 23.8871 25.7327 23.8871 26.897C23.8871 28.0759 24.4545 28.7906 25.324 28.7906C26.105 28.7906 26.5176 28.3412 26.6355 27.5896L27.6376 27.6412C27.4313 28.8717 26.6429 29.6233 25.324 29.6233ZM29.6489 29.5054C29.6489 28.238 30.1205 27.5085 31.5573 26.7569C32.2721 26.3812 32.53 26.1748 32.53 25.7327C32.53 25.298 32.2426 24.9885 31.6826 24.9885C31.0858 24.9885 30.7321 25.3348 30.651 25.9685L29.6637 25.9096C29.7668 24.8191 30.4889 24.1559 31.6826 24.1559C32.8395 24.1559 33.5173 24.7896 33.5173 25.718C33.5173 26.5212 33.1416 26.897 32.1173 27.4422C31.2479 27.9064 30.8279 28.3485 30.7984 28.6727H33.5173V29.5054H29.6489Z"
            fill="#101828"
          />
          <path
            d="M13.0537 17.8882L14.9621 12.6566H15.6253L17.5263 17.8882H16.9811L16.4211 16.3187H14.159L13.599 17.8882H13.0537ZM14.3285 15.8324H16.2516L15.2937 13.1061L14.3285 15.8324ZM18.026 17.8882V12.6566H18.5271V17.8882H18.026ZM21.5495 18.0061C20.1642 18.0061 19.2506 16.9745 19.2506 15.2798C19.2506 13.585 20.1642 12.5387 21.5495 12.5387C22.7727 12.5387 23.4506 13.2387 23.6642 14.3292L23.1337 14.3661C22.9863 13.5482 22.4632 13.0324 21.5495 13.0324C20.4811 13.0324 19.7737 13.8798 19.7737 15.2798C19.7737 16.6798 20.4811 17.5124 21.5495 17.5124C22.5074 17.5124 23.0453 16.9598 23.1779 16.0608L23.7085 16.0977C23.5242 17.2471 22.7727 18.0061 21.5495 18.0061ZM24.5062 17.8882V12.6566H26.3409C27.4904 12.6566 28.1683 13.2461 28.1683 14.2187C28.1683 15.1913 27.4904 15.7808 26.3409 15.7808H25.0072V17.8882H24.5062ZM25.0072 15.2945H26.3409C27.1957 15.2945 27.6378 14.9187 27.6378 14.2187C27.6378 13.5113 27.1957 13.1429 26.3409 13.1429H25.0072V15.2945ZM27.9425 17.8882L29.851 12.6566H30.5141L32.4152 17.8882H31.8699L31.3099 16.3187H29.0478L28.4878 17.8882H27.9425ZM29.2173 15.8324H31.1404L30.1825 13.1061L29.2173 15.8324Z"
            fill="#6A7282"
          />
          <line
            x1="10.4938"
            y1="21.2488"
            x2="34.988"
            y2="21.2488"
            stroke="#E5E7EB"
            strokeWidth="0.263158"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_4900"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9FAFB" />
          <stop offset="1" stopColor="#E5E7EB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_4900"
          x1="11.9583"
          y1="8.8133"
          x2="33.9849"
          y2="33.2538"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>
      </defs>
    </svg>
  ),
  soc2Dark: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_2018)"
        />
        <g>
          <rect
            x="6.1579"
            y="4.021"
            width="33.6842"
            height="33.6842"
            rx="16.8421"
            fill="url(#paint1_linear_1_2018)"
          />
          <path
            d="M15.0441 29.6233C14.6118 29.6233 14.2385 29.5496 13.9241 29.4022C13.6097 29.2499 13.3617 29.0362 13.1799 28.7612C12.9982 28.4861 12.8925 28.1668 12.8631 27.8033L13.8357 27.7443C13.8701 27.9752 13.9364 28.1692 14.0346 28.3264C14.1329 28.4787 14.2655 28.5966 14.4325 28.6801C14.6045 28.7587 14.8132 28.798 15.0589 28.798C15.3683 28.798 15.6066 28.7415 15.7736 28.6285C15.9455 28.5106 16.0315 28.3412 16.0315 28.1201C16.0315 27.9777 15.9971 27.8573 15.9283 27.7591C15.8596 27.6559 15.7343 27.5626 15.5525 27.4791C15.3708 27.3906 15.1055 27.3047 14.7567 27.2212C14.3097 27.118 13.9585 27.005 13.7031 26.8822C13.4476 26.7545 13.261 26.5973 13.1431 26.4106C13.0301 26.224 12.9736 25.9882 12.9736 25.7033C12.9736 25.3987 13.0473 25.131 13.1946 24.9001C13.3469 24.6643 13.5655 24.4826 13.8504 24.3548C14.1353 24.2222 14.4718 24.1559 14.8599 24.1559C15.2627 24.1559 15.6115 24.2296 15.9062 24.3769C16.201 24.5243 16.4318 24.7282 16.5989 24.9885C16.7659 25.2489 16.869 25.551 16.9083 25.8948L15.9431 25.9391C15.9234 25.7475 15.8669 25.5805 15.7736 25.438C15.6803 25.2906 15.555 25.1777 15.3978 25.0991C15.2455 25.0205 15.0613 24.9812 14.8452 24.9812C14.5701 24.9812 14.3515 25.045 14.1894 25.1727C14.0273 25.2955 13.9462 25.4601 13.9462 25.6664C13.9462 25.8089 13.9806 25.9268 14.0494 26.0201C14.1182 26.1134 14.2336 26.1945 14.3957 26.2633C14.5627 26.3271 14.8059 26.3959 15.1252 26.4696C15.5869 26.5678 15.9553 26.6931 16.2304 26.8454C16.5055 26.9927 16.702 27.1671 16.8199 27.3685C16.9427 27.565 17.0041 27.7984 17.0041 28.0685C17.0041 28.3829 16.9231 28.658 16.761 28.8938C16.5989 29.1247 16.368 29.304 16.0683 29.4317C15.7736 29.5594 15.4322 29.6233 15.0441 29.6233ZM19.9881 29.6233C19.4723 29.6233 19.0277 29.5152 18.6544 29.2991C18.2811 29.078 17.9937 28.7636 17.7923 28.3559C17.5909 27.9433 17.4902 27.4569 17.4902 26.897C17.4902 26.3369 17.5909 25.8506 17.7923 25.438C17.9937 25.0254 18.2811 24.7085 18.6544 24.4875C19.0277 24.2664 19.4723 24.1559 19.9881 24.1559C20.5039 24.1559 20.9484 24.2664 21.3218 24.4875C21.7 24.7085 21.9874 25.0254 22.1839 25.438C22.3853 25.8506 22.486 26.3369 22.486 26.897C22.486 27.4569 22.3853 27.9433 22.1839 28.3559C21.9874 28.7636 21.7 29.078 21.3218 29.2991C20.9484 29.5152 20.5039 29.6233 19.9881 29.6233ZM19.9881 28.7906C20.3025 28.7906 20.5727 28.717 20.7986 28.5696C21.0246 28.4173 21.1965 28.1987 21.3144 27.9138C21.4323 27.6289 21.4913 27.2899 21.4913 26.897C21.4913 26.4991 21.4323 26.1577 21.3144 25.8727C21.1965 25.5878 21.0246 25.3692 20.7986 25.2169C20.5727 25.0647 20.3025 24.9885 19.9881 24.9885C19.6737 24.9885 19.4035 25.0647 19.1776 25.2169C18.9565 25.3692 18.7846 25.5878 18.6618 25.8727C18.5439 26.1577 18.4849 26.4991 18.4849 26.897C18.4849 27.2899 18.5439 27.6289 18.6618 27.9138C18.7846 28.1987 18.9565 28.4173 19.1776 28.5696C19.4035 28.717 19.6737 28.7906 19.9881 28.7906ZM25.3276 29.6233C24.8511 29.6233 24.4311 29.5152 24.0676 29.2991C23.7041 29.078 23.4192 28.7612 23.2129 28.3485C23.0066 27.9359 22.9034 27.452 22.9034 26.897C22.9034 26.3468 23.0041 25.8654 23.2055 25.4527C23.4069 25.0352 23.6894 24.7159 24.0529 24.4948C24.4213 24.2689 24.8511 24.1559 25.3423 24.1559C25.9908 24.1559 26.5016 24.318 26.875 24.6422C27.2532 24.9664 27.4988 25.4331 27.6118 26.0422L26.6097 26.0938C26.5459 25.745 26.4059 25.4748 26.1897 25.2833C25.9785 25.0868 25.696 24.9885 25.3423 24.9885C25.0476 24.9885 24.7897 25.0671 24.5687 25.2243C24.3525 25.3766 24.1855 25.5977 24.0676 25.8875C23.9546 26.1724 23.8981 26.5089 23.8981 26.897C23.8981 27.285 23.9571 27.6215 24.075 27.9064C24.1929 28.1913 24.3599 28.4099 24.576 28.5622C24.7922 28.7145 25.0452 28.7906 25.335 28.7906C25.7132 28.7906 26.0104 28.6875 26.2266 28.4812C26.4427 28.2699 26.5802 27.9727 26.6392 27.5896L27.6413 27.6412C27.5381 28.2699 27.2876 28.7587 26.8897 29.1075C26.4967 29.4513 25.976 29.6233 25.3276 29.6233ZM29.6598 29.5054C29.6598 29.078 29.7187 28.7071 29.8366 28.3927C29.9594 28.0734 30.1584 27.7836 30.4335 27.5233C30.7086 27.2629 31.0868 27.0075 31.5682 26.7569C31.8236 26.6194 32.0177 26.504 32.1503 26.4106C32.2879 26.3124 32.3861 26.2117 32.445 26.1085C32.5089 26.0054 32.5408 25.8801 32.5408 25.7327C32.5408 25.5068 32.4671 25.3275 32.3198 25.1948C32.1724 25.0573 31.9636 24.9885 31.6935 24.9885C31.3987 24.9885 31.1629 25.072 30.9861 25.2391C30.8093 25.4061 30.7012 25.6492 30.6619 25.9685L29.6745 25.9096C29.7236 25.3594 29.9226 24.9296 30.2714 24.6201C30.625 24.3106 31.0991 24.1559 31.6935 24.1559C32.0717 24.1559 32.3984 24.2222 32.6735 24.3548C32.9535 24.4826 33.1647 24.6643 33.3071 24.9001C33.4545 25.1359 33.5282 25.4085 33.5282 25.718C33.5282 25.9882 33.4815 26.2166 33.3882 26.4033C33.2998 26.5899 33.1573 26.7619 32.9608 26.9191C32.7693 27.0762 32.4917 27.2506 32.1282 27.4422C31.7057 27.6682 31.384 27.8892 31.1629 28.1054C30.9419 28.3166 30.824 28.5057 30.8093 28.6727H33.5282V29.5054H29.6598Z"
            fill="#F4F4F5"
          />
          <path
            d="M14.883 12.6566H15.5462L17.4546 17.8882H16.9094L16.3494 16.3187H14.0873L13.5273 17.8882H12.982L14.883 12.6566ZM16.1799 15.8324L15.2146 13.1061L14.2567 15.8324H16.1799ZM18.0764 12.6566H18.5775V17.8882H18.0764V12.6566ZM21.6147 18.0061C21.1578 18.0061 20.755 17.898 20.4062 17.6819C20.0624 17.4608 19.7947 17.144 19.6031 16.7313C19.4115 16.3187 19.3157 15.8349 19.3157 15.2798C19.3157 14.7247 19.4115 14.2408 19.6031 13.8282C19.7947 13.4106 20.0624 13.0913 20.4062 12.8703C20.755 12.6492 21.1578 12.5387 21.6147 12.5387C22.2091 12.5387 22.6831 12.6959 23.0368 13.0103C23.3905 13.3247 23.6238 13.7643 23.7368 14.3292L23.2062 14.3661C23.1277 13.9485 22.9533 13.6219 22.6831 13.3861C22.4178 13.1503 22.0617 13.0324 21.6147 13.0324C21.261 13.0324 20.9491 13.1233 20.6789 13.305C20.4136 13.4819 20.2073 13.7398 20.0599 14.0787C19.9175 14.4177 19.8462 14.818 19.8462 15.2798C19.8462 15.7415 19.9175 16.1419 20.0599 16.4808C20.2073 16.8149 20.4136 17.0703 20.6789 17.2471C20.9491 17.424 21.261 17.5124 21.6147 17.5124C22.0862 17.5124 22.4596 17.3871 22.7347 17.1366C23.0098 16.8812 23.1817 16.5226 23.2505 16.0608L23.781 16.0977C23.6877 16.6871 23.4519 17.1538 23.0736 17.4977C22.7003 17.8366 22.214 18.0061 21.6147 18.0061ZM24.571 12.6566H26.4058C26.784 12.6566 27.1082 12.7205 27.3784 12.8482C27.6535 12.971 27.8647 13.1503 28.0121 13.3861C28.1594 13.617 28.2331 13.8945 28.2331 14.2187C28.2331 14.538 28.1594 14.8156 28.0121 15.0513C27.8647 15.2871 27.6535 15.4689 27.3784 15.5966C27.1082 15.7194 26.784 15.7808 26.4058 15.7808H25.0721V17.8882H24.571V12.6566ZM26.4058 15.2945C26.8331 15.2945 27.1549 15.2036 27.371 15.0219C27.5921 14.8401 27.7026 14.5724 27.7026 14.2187C27.7026 13.865 27.5921 13.5973 27.371 13.4156C27.1549 13.2338 26.8331 13.1429 26.4058 13.1429H25.0721V15.2945H26.4058ZM29.923 12.6566H30.5861L32.4945 17.8882H31.9493L31.3893 16.3187H29.1272L28.5672 17.8882H28.0219L29.923 12.6566ZM31.2198 15.8324L30.2545 13.1061L29.2967 15.8324H31.2198Z"
            fill="#D4D4D8"
          />
          <line
            x1="10.4938"
            y1="21.2488"
            x2="34.9881"
            y2="21.2488"
            stroke="#E4E4E7"
            strokeWidth="0.263158"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_2018"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27272A" />
          <stop offset="1" stopColor="#52525C" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_2018"
          x1="11.9583"
          y1="8.8133"
          x2="33.985"
          y2="33.2538"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#52525C" />
          <stop offset="1" stopColor="#27272A" />
        </linearGradient>
      </defs>
    </svg>
  ),
  hipaa: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_4905)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0736 7.30078H18.5513C17.4523 7.40753 16.5515 7.91698 15.6382 8.43349L15.6382 8.4335C15.3095 8.61938 14.9792 8.80617 14.6375 8.97544C13.1797 9.69771 11.6905 10.3538 10.1701 10.9436C9.31299 11.2764 8.4347 11.5409 7.5352 11.7372C7.4488 11.7559 7.36935 11.7893 7.29688 11.8372V11.8727C7.5102 11.9479 7.76245 11.9888 8.05363 11.9953C8.84267 12.0125 9.51349 12.0095 10.0661 11.9865C10.1506 11.9828 10.2321 11.9633 10.3106 11.928C12.4837 10.9519 14.6612 9.98527 16.8432 9.02797C16.8476 9.02613 16.852 9.02536 16.8565 9.02567C16.8777 9.02843 16.879 9.03427 16.8603 9.04318C14.6862 10.108 12.5139 11.176 10.3434 12.2473C10.2138 12.3114 9.41474 12.7999 9.89472 12.9132C10.6648 13.0953 11.6052 13.0639 12.3886 12.9939C12.4952 12.9843 12.6 12.9582 12.7029 12.9155C14.1157 12.3278 15.0315 11.9343 15.4503 11.7349C15.5082 11.7069 15.5663 11.6793 15.6245 11.6519C16.9222 11.0378 16.9367 11.0651 15.6682 11.734C14.7886 12.1972 13.894 12.6323 12.9844 13.039C12.7769 13.1321 11.6328 13.7584 12.3364 13.9538C12.4725 13.9916 12.6016 14.0121 12.7238 14.0155C13.3976 14.0333 14.0708 13.9567 14.7434 13.7856C14.8605 13.7558 14.9747 13.7083 15.0861 13.6432C15.7916 13.2327 16.4885 12.8092 17.1769 12.3727C17.1826 12.3694 17.2268 12.3621 17.1921 12.3879C16.5905 12.8389 15.9774 13.2745 15.3529 13.6948C15.2118 13.7897 15.1129 13.8702 15.0562 13.9363C14.891 14.1289 14.5539 14.61 15.0282 14.733C15.5751 14.8745 16.5412 14.457 17.0397 14.2275C17.4891 14.0207 17.9114 13.6074 18.2623 13.264L18.2623 13.264L18.2623 13.264L18.2817 13.245C18.3135 13.2141 18.3187 13.2542 18.3011 13.2736C18.0812 13.5218 17.8525 13.7621 17.6151 13.9943C17.442 14.1642 17.3197 14.3066 17.2481 14.4215C16.2811 15.9736 18.2741 15.2192 18.7317 14.9459C19.0251 14.7708 19.3157 14.3372 19.4771 14.0773C19.4847 14.065 19.4923 14.055 19.4999 14.0473C19.5306 14.016 19.5374 14.0203 19.5203 14.0602C19.395 14.3536 19.2423 14.6318 19.0622 14.8948C18.8756 15.1671 18.9696 15.539 19.3333 15.6045C19.9746 15.7197 20.5823 15.1432 20.8306 14.6275C20.8349 14.6186 20.8427 14.6117 20.8525 14.6082C20.917 14.5857 20.7513 14.9203 20.694 15.036L20.694 15.036L20.694 15.036C20.6842 15.0557 20.6777 15.069 20.6759 15.0731C20.6145 15.2129 20.5891 15.3212 20.5999 15.398C20.6298 15.6155 20.8211 15.675 21.0262 15.6307C21.5992 15.5072 22.0821 15.0501 22.375 14.569C22.3793 14.5618 22.3816 14.5535 22.3816 14.545C22.3658 13.4218 22.3524 12.6862 22.3413 12.3381C22.3296 11.975 22.3313 11.6482 22.3465 11.3579C22.0265 11.3502 21.7496 11.3301 21.5157 11.2976C21.0295 11.2303 20.8074 10.6556 20.7551 10.2381C20.7421 10.1328 20.7309 10.0254 20.7197 9.91727C20.6412 9.1606 20.5585 8.36393 19.7843 7.94825C18.9876 7.52014 17.6982 7.77544 16.9177 8.14733C16.6867 8.25724 16.4617 8.36722 16.2377 8.47668C15.6119 8.78252 14.9945 9.08425 14.2795 9.36898C14.2774 9.3698 14.2738 9.37189 14.2694 9.37443C14.2515 9.3848 14.2205 9.40273 14.2216 9.37313C14.2217 9.36881 14.2231 9.3646 14.2257 9.36094C14.2282 9.35728 14.2317 9.35432 14.2358 9.35239C15.1708 8.93273 16.0943 8.49064 17.0065 8.02613C17.1644 7.94594 17.3811 7.86514 17.6564 7.78373C18.1853 7.62751 18.7113 7.58097 19.2407 7.65332C20.2115 7.7865 20.6664 8.52659 20.7936 9.39571C20.8053 9.47557 20.8144 9.57357 20.8245 9.68219C20.8751 10.2286 20.9506 11.044 21.5138 11.1708C21.7195 11.2172 21.9931 11.24 22.3346 11.239L22.319 10.9648C22.3183 10.9535 22.3134 10.9428 22.3051 10.9348C22.2969 10.9268 22.2859 10.9221 22.2743 10.9215C22.0977 10.9123 21.9254 10.8988 21.7573 10.881C21.118 10.8134 21.057 9.96774 21.0224 9.48751L21.0186 9.43534C20.9317 8.26069 20.3701 7.38696 19.0736 7.30078ZM23.952 11.3634C23.8584 11.3678 23.7589 11.3724 23.653 11.38C23.6381 12.3764 23.6176 13.3716 23.5913 14.3658C23.5897 14.4355 23.6046 14.4991 23.6359 14.5565C23.8796 14.9977 24.2298 15.3257 24.6866 15.5404C24.9543 15.6667 25.3977 15.7916 25.411 15.3441C25.4132 15.2722 25.3913 15.19 25.345 15.0976C25.309 15.0257 25.2745 14.953 25.2415 14.8796C25.12 14.6105 25.1422 14.5988 25.308 14.8446C25.32 14.8627 25.3322 14.8808 25.3446 14.8989C25.5682 15.2289 26.004 15.6077 26.4317 15.6307C26.8196 15.6515 27.0755 15.5183 27.0323 15.0999C27.0253 15.0332 26.9961 14.9624 26.9445 14.8874C26.7672 14.6318 26.6174 14.3613 26.4949 14.0759L26.4943 14.0738L26.4941 14.0718L26.4944 14.0696L26.495 14.0679C26.4956 14.0667 26.4965 14.0657 26.4975 14.0649C26.4986 14.0641 26.4998 14.0636 26.5011 14.0635L26.5672 14.1485L26.5673 14.1486L26.5674 14.1488L26.5674 14.1488L26.5677 14.1492C26.6999 14.3195 26.9863 14.6884 27.0266 14.7353C27.3186 15.0754 27.8997 15.2694 28.3327 15.357C28.7319 15.4376 29.1806 15.3736 28.9683 14.8455C28.8421 14.5317 28.6996 14.2814 28.4347 14.0395C28.3382 13.951 28.2445 13.8599 28.1537 13.7662C27.6951 13.2931 27.7171 13.2711 28.2197 13.7003C28.3102 13.7774 28.4013 13.8539 28.4931 13.9298C28.9793 14.3317 30.2502 14.833 30.8636 14.7685C31.6346 14.6883 31.016 13.9418 30.7302 13.751C30.1035 13.3332 29.4873 12.9014 28.8815 12.4556C28.8549 12.436 28.8321 12.4183 28.8131 12.4026C28.6852 12.2979 28.6914 12.2899 28.8316 12.3787C29.5276 12.8189 30.2219 13.2412 30.9144 13.6455C31.0305 13.7134 31.1484 13.7628 31.268 13.7939C31.9693 13.9759 32.7478 14.0644 33.4742 14.0114C33.7054 13.9943 34.1014 13.8662 33.7975 13.5685C33.6041 13.379 33.3827 13.2274 33.1333 13.1137C31.7854 12.4989 30.4668 11.8295 29.1777 11.1054C29.1562 11.0931 29.1556 11.0919 29.1758 11.1017C30.5406 11.7493 31.9234 12.3584 33.3242 12.9289C33.4299 12.9719 33.5377 12.9983 33.6475 13.0082C34.366 13.0708 35.0843 13.0631 35.8024 12.9851C35.9493 12.9691 36.092 12.936 36.2306 12.8856C36.3123 12.8561 36.3254 12.8069 36.27 12.7381C36.1149 12.5449 35.9246 12.3923 35.6989 12.2805C33.5565 11.2166 31.4098 10.1608 29.2589 9.11322C29.2543 9.11085 29.2508 9.10674 29.2489 9.1017C29.2432 9.08358 29.2551 9.08097 29.2845 9.09387C31.4317 10.0321 33.5736 10.9814 35.7103 11.9418C35.7891 11.9771 35.8711 11.9968 35.9562 12.0008C36.7203 12.0376 37.4841 12.0329 38.2478 11.9865C38.3953 11.9776 38.5416 11.9545 38.6865 11.9174C38.6968 11.9146 38.7059 11.9086 38.7122 11.9003C38.7186 11.8921 38.7219 11.882 38.7216 11.8717C38.7193 11.7834 38.1676 11.6695 37.9373 11.622C37.889 11.612 37.8548 11.605 37.8429 11.6017C36.9206 11.3479 35.9675 11.0175 34.9835 10.6105C33.3147 9.92014 31.7233 9.21553 30.2369 8.37728L30.1894 8.3505C29.2617 7.82668 28.4334 7.35904 27.32 7.31599C26.1103 7.26898 25.3579 7.74594 25.0849 8.91783C25.0582 9.03241 25.0418 9.19421 25.0233 9.37641C24.962 9.98194 24.8778 10.8128 24.3172 10.8851C24.1165 10.9106 23.9148 10.9249 23.7119 10.928C23.6995 10.9281 23.6877 10.933 23.679 10.9415C23.6703 10.95 23.6654 10.9616 23.6654 10.9736L23.6639 11.239C23.9436 11.2635 24.5864 11.2575 24.7991 11.004C24.9732 10.7963 25.0822 10.5565 25.1262 10.2847C25.1525 10.1221 25.1712 9.96165 25.1897 9.8035L25.1897 9.80346L25.1897 9.80343L25.1898 9.80339L25.1898 9.80335C25.2475 9.31007 25.3026 8.83918 25.5743 8.39709C25.8844 7.89295 26.4303 7.68143 27.0394 7.63903C27.8626 7.58143 28.5885 7.82244 29.3168 8.19341C30.1191 8.60232 30.9333 8.98772 31.7594 9.34963C31.7987 9.36683 31.7968 9.37636 31.7537 9.3782C31.7442 9.37881 31.7347 9.37728 31.7252 9.37359C31.0228 9.10275 30.3289 8.7621 29.6401 8.42402L29.6401 8.42401C29.4476 8.32952 29.2555 8.23523 29.0638 8.14272C28.4684 7.85577 27.8161 7.72428 27.1068 7.74825C25.5838 7.79986 25.3327 8.98235 25.2781 10.204C25.2737 10.3063 25.243 10.4341 25.186 10.5874C24.9148 11.3186 24.5549 11.3354 23.952 11.3634ZM23.9444 8.72196C23.9444 9.22639 23.5231 9.63532 23.0035 9.63532C22.4838 9.63532 22.0625 9.22639 22.0625 8.72196C22.0625 8.21752 22.4838 7.80859 23.0035 7.80859C23.5231 7.80859 23.9444 8.21752 23.9444 8.72196ZM23.4354 19.2164C23.9105 19.0149 24.3602 18.7703 24.7846 18.4828C24.8251 18.4553 24.8743 18.4248 24.9283 18.3913L24.9284 18.3913C25.222 18.2092 25.6559 17.9402 25.5713 17.6136C25.5245 17.4321 25.4047 17.3439 25.2119 17.3491C24.7837 17.3602 24.2111 16.9814 23.9239 16.7012C23.8521 16.6308 23.8443 16.5689 23.9007 16.5155C23.9051 16.5112 23.9087 16.5062 23.9112 16.5006C23.9136 16.495 23.9149 16.4889 23.9149 16.4829C23.915 16.4768 23.9138 16.4707 23.9114 16.4651C23.909 16.4595 23.9055 16.4544 23.9011 16.45C23.8622 16.4116 23.8575 16.3616 23.8869 16.2998C24.017 16.0255 24.2377 15.8758 24.5492 15.851C25.1037 15.8072 25.9763 15.9758 26.1329 16.5869C26.1354 16.5965 26.1411 16.6052 26.1491 16.6118C26.5773 16.9473 26.9367 17.5408 26.8095 18.0874C26.5745 19.0961 25.2513 19.6298 24.364 19.9284C24.3582 19.9304 24.352 19.9313 24.3458 19.931C24.3396 19.9307 24.3335 19.9292 24.3279 19.9265L22.5918 19.121C22.5839 19.1173 22.5772 19.1114 22.5725 19.1042C22.5679 19.097 22.5653 19.0886 22.5652 19.08L22.4123 9.7846C22.4122 9.77796 22.4106 9.77142 22.4077 9.76543C22.4047 9.75945 22.4004 9.75416 22.395 9.74995C22.3897 9.74574 22.3835 9.7427 22.3768 9.74104C22.3701 9.73938 22.3631 9.73915 22.3563 9.74036C22.1819 9.77078 22.0944 9.69121 22.0938 9.50165C22.0938 9.46325 22.1096 9.42731 22.1412 9.39382C22.1455 9.3892 22.1508 9.38549 22.1566 9.38293C22.1625 9.38036 22.1688 9.379 22.1753 9.37891C22.1817 9.37882 22.1882 9.38002 22.1941 9.38243C22.2001 9.38483 22.2055 9.3884 22.2101 9.3929C22.3506 9.53238 22.4834 9.62193 22.6084 9.66156C23.0654 9.80595 23.4566 9.71671 23.782 9.39382C23.7906 9.38522 23.8023 9.38025 23.8147 9.37999C23.827 9.37973 23.839 9.3842 23.848 9.39244C23.8923 9.43238 23.9086 9.48829 23.8969 9.56018C23.8709 9.71901 23.7862 9.77769 23.6429 9.73622C23.6359 9.73416 23.6285 9.73372 23.6213 9.73491C23.6141 9.7361 23.6073 9.7389 23.6014 9.74309C23.5954 9.74728 23.5906 9.75274 23.5872 9.75906C23.5837 9.76538 23.5818 9.77239 23.5816 9.77953C23.5332 11.8247 23.484 13.8507 23.434 15.8574C23.4068 16.9628 23.3851 18.0682 23.3689 19.1735C23.3688 19.1812 23.3707 19.1889 23.3744 19.1957C23.3781 19.2025 23.3835 19.2083 23.3901 19.2126C23.3967 19.2168 23.4044 19.2194 23.4123 19.2201C23.4202 19.2207 23.4281 19.2195 23.4354 19.2164ZM24.835 16.2264C24.8351 16.2149 24.8306 16.2036 24.8218 16.1929C24.8131 16.1823 24.8002 16.1726 24.784 16.1644C24.7677 16.1562 24.7484 16.1497 24.7271 16.1451C24.7058 16.1406 24.683 16.1382 24.6599 16.1381C24.6133 16.1377 24.5686 16.1466 24.5355 16.1627C24.5025 16.1788 24.4838 16.2009 24.4837 16.224C24.4836 16.2354 24.488 16.2468 24.4968 16.2574C24.5055 16.268 24.5184 16.2777 24.5347 16.2859C24.5509 16.2941 24.5702 16.3006 24.5915 16.3052C24.6128 16.3097 24.6356 16.3121 24.6587 16.3123C24.7053 16.3126 24.75 16.3037 24.7831 16.2876C24.8161 16.2715 24.8348 16.2495 24.835 16.2264ZM22.5395 27.688C22.7974 27.91 23.0477 28.1255 23.2629 28.3449C23.4832 28.5698 23.616 28.7142 23.6613 28.7781C24.089 29.3808 23.9048 29.8444 23.4595 30.3583C22.7303 31.1997 21.8197 32.4689 22.5352 33.6071C22.5412 33.6166 22.5477 33.6232 22.5546 33.6269C22.5822 33.6423 22.5917 33.6352 22.5831 33.6057C22.5701 33.5611 22.5561 33.516 22.542 33.4706L22.5419 33.4705C22.478 33.2647 22.4119 33.0515 22.4212 32.8458C22.4667 31.8631 23.2106 31.1761 23.8923 30.5466L23.8977 30.5417C24.3421 30.1311 24.7114 29.4154 24.4147 28.8343C24.2678 28.5464 24.0542 28.2661 23.7738 27.9933C23.6245 27.8483 23.4709 27.704 23.3163 27.5588L23.3158 27.5583L23.3156 27.5581C22.8037 27.0774 22.2819 26.5872 21.8762 26.0324C21.4185 25.4066 21.8681 24.8541 22.3733 24.4758C22.8926 24.0867 23.4595 23.7381 24.0261 23.3896C24.3085 23.216 24.5908 23.0423 24.8671 22.8638C25.4539 22.4845 26.0217 21.8458 25.65 21.1149C25.5538 20.9254 25.4164 20.7662 25.2379 20.6375C24.5536 20.1439 23.7116 19.77 22.9035 19.411L22.9035 19.411L22.9035 19.411C22.721 19.3299 22.5402 19.2496 22.3633 19.1689C21.7793 18.902 21.3535 18.6384 20.8303 18.2924L20.8066 18.2767C20.6006 18.141 20.3765 17.9934 20.3285 17.7583C20.2899 17.5678 20.3812 17.4277 20.6024 17.338C20.6123 17.3341 20.6231 17.3334 20.6333 17.3361C20.9841 17.4292 21.8952 16.9131 22.0371 16.5887C22.0414 16.579 22.0422 16.5682 22.0392 16.558C22.0363 16.5479 22.0299 16.539 22.021 16.5329L22.0001 16.5186C21.9942 16.5146 21.9893 16.5092 21.9858 16.5031C21.9823 16.4969 21.9804 16.49 21.9801 16.483C21.9797 16.476 21.9811 16.469 21.984 16.4625C21.9869 16.4561 21.9913 16.4504 21.9968 16.4458L22.0248 16.4228C22.0318 16.417 22.037 16.4094 22.0396 16.4009C22.0422 16.3924 22.0422 16.3833 22.0395 16.3748C21.7775 15.5076 20.282 15.8191 19.877 16.3426C19.8384 16.3924 19.82 16.4381 19.802 16.483C19.7768 16.5457 19.7523 16.6067 19.6743 16.6744C19.3616 16.9457 19.1643 17.2791 19.0823 17.6748C18.9133 18.4924 19.8647 19.2108 20.5056 19.5251C20.6183 19.5801 20.9115 19.6953 21.3853 19.8707C22.0094 20.1014 22.6347 20.3295 23.2611 20.555C23.7097 20.7163 25.3281 21.4896 24.4038 22.1163C24.0499 22.356 23.2622 22.9088 22.0405 23.7748C21.6914 24.0222 21.384 24.3295 21.1185 24.697C20.7273 25.2389 20.8094 25.7191 21.1707 26.2716C21.5263 26.8156 22.0467 27.2636 22.5395 27.688ZM21.4001 16.1957C21.4087 16.2063 21.413 16.2176 21.4128 16.2289H21.4128C21.4126 16.2403 21.4079 16.2514 21.3989 16.2617C21.39 16.272 21.3769 16.2813 21.3606 16.289C21.3442 16.2967 21.3248 16.3028 21.3035 16.3067C21.2823 16.3107 21.2595 16.3126 21.2366 16.3122C21.1902 16.3114 21.146 16.3015 21.1135 16.2848C21.0811 16.2681 21.0631 16.2459 21.0635 16.223C21.0637 16.2117 21.0684 16.2006 21.0773 16.1903C21.0863 16.18 21.0993 16.1707 21.1157 16.163C21.1321 16.1552 21.1514 16.1492 21.1727 16.1453C21.194 16.1413 21.2168 16.1394 21.2397 16.1398C21.2626 16.1402 21.2853 16.1428 21.3064 16.1475C21.3276 16.1522 21.3467 16.1589 21.3628 16.1672C21.3788 16.1754 21.3915 16.1851 21.4001 16.1957ZM21.7927 23.3472L21.7925 23.3472C21.1373 22.9721 20.2923 22.4884 20.1631 21.7698C20.0231 20.9905 20.9151 20.3854 21.566 20.1057C21.5773 20.1007 21.5901 20.1002 21.6016 20.1043L23.2984 20.7135C23.3077 20.7169 23.3156 20.723 23.3212 20.7309C23.3267 20.7389 23.3295 20.7483 23.3292 20.7578L23.2813 22.6997C23.2811 22.7069 23.2793 22.7139 23.2758 22.7202C23.2723 22.7265 23.2674 22.732 23.2613 22.7361L22.1371 23.5149C22.1295 23.5203 22.1205 23.5233 22.1111 23.5236C22.1017 23.5239 22.0924 23.5216 22.0844 23.5168C21.9942 23.4626 21.8958 23.4063 21.7927 23.3472ZM21.4544 22.0735C21.8146 22.3398 22.181 22.5982 22.5535 22.8486C22.6044 22.8827 22.6293 22.8698 22.628 22.8099L22.5919 20.6407C22.5918 20.6333 22.5897 20.626 22.5861 20.6195C22.5824 20.6129 22.5771 20.6073 22.5707 20.6032C22.5644 20.599 22.5571 20.5964 22.5494 20.5956C22.5418 20.5947 22.5341 20.5957 22.5269 20.5983C22.1238 20.7509 20.664 21.49 21.4544 22.0735ZM23.4793 27.5085C23.2219 27.2836 22.8996 26.9619 22.7045 26.7573C22.6963 26.7491 22.6917 26.7382 22.6916 26.7269L22.6556 24.4527C22.6554 24.445 22.6573 24.4373 22.6609 24.4305C22.6646 24.4236 22.6699 24.4178 22.6765 24.4135L23.748 23.7191C23.7562 23.7138 23.7659 23.7111 23.7757 23.7113C23.7856 23.7116 23.7951 23.7148 23.803 23.7205C24.4834 24.2168 25.4096 25.1016 24.8992 26.0099C24.5751 26.5868 24.1219 27.0871 23.5396 27.5108C23.5307 27.5173 23.5199 27.5206 23.5089 27.5202C23.4979 27.5198 23.4874 27.5156 23.4793 27.5085ZM23.5903 24.5269C23.5033 24.4529 23.4126 24.383 23.3183 24.3172C23.2696 24.2831 23.2444 24.2953 23.2428 24.3536L23.1859 26.89C23.1843 26.9527 23.206 26.9616 23.2509 26.9168C23.4218 26.746 23.5881 26.5712 23.7499 26.3923C23.9322 26.1905 24.0642 26.0071 24.1458 25.8421C24.4121 25.3034 23.9773 24.8546 23.5903 24.5269ZM22.4608 30.9952C22.5107 31.0416 22.5602 31.0877 22.609 31.1338C22.6139 31.1384 22.6197 31.142 22.6262 31.1442C22.6326 31.1464 22.6394 31.1473 22.6462 31.1467C22.6531 31.1462 22.6597 31.1442 22.6656 31.1409C22.6715 31.1376 22.6767 31.1332 22.6807 31.1278L23.0899 30.5812C23.0958 30.5734 23.0989 30.5642 23.0989 30.555L23.1459 28.4448C23.1461 28.4383 23.1449 28.4319 23.1423 28.4259C23.1398 28.42 23.136 28.4146 23.1312 28.4103L22.4286 27.7665C22.4197 27.7583 22.4079 27.7537 22.3955 27.7539C22.3832 27.7541 22.3714 27.7589 22.3626 27.7674L22.3463 27.7833C21.9152 28.2035 21.2952 28.8078 21.3931 29.4485C21.4915 30.0925 21.9887 30.5555 22.4608 30.9952ZM22.1684 28.8803C22.3045 28.6963 22.4615 28.5192 22.6394 28.349C22.6922 28.2986 22.7191 28.3094 22.7201 28.3812L22.7552 30.6407C22.7562 30.7141 22.7334 30.7218 22.6868 30.6637C22.589 30.5411 22.4841 30.4115 22.3721 30.2748C22.1433 29.9964 21.932 29.6541 22.0151 29.2918C22.0603 29.0946 22.1114 28.9574 22.1684 28.8803ZM23.0125 34.0863C23.0309 33.3287 23.0502 32.5756 23.0704 31.8269C23.0733 31.7243 23.1026 31.7166 23.1583 31.8038C23.4086 32.1952 23.4276 32.5966 23.2152 33.008C23.2121 33.0141 23.2105 33.0201 23.2105 33.0259C23.2105 33.0309 23.2108 33.0355 23.2114 33.0398C23.2122 33.043 23.2137 33.0459 23.216 33.0484C23.2182 33.0509 23.221 33.0527 23.2242 33.0538C23.2274 33.0549 23.2308 33.0552 23.2341 33.0547C23.2375 33.0542 23.2406 33.0529 23.2433 33.0508C23.5414 32.813 23.5599 32.2232 23.4555 31.8988C23.408 31.751 23.342 31.6098 23.2575 31.4752C23.2536 31.4691 23.2484 31.464 23.2422 31.4601C23.2359 31.4563 23.2289 31.4539 23.2216 31.4532C23.2143 31.4524 23.2069 31.4533 23.2 31.4558C23.1932 31.4582 23.187 31.4622 23.182 31.4674C23.044 31.6112 22.9269 31.7702 22.8307 31.9444C22.7981 32.0034 22.7823 32.0691 22.7832 32.1416C22.7937 32.7539 22.803 33.3662 22.8112 33.9785C22.8125 34.0694 22.8185 34.1424 22.8293 34.1974C22.8407 34.2554 22.8557 34.3124 22.8744 34.3683C22.9006 34.4454 22.925 34.4448 22.9475 34.3665C22.9586 34.3266 22.9706 34.2869 22.9836 34.2476C23.0019 34.1926 23.0116 34.1388 23.0125 34.0863Z"
          fill="url(#paint1_linear_1_4905)"
        />
        <path
          d="M10.4578 29.8555V26.8126H11.1092V28.0512H12.2621V26.8126H12.9135V29.8555H12.2621V28.5998H11.1092V29.8555H10.4578ZM13.4879 29.8555V26.8126H14.1393V29.8555H13.4879ZM14.7142 29.8555V26.8126H15.9313C16.6599 26.8126 17.1013 27.1898 17.1013 27.8069C17.1013 28.424 16.6599 28.8055 15.9313 28.8055H15.3656V29.8555H14.7142ZM15.3656 28.2569H15.8928C16.2356 28.2569 16.4328 28.1026 16.4328 27.8069C16.4328 27.5112 16.2356 27.3612 15.8928 27.3612H15.3656V28.2569ZM17.0022 29.8555L18.0993 26.8126H18.8708L19.9679 29.8555H19.2908L19.0679 29.2083H17.8979L17.675 29.8555H17.0022ZM18.0822 28.6726H18.8879L18.485 27.4983L18.0822 28.6726ZM20.1328 29.8555L21.2299 26.8126H22.0013L23.0985 29.8555H22.4213L22.1985 29.2083H21.0285L20.8056 29.8555H20.1328ZM21.2128 28.6726H22.0185L21.6156 27.4983L21.2128 28.6726ZM11.7478 33.924C10.9163 33.924 10.3206 33.3326 10.3206 32.3383C10.3206 31.3698 10.8821 30.744 11.7606 30.744C12.5578 30.744 12.9863 31.1512 13.1149 31.8755L12.4378 31.9012C12.3692 31.5198 12.1378 31.2926 11.7606 31.2926C11.2763 31.2926 10.9935 31.704 10.9935 32.3383C10.9935 32.9812 11.2892 33.3755 11.7563 33.3755C12.1635 33.3755 12.3863 33.1312 12.4463 32.7198L13.1278 32.7455C13.0035 33.4869 12.5406 33.924 11.7478 33.924ZM14.9508 33.924C14.0251 33.924 13.4679 33.3198 13.4679 32.3383C13.4679 31.3569 14.0251 30.744 14.9508 30.744C15.8765 30.744 16.4337 31.3569 16.4337 32.3383C16.4337 33.3198 15.8765 33.924 14.9508 33.924ZM14.9508 33.3755C15.4565 33.3755 15.7608 32.9983 15.7608 32.3383C15.7608 31.6783 15.4565 31.2926 14.9508 31.2926C14.4408 31.2926 14.1408 31.6783 14.1408 32.3383C14.1408 32.9983 14.4408 33.3755 14.9508 33.3755ZM16.8654 33.8555V30.8126H17.7354L18.5111 33.0283L19.2826 30.8126H20.1526V33.8555H19.5011V31.884L18.7854 33.8469H18.2283L17.5168 31.884V33.8555H16.8654ZM20.7284 33.8555V30.8126H21.9456C22.6741 30.8126 23.1156 31.1898 23.1156 31.8069C23.1156 32.424 22.6741 32.8055 21.9456 32.8055H21.3798V33.8555H20.7284ZM21.3798 32.2569H21.907C22.2498 32.2569 22.447 32.1026 22.447 31.8069C22.447 31.5112 22.2498 31.3612 21.907 31.3612H21.3798V32.2569ZM23.6079 33.8555V30.8126H24.2593V33.3069H25.6607V33.8555H23.6079ZM25.9935 33.8555V30.8126H26.6449V33.8555H25.9935ZM27.0008 33.8555L28.0979 30.8126H28.8694L29.9665 33.8555H29.2894L29.0665 33.2083H27.8965L27.6736 33.8555H27.0008ZM28.0808 32.6726H28.8865L28.4836 31.4983L28.0808 32.6726ZM30.2541 33.8555V30.8126H30.9741L32.1827 32.9126V30.8126H32.8341V33.8555H32.1055L30.9055 31.8283V33.8555H30.2541ZM33.9856 33.8555V31.3612H33.077V30.8126H35.5541V31.3612H34.6413V33.8555H33.9856Z"
          fill="#101828"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_4905"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_4905"
          x1="30.5498"
          y1="10.0698"
          x2="20.9753"
          y2="31.2119"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.473541" stopColor="#364153" stopOpacity="0.7" />
          <stop offset="0.811446" stopColor="#364153" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  hipaaDark: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_2028)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0736 7.30078H18.5513C17.4523 7.40753 16.5515 7.91698 15.6382 8.43349L15.6382 8.4335C15.3095 8.61938 14.9792 8.80617 14.6375 8.97544C13.1797 9.69771 11.6905 10.3538 10.1701 10.9436C9.31299 11.2764 8.4347 11.5409 7.5352 11.7372C7.4488 11.7559 7.36935 11.7893 7.29688 11.8372V11.8727C7.5102 11.9479 7.76245 11.9888 8.05363 11.9953C8.84267 12.0125 9.51349 12.0095 10.0661 11.9865C10.1506 11.9828 10.2321 11.9633 10.3106 11.928C12.4837 10.9519 14.6612 9.98527 16.8432 9.02797C16.8476 9.02613 16.852 9.02536 16.8565 9.02567C16.8777 9.02843 16.879 9.03427 16.8603 9.04318C14.6862 10.108 12.5139 11.176 10.3434 12.2473C10.2138 12.3114 9.41474 12.7999 9.89472 12.9132C10.6648 13.0953 11.6052 13.0639 12.3886 12.9939C12.4952 12.9843 12.6 12.9582 12.7029 12.9155C14.1157 12.3278 15.0315 11.9343 15.4503 11.7349C15.5082 11.7069 15.5663 11.6793 15.6245 11.6519C16.9222 11.0378 16.9367 11.0651 15.6682 11.734C14.7886 12.1972 13.894 12.6323 12.9844 13.039C12.7769 13.1321 11.6328 13.7584 12.3364 13.9538C12.4725 13.9916 12.6016 14.0121 12.7238 14.0155C13.3976 14.0333 14.0708 13.9567 14.7434 13.7856C14.8605 13.7558 14.9747 13.7083 15.0861 13.6432C15.7916 13.2327 16.4885 12.8092 17.1769 12.3727C17.1826 12.3694 17.2268 12.3621 17.1921 12.3879C16.5905 12.8389 15.9774 13.2745 15.3529 13.6948C15.2118 13.7897 15.1129 13.8702 15.0562 13.9363C14.891 14.1289 14.5539 14.61 15.0282 14.733C15.5751 14.8745 16.5412 14.457 17.0397 14.2275C17.4891 14.0207 17.9114 13.6074 18.2623 13.264L18.2623 13.264L18.2623 13.264L18.2817 13.245C18.3135 13.2141 18.3187 13.2542 18.3011 13.2736C18.0812 13.5218 17.8525 13.7621 17.6151 13.9943C17.442 14.1642 17.3197 14.3066 17.2481 14.4215C16.2811 15.9736 18.2741 15.2192 18.7317 14.9459C19.0251 14.7708 19.3157 14.3372 19.4771 14.0773C19.4847 14.065 19.4923 14.055 19.4999 14.0473C19.5306 14.016 19.5374 14.0203 19.5203 14.0602C19.395 14.3536 19.2423 14.6318 19.0622 14.8948C18.8756 15.1671 18.9696 15.539 19.3333 15.6045C19.9746 15.7197 20.5823 15.1432 20.8306 14.6275C20.8349 14.6186 20.8427 14.6117 20.8525 14.6082C20.917 14.5857 20.7513 14.9203 20.694 15.036L20.694 15.036L20.694 15.036C20.6842 15.0557 20.6777 15.069 20.6759 15.0731C20.6145 15.2129 20.5891 15.3212 20.5999 15.398C20.6298 15.6155 20.8211 15.675 21.0262 15.6307C21.5992 15.5072 22.0821 15.0501 22.375 14.569C22.3793 14.5618 22.3816 14.5535 22.3816 14.545C22.3658 13.4218 22.3524 12.6862 22.3413 12.3381C22.3296 11.975 22.3313 11.6482 22.3465 11.3579C22.0265 11.3502 21.7496 11.3301 21.5157 11.2976C21.0295 11.2303 20.8074 10.6556 20.7551 10.2381C20.7421 10.1328 20.7309 10.0254 20.7197 9.91727C20.6412 9.1606 20.5585 8.36393 19.7843 7.94825C18.9876 7.52014 17.6982 7.77544 16.9177 8.14733C16.6867 8.25724 16.4617 8.36722 16.2377 8.47668C15.6119 8.78252 14.9945 9.08425 14.2795 9.36898C14.2774 9.3698 14.2738 9.37189 14.2694 9.37443C14.2515 9.3848 14.2205 9.40273 14.2216 9.37313C14.2217 9.36881 14.2231 9.3646 14.2257 9.36094C14.2282 9.35728 14.2317 9.35432 14.2358 9.35239C15.1708 8.93273 16.0943 8.49064 17.0065 8.02613C17.1644 7.94594 17.3811 7.86514 17.6564 7.78373C18.1853 7.62751 18.7113 7.58097 19.2407 7.65332C20.2115 7.7865 20.6664 8.52659 20.7936 9.39571C20.8053 9.47557 20.8144 9.57357 20.8245 9.68219C20.8751 10.2286 20.9506 11.044 21.5138 11.1708C21.7195 11.2172 21.9931 11.24 22.3346 11.239L22.319 10.9648C22.3183 10.9535 22.3134 10.9428 22.3051 10.9348C22.2969 10.9268 22.2859 10.9221 22.2743 10.9215C22.0977 10.9123 21.9254 10.8988 21.7573 10.881C21.118 10.8134 21.057 9.96774 21.0224 9.48751L21.0186 9.43534C20.9317 8.26069 20.3701 7.38696 19.0736 7.30078ZM23.952 11.3634C23.8584 11.3678 23.7589 11.3724 23.653 11.38C23.6381 12.3764 23.6176 13.3716 23.5913 14.3658C23.5897 14.4355 23.6046 14.4991 23.6359 14.5565C23.8796 14.9977 24.2298 15.3257 24.6866 15.5404C24.9543 15.6667 25.3977 15.7916 25.411 15.3441C25.4132 15.2722 25.3913 15.19 25.345 15.0976C25.309 15.0257 25.2745 14.953 25.2415 14.8796C25.12 14.6105 25.1422 14.5988 25.308 14.8446C25.32 14.8627 25.3322 14.8808 25.3446 14.8989C25.5682 15.2289 26.004 15.6077 26.4317 15.6307C26.8196 15.6515 27.0755 15.5183 27.0323 15.0999C27.0253 15.0332 26.9961 14.9624 26.9445 14.8874C26.7672 14.6318 26.6174 14.3613 26.4949 14.0759L26.4943 14.0738L26.4941 14.0718L26.4944 14.0696L26.495 14.0679C26.4956 14.0667 26.4965 14.0657 26.4975 14.0649C26.4986 14.0641 26.4998 14.0636 26.5011 14.0635L26.5672 14.1485L26.5673 14.1486L26.5674 14.1488L26.5674 14.1488L26.5677 14.1492C26.6999 14.3195 26.9863 14.6884 27.0266 14.7353C27.3186 15.0754 27.8997 15.2694 28.3327 15.357C28.7319 15.4376 29.1806 15.3736 28.9683 14.8455C28.8421 14.5317 28.6996 14.2814 28.4347 14.0395C28.3382 13.951 28.2445 13.8599 28.1537 13.7662C27.6951 13.2931 27.7171 13.2711 28.2197 13.7003C28.3102 13.7774 28.4013 13.8539 28.4931 13.9298C28.9793 14.3317 30.2502 14.833 30.8636 14.7685C31.6346 14.6883 31.016 13.9418 30.7302 13.751C30.1035 13.3332 29.4873 12.9014 28.8815 12.4556C28.8549 12.436 28.8321 12.4183 28.8131 12.4026C28.6852 12.2979 28.6914 12.2899 28.8316 12.3787C29.5276 12.8189 30.2219 13.2412 30.9144 13.6455C31.0305 13.7134 31.1484 13.7628 31.268 13.7939C31.9693 13.9759 32.7478 14.0644 33.4742 14.0114C33.7054 13.9943 34.1014 13.8662 33.7975 13.5685C33.6041 13.379 33.3827 13.2274 33.1333 13.1137C31.7854 12.4989 30.4668 11.8295 29.1777 11.1054C29.1562 11.0931 29.1556 11.0919 29.1758 11.1017C30.5406 11.7493 31.9234 12.3584 33.3242 12.9289C33.4299 12.9719 33.5377 12.9983 33.6475 13.0082C34.366 13.0708 35.0843 13.0631 35.8024 12.9851C35.9493 12.9691 36.092 12.936 36.2306 12.8856C36.3123 12.8561 36.3254 12.8069 36.27 12.7381C36.1149 12.5449 35.9246 12.3923 35.6989 12.2805C33.5565 11.2166 31.4098 10.1608 29.2589 9.11322C29.2543 9.11085 29.2508 9.10674 29.2489 9.1017C29.2432 9.08358 29.2551 9.08097 29.2845 9.09387C31.4317 10.0321 33.5736 10.9814 35.7103 11.9418C35.7891 11.9771 35.8711 11.9968 35.9562 12.0008C36.7203 12.0376 37.4841 12.0329 38.2478 11.9865C38.3953 11.9776 38.5416 11.9545 38.6865 11.9174C38.6968 11.9146 38.7059 11.9086 38.7122 11.9003C38.7186 11.8921 38.7219 11.882 38.7216 11.8717C38.7193 11.7834 38.1676 11.6695 37.9373 11.622C37.889 11.612 37.8548 11.605 37.8429 11.6017C36.9206 11.3479 35.9675 11.0175 34.9835 10.6105C33.3147 9.92014 31.7233 9.21553 30.2369 8.37728L30.1894 8.3505C29.2617 7.82668 28.4334 7.35904 27.32 7.31599C26.1103 7.26898 25.3579 7.74594 25.0849 8.91783C25.0582 9.03241 25.0418 9.19421 25.0233 9.37641C24.962 9.98194 24.8778 10.8128 24.3172 10.8851C24.1165 10.9106 23.9148 10.9249 23.7119 10.928C23.6995 10.9281 23.6877 10.933 23.679 10.9415C23.6703 10.95 23.6654 10.9616 23.6654 10.9736L23.6639 11.239C23.9436 11.2635 24.5864 11.2575 24.7991 11.004C24.9732 10.7963 25.0822 10.5565 25.1262 10.2847C25.1525 10.1221 25.1712 9.96165 25.1897 9.8035L25.1897 9.80346L25.1897 9.80343L25.1898 9.80339L25.1898 9.80335C25.2475 9.31007 25.3026 8.83918 25.5743 8.39709C25.8844 7.89295 26.4303 7.68143 27.0394 7.63903C27.8626 7.58143 28.5885 7.82244 29.3168 8.19341C30.1191 8.60232 30.9333 8.98772 31.7594 9.34963C31.7987 9.36683 31.7968 9.37636 31.7537 9.3782C31.7442 9.37881 31.7347 9.37728 31.7252 9.37359C31.0228 9.10275 30.3289 8.7621 29.6401 8.42402L29.6401 8.42401C29.4476 8.32952 29.2555 8.23523 29.0638 8.14272C28.4684 7.85577 27.8161 7.72428 27.1068 7.74825C25.5838 7.79986 25.3327 8.98235 25.2781 10.204C25.2737 10.3063 25.243 10.4341 25.186 10.5874C24.9148 11.3186 24.5549 11.3354 23.952 11.3634ZM23.9444 8.72196C23.9444 9.22639 23.5231 9.63532 23.0035 9.63532C22.4838 9.63532 22.0625 9.22639 22.0625 8.72196C22.0625 8.21752 22.4838 7.80859 23.0035 7.80859C23.5231 7.80859 23.9444 8.21752 23.9444 8.72196ZM23.4354 19.2164C23.9105 19.0149 24.3602 18.7703 24.7846 18.4828C24.8251 18.4553 24.8743 18.4248 24.9283 18.3913L24.9284 18.3913C25.222 18.2092 25.6559 17.9402 25.5713 17.6136C25.5245 17.4321 25.4047 17.3439 25.2119 17.3491C24.7837 17.3602 24.2111 16.9814 23.9239 16.7012C23.8521 16.6308 23.8443 16.5689 23.9007 16.5155C23.9051 16.5112 23.9087 16.5062 23.9112 16.5006C23.9136 16.495 23.9149 16.4889 23.9149 16.4829C23.915 16.4768 23.9138 16.4707 23.9114 16.4651C23.909 16.4595 23.9055 16.4544 23.9011 16.45C23.8622 16.4116 23.8575 16.3616 23.8869 16.2998C24.017 16.0255 24.2377 15.8758 24.5492 15.851C25.1037 15.8072 25.9763 15.9758 26.1329 16.5869C26.1354 16.5965 26.1411 16.6052 26.1491 16.6118C26.5773 16.9473 26.9367 17.5408 26.8095 18.0874C26.5745 19.0961 25.2513 19.6298 24.364 19.9284C24.3582 19.9304 24.352 19.9313 24.3458 19.931C24.3396 19.9307 24.3335 19.9292 24.3279 19.9265L22.5918 19.121C22.5839 19.1173 22.5772 19.1114 22.5725 19.1042C22.5679 19.097 22.5653 19.0886 22.5652 19.08L22.4123 9.7846C22.4122 9.77796 22.4106 9.77142 22.4077 9.76543C22.4047 9.75945 22.4004 9.75416 22.395 9.74995C22.3897 9.74574 22.3835 9.7427 22.3768 9.74104C22.3701 9.73938 22.3631 9.73915 22.3563 9.74036C22.1819 9.77078 22.0944 9.69121 22.0938 9.50165C22.0938 9.46325 22.1096 9.42731 22.1412 9.39382C22.1455 9.3892 22.1508 9.38549 22.1566 9.38293C22.1625 9.38036 22.1688 9.379 22.1753 9.37891C22.1817 9.37882 22.1882 9.38002 22.1941 9.38243C22.2001 9.38483 22.2055 9.3884 22.2101 9.3929C22.3506 9.53238 22.4834 9.62193 22.6084 9.66156C23.0654 9.80595 23.4566 9.71671 23.782 9.39382C23.7906 9.38522 23.8023 9.38025 23.8147 9.37999C23.827 9.37973 23.839 9.3842 23.848 9.39244C23.8923 9.43238 23.9086 9.48829 23.8969 9.56018C23.8709 9.71901 23.7862 9.77769 23.6429 9.73622C23.6359 9.73416 23.6285 9.73372 23.6213 9.73491C23.6141 9.7361 23.6073 9.7389 23.6014 9.74309C23.5954 9.74728 23.5906 9.75274 23.5872 9.75906C23.5837 9.76538 23.5818 9.77239 23.5816 9.77953C23.5332 11.8247 23.484 13.8507 23.434 15.8574C23.4068 16.9628 23.3851 18.0682 23.3689 19.1735C23.3688 19.1812 23.3707 19.1889 23.3744 19.1957C23.3781 19.2025 23.3835 19.2083 23.3901 19.2126C23.3967 19.2168 23.4044 19.2194 23.4123 19.2201C23.4202 19.2207 23.4281 19.2195 23.4354 19.2164ZM24.835 16.2264C24.8351 16.2149 24.8306 16.2036 24.8218 16.1929C24.8131 16.1823 24.8002 16.1726 24.784 16.1644C24.7677 16.1562 24.7484 16.1497 24.7271 16.1451C24.7058 16.1406 24.683 16.1382 24.6599 16.1381C24.6133 16.1377 24.5686 16.1466 24.5355 16.1627C24.5025 16.1788 24.4838 16.2009 24.4837 16.224C24.4836 16.2354 24.488 16.2468 24.4968 16.2574C24.5055 16.268 24.5184 16.2777 24.5347 16.2859C24.5509 16.2941 24.5702 16.3006 24.5915 16.3052C24.6128 16.3097 24.6356 16.3121 24.6587 16.3123C24.7053 16.3126 24.75 16.3037 24.7831 16.2876C24.8161 16.2715 24.8348 16.2495 24.835 16.2264ZM22.5395 27.688C22.7974 27.91 23.0477 28.1255 23.2629 28.3449C23.4832 28.5698 23.616 28.7142 23.6613 28.7781C24.089 29.3808 23.9048 29.8444 23.4595 30.3583C22.7303 31.1997 21.8197 32.4689 22.5352 33.6071C22.5412 33.6166 22.5477 33.6232 22.5546 33.6269C22.5822 33.6423 22.5917 33.6352 22.5831 33.6057C22.5701 33.5611 22.5561 33.516 22.542 33.4706L22.5419 33.4705C22.478 33.2647 22.4119 33.0515 22.4212 32.8458C22.4667 31.8631 23.2106 31.1761 23.8923 30.5466L23.8977 30.5417C24.3421 30.1311 24.7114 29.4154 24.4147 28.8343C24.2678 28.5464 24.0542 28.2661 23.7738 27.9933C23.6245 27.8483 23.4709 27.704 23.3163 27.5588L23.3158 27.5583L23.3156 27.5581C22.8037 27.0774 22.2819 26.5872 21.8762 26.0324C21.4185 25.4066 21.8681 24.8541 22.3733 24.4758C22.8926 24.0867 23.4595 23.7381 24.0261 23.3896C24.3085 23.216 24.5908 23.0423 24.8671 22.8638C25.4539 22.4845 26.0217 21.8458 25.65 21.1149C25.5538 20.9254 25.4164 20.7662 25.2379 20.6375C24.5536 20.1439 23.7116 19.77 22.9035 19.411L22.9035 19.411L22.9035 19.411C22.721 19.3299 22.5402 19.2496 22.3633 19.1689C21.7793 18.902 21.3535 18.6384 20.8303 18.2924L20.8066 18.2767C20.6006 18.141 20.3765 17.9934 20.3285 17.7583C20.2899 17.5678 20.3812 17.4277 20.6024 17.338C20.6123 17.3341 20.6231 17.3334 20.6333 17.3361C20.9841 17.4292 21.8952 16.9131 22.0371 16.5887C22.0414 16.579 22.0422 16.5682 22.0392 16.558C22.0363 16.5479 22.0299 16.539 22.021 16.5329L22.0001 16.5186C21.9942 16.5146 21.9893 16.5092 21.9858 16.5031C21.9823 16.4969 21.9804 16.49 21.9801 16.483C21.9797 16.476 21.9811 16.469 21.984 16.4625C21.9869 16.4561 21.9913 16.4504 21.9968 16.4458L22.0248 16.4228C22.0318 16.417 22.037 16.4094 22.0396 16.4009C22.0422 16.3924 22.0422 16.3833 22.0395 16.3748C21.7775 15.5076 20.282 15.8191 19.877 16.3426C19.8384 16.3924 19.82 16.4381 19.802 16.483C19.7768 16.5457 19.7523 16.6067 19.6743 16.6744C19.3616 16.9457 19.1643 17.2791 19.0823 17.6748C18.9133 18.4924 19.8647 19.2108 20.5056 19.5251C20.6183 19.5801 20.9115 19.6953 21.3853 19.8707C22.0094 20.1014 22.6347 20.3295 23.2611 20.555C23.7097 20.7163 25.3281 21.4896 24.4038 22.1163C24.0499 22.356 23.2622 22.9088 22.0405 23.7748C21.6914 24.0222 21.384 24.3295 21.1185 24.697C20.7273 25.2389 20.8094 25.7191 21.1707 26.2716C21.5263 26.8156 22.0467 27.2636 22.5395 27.688ZM21.4001 16.1957C21.4087 16.2063 21.413 16.2176 21.4128 16.2289H21.4128C21.4126 16.2403 21.4079 16.2514 21.3989 16.2617C21.39 16.272 21.3769 16.2813 21.3606 16.289C21.3442 16.2967 21.3248 16.3028 21.3035 16.3067C21.2823 16.3107 21.2595 16.3126 21.2366 16.3122C21.1902 16.3114 21.146 16.3015 21.1135 16.2848C21.0811 16.2681 21.0631 16.2459 21.0635 16.223C21.0637 16.2117 21.0684 16.2006 21.0773 16.1903C21.0863 16.18 21.0993 16.1707 21.1157 16.163C21.1321 16.1552 21.1514 16.1492 21.1727 16.1453C21.194 16.1413 21.2168 16.1394 21.2397 16.1398C21.2626 16.1402 21.2853 16.1428 21.3064 16.1475C21.3276 16.1522 21.3467 16.1589 21.3628 16.1672C21.3788 16.1754 21.3915 16.1851 21.4001 16.1957ZM21.7927 23.3472L21.7925 23.3472C21.1373 22.9721 20.2923 22.4884 20.1631 21.7698C20.0231 20.9905 20.9151 20.3854 21.566 20.1057C21.5773 20.1007 21.5901 20.1002 21.6016 20.1043L23.2984 20.7135C23.3077 20.7169 23.3156 20.723 23.3212 20.7309C23.3267 20.7389 23.3295 20.7483 23.3292 20.7578L23.2813 22.6997C23.2811 22.7069 23.2793 22.7139 23.2758 22.7202C23.2723 22.7265 23.2674 22.732 23.2613 22.7361L22.1371 23.5149C22.1295 23.5203 22.1205 23.5233 22.1111 23.5236C22.1017 23.5239 22.0924 23.5216 22.0844 23.5168C21.9942 23.4626 21.8958 23.4063 21.7927 23.3472ZM21.4544 22.0735C21.8146 22.3398 22.181 22.5982 22.5535 22.8486C22.6044 22.8827 22.6293 22.8698 22.628 22.8099L22.5919 20.6407C22.5918 20.6333 22.5897 20.626 22.5861 20.6195C22.5824 20.6129 22.5771 20.6073 22.5707 20.6032C22.5644 20.599 22.5571 20.5964 22.5494 20.5956C22.5418 20.5947 22.5341 20.5957 22.5269 20.5983C22.1238 20.7509 20.664 21.49 21.4544 22.0735ZM23.4793 27.5085C23.2219 27.2836 22.8996 26.9619 22.7045 26.7573C22.6963 26.7491 22.6917 26.7382 22.6916 26.7269L22.6556 24.4527C22.6554 24.445 22.6573 24.4373 22.6609 24.4305C22.6646 24.4236 22.6699 24.4178 22.6765 24.4135L23.748 23.7191C23.7562 23.7138 23.7659 23.7111 23.7757 23.7113C23.7856 23.7116 23.7951 23.7148 23.803 23.7205C24.4834 24.2168 25.4096 25.1016 24.8992 26.0099C24.5751 26.5868 24.1219 27.0871 23.5396 27.5108C23.5307 27.5173 23.5199 27.5206 23.5089 27.5202C23.4979 27.5198 23.4874 27.5156 23.4793 27.5085ZM23.5903 24.5269C23.5033 24.4529 23.4126 24.383 23.3183 24.3172C23.2696 24.2831 23.2444 24.2953 23.2428 24.3536L23.1859 26.89C23.1843 26.9527 23.206 26.9616 23.2509 26.9168C23.4218 26.746 23.5881 26.5712 23.7499 26.3923C23.9322 26.1905 24.0642 26.0071 24.1458 25.8421C24.4121 25.3034 23.9773 24.8546 23.5903 24.5269ZM22.4608 30.9952C22.5107 31.0416 22.5602 31.0877 22.609 31.1338C22.6139 31.1384 22.6197 31.142 22.6262 31.1442C22.6326 31.1464 22.6394 31.1473 22.6462 31.1467C22.6531 31.1462 22.6597 31.1442 22.6656 31.1409C22.6715 31.1376 22.6767 31.1332 22.6807 31.1278L23.0899 30.5812C23.0958 30.5734 23.0989 30.5642 23.0989 30.555L23.1459 28.4448C23.1461 28.4383 23.1449 28.4319 23.1423 28.4259C23.1398 28.42 23.136 28.4146 23.1312 28.4103L22.4286 27.7665C22.4197 27.7583 22.4079 27.7537 22.3955 27.7539C22.3832 27.7541 22.3714 27.7589 22.3626 27.7674L22.3463 27.7833C21.9152 28.2035 21.2952 28.8078 21.3931 29.4485C21.4915 30.0925 21.9887 30.5555 22.4608 30.9952ZM22.1684 28.8803C22.3045 28.6963 22.4615 28.5192 22.6394 28.349C22.6922 28.2986 22.7191 28.3094 22.7201 28.3812L22.7552 30.6407C22.7562 30.7141 22.7334 30.7218 22.6868 30.6637C22.589 30.5411 22.4841 30.4115 22.3721 30.2748C22.1433 29.9964 21.932 29.6541 22.0151 29.2918C22.0603 29.0946 22.1114 28.9574 22.1684 28.8803ZM23.0125 34.0863C23.0309 33.3287 23.0502 32.5756 23.0704 31.8269C23.0733 31.7243 23.1026 31.7166 23.1583 31.8038C23.4086 32.1952 23.4276 32.5966 23.2152 33.008C23.2121 33.0141 23.2105 33.0201 23.2105 33.0259C23.2105 33.0309 23.2108 33.0355 23.2114 33.0398C23.2122 33.043 23.2137 33.0459 23.216 33.0484C23.2182 33.0509 23.221 33.0527 23.2242 33.0538C23.2274 33.0549 23.2308 33.0552 23.2341 33.0547C23.2375 33.0542 23.2406 33.0529 23.2433 33.0508C23.5414 32.813 23.5599 32.2232 23.4555 31.8988C23.408 31.751 23.342 31.6098 23.2575 31.4752C23.2536 31.4691 23.2484 31.464 23.2422 31.4601C23.2359 31.4563 23.2289 31.4539 23.2216 31.4532C23.2143 31.4524 23.2069 31.4533 23.2 31.4558C23.1932 31.4582 23.187 31.4622 23.182 31.4674C23.044 31.6112 22.9269 31.7702 22.8307 31.9444C22.7981 32.0034 22.7823 32.0691 22.7832 32.1416C22.7937 32.7539 22.803 33.3662 22.8112 33.9785C22.8125 34.0694 22.8185 34.1424 22.8293 34.1974C22.8407 34.2554 22.8557 34.3124 22.8744 34.3683C22.9006 34.4454 22.925 34.4448 22.9475 34.3665C22.9586 34.3266 22.9706 34.2869 22.9836 34.2476C23.0019 34.1926 23.0116 34.1388 23.0125 34.0863Z"
          fill="url(#paint1_linear_1_2028)"
        />
        <path
          d="M10.4578 26.8126H11.1092V28.2569L10.8221 28.0512H12.5535L12.2621 28.2569V26.8126H12.9135V29.8555H12.2621V28.394L12.5535 28.5998H10.8221L11.1092 28.394V29.8555H10.4578V26.8126ZM13.4544 26.8126H14.1058V29.8555H13.4544V26.8126ZM14.643 26.8126H15.8602C16.1002 26.8126 16.3087 26.8526 16.4859 26.9326C16.663 27.0126 16.7973 27.1283 16.8887 27.2798C16.983 27.4283 17.0302 27.604 17.0302 27.8069C17.0302 28.0098 16.983 28.1869 16.8887 28.3383C16.7973 28.4869 16.663 28.6026 16.4859 28.6855C16.3087 28.7655 16.1002 28.8055 15.8602 28.8055H15.2945V29.8555H14.643V26.8126ZM15.8216 28.2569C15.9959 28.2569 16.1287 28.2183 16.2202 28.1412C16.3145 28.064 16.3616 27.9526 16.3616 27.8069C16.3616 27.6612 16.3145 27.5512 16.2202 27.4769C16.1287 27.3998 15.9959 27.3612 15.8216 27.3612H15.2945V28.2569H15.8216ZM18.0497 26.8126H18.8211L19.9183 29.8555H19.2411L19.0183 29.2083H17.8483L17.6254 29.8555H16.9526L18.0497 26.8126ZM18.8383 28.6726L18.4354 27.4983L18.0326 28.6726H18.8383ZM21.2263 26.8126H21.9978L23.0949 29.8555H22.4178L22.1949 29.2083H21.0249L20.802 29.8555H20.1292L21.2263 26.8126ZM22.0149 28.6726L21.612 27.4983L21.2092 28.6726H22.0149ZM11.7435 33.924C11.4663 33.924 11.2192 33.8612 11.0021 33.7355C10.7849 33.6098 10.6163 33.4269 10.4963 33.1869C10.3763 32.9469 10.3163 32.664 10.3163 32.3383C10.3163 32.0183 10.3749 31.7383 10.4921 31.4983C10.6092 31.2555 10.7763 31.0698 10.9935 30.9412C11.2106 30.8098 11.4635 30.744 11.7521 30.744C12.1435 30.744 12.4506 30.8398 12.6735 31.0312C12.8963 31.2226 13.0421 31.504 13.1106 31.8755L12.4335 31.9012C12.3963 31.7069 12.3192 31.5569 12.2021 31.4512C12.0878 31.3455 11.9378 31.2926 11.7521 31.2926C11.5921 31.2926 11.4549 31.3355 11.3406 31.4212C11.2263 31.5069 11.1378 31.6283 11.0749 31.7855C11.0149 31.9426 10.9849 32.1269 10.9849 32.3383C10.9849 32.5526 11.0149 32.7383 11.0749 32.8955C11.1378 33.0498 11.2263 33.1683 11.3406 33.2512C11.4578 33.334 11.5935 33.3755 11.7478 33.3755C11.9506 33.3755 12.1092 33.3198 12.2235 33.2083C12.3378 33.094 12.4106 32.9312 12.4421 32.7198L13.1235 32.7455C13.0606 33.1226 12.9121 33.414 12.6778 33.6198C12.4435 33.8226 12.1321 33.924 11.7435 33.924ZM14.9297 33.924C14.6268 33.924 14.3625 33.8598 14.1368 33.7312C13.914 33.6026 13.744 33.4198 13.6268 33.1826C13.5097 32.9426 13.4511 32.6612 13.4511 32.3383C13.4511 32.0155 13.5097 31.734 13.6268 31.494C13.744 31.254 13.914 31.0698 14.1368 30.9412C14.3625 30.8098 14.6268 30.744 14.9297 30.744C15.2354 30.744 15.4997 30.8098 15.7225 30.9412C15.9454 31.0698 16.1154 31.254 16.2325 31.494C16.3525 31.734 16.4125 32.0155 16.4125 32.3383C16.4125 32.6612 16.3525 32.9426 16.2325 33.1826C16.1154 33.4198 15.9454 33.6026 15.7225 33.7312C15.4997 33.8598 15.2354 33.924 14.9297 33.924ZM14.9297 33.3755C15.0982 33.3755 15.2425 33.3355 15.3625 33.2555C15.4854 33.1726 15.5797 33.054 15.6454 32.8998C15.7111 32.7426 15.744 32.5555 15.744 32.3383C15.744 32.1212 15.7111 31.934 15.6454 31.7769C15.5797 31.6198 15.4854 31.4998 15.3625 31.4169C15.2425 31.334 15.0982 31.2926 14.9297 31.2926C14.7611 31.2926 14.6154 31.334 14.4925 31.4169C14.3725 31.4998 14.2797 31.6198 14.214 31.7769C14.1511 31.934 14.1197 32.1212 14.1197 32.3383C14.1197 32.5555 14.1511 32.7426 14.214 32.8998C14.2797 33.054 14.3725 33.1726 14.4925 33.2555C14.6154 33.3355 14.7611 33.3755 14.9297 33.3755ZM16.811 30.8126H17.681L18.4567 33.0283L19.2281 30.8126H20.0981V33.8555H19.4467V31.884L18.731 33.8469H18.1739L17.4624 31.884V33.8555H16.811V30.8126ZM20.6363 30.8126H21.8535C22.0935 30.8126 22.3021 30.8526 22.4792 30.9326C22.6563 31.0126 22.7906 31.1283 22.8821 31.2798C22.9763 31.4283 23.0235 31.604 23.0235 31.8069C23.0235 32.0098 22.9763 32.1869 22.8821 32.3383C22.7906 32.4869 22.6563 32.6026 22.4792 32.6855C22.3021 32.7655 22.0935 32.8055 21.8535 32.8055H21.2878V33.8555H20.6363V30.8126ZM21.8149 32.2569C21.9892 32.2569 22.1221 32.2183 22.2135 32.1412C22.3078 32.064 22.3549 31.9526 22.3549 31.8069C22.3549 31.6612 22.3078 31.5512 22.2135 31.4769C22.1221 31.3998 21.9892 31.3612 21.8149 31.3612H21.2878V32.2569H21.8149ZM23.5158 30.8126H24.1672V33.6798L23.8072 33.3069H25.5687V33.8555H23.5158V30.8126ZM26.0395 30.8126H26.6909V33.8555H26.0395V30.8126ZM28.2115 30.8126H28.983L30.0801 33.8555H29.403L29.1801 33.2083H28.0101L27.7873 33.8555H27.1144L28.2115 30.8126ZM29.0001 32.6726L28.5973 31.4983L28.1944 32.6726H29.0001ZM30.501 30.8126H31.221L32.4296 32.9126V30.8126H33.081V33.8555H32.3524L31.1524 31.8283V33.8555H30.501V30.8126ZM34.4267 31.3612H33.5139V30.8126H35.991V31.3612H35.0824V33.8555H34.4267V31.3612Z"
          fill="#E4E4E7"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_2028"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27272A" />
          <stop offset="1" stopColor="#52525C" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_2028"
          x1="30.5498"
          y1="10.0698"
          x2="20.9753"
          y2="31.2119"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.473541" stopColor="#FAFAFA" stopOpacity="0.7" />
          <stop offset="0.811446" stopColor="#FAFAFA" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  gdpr: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_4914)"
        />
        <path
          d="M30.6146 31.3062L31.2991 33.4127L33.5139 33.4127L31.7221 34.7145L32.4065 36.821L30.6146 35.5191L28.8228 36.821L29.5072 34.7145L27.7153 33.4127L29.9302 33.4127L30.6146 31.3062Z"
          fill="url(#paint1_linear_1_4914)"
        />
        <path
          d="M23.6857 35.4549L23.0013 33.3485L22.3168 35.4549H20.102L21.8938 36.7568L21.2094 38.8633L23.0013 37.5614L24.7932 38.8633L24.1087 36.7568L25.9006 35.4549H23.6857Z"
          fill="url(#paint2_linear_1_4914)"
        />
        <path
          d="M23.6857 4.96976L23.0013 2.86328L22.3168 4.96975L20.102 4.96975L21.8938 6.27163L21.2094 8.3781L23.0013 7.07623L24.7932 8.3781L24.1087 6.27163L25.9006 4.96975L23.6857 4.96976Z"
          fill="url(#paint3_linear_1_4914)"
        />
        <path
          d="M30.6226 4.90555L31.307 7.01202L33.5219 7.01202L31.73 8.3139L32.4144 10.4204L30.6226 9.1185L28.8307 10.4204L29.5151 8.3139L27.7233 7.01202L29.9381 7.01202L30.6226 4.90555Z"
          fill="url(#paint4_linear_1_4914)"
        />
        <path
          d="M16.0644 33.4127L15.38 31.3062L14.6955 33.4127H12.4807L14.2725 34.7145L13.5881 36.821L15.38 35.5191L17.1719 36.821L16.4874 34.7145L18.2793 33.4127L16.0644 33.4127Z"
          fill="url(#paint5_linear_1_4914)"
        />
        <path
          d="M36.1956 10.4846L36.8801 12.5911L39.095 12.5911L37.3031 13.8929L37.9875 15.9994L36.1956 14.6975L34.4038 15.9994L35.0882 13.8929L33.2963 12.5911L35.5112 12.5911L36.1956 10.4846Z"
          fill="url(#paint6_linear_1_4914)"
        />
        <path
          d="M10.4755 27.8336L9.79104 25.7272L9.1066 27.8336H6.89172L8.6836 29.1355L7.99916 31.242L9.79104 29.9401L11.5829 31.242L10.8985 29.1355L12.6903 27.8336L10.4755 27.8336Z"
          fill="url(#paint7_linear_1_4914)"
        />
        <path
          d="M38.2439 18.1059L38.9283 20.2123L41.1432 20.2123L39.3513 21.5142L40.0357 23.6207L38.2439 22.3188L36.452 23.6207L37.1364 21.5142L35.3446 20.2123H37.5594L38.2439 18.1059Z"
          fill="url(#paint8_linear_1_4914)"
        />
        <path
          d="M8.44313 20.2123L7.75869 18.1059L7.07425 20.2123H4.85938L6.65125 21.5142L5.96682 23.6207L7.75869 22.3188L9.55056 23.6207L8.86613 21.5142L10.658 20.2123H8.44313Z"
          fill="url(#paint9_linear_1_4914)"
        />
        <path
          d="M36.1956 25.7272L36.8801 27.8336H39.095L37.3031 29.1355L37.9875 31.242L36.1956 29.9401L34.4038 31.242L35.0882 29.1355L33.2963 27.8336L35.5112 27.8336L36.1956 25.7272Z"
          fill="url(#paint10_linear_1_4914)"
        />
        <path
          d="M10.4755 12.591L9.79103 10.4846L9.1066 12.591H6.89172L8.6836 13.8929L7.99916 15.9994L9.79103 14.6975L11.5829 15.9994L10.8985 13.8929L12.6903 12.591H10.4755Z"
          fill="url(#paint11_linear_1_4914)"
        />
        <path
          d="M16.0565 7.01202L15.372 4.90555L14.6876 7.01202H12.4727L14.2646 8.3139L13.5802 10.4204L15.372 9.1185L17.1639 10.4204L16.4795 8.3139L18.2714 7.01203L16.0565 7.01202Z"
          fill="url(#paint12_linear_1_4914)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.2383 20.8682C15.2383 22.1882 15.9883 23.0882 17.2243 23.0882C17.8363 23.0882 18.3403 22.8302 18.5623 22.4162L18.5983 22.9922H19.2223V20.7542H17.3023V21.4802H18.1843C18.1363 21.9362 17.8243 22.2362 17.3263 22.2362C16.6243 22.2362 16.3123 21.6782 16.3123 20.8682C16.3123 20.0642 16.6483 19.4882 17.3083 19.4882C17.8063 19.4882 18.0523 19.7582 18.1303 20.2082L19.2103 20.1602C19.0123 19.2122 18.4303 18.6362 17.2963 18.6362C16.0003 18.6362 15.2383 19.5842 15.2383 20.8682ZM19.7261 18.7322V22.9922H21.2801C22.6601 22.9922 23.4341 22.2302 23.4341 20.8682C23.4341 19.5002 22.6481 18.7322 21.2441 18.7322H19.7261ZM21.2441 22.1402H20.7701V19.5842H21.2441C22.0121 19.5842 22.3601 19.9922 22.3601 20.8622C22.3601 21.7322 22.0121 22.1402 21.2441 22.1402ZM23.8059 22.6543V22.9922H24.8499V21.5822H25.5699C26.6139 21.5822 27.2499 21.0362 27.2499 20.1542C27.2499 19.2722 26.6139 18.7322 25.5699 18.7322H23.8059V22.1211H23.6798V22.6543H23.8059ZM25.4979 20.7242H24.8499V19.5842H25.4979C25.9239 19.5842 26.1819 19.7822 26.1819 20.1542C26.1819 20.5322 25.9179 20.7242 25.4979 20.7242ZM29.531 18.7322H27.581V22.9922H28.625V21.4862H29.423C29.831 21.4862 29.969 21.6362 29.993 21.9542L30.059 22.9922H31.127L31.025 21.7802C30.989 21.3542 30.767 21.1082 30.329 21.0482C30.797 20.9042 31.091 20.5202 31.091 19.9982C31.091 19.2302 30.479 18.7322 29.531 18.7322ZM29.369 20.6342H28.625V19.5842H29.357C29.789 19.5842 30.023 19.7642 30.023 20.1062C30.023 20.4422 29.789 20.6342 29.369 20.6342Z"
          fill="#101828"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_4914"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_1_4914"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#364153" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#364153" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  ),
  gdprDark: ({ className }: { className?: string }) => (
    <svg
      width="46"
      height="45"
      viewBox="0 0 46 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <g>
        <rect
          x="3"
          y="0.863281"
          width="40"
          height="40"
          rx="20"
          fill="url(#paint0_linear_1_2046)"
        />
        <path
          d="M30.6146 31.3062L31.2991 33.4127L33.5139 33.4127L31.7221 34.7145L32.4065 36.821L30.6146 35.5191L28.8228 36.821L29.5072 34.7145L27.7153 33.4127L29.9302 33.4127L30.6146 31.3062Z"
          fill="url(#paint1_linear_1_2046)"
        />
        <path
          d="M23.6857 35.4549L23.0013 33.3485L22.3168 35.4549H20.102L21.8938 36.7568L21.2094 38.8633L23.0013 37.5614L24.7932 38.8633L24.1087 36.7568L25.9006 35.4549H23.6857Z"
          fill="url(#paint2_linear_1_2046)"
        />
        <path
          d="M23.6857 4.96976L23.0013 2.86328L22.3168 4.96975L20.102 4.96975L21.8938 6.27163L21.2094 8.3781L23.0013 7.07623L24.7932 8.3781L24.1087 6.27163L25.9006 4.96975L23.6857 4.96976Z"
          fill="url(#paint3_linear_1_2046)"
        />
        <path
          d="M30.6226 4.90555L31.307 7.01202L33.5219 7.01202L31.73 8.3139L32.4144 10.4204L30.6226 9.1185L28.8307 10.4204L29.5151 8.3139L27.7233 7.01202L29.9381 7.01202L30.6226 4.90555Z"
          fill="url(#paint4_linear_1_2046)"
        />
        <path
          d="M16.0644 33.4127L15.38 31.3062L14.6955 33.4127H12.4807L14.2725 34.7145L13.5881 36.821L15.38 35.5191L17.1719 36.821L16.4874 34.7145L18.2793 33.4127L16.0644 33.4127Z"
          fill="url(#paint5_linear_1_2046)"
        />
        <path
          d="M36.1956 10.4846L36.8801 12.5911L39.095 12.5911L37.3031 13.8929L37.9875 15.9994L36.1956 14.6975L34.4038 15.9994L35.0882 13.8929L33.2963 12.5911L35.5112 12.5911L36.1956 10.4846Z"
          fill="url(#paint6_linear_1_2046)"
        />
        <path
          d="M10.4755 27.8336L9.79104 25.7272L9.1066 27.8336H6.89172L8.6836 29.1355L7.99916 31.242L9.79104 29.9401L11.5829 31.242L10.8985 29.1355L12.6903 27.8336L10.4755 27.8336Z"
          fill="url(#paint7_linear_1_2046)"
        />
        <path
          d="M38.2439 18.1059L38.9283 20.2123L41.1432 20.2123L39.3513 21.5142L40.0357 23.6207L38.2439 22.3188L36.452 23.6207L37.1364 21.5142L35.3446 20.2123H37.5594L38.2439 18.1059Z"
          fill="url(#paint8_linear_1_2046)"
        />
        <path
          d="M8.44313 20.2123L7.75869 18.1059L7.07425 20.2123H4.85938L6.65125 21.5142L5.96682 23.6207L7.75869 22.3188L9.55056 23.6207L8.86613 21.5142L10.658 20.2123H8.44313Z"
          fill="url(#paint9_linear_1_2046)"
        />
        <path
          d="M36.1956 25.7272L36.8801 27.8336H39.095L37.3031 29.1355L37.9875 31.242L36.1956 29.9401L34.4038 31.242L35.0882 29.1355L33.2963 27.8336L35.5112 27.8336L36.1956 25.7272Z"
          fill="url(#paint10_linear_1_2046)"
        />
        <path
          d="M10.4755 12.591L9.79103 10.4846L9.1066 12.591H6.89172L8.6836 13.8929L7.99916 15.9994L9.79103 14.6975L11.5829 15.9994L10.8985 13.8929L12.6903 12.591H10.4755Z"
          fill="url(#paint11_linear_1_2046)"
        />
        <path
          d="M16.0565 7.01202L15.372 4.90555L14.6876 7.01202H12.4727L14.2646 8.3139L13.5802 10.4204L15.372 9.1185L17.1639 10.4204L16.4795 8.3139L18.2714 7.01203L16.0565 7.01202Z"
          fill="url(#paint12_linear_1_2046)"
        />
        <path
          d="M17.2242 23.0882C16.8122 23.0882 16.4582 22.9942 16.1622 22.8062C15.8662 22.6182 15.6382 22.3582 15.4782 22.0262C15.3182 21.6942 15.2382 21.3082 15.2382 20.8682C15.2382 20.4402 15.3202 20.0582 15.4842 19.7222C15.6482 19.3862 15.8822 19.1222 16.1862 18.9302C16.4942 18.7342 16.8642 18.6362 17.2962 18.6362C17.6762 18.6362 17.9942 18.6982 18.2502 18.8222C18.5102 18.9422 18.7182 19.1162 18.8742 19.3442C19.0342 19.5722 19.1462 19.8442 19.2102 20.1602L18.1302 20.2082C18.0902 19.9802 18.0062 19.8042 17.8782 19.6802C17.7502 19.5522 17.5602 19.4882 17.3082 19.4882C17.0882 19.4882 16.9042 19.5482 16.7562 19.6682C16.6082 19.7882 16.4962 19.9522 16.4202 20.1602C16.3482 20.3642 16.3122 20.6002 16.3122 20.8682C16.3122 21.1362 16.3482 21.3742 16.4202 21.5822C16.4922 21.7862 16.6022 21.9462 16.7502 22.0622C16.9022 22.1782 17.0942 22.2362 17.3262 22.2362C17.4942 22.2362 17.6382 22.2042 17.7582 22.1402C17.8822 22.0762 17.9802 21.9882 18.0522 21.8762C18.1242 21.7602 18.1682 21.6282 18.1842 21.4802H17.3022V20.7542H19.2222V22.9922H18.5982L18.5442 22.1042L18.6642 22.1402C18.6242 22.3282 18.5362 22.4942 18.4002 22.6382C18.2682 22.7782 18.1002 22.8882 17.8962 22.9682C17.6962 23.0482 17.4722 23.0882 17.2242 23.0882ZM19.726 22.9922V18.7322H21.244C21.948 18.7322 22.488 18.9182 22.864 19.2902C23.244 19.6582 23.434 20.1842 23.434 20.8682C23.434 21.5482 23.248 22.0722 22.876 22.4402C22.504 22.8082 21.972 22.9922 21.28 22.9922H19.726ZM20.77 22.1402H21.244C21.628 22.1402 21.91 22.0362 22.09 21.8282C22.27 21.6202 22.36 21.2982 22.36 20.8622C22.36 20.4262 22.27 20.1042 22.09 19.8962C21.91 19.6882 21.628 19.5842 21.244 19.5842H20.77V22.1402ZM23.8058 22.9922V18.7322H25.5698C26.0938 18.7322 26.5038 18.8602 26.7998 19.1162C27.0998 19.3682 27.2498 19.7142 27.2498 20.1542C27.2498 20.4462 27.1818 20.7002 27.0458 20.9162C26.9138 21.1282 26.7218 21.2922 26.4698 21.4082C26.2178 21.5242 25.9178 21.5822 25.5698 21.5822H24.8498V22.9922H23.8058ZM24.8498 20.7242H25.4978C25.7098 20.7242 25.8758 20.6762 25.9958 20.5802C26.1198 20.4842 26.1818 20.3422 26.1818 20.1542C26.1818 19.9702 26.1218 19.8302 26.0018 19.7342C25.8818 19.6342 25.7138 19.5842 25.4978 19.5842H24.8498V20.7242ZM27.5809 22.9922V18.7322H29.5309C29.8469 18.7322 30.1209 18.7842 30.3529 18.8882C30.5889 18.9922 30.7709 19.1402 30.8989 19.3322C31.0269 19.5202 31.0909 19.7422 31.0909 19.9982C31.0909 20.1982 31.0509 20.3742 30.9709 20.5262C30.8909 20.6782 30.7789 20.8042 30.6349 20.9042C30.4949 21.0002 30.3269 21.0642 30.1309 21.0962L30.1129 21.0362C30.4049 21.0362 30.6249 21.0982 30.7729 21.2222C30.9249 21.3462 31.0089 21.5322 31.0249 21.7802L31.1269 22.9922H30.0589L29.9929 21.9542C29.9809 21.7942 29.9329 21.6762 29.8489 21.6002C29.7689 21.5242 29.6269 21.4862 29.4229 21.4862H28.6249V22.9922H27.5809ZM28.6249 20.6342H29.3689C29.5809 20.6342 29.7429 20.5882 29.8549 20.4962C29.9669 20.4042 30.0229 20.2742 30.0229 20.1062C30.0229 19.9342 29.9649 19.8042 29.8489 19.7162C29.7369 19.6282 29.5729 19.5842 29.3569 19.5842H28.6249V20.6342Z"
          fill="#D4D4D8"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_2046"
          x1="9.88803"
          y1="6.55415"
          x2="36.0447"
          y2="35.5773"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27272A" />
          <stop offset="1" stopColor="#52525C" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_1_2046"
          x1="15.8864"
          y1="51.1315"
          x2="29.5116"
          y2="5.36433"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.188554" stopColor="#FAFAFA" stopOpacity="0" />
          <stop offset="0.526459" stopColor="#FAFAFA" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  ),
  vercel: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="black"
        />
        <g clipPath="url(#clip0_1_4108)">
          <path d="M26 8L39.5 31.3829H12.5L26 8Z" fill="white" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1_4108">
          <rect
            width="27"
            height="23.4141"
            fill="white"
            transform="translate(12.5 8)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  replit: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="white"
        />
        <g clipPath="url(#clip0_1_4111)">
          <path
            d="M15.5 8.875C15.5 7.83947 16.3395 7 17.375 7H26.125C27.1605 7 28 7.83947 28 8.875V17H17.375C16.3395 17 15.5 16.1605 15.5 15.125V8.875Z"
            fill="#F26207"
          />
          <path
            d="M28 17H38.625C39.6605 17 40.5 17.8395 40.5 18.875V25.125C40.5 26.1605 39.6605 27 38.625 27H28V17Z"
            fill="#F26207"
          />
          <path
            d="M15.5 28.875C15.5 27.8395 16.3395 27 17.375 27H28V35.125C28 36.1605 27.1605 37 26.125 37H17.375C16.3395 37 15.5 36.1605 15.5 35.125V28.875Z"
            fill="#F26207"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1_4111">
          <rect
            width="25"
            height="30"
            fill="white"
            transform="translate(15.5 7)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  posthog: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="#EEEFE8"
        />
        <path
          d="M18.2508 23.0069C18.1951 23.118 18.1096 23.2115 18.0038 23.2768C17.898 23.3421 17.7762 23.3767 17.6518 23.3767C17.5275 23.3767 17.4057 23.3421 17.2999 23.2768C17.1941 23.2115 17.1086 23.118 17.0529 23.0069L16.462 21.8257C16.4155 21.7327 16.3913 21.6302 16.3913 21.5262C16.3913 21.4223 16.4155 21.3197 16.462 21.2267L17.0529 20.0456C17.1086 19.9344 17.1941 19.841 17.2999 19.7757C17.4057 19.7104 17.5275 19.6758 17.6518 19.6758C17.7762 19.6758 17.898 19.7104 18.0038 19.7757C18.1096 19.841 18.1951 19.9344 18.2508 20.0456L18.8417 21.2267C18.8882 21.3197 18.9124 21.4223 18.9124 21.5262C18.9124 21.6302 18.8882 21.7327 18.8417 21.8257L18.2508 23.0069ZM18.2508 29.7047C18.1951 29.8158 18.1096 29.9093 18.0038 29.9746C17.898 30.0399 17.7762 30.0745 17.6518 30.0745C17.5275 30.0745 17.4057 30.0399 17.2999 29.9746C17.1941 29.9093 17.1086 29.8158 17.0529 29.7047L16.4613 28.5235C16.4148 28.4305 16.3906 28.328 16.3906 28.224C16.3906 28.1201 16.4148 28.0176 16.4613 27.9246L17.0522 26.7434C17.1079 26.6322 17.1934 26.5388 17.2992 26.4735C17.405 26.4082 17.5269 26.3736 17.6512 26.3736C17.7755 26.3736 17.8974 26.4082 18.0031 26.4735C18.1089 26.5388 18.1944 26.6322 18.2501 26.7434L18.8411 27.9246C18.8875 28.0176 18.9117 28.1201 18.9117 28.224C18.9117 28.328 18.8875 28.4305 18.8411 28.5235L18.2508 29.7047Z"
          fill="#1D4AFF"
        />
        <path
          d="M10.9531 27.1607C10.9531 26.5644 11.6747 26.2649 12.0968 26.687L15.1673 29.7575C15.5894 30.1796 15.2906 30.9019 14.6936 30.9019H11.6231C11.4454 30.9019 11.275 30.8313 11.1494 30.7056C11.0237 30.58 10.9531 30.4096 10.9531 30.2319V27.1607ZM10.9531 23.926C10.9531 24.0141 10.9704 24.1013 11.004 24.1827C11.0377 24.2641 11.0871 24.3381 11.1494 24.4004L17.4546 30.7049C17.5168 30.7672 17.5906 30.8167 17.6719 30.8505C17.7532 30.8843 17.8403 30.9018 17.9283 30.9019H21.3921C21.9884 30.9019 22.2879 30.1803 21.8658 29.7582L12.0975 19.9899C11.6747 19.5671 10.9531 19.8659 10.9531 20.4622V23.926ZM10.9531 17.2282C10.9532 17.4059 11.0238 17.5762 11.1494 17.7019L24.1518 30.7062C24.2774 30.8319 24.4478 30.9025 24.6255 30.9025H28.0893C28.6856 30.9025 28.985 30.1803 28.563 29.7582L12.0968 13.2914C11.6747 12.8693 10.9531 13.1681 10.9531 13.765V17.2282ZM17.6509 17.2282C17.651 17.4059 17.7216 17.5762 17.8472 17.7019L29.9029 29.7582C30.325 30.1803 31.0466 29.8808 31.0466 29.2839V25.8207C31.0465 25.643 30.9759 25.4727 30.8503 25.347L18.7946 13.2914C18.3725 12.8693 17.6509 13.1681 17.6509 13.765V17.2282ZM25.4924 13.2914C25.0703 12.8693 24.3488 13.1681 24.3488 13.765V17.2289C24.349 17.4063 24.4196 17.5764 24.5451 17.7019L29.9029 23.0604C30.325 23.4825 31.0466 23.183 31.0466 22.586V19.1229C31.0465 18.9452 30.9759 18.7748 30.8503 18.6492L25.4924 13.2914Z"
          fill="#F9BD2B"
        />
        <path
          d="M39.4424 27.2418L33.1358 20.9359C32.7138 20.5138 31.9922 20.8126 31.9922 21.4096V30.2312C31.9922 30.4089 32.0628 30.5793 32.1884 30.705C32.3141 30.8306 32.4845 30.9012 32.6622 30.9012H42.4305C42.6082 30.9012 42.7786 30.8306 42.9043 30.705C43.0299 30.5793 43.1005 30.4089 43.1005 30.2312V29.4273C43.1005 29.0574 42.7997 28.762 42.4325 28.7144C41.3008 28.567 40.2495 28.0488 39.4424 27.2418ZM35.2074 28.7579C34.9231 28.7579 34.6505 28.645 34.4494 28.444C34.2484 28.2429 34.1355 27.9703 34.1355 27.686C34.1355 27.4017 34.2484 27.129 34.4494 26.928C34.6505 26.7269 34.9231 26.614 35.2074 26.614C35.4917 26.614 35.7644 26.7269 35.9654 26.928C36.1665 27.129 36.2794 27.4017 36.2794 27.686C36.2794 27.9703 36.1665 28.2429 35.9654 28.444C35.7644 28.645 35.4917 28.7579 35.2074 28.7579Z"
          fill="black"
        />
        <path
          d="M10.9531 30.2319C10.9531 30.4096 11.0237 30.58 11.1494 30.7056C11.275 30.8313 11.4454 30.9019 11.6231 30.9019H14.6936C15.2906 30.9019 15.5894 30.1796 15.1673 29.7575L12.0968 26.687C11.6747 26.2649 10.9531 26.5637 10.9531 27.1607V30.2319ZM17.6509 18.8455L12.0968 13.2914C11.6747 12.8693 10.9531 13.1681 10.9531 13.765V17.2289C10.9533 17.4063 11.0239 17.5764 11.1494 17.7019L17.6509 24.204V18.8455ZM12.0968 19.9892C11.6747 19.5671 10.9531 19.8659 10.9531 20.4629V23.9267C10.9533 24.1041 11.0239 24.2742 11.1494 24.3997L17.6509 30.9019V25.5433L12.0968 19.9892Z"
          fill="#1D4AFF"
        />
        <path
          d="M24.3463 19.1229C24.3462 18.9452 24.2756 18.7748 24.15 18.6492L18.7921 13.2914C18.37 12.8693 17.6484 13.1681 17.6484 13.765V17.2289C17.6487 17.4063 17.7193 17.5764 17.8447 17.7019L24.3463 24.204V19.1222V19.1229ZM17.6484 30.9012H21.389C21.9859 30.9012 22.2847 30.1796 21.8626 29.7575L17.6484 25.5433V30.9019V30.9012ZM17.6484 18.8455V23.926C17.6484 24.0141 17.6657 24.1013 17.6994 24.1827C17.733 24.2641 17.7824 24.3381 17.8447 24.4004L24.3463 30.9019V25.8207C24.3462 25.643 24.2756 25.4727 24.15 25.347L17.6484 18.8455Z"
          fill="#F54E00"
        />
      </g>
      <defs></defs>
    </svg>
  ),
  googleDrive: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 87.3 78"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  ),
  workos: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="#6363F1"
        />
        <g clipPath="url(#clip0_1_4101)">
          <path
            d="M12 22.0011C12 22.557 12.1516 23.0624 12.4043 23.5173L17.3069 32.0083C17.8123 32.8675 18.5704 33.5751 19.5307 33.8783C21.3502 34.4848 23.3213 33.7267 24.2816 32.1094L25.444 30.0372L20.7942 21.9505L25.7473 13.409L26.9097 11.3873C27.2635 10.7808 27.7184 10.2754 28.2744 9.87109H20.6931C19.3791 9.87109 18.1155 10.5787 17.4585 11.7411L12.4043 20.4848C12.1516 20.9397 12 21.4451 12 22.0011Z"
            fill="white"
          />
          <path
            d="M40.0009 22.0019C40.0009 21.446 39.8493 20.9405 39.5966 20.4857L34.6435 11.8936C33.6832 10.2257 31.7121 9.51816 29.8926 10.1247C28.9323 10.4279 28.1742 11.1355 27.6688 11.9947L26.5063 13.9153L31.2067 22.0019L26.2536 30.5434L25.0912 32.6156C24.7374 33.2221 24.2825 33.7275 23.7266 34.1319H31.3583C32.6724 34.1319 33.9359 33.4243 34.593 32.2618L39.6471 23.5182C39.8493 23.0633 40.0009 22.5579 40.0009 22.0019Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1_4101">
          <rect
            width="28"
            height="28"
            fill="white"
            transform="translate(12 8)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  runwayml: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="#101828"
        />
        <path
          d="M37.678 13.2664C38.3954 15.4976 38.2063 17.5358 36.7194 19.377C36.0513 20.2045 35.105 20.7428 33.2308 21.2226C33.6954 21.6556 34.1217 22.0294 34.521 22.4302C35.2929 23.2052 36.0595 23.986 36.8108 24.781C38.5668 26.639 38.5001 29.3228 37.3076 31.4453C35.7329 34.2479 31.7191 35.1571 29.2989 33.0723C28.1452 32.0786 27.0621 31.0026 25.9522 29.9584C25.7293 29.7485 25.529 29.5145 25.2864 29.2579C25.0948 29.8493 24.9711 30.4074 24.7399 30.9169C23.4524 33.7547 19.82 34.9039 16.8601 33.4455C14.8504 32.4552 13.9101 30.7587 13.8784 28.6156C13.8134 24.2092 13.8339 19.8011 13.8679 15.3939C13.8907 12.4321 16.3064 9.88977 19.2617 9.83918C23.7709 9.762 28.2832 9.77292 32.793 9.83779C35.1105 9.87113 36.753 11.063 37.678 13.2664ZM21.0218 13.8121C20.2809 13.2306 19.4728 13.0218 18.6063 13.4803C17.7302 13.9439 17.3212 14.6789 17.3266 15.7004C17.3488 19.9172 17.3308 24.134 17.3447 28.3508C17.346 28.7318 17.3968 29.1459 17.5522 29.4864C17.9764 30.415 19.1143 30.8701 20.1817 30.6052C21.2025 30.3518 21.8008 29.5747 21.8013 28.4783C21.804 24.1995 21.7934 19.9206 21.8116 15.6418C21.8147 14.9289 21.594 14.3552 21.0218 13.8121ZM25.8643 21.1924C25.6845 21.2009 25.5046 21.2095 25.2832 21.22C25.2832 22.2251 25.2729 23.1939 25.2932 24.1622C25.2967 24.3236 25.3961 24.5182 25.513 24.6367C27.31 26.4581 29.1012 28.2862 30.9369 30.0681C31.2679 30.3895 31.7728 30.6269 32.2308 30.7023C33.164 30.8562 34.1069 30.2305 34.5663 29.2999C34.9496 28.5235 34.7691 27.5689 34.0724 26.8589C32.4945 25.2511 30.8899 23.6692 29.3299 22.0444C28.7194 21.4085 28.0705 21.0385 27.1623 21.1823C26.7788 21.243 26.3776 21.1924 25.8643 21.1924ZM29.4434 13.2325C27.9264 13.2325 26.4094 13.2325 25.0086 13.2325C25.1354 14.7766 25.2569 16.2585 25.3812 17.7726C27.7177 17.7726 30.0693 17.7785 32.4208 17.7705C33.8172 17.7656 34.7019 16.8615 34.6935 15.4759C34.6855 14.157 33.7615 13.2426 32.4172 13.2339C31.4674 13.2276 30.5175 13.2325 29.4434 13.2325Z"
          fill="#FEFEFE"
        />
      </g>
      <defs>
        <filter
          id="filter0_dddd_1_4106"
          x="0"
          y="0"
          width="52"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_4106"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1_4106"
            result="effect2_dropShadow_1_4106"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="7" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_1_4106"
            result="effect3_dropShadow_1_4106"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_1_4106"
            result="effect4_dropShadow_1_4106"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_1_4106"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  ),
  gemini: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="white"
        />
        <g clipPath="url(#clip0_1_4143)">
          <path
            d="M26 34C25.5426 30.9809 24.131 28.1874 21.9718 26.0282C19.8126 23.869 17.0191 22.4574 14 22C17.0191 21.5426 19.8126 20.131 21.9718 17.9718C24.131 15.8126 25.5426 13.0191 26 10C26.4575 13.0191 27.8692 15.8125 30.0283 17.9717C32.1875 20.1308 34.9809 21.5425 38 22C34.9809 22.4575 32.1875 23.8692 30.0283 26.0283C27.8692 28.1875 26.4575 30.9809 26 34Z"
            fill="url(#paint0_linear_1_4143)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dddd_1_4143"
          x="0"
          y="0"
          width="52"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1_4143"
            result="effect2_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="7" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_1_4143"
            result="effect3_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_1_4143"
            result="effect4_dropShadow_1_4143"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_1_4143"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1_4143"
          x1="13.9999"
          y1="2410"
          x2="1663.52"
          y2="739.48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1C7DFF" />
          <stop offset="0.52021" stopColor="#1C69FF" />
          <stop offset="1" stopColor="#F0DCD6" />
        </linearGradient>
        <clipPath id="clip0_1_4143">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(14 10)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  boat: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="#0086FF"
        />
        <path
          d="M34.4067 25.7667C33.678 26.7432 32.145 28.3644 31.2924 28.3644H27.3297V25.7646H30.486C30.9375 25.7646 31.368 25.5819 31.6788 25.2606C33.3 23.5806 34.2366 21.5814 34.2366 19.4373C34.2366 15.7791 31.5024 12.5451 27.3276 10.5963V8.84908C27.3276 8.09728 26.7186 7.48828 25.9668 7.48828C25.215 7.48828 24.606 8.09728 24.606 8.84908V9.57358C23.4363 9.23128 22.1973 8.97088 20.9037 8.82178C23.0457 11.1486 24.354 14.2608 24.354 17.6733C24.354 20.733 23.3082 23.5428 21.5505 25.7688H24.606V28.3728H20.133C19.5282 28.3728 19.0368 27.8835 19.0368 27.2766V26.1384C19.0368 25.9389 18.8751 25.7751 18.6735 25.7751H12.7767C12.6612 25.7751 12.5625 25.8696 12.5625 25.9851C12.5583 30.6429 16.2438 34.1394 20.6517 34.1394H33.0942C36.0762 34.1394 37.4097 30.3174 39.1569 27.8856C39.8352 26.9448 41.4627 26.1888 41.9562 25.9788C42.0465 25.941 42.099 25.857 42.099 25.7583V24.2463C42.099 24.093 41.9478 23.9775 41.7987 24.0195C41.7987 24.0195 34.6062 25.6722 34.5222 25.6953C34.4382 25.7205 34.4067 25.7688 34.4067 25.7688V25.7667Z"
          fill="white"
        />
        <path
          d="M22.0494 17.6649C22.0494 15.3192 21.2451 13.1604 19.9011 11.4531L13.1328 23.1648H20.4135C21.4488 21.5856 22.0515 19.6956 22.0515 17.667L22.0494 17.6649Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  supabase: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="#121212"
        />
        <g clipPath="url(#clip0_1_4134)">
          <path
            d="M28.5219 36.7564C27.7374 37.7443 26.1469 37.2031 26.128 35.9417L25.8516 17.4922H38.257C40.5039 17.4922 41.7571 20.0874 40.3599 21.8472L28.5219 36.7564Z"
            fill="url(#paint0_linear_1_4134)"
          />
          <path
            d="M28.5219 36.7564C27.7374 37.7443 26.1469 37.2031 26.128 35.9417L25.8516 17.4922H38.257C40.5039 17.4922 41.7571 20.0874 40.3599 21.8472L28.5219 36.7564Z"
            fill="url(#paint1_linear_1_4134)"
            fillOpacity="0.2"
          />
          <path
            d="M23.48 7.06882C24.2645 6.08082 25.8551 6.62217 25.874 7.88359L25.9951 26.333H13.745C11.4979 26.333 10.2447 23.7378 11.642 21.978L23.48 7.06882Z"
            fill="#3ECF8E"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dddd_1_4134"
          x="0"
          y="0"
          width="52"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_4134"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1_4134"
            result="effect2_dropShadow_1_4134"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="7" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_1_4134"
            result="effect3_dropShadow_1_4134"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_1_4134"
            result="effect4_dropShadow_1_4134"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_1_4134"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1_4134"
          x1="25.8516"
          y1="21.5829"
          x2="36.8771"
          y2="26.207"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_4134"
          x1="20.9634"
          y1="14.8902"
          x2="25.9916"
          y2="24.3555"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_1_4134">
          <rect
            width="29.9027"
            height="31"
            fill="white"
            transform="translate(11.0469 6.5)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  figma: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="white"
        />
        <g clipPath="url(#clip0_1_4123)">
          <mask
            id="mask0_1_4123"
            maskUnits="userSpaceOnUse"
            x="15"
            y="7"
            width="21"
            height="30"
          >
            <path d="M35.875 7H15.875V37H35.875V7Z" fill="white" />
          </mask>
          <g>
            <path
              d="M20.875 37.0001C23.635 37.0001 25.875 34.7601 25.875 32.0001V27.0001H20.875C18.115 27.0001 15.875 29.2401 15.875 32.0001C15.875 34.7601 18.115 37.0001 20.875 37.0001Z"
              fill="#0ACF83"
            />
            <path
              d="M15.875 21.9999C15.875 19.2399 18.115 16.9999 20.875 16.9999H25.875V26.9999H20.875C18.115 26.9999 15.875 24.7599 15.875 21.9999Z"
              fill="#A259FF"
            />
            <path
              d="M15.875 12C15.875 9.24 18.115 7 20.875 7H25.875V17H20.875C18.115 17 15.875 14.76 15.875 12Z"
              fill="#F24E1E"
            />
            <path
              d="M25.875 7H30.875C33.635 7 35.875 9.24 35.875 12C35.875 14.76 33.635 17 30.875 17H25.875V7Z"
              fill="#FF7262"
            />
            <path
              d="M35.875 21.9999C35.875 24.7599 33.635 26.9999 30.875 26.9999C28.115 26.9999 25.875 24.7599 25.875 21.9999C25.875 19.2399 28.115 16.9999 30.875 16.9999C33.635 16.9999 35.875 19.2399 35.875 21.9999Z"
              fill="#1ABCFE"
            />
          </g>
        </g>
      </g>
    </svg>
  ),
};
