<template>
  <div class="relative h-screen">
    <GeoErrorModel
      v-if="geoError"
      @closeGeoError="closeGeoError"
      :geoErrorMsg="geoErrorMsg"
    />
    <MapFeatures
      @getGeolocation="getGeolocation"
      @plotResult="plotResult"
      @toggleSearchResults="toggleSearchResults"
      @removeResult="removeResult"
      :coords="coords"
      :fetchCoords="fetchCoords"
      :searchResults="searchResults"
    />
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
import leaflet from "leaflet";
import { onMounted, ref } from "vue";
import GeoErrorModel from "@/components/GeoErrorModel.vue";
import MapFeatures from "@/components/MapFeatures.vue";
export default {
  name: "HomeView",
  components: { GeoErrorModel, MapFeatures },
  setup() {
    let map;

    onMounted(() => {
      map = leaflet
        .map("map", { zoomControl: false, markerZoomAnimation: false })
        .setView([-23.079797902304385, -47.21396312836137], 10);

      leaflet
        .tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_MAPBOX_API_KEY}`,
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.VUE_APP_MAPBOX_API_KEY,
          }
        )
        .addTo(map);

      map.on("moveend", () => {
        closeSearchResults();
      });

      getGeolocation();
    });

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);
    const resultMarker = ref(null);
    const searchResults = ref(false);

    const getGeolocation = () => {
      if (coords.value) {
        coords.value = null;
        sessionStorage.removeItem("coords");
        map.removeLayer(geoMarker.value);
        return;
      }

      if (sessionStorage.getItem("coords")) {
        coords.value = JSON.parse(sessionStorage.getItem("coords"));
        plotGeolocation(coords.value);
        return;
      }

      fetchCoords.value = true;
      navigator.geolocation.getCurrentPosition(setCoords, getLocError);
    };

    const setCoords = (pos) => {
      fetchCoords.value = null;

      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      coords.value = setSessionCoords;

      plotGeolocation(coords.value);
    };

    const getLocError = (error) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    const plotGeolocation = (geoCoords) => {
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/images/map-marker-red.svg"),
        iconSize: [35, 35],
      });

      geoMarker.value = leaflet
        .marker([geoCoords.lat, geoCoords.lng], {
          icon: customMarker,
        })
        .addTo(map);

      map.setView([geoCoords.lat, geoCoords.lng], 10);
    };

    const closeGeoError = () => {
      geoError.value = null;
      geoErrorMsg.value = null;
    };

    const plotResult = (geoCoords) => {
      if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
      }

      const customMarker = leaflet.icon({
        iconUrl: require("../assets/images/map-marker-blue.svg"),
        iconSize: [35, 35],
      });

      resultMarker.value = leaflet
        .marker([geoCoords.coordinates[1], geoCoords.coordinates[0]], {
          icon: customMarker,
        })
        .addTo(map);

      map.setView([geoCoords.coordinates[1], geoCoords.coordinates[0]], 14);

      closeSearchResults();
    };

    const toggleSearchResults = () => {
      searchResults.value = !searchResults.value;
    };

    const closeSearchResults = () => {
      searchResults.value = false;
    };

    const removeResult = () => {
      map.removeLayer(resultMarker.value);
    };

    return {
      coords,
      fetchCoords,
      getGeolocation,
      closeGeoError,
      geoError,
      geoErrorMsg,
      plotResult,
      searchResults,
      toggleSearchResults,
      closeSearchResults,
      removeResult,
    };
  },
};
</script>
