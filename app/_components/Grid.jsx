'use client'
import { memo, useEffect, useRef, useState } from "react";
import { useWordSearchStore } from "../store";

const Grid = memo(({ onWordFound, gridSize }) => {
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const gameData = useWordSearchStore(s => s.gameData)
  const updateGameData = useWordSearchStore(s => s.updateGameData)
  const grid = gameData.grids
  const words = gameData.words
  const [foundWordsStyles, setFoundWordsStyles] = useState(gameData.foundWordsStyles ?? []);
  const containerRef = useRef(null)

  const calculateCellSize = () => {
    const screenWidth = window.innerWidth;
    const baseCellSize = 40;
    const maxColumns = gridSize;
    return Math.min(baseCellSize, Math.floor(screenWidth / maxColumns) - 2);
  };

  const [cellSize, setCellSize] = useState(calculateCellSize);

  useEffect(() => {
    if (gameData.difficultyChoosen) {
      setFoundWordsStyles(gameData.foundWordsStyles)
    }

  }, [gameData])


  useEffect(() => {
    const handleResize = () => {
      const newCellSize = calculateCellSize();
      setCellSize(newCellSize);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const cell = getCellFromTouch(e);
      if (cell) {
        setStartCell(cell);
        setEndCell(null);
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDragging || !startCell) return;
      const cell = getCellFromTouch(e);
      if (cell) handleMouseMove(cell.row, cell.col);
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      handleMouseUp();
    };
    const handleMouseUp = () => {
      if (startCell && endCell) {
        const selectedWord = calculateWord(startCell, endCell, grid);
        const foundWords = gameData.foundWords
        if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
          const style = getSelectionStyle();
          setFoundWordsStyles((prev) => [
            ...prev,
            {
              word: selectedWord,
              style,
              color: getRandomColor(),
            },
          ]);
          updateGameData({
            foundWordsStyles: [
              ...foundWordsStyles,
              {
                word: selectedWord,
                style,
                color: getRandomColor()
              }]
          })
          onWordFound(selectedWord, [startCell, endCell]);
        }
      }
      setStartCell(null);
      setEndCell(null);
      setIsDragging(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('mouseup', handleMouseUp, { passive: false });
    container.addEventListener('mouseleave', handleMouseUp, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart, { passive: false });
      container.removeEventListener('touchmove', handleTouchMove, { passive: false });
      container.removeEventListener('touchend', handleTouchEnd, { passive: false });
      container.removeEventListener('mouseup', handleMouseUp, { passive: false });
      container.removeEventListener('mouseleave', handleMouseUp, { passive: false });
    };
  }, [isDragging, startCell, endCell]); // Adding dependencies to ensure correct behavior


  const getCellFromTouch = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!element) return null;
    const [row, col] = (element.dataset.cell || "").split("-").map(Number);
    return row >= 0 && col >= 0 ? { row, col } : null;
  };

  const handleMouseDown = (row, col) => {
    setStartCell({ row, col });
    setEndCell(null);
    setIsDragging(true);
  };

  const handleMouseMove = (row, col) => {
    if (!isDragging || !startCell) return;

    const { row: startRow, col: startCol } = startCell;
    const dx = Math.abs(row - startRow);
    const dy = Math.abs(col - startCol);

    if (dx === 0 || dy === 0 || dx === dy) {
      setEndCell({ row, col });
    }
  };

  // const handleMouseUp = () => {
  //   if (startCell && endCell) {
  //     const selectedWord = calculateWord(startCell, endCell, grid);
  //     const foundWords = gameData.foundWords
  //     if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
  //       const style = getSelectionStyle();
  //       setFoundWordsStyles((prev) => [
  //         ...prev,
  //         {
  //           word: selectedWord,
  //           style,
  //           color: getRandomColor(),
  //         },
  //       ]);
  //       updateGameData({
  //         foundWordsStyles: [
  //           ...foundWordsStyles,
  //           {
  //             word: selectedWord,
  //             style,
  //             color: getRandomColor()
  //           }]
  //       })
  //       onWordFound(selectedWord, [startCell, endCell]);
  //     }
  //   }
  //   setStartCell(null);
  //   setEndCell(null);
  //   setIsDragging(false);
  // };

  // const handleTouchStart = (e) => {
  //   e.preventDefault()
  //   const cell = getCellFromTouch(e);
  //   if (cell) {
  //     setStartCell(cell);
  //     setEndCell(null);
  //     setIsDragging(true);
  //   }
  // };
  //
  // const handleTouchMove = (e) => {
  //   e.preventDefault()
  //   if (!isDragging || !startCell) return;
  //   const cell = getCellFromTouch(e);
  //   if (cell) handleMouseMove(cell.row, cell.col);
  // };
  //
  // const handleTouchEnd = (e) => {
  //   e.preventDefault()
  //   handleMouseUp();
  // };

  const calculateWord = (start, end, grid) => {
    const { row: startRow, col: startCol } = start;
    const { row: endRow, col: endCol } = end;

    const dx = Math.sign(endRow - startRow);
    const dy = Math.sign(endCol - startCol);

    const word = [];
    let r = startRow,
      c = startCol;

    while (r !== endRow + dx || c !== endCol + dy) {
      word.push(grid[r][c]);
      r += dx;
      c += dy;
    }

    return word.join("");
  };

  const getSelectionStyle = () => {
    if (!startCell || !endCell) return { display: "none" };

    const { row: startRow, col: startCol } = startCell;
    const { row: endRow, col: endCol } = endCell;

    let [x1, y1, x2, y2] = [0, 0, 0, 0]

    x1 = startCol * cellSize
    y1 = startRow * cellSize
    x2 = endCol * cellSize
    y2 = endRow * cellSize

    let angle = 0

    if (startCol < endCol && startRow < endRow) {
      // topleft to bottom right
      x2 += cellSize / 2
      y2 += cellSize / 2
      x1 -= 0
      y1 -= cellSize / 2
      angle = 45
    }
    else if (startCol > endCol && startRow > endRow) {
      // bottom right to top left
      y2 -= cellSize / 2
      x2 += cellSize / 2
      // x1 += cellSize / 2
      x1 += cellSize
      y1 += cellSize / 2
      angle = 225
    }
    else if (startCol > endCol && startRow < endRow) {
      // top right to bottom left
      y2 += cellSize / 2
      x2 += cellSize / 2
      // x1 += cellSize / 2
      x1 += cellSize
      y1 -= 20
      angle = 135
    }
    else if (startCol < endCol && startRow > endRow) {
      // bottom left to top right
      y2 -= cellSize / 2
      x2 += cellSize / 2
      // x1 += cellSize / 2
      y1 += cellSize / 2
      angle = 315
    }
    else if (startCol < endCol) {
      //horizontal
      // left to right
      x2 += cellSize
      angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    }
    else if (startCol > endCol) {
      // right to left
      x1 += cellSize
      angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    }
    else if (startRow < endRow) {
      // vertical
      // top to bottom
      y1 -= cellSize / 2
      y2 += cellSize / 2
      x1 += cellSize / 2
      x2 += cellSize / 2
      angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    }
    else if (startRow > endRow) {
      // bottom to top
      y1 += cellSize / 2
      y2 -= cellSize / 2
      x1 += cellSize / 2
      x2 += cellSize / 2
      angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    }

    // Calculate the center position of the start and end cells
    // const x1 = startCol * cellSize
    // const y1 = startRow * cellSize 
    // // const x2 = endCol * cellSize  
    // // const y2 = endRow * cellSize
    // const x2 = endCol * cellSize + (endCol > startCol ? cellSize : 0);
    // const y2 = endRow * cellSize + (endRow > startRow ? cellSize : 0); 

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    return {
      width: `${distance}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0 50%",
      left: `${x1}px`,
      top: `${y1}px`,
    };
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white grid shadow-2xl rounded-xl"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        // gridAutoRows: `${cellSize}px`,
      }}
    // onMouseUp={handleMouseUp}
    // onMouseLeave={handleMouseUp}
    // onTouchEnd={handleTouchEnd}
    // onTouchStart={handleTouchStart}
    // onTouchMove={handleTouchMove}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            data-cell={`${rowIndex}-${colIndex}`}
            className="flex items-center justify-center font-bold cursor-pointer select-none"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              fontSize: `${cellSize * 0.8}px`,
              // lineHeight: `${fontSize}px`
            }}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseMove(rowIndex, colIndex)}
          // onTouchStart={handleTouchStart}
          // onTouchMove={handleTouchMove}
          >
            {letter}
          </div>
        ))
      )}

      <div
        className="absolute bg-black/30 z-30 rounded-full pointer-events-none"
        style={{
          ...getSelectionStyle(),
          height: `${cellSize}px`,
        }}
      ></div>

      {foundWordsStyles.map((found, index) => (
        <div
          key={index}
          className="absolute z-20 rounded-full pointer-events-none"
          style={{
            ...found.style,
            backgroundColor: found.color,
            opacity: 0.5,
            height: `${cellSize}px`,
          }}
        ></div>
      ))}
    </div>
  );
});

export default Grid;

