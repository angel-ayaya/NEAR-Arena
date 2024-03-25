//from models/models.ts import classes
import { Participant, Tournament, tournaments } from "./models/models";
import { u128, context } from "near-sdk-as";

// Función para crear un nuevo torneo.
export function createTournament(
  id: string,
  name: string,
  prizePool: u128,
  imageUrl: string
): void {
  assert(!tournaments.contains(id), "Un torneo con este ID ya existe.");

  // Asegurar que el depósito adjunto coincida con el prizePool especificado.
  assert(
    context.attachedDeposit == prizePool,
    "El depósito adjunto debe coincidir con el prizePool especificado."
  );

  // Crear el nuevo torneo incluyendo el accountId del creador.
  const newTournament = new Tournament(id, name, prizePool, imageUrl);

  // Guardar el torneo en el estado del contrato.
  tournaments.set(id, newTournament);
}

export function getTournament(id: string): Tournament | null {
  return tournaments.get(id);
}

export function getTournaments(): Tournament[]{
    return tournaments.values();
}

// near call contractor1.testenoid.testnet createTournament '{"id": "2", "name": "Torneo de prueba", "prizePool": "1000000000000000000000000", "imageUrl": "https://example.com/image.jpg"}' --depositYocto=1000000000000000000000000 --accountId testenoid.testnet
// near call contractor1.testenoid.testnet getTournament '{"id": "2"}' --accountId testenoid.testnet
