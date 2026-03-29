import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FixedBottomButtonsContainer, ScrollableContainer } from "../components/lib.ts";
import TaskActionButton from "../components/TaskActionButton.tsx";
import { redirectToLaunchpad } from "../utils/redirectToLaunchpad.ts";

const COOLDOWN_DURATION_MS = 5 * 1000 * 60;

const EngagementTasksPage = () => {
  const onBackToLaunchpad = () => {
    redirectToLaunchpad();
  };

  const onTapTask = () => {};

  return (
    <>
      <ScrollableContainer flex={1} paddingBottom={120}>
        <Box px={2} pt={3} pb={1}>
          <Typography fontSize={18} fontWeight={700} color="black">
            Demo App Tasks
          </Typography>
          <Typography mt={1} variant="body2" color="#88828B" lineHeight={1.6}>
            Engagement is a broad concept, like visiting the app to taking specific actions within its interface. In the
            future, individual apps will guide you through the specific interactions that define their unique engagement
            criteria.
          </Typography>
          <Typography mt={2} variant="body2" color="#88828B" lineHeight={1.6}>
            To demonstrate this mechanism on the Testnet, we have simplified the process: for this test app, engagement
            is defined by simply pushing the buttons below.
          </Typography>
        </Box>

        <Box px={2} py={2} display="grid" gap={1.5}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            bgcolor="white"
            borderRadius="8px"
            border="1px solid"
            borderColor="#E7D7F3"
            boxShadow="0 0 14px 0 #0000001a"
            p={2}
          >
            <Box
              width={44}
              height={44}
              borderRadius="8px"
              bgcolor="#F3EBF9"
              color="#703D92"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <AdsClickOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box flex={1}>
              <Typography fontSize={14} fontWeight={700} color="black">
                Tap the Button
              </Typography>
              <Typography variant="body2" color="#88828B" mt={0.5}>
                Complete this activity to earn points
              </Typography>
            </Box>
            <TaskActionButton
              cooldownMs={COOLDOWN_DURATION_MS}
              storageKey="engagement_task_tap_cooldown"
              onTap={onTapTask}
              tapLabel="Tap"
              refreshLabel="Refresh"
              unlockInLabel={countdown => `Unlock ${countdown}`}
            />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            bgcolor="white"
            borderRadius="8px"
            border="1px solid"
            borderColor="#E7D7F3"
            boxShadow="0 0 14px 0 #0000001a"
            p={2}
          >
            <Box
              width={44}
              height={44}
              borderRadius="8px"
              bgcolor="#F3EBF9"
              color="#703D92"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box flex={1}>
              <Typography fontSize={14} fontWeight={700} color="black">
                Tap the new button
              </Typography>
              <Typography variant="body2" color="#88828B" mt={0.5}>
                New engagement task available
              </Typography>
            </Box>
            <TaskActionButton
              cooldownMs={COOLDOWN_DURATION_MS}
              storageKey="engagement_task_new_button_cooldown"
              onTap={onTapTask}
              tapLabel="Tap"
              refreshLabel="Refresh"
              unlockInLabel={countdown => `Unlock ${countdown}`}
            />
          </Box>
        </Box>
      </ScrollableContainer>

      <FixedBottomButtonsContainer>
        <Button variant="contained" size="large" fullWidth onClick={onBackToLaunchpad}>
          Return to Launchpad
        </Button>
      </FixedBottomButtonsContainer>
    </>
  );
};

export default EngagementTasksPage;
