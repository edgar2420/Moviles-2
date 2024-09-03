import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from 'src/app/service/detail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  product: number | undefined;
  detallesProducto: any;

  constructor(
    private route: ActivatedRoute,
    private detailService: DetailService
  ) {}

  ngOnInit() {
    console.log('DetailPage OnInit');
    this.route.params.subscribe(params => {
      const productIdFromRoute = params['id'];
      console.log('Product ID from route:', productIdFromRoute);
  
      if (productIdFromRoute && !isNaN(productIdFromRoute)) {
        this.product = +productIdFromRoute;
  
        this.detailService.getProductDetailsInfo(this.product).subscribe(
          (detalles) => {
            this.detallesProducto = detalles;
          },
          (error) => {
            console.error('Error al obtener los detalles del producto', error);
          }
        );
      } else {
        console.error('ID del producto no válido:', productIdFromRoute);
      }
    });
  }

  irAInicio() {
    // Lógica para navegar a la página de inicio
    console.log('Ir a la página de inicio');
    // Puedes usar el enrutador de Angular para la navegación.
  }

  irAPerfil() {
    // Lógica para navegar a la página de perfil
    console.log('Ir a la página de perfil');
    // Puedes usar el enrutador de Angular para la navegación.
  }

  buscar(event: any) {
    // Lógica para manejar la búsqueda
    const textoBusqueda = event.target.value;
    console.log('Buscar:', textoBusqueda);
    // Puedes realizar operaciones de búsqueda aquí y actualizar la vista según sea necesario.
  }
}
