import { useEffect, useMemo, useState } from 'react';
import { teams } from './data/teams';
import brandLogo from './assets/bracket-drafting-logo.svg';

const STORAGE_KEY = 'march-madness-pool-state-v2026';
const ADMIN_ACCESS_KEY = 'bracket-drafting-admin-access';
const ADMIN_PASSWORD = 'BracketDrafting2026';
const pageConfigs = [
  { key: 'dashboard', hash: '#dashboard', label: 'Dashboard' },
  { key: 'setup', hash: '#setup', label: 'Pool Setup' },
  { key: 'results', hash: '#results', label: 'Game Winners' },
];

const roundConfigs = [
  { key: 'firstFour', label: 'First Four', gameCount: 4, points: 1 },
  { key: 'round64', label: 'Round of 64', gameCount: 32, points: 1 },
  { key: 'round32', label: 'Round of 32', gameCount: 16, points: 2 },
  { key: 'sweet16', label: 'Sweet 16', gameCount: 8, points: 3 },
  { key: 'elite8', label: 'Elite 8', gameCount: 4, points: 4 },
  { key: 'final4', label: 'Final Four', gameCount: 2, points: 5 },
  { key: 'championship', label: 'Championship', gameCount: 1, points: 6 },
];

const teamLookup = Object.fromEntries(teams.map((team) => [team.id, team]));

const bracketAssignments = {
  'firstFour-1': { teamA: 'umbc', teamB: 'howard' },
  'firstFour-2': { teamA: 'texas', teamB: 'nc-state' },
  'firstFour-3': { teamA: 'prairie-view-am', teamB: 'lehigh' },
  'firstFour-4': { teamA: 'miami-oh', teamB: 'smu' },
  'round64-1': { teamA: 'duke', teamB: 'siena' },
  'round64-2': { teamA: 'ohio-state', teamB: 'tcu' },
  'round64-3': { teamA: 'st-johns', teamB: 'northern-iowa' },
  'round64-4': { teamA: 'kansas', teamB: 'california-baptist' },
  'round64-5': { teamA: 'louisville', teamB: 'south-florida' },
  'round64-6': { teamA: 'michigan-state', teamB: 'north-dakota-state' },
  'round64-7': { teamA: 'ucla', teamB: 'ucf' },
  'round64-8': { teamA: 'uconn', teamB: 'furman' },
  'round64-9': { teamA: 'florida', teamB: '' },
  'round64-10': { teamA: 'clemson', teamB: 'iowa' },
  'round64-11': { teamA: 'vanderbilt', teamB: 'mcneese' },
  'round64-12': { teamA: 'nebraska', teamB: 'troy' },
  'round64-13': { teamA: 'north-carolina', teamB: 'vcu' },
  'round64-14': { teamA: 'illinois', teamB: 'penn' },
  'round64-15': { teamA: 'saint-marys', teamB: 'texas-am' },
  'round64-16': { teamA: 'houston', teamB: 'idaho' },
  'round64-17': { teamA: 'arizona', teamB: 'liu' },
  'round64-18': { teamA: 'villanova', teamB: 'utah-state' },
  'round64-19': { teamA: 'wisconsin', teamB: 'high-point' },
  'round64-20': { teamA: 'arkansas', teamB: 'hawaii' },
  'round64-21': { teamA: 'byu', teamB: '' },
  'round64-22': { teamA: 'gonzaga', teamB: 'kennesaw-state' },
  'round64-23': { teamA: 'miami-fl', teamB: 'missouri' },
  'round64-24': { teamA: 'purdue', teamB: 'queens' },
  'round64-25': { teamA: 'michigan', teamB: '' },
  'round64-26': { teamA: 'georgia', teamB: 'saint-louis' },
  'round64-27': { teamA: 'texas-tech', teamB: 'akron' },
  'round64-28': { teamA: 'alabama', teamB: 'hofstra' },
  'round64-29': { teamA: 'tennessee', teamB: '' },
  'round64-30': { teamA: 'virginia', teamB: 'wright-state' },
  'round64-31': { teamA: 'kentucky', teamB: 'santa-clara' },
  'round64-32': { teamA: 'iowa-state', teamB: 'tennessee-state' },
};

