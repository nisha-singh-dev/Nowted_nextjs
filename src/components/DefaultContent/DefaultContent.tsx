
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import noteview from "../../assets/noteview.svg";

export default function DefaultContent() {
  return (
    <Box
      sx={{
        flexGrow: 1, 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100vh",
        bgcolor: "black",
        px: 4,
      }}
    >
      <Image src={noteview} alt="Select Note" width={100} height={100} />

      <Typography variant="h5" fontWeight="bold" color="white" mt={2}>
        Select a note to view
      </Typography>

      <Typography variant="body1" color="grey.300" mt={1} >
        Choose a note from the list on the left to view its contents, or create a new note to add to your collection.
      </Typography>
    </Box>
  );
}
