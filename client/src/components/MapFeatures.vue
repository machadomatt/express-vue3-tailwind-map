<template>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:p-0 bg-transparent"
  >
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
export default {
  props: {
    coords: Object,
    fetchCoords: Boolean,
  },
};
</script>
