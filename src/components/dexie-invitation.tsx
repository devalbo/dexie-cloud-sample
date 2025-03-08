import { Invite } from "dexie-cloud-addon";


interface DexieInvitationProps {
  invitation: Invite;
}

export const DexieInvitation = ({ invitation }: DexieInvitationProps) => {

  const { invitedBy, realmId, realm } = invitation;

  if (!invitedBy) {
    return (
      <div>
        Invitation unclear
      </div>
    )
  }

  const { email, name, userId } = invitedBy;

  return (
    <>
      <p>
        {email} | {name} | {userId} | {realmId} 
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
