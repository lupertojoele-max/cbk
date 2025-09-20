import { Season, ChampionshipStanding, RaceResult, SeasonResults, ApiResponse } from '../types'

export const mockSeasons: Season[] = [
  {
    id: 1,
    year: 2024,
    name: 'CBK Racing Championship 2024',
    status: 'active',
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-11-30T23:59:59Z',
    total_rounds: 12,
    completed_rounds: 8
  },
  {
    id: 2,
    year: 2023,
    name: 'CBK Racing Championship 2023',
    status: 'completed',
    start_date: '2023-01-20T00:00:00Z',
    end_date: '2023-11-25T23:59:59Z',
    total_rounds: 12,
    completed_rounds: 12
  },
  {
    id: 3,
    year: 2022,
    name: 'CBK Racing Championship 2022',
    status: 'completed',
    start_date: '2022-02-05T00:00:00Z',
    end_date: '2022-11-20T23:59:59Z',
    total_rounds: 10,
    completed_rounds: 10
  }
]

export const mockStandings2024: ChampionshipStanding[] = [
  {
    id: 1,
    position: 1,
    driver: {
      id: 5,
      full_name: 'Matteo Ricci',
      racing_number: 44,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 186,
    wins: 4,
    podiums: 7,
    best_finish: 1,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 0,
    points_ahead_next: 15
  },
  {
    id: 2,
    position: 2,
    driver: {
      id: 1,
      full_name: 'Marco Rossini',
      racing_number: 7,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 171,
    wins: 3,
    podiums: 6,
    best_finish: 1,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 15,
    points_ahead_next: 23
  },
  {
    id: 3,
    position: 3,
    driver: {
      id: 2,
      full_name: 'Sofia Ferrari',
      racing_number: 12,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 148,
    wins: 1,
    podiums: 5,
    best_finish: 1,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 38,
    points_ahead_next: 12
  },
  {
    id: 4,
    position: 4,
    driver: {
      id: 4,
      full_name: 'Giulia Conti',
      racing_number: 21,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 136,
    wins: 0,
    podiums: 4,
    best_finish: 2,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 50,
    points_ahead_next: 28
  },
  {
    id: 5,
    position: 5,
    driver: {
      id: 6,
      full_name: 'Elena Santoro',
      racing_number: 88,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 108,
    wins: 0,
    podiums: 3,
    best_finish: 2,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 78,
    points_ahead_next: 35
  },
  {
    id: 6,
    position: 6,
    driver: {
      id: 3,
      full_name: 'Alessandro Bianchi',
      racing_number: 3,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 73,
    wins: 0,
    podiums: 1,
    best_finish: 3,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 113,
    points_ahead_next: 25
  },
  {
    id: 7,
    position: 7,
    driver: {
      id: 7,
      full_name: 'Lorenzo Baldi',
      racing_number: 33,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 48,
    wins: 0,
    podiums: 0,
    best_finish: 4,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 138,
    points_ahead_next: 20
  },
  {
    id: 8,
    position: 8,
    driver: {
      id: 8,
      full_name: 'Francesca Rossi',
      racing_number: 25,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 28,
    wins: 0,
    podiums: 0,
    best_finish: 5,
    races_completed: 8,
    total_races: 8,
    points_behind_leader: 158,
    points_ahead_next: 15
  },
  {
    id: 9,
    position: 9,
    driver: {
      id: 9,
      full_name: 'Giuseppe Verdi',
      racing_number: 17,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 13,
    wins: 0,
    podiums: 0,
    best_finish: 6,
    races_completed: 7,
    total_races: 8,
    points_behind_leader: 173,
    points_ahead_next: 8
  },
  {
    id: 10,
    position: 10,
    driver: {
      id: 10,
      full_name: 'Chiara Mancini',
      racing_number: 91,
      nationality: 'Italian'
    },
    season_id: 1,
    total_points: 5,
    wins: 0,
    podiums: 0,
    best_finish: 7,
    races_completed: 6,
    total_races: 8,
    points_behind_leader: 181,
    points_ahead_next: 0
  }
]

export const mockStandings2023: ChampionshipStanding[] = [
  {
    id: 11,
    position: 1,
    driver: {
      id: 1,
      full_name: 'Marco Rossini',
      racing_number: 7,
      nationality: 'Italian'
    },
    season_id: 2,
    total_points: 298,
    wins: 6,
    podiums: 10,
    best_finish: 1,
    races_completed: 12,
    total_races: 12,
    points_behind_leader: 0,
    points_ahead_next: 32
  },
  {
    id: 12,
    position: 2,
    driver: {
      id: 2,
      full_name: 'Sofia Ferrari',
      racing_number: 12,
      nationality: 'Italian'
    },
    season_id: 2,
    total_points: 266,
    wins: 4,
    podiums: 9,
    best_finish: 1,
    races_completed: 12,
    total_races: 12,
    points_behind_leader: 32,
    points_ahead_next: 18
  },
  {
    id: 13,
    position: 3,
    driver: {
      id: 5,
      full_name: 'Matteo Ricci',
      racing_number: 44,
      nationality: 'Italian'
    },
    season_id: 2,
    total_points: 248,
    wins: 2,
    podiums: 8,
    best_finish: 1,
    races_completed: 12,
    total_races: 12,
    points_behind_leader: 50,
    points_ahead_next: 35
  }
]

export const mockRecentRaces2024: RaceResult[] = [
  {
    id: 1,
    event_id: 1,
    event_name: 'Italian Championship Round 8',
    event_date: '2024-01-28T14:00:00Z',
    driver: {
      id: 5,
      full_name: 'Matteo Ricci',
      racing_number: 44,
      nationality: 'Italian'
    },
    position: 1,
    points_earned: 25,
    fastest_lap: true,
    pole_position: false,
    lap_time_best: '42.156',
    lap_time_average: '42.890',
    status: 'finished',
    gap_to_winner: '0.000',
    laps_completed: 20,
    total_laps: 20
  },
  {
    id: 2,
    event_id: 1,
    event_name: 'Italian Championship Round 8',
    event_date: '2024-01-28T14:00:00Z',
    driver: {
      id: 1,
      full_name: 'Marco Rossini',
      racing_number: 7,
      nationality: 'Italian'
    },
    position: 2,
    points_earned: 18,
    fastest_lap: false,
    pole_position: true,
    lap_time_best: '42.298',
    lap_time_average: '43.120',
    status: 'finished',
    gap_to_winner: '+1.245',
    laps_completed: 20,
    total_laps: 20
  },
  {
    id: 3,
    event_id: 1,
    event_name: 'Italian Championship Round 8',
    event_date: '2024-01-28T14:00:00Z',
    driver: {
      id: 2,
      full_name: 'Sofia Ferrari',
      racing_number: 12,
      nationality: 'Italian'
    },
    position: 3,
    points_earned: 15,
    fastest_lap: false,
    pole_position: false,
    lap_time_best: '42.445',
    lap_time_average: '43.250',
    status: 'finished',
    gap_to_winner: '+2.876',
    laps_completed: 20,
    total_laps: 20
  },
  {
    id: 4,
    event_id: 1,
    event_name: 'Italian Championship Round 8',
    event_date: '2024-01-28T14:00:00Z',
    driver: {
      id: 4,
      full_name: 'Giulia Conti',
      racing_number: 21,
      nationality: 'Italian'
    },
    position: 4,
    points_earned: 12,
    fastest_lap: false,
    pole_position: false,
    lap_time_best: '42.567',
    lap_time_average: '43.456',
    status: 'finished',
    gap_to_winner: '+4.123',
    laps_completed: 20,
    total_laps: 20
  },
  {
    id: 5,
    event_id: 1,
    event_name: 'Italian Championship Round 8',
    event_date: '2024-01-28T14:00:00Z',
    driver: {
      id: 6,
      full_name: 'Elena Santoro',
      racing_number: 88,
      nationality: 'Italian'
    },
    position: 5,
    points_earned: 10,
    fastest_lap: false,
    pole_position: false,
    lap_time_best: '42.789',
    lap_time_average: '43.678',
    status: 'finished',
    gap_to_winner: '+6.789',
    laps_completed: 20,
    total_laps: 20
  }
]

export const mockSeasonResults2024: SeasonResults = {
  season: mockSeasons[0],
  standings: mockStandings2024,
  recent_races: mockRecentRaces2024,
  statistics: {
    total_drivers: 10,
    different_winners: 4,
    closest_championship_gap: 15,
    most_wins_driver: 'Matteo Ricci',
    most_poles_driver: 'Marco Rossini',
    fastest_lap_record: {
      driver: 'Matteo Ricci',
      time: '42.156',
      event: 'Italian Championship Round 8'
    }
  }
}

export const mockSeasonResults2023: SeasonResults = {
  season: mockSeasons[1],
  standings: mockStandings2023,
  recent_races: [],
  statistics: {
    total_drivers: 12,
    different_winners: 5,
    closest_championship_gap: 32,
    most_wins_driver: 'Marco Rossini',
    most_poles_driver: 'Marco Rossini',
    fastest_lap_record: {
      driver: 'Sofia Ferrari',
      time: '41.987',
      event: 'Italian Championship Round 12'
    }
  }
}

export const mockAllSeasonResults = [mockSeasonResults2024, mockSeasonResults2023]

export const mockSeasonsResponse: ApiResponse<Season[]> = {
  data: mockSeasons,
  meta: {
    total: mockSeasons.length,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: mockSeasons.length
  }
}

export const mockSeasonResultsResponse: ApiResponse<SeasonResults> = {
  data: mockSeasonResults2024
}