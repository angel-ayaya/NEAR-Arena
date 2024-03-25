import { PersistentVector, PersistentUnorderedMap, u128, context } from "near-sdk-as";

// Estructura para manejar los participantes de los torneos.
@nearBindgen
export class Participant {
  accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
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
  isActive: bool;

  constructor(id: string, name: string, prizePool: u128, imageUrl: string, totalParticipants: u32) {
    this.id = id;
    this.creator = context.sender;
    this.name = name;
    this.prizePool = prizePool;
    this.imageUrl = imageUrl;
    this.minParticipants = 2;
    this.maxParticipants = 16;
    this.participants = new PersistentVector<Participant>(id + "_p");
    this.totalMatches = this.calcTotalMatches(totalParticipants);
    this.isActive = true;
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
  
}

// Mapa para almacenar y recuperar los torneos creados.
export const tournaments = new PersistentUnorderedMap<string, Tournament>("TOURNAMENTS");