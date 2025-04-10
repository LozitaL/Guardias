export interface Horario {
    [dia: string]: {
      [hora: string]: string | { asignatura?: string; curso?: string; clase?: string }[];
    };
  }