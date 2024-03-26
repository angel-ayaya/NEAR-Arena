import {
  PersistentVector,
  PersistentUnorderedMap,
  u128,
  context,
} from "near-sdk-as";

// Estructura para manejar los participantes de los torneos.
@nearBindgen
export class Participant {
  accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }
}

//Matches class
@nearBindgen
export class Match {
  id: string;
  participant1: string;
  participant2: string;
  winner: string; // Puedes dejar esto vacío inicialmente y actualizarlo cuando el partido termine

  constructor(id: string, participant1: string, participant2: string) {
    this.id = id;
    this.participant1 = participant1;
    this.participant2 = participant2;
    this.winner = "";
  }

  // Set the winner of the match.
  setWinner(winnerAccountId: string): void {
    this.winner = winnerAccountId;
  }
}

@nearBindgen
export class Tournament {
  id: string;
  creator: string;
  name: string;
  prizePool: u128;
  imageUrl: string;
  minParticipants: u32;
  maxParticipants: u32;
  totalParticipants: u32;
  participants: PersistentVector<Participant>;
  totalMatches: u32;
  matches: PersistentVector<Match>; // 
  isActive: bool;
  isStarted: bool;

  constructor(
    id: string,
    name: string,
    prizePool: u128,
    imageUrl: string,
    totalParticipants: u32
  ) {
    this.id = id;
    this.creator = context.sender;
    this.name = name;
    this.prizePool = prizePool;
    this.imageUrl = imageUrl;
    this.minParticipants = 2;
    this.maxParticipants = 16;
    this.participants = new PersistentVector<Participant>(id + "_p");
    this.totalParticipants = totalParticipants;
    this.totalMatches = this.calcTotalMatches(totalParticipants);
    this.isActive = true;
    this.isStarted = false;
    this.matches = new PersistentVector<Match>(id + "_m"); // Inicializar el vector de partidos
  }

  // Add a participant to the tournament.
  addParticipant(accountId: string): void {
    const newParticipant = new Participant(accountId);
    this.participants.push(newParticipant);
  }

  // Calc total matches based on the number of participants.
  private calcTotalMatches(participants: u32): u32 {
    return participants - 1;
  }

  // Método para establecer el ganador de un partido
  setMatchWinner(matchId: string, winnerAccountId: string): void {
    let matchIndex = -1;
    for (let i = 0; i < this.matches.length; i++) {
      if (this.matches[i].id == matchId) {
        matchIndex = i;
        break;
      }
    }
    if (matchIndex != -1) {
      let match = this.matches[matchIndex];
      match.setWinner(winnerAccountId);
      this.matches[matchIndex] = match; // Actualizar el partido con el ganador
    } else {
      throw new Error("Match not found");
    }
  }
}

// Mapa para almacenar y recuperar los torneos creados.
export const tournaments = new PersistentUnorderedMap<string, Tournament>(
  "TOURNAMENTS"
);
