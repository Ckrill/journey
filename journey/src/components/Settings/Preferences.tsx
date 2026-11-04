// Contexts
import { useSettings, useSettingsUpdate } from '../../contexts/settingsContext';

// Miscellaneous
import Checkbox from '../Form/Checkbox/Checkbox';
import CheckboxGroup from '../Form/Checkbox/CheckboxGroup';
import Heading from '../Heading/Heading';

const Preferences = () => {
  const settings = useSettings();
  const setSettings = useSettingsUpdate();

  const handleToggle = (
    setting: 'bottomNavigation' | 'sound' | 'vibration',
  ) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <>
      <Heading>Preferences</Heading>

      <CheckboxGroup>
        <Checkbox
          callback={() => {
            handleToggle('sound');
          }}
          checked={settings.sound}
          id="sound"
          label="Sound"
        />

        <Checkbox
          callback={() => {
            handleToggle('vibration');
          }}
          checked={settings.vibration}
          id="vibration"
          label="Vibration"
        />

        <Checkbox
          callback={() => {
            handleToggle('bottomNavigation');
          }}
          checked={settings.bottomNavigation}
          id="bottomNavigation"
          label="Upside Down"
        />
      </CheckboxGroup>
    </>
  );
};

export default Preferences;
