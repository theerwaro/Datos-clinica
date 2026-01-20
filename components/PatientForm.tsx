
import React, { useState, useEffect } from 'react';
import { Patient, FormMode } from '../types';

interface PatientFormProps {
  selectedPatient: Patient | null;
  onSave: (nombres: string, correo: string) => void;
  onCancel: () => void;
  mode: FormMode;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  selectedPatient, 
  onSave, 
  onCancel,
  mode 
}) => {
  const [nombres, setNombres] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    if (selectedPatient) {
      setNombres(selectedPatient.nombres);
      setCorreo(selectedPatient.correo);
    } else {
      setNombres('');
      setCorreo('');
    }
  }, [selectedPatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombres.trim() && correo.trim()) {
      onSave(nombres, correo);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 transition-all">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <span className={`w-3 h-3 rounded-full mr-2 ${mode === FormMode.EDIT ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
        {mode === FormMode.EDIT ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">ID (Auto-generado)</label>
          <input 
            type="text" 
            disabled 
            value={selectedPatient?.id || 'Nuevo'} 
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">Nombres Completos</label>
          <input 
            type="text" 
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
          <input 
            type="email" 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        
        <div className="md:col-span-3 flex justify-end space-x-3 mt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`px-8 py-2.5 text-white font-medium rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              mode === FormMode.EDIT ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {mode === FormMode.EDIT ? 'Actualizar Registro' : 'Agregar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
};
