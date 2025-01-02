import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Warehouse } from '../../models/warehouse';
import { WareHouseService } from '../../services/warehouse.service';
import { ApiResponse } from '../../responses/api.response';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
})
export class MapComponent implements AfterViewInit {
  currentPosition: [number, number] = [10.8744082, 106.8015733];
  highlightedDistrict: string | null = null;
  wareHouses: Warehouse[] = [];
  city: string = '';
  geojsonData: any = null;
  selectedItem: Warehouse | null = null;
  map: any;
  
  districtColors: any = {
    'Di An': '#FF6347',
    'Linh Xuan': '#1E90FF',
    'Linh Trung': '#32CD32',
    'Tang Nhon Phu A': '#FFD700',
    'Tan Phu': '#8A2BE2',
    'District 6': '#FF4500',
  };
  showCalculator: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private warehouseService: WareHouseService
  ) {}

  ngAfterViewInit() {
    this.getAllWarehouse();
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then((leaflet) => {
        this.map = leaflet.map('map').setView([10.8231, 106.6297], 13);
        leaflet
          .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          })
          .addTo(this.map);
        this.addCurrentLocationMarker(leaflet, this.map);
        this.wareHouses.forEach((warehouse) => {
          this.addBracnhMarker(leaflet, this.map, warehouse);
        });
        this.handleCalculateRoute(); 
      });
      
    }
  }
  handleCalculateRoute() {
    if (!this.map || !isPlatformBrowser(this.platformId)) return;
    else if (this.platformId) {
      import('leaflet').then((L) => {
        import('leaflet-routing-machine').then(() => {
          this.routeControl = L.Routing.control({
            waypoints: [
              L.latLng(this.currentPosition[0], this.currentPosition[1]),
              L.latLng(this.selectedItem!.latitude, this.selectedItem!.longitude),
            ],
            routeWhileDragging: true,
            instructions: false,
          }).addTo(this.map);
        });
      });
      
    }
  
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }
  
    if (!this.selectedItem) return;
  
    
  }
  
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
  getAllWarehouse() {
    this.warehouseService
      .getAllWarehouses(this.city)
      .subscribe((response: ApiResponse) => {
        if (response.data) {
          this.wareHouses = response.data;
        }
      });
  }

  addCurrentLocationMarker(L: any, map: any) {
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
  addBracnhMarker(L: any, map: any, warehouse: Warehouse) {
    const redIcon = new L.Icon({
      iconUrl: 'https://www.vtsc.one/wp-content/uploads/2022/07/gps.png',
      iconSize: [32, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker =L.marker([warehouse.latitude, warehouse.longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup(`<b>Chi Nhánh: ${warehouse.name}</b>`)
      .openPopup();
    marker.on('click', () => {
      this.getSelectedWarehouse(warehouse);
    })
  }
  private routeControl: any = null;

  
  getSelectedWarehouse(warehouse: Warehouse) {
    this.selectedItem = warehouse;
    console.log(this.selectedItem);
  }
  showCalculatorRoute() {
    this.showCalculator = !this.showCalculator;
    this.handleCalculateRoute();
    
    console.log(this.showCalculator);
  }
  selectWarehouse(warehouse: Warehouse) {
    this.selectedItem = warehouse;
    // this.handleCalculateRoute();
  }
}
