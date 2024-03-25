//from models/models.ts import classes
import { Participant, Tournament, tournaments } from "./models/models";
import { u128, context, PersistentVector } from "near-sdk-as";

// Función para crear un nuevo torneo.
export function createTournament(
  id: string,
  name: string,
  prizePool: u128,
  imageUrl: string,
  totalParticipants: u32
): void {
  assert(!tournaments.contains(id), "Un torneo con este ID ya existe.");

  // Asegurar que el depósito adjunto coincida con el prizePool especificado.
  assert(
    context.attachedDeposit == prizePool,
    "El depósito adjunto debe coincidir con el prizePool especificado."
  );

  // Crear el nuevo torneo incluyendo el accountId del creador.
  const newTournament = new Tournament(
    id,
    name,
    prizePool,
    imageUrl,
    totalParticipants
  );

  // Guardar el torneo en el estado del contrato.
  tournaments.set(id, newTournament);
}

export function getTournament(id: string): Tournament | null {
  return tournaments.get(id);
}

export function getTournaments(): Tournament[] {
  return tournaments.values();
}

// User joins a tournament that is active and not full yet.
export function joinTournament(tournamentId: string): void {
  // Validate that the tournament exists.
  assert(tournaments.contains(tournamentId), "El torneo no existe.");

  const tournament = tournaments.getSome(tournamentId);

  // Validate that the tournament is active.
  assert(tournament.isActive, "El torneo no está activo.");
  // Validate that the tournament is not full.
  assert(
    tournament.participants.length < tournament.totalParticipants,
    "El torneo está lleno."
  );
  // Validate that the user is not already a participant.
  assert(
    !isParticipantRegistered(tournament.participants, context.sender),
    "Ya estás registrado en este torneo."
  );

  // Add the user as a participant.
  tournament.participants.push(new Participant(context.sender));

  // Save the updated tournament.
  tournaments.set(tournamentId, tournament);
}

// Función de ayuda para verificar si un accountId ya está registrado como participante.
function isParticipantRegistered(
  participants: PersistentVector<Participant>,
  accountId: string
): bool {
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].accountId == accountId) {
      return true;
    }
  }
  return false;
}

// near call contractor1.testenoid.testnet createTournament '{"id": "2", "name": "Torneo de prueba", "prizePool": "1000000000000000000000000", "imageUrl": "https://example.com/image.jpg"}' --depositYocto=1000000000000000000000000 --accountId testenoid.testnet
// near call contractor1.testenoid.testnet getTournament '{"id": "2"}' --accountId testenoid.testnet
