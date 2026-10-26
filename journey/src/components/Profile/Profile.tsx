// Utilities
import { getLifeExpectancyYears } from '../../helpers/lifeExpectancy';

// Contexts
import { useSettings, useSettingsUpdate } from '../../contexts/settingsContext';

// Data
import lifeExpectancyData from '../../data/life-expectancy.json';

// Miscellaneous
import Input from '../Form/Input/Input';
import Select from '../Form/Select/Select';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';

// Types
import type { Sex } from '../../types/types';

const currentYear = new Date().getFullYear();

const { regions } = lifeExpectancyData;

const regionOptions = regions.map(({ name, value }) => ({
  label: name,
  value,
}));

const sexOptions: { label: string; value: Sex }[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

const Profile = () => {
  const settings = useSettings();
  const setSettings = useSettingsUpdate();

  const birthError =
    settings.birthYear !== undefined &&
    (settings.birthYear < 1900 || settings.birthYear > currentYear);

  const lifeExpectancyYears = getLifeExpectancyYears(
    settings.region,
    settings.sex,
  );

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setSettings({ ...settings, birthYear: value || undefined });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, region: e.target.value || undefined });
  };

  const handleSexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, sex: (e.target.value || undefined) as Sex });
  };

  return (
    <>
      <Heading>Profile</Heading>

      <Input
        assistiveText="Used for your personal clock."
        errorText={birthError ? 'Please enter a valid year.' : undefined}
        id="birthYear"
        labelText="Year of birth"
        max={currentYear}
        min={1900}
        onChange={handleBirthYearChange}
        type="number"
        value={settings.birthYear}
      />

      <Select
        assistiveText="Used for your personal clock."
        id="sex"
        labelText="Sex"
        onChange={handleSexChange}
        options={sexOptions}
        placeholder="Select your sex"
        value={settings.sex ?? ''}
      />

      <Select
        assistiveText="Used for your personal clock."
        id="region"
        labelText="Region of residence"
        onChange={handleRegionChange}
        options={regionOptions}
        placeholder="Select a region"
        value={settings.region ?? ''}
      />

      <Paragraph>
        Your life expectancy is <strong>{lifeExpectancyYears}</strong> years or{' '}
        <strong>{lifeExpectancyYears * 12}</strong> months. Be intentional with
        your time.
      </Paragraph>

      <Paragraph size="fine">
        Source: UN World Population Prospects 2024.
      </Paragraph>
    </>
  );
};

export default Profile;
