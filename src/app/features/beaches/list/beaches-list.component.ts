import { Component, OnInit } from '@angular/core';
import { BeachService } from '../../../shared/services/beaches.service';
import { Beach, Orientation, beachFilters } from '../../../shared/models/Beach';
import { WeatherService } from '../../../shared/services/weather.service';
import { CurrentWeather } from '../../../shared/models/Meteo';
import { TrafficService } from '../../../shared/services/traffic.service';
import { Traffic } from '../../../shared/models/Traffic';
import { Router, ActivatedRoute } from '@angular/router';
import { SortService } from '../../../shared/services/sort.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-beaches-list',
  templateUrl: './beaches-list.component.html',
  styleUrls: ['./beaches-list.component.css']
})
export class BeachesListComponent implements OnInit {
  beaches: Array<Beach> = [];
  filteredBeaches: Array<Beach> = [];
  newBeaches = [];
  beachFilters = beachFilters;

  orientationForm: FormGroup;
  servicesForm: FormGroup;
  crowdForm: FormGroup;
  zoneForm: FormGroup;
  tags: Array<String> = ['Relax', 'Avventura', 'Pedalò', 'Famiglia', 'Kayak', 'Ristorante', 'Cani ammessi'];

  radioValue = 'park';
  loaded = false;
  mainFilter = '';

  constructor(
    private route: ActivatedRoute,
    private sortService: SortService,
    private beachService: BeachService,
    private weatherService: WeatherService,
    private trafficService: TrafficService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.orientationForm = this.formBuilder.group({
      Nord: [true],
      Sud: [true],
      Est: [true],
      Ovest: [true]
    });
    this.servicesForm = this.formBuilder.group({
      park: [false],
      food_service: [false],
      lifeguard: [false],
      dogs_allowed: [false],
      summer_crowding: [false],
      tobacconist: [false],
      disabled_access: [false],
      sunbed_umbrella: [false],
      wifi: [false],
      first_aid: [false],
      toilet: [false],
      showers: [false],
      snorkeling_diving: [false],
      kayak: [false],
      discoteque: [false],
      baby_parking: [false],
    });
    this.crowdForm = this.formBuilder.group({
      affollata: [false]
    });
    this.zoneForm = this.formBuilder.group({
      costa_nord: [false],
      costa_sud: [false],
      costa_est: [false],
      costa_ovest: [false]
    });
  }

  ngOnInit() {
    this.setFilters();
    this.loadComponent();
  }
 

  setFilters = () => {
    this.mainFilter = this.route.snapshot.queryParams.filter;
    if (this.mainFilter) {
      let filterType = null;
      switch (this.mainFilter) {
        case 'fun': {
          filterType = this.beachFilters.fun;
          break;
        }
        case 'sport': {
          filterType = this.beachFilters.sport;
          break;
        }
        case 'family': {
          filterType = this.beachFilters.family;
          break;
        }
        case 'relax': {
          filterType = this.beachFilters.relax;
          break;
        }
      }

      if (filterType) {
        let services = { ...this.servicesForm.value };
        Object.keys(services).forEach(function (item) {
          if (filterType.hasOwnProperty(item) && filterType[item]) {
            services[item] = true;
          }
          else {
            services[item] = false;
          }
        });

        this.servicesForm.patchValue(services);

        if (filterType.hasOwnProperty('summer_crowding') && filterType.summer_crowding) {
          this.crowdForm.patchValue({ summer_crowding: true });
        }

      }

    }

  }

  loadComponent = () => {
    this.beachService.getBeaches()
      .subscribe((resBeaches: Array<Beach>) => {
        for (const beach of resBeaches) {
          this.getWeather(beach);
          // this.getTraffic(beach);
        }

        const services: any = { ...this.servicesForm.value };
        this.beaches = resBeaches;
        this.sortBeaches();
        this.filteredBeaches = JSON.parse(JSON.stringify(this.beaches));
        this.filterBeaches();
        this.formatBeaches(this.filteredBeaches);
        this.loaded = true;
      }, err => {
        console.error(err);
        this.loaded = true;
      });
  };

  getWeather = (beach: Beach) => {
    this.weatherService.getCurrent(beach.city, beach.latitude, beach.longitude)
      .subscribe((weather: CurrentWeather) => {
        beach.weatherIcon = this.getWeatherIconPath(weather.data[0].weather.icon);
        beach.weather = weather;
      }, err => {
        console.error(err);
      });
  };

