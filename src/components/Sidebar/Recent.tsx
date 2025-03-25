"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecentNotes } from "@/utils/api";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import noteview from "../../assets/recent.svg";

interface NoteType {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  folderId: string;
  folder: {
    id: string;
    name: string;
  };
}

export default function Recent() {
  const pathname = usePathname();
  const { data: recentNotes = [], isLoading, isError } = useQuery<NoteType[]>({
    queryKey: ["recentNotes"],
    queryFn: fetchRecentNotes,
  });

  if (isLoading) return <Typography p={2}>Loading...</Typography>;
  if (isError) return <Typography p={2} color="error">Error fetching recent notes.</Typography>;

  return (
    <Stack p={2}>
      <Typography variant="subtitle1" fontWeight="bold" color="white">
        Recent Notes
      </Typography>

      <Box mt={1}>
        {recentNotes.map((note) => {
          const isSelected = pathname.includes(note.id);

          return (
            <Box
              key={note.id}
              display="flex"
              alignItems="center"
              sx={{
                pl: 1.5,
                py: 1,
                borderRadius: "6px",
                transition: "background-color 0.3s ease",
                backgroundColor: isSelected ? "grey.700" : "transparent",
                "&:hover": { backgroundColor: "grey.600" },
              }}
            >
              <Link
                href={`/folder/${note.folder.name}/${note.folderId}/notes/${note.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: isSelected ? "black" : "white",
                  width: "100%",
                }}
              >
                <Image src={noteview} alt="Note icon" width={20} height={20} style={{ marginRight: 8 }} />
                <Typography variant="body1">{note.title}</Typography>
              </Link>
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}


