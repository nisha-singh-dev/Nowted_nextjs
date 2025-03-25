import axios from "axios";

const BASE_URL = "https://nowted-server.remotestate.com";

//add note
export const addNote = async ({ folderId }: { folderId: string }) => {
  if (!folderId) {
    throw new Error("No folder selected");
  }

  const response = await axios.post(`${BASE_URL}/notes`, {
    folderId,
    title: "New Note",
    content: "You can start writing here...",
    isFavorite: false,
    isArchived: false,
  });
  //console.log("note created");
  alert("note added successfully!!!")
  return response.data;
};


//fetch recent notes
export const fetchRecentNotes = async () => {
  const { data } = await axios.get(`${BASE_URL}/notes/recent`);
  return data.recentNotes;
};


// Fetch folders
export const fetchFolders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/folders`);
      return response.data.folders; 
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw new Error("Failed to fetch folders");
    }
  };
  

  //add folder
  export const addFolder = async () => {
    const response = await axios.post(`${BASE_URL}/folders`, { name: "New Folder" });
    console.log("folder added");
    return response.data;
  };
  

  // Update folder name
  export const updateFolder = async (folderId: string, name: string) => {
    await axios.patch(`${BASE_URL}/folders/${folderId}`, { name });
  };
  

  // Delete folder
  export const deleteFolder = async (folderId: string) => {
    // console.log("folder deleted");
    alert("Folder deleted sucessfully!!!")
    await axios.delete(`${BASE_URL}/folders/${folderId}`);
  };


// fetch notes of particular folder or favoruties or archived or trash
// export const fetchNotes = async (folderId?: string, menuType?: string) => {
//   let queryParams = "";

//   if (folderId) {
//     queryParams = `folderId=${folderId}`;
//   } else if (menuType) {
//     if (menuType === "favourites") {
//       queryParams = "archived=false&favorite=true&deleted=false";
//     } else if (menuType === "archived") {
//       queryParams = "archived=true&deleted=false";
//     } else if (menuType === "trash") {
//       queryParams = "deleted=true";
//     }
//   }

//   if (!queryParams) return []; 

//   const response = await axios.get(`${BASE_URL}/notes?${queryParams}`);
//   return response.data.notes;
// };


export const fetchNotes = async (
  pageParam: number = 1,
  folderId?: string,
  menuType?: string
) => {
  let queryParams = `page=${pageParam}&limit=10`; 

  if (folderId) {
    queryParams += `&folderId=${folderId}`;
  } else if (menuType) {
    if (menuType === "favourites") {
      queryParams += "&archived=false&favorite=true&deleted=false";
    } else if (menuType === "archived") {
      queryParams += "&archived=true&deleted=false";
    } else if (menuType === "trash") {
      queryParams += "&deleted=true";
    }
  }

  if (!folderId && !menuType) return { notes: [], total: 0 };

  const response = await axios.get(`${BASE_URL}/notes?${queryParams}`);
  return {
    notes: response.data.notes,
    total: response.data.total 
  };
};

//fetch particular note details
export const fetchNoteDetails = async (notesId: string) => {
  const response = await axios.get(`${BASE_URL}/notes/${notesId}`);

  console.log("note data" ,response);
  
  return response.data.note;
};


// delete note
export const deleteNote = async (noteId: string) => {
  await axios.delete(`${BASE_URL}/notes/${noteId}`);
};

//update fav or archive property
export const updateNoteProperty = async (noteId: string, property: string, value: boolean) => {
  await axios.patch(`${BASE_URL}/notes/${noteId}`, { [property]: value });
};

// restore note
export const restoreNote = async (noteId: string) => {
  if (!noteId) return;
  await axios.post(`${BASE_URL}/notes/${noteId}/restore`);
};

//update note details(title and content)
export const updateNote = async (noteId: string, field: "title" | "content", value: string) => {
  return axios.patch(`https://nowted-server.remotestate.com/notes/${noteId}`, {
    [field]: value,
  });
};
//update folder name 
export const updateNoteFolder = async (noteId: string, folderId: string) => {
  await axios.patch(`${BASE_URL}/notes/${noteId}`, { folderId });
};

//update search 
export const searchNotes = async (query: string) => {
  if (!query.trim()) return []; 

  try {
    const response = await axios.get(`${BASE_URL}/notes`, {
      params: {
        archived: false,
        deleted: false,
        page: 1,
        limit: 10,
        search: query,
      },
    });

    return response.data.notes.filter((note: { title: string }) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );  } catch (error) {
    console.error("Error searching notes:", error);
    return [];
  }
};