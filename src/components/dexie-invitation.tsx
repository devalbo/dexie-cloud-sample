import { Invite } from "dexie-cloud-addon";


interface DexieInvitationProps {
  invitation: Invite;
}

export const DexieInvitation = ({ invitation }: DexieInvitationProps) => {

  const { invitedBy, realm } = invitation;

  if (!invitedBy) {
    return (
      <div>
        Invitation unclear
      </div>
    )
  }

  const { name } = invitedBy;

  return (
    <>
      <p>
        {name}
        <br />
        {realm?.name}
      </p>
      <button onClick={() => {
        invitation.accept();
      }}>
        Accept
      </button>
    </>
  );
};
