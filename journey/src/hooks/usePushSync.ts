// External
import { useEffect, useRef } from 'react';

// Utilities
import { enablePush, pushSupported } from '../helpers/push';

// Contexts
import { useSettings, useSettingsUpdate } from '../contexts/settingsContext';

/** Once per app start, restores a lost push subscription or clears a revoked one. */
export const usePushSync = () => {
  const settings = useSettings();
  const setSettings = useSettingsUpdate();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current || !pushSupported || !settings.notifications) return;
    syncedRef.current = true;

    if (Notification.permission !== 'granted') {
      setSettings({ ...settings, notifications: false });
      return;
    }

    // Saving again is harmless; it also replaces an expired subscription.
    void enablePush().catch(() => undefined);
  }, [settings, setSettings]);
};
