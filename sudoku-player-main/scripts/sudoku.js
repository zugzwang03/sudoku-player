const newGrid = (size) => {
  let arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }

  for (let i = 0; i < Math.pow(size, 2); i++) {
    arr[Math.floor(i / size)][i % size] = CONSTANTS.UNASSIGNED;
  }

  return arr;
};

// Check for duplicates in column
const isColSafe = (grid, col, value) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// Check for duplicates in row
const isRowSafe = (grid, row, value) => {
  for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
    if (grid[row][col] === value) return false;
  }
  return true;
};

// Check for duplicates in 3x3
const isBoxSafe = (grid, box_row, box_col, value) => {
  for (let row = 0; row < CONSTANTS.BOX_SIZE; row++) {
    for (let col = 0; col < CONSTANTS.BOX_SIZE; col++) {
      if (grid[row + box_row][col + box_col] === value) return false;
    }
  }
  return true;
};

// Check for final placement
const isSafe = (grid, row, col, value) => {
  return (
    isColSafe(grid, col, value) &&
    isRowSafe(grid, row, value) &&
    isBoxSafe(grid, row - (row % 3), col - (col % 3), value) &&
    value !== CONSTANTS.UNASSIGNED
  );
};

// Find unassigned cell
const findUnassignedPos = (grid, pos) => {
  for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
    for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
      if (grid[row][col] === CONSTANTS.UNASSIGNED) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }
  return false;
};

// Shuffle grid
const shuffleArray = (arr) => {
  let curr_index = arr.length;

  while (curr_index !== 0) {
    let rand_index = Math.floor(Math.random() * curr_index);
    curr_index -= 1;

    let temp = arr[curr_index];
    arr[curr_index] = arr[rand_index];
    arr[rand_index] = temp;
  }

  return arr;
};

// Check if puzzle is complete
const isFullGrid = (grid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== CONSTANTS.UNASSIGNED;
    });
  });
};

const sudokuCreate = (grid) => {
  let unassigned_pos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

  let number_list = shuffleArray([...CONSTANTS.NUMBERS]);

  let row = unassigned_pos.row;
  let col = unassigned_pos.col;

  number_list.forEach((num, i) => {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (isFullGrid(grid)) {
        return true;
      } else {
        if (sudokuCreate(grid)) {
          return true;
        }
      }

      grid[row][col] = CONSTANTS.UNASSIGNED;
    }
  });

  return isFullGrid(grid);
};

const sudokuCheck = (grid) => {
  let unassigned_pos = {
    row: -1,
    col: -1,
  };

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (isSafe(grid, i, j, num)) {
        if (isFullGrid(grid)) {
          return true;
        } else {
          if (sudokuCreate(grid)) {
            return true;
          }
        }
      }
    });
  });

  return isFullGrid(grid);
};

const rand = () => Math.floor(Math.random() * CONSTANTS.GRID_SIZE);

const removeCells = (grid, level) => {
  let res = [...grid];
  let attempts = level;
  while (attempts > 0) {
    let row = rand();
    let col = rand();
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }
    res[row][col] = CONSTANTS.UNASSIGNED;
    attempts--;
  }
  return res;
};

// Generate initial grid as per level
const sudokuGen = (level) => {
  let sudoku = newGrid(CONSTANTS.GRID_SIZE);
  let check = sudokuCreate(sudoku);
  if (check) {
    let question = removeCells(sudoku, level);
    return {
      original: sudoku,
      question: question,
    };
  }
  return undefined;
};