const gameMetadata = {
  'firstFour-1': { label: 'First Four Game 1', detail: '(16) UMBC vs (16) Howard' },
  'firstFour-2': { label: 'First Four Game 2', detail: '(11) Texas vs (11) NC State' },
  'firstFour-3': { label: 'First Four Game 3', detail: '(16) Prairie View A&M vs (16) Lehigh' },
  'firstFour-4': { label: 'First Four Game 4', detail: '(11) Miami (OH) vs (11) SMU' },
  'round64-1': { label: 'East Region', detail: '(1) Duke vs (16) Siena' },
  'round64-2': { label: 'East Region', detail: '(8) Ohio State vs (9) TCU' },
  'round64-3': { label: 'East Region', detail: '(5) St. John\'s vs (12) Northern Iowa' },
  'round64-4': { label: 'East Region', detail: '(4) Kansas vs (13) California Baptist' },
  'round64-5': { label: 'East Region', detail: '(6) Louisville vs (11) South Florida' },
  'round64-6': { label: 'East Region', detail: '(3) Michigan State vs (14) North Dakota State' },
  'round64-7': { label: 'East Region', detail: '(7) UCLA vs (10) UCF' },
  'round64-8': { label: 'East Region', detail: '(2) UConn vs (15) Furman' },
  'round64-9': { label: 'South Region', detail: '(1) Florida vs First Four winner' },
  'round64-10': { label: 'South Region', detail: '(8) Clemson vs (9) Iowa' },
  'round64-11': { label: 'South Region', detail: '(5) Vanderbilt vs (12) McNeese' },
  'round64-12': { label: 'South Region', detail: '(4) Nebraska vs (13) Troy' },
  'round64-13': { label: 'South Region', detail: '(6) North Carolina vs (11) VCU' },
  'round64-14': { label: 'South Region', detail: '(3) Illinois vs (14) Penn' },
  'round64-15': { label: 'South Region', detail: '(7) Saint Mary\'s vs (10) Texas A&M' },
  'round64-16': { label: 'South Region', detail: '(2) Houston vs (15) Idaho' },
  'round64-17': { label: 'West Region', detail: '(1) Arizona vs (16) LIU' },
  'round64-18': { label: 'West Region', detail: '(8) Villanova vs (9) Utah State' },
  'round64-19': { label: 'West Region', detail: '(5) Wisconsin vs (12) High Point' },
  'round64-20': { label: 'West Region', detail: '(4) Arkansas vs (13) Hawaii' },
  'round64-21': { label: 'West Region', detail: '(6) BYU vs First Four winner' },
  'round64-22': { label: 'West Region', detail: '(3) Gonzaga vs (14) Kennesaw State' },
  'round64-23': { label: 'West Region', detail: '(7) Miami (FL) vs (10) Missouri' },
  'round64-24': { label: 'West Region', detail: '(2) Purdue vs (15) Queens' },
  'round64-25': { label: 'Midwest Region', detail: '(1) Michigan vs First Four winner' },
  'round64-26': { label: 'Midwest Region', detail: '(8) Georgia vs (9) Saint Louis' },
  'round64-27': { label: 'Midwest Region', detail: '(5) Texas Tech vs (12) Akron' },
  'round64-28': { label: 'Midwest Region', detail: '(4) Alabama vs (13) Hofstra' },
  'round64-29': { label: 'Midwest Region', detail: '(6) Tennessee vs First Four winner' },
  'round64-30': { label: 'Midwest Region', detail: '(3) Virginia vs (14) Wright State' },
  'round64-31': { label: 'Midwest Region', detail: '(7) Kentucky vs (10) Santa Clara' },
  'round64-32': { label: 'Midwest Region', detail: '(2) Iowa State vs (15) Tennessee State' },
};

function buildGames() {
  return roundConfigs.flatMap((round) =>
    Array.from({ length: round.gameCount }, (_, index) => ({
      ...(gameMetadata[`${round.key}-${index + 1}`] ?? {}),
      id: `${round.key}-${index + 1}`,
      roundKey: round.key,
      label: gameMetadata[`${round.key}-${index + 1}`]?.label ?? `${round.label} Game ${index + 1}`,
      detail: gameMetadata[`${round.key}-${index + 1}`]?.detail ?? '',
      teamA: bracketAssignments[`${round.key}-${index + 1}`]?.teamA ?? '',
      teamB: bracketAssignments[`${round.key}-${index + 1}`]?.teamB ?? '',
      winner: '',
    })),
  );
}

function createSampleState() {
  const allTeamIds = teams.map((team) => team.id);
  const sliceSize = Math.ceil(allTeamIds.length / 4);

  const players = [
    { id: 'player-1', name: 'Alex', teamIds: allTeamIds.slice(0, sliceSize) },
    { id: 'player-2', name: 'Blake', teamIds: allTeamIds.slice(sliceSize, sliceSize * 2) },
    { id: 'player-3', name: 'Casey', teamIds: allTeamIds.slice(sliceSize * 2, sliceSize * 3) },
    { id: 'player-4', name: 'Drew', teamIds: allTeamIds.slice(sliceSize * 3) },
  ];

  return { players, games: buildGames() };
}

