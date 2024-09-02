import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallepokemonPage } from './detallepokemon.page';

describe('DetallepokemonPage', () => {
  let component: DetallepokemonPage;
  let fixture: ComponentFixture<DetallepokemonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetallepokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
