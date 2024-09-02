import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarteamPage } from './agregarteam.page';

describe('AgregarteamPage', () => {
  let component: AgregarteamPage;
  let fixture: ComponentFixture<AgregarteamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
