"use client";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  fetchNoteDetails,
  updateNote,
  fetchFolders,
  updateNoteFolder,
  updateNoteProperty,
  deleteNote,
} from "@/utils/api";

import optionsIcon from "@/assets/options.svg";
import dateIcon from "@/assets/date.svg";
import folderIcon from "@/assets/folder.svg";
import fav from "../../assets/fav.svg";
import archive from "../../assets/archive.svg";
import del from "../../assets/delete.svg";
import RestoreContent from "../RestoreContent/RestoreContent";

interface foldertype {
  id: string;
  name: string;
}

const MainContent = () => {
  const pathname = usePathname();
  const noteId = pathname.split("/").pop();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [folderMenuAnchor, setFolderMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [optionsMenuAnchor, setOptionsMenuAnchor] =
    useState<null | HTMLElement>(null);

  //store timeout reference
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  //Fetch note details
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteDetails(noteId as string),
    enabled: !!noteId,
  });

  // Fetch folders
  const { data: folders } = useQuery<foldertype[]>({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
    }
  }, [note]);

 // function for updating note title and content
  const updateMutation = useMutation({
    mutationFn: ({
      field,
      value,
    }: {
      field: "title" | "content";
      value: string;
    }) => updateNote(noteId as string, field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // function for changing folder
  const changeFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      await updateNoteFolder(noteId as string, folderId);
    },
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });

      const selectedFolder = folders?.find((f) => f.id === folderId);
      if (selectedFolder) {
        router.push(
          `/folder/${selectedFolder.name}/${folderId}/notes/${noteId}`
        );
      }
    },
  });

  // function for changing note properties (fav, archive, delete)
  // const updatePropertyMutation = useMutation({
  //   mutationFn: async ({
  //     property,
  //     value,
  //   }: {
  //     property: string;
  //     value: boolean;
  //   }) => {
  //     await updateNoteProperty(noteId as string, property, value);
  //   },
  //   onSuccess: (_, { property, value }) => {
  //     queryClient.invalidateQueries({ queryKey: ["note", noteId] });
  //     queryClient.invalidateQueries({ queryKey: ["notes"] });

  //     if (property === "isArchived") {
  //       const folderId = note?.folder?.id;
  //       const folderName = note?.folder?.name;

  //       if (value) {
  //         router.push(`/folder/${folderName}/${folderId}`);
  //       } else {
  //         router.push(`/folder/${folderName}/${folderId}/notes/${noteId}`);
  //       }
  //     }
  //   },
  // });
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ property, value }: { property: string; value: boolean }) => {
      await updateNoteProperty(noteId as string, property, value);
    },
    onSuccess: (_, { property, value }) => {
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
  
      const isFolderRoute = pathname.startsWith("/folder/");
      const isMenuRoute = pathname.startsWith("/menu/");
      const menuType = pathname.split("/")[2];
      const folderId = note?.folder?.id;
      const folderName = note?.folder?.name;
  
      if (property === "isArchived") {
        if (isFolderRoute) {
          if (value) {
            router.push(`/folder/${folderName}/${folderId}`);
          } else {
            router.push(`/folder/${folderName}/${folderId}/notes/${noteId}`);
          }
        } else if (isMenuRoute) {
          if (menuType === "archived") {
            if (!value) {
              router.push(`/menu/archived`);
            }
          } else {
            if (value) {
              router.push(`/menu/${menuType}`);
            } else {
              router.push(`/menu/${menuType}/notes/${noteId}`);
            }
          }
        }
      }
  
      if (property === "isFavorite") {
        if (isMenuRoute && menuType === "favourites" && !value) {
          router.push(`/menu/favourites`); 
        }
      }
    },
  });
  
  

  //delete note
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteNote(noteId as string);
    },
    onSuccess: () => {
      alert("Note deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    },
  });

  // api call for editing title/content after 2 sec
  const handleEdit = (field: "title" | "content", value: string) => {
    if (!note) return;

    if (field === "title") setEditedTitle(value);
    if (field === "content") setEditedContent(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        await updateMutation.mutateAsync({ field, value });
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      }
    }, 2000);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  // console.log("is note deleted",note.deletedAt);
  const isDeleted = note?.deletedAt ? true : false;

  return isDeleted ? (
    <RestoreContent />
  ) : (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        p: 4,
        bgcolor: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {note ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              variant="standard"
              fullWidth
              value={editedTitle}
              onChange={(e) => handleEdit("title", e.target.value)}
              InputProps={{ sx: { fontSize: "1.5rem", color: "#fff" } }}
            />
            <Image
              src={optionsIcon}
              alt="Options"
              width={24}
              height={24}
              style={{ cursor: "pointer" }}
              onClick={(e) => setOptionsMenuAnchor(e.currentTarget)}
            />
          </Box>

          <Menu
            anchorEl={optionsMenuAnchor}
            open={Boolean(optionsMenuAnchor)}
            onClose={() => setOptionsMenuAnchor(null)}
            PaperProps={{
              sx: { backgroundColor: "grey.500" }, 
            }}
          >
            <MenuItem
              onClick={() => {
                updatePropertyMutation.mutate({
                  property: "isFavorite",
                  value: !note.isFavorite,
                });
                setOptionsMenuAnchor(null);
              }}
              sx={{
                backgroundColor: "grey.500",
                "&:hover": { backgroundColor: "grey.700" },
              }} 
            >
              <ListItemIcon>
                <Image src={fav} alt="Favorite" width={20} height={20} />
              </ListItemIcon>
              {note.isFavorite ? "Remove from Favorites" : "Add to Favourites"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                updatePropertyMutation.mutate({
                  property: "isArchived",
                  value: !note.isArchived,
                });
                setOptionsMenuAnchor(null);
              }}
              sx={{
                backgroundColor: "grey.500",
                "&:hover": { backgroundColor: "grey.700" },
              }}
            >
              <ListItemIcon>
                <Image src={archive} alt="Archive" width={20} height={20} />
              </ListItemIcon>
              {note.isArchived ? "Unarchive" : "Archive"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                deleteMutation.mutate();
                setOptionsMenuAnchor(null);
              }}
              sx={{
                backgroundColor: "grey.500",
                "&:hover": { backgroundColor: "grey.700" },
              }}
            >
              <ListItemIcon>
                <Image src={del} alt="Delete" width={20} height={20} />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>

          <Box sx={{ mt: 2, borderBottom: "1px solid #444" }} />

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Image src={dateIcon} alt="Date" width={20} height={20} />
              <Typography variant="body2">
                <strong>Date:</strong>{" "}
                <Typography component="span" ml={2} > {new Date(note.createdAt).toLocaleDateString()}</Typography>

               
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Image src={folderIcon} alt="Folder" width={20} height={20} />
              <Typography
                variant="body2"
                onDoubleClick={(e) => setFolderMenuAnchor(e.currentTarget)}
                
              >
                <strong>Folder:</strong>
                 <Typography component="span" ml={2} sx={{ cursor: "pointer", borderBottom: "1px dashed #888" }}>{note.folder.name || "No Folder"}</Typography>
              </Typography>
            </Box>

            <Menu
              anchorEl={folderMenuAnchor}
              open={Boolean(folderMenuAnchor)}
              onClose={() => setFolderMenuAnchor(null)}
            >
              {folders?.map((folder) => (
                <MenuItem
                  key={folder.id}
                  onClick={() => {
                    changeFolderMutation.mutate(folder.id);
                    setFolderMenuAnchor(null);
                  }}
                >
                  {folder.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>

      

          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2,"&::-webkit-scrollbar": { width: "6px" }, 
          "&::-webkit-scrollbar-thumb": { backgroundColor: "white", borderRadius: "4px" } }}>
            <TextField
              fullWidth
              multiline
              // minRows={15}
              value={editedContent}
              onChange={(e) => handleEdit("content", e.target.value)}
              InputProps={{ sx: { color: "#fff", fontSize: "1.1rem" } }}
            />
          </Box>
        </>
      ) : (
        <Typography>No note selected</Typography>
      )}
    </Box>
  );
};

export default MainContent;






