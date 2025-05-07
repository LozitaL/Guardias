import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, format, set } from 'date-fns';
import {es} from 'date-fns/locale';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ausencias',
  imports: [ReactiveFormsModule],
  templateUrl: './ausencias.component.html',
  styleUrl: './ausencias.component.css'
})
export class AusenciasComponent {

  constructor(private authService: AuthService, private http: HttpClient) {} 
  userHorario: any | null = null;
  id_profesor: any | null = null;
  private destroy$ = new Subject<void>();
  tipo = 0;
  fechasSemana: Date[] = [];
  diaSeleccionado: Date | null = null;
  modalAbierto = false;
  modalAbierto2 = false
  mesActual = new Date().getMonth();
  añoActual = new Date().getFullYear();
  meses = Array.from({ length: 12 }, (_, i) => i);
  datselect: any | null = null;
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas: string[] = [
    '8:30-9:25',
    '9:25-10:20',
    '10:40-11:35',
    '11:35-12:30',
    '12:40-13:35',
    '13:35-14:30',
  ];
  selectedFile: File | null = null;
  ausencias = {nombre: "",faltas: [{}]}
  form = new FormGroup({
    check: new FormControl(false)  
  });

  ngOnInit() {
    this.generarFechasSemana();
    if (!this.diaSeleccionado) {
      this.diaSeleccionado = new Date();

      this.authService.getCurrentDataUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userD: User | null) => {
        if (userD) {
          this.id_profesor = userD.id;
          this.userHorario = userD.horario;
          this.ausencias.nombre = userD.nombre + " " + userD.apellidos;
        }
      });
    }
  }

  cambiar(tipo: number) {
    this.tipo = Number(tipo);
  }

  semanasDelMes(mes: number): (Date | null)[][] {
    const inicio = startOfMonth(new Date(this.añoActual, mes, 1));
    const fin = endOfMonth(inicio);
    const dias = eachDayOfInterval({ start: inicio, end: fin });


    const semanas: (Date | null)[][] = [];
    let semana: (Date | null)[] = [];
    let primerDiaSemana = inicio.getDay();
    if (primerDiaSemana === 0) {
        primerDiaSemana = 7;
    }

    semana = Array(primerDiaSemana - 1).fill(null);

    for (const dia of dias) {
        semana.push(dia);
        if (semana.length === 7) {
            semanas.push(semana);
            semana = [];
        }
    }

    if (semana.length > 0) {
        while (semana.length < 7) {
            semana.push(null);
        }
        semanas.push(semana);
    }


    return semanas;
}
  generarFechasSemana() {
    const hoy = new Date();
    const lunes = startOfWeek(hoy, { weekStartsOn: 1 });
    this.fechasSemana = [];
    for (let i = 0; i < 5; i++) {
      this.fechasSemana.push(addDays(lunes, i));
    }
  }
  
  diasDelMes(mes: number): Date[] {
    const inicio = startOfMonth(new Date(this.añoActual, mes));
    const fin = endOfMonth(inicio);
    return eachDayOfInterval({ start: inicio, end: fin });
  }

  nombreMes(mes: number): string {
    return format(new Date(this.añoActual, mes, 1), 'MMMM', { locale: es });
  }

  formatoDia(fecha: Date | null): string {
    if(fecha == null){
      fecha = new Date();
    }
    return format(fecha, 'EEEE', { locale: es });
  }
  formatoDiaMA(fecha: Date | null): any {
    if(fecha == null){
      fecha = new Date();
    }
    return [
      format(fecha, 'EEEE', { locale: es }),    
      format(fecha, 'dd'),                       
      format(fecha, 'MM'),                       
      format(fecha, 'yyyy')                     
    ]
  }
  
  onClickCelda(dia: Date | null, hora: string) {
    if(dia == null ){
      dia = new Date();
    }
  }

  abrirModal(dia: Date | null) {
    if(dia == null){
      this.diaSeleccionado= new Date();
    }
    this.diaSeleccionado = dia;
    this.modalAbierto = true;
  }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.diaSeleccionado = new Date();
  }
  onMarcarCelda(dia: string, marca: boolean | null, fecha: Date){
    this.getDatos(dia);

    /*{"Lunes":
	  [{"clase":"Matemáticas","curso":"2","asignatura":"algo","hora":"8:30-9:25"},*/
    
  }
  
  
  setDatosSel(dato: any, fechas: [0,1,2,3]) {
   /* {"ausencias":{"nombre":"","faltas":[{"curso":"","clase":"" fecha}]}*/
          this.ausencias.faltas.push({
            curso: dato.curso,
            clase: dato.clase,
            hora: dato.hora, 
            fecha: {
              dian: fechas[0],
              dia: fechas[1],
              mes: fechas[2],
              año: fechas[3]
            }
          })
          console.log(this.ausencias);
  }
  prepararModal2(){
    this.modalAbierto2 = true;
  }
  cerrarmodal2(){
    this.form.get('check')?.reset();
    this.modalAbierto2 = false;
  }
  enviarDatosSel(){
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as ArrayBuffer;
        this.uploadFile(fileData);
      };
      reader.readAsArrayBuffer(this.selectedFile);
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      return; 
    }
    const ausenciasJSON = JSON.stringify(this.ausencias);
    this.authService.insertGuardias(this.id_profesor,JSON.parse(ausenciasJSON),this.selectedFile)
    this.ausencias.faltas = [];
    this.cerrarmodal2();
  }
  uploadFile(fileData: ArrayBuffer): void {
    const formData = new FormData();
    formData.append('file', new Blob([fileData]), this.selectedFile?.name || 'archivo.pdf');
  
    this.http.post('URL_DEL_BACKEND', formData).subscribe({
      next: (response) => console.log('Archivo subido con éxito', response),
      error: (error) => console.error('Error al subir el archivo', error),
    });
  }
  
  setCelda(dia: string, n: number){
    let diahorario = this.getDatos(dia.toLocaleLowerCase());
    return diahorario[n];
  }
  getDatos(dia: string): any[] {
        const datos = this.userHorario[dia];
    for (let index = 0; index < 5; index++) {
      if(typeof datos[index] !== 'object' || datos[index] === null ){
       datos[index] = {"hora":"","clase":"","curso":"","asignatura":""};
      }
    }
    if (!datos || datos === "") {
      return [];
    }
    return datos;
  }



onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
}