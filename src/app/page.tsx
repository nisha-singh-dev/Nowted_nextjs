// import DefaultList from "../components/DefaultList/DefaultList";
// import DefaultContent from "../components/DefaultContent/DefaultContent";
// import { Box } from "@mui/material";

import DefaultContent from "@/components/DefaultContent/DefaultContent";

// export default function Page({ children }: { children?: React.ReactNode }) {
//   return (
//     <Box display="flex" height="100vh" width="100vw">
//       {/* Left Sidebar - Default List (Fixed 20%) */}
//       <Box width="20%">
//         <DefaultList />
//       </Box>

//       {/* Main Content - Takes Remaining Space */}
//       <Box flexGrow={1}>
//         {children ? children : <DefaultContent />}
//       </Box>
//     </Box>
//   );
// }
export default function page(){
  return(

    <DefaultContent />
  )
}