import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { delay, first, switchMap } from 'rxjs/operators';

import { MapService } from '../../map.service';
import { PlayerService } from '../../player.service';

import * as mapboxgl from 'mapbox-gl';
import { M6Service } from './m6.service';
import { ActivatedRoute } from '@angular/router';
import * as marked from 'marked';

@Component({
  selector: 'app-m6',
  templateUrl: './m6.component.html',
  styleUrls: ['./m6.component.less'],
})
export class M6Component implements OnInit {
  @ViewChild('mapEl', { static: true }) mapEl: ElementRef;
  @ViewChild('lnk') lnk: QueryList<ElementRef>;

  theMap: mapboxgl.Map;
  samples = new ReplaySubject<GeoJSON.FeatureCollection>(1);
  rabat = new ReplaySubject<GeoJSON.FeatureCollection>(1);
  _sample = null;
  info = false;
  marked = marked;
  accordion = [];
  images = [];
  name = '';
  pics: any;
  description: any;
  Location: any;
  Chapter: any;
  Notes: any;
  Shortcuts: any;
  title: any;
  features: any;

  LAYER_NAME = 'place-label';
  SECOND_LAYER_NAME = 'intro-label';
  HIGHLIGHTS = 'highlighted';
  SOURCE_NAME = 'samples';
  DUMMY = { author: '', author_credits: '' };

  constructor(
    private api: M6Service,
    private map: MapService,
    private player: PlayerService,
    private activatedRoute: ActivatedRoute
  ) {
    api
      .getSamples()
      .pipe(
        switchMap((samples) => {
          this.sample = samples.features[0].properties;
          this.name = this.sample.name;
          this.pics = this.sample.Images
            ? [
                ...this.sample.Images.map((image) =>
                  image.width <= image.height
                    ? { ...image, newClass: true }
                    : { ...image, newClass: false }
                ),
              ]
            : [];
          this.description = this.sample.description;
          this.Location = this.sample.Location;
          this.Chapter = this.sample.Chapter;
          this.Notes = this.sample.Notes;
          this.Shortcuts = this.sample.Shortcuts;
          this.title = this.Location + ' - ' + this.Chapter;
          this.features = samples.features;

          const links = document.links;

          for (let i = 0; i < links.length; i++) {
            if (links[i].hostname !== window.location.hostname) {
              links[i].target = '_blank';
            }
          }

          setTimeout(function () {
            Array.from(document.querySelectorAll('.notes a')).forEach(function (
              elem
            ) {
              elem.setAttribute('target', '_blank');
            });
          }, 1000);

          this.samples.next(samples);
          return this.activatedRoute.fragment;
        }),
        first(),
        delay(100)
      )
      .subscribe((fragment) => {
        this.samples.pipe(first()).subscribe((samples) => {
          samples.features.forEach((s: any) => {
            const props = s.properties;
            if (props.id === fragment) {
              this.sample = props;
            }
          });
        });
      });
  }
  clicking(el) {
    const sampleToZoom = this.features.filter(
      ({ properties }) => el.innerHTML.trim() === properties.name
    );
    const { coordinates } = sampleToZoom[0].properties;
    const Coordinates = coordinates.split(',');
    this.theMap.flyTo({
      zoom: 9,
      speed: 1.5,
      curve: 2,
      center: [parseFloat(Coordinates[1]), parseFloat(Coordinates[0])],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });

    this.sample = sampleToZoom[0].properties;

    this.name = this.sample.name;
    this.pics = this.sample.Images
      ? [
          ...this.sample.Images.map((image) =>
            image.width <= image.height
              ? { ...image, newClass: true }
              : { ...image, newClass: false }
          ),
        ]
      : null;
    this.description = this.sample.description;
    this.Location = this.sample.Location;
    this.Chapter = this.sample.Chapter;
    this.Notes = this.sample.Notes;
    this.Shortcuts =
      this.sample.Shortcuts === undefined
        ? this.sample.Shortcuts?.json()
        : this.sample.Shortcuts;
    this.title = this.Location + ' - ' + this.Chapter;
    var items = this.sample.Images;
    var group = 0;
    var images = [];
    for (let i = 0; i < items.length; i++) {
      if (i > 0 && i % 4 === 0) group++;
      if (!Array.isArray(images[group])) images[group] = [];
      images[group].push(items[i]);
    }

    this.images = images;
  }

