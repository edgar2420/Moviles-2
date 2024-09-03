import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { HomeService } from 'src/app/service/home.service';
import { CategoryService } from 'src/app/service/categoria.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  searchTerm: string = '';
  listProducto: Product[] = [];
  filteredList: Product[] = [];
  categories: string[] = [];
  showCategoriesFlag: boolean = false;
  navCtrl: any;

  constructor(
    private shome: HomeService,
    private categoryService: CategoryService,
    private route: Router,
    private alertController: AlertController
  ) {}

  redirectToCreateProduct() {
    console.log('Redireccionando a crear producto');
    this.route.navigate(['/create-producto']);
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

  async ngOnInit() {
    this.shome.getall().subscribe(
      (data) => {
        console.log('Productos obtenidos:', data);
        this.listProducto = data;
        this.filteredList = data;
      },
      (err) => {
        console.error('Error al obtener productos', err);
      }
    );
  }

  async chat() {
      console.log('Chateando');
      this.route.navigate(['/chats']);
  }

  async logout() {
      localStorage.removeItem('token');
      this.route.navigate(['/principal']);
    
  }

}
