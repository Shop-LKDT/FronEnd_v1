import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Warehouse } from '../../models/warehouse';
import { WareHouseService } from '../../services/warehouse.service';
import { ApiResponse } from '../../responses/api.response';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true
})
export class MapComponent implements OnInit {
  currentPosition: [number, number] = [10.8744082, 106.8015733];
  highlightedDistrict: string | null = null;
  wareHouses : Warehouse[] = [];
  city: string = '';
  geojsonData: any = null;
  selectedItem: any = null;
  districtColors: any = {
    "Di An": "#FF6347",
    "Linh Xuan": "#1E90FF",
    "Linh Trung": "#32CD32",
    "Tang Nhon Phu A": "#FFD700",
    "Tan Phu": "#8A2BE2",
    "District 6": "#FF4500",
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private warehouseService: WareHouseService
  ) {}

  ngOnInit() {
    this.getAllWarehouse();
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(leaflet => {
        // Sử dụng thư viện Leaflet chỉ khi trên client
        const map = leaflet.map('map').setView([51.505, -0.09], 13);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        // this.initializeMap();
        
      });
    }
  }
  getAllWarehouse() {
    this.warehouseService.getAllWarehouses(this.city).subscribe((response: ApiResponse) => {
      if (response.data) {
        this.wareHouses = response.data;
      }
    });
  }

  addCurrentLocationMarker(L:any, map:any) {
    const redIcon = new L.Icon({
      iconUrl: 'https://www.vtsc.one/wp-content/uploads/2022/07/gps.png',
      iconSize: [32, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker(this.currentPosition, { icon: redIcon })
      .addTo(map)
      .bindPopup('<b>Vị trí hiện tại</b>')
      .openPopup();
  }
}
