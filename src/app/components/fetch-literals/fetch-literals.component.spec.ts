import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FetchLiteralsComponent} from './fetch-literals.component';

describe('FetchLiteralsComponent', () => {
  let component: FetchLiteralsComponent;
  let fixture: ComponentFixture<FetchLiteralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchLiteralsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchLiteralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
