"use client";

import { Paper, Typography, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MiddleCardProps {
  note: {
    id: string;
    title: string;
    preview: string;
    createdAt: string;
  };
  folderName?: string;
  folderId?: string;
  noteId: string;
  menuType?: string;
  selectedNoteId?: string;
}

export default function MiddleCard({ note, folderName, folderId, noteId, menuType }:MiddleCardProps) {
  const pathname = usePathname();
  const isSelected = pathname.includes(noteId);
  console.log("note data",note);
  

  return (
    <Link
      href={
        folderName && folderId
          ? `/folder/${folderName}/${folderId}/notes/${noteId}`
          : `/menu/${menuType}/notes/${noteId}`
      }
      style={{ textDecoration: "none", width: "100%" }}
    >
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 2,
          transition: "all 0.2s",
          bgcolor: isSelected ? "grey.700" : "grey.800",
          color: isSelected ? "black" : "white",
          "&:hover": { bgcolor: "grey.600" },
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {note.title || "Untitled Note"}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "No Date"}
          </Typography>
          <Typography variant="body2">
            {note.preview ? note.preview.substring(0, 13) + "..." : "No Content"}
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
}
