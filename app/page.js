'use client'
import DifficultyChoose from "./_components/DifficultyChoose";
import WordSearch from "./_components/WordSearch";


export default function Home() {

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-500">
      <DifficultyChoose />
    </div>
  );
}
