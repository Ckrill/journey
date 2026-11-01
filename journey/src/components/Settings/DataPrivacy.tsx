// External
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Miscellaneous
import { supabase } from '../../lib/supabase';
import Button from '../Button/Button';
import DeleteAccountModal from '../DeleteAccount/DeleteAccountModal';
import DownloadDataButton from '../DownloadData/DownloadDataButton';
import Heading from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';
import ParagraphGroup from '../ParagraphGroup/ParagraphGroup';

const DataPrivacy = () => {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAccountDeleted = async () => {
    localStorage.clear();
    // The user no longer exists server-side, so only end the local session.
    await supabase.auth.signOut({ scope: 'local' });
    queryClient.clear();
  };

  return (
    <>
      <Heading>Data & Privacy</Heading>

      <ParagraphGroup
        more={
          <>
            <Paragraph>
              Your profile information and preferences are stored on your
              device. If you switch device, you will have to set it again.
            </Paragraph>

            <Paragraph>
              The rest (email, habits, progress and latest retro) is stored on
              servers in the EU and is never shared with anyone.
            </Paragraph>

            <Paragraph>No tracking, no analytics and no cookies.</Paragraph>
          </>
        }
      >
        <Paragraph>
          Your data is yours. Download it or delete it at any time.
        </Paragraph>
      </ParagraphGroup>

      <DownloadDataButton />

      <Button
        onClick={() => {
          setDeleteOpen(true);
        }}
        priority="secondary"
        tone="danger"
      >
        Delete account
      </Button>

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
