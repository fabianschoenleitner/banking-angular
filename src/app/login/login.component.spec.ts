import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {LoginService} from '../login.service';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data successfully if called asynchronously', fakeAsync(() => {
    fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.debugElement.componentInstance;
    const loginService = fixture.debugElement.injector.get(LoginService);
    const spy = spyOn(loginService, 'login')
      .and.returnValue(new Observable());
    fixture.detectChanges();
    tick();
    expect(app.logobanktoken).toBe('Data');

  }));

});
