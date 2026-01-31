
export type Position = 'Goleiro' | 'Zagueiro' | 'Meio' | 'Atacante';

export interface UserProfile {
  uid: string;
  name: string;
  position: Position;
  photoURL?: string;
  email?: string;
}

export interface Athlete {
  id: string;
  uid?: string; // Links to the user profile
  name: string;
  position: Position;
  status: 'active' | 'inactive';
  photoUrl?: string;
  goals?: number;
  assists?: number;
  gamesPlayed?: number;
}

export interface Team {
  id: string;
  name: string;
  players: Athlete[];
}

export enum DashboardTab {
  Overview = 'overview',
  Athletes = 'athletes',
  MatchGenerator = 'generator',
  Settings = 'settings',
  Profile = 'profile'
}
