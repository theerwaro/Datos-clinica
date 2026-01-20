
import { Patient } from '../types';
import { Conexion } from './database';

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    try {
      const rows = await Conexion.consultarRegistros("SELECT * FROM Pacientes ORDER BY id DESC");
      return rows as Patient[];
    } catch (e) {
      console.error("Error al cargar pacientes:", e);
      return [];
    }
  },

  addPatient: async (nombres: string, correo: string): Promise<void> => {
    await Conexion.ejecutarSentencia(
      "INSERT INTO Pacientes (nombres, correo) VALUES (?, ?)",
      [nombres, correo]
    );
  },

  updatePatient: async (id: number, nombres: string, correo: string): Promise<void> => {
    await Conexion.ejecutarSentencia(
      "UPDATE Pacientes SET nombres = ?, correo = ? WHERE id = ?",
      [nombres, correo, id]
    );
  },

  deletePatient: async (id: number): Promise<void> => {
    await Conexion.ejecutarSentencia("DELETE FROM Pacientes WHERE id = ?", [id]);
  },

  exportDB: () => {
    Conexion.exportFile();
  }
};
