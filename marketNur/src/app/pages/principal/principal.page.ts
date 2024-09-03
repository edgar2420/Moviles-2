import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PrincipalService } from 'src/app/service/principal.service';
import { Product } from 'src/app/models/product';
import { IonSearchbar } from '@ionic/angular';
import { CategoryService } from 'src/app/service/categoria.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  originalProducts: Product[] = [];
  categories: string[] = [];
  showCategoriesFlag: boolean = false;
  filteredList: Product[] = [];
  listProducto: Product[] = [];
  navCtrl: any;

  // Agrega una referencia al ion-searchbar
  @ViewChild('searchbar') searchbar: IonSearchbar | undefined;

  constructor(private router: Router, private principalService: PrincipalService,private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  showCategories() {
    this.showCategoriesFlag = !this.showCategoriesFlag;

    if (this.showCategoriesFlag) {
      this.categoryService.getCategories().subscribe(
        (data: string[]) => {
          this.categories = data;
          console.log('Categorías:', this.categories);
        },
        (err) => {
          console.error('Error al buscar categorías', err);
        }
      );
    } else {
      this.categories = [];
    }
  }
  
  filterItems(event: any, category: string | null = null) {
    console.log('Categoría seleccionada:', category);
    const searchTermLower = this.searchTerm.toLowerCase();

    if (category) {
      this.filteredList = this.listProducto.filter((item) => {
        const categoryLower = (item.category.name || '').toString().toLowerCase();
        console.log('Categoría del producto:', categoryLower);
        return categoryLower === category.toLowerCase();
      });
    } else {
      this.filteredList = this.listProducto.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTermLower) ||
          item.description.toLowerCase().includes(searchTermLower)
      );
    }
  }
  private loadProducts() {
    // Definición de valores de latitud, longitud y radio en kilómetros
    const latitude = 'valorLatitud';
    const longitude = 'valorLongitud';
    const radiusKm = 'valorRadioKm';
  
    // Llamada al servicio `getProducts` del servicio `principalService`
    this.principalService.getProducts(latitude, longitude, radiusKm).subscribe(
      // Manejo exitoso de la respuesta
      (products: Product[]) => {
        // Imprime la lista de productos en la consola
        console.log('Lista de productos:', products);
        
        // Asigna la lista de productos a la propiedad `products` del componente o servicio
        this.products = products;
  
        // Guarda los productos originales para su uso en búsquedas
        this.originalProducts = products;
      },
      // Manejo de errores en caso de que la llamada al servicio falle
      (error) => {
        console.error('Error al cargar la lista de productos', error);
      }
    );
  }
  

  

  // Método para la búsqueda de productos
  searchProducts(searchTerm: string | null | undefined) {
    // Proporciona un valor predeterminado en caso de que searchTerm sea undefined o null
    const term = searchTerm || '';
  
    // Filtra los productos basándote en el título y descripción
    this.products = this.originalProducts.filter((item) => {
      const titleMatch = item.name.toLowerCase().includes(term.toLowerCase());
      const descriptionMatch = item.description.toLowerCase().includes(term.toLowerCase());
      return titleMatch || descriptionMatch;
    });
  }
  

  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log('Image loaded:', imgElement.src);
  }

  redirectToLogin() {
    this.router.navigate(['/login']); 
  }

  redirectToDetail() {
    this.router.navigate(['/detail']); 
  }
}
