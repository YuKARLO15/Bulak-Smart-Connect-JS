import './footer.css';

const Footer = () => (
  <footer className="govph-footer">
    <div className="footer-row">
      <div className="footer-col logo-col">
        <img
          src="https://gwhs.i.gov.ph/gwt-footer/govph-seal-mono-footer.jpg"
          alt="Republic of the Philippines"
          className="govph-logo"
        />
        <div>
          <h4>Republic of the Philippines</h4>
          <p>All content is in the public domain unless otherwise stated.</p>
        </div>
      </div>
      <div className="footer-col about-col">
        <h4>About GOVPH</h4>
        <p>
          Learn more about the Philippine government, its structure, how government works and the
          people behind it.
        </p>
        <ul>
          <li>
            <a href="http://www.gov.ph/">GOV.PH</a>
          </li>
          <li>
            <a href="http://www.gov.ph/data">Open Data Portal</a>
          </li>
          <li>
            <a href="http://www.officialgazette.gov.ph">Official Gazette</a>
          </li>
        </ul>
      </div>
      <div className="footer-col links-col">
        <h4>Government Links</h4>
        <ul>
          <li>
            <a href="http://president.gov.ph/">Office of the President</a>
          </li>
          <li>
            <a href="http://ovp.gov.ph/">Office of the Vice President</a>
          </li>
          <li>
            <a href="http://www.senate.gov.ph/">Senate of the Philippines</a>
          </li>
          <li>
            <a href="http://www.congress.gov.ph/">House of Representatives</a>
          </li>
          <li>
            <a href="http://sc.judiciary.gov.ph/">Supreme Court</a>
          </li>
          <li>
            <a href="http://ca.judiciary.gov.ph/">Court of Appeals</a>
          </li>
          <li>
            <a href="http://sb.judiciary.gov.ph/">Sandiganbayan</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