function sanitizeState(value) {
  if (!value || !Array.isArray(value.players) || !Array.isArray(value.games)) {
    return createSampleState();
  }

  const players = Array.from({ length: 4 }, (_, index) => {
    const player = value.players[index];

    return {
      id: player?.id || `player-${index + 1}`,
      name: player?.name || `Player ${index + 1}`,
      teamIds: Array.isArray(player?.teamIds) ? player.teamIds.filter((teamId) => teamLookup[teamId]) : [],
    };
  });

  return {
    players,
    games: buildGames().map((game) => {
      const savedGame = value.games.find((entry) => entry.id === game.id);

      if (!savedGame) {
        return game;
      }

      const teamA = teamLookup[savedGame.teamA] ? savedGame.teamA : '';
      const teamB = teamLookup[savedGame.teamB] ? savedGame.teamB : '';
      const winner = [teamA, teamB].includes(savedGame.winner) ? savedGame.winner : '';

      return {
        ...game,
        teamA,
        teamB,
        winner,
      };
    }),
  };
}

function loadState() {
  if (typeof window === 'undefined') {
    return createSampleState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : createSampleState();
  } catch (error) {
    return createSampleState();
  }
}

function getRoundPoints(roundKey) {
  return roundConfigs.find((round) => round.key === roundKey)?.points ?? 0;
}

function formatTeamName(teamId) {
  return teamLookup[teamId]?.name ?? 'Unassigned';
}

function formatTeamOption(team) {
  return `(${team.seed}) ${team.name}${team.playIn ? ' - Play-In' : ''}`;
}

function getPageFromHash(hash) {
  return pageConfigs.find((page) => page.hash === hash)?.key ?? 'dashboard';
}

function loadAdminAccess() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(ADMIN_ACCESS_KEY) === 'granted';
}

