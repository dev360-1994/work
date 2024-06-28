import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith } from 'rxjs/operators';
import { CONSTANT } from 'src/app/constants';
import { SearchBarModel } from 'src/app/models/search-bar.model';
import { User } from 'src/app/models/user.model';
import { BuyerAdminService } from 'src/app/modules/buyer-admin/services/buyer-admin.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';
import { SearchBarService } from '../../search-bar.service';
import * as cloneDeep from 'lodash/cloneDeep';

export interface SideBarChildLink {
  title: string;
  icon?: string;
  link?: string;
  active?: boolean;
  exactMatch: boolean;

}

export interface SideBarLink extends SideBarChildLink {
  opened: boolean;
  items?: Array<SideBarChildLink>
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  links: Array<SideBarLink>;
  heading?: 'none' | 'project' | 'buyer-admin' | 'agency-admin';
  bottomlinks: Array<SideBarLink>;
  roles: any = [];
  userRole = "";

  subscription!: Subscription;

  user: User;
  searchBar!: SearchBarModel
  control = new FormControl();
  project!: ProjectModel;
  // filteredItems: Array<any> = [];
  constructor(
    private searchBarService: SearchBarService,
    private projectsService: ProjectsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private buyerAdminService: BuyerAdminService
  ) {
    this.user = CONSTANT.getUser();
    this.userRole = this.user?.role?.toLocaleLowerCase() === 'masteradmin' ? 'Super Admin' : this.user?.role[0].toUpperCase() + this.user?.role.slice(1);
    projectsService.projectEmiter.subscribe(p => this.project = p);

    this.heading = activatedRoute.snapshot.data?.menu?.heading;
    this.links = cloneDeep(activatedRoute.snapshot.data?.menu?.links);
    this.bottomlinks = activatedRoute.snapshot.data?.menu?.bottomlinks;
    // const find_replace_from_params = activatedRoute.snapshot.data?.menu?.find_replace_from_params;

    activatedRoute.data.subscribe(data => {
      const find_replace_from_params = data?.menu?.find_replace_from_params;
      if (find_replace_from_params && activatedRoute.snapshot.params[find_replace_from_params]) {
        [...this.links, ...this.bottomlinks]?.forEach(item => {
          if (item?.link) {
            item.link = item.link.replace('${' + find_replace_from_params + '}', activatedRoute.snapshot.params[find_replace_from_params]);
            item['active'] = false;
          }
          if (item?.items?.length) {
            item.items.forEach(childItem => {
              if (childItem?.link) {
                childItem.link = childItem.link.replace('${' + find_replace_from_params + '}', activatedRoute.snapshot.params[find_replace_from_params]);
                childItem['active'] = false;
              }
            })
          }
        })
      }
    })




    if (this.heading === 'buyer-admin') {
      this.links = [];
      this.buyerAdminService.getBuyerProjects(this.user.userName || this.user.email).toPromise().then(items => {
        items?.forEach(item => this.links.push({
          title: item.projectName,
          link: `/buyer-admin/${item.projectId}/details`,
          icon: 'dashboard',
          exactMatch: true,
          opened: false
        }));
        if (this.links.length) {
          this.router.navigate([this.links[0].link]);
        }
      })
    }
    if (this.heading === 'agency-admin') {
      this.links = [];

      this.buyerAdminService.getBuyerProjects(this.user.userName || this.user.email).toPromise().then(items => {
        items?.forEach(item => this.links.push({
          title: item.projectName,
          link: `/buyer-admin/2/details`,
          icon: 'dashboard',
          exactMatch: true,
          opened: false
        }));
        this.router.navigate([this.links[0].link]);
      })
    }
    this.subscription = this.searchBarService.toggleSearchBar.subscribe(data => this.searchBar = data);
    this.subscription.add(this.control.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(value => {
      this.searchBar?.onSearch(value)
      // const filterValue = this._normalizeValue(value);
      // this.filteredItems = this.searchBar?.items.filter(item => this._normalizeValue(item[this.searchBar.nameKey]).includes(filterValue));
    }));
    this.checkAciveLink();

  }

  onClickButton(button: { icon: string, val: string, selected?: boolean }) {
    this.searchBar.buttons?.items.forEach(i => i['selected'] = false);
    button.selected = true;
    this.searchBar.buttons?.onClick(button.val);
  }

  clearCache(item) {
    localStorage.removeItem("agency-admin");
    if (localStorage.getItem("agencyId") != null || localStorage.getItem("agencyId") != undefined) {
      localStorage.removeItem("agencyId");
      window.location.reload()
    }
    if (localStorage.getItem("builderId") != null || localStorage.getItem("builderId") != undefined) {
      localStorage.removeItem("builderId");
      window.location.reload()
    }
  }
  // optionSelected(e: any) {
  //   if (e?.option?.value) {
  //     window.open(this.searchBar.url.replace('${valKey}', e.option.value), '_blank')
  //   }
  // }
  // private _normalizeValue(value: string): string {
  //   return value?.toLowerCase()?.replace(/\s/g, '');
  // }
  ngOnInit(): void {
    this.subscription.add(this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(event => {
      // let url = (event as NavigationEnd)?.url?.toLowerCase();
      // console.log(url);
      this.checkAciveLink();
    }));
    this.addRolesOptions();
  }

  addRolesOptions() {
    let user = CONSTANT.getUser();
    if (user?.roles?.length > 1) {
      user.roles.forEach(element => {
        switch (element) {
          case 'MasterAdmin':
            this.roles.push({ name: "Super Admin", route: 'masteradmin' });
            break;
          case 'Builder':
            this.roles.push({ name: "Builder", route: 'builder' });
            break;
          case 'Agency':
            this.roles.push({ name: "Agency", route: 'agency' });
            break;
          case 'Agent':
            this.roles.push({ name: "Agent", route: 'agent' });
            break;
          case 'Buyer':
            this.roles.push({ name: "Buyer", route: 'buyer' });
            break;
          default:
            break;
        }
      });
    }
  }

  updateCurrentRole(role) {
    var result = CONSTANT.updateCurrentRole(role);
    switch (role) {
      case 'masteradmin':
        this.router.navigate(['/griddo-master']);
        break;
      case 'builder':
        this.router.navigate(['/builder-admin']);
        break;
      case 'agency':
        this.router.navigate(['/agency-admin']);
        break;
      case 'agent':
        this.router.navigate(['/agent-admin']);
        break;
      case 'buyer':
        this.router.navigate(['/buyer-admin']);
        break;
      default:
        break;
    }
  }

  checkAciveLink() {
    [...(this.links || []), ...(this.bottomlinks || [])].forEach(item => {
      item.active = item?.link?.toLowerCase()?.endsWith(window.location.pathname.toLowerCase());
      item?.items?.forEach(childItem => {
        childItem.active = childItem?.link?.toLowerCase()?.endsWith(window.location.pathname.toLowerCase());
        if (childItem.active) {
          item.active = childItem.active;
        }
      })
    });
  }

  ngOnDestroy() {
    if (this.subscription?.unsubscribe) {
      this.subscription.unsubscribe();
    }
  }

  logout = () => CONSTANT.logout();

}
