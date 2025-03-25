"use client"
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import {  addFolder } from "@/utils/api";
import {  IconButton, Stack,  Typography } from "@mui/material";
import addFolderIcon from "../../assets/folderimg.svg";
import Image from "next/image";

const FolderHeader = () => {
    const queryClient = useQueryClient();
    const addFolderMutation = useMutation({
        mutationFn: addFolder,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["folders"] });
        },
      });
  return (
  <Stack px={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight="bold" color="white">
          Folders
        </Typography>
        <IconButton onClick={() => addFolderMutation.mutate()}>
          <Image src={addFolderIcon} alt="Add Folder Icon" width={20} height={20} />
        </IconButton>
      </Stack>
  </Stack>
  )
}

export default FolderHeader
