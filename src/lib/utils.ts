import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function calcDiscount(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

export function playFlyToCartAnimation(startElement: HTMLElement, imageUrl: string) {
  if (typeof window === "undefined") return;

  let cartIcon = document.getElementById("header-cart-icon-desktop");
  if (cartIcon && cartIcon.getBoundingClientRect().width === 0) {
    cartIcon = document.getElementById("header-cart-icon-mobile");
  }

  if (!cartIcon) return;

  const startRect = startElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const startX = startRect.left + window.scrollX;
  const startY = startRect.top + window.scrollY;
  const startW = startRect.width;
  const startH = startRect.height;

  const endX = endRect.left + window.scrollX;
  const endY = endRect.top + window.scrollY;

  const animationName = `flyToCart_${Math.random().toString(36).substring(2, 9)}`;
  const styleSheet = document.createElement("style");
  styleSheet.id = `style_${animationName}`;
  styleSheet.textContent = `
    @keyframes ${animationName} {
      0% {
        left: ${startX}px;
        top: ${startY}px;
        width: ${startW}px;
        height: ${startH}px;
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      22% {
        left: ${startX}px;
        top: ${startY - 40}px;
        width: ${startW}px;
        height: ${startH}px;
        transform: scale(1.15);
        opacity: 1;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      100% {
        left: ${endX}px;
        top: ${endY}px;
        width: 24px;
        height: 24px;
        transform: scale(0.1);
        opacity: 0.1;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  const flyImg = document.createElement("img");
  flyImg.src = imageUrl;
  flyImg.style.position = "absolute";
  flyImg.style.left = `${startX}px`;
  flyImg.style.top = `${startY}px`;
  flyImg.style.width = `${startW}px`;
  flyImg.style.height = `${startH}px`;
  flyImg.style.objectFit = "cover";
  flyImg.style.borderRadius = "12px";
  flyImg.style.zIndex = "99999";
  flyImg.style.pointerEvents = "none";
  flyImg.style.animation = `${animationName} 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

  document.body.appendChild(flyImg);

  // Clean up
  flyImg.addEventListener("animationend", () => {
    flyImg.remove();
    styleSheet.remove();
  });
}
