
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import { fetchNoteDetails, restoreNote } from "@/utils/api";
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import Image from "next/image";
import restore from "@/assets/restore.svg"; 

const RestoreContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const noteId = pathname.split("/").pop();

  //Fetching note details
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteDetails(noteId as string),
    enabled: !!noteId,
  });

  // restore note 
  const restoreMutation = useMutation({
    mutationFn: () => restoreNote(noteId as string),
    onSuccess: () => {
      alert("Note restored successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId]});

      if (note?.isArchived) {
        router.push(`/menu/archived/notes/${note?.id}`);
      } else if (note?.isFavorite) {
        router.push(`/menu/favourites/notes/${note?.id}`);
      } else {
        router.push(`/folder/${note?.folder.name}/${note?.folder.id}/notes/${note?.id}`);
      }    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "black",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !note) {
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
        <Typography variant="h6" color="error">
          Failed to load note details. Please try again.
        </Typography>
      </Box>
    );
  }

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
      <Image src={restore} alt="Restore Note" width={100} height={100} />

      <Typography variant="h5" fontWeight="bold" color="white" mt={2}>
        Restore {note?.title}
      </Typography>

      <Typography variant="body1" color="grey.300" mt={1} >
        Do not want to lose this note? Click Restore, and it will be added back to your list.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => restoreMutation.mutate()}
          disabled={restoreMutation.isPending}
        >
         Restore
        </Button>
      </Stack>
    </Box>
  );
};

export default RestoreContent;



