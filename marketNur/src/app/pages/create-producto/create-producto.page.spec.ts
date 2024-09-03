import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CreateProductoPage } from './create-producto.page';

describe('CreateProductoPage', () => {
  let component: CreateProductoPage;
  let fixture: ComponentFixture<CreateProductoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
