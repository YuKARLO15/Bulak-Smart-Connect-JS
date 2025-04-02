import { useEffect, useRef } from "react";

const Footer = () => {
  const scriptRef = useRef(null);
  
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "gwt-footer-jsdk";
    script.src = "//gwhs.i.gov.ph/gwt-footer/footer.js";
    script.async = true;
    
    // Store the reference
    scriptRef.current = script;

    // Append to footer
    const footerDiv = document.getElementById("gwt-standard-footer");
    if (footerDiv) {
      footerDiv.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove the script from the footer
      // Temporary fix for the issue where the script is not removed
      // when the component is unmounted
      // Temporary error handling to prevent the app from crashing
      // Remove after when needed - YuKARLO15
      try {
        const footerDiv = document.getElementById("gwt-standard-footer");
        // Only remove if the script is actually a child of the footer
        if (footerDiv && scriptRef.current && footerDiv.contains(scriptRef.current)) {
          footerDiv.removeChild(scriptRef.current);
        }
      } catch (error) {
        console.log("Footer cleanup error:", error);
      }
    };
  }, []);

  return <div id="gwt-standard-footer"></div>;
};

export default Footer;