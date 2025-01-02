import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../app/components/map/map.component';
import { HeaderComponent } from '../../app/components/header/header.component';
import { FooterComponent } from '../../app/components/footer/footer.component';
@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {

}
