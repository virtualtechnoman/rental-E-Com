import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from '../core/user/shared/user-service.service';
import { UserRoleService } from '../core/user/shared/userrole.service';
import { UserRoleModel, UserModel } from '../core/user/shared/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  allUserRoles: UserRoleModel[] = [];
  @Input() user: any = {};
  constructor(
    public authService: AuthService, private router: Router, private userService: UserService, private userRoleService: UserRoleService

  ) {
    this.userRoleService.getAllUserRoles().subscribe((res: UserRoleModel[]) => {
      this.allUserRoles = res;
    });
  }

  ngOnChanges() {
  }

  ngOnInit() {
  }

  logout(): void {
    this.authService.signOut();
    this.navigate('/auth/login');
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

}
