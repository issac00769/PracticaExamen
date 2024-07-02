import { Card, styled } from "@mui/material";
import { convertHexToRGB } from "app/utils/utils";

// STYLED COMPONENTS
const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  padding: "24px !important",
  [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  position: "relative",
  padding: "24px !important",
  background: `rgb(${convertHexToRGB(theme.palette.primary.main)}, 0.15) !important`,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

export default function UpgradeCard() {
  return (
    <CardRoot>
      <StyledCard elevation={0}>
        <img src="/assets/images/illustrations/upgrade.svg" alt="upgrade" />
      </StyledCard>
    </CardRoot>
  );
}
