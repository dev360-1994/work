import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANT } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = CONSTANT.getUser();
    if (user?.token && route?.data?.roles?.map((i: string) => i.toLowerCase())?.includes(user?.role?.toLowerCase())) {
      return true;
    }
    // if (user?.roles?.indexOf("Buyer")>-1) {
    //   this.router.navigate(['/buyer-admin']);
    // } else if (user?.role?.indexOf("MasterAdmin") >-1) {
    //   this.router.navigate(['/griddo-master']);
    // } else if (user?.role?.indexOf("Builder") >-1) {
    //   this.router.navigate(['/builder-admin']);
    // } else if (user?.role?.indexOf("Agent")>-1) {
    //   this.router.navigate(['/agent-admin']);
    // }
    // else if (user?.role?.indexOf("Agency") >-1) {
    //   this.router.navigate(['/agency-admin']);
    // }
    // else {
    //   this.router.navigate(['/']);
    // }
    if (user?.role?.toLowerCase() === 'buyer') {
      this.router.navigate(['/buyer-admin']);
    } else if (user?.role?.toLowerCase() === 'masteradmin') {
      this.router.navigate(['/griddo-master']);
    } else if (user?.role?.toLowerCase() === 'builder') {
      this.router.navigate(['/builder-admin']);
    } else if (user?.role?.toLowerCase() === 'agent') {
      this.router.navigate(['/agent-admin']);
    }  
     else if (user?.role?.toLowerCase() === 'agency') {
      this.router.navigate(['/agency-admin']);
    }
     else {
      this.router.navigate(['/']);
    }
    return false;
  }

}
