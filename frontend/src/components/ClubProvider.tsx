import { Outlet, useMatches } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ClubContext, useClubSubscription } from "../hooks/useClubSubscription";
import { canUseClub } from "../utils/clubAccess";

// a layout route around every page: one club state, shared by the shop and the club page
const ClubProvider = () => {
  const { user, sessionId } = useAuth();
  // decided by the matched route, not the address text, so "/club/" counts as the club page too
  const showsClub = useMatches().some(match => (match.handle as { showsClub?: boolean } | undefined)?.showsClub);
  const club = useClubSubscription(canUseClub(user), sessionId, showsClub);
  return (
    <ClubContext.Provider value={club}>
      <Outlet />
    </ClubContext.Provider>
  );
};

export default ClubProvider;