  set sample(value) {
    if (value) {
      this._sample = value;
      location.hash = '#' + value.id;
    } else {
      location.hash = '';
    }
  }

  get sample() {
    return this._sample;
  }

  givSamples() {
    return this.samples;
  }

  ngOnInit(): void {
    const model = document.querySelector('.model');
    const btnModel = document.querySelector('.btn-model');
    btnModel.addEventListener('click', function () {
      if (this.classList.contains('open') === true) {
        document.querySelector('.prev').classList.add('show');
        document.querySelector('.next').classList.add('show');
        this.classList.remove('open');
        model.classList.remove('open');
      } else {
        this.classList.add('open');
        model.classList.add('open');
        document.querySelector('.prev').classList.remove('show');
        document.querySelector('.next').classList.remove('show');
      }
    });

    this.theMap = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1IjoiYXRsYXNtZWRsaXEiLCJhIjoiY2tpbXgzNW5qMHhhcjJ5cGtydHpkNnJqYyJ9.vfietFuvTA8S1vaGlm3CUQ',
      container: this.mapEl.nativeElement,
      style: 'mapbox://styles/atlasmedliq/clbl6u8pr004o14mosduath7j',
      zoom: 5.25,
      center: [-6.25, 32.25],
      minZoom: 5,
      maxZoom: 14,
    });

    this.theMap.on('style.load', () => {
      this.samples
        .pipe(first())
        .subscribe((samples: GeoJSON.FeatureCollection) => {
          this.theMap.addSource(this.SOURCE_NAME, {
            type: 'geojson',
            data: samples,
            cluster: true,
            clusterRadius: 35,
          });
          const geojson = {
            type: 'FeatureCollection',
            features: [
              ...samples.features.filter(
                ({ properties }) => properties.Chapter === 'introduction'
              ),
            ],
          };
          for (const marker of geojson.features) {
            const el = document.createElement('div');
            const width = `30px`;
            const height = `30px`;
            el.className = 'marker';
            el.style.backgroundImage = `url(../../../assets/img/m6-pin.svg)`; // put the Rabat Icon Url

            el.style.width = width;
            el.style.height = height;
            el.style.backgroundSize = '100%';

            el.addEventListener('mouseenter', () => {
              this.theMap.getCanvas().style.cursor = 'pointer';
              // Copy coordinates array.
              const coordinates = marker.properties.coordinates.split(',');
              this.sample = marker.properties;
              this.Location = this.sample.Location;
              this.Chapter = this.sample.Chapter;
              popup
                .setLngLat(coordinates.reverse())
                .setHTML(this.Location + ' - ' + this.Chapter)
                .addTo(this.theMap);
            });
            el.addEventListener('mouseleave', () => {
              this.theMap.getCanvas().style.cursor = '';
              popup.remove();
            });

            el.addEventListener('click', () => {
              this.sample = marker.properties;
              this.sample = this.sample.Images
                ? {
                    ...this.sample,
                    Images: [
                      ...this.sample.Images.map((image) =>
                        image.width <= image.height
                          ? { ...image, newClass: true }
                          : { ...image, newClass: false }
                      ),
                    ],
                  }
                : null;

              this.name = this.sample.name;
              this.pics = this.sample.Images;
              this.description = this.sample.description;
              this.Location = this.sample.Location;
              this.Chapter = this.sample.Chapter;
              this.Notes = this.sample.Notes;
              this.Shortcuts = this.sample.Shortcuts;
              this.title = this.Location + ' - ' + this.Chapter;
              this.features = samples.features;

              this.info = false;
              location.hash = '#' + this.sample.id;

              var items = this.sample.Images;
              var group = 0;
              var images = [];
              for (let i = 0; i < items.length; i++) {
                if (i > 0 && i % 4 === 0) group++;
                if (!Array.isArray(images[group])) images[group] = [];
                images[group].push(items[i]);
              }
              this.images = images;
            });
            new mapboxgl.Marker(el)
              .setLngLat(marker.properties.coordinates.split(',').reverse())
              .addTo(this.theMap);
          }
          this.theMap.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'samples',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],

                '#94AC5D',
                4,
                '#839a4d',
                6,
                '#45512A',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                12,
                4,
                15,
                6,
                18,
              ],
            },
          });
          this.theMap.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'samples',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
            paint: {
              'text-color': '#ffffff',
            },
          });

          // inspect a cluster on click
          this.theMap.on('click', 'clusters', (e) => {
            const features = this.theMap.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;
            const source: mapboxgl.GeoJSONSource = this.theMap.getSource(
              'samples'
            ) as mapboxgl.GeoJSONSource;
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              this.theMap.easeTo({
                center: features[0].geometry['coordinates'],
                zoom: 9,
              });
            });
          });
          this.theMap.on('mouseenter', 'clusters', (e) => {
            this.theMap.getCanvas().style.cursor = 'pointer';
          });
          this.theMap.on('mouseleave', 'clusters', () => {
            this.theMap.getCanvas().style.cursor = '';
          });
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
          });
          this.map.setLayerSource(
            this.theMap,
            this.LAYER_NAME,
            this.SOURCE_NAME
          );

          this.sample = null;
          this.theMap.on('mouseenter', this.LAYER_NAME, (e) => {
            this.theMap.getCanvas().style.cursor = 'pointer';
            // Copy coordinates array.
            const coordinates = e.features[0].geometry['coordinates'].slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            this.sample = e.features[0].properties;
            this.Location = this.sample.Location;
            this.Chapter = this.sample.Chapter;
            popup
              .setLngLat(coordinates)
              .setHTML(this.Location + ' - ' + this.Chapter)
              .addTo(this.theMap);
          });
          this.theMap.on('mouseleave', this.LAYER_NAME, () => {
            this.theMap.getCanvas().style.cursor = '';
            popup.remove();
          });

          var items;
          items = this.sample.Images;
          var group = 0;
          var images = [];
          for (let i = 0; i < items?.length; i++) {
            if (i > 0 && i % 4 === 0) group++;
            if (!Array.isArray(images[group])) images[group] = [];
            images[group].push(items[i]);
          }
          this.images = images;
          this.theMap.on('click', this.LAYER_NAME, (e) => {
            this.sample = e.features[0].properties;
            this.sample = {
              ...this.sample,
              Images: [
                ...JSON.parse(this.sample.Images).map((image) =>
                  image.width <= image.height
                    ? { ...image, newClass: true }
                    : { ...image, newClass: false }
                ),
              ],
            };
            this.accordion = this.sample.accordion;
            this.name = this.sample.name;
            this.pics = this.sample.Images;
            this.description = this.sample.description;
            this.Location = this.sample.Location;
            this.Chapter = this.sample.Chapter;
            this.Notes = this.sample.Notes;
            this.Shortcuts =
              this.sample.Shortcuts === undefined
                ? this.sample.Shortcuts?.json()
                : JSON.parse(this.sample.Shortcuts);
            this.title = this.Location + ' - ' + this.Chapter;
            this.features = samples.features;

            this.info = false;
            location.hash = '#' + this.sample.id;

            var items = this.sample.Images;
            var group = 0;
            var images = [];
            for (let i = 0; i < items.length; i++) {
              if (i > 0 && i % 4 === 0) group++;
              if (!Array.isArray(images[group])) images[group] = [];
              images[group].push(items[i]);
            }
            this.images = images;
            setTimeout(function () {
              Array.from(document.querySelectorAll('.notes a')).forEach(
                function (elem) {
                  elem.setAttribute('target', '_blank');
                }
              );
            }, 250);
          });
        });
    });
  }
}
