
![tinyforge](https://imgur.com/3uwGtEH.png)

# ⚒ tinyforge

*small game, big strategies*

## the codebase

### logic and game simulation

- **state.ts**
  - all the types that describes the state of a game.
- **ascii-map.ts**
  - for now, without a map editor, we use a funny-looking ascii text format to describe map layouts.
  - see `map-pool.ts` for our little collection of handmade ascii format map designs.
- **arbiter.ts**
  - the "brain" that simulates and runs a game.
  - has a method to create new agents.
  - accepts an ascii-map to initialize the board.
- **agent.ts**
  - a "view" into the state of a game. this view may or may not be censored for fog-of-war, thus maybe providing a limited view into the state of the game.
  - has lots of handy methods for querying and even manipulating game state.
- **simulate-game.ts**
  - the function which actually runs the simulation of the game.
  - the game's architecture is fundamentally *event-sourced*
    - the source-of-truth is a `history` which is comprised of an `initial` game state, and a `chronicle` of gameplay events (turns)
    - the `simulateGame` function's job is to compute a whole new game state, from the given history.
  - each time a player submits a new turn, the arbiter merely adds that turn to the history's chronicle, and then uses `simulateGame` again to recompute the "current" game state, from scratch.
- **proposer.ts**
  - this is an interesting and nuanced part.
  - so, each turn contains an array of player "choices". a choice is like "move this unit from here to there", or "attack from here to there"..
  - the `Proposer` provides `chooser` functions which let you "ask" whether a choice would be valid or not.
    - if the choice is valid, the chooser will return a `commit()` function which you can use to write the consequences of this action into the game state.
    - if the choice is not valid, you just get `null`.
  - now here's the thing: you don't *need* to call the commit function.
    - if you're `simulateGame` and you're evaluating a turn to compute the game state, then you're calling all of those commit functions.
    - but if you're the user interface part, then you can just use the proposer to *ask* whether a given action would be valid or not, thus helping the user avoid submitting a turn with invalid choices (without committing any changes to any state).
    - in fact, the ui can ask whether a move is actually valid *for each tile* nearby a selected unit, and that lets us determine where to render movement liberties that indicate valid possible moves to the user -- so we're bombarding the proposer asking about potential choices all the time!
    - moreover, when the user is planning multiple choices in their turn, we can locally call `commit()`, to "preview" what we expect the state of the game to look like if such a choice were to be submitted.

### user interface to play the game

- **freeplay.ts**
  - run the game in-browser, locally.
  - creates a local simulation where the user controls both players.
- **terminal.ts**
  - a terminal allows a player to play the game.
  - it does not run the simulation. it's merely a "dumb terminal".
  - provides 3d visualization of the game.
  - provides the user interface for submitting turns to the simulation.
- **planner.ts**
  - renders indicators about valid potential choices to the user.
  - allows the user to queue up their choices to build their turn, and submit that turn.

