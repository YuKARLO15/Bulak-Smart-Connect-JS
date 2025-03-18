import { useEffect } from "react";

const Footer = () => {
   useEffect(() => {
    const script = document.createElement("script");
    script.id = "gwt-footer-jsdk";
    script.src = "//gwhs.i.gov.ph/gwt-footer/footer.js";
    script.async = true;

    const footerDiv = document.getElementById("gwt-standard-footer");
    if (footerDiv) {
      footerDiv.appendChild(script);
    }

    return () => {
      
      if (footerDiv) {
        footerDiv.removeChild(script);
      }
    };
  }, []);

  return <div id="gwt-standard-footer"></div>;
};

export default Footer;