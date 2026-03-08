import { Box } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

export default function FootprintIcon() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "50%",
        p: 1,
        display: "flex",
        color: "#90CAF9",
      }}
    >
      <PetsIcon fontSize="large" />
    </Box>
  );
}
