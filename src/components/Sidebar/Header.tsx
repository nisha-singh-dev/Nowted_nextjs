"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import NotedLogo from "../../assets/Group 1.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNote, searchNotes } from "@/utils/api";

interface NoteType {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  folderId: string;
  folder: {
    id: string;
    name: string;
  };
}
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchBox, setSearchBox] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  const pathSegments = pathname.split("/");
  const folderId = pathSegments[3] || null;

  const addNoteMutation = useMutation({
    mutationFn: (folderId: string) => addNote({ folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
      router.push(`/folder/${pathSegments[2]}/${folderId}`);
    },
  });

  const handleAddNote = () => {
    if (!folderId) {
      alert("Please select a folder first!");
      return;
    }
    addNoteMutation.mutate(folderId);
  };

  const { data: notes, isLoading } = useQuery<NoteType[]>({
    queryKey: ["searchNotes", searchQuery],
    queryFn: () => searchNotes(searchQuery),
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchQuery(searchBox.trim());
    }
  };

  return (
    <Box p={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Image src={NotedLogo} alt="Noted Logo" width={120} height={40} />
        <IconButton onClick={() => setIsSearching(!isSearching)}>
          {isSearching ? (
            <CloseIcon sx={{ color: "white" }} />
          ) : (
            <SearchIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </Box>

      <Box mt={2} textAlign="center" display="flex" justifyContent="center">
        {isSearching ? (
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 250,
              height: 40,
              bgcolor: "grey.800",
              p: "2px 8px",
              borderRadius: 1,
            }}
          >
            <InputBase
              placeholder="Search notes..."
              sx={{ ml: 1, flex: 1, color: "white" }}
              value={searchBox}
              onChange={(e) => setSearchBox(e.target.value)}
              onKeyDown={handleSearch}
            />
          </Paper>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "grey",
              color: "white",
              "&:hover": { backgroundColor: "darkgrey" },
              width: "250px",
              height: "40px",
            }}
            onClick={handleAddNote}
          >
            + New Note
          </Button>
        )}
      </Box>

      <Box sx={{ position: "relative", width: "100%", maxWidth: 250 }}>
        {isSearching && searchQuery && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: "4px",
              width: "100%",
              bgcolor: "grey.900",
              borderRadius: 2,
              boxShadow: 3,
              p: 1,
              maxHeight: 150,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" }, 
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#555", borderRadius: "4px" },
              zIndex: 1300,
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : notes?.length ? (
              notes.map((note: NoteType) => (
                <Box
                  key={note.id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    color: "white",
                    "&:hover": { bgcolor: "grey.700" },
                  }}
                  onClick={() => {
                    router.push(
                      `/folder/${note.folder.name}/${note.folderId}/notes/${note.id}`
                    );
                    setIsSearching(false);
                    setSearchBox("");
                    setSearchQuery("");
                  }}
                >
                  {note.title}
                </Box>
              ))
            ) : (
              <Box sx={{ color: "grey.500" }}>No results found</Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
