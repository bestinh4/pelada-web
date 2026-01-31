
import { Athlete, Team, Position } from '../types';

export const balanceTeams = (players: Athlete[], numberOfTeams: number = 2): Team[] => {
  // 1. Inicializar times
  const teams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Time ${i + 1}`,
    players: []
  }));

  // 2. Agrupar jogadores por posição
  const positions: Position[] = ['Goleiro', 'Zagueiro', 'Meio', 'Atacante'];
  
  // Criar um mapeamento de jogadores por posição
  const playersByPosition: Record<Position, Athlete[]> = {
    'Goleiro': players.filter(p => p.position === 'Goleiro'),
    'Zagueiro': players.filter(p => p.position === 'Zagueiro'),
    'Meio': players.filter(p => p.position === 'Meio'),
    'Atacante': players.filter(p => p.position === 'Atacante')
  };

  // 3. Distribuir jogadores de cada posição entre os times
  // Para cada posição, embaralhamos os jogadores e os distribuímos rotativamente
  positions.forEach((pos) => {
    const group = [...playersByPosition[pos]].sort(() => Math.random() - 0.5);
    
    group.forEach((player, index) => {
      // Encontra o time com menos jogadores no momento para balancear quantidade total
      // Ou simplesmente usa o index % numberOfTeams para balancear posições especificamente
      const targetTeamIndex = index % numberOfTeams;
      teams[targetTeamIndex].players.push(player);
    });
  });

  return teams;
};
