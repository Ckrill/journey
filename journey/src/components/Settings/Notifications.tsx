// External
import { useState } from 'react';

// Utilities
import { disablePush, enablePush, pushSupported } from '../../helpers/push';

// Contexts
import { useSettings, useSettingsUpdate } from '../../contexts/settingsContext';

// Miscellaneous
import Button from '../Button/Button';
import Checkbox from '../Form/Checkbox/Checkbox';
import CheckboxGroup from '../Form/Checkbox/CheckboxGroup';
import Heading from '../Heading/Heading';
import NotificationsModal from '../NotificationsModal/NotificationsModal';
import Paragraph from '../Paragraph/Paragraph';
import ParagraphGroup from '../ParagraphGroup/ParagraphGroup';

const Notifications = () => {
  const settings = useSettings();
  const setSettings = useSettingsUpdate();
  const [failed, setFailed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const blocked = pushSupported && Notification.permission === 'denied';

  const handleNotificationsToggle = async () => {
    setFailed(false);

    try {
      if (settings.notifications) {
        await disablePush();
        setSettings({ ...settings, notifications: false });
      } else {
        const granted = await enablePush();
        setSettings({ ...settings, notifications: granted });
      }
    } catch {
      setFailed(true);
    }
  };

  return (
    <>
      <Heading>Notifications</Heading>

      <ParagraphGroup>
        <Paragraph size="fine">
          Notifications are in <strong>BETA</strong>. More notifications
          features are coming soon.
        </Paragraph>

        <Paragraph>
          Use notifications to help you stay on top of retros.
        </Paragraph>
      </ParagraphGroup>

      <CheckboxGroup
        errorText={
          failed ? 'Something went wrong. Please try again.' : undefined
        }
      >
        <Checkbox
          callback={() => {
            void handleNotificationsToggle();
          }}
          checked={settings.notifications}
          disabled={!pushSupported || blocked}
          id="notifications"
          label="Notifications"
        />
      </CheckboxGroup>

      <Button
        disabled={!settings.notifications}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Configure notifications
      </Button>

      <NotificationsModal
        onClose={() => {
          setModalOpen(false);
        }}
        open={modalOpen}
      />

      {!pushSupported && (
        <Paragraph type="warning">
          This browser does not support notifications.
        </Paragraph>
      )}

      {blocked && (
        <Paragraph type="warning">
          Notifications are blocked. Allow them in your browser's site settings
          to turn them on.
        </Paragraph>
      )}
    </>
  );
};

export default Notifications;
