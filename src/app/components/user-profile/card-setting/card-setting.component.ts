import { Component, OnInit, ViewChild } from '@angular/core';
import { UserResponse } from '../../../responses/user/user.response';
import { UserService } from '../../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../../services/token.service';
import { UpdateUserDTO } from '../../../dtos/user/update.user.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card-setting',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './card-setting.component.html',
  styleUrl: './card-setting.component.scss',
})
export class CardSettingComponent implements OnInit {
  @ViewChild('updatedForm') updatedForm!: NgForm;

  token: string = '';
  userResponse?: UserResponse | null;
  userProfileForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
  ) {
    this.userProfileForm = this.formBuilder.group(
      {
        fullname: [''],
        email: ['', [Validators.email]],
        phone_number: ['', Validators.minLength(6)],
        password: ['', Validators.minLength(3)],
        retype_password: ['', Validators.minLength(3)],
        address: ['', [Validators.required, Validators.minLength(5)]],
        date_of_birth: [''],
      },
    );
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    this.getCurrentUser();
    this.userProfileForm.patchValue({
      fullname: this.userResponse?.fullname ?? '',
      address: this.userResponse?.address ?? '',
      date_of_birth: this.userResponse?.date_of_birth
        .toISOString()
        .substring(0, 10),
    });
    console.log(this.userResponse);
  }
  getCurrentUser(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }
  save(): void {
    debugger;
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value,
      };

      this.userService.updateUserDetail(this.token, updateUserDTO).subscribe({
        next: (response: any) => {},
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        },
      });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        console.error('Mật khẩu và mật khẩu gõ lại chưa chính xác');
      }
    }
  }
}
