import { Board } from "@/components/board/Board";
import { BoardProvider } from "@/context/BoardContext";
import Image from "next/image";

export default function Home() {
   return (
      <BoardProvider>
         <Board />
      </BoardProvider>
   );
}
