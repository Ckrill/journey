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
import Warning from '../Notice/Warning';
import NotificationsModal from '../NotificationsModal/NotificationsModal';
import Paragraph from '../Paragraph/Paragraph';
import ParagraphGroup from '../ParagraphGroup/ParagraphGroup';

const Notifications = () => {
  const settings = useSettings();
  const setSettings = useSettingsUpdate();
  const [failed, setFailed] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const blocked = pushSupported && Notification.permission === 'denied';

  const handleNotificationsToggle = async () => {
    setFailed(false);
    setToggling(true);

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
    } finally {
      setToggling(false);
    }
  };

  const showWarning = blocked || !pushSupported;

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

      {showWarning ? (
        <Warning>
          {blocked
            ? "Notifications are blocked. Allow them in your browser's site settings to turn them on."
            : 'This browser does not support notifications.'}
        </Warning>
      ) : (
        <>
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
              disabled={toggling}
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
        </>
      )}
    </>
  );
};

export default Notifications;
