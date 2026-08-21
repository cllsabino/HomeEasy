import { AppModule } from '../app.module';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalComponent } from './profissional.component';

describe('ProfissionalComponent', () => {
  let component: ProfissionalComponent;
  let fixture: ComponentFixture<ProfissionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
