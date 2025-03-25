"use client";

import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import fav from "../../assets/fav.svg";
import archive from "../../assets/archive.svg";
import del from "../../assets/delete.svg";

export default function More() {
  const menuItems = [
    { name: "Favourites", icon: fav, path: "favourites" },
    { name: "Trash", icon: del, path: "trash" },
    { name: "Archived Notes", icon: archive, path: "archived" },
  ];

  return (
    <Stack p={2}>
      <Typography variant="subtitle1" fontWeight="bold" color="white">
        More
      </Typography>
  
      <Box mt={1} >
        {menuItems.map((item) => (
          <Box
            key={item.path}
            component={Link} 
            href={`/menu/${item.path}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "6px",
              textDecoration: "none",
              color: "inherit",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", 
              },
            }}
          >
            <Image src={item.icon} alt={item.name} width={20} height={20} />
            <Typography variant="body1" color="white">
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
  
}
