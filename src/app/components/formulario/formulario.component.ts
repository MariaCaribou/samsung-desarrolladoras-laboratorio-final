import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Socio } from 'src/app/components/formulario/socio';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit 
{
    formulario : FormGroup;
    socios : Socio[] = [];
	socioModificado : Socio | null = null;
	duracionSnackbar : number = 5000;

    constructor(private snackBar : MatSnackBar) 
    { 
		// Creación del formulario con FormControls y Validators
        this.formulario = new FormGroup({
            nombre : new FormControl("", [Validators.required, Validators.minLength(3)]),
            apellidos : new FormControl("", [Validators.required, Validators.minLength(3)]),
            numeroDeSocio : new FormControl("", Validators.required),
            dni : new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
            telefono : new FormControl("", Validators.required),
            sexo : new FormControl("", Validators.required)
            });
  }

    ngOnInit(): void 
    {
    }

    enviar() : void
    {
		// Si el formulario no es válido o se está modificando un socio, salimos de la función
		if (!this.formulario.valid || this.socioModificado != null)
		{
			this.snackBar.open("Error. Uno o más campos del formulario no se han rellenado correctamente", "Aceptar", { duration : this.duracionSnackbar });
			return;
		}

		//Antes de crear nuevos socios comprobamos que el número de socio sea único
		if (!this.comprobarSocioUnico(this.formulario.value.numeroDeSocio))
		{	
			this.snackBar.open("Error. El número de cliente introducido ya existe", "Aceptar", { duration : this.duracionSnackbar });
			return;
		}
		
    	// Creamos una nueva persona y rellenamos su información
        let socio = new Socio();

        socio.nombre = this.formulario.value.nombre;
        socio.apellidos = this.formulario.value.apellidos;
        socio.numeroDeSocio = this.formulario.value.numeroDeSocio;
        socio.dni = this.formulario.value.dni;
        socio.telefono = this.formulario.value.telefono;
        socio.sexo = this.formulario.value.sexo;

        // Añadimos la persona al array y limpiamos el formulario
        this.socios.push(socio);
        this.formulario.reset(); 

		this.snackBar.open("Formulario enviado", "Aceptar", { duration : this.duracionSnackbar });
    }

    // Función para comprobar que todos los números de socio sean únicos y no haya ninguno repetido
    comprobarSocioUnico(numeroDeSocio : number) : boolean
    {
      let result : boolean = true;

      for (let s of this.socios)
      {
        if (numeroDeSocio == s.numeroDeSocio)
        {
          result = false;
          break;
        }
      }
      return result;
    }

	//Función eliminar socio de la lista de socios
	eliminar(event : MouseEvent, socio : Socio) : void
	{
		for (let i = this.socios.length - 1; i >= 0; -- i)
		{
			if (this.socios[i] == socio)
			{
				this.socios.splice(i, 1);
				break;
			}
		}
		// Si se estaba modificando el socio que queremos eliminar, limpiamos el
		// formulario y asignamos el valor null a socioModificado
		if (this.socioModificado != null && this.socioModificado == socio)
		{
			this.formulario.reset();
			this.socioModificado = null;
		}

		this.snackBar.open("El socio " + socio.nombre + " " + socio.apellidos + " ha sido eliminado", "Aceptar", { duration : this.duracionSnackbar });
	}

	//Función modificar socio de la lista de socios
	modificar(event : MouseEvent, socio : Socio) : void
	{
		// Para modificar un socio, nos guardamos una copia del mismo en socioModificado
		// y volcamos sus datos en el formulario. En el archivo HTML comprobaremos
		// si cada uno de los socios a mostrar en la lista corresponde con
		// socioModificado. Si es el caso, mostraremos directamente los valores que
		// se están escribiendo en tiempo real en el formulario
		this.formulario.controls["nombre"].setValue(socio.nombre);
		this.formulario.controls["apellidos"].setValue(socio.apellidos);
		this.formulario.controls["numeroDeSocio"].setValue(socio.numeroDeSocio);
		this.formulario.controls["dni"].setValue(socio.dni);
		this.formulario.controls["telefono"].setValue(socio.telefono);
		this.formulario.controls["sexo"].setValue(socio.sexo);

		this.socioModificado = socio;
	}

	// Para terminar de modificar a un socio, lo buscamos
	// en el array de socios y aplicamos los nuevos datos
	// que estén introducidos en el formulario. Después, limpiamos
	// el formulario y asignamos el valor null a socioModificado
	terminarModificacion(event : MouseEvent, socio : Socio) : void
	{
		for (let s of this.socios)
		{
			if (s == socio)
			{
				s.nombre = this.formulario.value.nombre;
				s.apellidos = this.formulario.value.apellidos;
				s.numeroDeSocio = this.formulario.value.numeroDeSocio;
				s.dni = this.formulario.value.dni;
				s.telefono = this.formulario.value.telefono;
				s.sexo = this.formulario.value.sexo;

				this.formulario.reset();
				this.socioModificado = null;

				this.snackBar.open("El socio " + socio.nombre + " " + socio.apellidos + " ha sido modificado", "Aceptar", { duration : this.duracionSnackbar });

				break;
			}
		}
	}
}