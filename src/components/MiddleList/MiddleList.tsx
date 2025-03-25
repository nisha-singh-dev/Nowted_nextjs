"use client";

import { usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Box, Typography, List, Button, CircularProgress } from "@mui/material";
import MiddleCard from "./MiddleCard";
import { fetchNotes } from "@/utils/api";

export default function MiddleList() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  
  const isFolder = pathSegments[0] === "folder";
  const isMenu = pathSegments[0] === "menu";
  const folderId = isFolder ? pathSegments[2] : null;
  const folderName = isFolder ? decodeURIComponent(pathSegments[1]) : null;
  const menuType = isMenu ? pathSegments[1] : null;

  const title = folderId 
    ? folderName 
    : menuType === "favourites" 
      ? "Favorites"
      : menuType === "archived" 
        ? "Archived"
        : menuType === "trash" 
          ? "Trash"
          : ""; 

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notes", folderId ?? undefined, menuType ?? undefined],
    queryFn: ({ pageParam = 1 }) => fetchNotes(pageParam, folderId ?? undefined, menuType ?? undefined),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.notes.length, 0);
      // console.log("total fetched ",totalFetched);
      // console.log("last page  tottal",lastPage.total);
      
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  
  const allNotes = data?.pages.flatMap(page => page.notes) || [];

  return (
    <Box
      width="20%"
      height="100vh"
      bgcolor="grey.900"
      p={2}
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h6" color="white" pb={2} textAlign="center">
        {folderId ? folderName : title}
      </Typography>

      <Box flex={1} overflow="auto" sx={{"&::-webkit-scrollbar": { width: "6px" }, 
          "&::-webkit-scrollbar-thumb": { backgroundColor: "white", borderRadius: "4px" } }} >
        {isLoading ? (
          <Typography color="white" textAlign="center">Loading...</Typography>
        ) : allNotes.length > 0 ? (
          <>
            <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {allNotes.map((note) => (
                <MiddleCard 
                  key={note.id} 
                  note={note}  
                  folderName={folderName ??undefined} 
                  folderId={folderId ??undefined} 
                  noteId={note.id} 
                  menuType={menuType ??undefined}
                />
              ))}
            </List>
            {hasNextPage && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  sx={{
                    bgcolor: "grey.700",
                    color: "white",
                    "&:hover": { bgcolor: "grey.600" },
                  }}
                >
                  {isFetchingNextPage ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Load More"
                  )}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="white" textAlign="center">
            {folderId || menuType ? "No notes found" : "Select a folder to view notes"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}




//perfect but no pagination

// "use client";

// import { usePathname } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { Box, Typography, List } from "@mui/material";
// import MiddleCard from "./MiddleCard";
// import { fetchNotes } from "@/utils/api";

// interface NoteType {
//   id: string;
//   title: string;
//   preview: string;
//   createdAt: string;
//   updatedAt: string;
//   folderId: string;
//   folder: {
//     id: string;
//     name: string;
//   };
// }

// export default function MiddleList() {
//   const pathname = usePathname();
//   const pathSegments = pathname.split("/").filter(Boolean);
  
//   const isFolder = pathSegments[0] === "folder";
//   const isMenu = pathSegments[0] === "menu";
//   const folderId = isFolder ? pathSegments[2] : null;
//   const folderName = isFolder ? decodeURIComponent(pathSegments[1]) : null;


//   const menuType = isMenu ? pathSegments[1] : null;

//   const title = folderId 
//   ? folderName 
//   : menuType === "favourites" 
//     ? "Favorites"
//     : menuType === "archived" 
//       ? "Archived"
//       : menuType === "trash" 
//         ? "Trash"
//         : ""; 

//   const { data: notes = [], isLoading } = useQuery<NoteType[]>({
//     queryKey: ["notes", folderId ?? undefined, menuType ?? undefined], 
//     queryFn: () => fetchNotes(folderId ?? undefined, menuType ?? undefined), 
//     enabled: !!folderId || !!menuType, 
//   });
  
  

//   return (
//     <Box
//       width="20%"
//       height="100vh"
//       bgcolor="grey.900"
//       p={2}
//       display="flex"
//       flexDirection="column"
//     >
//       <Typography variant="h6" color="white" pb={2} textAlign="center">
//         {folderId? folderName: title}
//       </Typography>

//       <Box flex={1} overflow="auto">
//         {isLoading ? (
//           <Typography color="white" textAlign="center">Loading...</Typography>
//         ) : notes.length > 0 ? (
//           <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//             {notes.map((note) => (
//               <MiddleCard 
//               key={note.id} 
//               note={note}  
//               folderName={folderName} 
//               folderId={folderId} 
//               noteId={note.id} 
//               menuType = {menuType}
//             />
//             ))}
//           </List>
//         ) : (
//           <Typography color="white" textAlign="center" >
//             Select a folder to view notes.
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// }

