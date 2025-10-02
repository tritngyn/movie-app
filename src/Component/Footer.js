import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>RoPhim</h3>
            <p>Xem phim trực tuyến chất lượng cao, cập nhật nhanh chóng.</p>
          </div>
          <div className="footer-section">
            <h4>Liên kết</h4>
            <ul>
              <li>
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                >
                  API Database
                </a>
              </li>
              <li>
                <a href="https://www.rophim.mx/phimhay" target="_blank">
                  Web mẫu
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="social-icon">
              <a
                href="https://www.facebook.com/triet.nguyen.204572/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://github.com/tritngyn/"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom"> @tritngyn's side project</div>
      </footer>
    </>
  );
};
export default Footer;
