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
          pt: `${navHeight}px`,
          overflowY: "auto",
          scrollBehavior: "smooth",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 } }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}
