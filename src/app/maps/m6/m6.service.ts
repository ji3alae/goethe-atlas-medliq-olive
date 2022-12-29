import { Injectable } from '@angular/core';
import { first, map, switchMap } from 'rxjs/operators';
import { FeatureCollection, Feature, Geometry } from 'geojson';

import { ApiService } from '../../api.service';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class M6Service {
  BASE = 'appMvI3Q7ldjlGKyZ';
  authorRecords = new ReplaySubject<any>(1);
  TITLE = '';
  SUBTITLE = '';
  ABOUT = '';
  MIN_ZOOM = 3;
  orientation = '';
  Acknowledgements = '';
  subTitle = '';
  
  constructor(private api: ApiService) { }

  fetchSettings() {
    return this.api.airtableFetch(this.BASE, 'Settings', 'website').pipe(
      map((response: any) => {
        const ret = {};
        response.records.forEach((i) => {
          ret[i.fields.key] = i.fields.value;
        });
        return ret;
      })
    );
  }

  getSamples() {
    return this.fetchSettings().pipe(
      switchMap((settings: any) => {
        this.TITLE = settings.title || '';
        this.SUBTITLE = settings.subtitle || '';
        this.ABOUT = settings.about || '';
        this.MIN_ZOOM = parseInt(settings.min_zoom);
        this.orientation = settings.orientation
        this.Acknowledgements = settings.Acknowledgements;
        this.subTitle = settings.subTitle
        return this.api.airtableFetch(this.BASE, 'Samples', 'website');
      }),
      
      map((response: any) => 
        response.records.map((rec) => {
        return Object.assign(rec.fields, {id: rec.id});
      })),
      map((samples: any[]) => { 
        return {
          type: 'FeatureCollection',
          features: samples.filter((sample) => sample.Status === 'Published').map((sample) => {
            const coordinates = sample.coordinates.split(',').map((x) => parseFloat(x));
            return {
              type: 'Feature',
              properties: sample,
              geometry: {
                type: 'Point',
                coordinates: [coordinates[1], coordinates[0]]
              } as Geometry
            } as Feature;
          })
        } as FeatureCollection;
      })
    )
  }

  getAuthors() {
    return this.api.airtableFetch(this.BASE, 'Authors', 'website')
        .pipe(
          this.api.airtableToMapping(),
        ).subscribe((authorRecords) => {
          this.authorRecords.next(authorRecords);
        });
  }
}

