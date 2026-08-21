import { AppModule } from '../../app.module';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurarServicoComponent } from './procurar-servico.component';

describe('ProcurarServicoComponent', () => {
  let component: ProcurarServicoComponent;
  let fixture: ComponentFixture<ProcurarServicoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
