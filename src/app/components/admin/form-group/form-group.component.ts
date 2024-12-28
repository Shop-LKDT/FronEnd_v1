import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss'
})
export class FormGroupComponent implements OnInit {
  addReportForm!: FormGroup;
  editReportForm!: FormGroup;

  ngOnInit(): void {
    this.addReportForm = new FormGroup({
      customerId: new FormControl(''),
      reportDate: new FormControl(''),
      content: new FormControl(''),
      status: new FormControl(''),
      response: new FormControl('')
    });

    this.editReportForm = new FormGroup({
      customerId: new FormControl(''),
      reportDate: new FormControl(''),
      content: new FormControl(''),
      status: new FormControl(''),
      response: new FormControl('')
    });
  }
}

