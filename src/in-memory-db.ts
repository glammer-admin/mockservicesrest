// src/db.ts

import { Database } from "bun:sqlite";

// Inicializar la base de datos en memoria
const db = new Database(":memory:");

// Crear la tabla de usuarios
db.run(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`);

// Función para obtener todos los usuarios
export function getUsers() {
  const stmt = db.prepare("SELECT * FROM users");
  return stmt.all();
}

// Función para obtener un usuario por nombre y correo electrónico
export function getUserByNameOrEmail(name: string, email: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE name = ? OR email = ?");
    return stmt.get(name, email);
  }

// Función para crear un nuevo usuario
export function createUser(name: string, email: string) {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run(name, email);
}

// Función para actualizar un usuario existente
export function updateUser(id: number, name: string, email: string) {
  const stmt = db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
  stmt.run(name, email, id);
}

// Función para eliminar un usuario
export function deleteUser(id: number) {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  stmt.run(id);
}
