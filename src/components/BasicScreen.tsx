import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function BasicScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const navHeight = 64;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          scrollBehavior: "smooth",
          height: `calc(100vh - ${navHeight}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}
