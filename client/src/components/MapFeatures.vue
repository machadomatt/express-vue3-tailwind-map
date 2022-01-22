<template>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[40px] z-[2] flex gap-4 px-6 py-8 md:p-0 bg-transparent"
  >
    <div class="relative flex-1 md:min-w-[350px]">
      <input
        type="text"
        class="w-full py-3 pr-4 text-sm rounded-md shadow-md pl-9 focus:outline-none"
        placeholder="Start your search"
        v-model="searchText"
        @input="search"
        @focus="$emit('toggleSearchResults')"
      />
      <div class="absolute top-0 left-[8px] h-full flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          class="w-5 h-5 text-slate-600"
          role="img"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
          />
        </svg>
      </div>
      <div class="absolute w-full mt-2">
        <div
          class="h-[200px] overflow-y-scroll bg-white rounded-md scrollbar-hidden shadow-md"
          v-if="searchText && searchResults"
        >
          <LoadingSpinner v-if="!searchData" />
          <div
            v-else
            class="flex items-center px-4 py-2 transition-colors duration-200 cursor-pointer gap-x-2 group hover:bg-slate-600 hover:text-white"
            v-for="(result, index) in searchData"
            :key="index"
            @click="selectResult(result)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              class="w-5 h-5 transition-colors duration-200 text-slate-600 group-hover:text-white"
              role="img"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
              />
            </svg>
            <p class="text-xs">{{ result.place_name_en }}</p>
          </div>
        </div>
        <div v-if="selectedResult" class="px-4 py-3 mt-2 bg-white rounded-md">
          <svg
            @click="removeResult"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            class="flex justify-end w-4 h-4 text-slate-600"
            role="img"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"
            />
          </svg>
          <h1 class="text-lg">{{ selectedResult.text }}</h1>
          <p class="mb-1 text-xs">
            {{ selectedResult.properties.address }}, {{ selectedResult.city }},
            {{ selectedResult.state }}
          </p>
          <p class="text-xs">{{ selectedResult.properties.category }}</p>
        </div>
      </div>
    </div>
    <div
      class="px-4 flex items-center shadow-md rounded-md min-h-[45px]"
      :class="[coords ? 'bg-slate-600' : 'bg-white']"
      @click="$emit('getGeolocation')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        class="w-5 h-5"
        :class="[
          coords ? 'text-white' : 'text-slate-600',
          fetchCoords ? 'animate-pulse' : '',
        ]"
        role="img"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  props: {
    coords: Object,
    fetchCoords: Boolean,
    searchResults: Boolean,
  },
  components: {
    LoadingSpinner,
  },
  setup(props, { emit }) {
    const searchText = ref(null);
    const searchData = ref(null);
    const searchTimeout = ref(null);
    const selectedResult = ref(null);

    const search = () => {
      clearTimeout(searchTimeout.value);

      searchData.value = null;

      searchTimeout.value = setTimeout(async () => {
        if (String(searchText.value).trim() !== "") {
          const params = new URLSearchParams({
            fuzzyMatch: true,
            language: "en",
            limit: 10,
            proximity: props.coords
              ? `${props.coords.lng},${props.coords.lat}`
              : "0,0",
          });
          const getData = await axios.get(
            `api/search/${searchText.value}?${params}`
          );
          searchData.value = getData.data.features;
        }
      }, 750);
    };

    const selectResult = (result) => {
      selectedResult.value = result;
      emit("plotResult", result.geometry);
    };

    const removeResult = () => {
      selectedResult.value = null;
      emit("removeResult");
    };

    return {
      searchText,
      searchData,
      searchTimeout,
      selectedResult,
      search,
      selectResult,
      removeResult,
    };
  },
};
</script>
