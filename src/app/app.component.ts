import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";


import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {

  private userSubscription: Subscription;
  public user: any;
  public loggedin: boolean;
  array:any=[]
  constructor(
    private authService: AuthService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
  ) {
    // console.log
    this.array=this.authService.userData
    console.log("hiii",this.array)
    this.registerSvgIcons()
    this.getData();
  }

  ngOnChanges() {
    if (localStorage.get('AuthToken') != null) {
      this.loggedin = true;
    } else {
      this.loggedin = false;
    }
  }

  public ngOnInit() {
    this.authService.me().subscribe(data => {
      console.log(data)
      this.user = data;
      // this.get(data.user.id);
    });
    // update this.user after login/register/logout
    this.userSubscription = this.authService.$userSource.subscribe((user) => {
      console.log(user)
      this.user = user;
      
      this.loggedin = true;
    });
    // this.getData();
  }
    getData(){
      this.authService.me().subscribe(res=>{
        console.log(res)
      })
    }
  // get(id) {
  //   this.userService.getUser(id).subscribe((res: UserModel) => {
  //     this.me = res;
  //     console.log(this.me)
  //   })
  // }


  logout(): void {
    this.loggedin = !this.loggedin;
    this.authService.signOut();
    this.navigate('/auth/login');
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  registerSvgIcons() {
    [
      'close',
      'add',
      'add-blue',
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'clone',
      'convertible',
      'delete',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation',
    ].forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`))
    });
  }

}
