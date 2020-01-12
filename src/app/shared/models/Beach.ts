import {CurrentWeather} from './Meteo';

export interface Beach {
  id?: number;
  name?: string;
  city?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  orientation?: string;
  park?: boolean;
  food_service?: boolean;
  lifeguard?: boolean;
  dogs_allowed?: boolean;
  summer_crowding?: boolean;
  tobacconist?: boolean;
  disabled_access?: boolean;
  sunbed_umbrella?: boolean;
  wifi?: boolean;
  first_aid?: boolean;
  toilet?: boolean;
  showers?: boolean;
  snorkeling_diving? : boolean;
  kayak?: boolean;
  discoteque? : boolean;
  baby_parking? : boolean;
  costa_nord? : boolean;
  costa_sud? : boolean;
  costa_est? : boolean;
   costa_ovest? : boolean;
  photo?: string;
  weatherIcon?: string;
  weather: CurrentWeather;
  traffic?: number;
  beach_type?:string;
}

export const Orientation = {
  Nord: 'Nord',
  Sud: 'Sud',
  Ovest: 'Ovest',
  Est: 'Est',
};

export const BeachType = {
  
  fine_sand: "sabbia fine",
  rough_sand : "sabbia grossa",
  partially_rocky : "parzialmente rocciosa",
  totally_rocky: "totalmente rocciosa"
};

export const beachFilters = {
  family: {
    food_service: true,
    lifeguard: true,
    summer_crowding: true,
    sunbed_umbrella: true,
    first_aid: true,
    toilet: true,
    park: true,
    showers: true,
    baby_parking: true
  },
  relax: {
    food_service: true,
    lifeguard: true,
    summer_crowding: true,
    sunbed_umbrella: true,
    wifi: true,
    first_aid: true,
    toilet: true,
    park: true,
    showers: true
  },
  fun: {
    food_service: true,
    wifi: true,
    discoteque: true
  },
  sport: {
    summer_crowding: true,
    lifeguard: true,
    first_aid: true,
    snorkeling_diving: true,
    kayak: true
  }
};
