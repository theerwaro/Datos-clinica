
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PatientForm } from './components/PatientForm';
import { PatientTable } from './components/PatientTable';
import { Patient, FormMode } from './types';
import { patientService } from './services/patientService';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(FormMode.CREATE);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    const data = await patientService.getPatients();
    setPatients(data);
    setIsLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (nombres: string, correo: string) => {
    try {
      if (formMode === FormMode.CREATE) {
        await patientService.addPatient(nombres, correo);
        showToast('Paciente guardado en SQLite');
      } else if (selectedPatient) {
        await patientService.updatePatient(selectedPatient.id, nombres, correo);
        showToast('Registro SQL actualizado', 'info');
      }
      resetForm();
      await loadPatients();
    } catch (e) {
      showToast('Error en la base de datos', 'error');
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormMode(FormMode.EDIT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar registro de la base de datos SQLite?')) {
      await patientService.deletePatient(id);
      await loadPatients();
      showToast('Registro eliminado', 'error');
      if (selectedPatient?.id === id) resetForm();
    }
  };

  const handleExport = () => {
    patientService.exportDB();
    showToast('Archivo .sqlite generado', 'info');
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setFormMode(FormMode.CREATE);
  };

  return (
    <Layout>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-2xl animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-600' : 
          toast.type === 'error' ? 'bg-rose-600' : 'bg-sky-600'
        } text-white`}>
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">SQLite Engine Online</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Gestión Hospitalaria</h2>
            <p className="text-gray-500 max-w-md">Sistema de persistencia relacional con motor SQLite local.</p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition-all flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar .sqlite
            </button>
            <button 
              onClick={loadPatients}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:shadow-md transition-all"
              title="Refrescar desde DB"
            >
              <svg className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </section>

        <PatientForm 
          selectedPatient={selectedPatient}
          onSave={handleSave}
          onCancel={resetForm}
          mode={formMode}
        />

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Consultando SQLite...</p>
          </div>
        ) : (
          <PatientTable 
            patients={patients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
