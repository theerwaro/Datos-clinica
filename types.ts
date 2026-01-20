
export interface Patient {
  id: number;
  nombres: string;
  correo: string;
}

export enum FormMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}
