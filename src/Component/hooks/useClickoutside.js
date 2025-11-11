import { useEffect } from "react";

export default function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Nếu ref chưa được gán hoặc click nằm trong phần tử ref => bỏ qua
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // Bỏ qua nếu click vào Swiper (để không ảnh hưởng navigation)
      const swiperElements = document.querySelectorAll(
        ".swiper, .swiper-button-next, .swiper-button-prev, .swiper-pagination"
      );
      for (let el of swiperElements) {
        if (el.contains(event.target)) {
          return;
        }
      }

      // Click nằm ngoài phần tử ref => thực thi handler
      handler(event);
    };

    // Đăng ký event listener trên document để bắt được mọi click trên trang
    document.addEventListener("mousedown", listener, true);
    document.addEventListener("touchstart", listener, true);

    return () => {
      document.removeEventListener("mousedown", listener, true);
      document.removeEventListener("touchstart", listener, true);
    };
  }, [ref, handler]);
}
