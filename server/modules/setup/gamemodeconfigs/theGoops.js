const GRID_X = 15;
const GRID_Y = 15;

const room = new Array(GRID_Y).fill().map((row, rowIndex) => {
  if (rowIndex >= 1 && rowIndex < GRID_Y - 1) {
    // Create a row of 'goop' for the center (GRID_X-2)x(GRID_Y-2) region.
    return new Array(GRID_X).fill('goop', 1, GRID_X - 1);
  } else {
    // Create a row of empty tiles for the outer border.
    return new Array(GRID_X).fill();
  }
});

module.exports = {
    THE_GOOPS_LOOP: true,
    //SPAWN_CLASS: ["basic","basic"],
    X_GRID: GRID_X,
    Y_GRID: GRID_Y,
    WIDTH: 5000,
    HEIGHT: 5000,
    BOTS: 32,
    BOT_XP: 12500,
    ROOM_SETUP: room,
    LEVEL_CAP: 4096,
    LEVEL_SKILL_POINT_FUNCTION: level => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level & 1 == 1) return 1;
        if (level % 3 == 1 && level < 280) return 1;
        return 0;
    },
};