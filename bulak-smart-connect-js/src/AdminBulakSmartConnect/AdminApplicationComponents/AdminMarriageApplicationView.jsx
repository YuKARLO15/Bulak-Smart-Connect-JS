import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import './AdminMarriageApplicationView.css';

const AdminMarriageApplicationView = ({ applicationData }) => {
  const formData = applicationData?.formData || {};

  const formatName = (firstName = '', middleName = '', lastName = '') => {
    return [firstName, middleName, lastName].filter(Boolean).join(' ') || 'N/A';
  };

  const formatDate = (day = '', month = '', year = '') => {
    if (!day || !month || !year) return 'N/A';
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
  };

  const formatAddress = (street = '', barangay = '', city = '', province = '', country = '') => {
    return [street, barangay, city, province, country].filter(Boolean).join(', ') || 'N/A';
  };

  return (
    <Box className="MarriageCertificateContainerAdmin">
      <Box className="CertificateHeaderContainerAdmin">
        <Typography variant="body2" className="DetailsLabelAdmin">
          Municipal Form No. 97
        </Typography>
        <Typography variant="body2" className="DetailsLabelAdmin">
          (Revised August 2016)
        </Typography>
        <Typography variant="body1" className="DetailsLabelAdmin">
          Republic of the Philippines
        </Typography>
        <Typography variant="body1" className="DetailsLabelAdmin">
          OFFICE OF THE CIVIL REGISTRAR GENERAL
        </Typography>
        <Typography variant="h5" className="SectionTitleAdmin">
          CERTIFICATE OF MARRIAGE
        </Typography>
      </Box>

      <Grid container className="DetailsGridAdmin">
        <Grid item xs={8} className="LocationContainerAdmin">
          <Grid container>
            <Grid item xs={12} className="ProvinceFieldAdmin">
              <Typography variant="body2" className="DetailsLabelAdmin">
                Province
              </Typography>
              <Typography variant="body1" className="DetailsValueAdmin">
                {formData.marriageProvince || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} className="CityFieldAdmin">
              <Typography variant="body2" className="DetailsLabelAdmin">
                City/Municipality
              </Typography>
              <Typography variant="body1" className="DetailsValueAdmin">
                {formData.marriageCity || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className="RegistryContainerAdmin">
          <Typography variant="body2" className="DetailsLabelAdmin">
            Registry No.
          </Typography>
          <Typography variant="body1" className="DetailsValueAdmin">
            _____________
          </Typography>
        </Grid>
      </Grid>

      <Grid container className="MainSectionAdmin">
        <Grid item xs={6} className="HusbandHeaderAdmin">
          <Typography variant="subtitle1" className="HeaderTextAdmin">
            HUSBAND
          </Typography>
        </Grid>
        <Grid item xs={6} className="WifeHeaderAdmin">
          <Typography variant="subtitle1" className="HeaderTextAdmin">
            WIFE
          </Typography>
        </Grid>

        <Grid item xs={12} className="NameSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                1. Name of Contracting Parties
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandNameContainerAdmin">
              <Grid container>
                <Grid item xs={12} className="FirstNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (First)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandFirstName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} className="MiddleNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Middle)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandMiddleName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} className="LastNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Last)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandLastName || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} className="WifeNameContainerAdmin">
              <Grid container>
                <Grid item xs={12} className="FirstNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (First)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeFirstName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} className="MiddleNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Middle)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeMiddleName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} className="LastNameFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Last)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeLastName || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="BirthDateSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                2a. Date of Birth
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandBirthDateContainerAdmin">
              <Grid container>
                <Grid item xs={4} className="DayFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Day)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthDay || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="MonthFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Month)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthMonth || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="YearFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Year)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthYear || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} className="WifeBirthDateContainerAdmin">
              <Grid container>
                <Grid item xs={4} className="DayFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Day)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthDay || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="MonthFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Month)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthMonth || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="YearFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Year)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthYear || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className="AgeSectionAdmin">
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                2b. Age
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandAgeFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.husbandAge || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeAgeFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.wifeAge || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="BirthPlaceSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                3. Place of Birth
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandBirthPlaceContainerAdmin">
              <Grid container>
                <Grid item xs={4} className="CityFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (City/Municipality)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthCity || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="ProvinceFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Province)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthProvince || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="CountryFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Country)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.husbandBirthCountry || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} className="WifeBirthPlaceContainerAdmin">
              <Grid container>
                <Grid item xs={4} className="CityFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (City/Municipality)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthCity || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="ProvinceFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Province)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthProvince || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="CountryFieldAdmin">
                  <Typography variant="caption" className="FieldLabelAdmin">
                    (Country)
                  </Typography>
                  <Typography variant="body1" className="FieldValueAdmin">
                    {formData.wifeBirthCountry || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="SexCitizenshipSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                4a. Sex
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandSexFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.husbandSex || 'Male'}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeSexFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.wifeSex || 'Female'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container className="CitizenshipSectionAdmin">
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                4b. Citizenship
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandCitizenshipFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.husbandCitizenship || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeCitizenshipFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.wifeCitizenship || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="ResidenceSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                5. Residence
              </Typography>
              <Typography variant="caption" className="FieldLabelAdmin">
                (House No., St., Barangay, City/Municipality, Province, Country)
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandResidenceFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formatAddress(
                  formData.husbandStreet,
                  formData.husbandBarangay,
                  formData.husbandCity,
                  formData.husbandProvince,
                  formData.husbandCountry
                )}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeResidenceFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formatAddress(
                  formData.wifeStreet,
                  formData.wifeBarangay,
                  formData.wifeCity,
                  formData.wifeProvince,
                  formData.wifeCountry
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="ReligionSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                6. Religion/Religious Sect
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandReligionFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.husbandReligion || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeReligionFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.wifeReligion || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="CivilStatusSectionAdmin">
          <Grid container>
            <Grid item xs={12} className="SectionTitleRowAdmin">
              <Typography variant="body2" className="SectionTitleTextAdmin">
                7. Civil Status
              </Typography>
            </Grid>

            <Grid item xs={6} className="HusbandCivilStatusFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.husbandCivilStatus || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} className="WifeCivilStatusFieldAdmin">
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.wifeCivilStatus || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className="MarriageDetailsSectionAdmin">
        <Grid item xs={12} className="MarriageDetailsTitleAdmin">
          <Typography variant="subtitle1" className="HeaderTextAdmin">
            MARRIAGE DETAILS
          </Typography>
        </Grid>

        <Grid item xs={12} className="MarriagePlaceSectionAdmin">
          <Typography variant="body2" className="SectionTitleTextAdmin">
            15. Place of Marriage:
          </Typography>
          <Grid container>
            <Grid item xs={4} className="MarriageOfficeFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (Office/House of/Barangay of/Church of/Mosque of)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageOffice || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={4} className="MarriageCityFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (City/Municipality)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageCity || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={4} className="MarriageProvinceFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (Province)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageProvince || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="MarriageDateSectionAdmin">
          <Typography variant="body2" className="SectionTitleTextAdmin">
            16. Date of Marriage:
          </Typography>
          <Grid container>
            <Grid item xs={4} className="MarriageDayFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (Day)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageDay || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={4} className="MarriageMonthFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (Month)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageMonth || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={4} className="MarriageYearFieldAdmin">
              <Typography variant="caption" className="FieldLabelAdmin">
                (Year)
              </Typography>
              <Typography variant="body1" className="FieldValueAdmin">
                {formData.marriageYear || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="MarriageTimeSectionAdmin">
          <Typography variant="body2" className="SectionTitleTextAdmin">
            17. Time of Marriage:
          </Typography>
          <Typography variant="body1" className="FieldValueAdmin">
            {formData.marriageTime || 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      {/* Witnesses Section */}
      <Grid container className="WitnessesSectionAdmin">
        <Grid item xs={12} className="WitnessesTitleAdmin">
          <Typography variant="subtitle1" className="HeaderTextAdmin">
            WITNESSES
          </Typography>
        </Grid>

        <Grid item xs={6} className="Witness1ContainerAdmin">
          <Typography variant="body2" className="SectionTitleTextAdmin">
            Witness 1:
          </Typography>
          <Typography variant="body1" className="FieldValueAdmin">
            {formatName(formData.witness1FirstName, '', formData.witness1LastName)}
          </Typography>
          <Typography variant="caption" className="FieldLabelAdmin">
            Address:
          </Typography>
          <Typography variant="body1" className="FieldValueAdmin">
            {formData.witness1Address || 'N/A'}
          </Typography>
        </Grid>

        <Grid item xs={6} className="Witness2ContainerAdmin">
          <Typography variant="body2" className="SectionTitleTextAdmin">
            Witness 2:
          </Typography>
          <Typography variant="body1" className="FieldValueAdmin">
            {formatName(formData.witness2FirstName, '', formData.witness2LastName)}
          </Typography>
          <Typography variant="caption" className="FieldLabelAdmin">
            Address:
          </Typography>
          <Typography variant="body1" className="FieldValueAdmin">
            {formData.witness2Address || 'N/A'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminMarriageApplicationView;
