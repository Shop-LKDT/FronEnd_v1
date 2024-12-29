import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../app/components/map/map.component';
@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {

}
