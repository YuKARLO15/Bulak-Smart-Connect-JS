import React, { useEffect, useState } from 'react';
import './TermsAndCondition.css';

const PrivacyPolicy = () => {
  const [isTagalog, setIsTagalog] = useState(false);

  useEffect(() => {
    // Use regular JavaScript variables instead of sessionStorage
    const visitedPrivacyPolicy = true;
    
    if (window.opener) {
      window.opener.postMessage('visited-privacy-policy', '*');
    }
  }, []);

  const toggleLanguage = () => {
    setIsTagalog(!isTagalog);
  };

  return (
    <div className="page-container">
      <div className="privacy-container">
        <h1 className='DataPrivacy-label'>Data Privacy Policy</h1>
        
        {/* Language Toggle Button */}
        <div className="language-toggle-container">
          <button 
            className={`language-toggle-btn ${isTagalog ? 'tagalog-active' : 'english-active'}`}
            onClick={toggleLanguage}
          >
            {isTagalog ? 'Switch to English' : 'Tagalog'}
          </button>
        </div>

        {/* English Version */}
        {!isTagalog && (
          <div className="english-content">
            <p>
              <strong>Bulak LGU Smart Connect</strong> Bulak LGU Smart Connect is committed to
              protecting and respecting your personal data privacy. This website is operated by the
              <strong> Municipal Civil Registrar Office of San Ildefonso Bulacan</strong> and is fully compliant with the
              <strong> Data Privacy Act of 2012</strong> (Republic Act No. 10173), the primary law in the Philippines
              governing the processing of personal information in both government and private sectors.
            </p>
            <p>
              This Privacy Policy may be revised, modified, or replaced to reflect updates to applicable
              laws, regulations, or system enhancements. Users will be notified of such changes for
              review and acceptance. If you do not agree to the updated Privacy Policy, you must stop
              using the Bulak LGU Smart Connect services.
            </p>

            <h2>Service Description</h2>
            <p>
              Bulak LGU Smart Connect is an online platform developed for the{' '}
              <strong>Municipal Civil Registrar Office of San Ildefonso.</strong> Through this system,
              qualified users may request the following civil registry documents:
            </p>
            <ul>
              <li>Certificate of Live Birth</li>
              <li>Certificate of Marriage</li>
              <li>Marriage License</li>
              <li>Certificate of Death</li>
              <li>Fetal Death Certificate</li>
            </ul>
            <p>
              This service integrates a web application for submitting requests. After successfully
              submitting a document request through the website, the user will be notified and required
              to proceed to the Municipal Civil Registrar Office of San Ildefonso to complete the
              transaction by paying the corresponding fees and claiming the requested document.
            </p>

            <h2>Personal Information Collected</h2>

            <h3>Certificate of Live Birth</h3>
            <ul>
              <li>Owner's Full Name</li>
              <li>Gender</li>
              <li>Place of Birth</li>
              <li>Address</li>
              <li>Father's Full Name</li>
              <li>Mother's Full Maiden Name</li>
              <li>Authorized Recipient's Full Name</li>
              <li>Contact Number</li>
            </ul>
            <h4>Sensitive Personal Information</h4>
            <ul>
              <li>Owner' Date of Birth</li>
              <li>Authorized Recipient's Date of Birth</li>
            </ul>
            <p>
              All personal and sensitive information provided, including any required documents
              submitted for the application of the Certificate of Live Birth, is protected and handled
              in accordance with the Data Privacy Act of 2012. These documents are securely stored and
              will only be accessed by authorized personnel for processing purposes.
            </p>

            <h3>Certificate of Marriage</h3>
            <ul>
              <li>Name of Husband</li>
              <li>Maiden Name of Wife</li>
              <li>Date of Marriage</li>
              <li>Place of Marriage</li>
              <li>Authorized Recipient's Full Name</li>
              <li>Contact Number</li>
            </ul>
            <h4>Sensitive Personal Information</h4>
            <ul>
              <li>Authorized Recipient's Date of Birth</li>
            </ul>
            <p>
              All personal and sensitive information provided, including any required documents
              submitted for the application of the Certificate of Marriage, is protected and handled in
              accordance with the Data Privacy Act of 2012. These documents are securely stored and will
              only be accessed by authorized personnel for processing purposes.
            </p>

            <h3>Certificate of Death</h3>
            <ul>
              <li>Deceased Person's Full Name</li>
              <li>Gender</li>
              <li>Place of Death</li>
              <li>Delivery Address</li>
              <li>Authorized Recipient's Full Name</li>
              <li>Contact Number</li>
            </ul>
            <h4>Sensitive Personal Information</h4>
            <ul>
              <li>Authorized Recipient's Date of Birth</li>
            </ul>

            <h3>Fetal Death Certificate</h3>
            <ul>
              <li>Fetus Name (if applicable)</li>
              <li>Gender</li>
              <li>Place and Date of Fetal Death</li>
              <li>Mother's Name</li>
              <li>Authorized Recipient's Full Name</li>
              <li>Contact Number</li>
            </ul>
            <h4>Sensitive Personal Information</h4>
            <ul>
              <li>Authorized Recipient's Date of Birth</li>
            </ul>
            <p>
              All personal and sensitive information provided, including any required documents
              submitted for the application of the Fetal Death Certificate, is protected and handled in
              accordance with the Data Privacy Act of 2012. These documents are securely stored and will
              only be accessed by authorized personnel for processing purposes.
            </p>

            <h3>Marriage License</h3>
            <ul>
              <li>Full Name of Groom and Bride</li>
              <li>Address and Contact Number</li>
              <li>Date of Application</li>
              <li>Place of Application</li>
            </ul>
            <h4>Sensitive Personal Information</h4>
            <ul>
              <li>Date of Birth of Groom and Bride</li>
            </ul>
            <p>
              All personal and sensitive information provided, including any required documents
              submitted for the application of the Marriage License, is protected and handled in
              accordance with the Data Privacy Act of 2012. These documents are securely stored and will
              only be accessed by authorized personnel for processing purposes.
            </p>

            <h2>Collection Method</h2>
            <p>
              The collection of data starts when the user logs onto the{' '}
              <strong>Bulak LGU Smart Connect </strong>website and agrees to the{' '}
              <strong>User Agreement </strong> and <strong> Privacy Policy. </strong> Without consent,
              the user cannot proceed. Upon agreement, the user fills out the necessary forms, and
              personal data is collected based on the document requested.
            </p>

            <h2>Timing of Collection</h2>
            <p>
              Personal Data is collected in real-time as the user completes the online application form.
              All data is encrypted and used solely for document processing. It is not used for any
              other purpose.
            </p>

            <h2>Purpose of Collected Information</h2>
            <p>
              The <strong>Municipal Civil Registrar Office of San Ildefonso</strong>, as a personal
              information controller, will use the collected data solely to validate and process
              requests for civil registry documents. All data is necessary for request validation.
              Incomplete or inaccurate information may result in rejection or delay.
            </p>
            <p>
              The office reserves the right to retain your personal data when required by law and will
              delete it once legal requirements cease to apply.
            </p>

            <h2>Storage and Transmission of Collected Information</h2>
            <p>
              Collected data is stored in a secured, password-protected database with encryption and
              firewall protection. When transmitted, data is securely sent to the appropriate personnel
              within the Municipal Civil Registrar Office. Only authorized personnel may access this
              information.
            </p>

            <h2>Method of Use</h2>
            <p>
              Personal Data is used strictly to process requests for civil registry documents. Data will
              not be used for marketing or other unrelated purposes. All processing is done according to
              government-approved information security standards.
            </p>

            <h2>Third Party Transfer</h2>
            <p>
              No personal data is transmitted to payment processors or third-party marketing companies.
            </p>

            <h2>Retention Period</h2>
            <p>
              Personal data will be retained only as long as needed to fulfill its intended purpose or
              comply with legal requirements. Once retention is no longer necessary, the data will be
              securely deleted.
            </p>

            <h2>Participation of Data Subject</h2>
            <p>
              You have the right to access, correct, or limit your personal data. If you believe your
              rights under the Data Privacy Act have been violated, you may contact us via email at
              <strong> sibmcr@yahoo.com </strong> or lodge a complaint with the <strong>National Privacy Commission.</strong>
            </p>

            <h2>Inquiry</h2>
            <p>
              <strong>Email:</strong> sibmcr@yahoo.com
              <br />
              <strong>Office:</strong> Municipal Civil Registrar Office
              <br />
              <strong>Location:</strong> Municipal Hall, San Ildefonso, Bulacan
            </p>
          </div>
        )}

        {/* Tagalog Version */}
        {isTagalog && (
          <div className="tagalog-content">
            <p>
              Ang <strong>Bulak LGU Smart Connect</strong> ay nakatuon sa pagprotekta at paggalang sa inyong 
              pribadong impormasyon. Ang website na ito ay pinapamahalaan ng 
              <strong> Municipal Civil Registrar Office ng San Ildefonso Bulacan</strong> at sumusunod nang lubusan sa 
              <strong> Data Privacy Act ng 2012</strong> (Republic Act No. 10173), ang pangunahing batas sa Pilipinas 
              na namamahala sa pagproseso ng personal na impormasyon sa pamahalaan at pribadong sektor.
            </p>
            <p>
              Ang Privacy Policy na ito ay maaaring baguhin, mabago, o mapalitan upang makita ang mga 
              pagbabago sa mga naaangkop na batas, regulasyon, o pagpapahusay ng sistema. Ang mga user 
              ay aabisuhan ng mga pagbabagong ito para sa pagsusuri at pagtanggap. Kung hindi kayo 
              sumasang-ayon sa napapanahong Privacy Policy, dapat kayong tumigil sa paggamit ng mga 
              serbisyo ng Bulak LGU Smart Connect.
            </p>

            <h2>Paglalarawan ng Serbisyo</h2>
            <p>
              Ang Bulak LGU Smart Connect ay isang online platform na ginawa para sa{' '}
              <strong>Municipal Civil Registrar Office ng San Ildefonso.</strong> Sa pamamagitan ng sistemang ito,
              ang mga kwalipikadong user ay maaaring humingi ng mga sumusunod na civil registry documents:
            </p>
            <ul>
              <li>Certificate of Live Birth (Katunayan ng Pagkakasilang)</li>
              <li>Certificate of Marriage (Katunayan ng Kasal)</li>
              <li>Marriage License (Lisensya sa Kasal)</li>
              <li>Certificate of Death (Katunayan ng Pagkamatay)</li>
              <li>Fetal Death Certificate (Katunayan ng Pagkamatay ng Sanggol)</li>
            </ul>
            <p>
              Ang serbisyong ito ay pinagsasama ang isang web application para sa pagsusumite ng mga 
              kahilingan. Pagkatapos ng matagumpay na pagsusumite ng kahilingan sa dokumento sa website, 
              ang user ay aabisuhan at kakailanganing pumunta sa Municipal Civil Registrar Office ng 
              San Ildefonso upang makumpleto ang transaksyon sa pamamagitan ng pagbabayad ng mga kaugnay 
              na bayad at pagkuha ng hinihinging dokumento.
            </p>

            <h2>Personal na Impormasyon na Kinokolekta</h2>

            <h3>Certificate of Live Birth</h3>
            <ul>
              <li>Buong Pangalan ng May-ari</li>
              <li>Kasarian</li>
              <li>Lugar ng Kapanganakan</li>
              <li>Address</li>
              <li>Buong Pangalan ng Ama</li>
              <li>Buong Dalaga na Pangalan ng Ina</li>
              <li>Buong Pangalan ng Awtorisadong Tumatanggap</li>
              <li>Numero ng Telepono</li>
            </ul>
            <h4>Sensitibong Personal na Impormasyon</h4>
            <ul>
              <li>Petsa ng Kapanganakan ng May-ari</li>
              <li>Petsa ng Kapanganakan ng Awtorisadong Tumatanggap</li>
            </ul>
            <p>
              Lahat ng personal at sensitibong impormasyon na ibinigay, kabilang ang anumang kinakailangang 
              mga dokumento na isinumite para sa aplikasyon ng Certificate of Live Birth, ay protektado 
              at hinahawakan alinsunod sa Data Privacy Act ng 2012. Ang mga dokumentong ito ay ligtas 
              na iniimbak at mapupuntahan lamang ng mga awtorisadong tauhan para sa mga layunin ng pagproseso.
            </p>

            <h3>Certificate of Marriage</h3>
            <ul>
              <li>Pangalan ng Asawa (Lalaki)</li>
              <li>Dalaga na Pangalan ng Asawa (Babae)</li>
              <li>Petsa ng Kasal</li>
              <li>Lugar ng Kasal</li>
              <li>Buong Pangalan ng Awtorisadong Tumatanggap</li>
              <li>Numero ng Telepono</li>
            </ul>
            <h4>Sensitibong Personal na Impormasyon</h4>
            <ul>
              <li>Petsa ng Kapanganakan ng Awtorisadong Tumatanggap</li>
            </ul>
            <p>
              Lahat ng personal at sensitibong impormasyon na ibinigay, kabilang ang anumang kinakailangang 
              mga dokumento na isinumite para sa aplikasyon ng Certificate of Marriage, ay protektado 
              at hinahawakan alinsunod sa Data Privacy Act ng 2012. Ang mga dokumentong ito ay ligtas 
              na iniimbak at mapupuntahan lamang ng mga awtorisadong tauhan para sa mga layunin ng pagproseso.
            </p>

            <h3>Certificate of Death</h3>
            <ul>
              <li>Buong Pangalan ng Namatay</li>
              <li>Kasarian</li>
              <li>Lugar ng Pagkamatay</li>
              <li>Address ng Paghahatid</li>
              <li>Buong Pangalan ng Awtorisadong Tumatanggap</li>
              <li>Numero ng Telepono</li>
            </ul>
            <h4>Sensitibong Personal na Impormasyon</h4>
            <ul>
              <li>Petsa ng Kapanganakan ng Awtorisadong Tumatanggap</li>
            </ul>

            <h3>Fetal Death Certificate</h3>
            <ul>
              <li>Pangalan ng Sanggol (kung naaangkop)</li>
              <li>Kasarian</li>
              <li>Lugar at Petsa ng Pagkamatay ng Sanggol</li>
              <li>Pangalan ng Ina</li>
              <li>Buong Pangalan ng Awtorisadong Tumatanggap</li>
              <li>Numero ng Telepono</li>
            </ul>
            <h4>Sensitibong Personal na Impormasyon</h4>
            <ul>
              <li>Petsa ng Kapanganakan ng Awtorisadong Tumatanggap</li>
            </ul>
            <p>
              Lahat ng personal at sensitibong impormasyon na ibinigay, kabilang ang anumang kinakailangang 
              mga dokumento na isinumite para sa aplikasyon ng Fetal Death Certificate, ay protektado 
              at hinahawakan alinsunod sa Data Privacy Act ng 2012. Ang mga dokumentong ito ay ligtas 
              na iniimbak at mapupuntahan lamang ng mga awtorisadong tauhan para sa mga layunin ng pagproseso.
            </p>

            <h3>Marriage License</h3>
            <ul>
              <li>Buong Pangalan ng Ikakasal na Lalaki at Babae</li>
              <li>Address at Numero ng Telepono</li>
              <li>Petsa ng Aplikasyon</li>
              <li>Lugar ng Aplikasyon</li>
            </ul>
            <h4>Sensitibong Personal na Impormasyon</h4>
            <ul>
              <li>Petsa ng Kapanganakan ng Ikakasal na Lalaki at Babae</li>
            </ul>
            <p>
              Lahat ng personal at sensitibong impormasyon na ibinigay, kabilang ang anumang kinakailangang 
              mga dokumento na isinumite para sa aplikasyon ng Marriage License, ay protektado 
              at hinahawakan alinsunod sa Data Privacy Act ng 2012. Ang mga dokumentong ito ay ligtas 
              na iniimbak at mapupuntahan lamang ng mga awtorisadong tauhan para sa mga layunin ng pagproseso.
            </p>

            <h2>Paraan ng Pagkolekta</h2>
            <p>
              Ang pagkolekta ng data ay nagsisimula kapag ang user ay nag-log sa{' '}
              <strong>Bulak LGU Smart Connect </strong>website at sumasang-ayon sa{' '}
              <strong>User Agreement </strong> at <strong> Privacy Policy. </strong> Kung walang pahintulot,
              hindi makakapagpatuloy ang user. Sa pagsang-ayon, pinupunan ng user ang mga kinakailangang 
              form, at ang personal na data ay kinokolekta batay sa hinihinging dokumento.
            </p>

            <h2>Oras ng Pagkolekta</h2>
            <p>
              Ang Personal na Data ay kinokolekta nang totoong panahon habang kinokumpleto ng user ang 
              online application form. Lahat ng data ay naka-encrypt at ginagamit lamang para sa 
              pagproseso ng dokumento. Hindi ito ginagamit para sa ibang layunin.
            </p>

            <h2>Layunin ng Nakolektang Impormasyon</h2>
            <p>
              Ang <strong>Municipal Civil Registrar Office ng San Ildefonso</strong>, bilang personal 
              information controller, ay gagamitin ang nakolektang data lamang upang patunayan at 
              iproseso ang mga kahilingan para sa civil registry documents. Lahat ng data ay 
              kinakailangan para sa pagpapatunay ng kahilingan. Ang hindi kumpletong o hindi 
              tumpak na impormasyon ay maaaring magresulta sa pagtanggi o pagkaantala.
            </p>
            <p>
              Ang tanggapan ay may karapatang magtago ng inyong personal na data kapag kinakailangan 
              ng batas at tatanggalin ito kapag hindi na naaangkop ang mga legal na kinakailangan.
            </p>

            <h2>Imbakan at Paghahatid ng Nakolektang Impormasyon</h2>
            <p>
              Ang nakolektang data ay iniimbak sa isang secure, password-protected database na may 
              encryption at firewall protection. Kapag ipinapadala, ang data ay ligtas na ipinapadala 
              sa mga naaangkop na tauhan sa loob ng Municipal Civil Registrar Office. Tanging mga 
              awtorisadong tauhan lamang ang maaaring mag-access sa impormasyon na ito.
            </p>

            <h2>Paraan ng Paggamit</h2>
            <p>
              Ang Personal na Data ay ginagamit nang mahigpit upang iproseso ang mga kahilingan para 
              sa civil registry documents. Ang data ay hindi gagamitin para sa marketing o iba pang 
              hindi kaugnay na layunin. Lahat ng pagproseso ay ginagawa ayon sa mga pamantayan ng 
              information security na inaprubahan ng gobyerno.
            </p>

            <h2>Paglipat sa Ikatlong Partido</h2>
            <p>
              Walang personal na data na ipinapadala sa mga payment processor o third-party marketing companies.
            </p>

            <h2>Panahon ng Pagtago</h2>
            <p>
              Ang personal na data ay matatago lamang hanggang sa kinakailangan upang tuparin ang 
              nilayon nitong layunin o sumunod sa mga legal na kinakailangan. Kapag hindi na 
              kinakailangan ang pagtago, ang data ay ligtas na matatanggal.
            </p>

            <h2>Pakikilahok ng Data Subject</h2>
            <p>
              Mayroon kayong karapatan na ma-access, itama, o limitahan ang inyong personal na data. 
              Kung naniniwala kayo na ang inyong mga karapatan sa ilalim ng Data Privacy Act ay 
              nalabag, maaari kayong makipag-ugnayan sa amin sa pamamagitan ng email sa
              <strong> sibmcr@yahoo.com </strong> o maghain ng reklamo sa <strong>National Privacy Commission.</strong>
            </p>

            <h2>Pagtatanong</h2>
            <p>
              <strong>Email:</strong> sibmcr@yahoo.com
              <br />
              <strong>Tanggapan:</strong> Municipal Civil Registrar Office
              <br />
              <strong>Lokasyon:</strong> Municipal Hall, San Ildefonso, Bulacan
            </p>
          </div>
        )}

        {/* Proceed Button */}
        <div className="proceed-button-container">
          <button 
            className="proceed-button"
            onClick={() => {
              if (window.opener) {
                window.opener.postMessage('visited-privacy-policy', '*');
                window.close();
              } else {
                // Fallback for when opened directly
                window.location.href = '/BirthCertificateDashboard';
              }
            }}
          >
            {isTagalog ? 'Magpatuloy sa Birth Certificate Application' : 'Proceed to Birth Certificate Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;