  /*
    getTraffic = (beach: Beach) => {
      this.trafficService.getTraffic(beach.city)
        .subscribe((traffic: Traffic) => {
          if (traffic) {
            beach.traffic = traffic.value;
          }
        }, err => {
          console.error(err);
        });
    };
  */

  radioChange = () => {
    console.log(this.radioValue);
    this.sortBeaches();
  };

  sortBeaches = () => {
    this.beaches = this.sortService.getSortedData(this.beaches, this.radioValue);
  };

  getWeatherIconPath = (icon: string): string => `https://www.weatherbit.io/static/img/icons/${icon}.png`;
  // getTrafficClass = (value: number) => value >= 80 ? 'bg-danger' : (value > 70 && value < 80 ? 'bg-warning' : 'bg-success');
  goToDetails = (id: number) => this.router.navigate([`beaches/details/${id}`]);
  // getInfoClass = (value: boolean) => value ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
  // getOrientationArrow = (orientation: string) => {
  //   let direction;

  //   switch (orientation) {
  //     case 'Nord': direction = 'up';
  //       break;
  //     case 'Sud': direction = 'down';
  //       break;
  //     case 'Est': direction = 'right';
  //       break;
  //     case 'Ovest': direction = 'left';
  //       break;
  //   }

  //   return `fa-arrow-alt-circle-${direction}`;
  // };
  formatBeaches = (beaches: Array<Beach>) => {
    const cols = 2;
    this.newBeaches = [];

    for (let i = 0; i < beaches.length; i += cols) {
      this.newBeaches.push({ items: beaches.slice(i, i + cols) });
    }

  }

  filterBeaches = () => {
    // const beaches: Array<Beach> = [];
    const orientation = this.orientationForm.value;

    this.loaded = false;

    let services = { ...this.servicesForm.value };
    let servicesFilter = [];

    servicesFilter = Object.keys(services).filter(function (item) {
      return (services[item]);
    });
    this.filteredBeaches = this.getFilteredBeaches(this.beaches, servicesFilter);



    let zone = { ...this.zoneForm.value };
    let zoneFilter = [];

    zoneFilter = Object.keys(zone).filter(function (item) {
      return (zone[item]);
    });
    this.filteredBeaches = this.getFilteredBeaches(this.filteredBeaches, zoneFilter);
    // this.formatBeaches(this.filteredBeaches);

    let crowd = { ...this.crowdForm.value };

    if (crowd.non_affollata) {
      this.filteredBeaches = this.filteredBeaches.filter(beach => {
        return (beach.summer_crowding != crowd.non_affollata);
      });
    }

    this.formatBeaches(this.filteredBeaches);
    this.loaded = true;
    // const crowd = this.crowdForm.value;

    // // Order by orientation
    // this.filteredBeaches = this.beaches.filter(beach =>
    //   (beach.orientation === Orientation. && orientation.north)
    //   || (beach.orientation === Orientation.South && orientation.south)
    //   || (beach.orientation === Orientation.East && orientation.east)
    //   || (beach.orientation === Orientation.West && orientation.west)
    // );

    // this.edBeaches = this.edBeaches.filter(beach =>
    //   (beach.summer_crowding === 'Affollata' && crowd.affollata)
    //   || (beach.summer_crowding === 'Deserta' && crowd.deserta)
    //   || (beach.summer_crowding === 'Frequentata' && crowd.frequentata)
    // );

    // this.filteredBeaches = this.filteredBeaches.filter(beach =>
    //   (beach.park && services.park)
    //   || (beach.food_service && services.food_service)
    //   || (beach.dogs_allowed && services.dogs_allowed)
    //   || (beach.lifeguard && services.lifeguard)
    // );

    // this.formatBeaches(this.filteredBeaches);



  };

  getFilteredBeaches(filteredBeaches, filterList) {

    if (filterList && filterList.length > 0) {
      return filteredBeaches = filteredBeaches.filter(beach => {
        let beachOk = false;
        for (let item of filterList) {
         
          if (item && beach[item]) {
            beachOk = true;
          
          }
          else {
            beachOk = false;

            break;
          }
         
        }
        return beachOk;
      });
    }
    else {
      return filteredBeaches;
    }


  }


}

