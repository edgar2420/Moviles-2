import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddproductoService } from 'src/app/service/addproducto.service';
import { CategoryService } from 'src/app/service/categoria.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.page.html',
  styleUrls: ['./create-producto.page.scss'],
})
export class CreateProductoPage {
  productForm: FormGroup;
  selectedImages: FileList | null = null;
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private addProductoService: AddproductoService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      categoria: ['', Validators.required],
      estado: ['', Validators.required],
      sold: ['', Validators.required],
      imagenes: [null],
    });

    this.onInit();
  }

  onInit() {
    this.categoryService.getCategories().subscribe(
      (categories: string[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  onSubmit() {
    console.log('Intentando crear el producto');

    if (this.productForm.valid) {
      const productData: Product = this.productForm.value;

      console.log('Datos del producto:', productData);

      this.addProductoService.registerProduct(productData).subscribe(
        (response: any) => {
          console.log('Respuesta del servicio de registro:', response);

          if (response && response.id) {
            const productId = response.id;

            if (this.selectedImages) {
              this.uploadImagesSequentially(productId, Array.from(this.selectedImages), 0);
            } else {
              this.navigateToHome();
            }
          } else {
            console.error('La respuesta del servidor no contiene el ID del producto.');
            this.navigateToHome();
          }
        },
        (error) => {
          console.error('Error en la llamada al servicio de registro:', error);
          this.navigateToHome();
        }
      );
    }
  }

  uploadImagesSequentially(productId: number, images: File[], index: number) {
    if (index < images.length) {
      const image = images[index];

      this.addProductoService.uploadProductImage(productId, image).subscribe(
        (imgResponse) => {
          console.log('Imagen cargada:', imgResponse);
          this.uploadImagesSequentially(productId, images, index + 1);
        },
        (imgError) => {
          console.error('Error al cargar imagen:', imgError);
          this.navigateToHome();
        }
      );
    } else {
      this.navigateToHome();
    }
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedImages = event.target.files;
      console.log('Imágenes seleccionadas:', this.selectedImages);
    }
  }

  navigateToHome() {
    this.router.navigate(['/home', '/principal']).then(
      () => console.log('Redirección exitosa'),
      (error) => console.error('Error al redirigir:', error)
    );
  }
}
