"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFolders, updateFolder, deleteFolder } from "@/utils/api";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import folderIcon from "../../assets/imgfolder.svg";
import deleteIcon from "../../assets/delete.svg";
import { useState } from "react";

interface foldertype {
  id: string;
  name: string;
}

export default function FolderList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname(); 
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  // fetching folders
  const { data: folders = [], isLoading, isError } = useQuery<foldertype[]>({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });


  // Update folder name mutation
  const updateFolderMutation = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) => updateFolder(folderId, name),
    onSuccess: (_, { folderId, name }) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });

      // Update the URL if the folder name is changed
      if (pathname.includes(folderId)) {
        router.replace(`/folder/${encodeURIComponent(name)}/${folderId}`);
      }

      setEditingFolder(null);
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });

      // If selected folder is deleted, redirect to the home page
      if (pathname.includes(folderId)) {
        router.replace("/"); 
      }
    },
  });

  // Handle folder update
  const handleFolderUpdate = (folderId: string) => {
    if (newName.trim()) {
      updateFolderMutation.mutate({ folderId, name: newName });
    }
  };

  if (isLoading) return <Typography p={2}>Loading...</Typography>;
  if (isError) return <Typography p={2} color="error">Error fetching folders.</Typography>;

  return (
    <Stack p={2} >
      
      <Box 
        sx={{ 
          overflowY: "auto",  
          // maxHeight: "220px", 
          pr: 1, 
          "&::-webkit-scrollbar": { width: "6px" }, 
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#555", borderRadius: "4px" } 
        }}
      >
        {folders.map((folder) => {
          const isSelected = pathname.includes(folder.id); 

          return (
            <Stack
              key={folder.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                py: 0.5,
                pl: 1.5,
                borderRadius: "6px",
                transition: "background-color 0.3s ease",
                backgroundColor: isSelected ? "#333" : "transparent", 
                "&:hover": { backgroundColor: "#444" }, 
              }}
            >
              {editingFolder === folder.id ? (
                <TextField
                  variant="standard"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleFolderUpdate(folder.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleFolderUpdate(folder.id)}
                  autoFocus
                  sx={{ color: "white", input: { color: "white" } }}
                />
              ) : (
                <Link 
                  href={`/folder/${encodeURIComponent(folder.name)}/${folder.id}`} 
                  style={{ 
                    textDecoration: "none", 
                    color: isSelected ? "#bbb" : "white", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px" 
                  }}
                >
                  <Image src={folderIcon} alt="Folder Icon" width={20} height={20} />
                  <Typography 
                    variant="body1" 
                    onDoubleClick={() => { setEditingFolder(folder.id); setNewName(folder.name); }}
                  >
                    {folder.name}
                  </Typography>
                </Link>
              )}

              <IconButton onClick={() => deleteFolderMutation.mutate(folder.id)}>
                <Image src={deleteIcon} alt="Delete Icon" width={20} height={20} />
              </IconButton>
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
}

