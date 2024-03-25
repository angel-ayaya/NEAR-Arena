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
  participants: PersistentVector<Participant>;

  constructor(id: string, name: string, prizePool: u128, imageUrl: string) {
    this.id = id;
    this.creator = context.sender;
    this.name = name;
    this.prizePool = prizePool;
    this.imageUrl = imageUrl;
    this.participants = new PersistentVector<Participant>(id + "_p");
  }

  // Función para agregar un participante al torneo.
  addParticipant(accountId: string): void {
    const newParticipant = new Participant(accountId);
    this.participants.push(newParticipant);
  }
}

// Mapa para almacenar y recuperar los torneos creados.
export const tournaments = new PersistentUnorderedMap<string, Tournament>("TOURNAMENTS");