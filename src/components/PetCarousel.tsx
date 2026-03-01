import { useEffect, useState } from "react";
import { Box, Card, CardMedia, IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import sliderLandingPage from "../constants/sliderImages";

const VISIBLE_DESKTOP = 3;
const VISIBLE_MOBILE = 1;
const INTERVAL = 3000;

export default function PetCarousel() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1 >= sliderLandingPage.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev - 1 < 0 ? sliderLandingPage.length - 1 : prev - 1,
    );
  };

  const visibleCount = isMobile ? VISIBLE_MOBILE : VISIBLE_DESKTOP;

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* FLECHA IZQUIERDA */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: -10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "#B2EBF2",
          boxShadow: 2,
          "&:hover": { backgroundColor: "#cef3f8ff" },
        }}
      >
        <ArrowBackIosNew fontSize="small" />
      </IconButton>

      {/* FLECHA DERECHA */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: -10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "#B2EBF2",
          boxShadow: 2,
          "&:hover": { backgroundColor: "#cef3f8ff" },
        }}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>

      {/* CAROUSEL */}
      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.6s ease-in-out",
            transform: `translateX(-${(index * 100) / visibleCount}%)`,
          }}
        >
          {sliderLandingPage.map((item, i) => {
            const isCenter =
              !isMobile && i === (index + 1) % sliderLandingPage.length;

            return (
              <Box
                key={i}
                sx={{
                  flex: `0 0 ${100 / visibleCount}%`,
                  p: 1,
                  transition: "all 0.4s ease",
                  transform: isCenter ? "scale(1)" : "scale(0.85)",
                  opacity: isCenter || isMobile ? 1 : 0.7,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 6,
                    aspectRatio: "1 / 1",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item}
                    alt="Pet"
                    sx={{
                      objectFit: "cover",
                      height: "100%",
                    }}
                  />
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
