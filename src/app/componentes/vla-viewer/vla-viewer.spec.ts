import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlaViewer } from './vla-viewer';

describe('VlaViewer', () => {
  let component: VlaViewer;
  let fixture: ComponentFixture<VlaViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlaViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(VlaViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
