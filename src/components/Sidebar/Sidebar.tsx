import { Stack, Box } from "@mui/material";
import Header from "./Header";
import Recent from "./Recent";
import Folder from "./Folder";
import More from "./More";
import FolderHeader from "./FolderHeader";



export default function Sidebar() {
  return (
    <Box width="20%" height="100vh" sx={{ backgroundColor: "black" }}>
      <Stack direction="column" height="100%">
        <Header />
        <Recent />
        <FolderHeader/>
        <Box sx={{ flexGrow: 1, overflowY: "auto" ,"&::-webkit-scrollbar": { width: "6px" }, 
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#555", borderRadius: "4px" } }}>
          <Folder />
        </Box>

        <More />
      </Stack>
    </Box>
  );
}
