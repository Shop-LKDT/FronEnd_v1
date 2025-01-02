import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';  // Thêm LeafletModule vào nếu chưa có
import './pin.scss';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pin',
  standalone: true, // Đánh dấu đây là Standalone Component
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
  imports: [LeafletModule, CommonModule] ,// Thưêm module của ngx-leaflet vào imports,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PinComponent {
  @Input() item: any;
  @Input() isRed: boolean = false;
  redIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  defaultIcon = new L.Icon({
    iconUrl: './pin.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
  constructor(private router: Router) {}
  handleClick() {
    this.router.navigate([`/${this.item.id}`]);
  }
}