function App() {
  const [state, setState] = useState(loadState);
  const [activePage, setActivePage] = useState(() => getPageFromHash(window.location.hash));
  const [adminUnlocked, setAdminUnlocked] = useState(loadAdminAccess);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    function handleHashChange() {
      setActivePage(getPageFromHash(window.location.hash));
    }

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#dashboard');
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const teamPoints = useMemo(() => {
    const scores = Object.fromEntries(teams.map((team) => [team.id, 0]));

    state.games.forEach((game) => {
      if (game.winner) {
        scores[game.winner] += getRoundPoints(game.roundKey);
      }
    });

    return scores;
  }, [state.games]);

  const teamOwners = useMemo(() => {
    const owners = {};

    state.players.forEach((player) => {
      player.teamIds.forEach((teamId) => {
        owners[teamId] = player.id;
      });
    });

    return owners;
  }, [state.players]);

  const leaderboard = useMemo(
    () =>
      state.players
        .map((player) => ({
          ...player,
          points: player.teamIds.reduce((total, teamId) => total + (teamPoints[teamId] ?? 0), 0),
        }))
        .sort((left, right) => right.points - left.points || left.name.localeCompare(right.name)),
    [state.players, teamPoints],
  );

  const teamRows = useMemo(
    () =>
      teams
        .map((team) => {
          const owner = state.players.find((player) => player.id === teamOwners[team.id]);

          return {
            ...team,
            points: teamPoints[team.id] ?? 0,
            ownerName: owner?.name ?? 'Available',
          };
        })
        .sort((left, right) => right.points - left.points || left.name.localeCompare(right.name)),
    [state.players, teamOwners, teamPoints],
  );

  const upcomingGames = useMemo(
    () =>
      state.games.filter((game) => !game.winner && (game.teamA || game.teamB)).slice(0, 12),
    [state.games],
  );

  function updatePlayerName(playerId, name) {
    setState((current) => ({
      ...current,
      players: current.players.map((player) => (player.id === playerId ? { ...player, name } : player)),
    }));
  }

  function addTeamToPlayer(playerId, teamId) {
    if (!teamId) {
      return;
    }

    setState((current) => {
      const alreadyOwnedBy = current.players.find(
        (player) => player.teamIds.includes(teamId) && player.id !== playerId,
      );

      if (alreadyOwnedBy) {
        return current;
      }

      return {
        ...current,
        players: current.players.map((player) => {
          if (player.id !== playerId || player.teamIds.includes(teamId)) {
            return player;
          }

          return {
            ...player,
            teamIds: [...player.teamIds, teamId].sort((left, right) =>
              formatTeamName(left).localeCompare(formatTeamName(right)),
            ),
          };
        }),
      };
    });
  }

  function removeTeamFromPlayer(playerId, teamId) {
    setState((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId
          ? { ...player, teamIds: player.teamIds.filter((entry) => entry !== teamId) }
          : player,
      ),
    }));
  }

  function updateGame(gameId, field, value) {
    setState((current) => ({
      ...current,
      games: current.games.map((game) => {
        if (game.id !== gameId) {
          return game;
        }

        const nextGame = { ...game, [field]: value };

        if (field === 'teamA' || field === 'teamB') {
          if (nextGame.teamA && nextGame.teamA === nextGame.teamB) {
            nextGame.teamB = field === 'teamA' ? '' : nextGame.teamB;
            nextGame.teamA = field === 'teamB' ? '' : nextGame.teamA;
          }

          if (![nextGame.teamA, nextGame.teamB].includes(nextGame.winner)) {
            nextGame.winner = '';
          }
        }

        if (field === 'winner' && ![nextGame.teamA, nextGame.teamB].includes(value)) {
          nextGame.winner = '';
        }

        return nextGame;
      }),
    }));
  }

  function resetToSampleData() {
    setState(createSampleState());
  }

  function unlockAdminPages(event) {
    event.preventDefault();

    if (passwordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setPasswordInput('');
      setPasswordError('');
      window.localStorage.setItem(ADMIN_ACCESS_KEY, 'granted');
      return;
    }

    setPasswordError('Incorrect password. Please try again.');
  }

  function lockAdminPages() {
    setAdminUnlocked(false);
    setPasswordInput('');
    setPasswordError('');
    window.localStorage.removeItem(ADMIN_ACCESS_KEY);
    window.location.hash = '#dashboard';
  }

  const gamesByRound = roundConfigs.map((round) => ({
    ...round,
    games: state.games.filter((game) => game.roundKey === round.key),
  }));

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <img alt="Bracket Drafting logo" className="brand-logo" src={brandLogo} />
          <div className="hero-stats" aria-label="Platform highlights">
            <div className="hero-stat">
              <strong>{state.players.length}</strong>
              <span>players in the pool</span>
            </div>
            <div className="hero-stat">
              <strong>{teams.length}</strong>
              <span>draftable teams</span>
            </div>
            <div className="hero-stat">
              <strong>{state.games.filter((game) => game.winner).length}</strong>
              <span>games scored so far</span>
            </div>
          </div>
        </div>
        <div className="hero-actions">
          {adminUnlocked ? (
            <button className="ghost-button" onClick={lockAdminPages} type="button">
              Lock admin pages
            </button>
          ) : null}
        </div>
      </header>

      <nav className="page-nav" aria-label="Site pages">
        {pageConfigs.map((page) => (
          <a
            className={`page-link${activePage === page.key ? ' is-active' : ''}`}
            href={page.hash}
            key={page.key}
          >
            {page.label}
          </a>
        ))}
      </nav>

      {!adminUnlocked && activePage !== 'dashboard' ? (
        <section className="panel auth-panel">
          <div className="section-heading">
            <div>
              <h2>Admin Access</h2>
              <p>Enter the shared password to open the setup and game winner pages.</p>
            </div>
          </div>
          <form className="auth-form" onSubmit={unlockAdminPages}>
            <label className="field-label" htmlFor="admin-password">
              Shared password
            </label>
            <input
              autoComplete="current-password"
              className="text-input"
              id="admin-password"
              onChange={(event) => {
                setPasswordInput(event.target.value);
                if (passwordError) {
                  setPasswordError('');
                }
              }}
              type="password"
              value={passwordInput}
            />
            {passwordError ? <p className="error-copy">{passwordError}</p> : null}
            <button className="secondary-button" type="submit">
              Unlock admin pages
            </button>
          </form>
        </section>
      ) : null}

      {activePage === 'dashboard' ? (
        <>
          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Leaderboard</h2>
                <p>Bracket Drafting points roll in automatically as drafted teams keep advancing.</p>
              </div>
            </div>
            <div className="leaderboard-grid">
              {leaderboard.map((player, index) => (
                <article className="leader-card" key={player.id}>
                  <span className="rank-badge">#{index + 1}</span>
                  <h3>{player.name}</h3>
                  <p className="big-score">{player.points}</p>
                  <p className="muted">{player.teamIds.length} teams drafted</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Upcoming Games</h2>
                <p>Everyone can follow what is next without needing access to editing screens.</p>
              </div>
            </div>
            <div className="games-grid">
              {upcomingGames.map((game) => (
                <article className="game-card" key={game.id}>
                  <p className="game-label">{game.label}</p>
                  {game.detail ? <p className="game-detail">{game.detail}</p> : null}
                  <p className="matchup-line">
                    <span>{game.teamA ? formatTeamName(game.teamA) : 'TBD'}</span>
                    <span>vs</span>
                    <span>{game.teamB ? formatTeamName(game.teamB) : 'TBD'}</span>
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Team Scores</h2>
                <p>See every tournament team, who drafted it, and how much value it has generated.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Owner</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRows.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>{team.ownerName}</td>
                      <td>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {activePage === 'setup' && adminUnlocked ? (
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Pool Setup</h2>
              <p>Use this page once at the beginning to assign players and drafted teams.</p>
            </div>
            <div className="page-note">Commissioner-only page</div>
          </div>
          <div className="players-grid">
            {state.players.map((player) => {
              const availableTeams = teams.filter(
                (team) => !teamOwners[team.id] || teamOwners[team.id] === player.id,
              );

              return (
                <article className="player-card" key={player.id}>
                  <label className="field-label" htmlFor={`${player.id}-name`}>
                    Player name
                  </label>
                  <input
                    className="text-input"
                    id={`${player.id}-name`}
                    onChange={(event) => updatePlayerName(player.id, event.target.value)}
                    type="text"
                    value={player.name}
                  />

                  <label className="field-label" htmlFor={`${player.id}-add-team`}>
                    Add drafted team
                  </label>
                  <div className="inline-controls">
                    <select
                      className="select-input"
                      defaultValue=""
                      id={`${player.id}-add-team`}
                      onChange={(event) => {
                        addTeamToPlayer(player.id, event.target.value);
                        event.target.value = '';
                      }}
                    >
                      <option value="">Select a team</option>
                      {availableTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {formatTeamOption(team)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="chips-wrap">
                    {player.teamIds.map((teamId) => (
                      <div className="team-chip" key={teamId}>
                        <span>
                          {formatTeamName(teamId)} ({teamPoints[teamId] ?? 0})
                        </span>
                        <button
                          className="chip-button"
                          onClick={() => removeTeamFromPlayer(player.id, teamId)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {player.teamIds.length === 0 ? <p className="muted">No teams drafted yet.</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {activePage === 'results' && adminUnlocked ? (
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Game Winners</h2>
              <p>Use this page to enter each matchup result and keep the dashboard current.</p>
            </div>
            <div className="page-note">Single updater page</div>
          </div>
          <div className="rounds-stack">
            {gamesByRound.map((round) => (
              <details className="round-panel" key={round.key} open={round.key === 'firstFour' || round.key === 'round64'}>
                <summary>
                  <span>{round.label}</span>
                  <span>{round.points} pts per win</span>
                </summary>
                <div className="games-grid">
                  {round.games.map((game) => (
                    <div className="game-card" key={game.id}>
                      <p className="game-label">{game.label}</p>
                      {game.detail ? <p className="game-detail">{game.detail}</p> : null}
                      <select
                        className="select-input"
                        onChange={(event) => updateGame(game.id, 'teamA', event.target.value)}
                        value={game.teamA}
                      >
                        <option value="">Team 1</option>
                        {teams.map((team) => (
                          <option disabled={team.id === game.teamB} key={team.id} value={team.id}>
                            {formatTeamOption(team)}
                          </option>
                        ))}
                      </select>
                      <select
                        className="select-input"
                        onChange={(event) => updateGame(game.id, 'teamB', event.target.value)}
                        value={game.teamB}
                      >
                        <option value="">Team 2</option>
                        {teams.map((team) => (
                          <option disabled={team.id === game.teamA} key={team.id} value={team.id}>
                            {formatTeamOption(team)}
                          </option>
                        ))}
                      </select>
                      <select
                        className="select-input"
                        onChange={(event) => updateGame(game.id, 'winner', event.target.value)}
                        value={game.winner}
                      >
                        <option value="">Winner</option>
                        {game.teamA ? <option value={game.teamA}>{formatTeamName(game.teamA)}</option> : null}
                        {game.teamB ? <option value={game.teamB}>{formatTeamName(game.teamB)}</option> : null}
                      </select>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default App;
