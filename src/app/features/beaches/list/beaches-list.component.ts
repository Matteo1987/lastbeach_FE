import { Component, OnInit } from '@angular/core';
import { BeachService } from '../../../shared/services/beaches.service';
import { Beach, Orientation } from '../../../shared/models/Beach';
import { WeatherService } from '../../../shared/services/weather.service';
import { CurrentWeather } from '../../../shared/models/Meteo';
import { TrafficService } from '../../../shared/services/traffic.service';
import { Traffic } from '../../../shared/models/Traffic';
import { Router } from '@angular/router';
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

  orientationForm: FormGroup;
  servicesForm: FormGroup;
  tags: Array<String> = ['Relax', 'Avventura', 'Pedalò', 'Famiglia', 'Kayak', 'Ristorante', 'Cani ammessi'];

  radioValue = 'park';
  loaded = false;

  constructor(
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
      park: [true],
      food_service: [true],
      lifeguard: [true],
      dogs_allowed: [true]
    });
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent = () => {
    this.beachService.getBeaches()
      .subscribe((resBeaches: Array<Beach>) => {
        for (const beach of resBeaches) {
          this.getWeather(beach);
          // this.getTraffic(beach);
          this.sortBeaches();
        }

        this.beaches = resBeaches;
        this.filteredBeaches = JSON.parse(JSON.stringify(this.beaches));
        this.formatBeaches(this.filteredBeaches);
        this.loaded = true;
      }, err => {
        console.error(err);
        this.loaded = true;
      }
      );
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
    const services = this.servicesForm.value;
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

    this.filteredBeaches = this.filteredBeaches.filter(beach =>
      (beach.park && services.park)
      || (beach.food_service && services.food_service)
      || (beach.dogs_allowed && services.dogs_allowed)
      || (beach.lifeguard && services.lifeguard)
    );

    this.formatBeaches(this.filteredBeaches);

  };


}

