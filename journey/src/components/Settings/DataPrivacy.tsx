// External
import { useState } from 'react';

// Utilities
import { settingsKey } from '../../helpers/localStorage';

// Hooks
import { useDownloadData } from '../../hooks/useDownloadData';
import { useUserId } from '../../hooks/useUserId';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import ButtonGroup from '../Button/ButtonGroup';
import DeleteAccountModal from '../DeleteAccount/DeleteAccountModal';
import FieldGroup from '../Form/FieldGroup/FieldGroup';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';
import ParagraphGroup from '../ParagraphGroup/ParagraphGroup';

const DataPrivacy = () => {
  const userId = useUserId();
  const { busy, download, failed } = useDownloadData();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAccountDeleted = async () => {
    localStorage.removeItem(settingsKey(userId));
    // The user no longer exists server-side, so only end the local session.
    await supabase.auth.signOut({ scope: 'local' });
  };

  return (
    <>
      <Heading>Data & Privacy</Heading>

      <ParagraphGroup
        more={
          <>
            <Paragraph>
              Your profile information and preferences are stored on your
              device. If you switch device, you will have to set them again.
            </Paragraph>

            <Paragraph>
              The rest (email, habits, progress, latest retro and notification
              settings) is stored on servers in the EU and is never shared with
              anyone.
            </Paragraph>

            <Paragraph>No tracking, no analytics and no cookies.</Paragraph>
          </>
        }
      >
        <Paragraph>
          Your data is yours. Download it or delete it at any time.
        </Paragraph>
      </ParagraphGroup>

      <FieldGroup>
        <ButtonGroup
          align="center"
          errorText={
            failed ? 'Something went wrong. Please try again.' : undefined
          }
        >
          <Button
            disabled={busy}
            onClick={() => {
              void download();
            }}
          >
            {busy ? 'Preparing' : 'Download data'}
          </Button>

          <Button
            onClick={() => {
              setDeleteOpen(true);
            }}
            priority="secondary"
            tone="danger"
          >
            Delete account
          </Button>
        </ButtonGroup>
      </FieldGroup>

      <DeleteAccountModal
        onClose={() => {
          setDeleteOpen(false);
        }}
        onDeleted={() => {
          void handleAccountDeleted();
        }}
        open={deleteOpen}
      />
    </>
  );
};

export default DataPrivacy;
