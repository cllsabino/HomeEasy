import { AppModule } from '../app.module';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCadastroComponent } from './login-cadastro.component';

describe('LoginCadastroComponent', () => {
  let component: LoginCadastroComponent;
  let fixture: ComponentFixture<LoginCadastroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
