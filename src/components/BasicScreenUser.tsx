import { Box, Container } from "@mui/material";
import NavBarUser from "./NavBarUser";

export default function BasicScreen({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: "white",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <NavBarUser />
            <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
                {children}
            </Container>
        </Box>
    );
}
