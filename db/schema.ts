import { ColumnType, Generated } from "kysely";

export type Timestamp = ColumnType<
  Date,
  Date | string | null
>;

export interface TYPES {
  type_name: string;
}

export interface STATUS {
  status_name: string;
}

export interface GENRES {
  genre_name: string;
}

export interface LANGUAGES {
  language_code: string;
}

export interface LINK_TYPES {
  link_type: string;
}

export interface NETWORKS {
  network_id: number;
  network_name: string;
}

export interface REGIONS {
  region_code: string;
  region_name: string;
}

export interface SPOKEN_LANGUAGES {
  spoken_language_name: string;
}

export interface TITLES {
  title_id: string;
  title: string | null;
  original_title: string | null;
  tagline: string | null;
  overview: string | null;
  type: string | null;
  is_adult: boolean;
  popularity: number | null;
  status: string | null;
  season_number: number | null;
  episode_number: number | null;
  runtime_minute: number | null;
  start_year: number | null;
  end_year: number | null;
}

export interface PERSON {
  person_id: string;
  person_name: string | null;
  birth_year: number | null;
  death_year: number | null;
}

export interface TITLE_AKAS {
  title_id: string;
  ordering: number;
  title: string;
  region: string | null;
  language: string | null;
  type: string | null;
  attributes: string | null;
  is_original_title: boolean;
}

export interface TITLE_GENRES {
  title_id: string;
  genre: string;
}

export interface TITLE_LANGUAGES {
  title_id: string;
  language_code: string;
}

export interface TITLE_LINKS {
  title_id: string;
  link_type: string;
  link: string;
}

export interface TITLE_CREWS {
  title_id: string;
  ordering: number;
  person_id: string;
  category: string;
  job: string | null;
  character: string | null;
}

export interface TITLE_NETWORKS {
  title_id: string;
  network_id: number;
}

export interface TITLE_REGIONS {
  title_id: string;
  production_region_code: string;
  origin_region_code: string;
}

export interface TITLE_SPOKEN_LANGUAGES {
  title_id: string;
  spoken_language: string;
}

export interface PERSON_KNOWN_TITLES {
  person_id: string;
  title_id: string;
}

export interface PERSON_PRIMARY_PROFESSIONS {
  person_id: string;
  primary_profession: string;
}

export interface RATINGS {
  title_id: string;
  old_average_rating: number | null;
  old_rate_count: number | null;
  average_rating: number | null;
  rate_count: number | null;
}

export interface ERROR_LOGS {
  log_id: Generated<number>;
  proc_name: string;
  error_number: number | null;
  error_message: string | null;
  input_params: string | null;
  created_at: Generated<Timestamp>;
  user_ip: string | null;
  user_agent: string | null;
}

export interface USERS {
  user_id: Generated<number>;
  email: string;
  username: string;
  name: string | null;
  hashed_password: Uint8Array | null;
  description: string | null;
  gender: "M" | "F" | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp> | null;
}

export interface DATABASE {
  "INTEGRATED.TYPES": TYPES;
  "INTEGRATED.STATUS": STATUS;
  "INTEGRATED.GENRES": GENRES;
  "INTEGRATED.LANGUAGES": LANGUAGES;
  "INTEGRATED.LINK_TYPES": LINK_TYPES;
  "INTEGRATED.NETWORKS": NETWORKS;
  "INTEGRATED.REGIONS": REGIONS;
  "INTEGRATED.SPOKEN_LANGUAGES": SPOKEN_LANGUAGES;
  "INTEGRATED.TITLES": TITLES;
  "INTEGRATED.PERSON": PERSON;
  "INTEGRATED.TITLE_AKAS": TITLE_AKAS;
  "INTEGRATED.TITLE_GENRES": TITLE_GENRES;
  "INTEGRATED.TITLE_LANGUAGES": TITLE_LANGUAGES;
  "INTEGRATED.TITLE_LINKS": TITLE_LINKS;
  "INTEGRATED.TITLE_CREWS": TITLE_CREWS;
  "INTEGRATED.TITLE_NETWORKS": TITLE_NETWORKS;
  "INTEGRATED.TITLE_REGIONS": TITLE_REGIONS;
  "INTEGRATED.TITLE_SPOKEN_LANGUAGES": TITLE_SPOKEN_LANGUAGES;
  "INTEGRATED.PERSON_KNOWN_TITLES": PERSON_KNOWN_TITLES;
  "INTEGRATED.PERSON_PRIMARY_PROFESSIONS": PERSON_PRIMARY_PROFESSIONS;
  "INTEGRATED.RATINGS": RATINGS;
  "APP.USERS": USERS;
}
